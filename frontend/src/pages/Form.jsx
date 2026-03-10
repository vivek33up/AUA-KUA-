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
import { validateField, validateAllFields, hasValidationErrors } from "../services/validation";

function normalizeValue(fieldType, currentValue) {
  if (fieldType === "checkbox") return Array.isArray(currentValue) ? currentValue : [];
  return typeof currentValue === "string" ? currentValue : "";
}

export default function Form() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const[submitted,setSubmitted]=useState(false);
  const [formMeta, setFormMeta] = useState(null);
  const [sections, setSections] = useState([]);
  const [answers, setAnswers] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [stepIndex, setStepIndex] = useState(0);
  ///AUTOSAVE ASNWERS
  useEffect(() => {
  if (!formMeta?.formId) return;

  const key = `form-draft-${formMeta.formId}`;
  localStorage.setItem(key, JSON.stringify(answers));
}, [answers, formMeta]);

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

  const currentSection = sections[stepIndex] ?? null;
  const isFirst = stepIndex === 0;
  const isLast = sections.length > 0 && stepIndex === sections.length - 1;

  const progressLabel = useMemo(() => {
    if (!sections.length) return "";
    return `Step ${stepIndex + 1} of ${sections.length} — ${currentSection?.title ?? ""}`;
  }, [sections.length, stepIndex, currentSection?.title]);

  const percent = useMemo(() => {
    if (!sections.length) return 0;
    const denom = Math.max(sections.length - 1, 1);
    return Math.round((stepIndex / denom) * 100);
  }, [sections.length, stepIndex]);

  const allQuestions = useMemo(
    () => sections.flatMap((section) => section.questions ?? []),
    [sections]
  );

  // ✅ UPDATED: Validate on change (live validation)
  const setFieldValue = (question, value) => {
    setAnswers((prev) => ({
      ...prev,
      [question.questionId]: value,
    }));

    // Validate immediately as user types
    const error = validateField(question, value);
    setFieldErrors((prev) => ({
      ...prev,
      [question.questionId]: error,
    }));
  };

  // ✅ Optional: Validate on blur (when user leaves field)
  const handleBlur = (question) => {
    const value = answers[question.questionId];
    const error = validateField(question, value);
    setFieldErrors((prev) => ({
      ...prev,
      [question.questionId]: error,
    }));
  };

  const toggleCheckboxValue = (question, optionText, checked) => {

  const current = normalizeValue(question.fieldType, answers[question.questionId]);

  const next = checked

    ? [...new Set([...current, optionText])]

    : current.filter((item) => item !== optionText);

  setFieldValue(question, next);

};
  ///HANDLER FOR NEXT BUTTON 
  const handleNext = () => {

  if (!currentSection) return;

  const sectionErrors = validateAllFields(currentSection.questions, answers);

  if (hasValidationErrors(sectionErrors)) {

    setFieldErrors(sectionErrors);

    return;

  }

  setStepIndex((prev) => prev + 1);

};
  const renderQuestion = (question) => {
    const value = normalizeValue(question.fieldType, answers[question.questionId]);
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
        />
      );
    }

    if (question.fieldType === "radio") {
      return renderWithError(
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
      return renderWithError(
        <div className="space-y-2">
          {(question.options ?? []).map((option) => (

  <div key={option.optionId} className="flex flex-col gap-1">

    <label className="flex items-center gap-2 text-sm">

      <FieldCheckbox

        value={option.optionText}

        checked={value.includes(option.optionText)}

        onChange={(e) =>

          toggleCheckboxValue(question, option.optionText, e.target.checked)

        }

      />

      <span>{option.optionText}</span>

    </label>

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
        </div>
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
        </FieldSelect>
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
        />
      );
    }

    if (question.fieldType === "file") {
      return renderWithError(
        <FieldInput
          id={`q-${question.questionId}`}
          type="file"
          required={question.isRequired}
          onChange={(e) => {

  const file = e.target.files?.[0];

  if (file) setFieldValue(question, file.name);

}}
          onBlur={() => handleBlur(question)}
          className={error ? "border-2 border-red-500" : ""}
        />
      );
    }
    //.add repeatable------------------------------------------------
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
      />
    );
  };

  // In handleSubmit, update error handling:

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
        let raw=answers[question.questionId]
        if(Array.isArray(raw)&& raw.includes("Other")){
          const otherText=answers[`other-${question.questionId}`];
          if(otherText){
            raw=[...raw.filter(v=>v!=="Other"), `Other: ${otherText}`];
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
      // ✅ Handle backend validation errors
      try {
        await axios.post(
          `http://localhost:3000/applications/${applicationId}/answers`,
          { answers: answerRows },
          { headers: authHeaders }
        );
      } catch (answerErr) {
        // Backend validation failed
        if (answerErr.response?.status === 400 && answerErr.response?.data?.details) {
          const backendErrors = answerErr.response.data.details;
          const fieldErrorsMap = {};
          backendErrors.forEach((err) => {
            fieldErrorsMap[err.questionId] = err.error;
          });
          setFieldErrors(fieldErrorsMap);
        }
        throw new Error(
          answerErr.response?.data?.error || "Failed to save answers"
        );
      }
    }

    // ✅ Handle backend validation on submit
    try {
      await axios.post(
        `http://localhost:3000/applications/${applicationId}/submit`,
        {},
        { headers: authHeaders }
      );
    } catch (submitErr) {
      if (submitErr.response?.status === 400 && submitErr.response?.data?.details) {
        const backendErrors = submitErr.response.data.details;
        const fieldErrorsMap = {};
        backendErrors.forEach((err) => {
          fieldErrorsMap[err.questionId] = err.error;
        });
        setFieldErrors(fieldErrorsMap);
      }
      throw new Error(
        submitErr.response?.data?.error || "Failed to submit application"
      );
    }

    setSubmitMessage("Application submitted successfully.");
    setSubmitted(true);
    //clear draft after submit
    const key = `form-draft-${formMeta.formId}`;
    localStorage.removeItem(key);   
  } catch (err) {
    const message =
      err?.response?.data?.error || err?.message || "Failed to submit application.";
    setError(message);
    window.scrollTo({ top: 0, behavior: "smooth" });
  } finally {
    setSubmitting(false);
  }
};

  if (loading) {
    return (
      <FormLayout>
        <WizardShell title="Loading…" subtitle="" sections={[]} currentIndex={0} percent={0}>
          <div>Loading form…</div>
        </WizardShell>
      </FormLayout>
    );
  }

  if (error && !submitMessage) {
    return (
      <FormLayout>
        <WizardShell title="Error" subtitle="" sections={[]} currentIndex={0} percent={0}>
          <ErrorBox>{error}</ErrorBox>
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
      >
        {error && !submitMessage && (
          <div className="mb-6">
            <ErrorBox>{error}</ErrorBox>
          </div>
        )}

        {currentSection?.title ? (
          <h3 className="text-lg font-semibold mb-5 text-slate-900">{currentSection.title}</h3>
        ) : null}

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

        {submitMessage ? (
          <div className="mt-5">
            <SuccessBox>{submitMessage}</SuccessBox>
          </div>
        ) : null}

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
              onClick={handleNext}
              disabled={submitting}
            >
              Next
            </PrimaryButton>
          ) : (
            <AnimatedCtaButton type="button" onClick={handleSubmit} disabled={submitting||submitted}>
              {submitted ? "Submitted" :submitting? "Submitting...":"Review & Submit"}
            </AnimatedCtaButton>
          )}
        </div>
      </WizardShell>
    </FormLayout>
  );
}