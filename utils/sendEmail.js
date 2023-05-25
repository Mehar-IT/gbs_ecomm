const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

const sendEmail = async ({ email, subject, file, obj }) => {
  const trasporter = nodemailer.createTransport({
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    service: process.env.SMPT_SERVICE,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASS,
    },
  });

  const requiredPath = path.join(__dirname, `../views/${file}.ejs`);

  const html = await ejs.renderFile(requiredPath, obj);

  const mailOption = {
    from: process.env.SMPT_MAIL,
    to: email,
    subject,
    html,
  };

  await trasporter.sendMail(mailOption);
};

module.exports = sendEmail;
