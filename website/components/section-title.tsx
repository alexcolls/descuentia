import type { ReactNode } from "react";

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  align?: "left" | "center";
  variant?: "dark" | "light";
}

const SectionTitle = ({ eyebrow, title, description, align = "center", variant = "dark" }: SectionTitleProps) => {
  const isLight = variant === "light";
  return (
    <div className={`mx-auto max-w-3xl ${align === "center" ? "text-center" : "text-left"}`}>
      {eyebrow ? (
        <p
          className={`text-sm font-semibold uppercase tracking-[0.3em] ${
            isLight ? "text-white/70" : "text-primary-500"
          }`}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={`mt-3 font-heading text-3xl font-semibold tracking-tight md:text-4xl ${
          isLight ? "text-white" : "text-slate-900"
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={`mt-4 text-base ${isLight ? "text-white/80" : "text-slate-600"}`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
};

export default SectionTitle;
