import React from "react";

const declarationPoints = [
  "to abide by the provisions of the Aadhaar (Targeted Delivery of Financial and Other Subsidies, Benefits and Services) Act, 2016 ('Aadhaar Act') and the regulations made thereunder;",
  "to facilitate, on receipt of in-principle approval from UIDAI, audit as per UIDAI 'Compliance Checklist for Onboarding the Requesting Entity' and submit all compliance related documents attached as annexures before signing the AUA/KUA Agreement;",
  "to fulfil all requirements with respect to use of the Aadhaar Authentication facility as per the Aadhaar (Authentication and Offline Verification) Regulations, 2021;",
  "to set up and maintain within the territory of India, at all times, requisite infrastructure (including, but not limited to, servers, databases etc.) for the use of Aadhaar Authentication facilities, capable of handling a minimum of one lakh Authentication transactions per month;",
  "to carry out appropriate due diligence before engaging any sub-contractor, business correspondent or field operator for performing any functions in relation to the use of Aadhaar Authentication facilities, including onboarding of user/beneficiary/customer, Authentication application development, etc.;",
  "to store Aadhaar numbers, if authorised so to do, only in the Aadhaar Data Vault, in accordance with such policies, procedures, standards and technical specifications as UIDAI may specify from time to time;",
  "to ensure the carrying out of audit of its own operations and systems and those of its Sub-AUAs and Sub-KUAs, if any, as required under the Aadhaar Act, the regulations made thereunder and the AUA Agreement;",
  "to not share or disclose e-KYC data that may be received on use of e-KYC Authentication facility, except in accordance with the provisions of the Aadhaar Act and the regulations made thereunder;",
  "to inform UIDAI forthwith of any change in the name, address and other particulars of the applicant and contact persons as furnished in this application form.",
];

export default function Declaration() {
  return (
    <form className="mx-auto w-full max-w-5xl rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-10">
      <h2 className="text-lg font-semibold text-slate-900">Declarations and Undertakings</h2>

      <p className="mt-4 text-sm leading-6 text-slate-700">
        It is hereby declared that the information furnished in this application form is true and correct
        to the best of its knowledge and that no material particulars or information have been concealed
        or withheld, and that the <span className="font-medium">applicant Ministry/Department/secretariat/office/agency/entity</span>
      </p>

      <input
        type="text"
        name="applicantName"
        placeholder="(name of applicant Ministry/Department/secretariat/office/agency/entity)"
        required
        className="mt-3 w-full border-b border-slate-300 pb-2 text-center text-sm text-slate-600 outline-none placeholder:text-slate-500 focus:border-slate-500"
      />

      <p className="mt-3 text-sm text-slate-800">hereby undertakes:</p>

      <ol className="mt-4 list-none space-y-3 text-sm leading-6 text-slate-700">
        {declarationPoints.map((point, index) => {
          const letter = String.fromCharCode(97 + index);
          return (
            <li key={letter} className="flex gap-2">
              <span className="min-w-8 font-medium text-slate-900">({letter})</span>
              <span>{point}</span>
            </li>
          );
        })}
      </ol>

      <div className="mt-10 grid gap-8 text-sm text-slate-800 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <span className="font-medium">Date:</span>
            <input
              type="date"
              name="date"
              required
              className="ml-2 inline-block w-48 border-b border-slate-400 bg-transparent align-middle outline-none focus:border-slate-600"
            />
          </div>
          <div>
            <span className="font-medium">Place:</span>
            <input
              type="text"
              name="place"
              className="ml-2 inline-block w-48 border-b border-slate-400 bg-transparent align-middle outline-none focus:border-slate-600"
            />
          </div>
        </div>

        <div className="space-y-4 md:justify-self-end">
          <p className="text-right">(Signature with stamp/seal of authorised signatory)</p>
          <div>
            <span className="font-medium">Name:</span>
            <input
              type="text"
              name="name"
              required
              className="ml-2 inline-block w-60 border-b border-slate-400 bg-transparent align-middle outline-none focus:border-slate-600"
            />
          </div>
          <div>
            <span className="font-medium">Full designation:</span>
            <input
              type="text"
              name="fullDesignation"
              className="ml-2 inline-block w-52 border-b border-slate-400 bg-transparent align-middle outline-none focus:border-slate-600"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
