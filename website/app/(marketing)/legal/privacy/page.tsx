import SectionTitle from "@/components/section-title";

const PrivacyPage = () => (
  <section className="mx-auto max-w-4xl px-6 py-24">
    <SectionTitle
      eyebrow="Privacy"
      title="Privacy Notice"
      description="Descuentia is committed to respecting your privacy and complying with GDPR standards."
      align="left"
    />
    <div className="mt-10 space-y-8 text-sm leading-relaxed text-slate-600">
      <div>
        <h3 className="text-base font-semibold text-slate-900">Data collection</h3>
        <p className="mt-2">
          We collect the minimum amount of personal data required to provide our services, such as account credentials,
          contact information, and transactional history. All sensitive data is encrypted in transit and at rest.
        </p>
      </div>
      <div>
        <h3 className="text-base font-semibold text-slate-900">Usage</h3>
        <p className="mt-2">
          Your data enables personalized offers, loyalty tracking, and secure coupon validation. We never sell customer
          data to third parties.
        </p>
      </div>
      <div>
        <h3 className="text-base font-semibold text-slate-900">Your rights</h3>
        <p className="mt-2">
          You can request access, rectification, or deletion of your personal information at any time by contacting
          privacy@descuentia.eu.
        </p>
      </div>
      <div>
        <h3 className="text-base font-semibold text-slate-900">Contact</h3>
        <p className="mt-2">
          For privacy inquiries, please email <a className="text-primary-600" href="mailto:privacy@descuentia.eu">privacy@descuentia.eu</a>.
        </p>
      </div>
    </div>
  </section>
);

export default PrivacyPage;
