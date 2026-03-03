import React from "react";

function ContactColumn({ title, subtitle }) {
  return (
    <div className="rounded-md border border-slate-200 p-4">
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      {subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}
      <div className="mt-4 space-y-3">
        <input type="text" placeholder="Name" className="w-full rounded-md border border-gray-300 p-2" />
        <input
          type="text"
          placeholder="Full designation"
          className="w-full rounded-md border border-gray-300 p-2"
        />
        <input
          type="email"
          placeholder="Official email address"
          className="w-full rounded-md border border-gray-300 p-2"
        />
        <input type="text" placeholder="Mobile number" className="w-full rounded-md border border-gray-300 p-2" />
        <input
          type="text"
          placeholder="Alternate office/telephone number"
          className="w-full rounded-md border border-gray-300 p-2"
        />
      </div>
    </div>
  );
}

export default function ContactDetails() {
  return (
    <div className="w-full max-w-5xl mx-auto rounded-lg bg-white p-6 shadow ring-1 ring-slate-200">
      <h2 className="text-2xl font-semibold">2) Contact details</h2>

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ContactColumn title="(a) Management Point of Contact (MPOC)" />
        <ContactColumn title="Person authorised" subtitle="Based on Board resolution/minutes (or other valid instrument of authorisation)" />
        <ContactColumn title="Other key personnel" subtitle="(if any)" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ContactColumn
          title="(b) Technical Point of Contact (TPOC)"
          subtitle="CXO/Head of functional vertical, reporting to chief executive or governing body"
        />
        <ContactColumn title="Primary technical contact" subtitle="Ministry/Department/secretariat/office/agency/entity" />
        <ContactColumn title="Other key personnel" subtitle="(if any)" />
      </div>

      <div className="mt-6 rounded-md border border-slate-200 p-4">
        <h3 className="text-base font-semibold text-slate-900">(c) AUA/KUA infrastructure details</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-3 rounded-md border border-slate-200 p-4">
            <h4 className="font-medium">DC (Data Centre)</h4>
            <input
              type="text"
              placeholder="MPOC/TPOC Name"
              className="w-full rounded-md border border-gray-300 p-2"
            />
            <input type="email" placeholder="Email address" className="w-full rounded-md border border-gray-300 p-2" />
            <input
              type="text"
              placeholder="Telephone/Mobile No."
              className="w-full rounded-md border border-gray-300 p-2"
            />
            <textarea placeholder="Address" rows="2" className="w-full rounded-md border border-gray-300 p-2" />
            <input type="text" placeholder="District" className="w-full rounded-md border border-gray-300 p-2" />
            <input type="text" placeholder="State" className="w-full rounded-md border border-gray-300 p-2" />
            <input type="text" placeholder="PIN Code" className="w-full rounded-md border border-gray-300 p-2" />
          </div>

          <div className="space-y-3 rounded-md border border-slate-200 p-4">
            <h4 className="font-medium">DR (Data Recovery Centre)</h4>
            <input
              type="text"
              placeholder="MPOC/TPOC Name"
              className="w-full rounded-md border border-gray-300 p-2"
            />
            <input type="email" placeholder="Email address" className="w-full rounded-md border border-gray-300 p-2" />
            <input
              type="text"
              placeholder="Telephone/Mobile No."
              className="w-full rounded-md border border-gray-300 p-2"
            />
            <textarea placeholder="Address" rows="2" className="w-full rounded-md border border-gray-300 p-2" />
            <input type="text" placeholder="District" className="w-full rounded-md border border-gray-300 p-2" />
            <input type="text" placeholder="State" className="w-full rounded-md border border-gray-300 p-2" />
            <input type="text" placeholder="PIN Code" className="w-full rounded-md border border-gray-300 p-2" />
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-md border border-slate-200 p-4">
        <h3 className="text-base font-semibold text-slate-900">(d) Contact details for grievance redressal</h3>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          <input type="text" placeholder="Website URL" className="rounded-md border border-gray-300 p-2" />
          <input type="email" placeholder="Email address" className="rounded-md border border-gray-300 p-2" />
          <input type="text" placeholder="Helpdesk number" className="rounded-md border border-gray-300 p-2" />
        </div>
      </div>
    </div>
  );
}