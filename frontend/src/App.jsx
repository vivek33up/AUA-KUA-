import React from "react";
import { useMemo, useState } from "react";
import ApplicationDetails from "../sections/ApplicationDetails";
import AuthenticationRequirements from "../sections/AuthenticationRequirements"
import AsaDetails from "../sections/AsaDetails"
import ContactDetails from "../sections/ContactDetails"
import Declaration from "../sections/Declaration"
export default function App() {
  const steps = useMemo(
    () => [
      { title: "Applicant Details", component: ApplicationDetails },
      { title: "Contact Details", component: ContactDetails },
      { title: "ASA Details", component: AsaDetails },
      { title: "Authentication Requirements", component: AuthenticationRequirements },
      { title: "Declaration", component: Declaration },
    ],
    []
  );

  const [stepIndex, setStepIndex] = useState(0);
  const CurrentStep = steps[stepIndex].component;
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === steps.length - 1;

  const goBack = () => {
    if (!isFirst) {
      setStepIndex((prev) => prev - 1);
    }
  };

  const goNext = () => {
    if (!isLast) {
      setStepIndex((prev) => prev + 1);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 md:px-8">
      <div className="mx-auto mb-4 w-full max-w-5xl">
        <p className="text-sm text-slate-600">
          Section {stepIndex + 1} of {steps.length}: <span className="font-medium">{steps[stepIndex].title}</span>
        </p>
      </div>

      <CurrentStep />

      <div className="mx-auto mt-6 flex w-full max-w-5xl items-center justify-between">
        <button
          type="button"
          onClick={goBack}
          disabled={isFirst}
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          ← Back
        </button>

        {!isLast ? (
          <button
            type="button"
            onClick={goNext}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Next →
          </button>
        ) : null}
      </div>
    </main>
  );
}
