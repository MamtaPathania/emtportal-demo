const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var insta_alertRouter=require('./routes/insta_alert/insta_alert.router')
require('dotenv').config();
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT 
console.log("port",port)

app.use(bodyParser.json());
app.use(cors());

app.use(express.static(path.join(__dirname, 'build')));

app.use('/',insta_alertRouter)

app.post('/api/send-email', async (req, res) => {
  try {
    // Create a nodemailer transporter using your email service details
    const transporter = nodemailer.createTransport({
      service: 'mamtapathania1999@gmail.com', // e.g., 'Gmail'
      auth: {
        user: 'mamtapathania1999@gmail.com', // your email address
        pass: 'Pathania@786', // your email password (use environment variables for security)
      },
    });
// Message object
const mailOptions = {
  from: 'mamtapathania1999@gmail.com',
  to: 'mamtapathania1999@gmail.com', // recipient's email address
  subject: 'Subject of your email',
  text: 'Body of your email',
  attachments: [
    {
      filename: 'subscription_data.xlsx',
      content: req.body.xlsx, // The Excel file content you received from the frontend
    },
  ],
};

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {

  console.log(`Server running on port ${port}`);
});
