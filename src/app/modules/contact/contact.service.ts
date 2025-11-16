import nodemailer from "nodemailer";

const getTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error("SMTP config missing in env");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
};

const sendContact = async (payload: any) => {
  const { name, email, subject, message } = payload || {};

  if (!message || !email) {
    throw new Error("Missing required fields: email and message");
  }

  const receiver = process.env.CONTACT_RECEIVER_EMAIL || process.env.SMTP_USER;
  const transporter = getTransporter();

  const mailSubject = subject
    ? `Contact: ${subject} — ${name ?? "Anonymous"}`
    : `New contact from ${name ?? "Anonymous"}`;

  const html = `
    <p><strong>Name:</strong> ${name ?? "Anonymous"}</p>
    <p><strong>Email:</strong> ${email}</p>
    ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ""}
    <p><strong>Message:</strong></p>
    <p>${(message || "").replace(/\n/g, "<br/>")}</p>
  `;

  const info = await transporter.sendMail({
    from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
    to: receiver,
    replyTo: email,
    subject: mailSubject,
    html,
  });

  console.log(info);
  return { messageId: info.messageId, accepted: info.accepted };
};

export const ContactService = { sendContact };
