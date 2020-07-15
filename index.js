const Queue = require("bull");
const nodemailer = require("nodemailer"); // 1. Initiating the Queue

try {
  const sendMailQueue = new Queue("sendMail", {
    redis: {
      host: "127.0.0.1",
      port: 6379,
    },
  });
  const data = {
    email: "sardernizam1@gmail.com",
  };

  const options = {
    delay: 60000, // 1 min in ms
    attempts: 2,
  }; // 2. Adding a Job to the Queue
  sendMailQueue.add(data, options);

  // 3. Consumer
  sendMailQueue.process(async (job) => {
    return await sendMail(job.data.email);
  });
  function sendMail(email) {
    return new Promise((resolve, reject) => {
      let mailOptions = {
        from: "tigrowtecheven@gmail.com",
        to: email,
        subject: "Bull - npm",
        text: "This email is from bull job scheduler tutorial.",
      };
      let mailConfig = {
        service: "gmail",
        auth: {
          user: "tigrowtecheven@gmail.com",
          pass: "techtig0605##",
        },
      };
      nodemailer
        .createTransport(mailConfig)
        .sendMail(mailOptions, (err, info) => {
          if (err) {
            
            reject(err);
          } else {
            console.log(info);
            resolve(info);
          }
        });
    });
  }
} catch (error) {
  console.log(error);
}
