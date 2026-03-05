import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { getToken } from "../services/auth";

function normalizeValue(fieldType, currentValue) {
  if (fieldType === "checkbox") {
    return Array.isArray(currentValue) ? currentValue : [];
  }
  return typeof currentValue === "string" ? currentValue : "";
}

export default function Form() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
    return `Section ${stepIndex + 1} of ${sections.length}: ${currentSection?.title ?? ""}`;
  }, [sections.length, stepIndex, currentSection?.title]);

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

  const renderQuestion = (question) => {
    const value = normalizeValue(question.fieldType, answers[question.questionId]);

    if (question.fieldType === "textarea") {
      return (
        <textarea
          id={`q-${question.questionId}`}
          className="w-full rounded-md border border-slate-300 px-3 py-2"
          value={value}
          required={question.isRequired}
          onChange={(e) => setFieldValue(question, e.target.value)}
        />
      );
    }

    if (question.fieldType === "radio") {
      return (
        <div className="space-y-2">
          {(question.options ?? []).map((option) => (
            <label key={option.optionId} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
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
              <input
                type="checkbox"
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
        <select
          id={`q-${question.questionId}`}
          className="w-full rounded-md border border-slate-300 px-3 py-2"
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
        </select>
      );
    }

    return (
      <input
        id={`q-${question.questionId}`}
        type="text"
        className="w-full rounded-md border border-slate-300 px-3 py-2"
        value={value}
        required={question.isRequired}
        onChange={(e) => setFieldValue(question, e.target.value)}
      />
    );
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-8 md:px-8">
        <div className="mx-auto w-full max-w-5xl rounded-lg bg-white p-6 shadow">
          Loading form...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-8 md:px-8">
        <div className="mx-auto w-full max-w-5xl rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 md:px-8">
      <div className="mx-auto mb-4 w-full max-w-5xl">
        <h1 className="text-xl font-semibold text-slate-900">{formMeta?.title}</h1>
        {formMeta?.description ? (
          <p className="mt-1 text-sm text-slate-600">{formMeta.description}</p>
        ) : null}
        <p className="mt-2 text-sm text-slate-600">{progressLabel}</p>
      </div>

      <section className="mx-auto w-full max-w-5xl rounded-lg bg-white p-6 shadow">
        <h2 className="mb-5 text-lg font-semibold text-slate-900">{currentSection?.title}</h2>

        <div className="space-y-4">
          {(currentSection?.questions ?? []).map((question) => (
            <div key={question.questionId}>
              <label htmlFor={`q-${question.questionId}`} className="mb-2 block text-sm font-medium text-slate-800">
                {question.questionText}
                {question.isRequired ? <span className="text-red-600"> *</span> : null}
              </label>
              {renderQuestion(question)}
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto mt-6 flex w-full max-w-5xl items-center justify-between">
        <button
          type="button"
          onClick={() => !isFirst && setStepIndex((prev) => prev - 1)}
          disabled={isFirst}
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Back
        </button>

        {!isLast ? (
          <button
            type="button"
            onClick={() => setStepIndex((prev) => prev + 1)}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
          >
            Review & Submit
          </button>
        )}
      </div>
    </main>
  );
}
