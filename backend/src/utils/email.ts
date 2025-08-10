import nodemailer from 'nodemailer';
import { generateAccessToken } from './token';


export const sendPasswordResetEmail = async (email: string, userId: string) => {
  const token = generateAccessToken({ sub: userId.toString() });
  const resetLink = `${process.env.FRONTEND_URL_LOCAL}/forgot-password?token=${token}`;

  await transporter.sendMail({
    from: `ShopEase <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Reset Your Password',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
          <style>
              body {
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  background: #e7e7e7;
                  padding: 20px;
              }
              .email-body{
                background: #e7e7e7;
              }
              .email-container{
                width: 650px;
                margin: auto;
                background: #fff;
              }
              .header {
                  text-align: center;
                  border-bottom: 1px solid #eaeaea;
              }
              .logo {
                  height: auto;
                  color: #00a63e;
                  font-size: 32px;
                  text-align: center;
                  margin: 0;
              }
              .content {
                  padding: 30px 20px;
              }
              .button {
                  display: inline-block;
                  padding: 12px 24px;
                  background-color: #4CAF50;
                  color: white !important;
                  text-decoration: none;
                  border-radius: 4px;
                  font-weight: bold;
                  margin: 20px 0;
              }
              .footer {
                  text-align: center;
                  padding: 20px;
                  font-size: 12px;
                  color: #777;
                  border-top: 1px solid #eaeaea;
              }
              .code {
                  font-family: monospace;
                  background-color: #f4f4f4;
                  padding: 2px 4px;
                  border-radius: 3px;
              }
              @media only screen and (max-width: 600px) {
                .email-container{
                  width: 100%
                }
                  .content {
                      padding: 20px 10px;
                  }
                  .button {
                      display: block;
                      text-align: center;
                  }
              }
          </style>
      </head>
      <body>
        <div class="email-body">
          <div class="email-container">
            <div class="header">
                <h1 class="logo">${process.env.APP_NAME}</h1>
                <h2>Password Reset Request</h2>
            </div>
          
            <div class="content">
                <p>Hello,</p>
                <p>We received a request to reset your password for your ${process.env.APP_NAME} account.</p>
                
                <p style="text-align: center;">
                    <a href="${resetLink}" class="button">Reset Password</a>
                </p>
                
                <p>If you didn't request this, you can safely ignore this email. This link will expire in 15 minutes.</p>
                
                <p>Or copy and paste this link into your browser:</p>
                <p class="code">${resetLink}</p>
            </div>
            
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} ${process.env.APP_NAME}. All rights reserved.</p>
                <p>If you have any questions, contact us at <a href="mailto:${process.env.SUPPORT_EMAIL}">${process.env.SUPPORT_EMAIL}</a></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    // Text fallback for email clients that don't render HTML
    text: `
      Password Reset Request\n
      We received a request to reset your password for your ${process.env.APP_NAME} account.\n\n
      Please click the following link to reset your password (expires in 15 minutes):\n
      ${resetLink}\n\n
      If you didn't request this, you can safely ignore this email.\n\n
      © ${new Date().getFullYear()} ${process.env.APP_NAME}. All rights reserved.
    `
  });
};


export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465 (SSL)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
} as nodemailer.TransportOptions);
