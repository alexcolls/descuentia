import SectionTitle from "@/components/section-title";

const LicensesPage = () => (
  <section className="mx-auto max-w-4xl px-6 py-24">
    <SectionTitle
      eyebrow="Compliance"
      title="Licenses & Compliance"
      description="Details about proprietary licensing and attributions for third-party services used by Descuentia."
      align="left"
    />
    <div className="mt-10 space-y-8 text-sm leading-relaxed text-slate-600">
      <div>
        <h3 className="text-base font-semibold text-slate-900">Proprietary license</h3>
        <p className="mt-2">
          Descuentia software is distributed under a commercial proprietary license. All rights are reserved. Any use or
          redistribution requires an executed agreement with Descuentia.
        </p>
      </div>
      <div>
        <h3 className="text-base font-semibold text-slate-900">Third-party services</h3>
        <p className="mt-2">
          Descuentia integrates with Supabase, Stripe, Google Maps Platform, and Expo services. Each service is subject to
          its respective terms of use and privacy policies.
        </p>
      </div>
      <div>
        <h3 className="text-base font-semibold text-slate-900">Attribution</h3>
        <p className="mt-2">
          Iconography used on this website is provided by the Lucide icon set under the ISC license. Tailwind CSS is used
          under the MIT license.
        </p>
      </div>
      <div>
        <h3 className="text-base font-semibold text-slate-900">Questions</h3>
        <p className="mt-2">
          For licensing clarifications, contact <a className="text-primary-600" href="mailto:legal@descuentia.eu">legal@descuentia.eu</a>.
        </p>
      </div>
    </div>
  </section>
);

export default LicensesPage;
