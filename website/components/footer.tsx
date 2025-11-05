import Link from "next/link";

const Footer = () => (
  <footer className="border-t border-slate-200 bg-white">
    <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-4">
      <div className="md:col-span-2">
        <div className="flex items-center gap-2 text-lg font-heading font-semibold text-primary-600">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-500/10 text-lg shadow-glow">
            D
          </span>
          Descuentia
        </div>
        <p className="mt-4 max-w-sm text-sm text-slate-600">
          Descuentia connects people with the best local deals while supporting cancer research through every transaction.
        </p>
      </div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Company</p>
        <ul className="mt-4 flex flex-col gap-2 text-sm text-slate-600">
          <li>
            <Link href="#solutions" className="transition hover:text-primary-600">
              Solutions
            </Link>
          </li>
          <li>
            <Link href="#pricing" className="transition hover:text-primary-600">
              Pricing
            </Link>
          </li>
          <li>
            <Link href="#impact" className="transition hover:text-primary-600">
              Social Impact
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Stay in touch</p>
        <ul className="mt-4 flex flex-col gap-2 text-sm text-slate-600">
          <li>
            <Link href="mailto:support@descuentia.eu" className="transition hover:text-primary-600">
              support@descuentia.eu
            </Link>
          </li>
          <li>
            <Link href="https://descuentia.eu" className="transition hover:text-primary-600">
              descuentia.eu
            </Link>
          </li>
          <li>
            <Link href="https://www.linkedin.com/company/descuentia" className="transition hover:text-primary-600">
              LinkedIn
            </Link>
          </li>
        </ul>
      </div>
    </div>
    <div className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Descuentia. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/legal/privacy" className="transition hover:text-primary-600">
            Privacy
          </Link>
          <Link href="/legal/terms" className="transition hover:text-primary-600">
            Terms
          </Link>
          <Link href="/legal/licenses" className="transition hover:text-primary-600">
            Licenses
          </Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
