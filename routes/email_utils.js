const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "Outlook",
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
      user: "udulacode@outlook.com",
      pass: "r#zor2003@#",
    },
  });

const sendEmail = async (subject, fromAddress, toAddress, template) => {
    const mailOptions = {
        from: fromAddress,
        to: toAddress,
        subject: subject,
        text: template,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
      } catch (error) {
        console.error("Error sending email:",error);
        throw error;
      }
   
};

module.exports = {
    sendEmail
}

