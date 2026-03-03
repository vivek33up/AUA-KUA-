import React from "react";

export default function AsaDetails() {
  return (
    <div className="w-full max-w-5xl mx-auto rounded-lg bg-white p-6 shadow ring-1 ring-slate-200">
      <h2 className="text-2xl font-semibold">3) Details of Authentication Service Agency (ASA)</h2>

      <div className="mt-6 rounded-md border border-slate-200 p-4">
        <label className="block font-medium">(a) Name(s) of ASA</label>
        <p className="mt-1 text-sm text-slate-600">(In case of multiple ASAs, please provide their names)</p>
        <div className="mt-4 space-y-3">
          <input type="text" placeholder="1. ASA name" className="w-full rounded-md border border-gray-300 p-2" />
          <input type="text" placeholder="2. ASA name" className="w-full rounded-md border border-gray-300 p-2" />
          <input type="text" placeholder="3. ASA name" className="w-full rounded-md border border-gray-300 p-2" />
        </div>
      </div>

      <div className="mt-6 rounded-md border border-slate-200 p-4">
        <label className="block font-medium">
          (b) Declaration by the ASA(s) agreeing to provide secure network connectivity and related services for performance of authentication
        </label>
        <textarea
          rows="6"
          placeholder="Paste declaration text or upload details in your workflow"
          className="mt-3 w-full rounded-md border border-gray-300 p-2"
        />
        <p className="mt-2 text-sm text-slate-600">Please attach letter of ASA in original.</p>
      </div>
    </div>
  );
}