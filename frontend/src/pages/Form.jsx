import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { getSession } from "../services/auth";
import "../styles/dashboard.css";

const API = "http://localhost:3000";

function normalizeFormData(payload) {
  const sections = [...(payload?.sections || [])]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((section) => ({
      ...section,
      questions: [...(section.questions || [])]
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((question) => ({
          ...question,
          options: [...(question.options || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
        })),
    }));

  return { form: payload?.form || null, sections };
}

function getInitialAnswers(sections) {
  const initial = {};
  for (const section of sections) {
    for (const q of section.questions) {
      initial[q.questionId] = q.fieldType === "checkbox" ? [] : "";
    }
  }
  return initial;
}

function isQuestionFilled(question, value) {
  if (question.fieldType === "checkbox") return Array.isArray(value) && value.length > 0;
  return String(value || "").trim().length > 0;
}

export default function Form() {
  const session = getSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitMsg, setSubmitMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [formData, setFormData] = useState({ form: null, sections: [] });
  const [answers, setAnswers] = useState({});

  const steps = formData.sections;
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === steps.length - 1;
  const currentSection = steps[stepIndex];

  const questionsCount = useMemo(
    () => steps.reduce((sum, section) => sum + section.questions.length, 0),
    [steps],
  );
  const answeredCount = useMemo(() => {
    let count = 0;
    for (const section of steps) {
      for (const q of section.questions) {
        if (isQuestionFilled(q, answers[q.questionId])) count += 1;
      }
    }
    return count;
  }, [answers, steps]);

  useEffect(() => {
    let active = true;

    async function loadForm() {
      setLoading(true);
      setError("");
      try {
        const formsRes = await axios.get(`${API}/forms`);
        const forms = formsRes.data || [];
        if (!forms.length) {
          if (active) setError("No forms are available. Run backend seed first.");
          return;
        }

        const formId = forms[0].formId;
        const detailsRes = await axios.get(`${API}/forms/${formId}`);
        const normalized = normalizeFormData(detailsRes.data);
        if (active) {
          setFormData(normalized);
          setAnswers(getInitialAnswers(normalized.sections));
          setStepIndex(0);
        }
      } catch (err) {
        if (active) setError(err?.response?.data?.error || "Could not load form data.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadForm();
    return () => {
      active = false;
    };
  }, []);

  const updateAnswer = (question, value) => {
    setAnswers((prev) => ({ ...prev, [question.questionId]: value }));
  };

  const toggleCheckbox = (questionId, optionText) => {
    setAnswers((prev) => {
      const prevList = Array.isArray(prev[questionId]) ? prev[questionId] : [];
      const exists = prevList.includes(optionText);
      const nextList = exists ? prevList.filter((v) => v !== optionText) : [...prevList, optionText];
      return { ...prev, [questionId]: nextList };
    });
  };

  const validateRequired = () => {
    for (const section of steps) {
      for (const question of section.questions) {
        if (!question.isRequired) continue;
        if (!isQuestionFilled(question, answers[question.questionId])) {
          return `Please fill required field: ${question.questionText}`;
        }
      }
    }
    return "";
  };

  const submitApplication = async () => {
    setError("");
    setSubmitMsg("");

    if (!session?.userId) {
      setError("You need to be logged in as a user to submit the application.");
      return;
    }
    if (!formData.form?.formId) {
      setError("Form metadata is missing.");
      return;
    }

    const requiredError = validateRequired();
    if (requiredError) {
      setError(requiredError);
      return;
    }

    setSubmitting(true);
    try {
      const appRes = await axios.post(`${API}/applications/start`, {
        userId: session.userId,
        formId: formData.form.formId,
      });

      const applicationId = appRes.data.applicationId;
      const payload = [];
      for (const section of steps) {
        for (const question of section.questions) {
          const raw = answers[question.questionId];
          let answer = "";
          if (question.fieldType === "checkbox") {
            answer = JSON.stringify(Array.isArray(raw) ? raw : []);
          } else {
            answer = String(raw ?? "").trim();
          }
          payload.push({ questionId: question.questionId, answer });
        }
      }

      await axios.post(`${API}/applications/${applicationId}/answers`, { answers: payload });
      await axios.post(`${API}/applications/${applicationId}/submit`);
      setSubmitMsg("Application submitted successfully.");
    } catch (err) {
      setError(err?.response?.data?.error || "Could not submit application.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <main style={{ padding: "2rem" }}>Loading form...</main>;

  if (error && !steps.length) {
    return (
      <main style={{ padding: "2rem" }}>
        <p style={{ color: "#b91c1c" }}>{error}</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "1rem 1.25rem 2rem", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ marginBottom: "1rem" }}>
        <h2 style={{ margin: 0 }}>{formData.form?.title || "Application Form"}</h2>
        {formData.form?.description ? <p style={{ marginTop: "0.35rem", color: "#475569" }}>{formData.form.description}</p> : null}
        <p style={{ marginTop: "0.35rem", color: "#64748b", fontSize: "0.9rem" }}>
          Section {stepIndex + 1} of {steps.length} | Answered {answeredCount}/{questionsCount}
        </p>
      </div>

      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        {steps.map((section, idx) => (
          <button
            key={section.sectionId}
            type="button"
            onClick={() => setStepIndex(idx)}
            className={`btn btn-sm ${idx === stepIndex ? "btn-primary" : "btn-outline"}`}
          >
            {section.title}
          </button>
        ))}
      </div>

      {currentSection ? (
        <section className="card">
          <h3 style={{ marginTop: 0 }}>{currentSection.title}</h3>
          {currentSection.questions.length === 0 ? (
            <p style={{ color: "#64748b" }}>No questions in this section.</p>
          ) : (
            <div style={{ display: "grid", gap: "1rem" }}>
              {currentSection.questions.map((question) => (
                <div key={question.questionId}>
                  <label style={{ display: "block", fontWeight: 600, marginBottom: "0.4rem" }}>
                    {question.questionText} {question.isRequired ? <span style={{ color: "#dc2626" }}>*</span> : null}
                  </label>

                  {question.fieldType === "textarea" ? (
                    <textarea
                      rows={4}
                      className="form-select"
                      value={answers[question.questionId] || ""}
                      onChange={(e) => updateAnswer(question, e.target.value)}
                    />
                  ) : null}

                  {question.fieldType === "text" ? (
                    <input
                      type="text"
                      className="form-select"
                      value={answers[question.questionId] || ""}
                      onChange={(e) => updateAnswer(question, e.target.value)}
                    />
                  ) : null}

                  {question.fieldType === "dropdown" ? (
                    <select
                      className="form-select"
                      value={answers[question.questionId] || ""}
                      onChange={(e) => updateAnswer(question, e.target.value)}
                    >
                      <option value="">Select an option</option>
                      {question.options.map((opt) => (
                        <option key={opt.optionId} value={opt.optionText}>
                          {opt.optionText}
                        </option>
                      ))}
                    </select>
                  ) : null}

                  {question.fieldType === "radio" ? (
                    <div style={{ display: "grid", gap: "0.45rem" }}>
                      {question.options.map((opt) => (
                        <label key={opt.optionId} style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                          <input
                            type="radio"
                            name={`q-${question.questionId}`}
                            checked={(answers[question.questionId] || "") === opt.optionText}
                            onChange={() => updateAnswer(question, opt.optionText)}
                          />
                          <span>{opt.optionText}</span>
                        </label>
                      ))}
                    </div>
                  ) : null}

                  {question.fieldType === "checkbox" ? (
                    <div style={{ display: "grid", gap: "0.45rem" }}>
                      {question.options.map((opt) => (
                        <label key={opt.optionId} style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                          <input
                            type="checkbox"
                            checked={Array.isArray(answers[question.questionId]) && answers[question.questionId].includes(opt.optionText)}
                            onChange={() => toggleCheckbox(question.questionId, opt.optionText)}
                          />
                          <span>{opt.optionText}</span>
                        </label>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </section>
      ) : null}

      {error ? <p style={{ marginTop: "1rem", color: "#b91c1c" }}>{error}</p> : null}
      {submitMsg ? <p style={{ marginTop: "1rem", color: "#065f46" }}>{submitMsg}</p> : null}

      <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between", gap: "0.5rem" }}>
        <button type="button" className="btn btn-outline" onClick={() => setStepIndex((prev) => Math.max(prev - 1, 0))} disabled={isFirst || submitting}>
          Back
        </button>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          {!isLast ? (
            <button type="button" className="btn btn-primary" onClick={() => setStepIndex((prev) => Math.min(prev + 1, steps.length - 1))} disabled={submitting}>
              Next
            </button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={submitApplication} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}


