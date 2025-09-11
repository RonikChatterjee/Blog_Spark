import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

//  Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.HOST_EMAIL,
    pass: process.env.HOST_APP_PASSWORD,
  },
})

// ✅ Generate Verification Mail Options
function generateVerificationMailOptions(
  to,
  verificationOTP,
  verificationLINK
) {
  return {
    from:
      process.env.GMAIL_USER || 'BlogSpark <noreply@blogspark.com>',
    to,
    subject: 'Verify Your BlogSpark Email Address', // ✅ Add subject line
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <!--[if mso]>
        <style type="text/css">
            table {border-collapse: collapse;}
        </style>
        <![endif]-->
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: Arial, sans-serif;">
        <!-- ✅ Main container table -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0; padding: 0;">
            <tr>
                <td style="padding: 40px 20px;">
                    <!-- ✅ Email content table -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border: 2px solid #e9ecef; border-radius: 16px; overflow: hidden;">

                        <!-- ✅ Header section -->
                        <tr>
                            <td style="padding: 40px 32px 20px 32px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                                    📧 BlogSpark
                                </h1>
                            </td>
                        </tr>

                        <!-- ✅ Title section -->
                        <tr>
                            <td style="padding: 32px 32px 16px 32px; text-align: center;">
                                <h2 style="margin: 0; color: #212529; font-size: 24px; font-weight: 600; line-height: 1.3;">
                                    Verify Your Email Address
                                </h2>
                            </td>
                        </tr>

                        <!-- ✅ Description section -->
                        <tr>
                            <td style="padding: 0 32px 24px 32px; text-align: center;">
                                <p style="margin: 0; color: #6c757d; font-size: 16px; font-weight: 400; line-height: 1.5;">
                                    Thanks for signing up! Please verify your email address to complete your registration and start your blogging journey.
                                </p>
                            </td>
                        </tr>

                        <!-- ✅ OTP section -->
                        <tr>
                            <td style="padding: 0 32px 24px 32px;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                    <tr>
                                        <td style="background: linear-gradient(135deg, #fef3f3 0%, #fdf2f2 100%); border: 2px dashed #d4af37; border-radius: 12px; padding: 24px; text-align: center;">
                                            <p style="margin: 0 0 8px 0; color: #495057; font-size: 14px; font-weight: 500;">
                                                Your Verification Code
                                            </p>
                                            <h1 style="margin: 0; color: #d4af37; font-size: 42px; font-weight: 700; letter-spacing: 8px; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                                ${verificationOTP}
                                            </h1>
                                            <p style="margin: 8px 0 0 0; color: #6c757d; font-size: 12px;">
                                                This code expires in 10 minutes
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- ✅ Alternative text -->
                        <tr>
                            <td style="padding: 0 32px 16px 32px; text-align: center;">
                                <p style="margin: 0; color: #6c757d; font-size: 14px; font-weight: 400;">
                                    Alternatively, you can verify your account by clicking the button below
                                </p>
                            </td>
                        </tr>

                        <!-- ✅ Button section -->
                        <tr>
                            <td style="padding: 0 32px 32px 32px;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                    <tr>
                                        <td style="background: linear-gradient(135deg, #fef3f3 0%, #fdf2f2 100%); border-radius: 12px; padding: 24px; text-align: center;">
                                            <a href="${verificationLINK}"
                                               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                                      color: #ffffff;
                                                      text-decoration: none;
                                                      font-size: 18px;
                                                      font-weight: 600;
                                                      padding: 16px 32px;
                                                      border-radius: 8px;
                                                      display: inline-block;
                                                      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                                                      transition: all 0.3s ease;">
                                                🚀 Verify My Email
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- ✅ Security notice -->
                        <tr>
                            <td style="padding: 24px 32px; background-color: #f8f9fa; border-top: 1px solid #e9ecef;">
                                <p style="margin: 0; color: #6c757d; font-size: 12px; line-height: 1.4; text-align: center;">
                                    🔒 <strong>Security Notice:</strong> If you didn't create a BlogSpark account, please ignore this email. This verification link will expire in 24 hours.
                                </p>
                            </td>
                        </tr>

                        <!-- ✅ Footer -->
                        <tr>
                            <td style="padding: 20px 32px; background-color: #212529; text-align: center;">
                                <p style="margin: 0; color: #adb5bd; font-size: 12px;">
                                    © 2024 BlogSpark. All rights reserved.<br>
                                    <a href="#" style="color: #d4af37; text-decoration: none;">Unsubscribe</a> |
                                    <a href="#" style="color: #d4af37; text-decoration: none;">Privacy Policy</a>
                                </p>
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `,
  }
}

// ✅ Generate resetPassword Mail Options
function generateResetPasswordMailOptions(to, resetLINK) {
  return {
    from:
      process.env.GMAIL_USER || 'BlogSpark <noreply@blogspark.com>',
    to,
    subject: 'Reset Your BlogSpark Account Password', // ✅ Add subject line
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
            <!--[if mso]>
            <style type="text/css">
                    table {border-collapse: collapse;}
            </style>
            <![endif]-->
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: Arial, sans-serif;">
            <!-- ✅ Main container table -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0; padding: 0;">
                    <tr>
                            <td style="padding: 40px 20px;">
                                    <!-- ✅ Email content table -->
                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border: 2px solid #e9ecef; border-radius: 16px; overflow: hidden;">

                                            <!-- ✅ Header section -->
                                            <tr>
                                                    <td style="padding: 40px 32px 20px 32px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                                                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                                                                    🔑 BlogSpark
                                                            </h1>
                                                    </td>
                                            </tr>

                                            <!-- ✅ Title section -->
                                            <tr>
                                                    <td style="padding: 32px 32px 16px 32px; text-align: center;">
                                                            <h2 style="margin: 0; color: #212529; font-size: 24px; font-weight: 600; line-height: 1.3;">
                                                                    Reset Your Password
                                                            </h2>
                                                    </td>
                                            </tr>

                                            <!-- ✅ Description section -->
                                            <tr>
                                                    <td style="padding: 0 32px 24px 32px; text-align: center;">
                                                            <p style="margin: 0; color: #6c757d; font-size: 16px; font-weight: 400; line-height: 1.5;">
                                                                    We received a request to reset your password. Click the button below to create a new password for your BlogSpark account.
                                                            </p>
                                                    </td>
                                            </tr>

                                            <!-- ✅ Button section -->
                                            <tr>
                                                    <td style="padding: 0 32px 32px 32px;">
                                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                                    <tr>
                                                                            <td style="background: linear-gradient(135deg, #fef3f3 0%, #fdf2f2 100%); border-radius: 12px; padding: 24px; text-align: center;">
                                                                                    <a href="${resetLINK}"
                                                                                         style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                                                                                        color: #ffffff;
                                                                                                        text-decoration: none;
                                                                                                        font-size: 18px;
                                                                                                        font-weight: 600;
                                                                                                        padding: 16px 32px;
                                                                                                        border-radius: 8px;
                                                                                                        display: inline-block;
                                                                                                        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                                                                                                        transition: all 0.3s ease;">
                                                                                            🔒 Reset My Password
                                                                                    </a>
                                                                            </td>
                                                                    </tr>
                                                            </table>
                                                    </td>
                                            </tr>

                                            <!-- ✅ Security notice -->
                                            <tr>
                                                    <td style="padding: 24px 32px; background-color: #f8f9fa; border-top: 1px solid #e9ecef;">
                                                            <p style="margin: 0; color: #6c757d; font-size: 12px; line-height: 1.4; text-align: center;">
                                                                    🔒 <strong>Security Notice:</strong> If you didn't request a password reset, please ignore this email. This reset link will expire in 5 minutes for your security.
                                                            </p>
                                                    </td>
                                            </tr>

                                            <!-- ✅ Footer -->
                                            <tr>
                                                    <td style="padding: 20px 32px; background-color: #212529; text-align: center;">
                                                            <p style="margin: 0; color: #adb5bd; font-size: 12px;">
                                                                    © 2024 BlogSpark. All rights reserved.<br>
                                                                    <a href="#" style="color: #d4af37; text-decoration: none;">Unsubscribe</a> |
                                                                    <a href="#" style="color: #d4af37; text-decoration: none;">Privacy Policy</a>
                                                            </p>
                                                    </td>
                                            </tr>

                                    </table>
                            </td>
                    </tr>
            </table>
    </body>
    </html>
    `,
  }
}

// ✅ Function to Send verification email
async function sendVerificationEmail(
  to,
  verificationOTP,
  verificationLINK
) {
  const mailOptions = generateVerificationMailOptions(
    to,
    verificationOTP,
    verificationLINK
  )
  try {
    await transporter.sendMail(mailOptions)
    console.log('✔ Verification Email Sent')
    return true
  } catch (error) {
    console.error('✖ Error Sending Verification Email:', error)
    return false
  }
}

// ✅ Function to Send reset password email
async function sendResetPasswordEmail(to, resetLINK) {
  const mailOptions = generateResetPasswordMailOptions(to, resetLINK)
  try {
    await transporter.sendMail(mailOptions)
    console.log('✔ Reset Password Email Sent')
    return true
  } catch (error) {
    console.error('✖ Error Sending Reset Password Email:', error)
    return false
  }
}

export { sendVerificationEmail, sendResetPasswordEmail }
