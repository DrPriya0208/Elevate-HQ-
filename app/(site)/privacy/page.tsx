import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How ElevateHQ collects, uses and protects your personal information.",
};

const sections = [
  { id: "who-we-are", title: "Who we are" },
  { id: "what-we-collect", title: "What we collect" },
  { id: "sensitive-information", title: "Sensitive information" },
  { id: "how-we-use", title: "How we use it" },
  { id: "confidentiality", title: "Session confidentiality" },
  { id: "sharing", title: "Who we share it with" },
  { id: "retention", title: "How long we keep it" },
  { id: "your-rights", title: "Your rights" },
  { id: "security", title: "Security" },
  { id: "children", title: "Children" },
  { id: "cookies", title: "Cookies" },
  { id: "grievance", title: "Grievance officer" },
  { id: "changes", title: "Changes to this policy" },
];

export default function PrivacyPage() {
  return (
    <LegalPage kicker="Legal" title="Privacy Policy" updated="1 November 2026" sections={sections}>
      <p>
        Your privacy matters to us, especially given the personal nature of psychological work. This policy explains
        what information we collect through this website, why we collect it, and the choices you have. It is written
        with India&apos;s Digital Personal Data Protection Act, 2023 and the Information Technology Act, 2000 and its
        rules in mind.
      </p>

      <h2 id="who-we-are">1. Who we are</h2>
      <p>
        This website is operated by {site.name} ({site.tagline}), led by {site.founder} and based in {site.location},
        India. In this policy, &quot;we&quot;, &quot;us&quot; and &quot;our&quot; refer to {site.name}. You can reach us at{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a> or <a href={site.phoneHref}>{site.phone}</a>.
      </p>

      <h2 id="what-we-collect">2. What we collect</h2>
      <p>We only collect information you choose to give us, plus basic technical data needed to run the website.</p>
      <ul>
        <li>
          <strong>Contact form:</strong> your name, email address, phone number (optional), organization (optional),
          the service you are interested in, and your message.
        </li>
        <li>
          <strong>Feedback form:</strong> your star rating, your feedback, and a name or initials if you choose to give
          one. You can leave the name blank to stay anonymous.
        </li>
        <li>
          <strong>Direct contact:</strong> anything you share when you call, email or message us on WhatsApp.
        </li>
        <li>
          <strong>Technical data:</strong> our hosting provider automatically records basic request information, such
          as IP address, browser type and the pages requested, to keep the website secure and working.
        </li>
      </ul>
      <p>We do not use analytics, advertising or tracking tools on this website.</p>

      <h2 id="sensitive-information">3. Please keep sensitive details for your session</h2>
      <p>
        Information about your mental health is sensitive. Please do <strong>not</strong> include clinical details,
        diagnoses or information about other people in the website forms. A brief note about the kind of support you
        are looking for is enough. We will discuss the details privately in a session.
      </p>

      <h2 id="how-we-use">4. How we use your information</h2>
      <ul>
        <li>To reply to your enquiry and arrange a first conversation or session.</li>
        <li>To provide the counselling, assessment, training or compliance services you ask for.</li>
        <li>
          To show your feedback on the website, only if you tick the consent box, and only after we have reviewed it.
          We may lightly edit feedback to remove anything that could identify you or someone else.
        </li>
        <li>To keep the website secure and to block spam.</li>
      </ul>
      <p>
        We process your information on the basis of your consent, which you give when you submit a form or contact
        us. You can withdraw that consent at any time (see <a href="#your-rights">Your rights</a>). We never sell your
        information or use it for advertising.
      </p>

      <h2 id="confidentiality">5. Session confidentiality</h2>
      <p>
        What you share in counselling, assessments or training sessions is kept confidential. The only exceptions
        are those the law requires, for example where there is a serious risk of harm to you or someone else, or
        where a court orders disclosure. How session records are kept is explained to you when we begin working
        together.
      </p>

      <h2 id="sharing">6. Who we share it with</h2>
      <p>
        We use a small number of trusted service providers to run this website. They process data on our behalf and
        only as needed to provide their service:
      </p>
      <ul>
        <li>
          <strong>Vercel:</strong> website hosting and storage of images we publish.
        </li>
        <li>
          <strong>Neon:</strong> the database that stores form submissions, hosted in the Singapore region.
        </li>
        <li>
          <strong>Our email provider:</strong> to send and receive email about your enquiry.
        </li>
      </ul>
      <p>
        Because some of these providers store data outside India, your information may be processed abroad. We
        choose providers that use industry-standard security. We do not share your information with anyone else
        unless the law requires it.
      </p>

      <h2 id="retention">7. How long we keep it</h2>
      <p>
        We keep enquiries only for as long as we need them to respond to you and to provide any services you go on to
        use. Published feedback stays on the website until you ask us to remove it. You can ask us to delete your
        information at any time.
      </p>

      <h2 id="your-rights">8. Your rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>ask what personal information we hold about you;</li>
        <li>ask us to correct or update it;</li>
        <li>ask us to delete it, including any published feedback;</li>
        <li>withdraw your consent;</li>
        <li>nominate someone to exercise these rights on your behalf; and</li>
        <li>raise a grievance with us, and with the Data Protection Board of India if you are not satisfied.</li>
      </ul>
      <p>
        To use any of these rights, email <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>

      <h2 id="security">9. Security</h2>
      <p>
        The website uses encrypted connections (HTTPS). Form submissions can only be viewed through a
        password-protected admin area. No system is completely secure, but we take reasonable steps to protect
        your information.
      </p>

      <h2 id="children">10. Children</h2>
      <p>
        If you are under 18, please ask a parent or guardian to contact us on your behalf. We only work with minors
        with the consent of a parent or guardian.
      </p>

      <h2 id="cookies">11. Cookies</h2>
      <p>
        This website does not use cookies to track visitors. The only cookie it sets is a login cookie for our
        administrator, which is not used for visitors.
      </p>

      <h2 id="grievance">12. Grievance officer</h2>
      <p>If you have a concern about how your information is handled, please contact:</p>
      <p>
        <strong>{site.founder}</strong>, {site.name}
        <br />
        Email: <a href={`mailto:${site.email}`}>{site.email}</a>
        <br />
        Phone: <a href={site.phoneHref}>{site.phone}</a>
        <br />
        {site.location}, India
      </p>
      <p>We aim to respond to every grievance within 30 days.</p>

      <h2 id="changes">13. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. The &quot;last updated&quot; date at the top shows when it was
        last changed. Please also read our <Link href="/terms">Terms &amp; Conditions</Link>.
      </p>
    </LegalPage>
  );
}
