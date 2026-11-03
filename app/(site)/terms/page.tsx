import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms that apply when you use the Elevate HQ website.",
};

const sections = [
  { id: "about", title: "About these terms" },
  { id: "not-emergency", title: "Not an emergency service" },
  { id: "information-only", title: "Information, not advice" },
  { id: "services", title: "Our services" },
  { id: "enquiries", title: "Enquiries and bookings" },
  { id: "feedback", title: "Feedback you submit" },
  { id: "acceptable-use", title: "Acceptable use" },
  { id: "intellectual-property", title: "Intellectual property" },
  { id: "external-links", title: "External links" },
  { id: "liability", title: "Limitation of liability" },
  { id: "privacy", title: "Privacy" },
  { id: "law", title: "Governing law" },
  { id: "changes", title: "Changes and contact" },
];

export default function TermsPage() {
  return (
    <LegalPage kicker="Legal" title="Terms & Conditions" updated="1 November 2026" sections={sections}>
      <h2 id="about">1. About these terms</h2>
      <p>
        These terms apply to your use of this website, operated by {site.name} ({site.tagline}), {site.location},
        India. By using the website you agree to them. If you do not agree, please do not use the website.
      </p>

      <h2 id="not-emergency">2. Not an emergency service</h2>
      <p>
        This website and its forms are <strong>not monitored around the clock</strong> and are not for emergencies.
        If you or someone you know is in crisis or at risk of harm, call the Tele-MANAS helpline on{" "}
        <a href="tel:14416">14416</a> or <a href="tel:18008914416">1-800-891-4416</a>, or go to the nearest hospital.
      </p>

      <h2 id="information-only">3. Information, not advice</h2>
      <p>
        Articles and other content on this website are for general information only. They are not a diagnosis,
        treatment, or a substitute for professional help suited to your situation. Reading the website or sending us
        a message does not by itself create a counselling or professional relationship.
      </p>

      <h2 id="services">4. Our services</h2>
      <p>
        The website describes our counselling, psychometric assessment, training and PoSH compliance services in
        general terms. The specific details of any engagement, including scope, schedule, fees, cancellation and
        rescheduling, are agreed with you directly before the work begins.
      </p>
      <p>
        Outcomes of counselling, assessment and training depend on many factors, so we cannot guarantee any
        particular result.
      </p>

      <h2 id="enquiries">5. Enquiries and bookings</h2>
      <p>
        Sending the contact form is a request to get in touch, not a confirmed appointment. A session is booked only
        once we have confirmed it with you. Please give accurate contact details so we can reply.
      </p>

      <h2 id="feedback">6. Feedback you submit</h2>
      <p>When you send feedback through the website, you agree that:</p>
      <ul>
        <li>it describes your own genuine experience;</li>
        <li>it does not include private details about other people or about the content of your sessions;</li>
        <li>it is not abusive, misleading or unlawful.</li>
      </ul>
      <p>
        If you tick the consent box, you allow us to display your feedback on this website. We review all feedback
        before it appears. We may lightly edit it to protect privacy, or decline or remove it at our discretion. You
        can ask us to remove your feedback at any time.
      </p>

      <h2 id="acceptable-use">7. Acceptable use</h2>
      <p>Please do not:</p>
      <ul>
        <li>try to access areas of the website you are not authorized to use;</li>
        <li>send spam, automated submissions or harmful code through the forms;</li>
        <li>copy or scrape the website&apos;s content in bulk; or</li>
        <li>use the website in any way that breaks the law or harms others.</li>
      </ul>

      <h2 id="intellectual-property">8. Intellectual property</h2>
      <p>
        The {site.name} name, logo, articles and other website content belong to {site.name} unless stated otherwise.
        You are welcome to share links to our pages. Please ask us before copying or republishing our content.
      </p>

      <h2 id="external-links">9. External links</h2>
      <p>
        The website links to other services, such as WhatsApp and social media. We are not responsible for their
        content or privacy practices.
      </p>

      <h2 id="liability">10. Limitation of liability</h2>
      <p>
        We work to keep the website accurate and available, but it is provided &quot;as is&quot; and may sometimes be
        unavailable or contain errors. To the extent the law allows, we are not liable for any loss arising from your
        use of the website or reliance on its general content. Nothing in these terms limits liability that cannot be
        limited by law.
      </p>

      <h2 id="privacy">11. Privacy</h2>
      <p>
        Our <Link href="/privacy">Privacy Policy</Link> explains how we handle personal information you share through
        the website.
      </p>

      <h2 id="law">12. Governing law</h2>
      <p>
        These terms are governed by the laws of India. Any dispute will be subject to the jurisdiction of the courts
        in Chennai, Tamil Nadu.
      </p>

      <h2 id="changes">13. Changes and contact</h2>
      <p>
        We may update these terms from time to time. The &quot;last updated&quot; date at the top shows when they were
        last changed. Questions about these terms can be sent to <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </LegalPage>
  );
}
