const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "sameerimran967@gmail.com",
    pass: "mhgq omrz mqxn lvif",
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Email error:", error);
  } else {
    console.log("✅ Email server is ready");
  }
});

module.exports = transporter;