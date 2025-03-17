require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
 
app.post('/send-email', async (req, res) => {
    const { userId, fullName, email, course, university, applicationId, documents } = req.body;
  
    if (!userId || !fullName || !email || !course || !university || !applicationId) {
      console.error('Missing required fields:', req.body);
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    const documentList = documents.map(doc => `- ${doc.document_type}: ${doc.file_path}`).join('\n');
  
    const emailData = {
      from: 'admin@yourdomain.com',  // Change this to a verified domain if needed
      to: 'admin@yourdomain.com',
      subject: `New Application Submitted - ${fullName}`,
      html: `
        <h2>New Application Submission</h2>
        <p><strong>User ID:</strong> ${userId}</p>
        <p><strong>Full Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>University:</strong> ${university}</p>
        <p><strong>Course:</strong> ${course}</p>
        <p><strong>Application ID:</strong> ${applicationId}</p>
        <h3>Documents:</h3>
        <pre>${documentList}</pre>
      `
    };
  
    console.log('Sending email with data:', JSON.stringify(emailData, null, 2)); // Log request
  
    try {
      const response = await axios.post('https://api.resend.com/emails', 
        emailData,
        {
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      console.log('Email sent successfully:', response.data);
      res.status(200).json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
      console.error('Resend API Error:', error.response?.data || error.message);
      res.status(500).json({ success: false, error: error.response?.data || error.message });
    }
  });  


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
