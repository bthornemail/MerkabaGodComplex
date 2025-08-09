import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
// const nodemailer = require("nodemailer");

async function main() {
  const hostname = "hostname from account page";
  const username = "username from account page";
  const password  = "password from account page";

  const transporter = nodemailer.createTransport({
    host: hostname,
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: username,
      pass: password,
    },
    logger: true
  })
  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Sender Name" <from@example.net>',
      to: "to@example.com",
      subject: "Hello from node",
      text: "Hello world?",
      html: "<strong>Hello world?</strong>",
      headers: { 'x-myheader': 'test header' }
    });
  
    console.log("Message sent: %s", info.response);
    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  }
  
  main().catch(console.error);
}
