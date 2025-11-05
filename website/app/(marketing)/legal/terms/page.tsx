import SectionTitle from "@/components/section-title";

const TermsPage = () => (
  <section className="mx-auto max-w-4xl px-6 py-24">
    <SectionTitle
      eyebrow="Terms"
      title="Terms of Service"
      description="Key conditions governing your use of Descuentia products and services."
      align="left"
    />
    <div className="mt-10 space-y-8 text-sm leading-relaxed text-slate-600">
      <div>
        <h3 className="text-base font-semibold text-slate-900">Acceptance</h3>
        <p className="mt-2">
          By using Descuentia software, you agree to the proprietary license terms outlined in the LICENSE file shipped
          with this repository or in your commercial agreement.
        </p>
      </div>
      <div>
        <h3 className="text-base font-semibold text-slate-900">Authorized use</h3>
        <p className="mt-2">
          Access is limited to purposes explicitly permitted in your contract. Reverse engineering, redistribution, or
          competitive benchmarking is prohibited without written consent.
        </p>
      </div>
      <div>
        <h3 className="text-base font-semibold text-slate-900">Liability</h3>
        <p className="mt-2">
          Descuentia provides software <span className="font-medium">&ldquo;as is&rdquo;</span> without warranties. Our liability is limited to the extent permitted by
          applicable law.
        </p>
      </div>
      <div>
        <h3 className="text-base font-semibold text-slate-900">Support</h3>
        <p className="mt-2">
          Support services are rendered according to the SLA defined in your commercial plan. Contact support@descuentia.eu
          for assistance.
        </p>
      </div>
    </div>
  </section>
);

export default TermsPage;
