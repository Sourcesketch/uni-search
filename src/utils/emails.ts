import axios from 'axios';

interface EmailData {
  userId: string;
  fullName: string;
  email: string;
  course: string;
  university: string;
  applicationId: string;
  documents: { document_type: string; file_path: string }[];
}

export const sendApplicationEmail = async (data: EmailData) => {
    try {
      const response = await axios.post('http://localhost:5000/send-email', data);
      console.log('Email sent successfully:', response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error sending email:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };