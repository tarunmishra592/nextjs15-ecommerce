import nodemailer from 'nodemailer';
import path from 'path';
import ejs from 'ejs';
import { transporter } from '../utils/email';



/**
 * Send order confirmation email
 * @param {string} email - Customer email
 * @param {Order} order - Order details
 * @returns {Promise<any>}
 */
export const sendOrderConfirmationEmail = async (
  email: string,
  order: any
): Promise<any> => {
  try {
    // Render HTML email template (using EJS)
    const templatePath = path.join(__dirname, '../templates/orderConfirmation.ejs');
    const html = await ejs.renderFile(templatePath, { order });

    // Email options with TypeScript typing
    const mailOptions: nodemailer.SendMailOptions = {
      from: `"ShopEase" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Order Confirmation #${order._id}`,
      html,
    };

    // Send email and return the result
    const info = await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent to:', email);
    return info;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};