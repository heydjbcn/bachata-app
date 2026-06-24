import type { Metadata } from "next";
import { LegalShell } from "@/components/site/LegalShell";

export const metadata: Metadata = {
  title: "Terms & Conditions — BachatAppStudio",
};

export default function TermsAndConditions() {
  return (
    <LegalShell
      title="Terms And Conditions — BachatApp Studio"
      effective="Effective Date: April 20, 2025"
    >
      <h2>1. Terms</h2>
      <p>
        By accessing the apps, users consent to these terms, applicable laws,
        and responsibility for local law compliance. Disagreement prohibits
        service use. Materials are protected by copyright and trademark law.
      </p>

      <h2>2. Use License</h2>
      <p>
        2.1. Users may temporarily download one copy per device for personal,
        non-commercial viewing only—a license grant, not title transfer.
      </p>
      <p>Prohibited actions:</p>
      <ul>
        <li>2.2. Modifying or copying materials</li>
        <li>2.3. Using for commercial purposes or public display</li>
        <li>2.4. Decompiling or reverse engineering software</li>
        <li>2.5. Removing copyright or proprietary notices</li>
        <li>2.6. Transferring materials or mirroring servers</li>
      </ul>
      <p>
        2.7. License automatically terminates upon violation and may be
        terminated anytime. Users must destroy downloaded materials upon
        termination.
      </p>

      <h2>3. Disclaimer</h2>
      <p>
        Materials are provided &quot;as is&quot; with no warranties. The company
        disclaims all warranties including &quot;implied warranties or
        conditions of merchantability, fitness for a particular purpose.&quot;
      </p>

      <h2>4. Limitations</h2>
      <p>
        BachatApp Studio and suppliers bear no liability for damages from
        service use or inability to use, regardless of prior notification of
        potential harm.
      </p>

      <h2>5. Accuracy of Materials</h2>
      <p>
        Materials may contain errors. The company makes no accuracy or
        completeness warranties and may modify content without notice or update
        commitment.
      </p>

      <h2>6. Links</h2>
      <p>
        The company hasn&apos;t reviewed linked sites and isn&apos;t responsible
        for their contents. Links don&apos;t imply endorsement. Users access
        linked sites at their own risk.
      </p>

      <h2>7. Modifications</h2>
      <p>
        Terms may be revised without notice; continued use indicates acceptance
        of current terms.
      </p>

      <h2>8. Governing Law</h2>
      <p>
        Terms are governed by UAE law with exclusive jurisdiction in UAE courts.
      </p>
    </LegalShell>
  );
}
