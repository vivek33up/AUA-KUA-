// src/pages/Form.jsx
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
} from "../layouts/FormLayout"; // If this file is under /pages/application, change to: "../../layouts/FormLayout"

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { getSession, getToken } from "../services/auth"; // If under /pages/application, change to: "../../services/auth"

function normalizeValue(fieldType, currentValue) {
  if (fieldType === "checkbox") return Array.isArray(currentValue) ? currentValue : [];
  return typeof currentValue === "string" ? currentValue : "";
}

export default function Form() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formMeta, setFormMeta] = useState(null);
  const [sections, setSections] = useState([]);
  const [answers, setAnswers] = useState({});
  const [stepIndex, setStepIndex] = useState(0);

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
          { headers: authHeaders }
        );

        const sortedSections = [...(schemaRes.data?.sections ?? [])].sort(
          (a, b) => Number(a.order ?? 0) - Number(b.order ?? 0)
        );

        const sectionsWithSortedQuestions = sortedSections.map((section) => ({
          ...section,
          questions: [...(section.questions ?? [])].sort(
            (a, b) => Number(a.order ?? 0) - Number(b.order ?? 0)
          ),
        }));

        setFormMeta(schemaRes.data?.form ?? firstForm);
        setSections(sectionsWithSortedQuestions);
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

  const currentSection = sections[stepIndex] ?? null;
  const isFirst = stepIndex === 0;
  const isLast = sections.length > 0 && stepIndex === sections.length - 1;

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
    [sections]
  );

  const setFieldValue = (question, value) => {
    setAnswers((prev) => ({
      ...prev,
      [question.questionId]: value,
    }));
  };

  const toggleCheckboxValue = (question, optionText, checked) => {
    const current = normalizeValue(question.fieldType, answers[question.questionId]);
    const next = checked
      ? [...new Set([...current, optionText])]
      : current.filter((item) => item !== optionText);

    setFieldValue(question, next);
  };

  // Render a single question using presentational components
  const renderQuestion = (question) => {
    const value = normalizeValue(question.fieldType, answers[question.questionId]);

    if (question.fieldType === "textarea") {
      return (
        <FieldTextarea
          id={`q-${question.questionId}`}
          value={value}
          required={question.isRequired}
          onChange={(e) => setFieldValue(question, e.target.value)}
          placeholder="Type your response..."
        />
      );
    }

    if (question.fieldType === "radio") {
      return (
        <div className="space-y-2">
          {(question.options ?? []).map((option) => (
            <label key={option.optionId} className="flex items-center gap-2 text-sm">
              <FieldRadio
                name={`q-${question.questionId}`}
                value={option.optionText}
                checked={value === option.optionText}
                onChange={(e) => setFieldValue(question, e.target.value)}
              />
              <span>{option.optionText}</span>
            </label>
          ))}
        </div>
      );
    }

    if (question.fieldType === "checkbox") {
      return (
        <div className="space-y-2">
          {(question.options ?? []).map((option) => (
            <label key={option.optionId} className="flex items-center gap-2 text-sm">
              <FieldCheckbox
                value={option.optionText}
                checked={value.includes(option.optionText)}
                onChange={(e) =>
                  toggleCheckboxValue(question, option.optionText, e.target.checked)
                }
              />
              <span>{option.optionText}</span>
            </label>
          ))}
        </div>
      );
    }

    if (question.fieldType === "dropdown") {
      return (
        <FieldSelect
          id={`q-${question.questionId}`}
          value={value}
          required={question.isRequired}
          onChange={(e) => setFieldValue(question, e.target.value)}
        >
          <option value="">Select an option</option>
          {(question.options ?? []).map((option) => (
            <option key={option.optionId} value={option.optionText}>
              {option.optionText}
            </option>
          ))}
        </FieldSelect>
      );
    }

    if (question.fieldType === "date") {
      return (
        <FieldInput
          id={`q-${question.questionId}`}
          type="date"
          value={value}
          required={question.isRequired}
          onChange={(e) => setFieldValue(question, e.target.value)}
        />
      );
    }

    if (question.fieldType === "file") {
      return (
        <FieldInput
          id={`q-${question.questionId}`}
          type="file"
          required={question.isRequired}
          onChange={(e) => setFieldValue(question, e.target.files?.[0]?.name ?? "")}
        />
      );
    }

    // default text input
    return (
      <FieldInput
        id={`q-${question.questionId}`}
        type="text"
        value={value}
        required={question.isRequired}
        onChange={(e) => setFieldValue(question, e.target.value)}
        placeholder="Enter text"
      />
    );
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError("");
      setSubmitMessage("");

      const token = getToken();
      const session = getSession();
      const userId = session?.userId || sessionStorage.getItem("userId");
      const formId = formMeta?.formId;

      if (!token) throw new Error("Missing auth token. Please log in again.");
      if (!userId) throw new Error("User session not found. Please log in again.");
      if (!formId) throw new Error("Form not found.");

      const authHeaders = { Authorization: `Bearer ${token}` };

      const startRes = await axios.post(
        "http://localhost:3000/applications/start",
        { userId, formId },
        { headers: authHeaders }
      );

      const applicationId = startRes.data?.applicationId;
      if (!applicationId) throw new Error("Failed to start application.");

      const answerRows = allQuestions
        .map((question) => {
          const raw = answers[question.questionId];
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
        await axios.post(
          `http://localhost:3000/applications/${applicationId}/answers`,
          { answers: answerRows },
          { headers: authHeaders }
        );
      }

      await axios.post(
        `http://localhost:3000/applications/${applicationId}/submit`,
        {},
        { headers: authHeaders }
      );

      setSubmitMessage("Application submitted successfully.");
    } catch (err) {
      const message =
        err?.response?.data?.error || err?.message || "Failed to submit application.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  /* ----------------------------- States UI ----------------------------- */
  if (loading) {
    return (
      <FormLayout>
        <WizardShell title="Loading…" subtitle="" sections={[]} currentIndex={0} percent={0}>
          <div>Loading form…</div>
        </WizardShell>
      </FormLayout>
    );
  }

  if (error) {
    return (
      <FormLayout>
        <WizardShell title="Error" subtitle="" sections={[]} currentIndex={0} percent={0}>
          <ErrorBox>{error}</ErrorBox>
        </WizardShell>
      </FormLayout>
    );
  }

  /* ------------------------------- Render ------------------------------ */
  return (
    <FormLayout>
      <WizardShell
        title={formMeta?.title}
        subtitle={progressLabel}
        percent={percent}
        sections={sections.map((s) => s.title || "")}
        currentIndex={stepIndex}
      >
        {/* Section title inside body */}
        {currentSection?.title ? (
          <h3 className="text-lg font-semibold mb-5 text-slate-900">{currentSection.title}</h3>
        ) : null}

        {/* Questions */}
        <div className="space-y-4">
          {(currentSection?.questions ?? []).map((question) => (
            <div key={question.questionId}>
              <Label>
                {question.questionText}
                {question.isRequired ? <span className="text-red-600"> *</span> : null}
              </Label>
              {renderQuestion(question)}
            </div>
          ))}
        </div>

        {/* Submit status */}
        {submitMessage ? (
          <div className="mt-5">
            <SuccessBox>{submitMessage}</SuccessBox>
          </div>
        ) : null}

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <SecondaryButton
            type="button"
            onClick={() => !isFirst && setStepIndex((prev) => prev - 1)}
            disabled={isFirst || submitting}
          >
            Back
          </SecondaryButton>

          {!isLast ? (
            <PrimaryButton
              type="button"
              onClick={() => setStepIndex((prev) => prev + 1)}
              disabled={submitting}
            >
              Next
            </PrimaryButton>
          ) : (
            <AnimatedCtaButton type="button" onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Submitting..." : "Review & Submit"}
            </AnimatedCtaButton>
          )}
        </div>
      </WizardShell>
    </FormLayout>
  );
}