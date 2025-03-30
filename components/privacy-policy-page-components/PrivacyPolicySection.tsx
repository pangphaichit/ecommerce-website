import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const PrivacyPolicySection: React.FC = () => {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-yellow-600"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="prose max-w-none">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Last updated: {lastUpdated}
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Introduction
              </h2>
              <p className="text-gray-700">
                At Oven and Wheat ("we," "our," "us"), we are committed to
                protecting your privacy and ensuring that your personal
                information is handled responsibly. This Privacy Policy
                describes how we collect, use, and protect your personal data
                when you use our website (the "Website"), purchase our products
                or services, or interact with us in any way.
              </p>
              <p className="text-gray-700 mt-4">
                By using our Website, you agree to the terms outlined in this
                Privacy Policy. We encourage you to read this policy carefully.
                If you have any questions, please contact us using the details
                provided in the "How to Contact Us" section below.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                1. Who Processes Your Personal Data?
              </h2>
              <p className="text-gray-700">
                Oven and Wheat is responsible for processing your personal data
                in accordance with applicable data protection regulations,
                including but not limited to the General Data Protection
                Regulation (GDPR) where applicable.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                2. What Personal Data Do We Collect?
              </h2>
              <p className="text-gray-700">
                We may collect and process the following categories of personal
                data:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
                <li>
                  <span className="font-medium">Identity Information:</span>{" "}
                  Name, email address, phone number, and delivery address.
                </li>
                <li>
                  <span className="font-medium">Payment Information:</span>{" "}
                  Billing details, payment card information (processed securely
                  by third-party payment providers).
                </li>
                <li>
                  <span className="font-medium">Order Details:</span> Purchase
                  history and preferences.
                </li>
                <li>
                  <span className="font-medium">Account Information:</span>{" "}
                  Username, password, and profile preferences.
                </li>
                <li>
                  <span className="font-medium">Technical Information:</span> IP
                  address, browser type, and website usage data collected via
                  cookies.
                </li>
              </ul>
              <p className="text-gray-700 mt-4">
                Providing certain personal data is necessary to complete
                transactions and fulfill your orders. Required fields will be
                marked accordingly.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                3. How Do We Use Your Personal Data?
              </h2>
              <p className="text-gray-700">
                We use your personal data for the following purposes:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
                <li>To process and fulfill orders.</li>
                <li>To manage your account and provide customer support.</li>
                <li>
                  To communicate with you about promotions, offers, and updates
                  (with your consent).
                </li>
                <li>
                  To improve our Website and services based on user preferences
                  and behavior.
                </li>
                <li>To comply with legal obligations and prevent fraud.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                4. Legal Basis for Processing Your Data
              </h2>
              <p className="text-gray-700">
                We process your data under one or more of the following legal
                bases:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
                <li>
                  <span className="font-medium">Contractual Necessity:</span> To
                  fulfill orders and provide requested services.
                </li>
                <li>
                  <span className="font-medium">Legitimate Interests:</span> To
                  improve our business operations and customer experience.
                </li>
                <li>
                  <span className="font-medium">Consent:</span> When you opt-in
                  to receive marketing communications.
                </li>
                <li>
                  <span className="font-medium">Legal Compliance:</span> To meet
                  regulatory requirements and resolve disputes.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                5. Cookies and Tracking Technologies
              </h2>
              <p className="text-gray-700">
                We use cookies to enhance user experience and analyze website
                performance. For more information, please review our Cookie
                Policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                6. How Do We Share Your Data?
              </h2>
              <p className="text-gray-700">
                We do not sell your personal data. However, we may share your
                data with:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
                <li>
                  <span className="font-medium">Service Providers:</span>{" "}
                  Payment processors, delivery companies, and technical support
                  providers.
                </li>
                <li>
                  <span className="font-medium">Legal Authorities:</span> When
                  required to comply with applicable laws and regulations.
                </li>
                <li>
                  <span className="font-medium">Business Transfers:</span> In
                  case of a merger, acquisition, or sale of assets, your data
                  may be transferred to a successor entity.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                7. How Do We Protect Your Data?
              </h2>
              <p className="text-gray-700">
                We implement strict security measures to safeguard your data
                from unauthorized access, loss, or misuse. Our Website uses
                encryption and secure protocols to protect sensitive
                information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                8. Your Rights
              </h2>
              <p className="text-gray-700">
                You have the following rights regarding your personal data:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
                <li>
                  <span className="font-medium">Access:</span> Request a copy of
                  your personal data.
                </li>
                <li>
                  <span className="font-medium">Correction:</span> Update or
                  correct inaccurate information.
                </li>
                <li>
                  <span className="font-medium">Deletion:</span> Request the
                  deletion of your data under certain conditions.
                </li>
                <li>
                  <span className="font-medium">Objection:</span> Opt out of
                  marketing communications.
                </li>
                <li>
                  <span className="font-medium">Data Portability:</span> Request
                  your data in a structured, machine-readable format.
                </li>
              </ul>
              <p className="text-gray-700 mt-4">
                To exercise your rights, please contact us at
                [contact@ovenandwheat.com].
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                9. Retention Period
              </h2>
              <p className="text-gray-700">
                We retain your personal data only as long as necessary to
                fulfill the purposes outlined in this Privacy Policy or as
                required by law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                10. Updates to This Privacy Policy
              </h2>
              <p className="text-gray-700">
                We may update this Privacy Policy periodically. Any changes will
                be posted on this page, and where appropriate, we will notify
                you via email or Website notifications.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                11. How to Contact Us
              </h2>
              <p className="text-gray-700">
                If you have any questions about this Privacy Policy or how we
                handle your personal data, please contact us at:
              </p>
              <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-700">Oven and Wheat</p>
                <p className="text-gray-700">123 Bakery Street, Flour City</p>
                <p className="text-gray-700">Email: privacy@ovenandwheat.com</p>
                <p className="text-gray-700">Phone: (555) 123-4567</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicySection;
