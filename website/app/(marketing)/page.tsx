"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  Check,
  HeartHandshake,
  Map as MapIcon,
  Megaphone,
  Scan,
  ShieldCheck,
  Sparkles,
  Wallet
} from "lucide-react";

import LogoCloud from "@/components/logo-cloud";
import SectionTitle from "@/components/section-title";
import {
  consumerFeatures,
  merchantFeatures,
  metrics,
  howItWorks,
  pricingPlans,
  testimonials,
  faqs
} from "@/lib/data";

const iconMap = {
  map: MapIcon,
  wallet: Wallet,
  bell: Bell,
  megaphone: Megaphone,
  barChart: BarChart3,
  scan: Scan
} as const;

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  visible: {
    transition: {
      staggerChildren: 0.12
    }
  }
};

const Home = () => (
  <>
    <section
      id="hero"
      className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-700 to-primary-500 text-white"
    >
      <div className="absolute inset-x-0 top-0 -z-10 h-96 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_65%)]" />
      <div className="mx-auto flex max-w-6xl flex-col-reverse items-center gap-16 px-6 py-24 md:flex-row md:py-28">
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.4em]">
            <Sparkles className="h-4 w-4" />
            Descuentia for Local Communities
          </div>
          <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight md:text-5xl">
            Intelligent discounts that power local commerce and social good.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-slate-100 md:text-xl">
            Launch targeted campaigns, reward loyalty, and give back to cancer research with every checkout. Descuentia connects shoppers and merchants in one frictionless platform.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="https://descuentia.eu/demo"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary-700 shadow-glow transition hover:bg-slate-100"
            >
              Request a demo <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="https://descuentia.eu/partner"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/60 px-6 py-3 text-sm font-semibold text-white transition hover:border-white"
            >
              Download the brochure <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-12 grid gap-6 border-t border-white/10 pt-10 text-sm text-slate-100 sm:grid-cols-3">
            <div>
              <p className="text-3xl font-semibold text-white">92%</p>
              <p className="mt-1 text-sm">Merchants see higher repeat visits within 60 days.</p>
            </div>
            <div>
              <p className="text-3xl font-semibold text-white">4.8★</p>
              <p className="mt-1 text-sm">Customer rating across iOS and Android app stores.</p>
            </div>
            <div>
              <p className="text-3xl font-semibold text-white">5%</p>
              <p className="mt-1 text-sm">Of net profits donated to European cancer research.</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-1 items-center justify-center"
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        >
          <div className="relative w-full max-w-md rounded-3xl bg-white/10 p-6 backdrop-blur">
            <div className="absolute inset-0 -z-10 rounded-3xl border border-white/20" />
            <div className="rounded-2xl bg-white p-6 text-slate-900 shadow-2xl shadow-primary-900/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-primary-500">Live campaign</p>
                  <p className="mt-2 text-lg font-semibold">Weekend Family Brunch</p>
                </div>
                <ShieldCheck className="h-10 w-10 text-primary-500" />
              </div>
              <p className="mt-4 text-sm text-slate-600">
                Real-time redemptions
              </p>
              <div className="mt-2 flex items-end gap-4">
                <p className="text-4xl font-bold text-slate-900">384</p>
                <span className="text-sm text-success">+18% today</span>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3 text-xs text-slate-500">
                <div className="rounded-xl border border-slate-200 p-3 text-center">
                  <p className="text-sm font-semibold text-slate-900">1.8k</p>
                  Views
                </div>
                <div className="rounded-xl border border-slate-200 p-3 text-center">
                  <p className="text-sm font-semibold text-slate-900">621</p>
                  Claims
                </div>
                <div className="rounded-xl border border-slate-200 p-3 text-center">
                  <p className="text-sm font-semibold text-slate-900">62%</p>
                  Conversion
                </div>
              </div>
              <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-primary-500">Loyalty spotlight</p>
                <p className="mt-2 text-sm text-slate-600">
                  <span className="font-medium">&ldquo;Every redeemed coupon funds 3 minutes of oncology research.&rdquo;</span> — Clara, Descuentia Ambassador
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    <LogoCloud />

    <section id="solutions" className="mx-auto max-w-6xl px-6 py-24">
      <SectionTitle
        eyebrow="Solutions"
        title="One platform. Two journeys. Shared impact."
        description="Unlock growth for merchants and effortless savings for consumers with tools built for both sides of the marketplace."
      />
      <div className="mt-14 grid gap-10 md:grid-cols-2">
        <motion.div
          className="rounded-3xl bg-white p-8 shadow-card"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <h3 className="font-heading text-2xl font-semibold text-slate-900">For consumers</h3>
          <p className="mt-3 text-sm text-slate-600">
            Hyperlocal deals, loyalty rewards, and notifications tailored to what matters most.
          </p>
          <div className="mt-8 space-y-6">
            {consumerFeatures.map((feature) => {
              const Icon = iconMap[feature.icon as keyof typeof iconMap];
              return (
                <motion.div key={feature.title} className="flex gap-4" variants={fadeInUp}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500/10 text-primary-600">
                    {Icon ? <Icon className="h-6 w-6" /> : null}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{feature.title}</p>
                    <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
        <motion.div
          className="rounded-3xl bg-white p-8 shadow-card"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <h3 className="font-heading text-2xl font-semibold text-slate-900">For merchants</h3>
          <p className="mt-3 text-sm text-slate-600">
            Activate winning campaigns, measure performance, and keep your brand top-of-mind.
          </p>
          <div className="mt-8 space-y-6">
            {merchantFeatures.map((feature) => {
              const Icon = iconMap[feature.icon as keyof typeof iconMap];
              return (
                <motion.div key={feature.title} className="flex gap-4" variants={fadeInUp}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-500/10 text-accent-600">
                    {Icon ? <Icon className="h-6 w-6" /> : null}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{feature.title}</p>
                    <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>

    <section id="impact" className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle
          eyebrow="Impact"
          title="Driving measurable value for communities and research"
          description="Every transaction on Descuentia makes local businesses stronger and funds the fight against cancer."
        />
        <div className="mt-16 grid gap-6 md:grid-cols-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center shadow-sm"
            >
              <p className="text-3xl font-bold text-primary-600">{metric.value}</p>
              <p className="mt-3 text-sm text-slate-600">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-24">
      <SectionTitle
        eyebrow="How it works"
        title="A trusted experience from discovery to redemption"
        description="Descuentia orchestrates the journey for both shoppers and merchants with a secure, delightful flow."
      />
      <div className="mt-16 grid gap-8 md:grid-cols-3">
        {howItWorks.map((step) => (
          <div key={step.title} className="relative rounded-3xl border border-slate-200 bg-white p-8 shadow-card">
            <span className="absolute -top-6 left-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-lg font-semibold text-white shadow-lg">
              {step.number}
            </span>
            <h3 className="mt-8 font-heading text-xl font-semibold text-slate-900">{step.title}</h3>
            <p className="mt-3 text-sm text-slate-600">{step.description}</p>
          </div>
        ))}
      </div>
    </section>

    <section id="pricing" className="bg-slate-900 py-24 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle
          eyebrow="Pricing"
          title="Flexible plans for every stage of growth"
          description="Start free and unlock deeper automation, analytics, and integrations as you scale."
          variant="light"
        />
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-8 shadow-card transition hover:-translate-y-1 hover:shadow-2xl ${
                plan.highlighted ? "ring-2 ring-accent-400" : ""
              }`}
            >
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.4em] text-accent-200">
                  {plan.name}
                </p>
                <p className="mt-5 text-4xl font-bold text-white">
                  {plan.price}
                  {plan.period ? <span className="text-base font-normal text-slate-200"> / {plan.period}</span> : null}
                </p>
                <p className="mt-4 text-sm text-slate-200">{plan.description}</p>
              </div>
              <ul className="mt-8 flex flex-1 flex-col gap-4 text-sm text-slate-100">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="https://descuentia.eu/contact"
                className={`mt-10 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${
                  plan.highlighted
                    ? "bg-white text-primary-700 shadow-xl shadow-primary-500/30 hover:bg-slate-100"
                    : "border border-white/30 text-white hover:border-white"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle
          eyebrow="What partners say"
          title="Loved by merchants and shoppers alike"
          description="Our community-first approach empowers businesses to thrive while customers save on what they love."
        />
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.author} className="flex h-full flex-col rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-card">
              <HeartHandshake className="h-8 w-8 text-primary-500" />
              <p className="mt-6 flex-1 text-sm text-slate-700">“{testimonial.quote}”</p>
              <div className="mt-6 text-sm font-semibold text-slate-900">{testimonial.author}</div>
              <p className="text-xs text-slate-500">{testimonial.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section id="faq" className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid gap-12 md:grid-cols-[1.2fr_1fr] md:items-start">
        <SectionTitle
          eyebrow="FAQ"
          title="Answers to frequent questions"
          description="Can’t find what you’re looking for? Our team will get back to you within one business day."
          align="left"
        />
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-card">
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <ShieldCheck className="h-5 w-5 text-primary-500" />
            Built with enterprise-grade privacy and security.
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Descuentia complies with GDPR and partners with leading payment and authentication providers to ensure your data stays safe.
          </p>
        </div>
      </div>
      <div className="mt-12 space-y-6">
        {faqs.map((faq) => (
          <div key={faq.question} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="font-semibold text-slate-900">{faq.question}</p>
            <p className="mt-3 text-sm text-slate-600">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary-500 via-primary-700 to-primary-900 opacity-90" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.15),_transparent_60%)]" />
      <div className="mx-auto max-w-4xl px-6 text-center text-white">
        <SectionTitle
          eyebrow="Get started"
          title="Bring Descuentia to your city"
          description="Book a personalized walkthrough with our growth team and discover how we can power your next campaign."
          variant="light"
        />
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="mailto:sales@descuentia.eu"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary-700 shadow-xl transition hover:bg-slate-100"
          >
            Contact sales <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            href="https://cal.com/descuentia/demo"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/70 px-6 py-3 text-sm font-semibold text-white transition hover:border-white"
          >
            Schedule demo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  </>
);

export default Home;
