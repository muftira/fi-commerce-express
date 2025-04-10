const nodemailer = require('nodemailer');
require('dotenv').config();

// Konfigurasi transporter Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USER_NODEMAILER,
    pass: process.env.PASS_NODEMAILER, // Gunakan App Password, bukan password asli
  },
});

// Fungsi kirim email reset password
const sendResetPasswordEmail = async (email, resetLink) => {
  const mailOptions = {
    from: process.env.USER_NODEMAILER,
    to: email,
    subject: 'Reset Password Request',
    html: `
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}" style="color: blue; font-weight: bold;">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return {
      success: true,
      message: 'Email has been sent',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to send email',
      error,
    };
  }
};

module.exports = sendResetPasswordEmail;
