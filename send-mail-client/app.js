const nodemailer = require("nodemailer");

// create reusable transporter object using SMTP transport
let transporter = nodemailer.createTransport({
  host: process.env.HOST,
  port: 587,
  secure: process.env.SECURE, // true for 465, false for other ports
  auth: {
    user: process.env.USERNAME,
    pass: process.env.PASSWORD,
  },
  tls: {
    rejectUnauthorized: process.env.NODE_TLS_REJECT_UNAUTHORIZED,
  },
});

// setup email data
let mailOptions = {
  from: '"OCR" <ocr@ocr.161-97-91-188.nip.io>', // sender address
  to: "sagar.v@neutrinos.co", // list of receivers
  subject: "Hello", // Subject line
  text: "Hello world?", // plain text body
  html: "<b>Hello world?</b>", // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log(error);
  }
  console.log("Message sent: %s", info.messageId);
});
