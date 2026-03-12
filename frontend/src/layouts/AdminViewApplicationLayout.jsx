// src/pages/AdminViewApplicationLayout.jsx
import { FormLayout } from "../layouts/LoginLayout"; 


export default function AdminViewApplicationLayout({ app, loading, onBack }) {
  return (
    <FormLayout>
      {/* Outermost wrapper controls width and spacing */}
      <div className="mx-auto my-10 w-full max-w-6xl px-4">
        {/* Card*/}
        <div className="relative rounded-2xl bg-white shadow-2xl">
          {/* Header (dark) */}
          <div className="rounded-t-2xl bg-[#1a1a1a] px-6 pt-6 pb-6 text-center">
            {/* yellow emoji badge */}
            <div className="mx-auto -mt-12 mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-[#fbdf07] ring-4 ring-[#1a1a1a] shadow-md">
              <span className="text-3xl leading-none">👤</span>
            </div>

            {/* Local heading — no extra bar, no 'Sign in to continue' from the old Title */}
            <h1 className="text-white text-2xl font-bold">Application Details</h1>
            <p className="mt-1 text-sm text-gray-400">Reviewing user submission</p>
          </div>

          {/* Content */}
          <div className="p-8 text-neutral-800">
            {loading ? (
              <p className="text-center">Loading details...</p>
            ) : !app ? (
              <p className="text-center">Application not found.</p>
            ) : (
              <>
                <div className="mb-8 space-y-2">
                  <p>
                    <strong>Applicant:</strong> {app.username}
                  </p>
                  <p>
                    <strong>Application ID:</strong> {app.applicationId || "N/A"}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className="font-bold text-green-600">{app.status}</span>
                  </p>
                </div>

                <h3 className="border-b-2 border-[#fbdf07] pb-2 text-lg font-semibold">
                  Form Responses
                </h3>

                <div className="mt-5">
                  {(app.answers || []).map((ans, idx) => {
                    const isFile = ans.fieldType === "file";
                    const fileUrl = `${app.fileBaseUrl || ""}${ans.answer || ""}`;

                    return (
                      <div key={idx} className="mb-4 rounded-xl bg-gray-50 p-4">
                        {/* Question text */}
                        <div className="mb-1 font-semibold text-neutral-600">
                          {ans.questionText}
                        </div>

                        {/* Answer */}
                        <div className="text-neutral-800">
                          {isFile ? (
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              download
                              className="font-semibold text-blue-600 hover:underline"
                            >
                              View Document 📄
                            </a>
                          ) : ans.answer ? (
                            ans.answer
                          ) : (
                            <em className="text-neutral-400">No answer</em>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* Back button */}
            
            <button
            onClick={onBack}
             className="mt-6 w-full rounded-lg bg-black px-4 py-3 text-white 
             transition-colors hover:text-[#fbdf07] 
             focus:outline-none focus:ring-2 focus:ring-black">
                Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </FormLayout>
  );
}