import {
  FormLayout,
  WizardShell,
  Label,
  FieldInput,
  FieldTextarea,
  FieldSelect,
  FieldRadio,
  FieldCheckbox,
  PrimaryButton,
  SecondaryButton,
  ErrorBox,
  SuccessBox,
  AnimatedCtaButton,
} from "../layouts/FormLayout";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { getSession, getToken } from "../services/auth";
import {
  validateField,
  validateAllFields,
  hasValidationErrors,
} from "../services/validation";

function normalizeValue(fieldType, currentValue) {
  if (fieldType === "checkbox")
    return Array.isArray(currentValue) ? currentValue : [];
  return typeof currentValue === "string" ? currentValue : "";
}

export default function Form() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formMeta, setFormMeta] = useState(null);
  const [sections, setSections] = useState([]);
  const [answers, setAnswers] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [stepIndex, setStepIndex] = useState(0);
  const [reviewMode, setReviewMode] = useState(false);
  const [submittedApplicationId, setSubmittedApplicationId] = useState(null);
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [declarationError, setDeclarationError] = useState("");
  const [declarationConfirmed, setDeclarationConfirmed] = useState(false);
  /** ----------------------------- AUTOSAVE ANSWERS ----------------------------- */
  useEffect(() => {
    if (!formMeta?.formId) return;
    const key = `form-draft-${formMeta.formId}`;
    localStorage.setItem(key, JSON.stringify(answers));
  }, [answers, formMeta]);

  /** ----------------------------- LOAD FORM SCHEMA ---------------------------- */
  useEffect(() => {
    const loadForm = async () => {
      try {
        setLoading(true);
        setError("");

        const token = getToken();
        if (!token) {
          setError("Missing auth token. Please log in again.");
          return;
        }

        const authHeaders = { Authorization: `Bearer ${token}` };

        const formsRes = await axios.get("http://localhost:3000/forms", {
          headers: authHeaders,
        });

        const firstForm = formsRes.data?.[0];
        if (!firstForm) {
          setError("No forms available. Seed the backend first.");
          return;
        }

        const schemaRes = await axios.get(
          `http://localhost:3000/forms/${firstForm.formId}`,
          { headers: authHeaders },
        );

        const sortedSections = [...(schemaRes.data?.sections ?? [])].sort(
          (a, b) => Number(a.order ?? 0) - Number(b.order ?? 0),
        );

        const sectionsWithSortedQuestions = sortedSections.map((section) => ({
          ...section,
          questions: [...(section.questions ?? [])].sort(
            (a, b) => Number(a.order ?? 0) - Number(b.order ?? 0),
          ),
        }));

        setFormMeta(schemaRes.data?.form ?? firstForm);
        setSections(sectionsWithSortedQuestions);

        // Restore saved draft answers
        const key = `form-draft-${firstForm.formId}`;
        const savedDraft = localStorage.getItem(key);
        if (savedDraft) {
          try {
            setAnswers(JSON.parse(savedDraft));
          } catch {
            console.warn("Failed to parse saved draft");
          }
        }
      } catch (err) {
        const message =
          err?.response?.data?.error || err?.message || "Failed to load form.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadForm();
  }, []);

  /** ------------------------------- DERIVED UI ------------------------------- */
  const currentSection = sections[stepIndex] ?? null;
  const isFirst = stepIndex === 0;
  const isLast = sections.length > 0 && stepIndex === sections.length - 1;
  const isDeclarationStep = (currentSection?.title ?? "")
    .toLowerCase()
    .includes("declaration");
  const lockDeclarationFields = isDeclarationStep && !declarationConfirmed;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [stepIndex, reviewMode]);

  const progressLabel = useMemo(() => {
    if (!sections.length) return "";
    return `Step ${stepIndex + 1} of ${sections.length} — ${currentSection?.title ?? ""}`;
  }, [sections.length, stepIndex, currentSection?.title]);

  // % complete for the header (0 on first, 100 on last)
  const percent = useMemo(() => {
    if (!sections.length) return 0;
    const denom = Math.max(sections.length - 1, 1);
    return Math.round((stepIndex / denom) * 100);
  }, [sections.length, stepIndex]);

  const allQuestions = useMemo(
    () => sections.flatMap((section) => section.questions ?? []),
    [sections],
  );

  /** ----------------------------- FIELD HANDLERS ----------------------------- */
  // Live validation on change
  const setFieldValue = (question, value) => {
    setAnswers((prev) => ({
      ...prev,
      [question.questionId]: value,
    }));

    const error = validateField(question, value);
    setFieldErrors((prev) => ({
      ...prev,
      [question.questionId]: error,
    }));
  };

  // Validate on blur
  const handleBlur = (question) => {
    const value = answers[question.questionId];
    const error = validateField(question, value);
    setFieldErrors((prev) => ({
      ...prev,
      [question.questionId]: error,
    }));
  };

  const toggleCheckboxValue = (question, optionText, checked) => {
    const current = normalizeValue(
      question.fieldType,
      answers[question.questionId],
    );
    const next = checked
      ? [...new Set([...current, optionText])]
      : current.filter((item) => item !== optionText);
    setFieldValue(question, next);
  };

  /** ------------------------- NAVIGATION: NEXT (validate) -------------------- */
  const handleNext = () => {
    if (!currentSection) return;
    const sectionErrors = validateAllFields(currentSection.questions, answers);
    if (hasValidationErrors(sectionErrors)) {
      setFieldErrors(sectionErrors);
      requestAnimationFrame(() => scrollToFirstInvalidQuestion(sectionErrors));
      return;
    }
    setStepIndex((prev) => Math.min(prev + 1, sections.length - 1));
  };

  const scrollToFirstInvalidQuestion = (errors) => {
    if (!currentSection?.questions?.length) return;

    const firstInvalid = currentSection.questions.find(
      (q) => errors[q.questionId],
    );
    if (!firstInvalid) return;

    const container = document.getElementById(
      "question-" + firstInvalid.questionId,
    );
    if (!container) return;

    container.scrollIntoView({ behavior: "smooth", block: "center" });

    const focusTarget = container.querySelector(
      "input, textarea, select, button",
    );
    if (focusTarget && typeof focusTarget.focus === "function") {
      focusTarget.focus({ preventScroll: true });
    }
  };

  const scrollToFirstInvalidInSection = (section, errors) => {
    const firstInvalid = (section?.questions ?? []).find(
      (q) => errors[q.questionId],
    );
    if (!firstInvalid) return;

    const container = document.getElementById(
      "question-" + firstInvalid.questionId,
    );
    if (!container) return;

    container.scrollIntoView({ behavior: "smooth", block: "center" });

    const focusTarget = container.querySelector(
      "input, textarea, select, button",
    );
    if (focusTarget && typeof focusTarget.focus === "function") {
      focusTarget.focus({ preventScroll: true });
    }
  };

  /** ------------------------- RENDER A SINGLE QUESTION ----------------------- */
  const renderQuestion = (question) => {
    const value = normalizeValue(
      question.fieldType,
      answers[question.questionId],
    );
    const error = fieldErrors[question.questionId];

    const renderWithError = (component) => (
      <div>
        {component}
        {error && (
          <p className="text-red-600 text-sm mt-1 font-medium">{error}</p>
        )}
      </div>
    );

    if (question.fieldType === "textarea") {
      return renderWithError(
        <FieldTextarea
          id={`q-${question.questionId}`}
          value={value}
          required={question.isRequired}
          onChange={(e) => setFieldValue(question, e.target.value)}
          onBlur={() => handleBlur(question)}
          placeholder="Type your response..."
          className={error ? "border-2 border-red-500" : ""}
        />,
      );
    }

    if (question.fieldType === "radio") {
      return renderWithError(
        <div className="space-y-2">
          {(question.options ?? []).map((option) => (
            <label
              key={option.optionId}
              className="flex items-center gap-2 text-sm"
            >
              <FieldRadio
                name={`q-${question.questionId}`}
                value={option.optionText}
                checked={value === option.optionText}
                onChange={(e) => setFieldValue(question, e.target.value)}
              />
              <span>{option.optionText}</span>
            </label>
          ))}
        </div>,
      );
    }

    if (question.fieldType === "checkbox") {
      return renderWithError(
        <div className="space-y-2">
          {(question.options ?? []).map((option) => (
            <div key={option.optionId} className="flex flex-col gap-1">
              <label className="flex items-center gap-2 text-sm">
                <FieldCheckbox
                  value={option.optionText}
                  checked={value.includes(option.optionText)}
                  onChange={(e) =>
                    toggleCheckboxValue(
                      question,
                      option.optionText,
                      e.target.checked,
                    )
                  }
                />
                <span>{option.optionText}</span>
              </label>

              {/* "Other" free text when selected */}
              {option.optionText === "Other" && value.includes("Other") && (
                <FieldInput
                  type="text"
                  placeholder="Please specify"
                  className="ml-6"
                  value={answers[`other-${question.questionId}`] || ""}
                  onChange={(e) =>
                    setAnswers((prev) => ({
                      ...prev,
                      [`other-${question.questionId}`]: e.target.value,
                    }))
                  }
                />
              )}
            </div>
          ))}
        </div>,
      );
    }

    if (question.fieldType === "dropdown") {
      return renderWithError(
        <FieldSelect
          id={`q-${question.questionId}`}
          value={value}
          required={question.isRequired}
          onChange={(e) => setFieldValue(question, e.target.value)}
          onBlur={() => handleBlur(question)}
          className={error ? "border-2 border-red-500" : ""}
        >
          <option value="">Select an option</option>
          {(question.options ?? []).map((option) => (
            <option key={option.optionId} value={option.optionText}>
              {option.optionText}
            </option>
          ))}
        </FieldSelect>,
      );
    }

    if (question.fieldType === "date") {
      return renderWithError(
        <FieldInput
          id={`q-${question.questionId}`}
          type="date"
          value={value}
          required={question.isRequired}
          onChange={(e) => setFieldValue(question, e.target.value)}
          onBlur={() => handleBlur(question)}
          className={error ? "border-2 border-red-500" : ""}
        />,
      );
    }

    if (question.fieldType === "file") {
      const uploadedFile = answers[question.questionId];
      return renderWithError(
        <div>
          <FieldInput
            id={`q-${question.questionId}`}
            type="file"
            required={question.isRequired}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                const formData = new FormData();
                formData.append("file", file);
                const token = getToken();
                const res = await fetch("http://localhost:3000/upload", {
                  method: "POST",
                  headers: { Authorization: `Bearer ${token}` },
                  body: formData,
                });
                const data = await res.json();
                if (data.filePath) {
                  setFieldValue(
                    question,
                    data.filePath.replace("/uploads/", ""),
                  );
                }
              }
            }}
            onBlur={() => handleBlur(question)}
            className={error ? "border-2 border-red-500" : ""}
          />
          {uploadedFile && (
            <div style={{ marginTop: 8 }}>
              <span style={{ color: "#007bff", fontWeight: "bold" }}>
                Uploaded: {uploadedFile}
              </span>
            </div>
          )}
        </div>,
      );
    }

    // Repeatable text inputs
    if (question.repeatable) {
      const values = Array.isArray(answers[question.questionId])
        ? answers[question.questionId]
        : [""];

      const addField = () => {
        if (values.length < (question.maxRepeats || 3)) {
          setAnswers((prev) => ({
            ...prev,
            [question.questionId]: [...values, ""],
          }));
        }
      };

      const updateValue = (index, val) => {
        const next = [...values];
        next[index] = val;
        setAnswers((prev) => ({
          ...prev,
          [question.questionId]: next,
        }));
      };

      return (
        <div className="space-y-2">
          {values.map((v, i) => (
            <FieldInput
              key={i}
              value={v}
              placeholder={`Entry ${i + 1}`}
              onChange={(e) => updateValue(i, e.target.value)}
            />
          ))}
          {values.length < (question.maxRepeats || 3) && (
            <SecondaryButton type="button" onClick={addField}>
              Add another
            </SecondaryButton>
          )}
        </div>
      );
    }

    // default text input
    return renderWithError(
      <FieldInput
        id={`q-${question.questionId}`}
        type="text"
        value={value}
        required={question.isRequired}
        onChange={(e) => setFieldValue(question, e.target.value)}
        onBlur={() => handleBlur(question)}
        placeholder="Enter text"
        className={error ? "border-2 border-red-500" : ""}
      />,
    );
  };

  /** ------------------------------- SUBMIT ----------------------------------- */
  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError("");
      setSubmitMessage("");

      // Frontend validation
      const errors = validateAllFields(allQuestions, answers);
      if (hasValidationErrors(errors)) {
        setFieldErrors(errors);
        setError("Please fix validation errors before submitting.");
        setSubmitting(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const token = getToken();
      const session = getSession();
      const userId = session?.userId || sessionStorage.getItem("userId");
      const formId = formMeta?.formId;

      if (!token) throw new Error("Missing auth token. Please log in again.");
      if (!userId)
        throw new Error("User session not found. Please log in again.");
      if (!formId) throw new Error("Form not found.");

      const authHeaders = { Authorization: `Bearer ${token}` };

      const startRes = await axios.post(
        "http://localhost:3000/applications/start",
        { userId, formId },
        { headers: authHeaders },
      );

      const applicationId = startRes.data?.applicationId;
      if (!applicationId) throw new Error("Failed to start application.");

      const answerRows = allQuestions
        .map((question) => {
          let raw = answers[question.questionId];

          // Expand "Other" selection with typed text, if provided
          if (Array.isArray(raw) && raw.includes("Other")) {
            const otherText = answers[`other-${question.questionId}`];
            if (otherText) {
              raw = [
                ...raw.filter((v) => v !== "Other"),
                `Other: ${otherText}`,
              ];
            }
          }

          if (raw === undefined || raw === null) return null;
          if (Array.isArray(raw) && raw.length === 0) return null;
          if (typeof raw === "string" && raw.trim() === "") return null;

          return {
            questionId: question.questionId,
            answer: Array.isArray(raw) ? JSON.stringify(raw) : String(raw),
          };
        })
        .filter(Boolean);

      if (answerRows.length > 0) {
        // Save answers; catch backend validation errors
        try {
          await axios.post(
            `http://localhost:3000/applications/${applicationId}/answers`,
            { answers: answerRows },
            { headers: authHeaders },
          );
        } catch (answerErr) {
          if (
            answerErr.response?.status === 400 &&
            answerErr.response?.data?.details
          ) {
            const backendErrors = answerErr.response.data.details;
            const fieldErrorsMap = {};
            backendErrors.forEach((err) => {
              fieldErrorsMap[err.questionId] = err.error;
            });
            setFieldErrors(fieldErrorsMap);
          }
          throw new Error(
            answerErr.response?.data?.error || "Failed to save answers",
          );
        }
      }

      // Submit application; catch backend validation errors
      let submittedId;
      try {
        const submitRes = await axios.post(
          `http://localhost:3000/applications/${applicationId}/submit`,
          {},
          { headers: authHeaders },
        );

        submittedId = submitRes.data?.applicationId;
      } catch (submitErr) {
        if (
          submitErr.response?.status === 400 &&
          submitErr.response?.data?.details
        ) {
          const backendErrors = submitErr.response.data.details;
          const fieldErrorsMap = {};
          backendErrors.forEach((err) => {
            fieldErrorsMap[err.questionId] = err.error;
          });
          setFieldErrors(fieldErrorsMap);
        }
        throw new Error(
          submitErr.response?.data?.error || "Failed to submit application",
        );
      }

      setSubmitMessage("Application submitted successfully.");
      setSubmittedApplicationId(submittedId);
      setSubmitted(true);

      // Clear draft after submit
      const key = `form-draft-${formMeta.formId}`;
      localStorage.removeItem(key);
    } catch (err) {
      const message =
        err?.response?.data?.error ||
        err?.message ||
        "Failed to submit application.";
      setError(message);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  };

  /** ----------------------- BUBBLE CLICK: BACK ONLY -------------------------- */
  const handleStepBubbleClick = (index) => {
    if (index < 0 || index >= sections.length) return;

    if (index > stepIndex) {
      for (let i = stepIndex; i < index; i += 1) {
        const section = sections[i];
        const errs = validateAllFields(section?.questions ?? [], answers);

        if (hasValidationErrors(errs)) {
          setFieldErrors((prev) => ({ ...prev, ...errs }));
          setStepIndex(i);
          requestAnimationFrame(() =>
            scrollToFirstInvalidInSection(section, errs),
          );
          return;
        }
      }
    }

    setStepIndex(index);
  };
  /** --------------------------------- RENDER --------------------------------- */
  if (loading) {
    return (
      <FormLayout>
        <WizardShell
          title="Loading…"
          subtitle=""
          sections={[]}
          currentIndex={0}
          percent={0}
        >
          <div>Loading form…</div>
        </WizardShell>
      </FormLayout>
    );
  }

  if (error && !submitMessage) {
    return (
      <FormLayout>
        <WizardShell
          title="Error"
          subtitle=""
          sections={[]}
          currentIndex={0}
          percent={0}
        >
          <ErrorBox>{error}</ErrorBox>
        </WizardShell>
      </FormLayout>
    );
  }
  if (submitted) {
    return (
      <FormLayout>
        <WizardShell
          title="Thank You!"
          subtitle="Your application has been submitted"
          sections={[]}
          currentIndex={0}
          percent={100}
        >
          <SuccessBox>Your form has been submitted successfully.</SuccessBox>

          <div className="mt-6 text-lg">
            <strong>Application ID:</strong> {submittedApplicationId}
          </div>
        </WizardShell>
      </FormLayout>
    );
  }
  return (
    <FormLayout>
      <WizardShell
        title={formMeta?.title}
        subtitle={progressLabel}
        percent={percent}
        sections={sections.map((s) => s.title || "")}
        currentIndex={stepIndex}
        onStepClick={reviewMode ? undefined : handleStepBubbleClick}
      >
        {error && !submitMessage && (
          <div className="mb-6">
            <ErrorBox>{error}</ErrorBox>
          </div>
        )}

        {reviewMode ? (
          <h3 className="text-lg font-semibold mb-5 text-slate-900">
            Review Answers
          </h3>
        ) : currentSection?.title ? (
          <h3 className="text-lg font-semibold mb-5 text-slate-900">
            {currentSection.title}
          </h3>
        ) : null}

        {isDeclarationStep && !reviewMode ? (
          <div className="mb-6 overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm">
            <div className="bg-yellow-400 px-4 py-3">
              <h4 className="text-lg font-semibold text-white">
                Declaration / Undertaking
              </h4>
            </div>

            <div className="px-4 py-4">
              <div className="max-h-[33vh] space-y-3 overflow-y-auto whitespace-normal break-words rounded-md border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-800">
                <p>
                  It is hereby declared that the information furnished in this
                  application form is true and correct to the best of its
                  knowledge and that no material particulars or information have
                  been concealed or withheld, and that I hereby undertake:
                </p>
                <ol className="ml-5 list-decimal space-y-2">
                  <li>
                    to abide by the provisions of the Aadhaar Act and
                    regulations made thereunder;
                  </li>
                  <li>
                    to facilitate UIDAI audit and submit compliance documents
                    before signing AUA/KUA agreement;
                  </li>
                  <li>
                    to fulfil all requirements for Aadhaar Authentication usage;
                  </li>
                  <li>
                    to maintain required infrastructure in India for
                    authentication usage;
                  </li>
                  <li>
                    to perform due diligence before engaging sub-contractors and
                    field operators;
                  </li>
                  <li>
                    to store Aadhaar numbers only in Aadhaar Data Vault where
                    authorized;
                  </li>
                  <li>
                    to ensure audits of own systems and of Sub-AUA/Sub-KUA
                    systems where applicable;
                  </li>
                  <li>
                    not to disclose e-KYC data except as permitted under law;
                  </li>
                  <li>
                    to inform UIDAI of changes in name, address, and contact
                    particulars.
                  </li>
                </ol>
              </div>

              <label className="mt-4 flex items-start gap-2 text-sm text-slate-900">
                <input
                  type="checkbox"
                  className="mt-0.5"
                  checked={declarationAccepted}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setDeclarationAccepted(checked);
                    setDeclarationConfirmed(checked);
                    setDeclarationError(
                      checked
                        ? ""
                        : "Please read and accept the declaration to continue.",
                    );
                  }}
                />
                <span>I have read and accept the declaration.</span>
              </label>

              {declarationError ? (
                <p className="mt-2 text-sm font-medium text-red-600">
                  {declarationError}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        {reviewMode ? (
          <div className="space-y-4">
            {allQuestions.map((q) => {
              const value = answers[q.questionId];

              return (
                <div key={q.questionId} className="border-b pb-3">
                  <Label>{q.questionText}</Label>
                  <div className="text-gray-700">
                    {q.fieldType === "file" && value ? (
                      <a
                        href={`http://localhost:3000/uploads/${value}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View uploaded file
                      </a>
                    ) : Array.isArray(value) ? (
                      value.join(", ")
                    ) : (
                      value || "—"
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {(currentSection?.questions ?? []).map((question) => (
              <fieldset
                key={question.questionId}
                id={"question-" + question.questionId}
                disabled={lockDeclarationFields}
                className={
                  lockDeclarationFields
                    ? "scroll-mt-24 opacity-60"
                    : "scroll-mt-24"
                }
              >
                <Label>
                  {question.questionText}
                  {question.isRequired ? (
                    <span className="text-red-600"> *</span>
                  ) : null}
                </Label>
                {renderQuestion(question)}
              </fieldset>
            ))}
          </div>
        )}

        {submitMessage ? (
          <div className="mt-5">
            <SuccessBox>{submitMessage}</SuccessBox>
          </div>
        ) : null}

        <div className="mt-6 flex items-center justify-between">
          <SecondaryButton
            type="button"
            onClick={() => {
              if (reviewMode) {
                setReviewMode(false);
              } else if (!isFirst) {
                setStepIndex((prev) => prev - 1);
              }
            }}
            disabled={isFirst || submitting}
          >
            Back
          </SecondaryButton>

          {!isLast ? (
            <PrimaryButton
              type="button"
              onClick={handleNext}
              disabled={submitting}
            >
              Next
            </PrimaryButton>
          ) : !reviewMode ? (
            <div className="flex items-center gap-3">
              {isDeclarationStep && !declarationConfirmed ? (
                <span className="text-sm font-medium text-red-600">
                  Please accept the declaration above to continue.
                </span>
              ) : null}
              <PrimaryButton
                type="button"
                onClick={() => setReviewMode(true)}
                disabled={isDeclarationStep && !declarationConfirmed}
              >
                Review Answers
              </PrimaryButton>
            </div>
          ) : (
            <AnimatedCtaButton
              type="button"
              onClick={handleSubmit}
              disabled={submitting || submitted}
            >
              {submitted
                ? "Submitted"
                : submitting
                  ? "Submitting..."
                  : "Submit Application"}
            </AnimatedCtaButton>
          )}
        </div>
      </WizardShell>
    </FormLayout>
  );
}
