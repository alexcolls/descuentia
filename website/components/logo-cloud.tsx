const logos = [
  "CaixaBank",
  "Mercado Vivo",
  "FreshMart",
  "La Plaza Retail",
  "Iberia Eats"
];

const LogoCloud = () => (
  <section className="border-y border-slate-200 bg-white/70">
    <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-10 px-6 py-10">
      {logos.map((logo) => (
        <span
          key={logo}
          className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-400"
        >
          {logo}
        </span>
      ))}
    </div>
  </section>
);

export default LogoCloud;
