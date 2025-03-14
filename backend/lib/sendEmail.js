import nodemailer from "nodemailer";
import EmailLog from "../models/emailLog.model.js";

const sendEmail = async ({
  to = "",
  cc = "",
  bcc = "",
  subject = "",
  intro = "",
  attachments = [],
}) => {
  let config = {
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  };

  let mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    cc,
    bcc,
    subject,
    html: intro,
    attachments,
  };

  let transporter = nodemailer.createTransport(config);

  try {
    await transporter.sendMail(mailOptions);
    await new EmailLog({
      subject,
      status: 1,
      sender: process.env.EMAIL_USER,
      recipientTO: to,
      recipientCC: cc,
      errorMessage: null,
    }).save();
    console.log("Mail sent successfully");
  } catch (error) {
    console.log("Error: ", error);
    await new EmailLog({
      subject,
      status: 0,
      sender: process.env.EMAIL_USER,
      recipientTO: to,
      recipientCC: cc,
      errorMessage: error.message,
    }).save();
  }
};

export default sendEmail;
