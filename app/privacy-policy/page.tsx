import type { Metadata } from "next";
import { LegalShell } from "@/components/site/LegalShell";

export const metadata: Metadata = {
  title: "Privacy Policy — BachatAppStudio",
};

export default function PrivacyPolicy() {
  return (
    <LegalShell title="BachatApp Studio Privacy Policy" effective="Effective Date: April 20, 2025">
      <p>
        Thank you for trusting BachatApp Studio (&quot;we,&quot; &quot;our,&quot;
        or &quot;the App&quot;). We are committed to protecting your privacy and
        ensuring a safe experience when using our services. This Privacy Policy
        explains how we collect, use, store, and protect the personal
        information you provide to us.
      </p>

      <h2>1. INFORMATION WE COLLECT</h2>
      <p>
        <strong>1.1. Personal information provided by the user:</strong>
      </p>
      <ul>
        <li>Name, email address, and login credentials.</li>
        <li>
          Optional profile information such as photo, country, and role (student
          or teacher).
        </li>
      </ul>
      <p>
        <strong>1.2. Technical information collected automatically:</strong>
      </p>
      <ul>
        <li>
          IP address, device type, operating system, browser, and activity
          within the app.
        </li>
      </ul>
      <p>
        <strong>1.3. Usage data:</strong>
      </p>
      <ul>
        <li>
          Interaction statistics within the app: features used, frequency, and
          usage patterns.
        </li>
      </ul>

      <h2>2. HOW WE USE YOUR INFORMATION</h2>
      <p>We use the collected data to:</p>
      <ul>
        <li>Provide access to our features and services.</li>
        <li>Personalize your experience within the app.</li>
        <li>Improve service performance, content, and security.</li>
        <li>
          Send relevant notifications (you can disable them in settings).
        </li>
        <li>Comply with legal obligations and prevent fraud or misuse.</li>
      </ul>

      <h2>3. SHARING OF INFORMATION</h2>
      <p>We do not sell or rent your personal information.</p>
      <p>We may share data in the following cases:</p>
      <ul>
        <li>
          With service providers supporting the App&apos;s infrastructure,
          storage, payments, etc.
        </li>
        <li>When required by legal processes or regulatory compliance.</li>
        <li>
          In the event of a merger, acquisition, or asset sale, with prior
          notice.
        </li>
      </ul>

      <h2>4. DATA SECURITY</h2>
      <p>
        We implement administrative, technical, and physical security measures
        to protect your personal data. However, no system is completely secure.
        In case of breaches, you will be notified as required by applicable
        laws.
      </p>

      <h2>5. YOUR RIGHTS AND OPTIONS</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Access, correct, or delete your personal information.</li>
        <li>Request limitation of data use.</li>
        <li>Withdraw your consent at any time.</li>
      </ul>
      <p>
        To exercise these rights, contact us at{" "}
        <a href="mailto:support@bachatappstudio.com">
          support@bachatappstudio.com
        </a>
        .
      </p>

      <h2>6. DATA RETENTION</h2>
      <p>
        We retain your data while your account is active or as necessary to
        fulfill the purposes described. Upon account closure, your data will be
        deleted or anonymized unless a legal obligation requires retention.
      </p>

      <h2>7. COOKIES AND SIMILAR TECHNOLOGIES</h2>
      <p>
        We use cookies and similar tools to enhance user experience, remember
        preferences, and analyze usage trends. You can manage cookies through
        your device settings.
      </p>

      <h2>8. CHILDREN&apos;S PRIVACY</h2>
      <p>
        The app is not intended for users under 16 years of age. We do not
        knowingly collect data from minors without parental or guardian consent.
      </p>

      <h2>9. CHANGES TO THIS POLICY</h2>
      <p>
        We reserve the right to modify this Privacy Policy. Any substantial
        changes will be notified through the App or by email. We encourage you
        to review this policy periodically.
      </p>

      <h2>10. CONTACT</h2>
      <p>
        If you have questions, requests, or concerns about this Privacy Policy,
        contact us at:{" "}
        <a href="mailto:support@bachatappstudio.com">
          support@bachatappstudio.com
        </a>
      </p>
      <p>BachatApp Studio is a registered trademark. All rights reserved.</p>
    </LegalShell>
  );
}
