import React from "react";

export default function ApplicationDetails() {
  return (
    <div className="w-full max-w-4xl mx-auto rounded-lg bg-white p-6 shadow ring-1 ring-slate-200">
      <h2 className="mb-4 text-2xl font-semibold">1) Applicant Details</h2>

      <div className="mb-4">
        <label className="mb-1 block font-medium">Applicant Name *</label>
        <input
          type="text"
          className="w-full rounded-md border border-gray-300 p-2"
          placeholder="Ministry/Department/Entity Name"
        />
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block font-medium">Registration / Incorporation No</label>
          <input
            type="text"
            className="w-full rounded-md border border-gray-300 p-2"
            placeholder="Enter registration/incorporation number"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Registration Document (PDF)</label>
          <input
            type="file"
            accept="application/pdf"
            className="w-full rounded-md border border-gray-300 p-2"
          />
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block font-medium">License No</label>
          <input
            type="text"
            className="w-full rounded-md border border-gray-300 p-2"
            placeholder="Enter license number"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">License Document (PDF)</label>
          <input
            type="file"
            accept="application/pdf"
            className="w-full rounded-md border border-gray-300 p-2"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="mb-1 block font-medium">Registered Office Address *</label>
        <textarea
          className="w-full rounded-md border border-gray-300 p-2"
          rows="3"
          placeholder="Full postal address"
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block font-medium">Correspondence Address</label>
        <textarea
          className="w-full rounded-md border border-gray-300 p-2"
          rows="3"
          placeholder="If different from registered address"
        />
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block font-medium">GSTN</label>
          <input
            type="text"
            className="w-full rounded-md border border-gray-300 p-2"
            placeholder="E.g., 22ABCDE1234F1Z5"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">GST Certificate (PDF)</label>
          <input
            type="file"
            accept="application/pdf"
            className="w-full rounded-md border border-gray-300 p-2"
          />
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block font-medium">TAN</label>
          <input
            type="text"
            className="w-full rounded-md border border-gray-300 p-2"
            placeholder="E.g., DELA12345B"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">TAN Document (PDF)</label>
          <input
            type="file"
            accept="application/pdf"
            className="w-full rounded-md border border-gray-300 p-2"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="mb-2 block font-medium">Type of facility *</label>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="h-4 w-4" />
            AUA
          </label>

          <label className="flex items-center gap-2">
            <input type="checkbox" className="h-4 w-4" />
            KUA
          </label>
        </div>
      </div>

      <div className="mb-4">
        <label className="mb-1 block font-medium">Board Resolution / Authorization (PDF)</label>
        <input
          type="file"
          accept="application/pdf"
          className="w-full rounded-md border border-gray-300 p-2"
        />
      </div>

      <div className="mb-4">
        <label className="mb-2 block font-medium">Applicable Provision of Aadhaar Act *</label>

        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input type="radio" name="aadhaar-provision" className="h-4 w-4" />
            Section 7
          </label>

          <label className="flex items-center gap-2">
            <input type="radio" name="aadhaar-provision" className="h-4 w-4" />
            Section 4(4)(b)(i) read with PMLA
          </label>

          <label className="flex items-center gap-2">
            <input type="radio" name="aadhaar-provision" className="h-4 w-4" />
            Section 4(4)(b)(i) read with other Central Act
          </label>

          <label className="flex items-center gap-2">
            <input type="radio" name="aadhaar-provision" className="h-4 w-4" />
            Section 4(4)(b)(ii)
          </label>

          <label className="flex items-center gap-2">
            <input type="radio" name="aadhaar-provision" className="h-4 w-4" />
            Section 4(7)
          </label>
        </div>
      </div>

      <div>
        <label className="mb-1 block font-medium">Category of Applicant</label>
        <select className="w-full rounded-md border border-gray-300 p-2">
          <option>Select category</option>
          <option>Central Govt entity (Section 7)</option>
          <option>State Govt entity (Section 7)</option>
          <option>PMLA reporting entity</option>
          <option>Entity under other Central Act</option>
          <option>Authorized under 4(4)(b)(ii)</option>
          <option>Mandatory auth under Section 4(7)</option>
        </select>
      </div>
    </div>
  );
}