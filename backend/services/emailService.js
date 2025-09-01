const sgMail = require('@sendgrid/mail');

const sendOTPEmail = async (email, otp) => {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
      to: email,
      from: process.env.EMAIL_FROM,
      subject: 'Your OTP for Notes App',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Notes App Verification</h2>
          <p>Your One Time Password (OTP) for verification is:</p>
          <h1 style="background: #f4f4f4; padding: 10px; text-align: center; letter-spacing: 5px;">${otp}</h1>
          <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
          <hr style="border: none; border-top: 1px solid #eee;" />
          <p style="color: #888; font-size: 12px;">If you didn't request this, please ignore this email.</p>
        </div>
      `
    };

    await sgMail.send(msg);
    console.log('✅ OTP email sent via SendGrid to:', email);
    
  } catch (error) {
    console.error('SendGrid error:', error.response?.body || error.message);
    // Fallback to console log
    console.log('📧 OTP for', email, ':', otp);
  }
};

module.exports = { sendOTPEmail };