import React from "react";

function CheckItem({ label, name }) {
  return (
    <label className="flex items-center gap-2">
      <input type="checkbox" name={name} className="h-4 w-4" />
      {label}
    </label>
  );
}

function RadioPair({ name }) {
  return (
    <div className="flex items-center gap-8">
      <label className="flex items-center gap-2">
        <input type="radio" name={name} className="h-4 w-4" /> Yes
      </label>
      <label className="flex items-center gap-2">
        <input type="radio" name={name} className="h-4 w-4" /> No
      </label>
    </div>
  );
}

export default function AuthenticationRequirements() {
  return (
    <div className="w-full max-w-5xl mx-auto rounded-lg bg-white p-6 shadow ring-1 ring-slate-200">
      <h2 className="text-2xl font-semibold">4) Authentication requirements</h2>

      <div className="mt-6 space-y-4">
        <div className="rounded-md border border-slate-200 p-4">
          <p className="font-medium">(a) Territorial extent for use of Authentication facility</p>
          <div className="mt-3 space-y-3">
            <CheckItem label="Whole of India" name="territory-india" />
            <div className="space-y-2">
              <CheckItem label="Name of State(s) and Union Territory(s):" name="territory-state" />
              <input type="text" className="w-full rounded-md border border-gray-300 p-2" placeholder="Enter state(s)/UT(s)" />
            </div>
          </div>
        </div>

        <div className="rounded-md border border-slate-200 p-4">
          <p className="font-medium">(b) Whether Authentication will be used to establish identity for carrying out financial transaction</p>
          <div className="mt-3">
            <RadioPair name="financial-transaction" />
          </div>
        </div>

        <div className="rounded-md border border-slate-200 p-4">
          <p className="font-medium">(c) Device form factor (select one or more option)</p>
          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
            <CheckItem label="Discrete Biometric Device" name="device-discrete" />
            <CheckItem label="Integrated Biometric Device" name="device-integrated" />
            <CheckItem label="Laptop/Desktop" name="device-laptop" />
            <CheckItem label="Mobile phone" name="device-mobile" />
          </div>
        </div>

        <div className="rounded-md border border-slate-200 p-4">
          <p className="font-medium">(d) Whether Authentication will be operator-assisted or by the user himself/herself (select one or more option)</p>
          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
            <CheckItem label="Operator-assisted use" name="operator-assisted" />
            <CheckItem label="Self-use" name="self-use" />
          </div>
        </div>

        <div className="rounded-md border border-slate-200 p-4">
          <p className="font-medium">(e) Mode of Authentication (select one or more option)</p>
          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
            <CheckItem label="Demographic" name="mode-demographic" />
            <CheckItem label="OTP" name="mode-otp" />
            <CheckItem label="Fingerprint" name="mode-fingerprint" />
            <CheckItem label="Iris" name="mode-iris" />
            <CheckItem label="Face" name="mode-face" />
          </div>
        </div>

        <div className="rounded-md border border-slate-200 p-4">
          <p className="font-medium">(f) Connectivity supported between AUA/KUA and ASA (select one or more option)</p>
          <div className="mt-3 space-y-3">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <CheckItem label="VPN" name="connectivity-vpn" />
              <CheckItem label="Leased line" name="connectivity-leased" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="connectivity-other" className="h-4 w-4" />
              <span>Other; Please specify:</span>
              <input type="text" className="w-full rounded-md border border-gray-300 p-2" placeholder="Specify other" />
            </div>
          </div>
        </div>

        <div className="rounded-md border border-slate-200 p-4">
          <p className="font-medium">(g) Confirmation that the applicant has perused and understood UIDAI’s Information Security Policy</p>
          <div className="mt-3">
            <RadioPair name="security-policy" />
          </div>
        </div>

        <div className="rounded-md border border-slate-200 p-4">
          <p className="font-medium">(h) Confirmation that the applicant has perused and understood UIDAI’s Model Privacy Policy</p>
          <div className="mt-3">
            <RadioPair name="privacy-policy" />
          </div>
        </div>
      </div>
    </div>
  );
}