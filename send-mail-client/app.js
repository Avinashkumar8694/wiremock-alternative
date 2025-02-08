const nodemailer = require("nodemailer");
const express = require('express')
require("dotenv").config();


const app = express();
app.use(express.json());

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


let jobs = [
  {
    id: 'job1',
    expiryDate: new Date('Mon Jul 03 2023 12:35:46 GMT+0530').getTime(),
    timeoutId: null, // Hold the reference to the setTimeout function
    to: "arjunkumargupta108@gmail.com",
    subject: 'abc',
    message:"Hello world?",
    html: "<b>Hello world?</b>"

  },
  // Add more jobs here...
];

const sendEmail = (job, event) => {
  let mailOptions = {
    from: process.env.SENDER, // sender address
    to: job.to, // list of receivers
    subject: job.subject, // Subject line
    text: job.message, // plain text body
    html: job.html, // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
  });

};

// Function to schedule email notifications for jobs
const scheduleEmailNotifications = (job) => {
  const currentTime = Date.now();
  const timeUntilExpiry = job.expiryDate - currentTime;

  job.timeoutId = setTimeout(() => {
    sendEmail(job, 'Expired');
  }, timeUntilExpiry);
};


// API endpoint to create a job
app.post('/jobs', (req, res) => {
  const { title, expiryDate, to, subject, message, html } = req.body;

  const job = {
    id: `job${jobs.length + 1}`,
    title,
    expiryDate: new Date(expiryDate).getTime(),
    timeoutId: null,
    to,
    subject,
    message,
    html
  };

  jobs.push(job);

  scheduleEmailNotifications(job);
  sendEmail(job, 'Created');

  res.json({ id: job.id });
});

// API endpoint to update a job
app.put('/jobs/:id', (req, res) => {
  const jobId = req.params.id;
  const { title, expiryDate, to, subject, message, html } = req.body;

  const job = jobs.find((j) => j.id === jobId);

  if (job) {
    clearTimeout(job.timeoutId);

    job.title = title || job.title;
    job.expiryDate = expiryDate ? new Date(expiryDate).getTime() : job.expiryDate;
    job.message = message || job.message;
    job.html = html;
    job.subject = subject || job.subject
    job.to = to || job.to;

    scheduleEmailNotifications(job);
    sendEmail(job, 'Updated');

    res.json({ message: `Job ${jobId} updated` });
  } else {
    res.status(404).json({ error: `Job ${jobId} not found` });
  }
});


// API endpoint to delete a job
app.delete('/jobs/:id', (req, res) => {
  const jobId = req.params.id;

  const jobIndex = jobs.findIndex((j) => j.id === jobId);

  if (jobIndex !== -1) {
    const job = jobs[jobIndex];
    clearTimeout(job.timeoutId);

    jobs.splice(jobIndex, 1);

    sendEmail(job, 'Deleted');

    res.json({ message: `Job ${jobId} deleted` });
  } else {
    res.status(404).json({ error: `Job ${jobId} not found` });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

