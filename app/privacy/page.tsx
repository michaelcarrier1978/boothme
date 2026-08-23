export default function PrivacyPolicy() {
  const year = new Date().getFullYear();

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      {/* Header */}
      <header style={{
        borderBottom: "1px solid var(--border)",
        padding: "0 24px",
      }}>
        <div style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          height: 60,
        }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <span style={{
              fontFamily: "var(--font-serif), serif",
              fontSize: 24,
              color: "var(--dark)",
              letterSpacing: "-0.01em",
            }}>
              BoothMe
            </span>
          </a>
        </div>
      </header>

      {/* Content */}
      <main style={{ padding: "64px 24px 96px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <p style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--muted-light)",
            marginBottom: 16,
          }}>
            Legal
          </p>
          <h1 style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: 400,
            lineHeight: 1.15,
            color: "var(--dark)",
            marginBottom: 12,
          }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted-light)", marginBottom: 56 }}>
            Last updated: August {year}
          </p>

          {[
            {
              heading: "Who we are",
              body: "BoothMe is a vendor show management platform operated by MJC Solutions. References to BoothMe, we, us, or our in this policy refer to MJC Solutions. You can reach us at mjcsolutions.io@gmail.com.",
            },
            {
              heading: "What information we collect",
              body: "When you submit the opt-in form on our website, we collect your first and last name and your email address. We do not collect payment information, phone numbers, or any other personal data through this form.",
            },
            {
              heading: "How we use your information",
              body: "We use your name and email address to send you the vendor application template you requested and to send you related email marketing about BoothMe — including product updates, tips for running vendor shows, and offers for our paid services. We will not sell your information to third parties.",
            },
            {
              heading: "Email marketing and unsubscribing",
              body: "By submitting the opt-in form on our site, you consent to receive email marketing from BoothMe. Every marketing email we send includes an unsubscribe link. You can opt out at any time. After unsubscribing, we will stop sending marketing emails within a reasonable timeframe.",
            },
            {
              heading: "Third-party services",
              body: "We use Kit (formerly ConvertKit) to manage our email list and send emails. Your name and email address are stored on Kit's servers. Kit's privacy policy is available at kit.com. We use Calendly to manage scheduling for setup calls. If you book a call, Calendly may collect additional information as described in their privacy policy at calendly.com.",
            },
            {
              heading: "Cookies",
              body: "Our website uses minimal cookies necessary for the site to function. We do not use tracking cookies or third-party advertising cookies. Third-party services embedded on our site (such as Calendly) may set their own cookies subject to their own privacy policies.",
            },
            {
              heading: "Data retention",
              body: "We retain your information for as long as you remain subscribed to our email list. If you unsubscribe, your data may remain in our systems for a reasonable period before being purged. You can request deletion of your data at any time by emailing us.",
            },
            {
              heading: "Your rights",
              body: "You have the right to access the personal data we hold about you, to request correction of inaccurate data, to request deletion of your data, and to withdraw your consent to marketing at any time. To exercise any of these rights, email us at mjcsolutions.io@gmail.com.",
            },
            {
              heading: "Changes to this policy",
              body: "We may update this privacy policy from time to time. When we do, we will update the date at the top of this page. Continued use of our website after changes are posted constitutes your acceptance of those changes.",
            },
            {
              heading: "Contact",
              body: "If you have any questions about this privacy policy or how we handle your data, please email us at mjcsolutions.io@gmail.com.",
            },
          ].map(({ heading, body }) => (
            <div key={heading} style={{ marginBottom: 40 }}>
              <h2 style={{
                fontSize: 17,
                fontWeight: 600,
                color: "var(--dark)",
                marginBottom: 10,
              }}>
                {heading}
              </h2>
              <p style={{
                fontSize: 15,
                color: "var(--muted)",
                lineHeight: 1.8,
              }}>
                {body}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid var(--border)",
        padding: "32px 24px",
        textAlign: "center",
      }}>
        <p style={{ fontSize: 13, color: "var(--muted-light)" }}>
          © {year} BoothMe. All rights reserved.{" "}
          <a href="/privacy" style={{ color: "var(--muted)", textDecoration: "none" }}>Privacy Policy</a>
        </p>
      </footer>
    </div>
  );
}
