import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { Icon } from "@/components/icons";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { site } from "@/lib/content";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Book a session or ask a question. ElevateHQ, Sholinganallur, Chennai.",
};

const [emailUser, emailDomain] = site.email.split("@");

const methods = [
  { icon: "phone", label: "Call us", value: site.phone, href: site.phoneHref, external: false },
  { icon: "message", label: "WhatsApp", value: "Message us on WhatsApp", href: site.whatsapp, external: true },
  {
    icon: "mail",
    label: "Email",
    value: (
      <>
        {emailUser}@<wbr />
        {emailDomain}
      </>
    ),
    href: `mailto:${site.email}`,
    external: false,
  },
];

type Props = { searchParams: Promise<{ topic?: string }> };

export default async function ContactPage({ searchParams }: Props) {
  const { topic } = await searchParams;

  return (
    <>
      <PageHero
        kicker="Contact"
        title="Book a session."
        intro="Book a free introductory call or send an enquiry. We will understand your needs and suggest the next step."
      />

      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[1.25fr_0.75fr]">
        <FadeIn className="card p-8 md:p-10">
          <p className="kicker text-brass">Send a message</p>
          <h2 className="mt-3 font-serif text-2xl">Tell us a little about what you need.</h2>
          <div className="mt-8">
            <ContactForm defaultTopic={topic} />
          </div>
        </FadeIn>

        <aside className="space-y-4">
          <Stagger as="ul" className="space-y-4">
            {methods.map((m) => (
              <StaggerItem key={m.href}>
                <a
                  href={m.href}
                  {...(m.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="card card-hover group flex items-center gap-4 p-5"
                >
                  <span className="icon-badge transition-colors duration-300 group-hover:bg-gold group-hover:text-navy">
                    <Icon name={m.icon} className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="kicker block text-slate">{m.label}</span>
                    <span className="mt-1 block break-words font-semibold text-navy">{m.value}</span>
                  </span>
                </a>
              </StaggerItem>
            ))}
            <StaggerItem>
              <div className="card flex items-center gap-4 p-5">
                <span className="icon-badge">
                  <Icon name="pin" className="h-5 w-5" />
                </span>
                <span>
                  <span className="kicker block text-slate">Where we are</span>
                  <span className="mt-1 block font-semibold text-navy">{site.location}</span>
                </span>
              </div>
            </StaggerItem>
          </Stagger>

          <FadeIn delay={0.2}>
            <p className="rounded-xl border border-gold/50 bg-gold/10 p-5 text-sm leading-relaxed text-navy">
              <span className="font-semibold">In a crisis?</span> This form is not monitored around the clock. Call
              Tele-MANAS on 14416 or 1-800-891-4416, or go to the nearest hospital.
            </p>
          </FadeIn>
        </aside>
      </div>
    </>
  );
}
