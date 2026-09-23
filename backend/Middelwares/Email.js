const nodemailer = require("nodemailer");
const transporter = require('../Middelwares/EmailConfig')
const SendEmail = async (email , verifycode)=>{
    try {
  const info = await transporter.sendMail({
    from: '"Mauseeki" <sameerimran967@gmail.com>', // sender address
    to: email,
    subject: "Thank you for using our app. Your OTP is given below!.", // subject line
    text: "Thank you for using our app. Your OTP is given below!.", // plain text body
    html: verifycode
  });

  console.log("Message sent: %s", info.messageId);
  // Preview URL is only available when using an Ethereal test account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
} catch (err) {
  console.error("Error while sending mail:", err);
}
}

module.exports = SendEmail;