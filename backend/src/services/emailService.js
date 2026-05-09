const nodemailer = require("nodemailer");

/**
 * Nodemailer transporter configured for Gmail via STARTTLS (port 587).
 * Using explicit host/port instead of the `service` shorthand to give us
 * full control and avoid Render's IPv6 / port-465 socket errors.
 */
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // STARTTLS – upgrades to TLS after connecting
  family: 4,     // Force IPv4 – avoids ENETUNREACH on Render's network
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
  tls: {
    rejectUnauthorized: true,
    minVersion: "TLSv1.2",
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  connectionTimeout: 10000,  // 10s – abort if SMTP server doesn't respond
  greetingTimeout: 10000,    // 10s – abort if SMTP greeting hangs
  socketTimeout: 15000,      // 15s – abort idle socket (prevents hanging)
});

// Verify SMTP connection on startup so failures are visible in logs immediately
transporter.verify((error) => {
  if (error) {
    console.error("❌ SMTP transporter verification failed:", error.message);
  } else {
    console.log("✅ SMTP transporter is ready to send messages");
  }
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: `"RideMate" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to} — messageId: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ Email send failed to ${to}:`, error.message);
    // Never throw — callers must not crash because of email failures
    return null;
  }
};

module.exports = { sendEmail };
