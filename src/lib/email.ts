import nodemailer from 'nodemailer';
import { db } from '@/lib/db';

interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  secure: boolean;
  fromName: string;
  fromEmail: string;
  replyToEmail: string;
}

async function getSmtpConfig(): Promise<SmtpConfig | null> {
  const settings = await db.appSettings.findUnique({ where: { id: 'singleton' } });
  if (!settings || !settings.smtpHost || !settings.smtpUser) return null;
  return {
    host: settings.smtpHost,
    port: settings.smtpPort,
    user: settings.smtpUser,
    pass: settings.smtpPass,
    secure: settings.smtpSecure,
    fromName: settings.fromName || settings.smtpUser,
    fromEmail: settings.fromEmail || settings.smtpUser,
    replyToEmail: settings.replyToEmail || settings.fromEmail || settings.smtpUser,
  };
}

export async function sendEmail({ to, subject, html, replyTo }: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<{ success: boolean; error?: string }> {
  const config = await getSmtpConfig();
  if (!config) return { success: false, error: 'SMTP not configured' };

  try {
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: { user: config.user, pass: config.pass },
    });

    await transporter.sendMail({
      from: `"${config.fromName}" <${config.fromEmail}>`,
      to,
      subject,
      html,
      replyTo: replyTo || config.replyToEmail,
    });

    return { success: true };
  } catch (err) {
    console.error('[Email Service] Error:', err instanceof Error ? err.message : 'Unknown error');
    return { success: false, error: err instanceof Error ? err.message : 'Failed to send email' };
  }
}

export async function sendContactEmail(data: { name: string; email: string; subject: string; message: string; createdAt: Date }): Promise<{ success: boolean; error?: string }> {
  const settings = await db.appSettings.findUnique({ where: { id: 'singleton' } });
  if (!settings?.contactEmailEnabled) return { success: false, error: 'Contact email notifications are disabled' };

  const receiver = settings.contactReceiverEmail || settings.fromEmail || settings.smtpUser;
  if (!receiver) return { success: false, error: 'No receiver email configured' };

  return sendEmail({
    to: receiver,
    subject: `📩 New Contact Message — ${data.subject}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0a0a0a; padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto;">
          
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #ff5722; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">CodeVirtox</h1>
          </div>
        
          <!-- Main Card -->
          <div style="background-color: #1a1a1a; border-radius: 12px; padding: 32px; border: 1px solid #333; box-shadow: 0 8px 16px rgba(0,0,0,0.4);">
            <h2 style="margin: 0 0 8px 0; color: #ffffff; font-size: 20px;">New Contact Message</h2>
            <p style="margin: 0 0 24px 0; color: #a0a0a0; font-size: 14px;">You received a new message from your portfolio contact form.</p>
        
            <!-- Info Grid -->
            <div style="background-color: #222222; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                  <td style="padding: 6px 0; color: #888888; width: 80px; vertical-align: top;">👤 Name</td>
                  <td style="padding: 6px 0; color: #ffffff; font-weight: 500;">${data.name}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #888888; vertical-align: top;">📧 Email</td>
                  <td style="padding: 6px 0; color: #ffffff; font-weight: 500;"><a href="mailto:${data.email}" style="color: #ff5722; text-decoration: none;">${data.email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #888888; vertical-align: top;">📝 Subject</td>
                  <td style="padding: 6px 0; color: #ffffff; font-weight: 500;">${data.subject}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #888888; vertical-align: top;">📅 Date</td>
                  <td style="padding: 6px 0; color: #ffffff; font-weight: 500;">${new Date(data.createdAt).toLocaleString()}</td>
                </tr>
              </table>
            </div>
        
            <!-- Message Box -->
            <h3 style="margin: 0 0 12px 0; color: #ffffff; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Message</h3>
            <div style="background-color: #111111; border-left: 4px solid #ff5722; border-radius: 6px; padding: 20px; margin-bottom: 32px; color: #e0e0e0; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${data.message}</div>
        
            <!-- CTA Button -->
            <div style="text-align: center;">
              <a href="mailto:${data.email}" style="display: inline-block; background-color: #ff5722; color: #ffffff; font-weight: 600; font-size: 15px; text-decoration: none; padding: 14px 28px; border-radius: 8px;">Reply to ${data.name}</a>
            </div>
          </div>
        
          <!-- Footer -->
          <div style="text-align: center; margin-top: 32px; color: #666666; font-size: 12px; line-height: 1.5;">
            <p style="margin: 0 0 8px 0;">This notification was sent from your CodeVirtox Portfolio contact form.</p>
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} CodeVirtox. All rights reserved.</p>
          </div>
          
        </div>
      </div>
    `,
    replyTo: data.email,
  });
}

export async function sendAdminLoginNotification(data: { email: string; ip?: string; userAgent?: string }): Promise<{ success: boolean; error?: string }> {
  const settings = await db.appSettings.findUnique({ where: { id: 'singleton' } });
  if (!settings?.adminLoginEmailEnabled) return { success: false, error: 'Admin login notifications are disabled' };

  const receiver = settings.contactReceiverEmail || settings.fromEmail || settings.smtpUser;
  if (!receiver) return { success: false, error: 'No receiver email configured' };

  return sendEmail({
    to: receiver,
    subject: 'New Admin Login - CodeVirtox Portfolio',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">A successful login was detected.</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr><td style="padding: 8px; border: 1px solid #eee; font-weight: bold;">Account</td><td style="padding: 8px; border: 1px solid #eee;">${data.email}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #eee; font-weight: bold;">Time</td><td style="padding: 8px; border: 1px solid #eee;">${new Date().toISOString()}</td></tr>
          ${data.ip ? `<tr><td style="padding: 8px; border: 1px solid #eee; font-weight: bold;">IP</td><td style="padding: 8px; border: 1px solid #eee;">${data.ip}</td></tr>` : ''}
          ${data.userAgent ? `<tr><td style="padding: 8px; border: 1px solid #eee; font-weight: bold;">Device/Browser</td><td style="padding: 8px; border: 1px solid #eee;">${data.userAgent}</td></tr>` : ''}
        </table>
      </div>
    `,
  });
}

export async function sendTestEmail(to: string): Promise<{ success: boolean; error?: string }> {
  return sendEmail({
    to,
    subject: 'Test Email - CodeVirtox Portfolio',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">SMTP Configuration Test</h2>
        <p>This is a test email to verify your SMTP settings are working correctly.</p>
        <p style="margin-top: 16px; padding: 12px; background: #e8f5e9; border-radius: 8px; color: #2e7d32;">✅ If you received this email, your SMTP configuration is correct!</p>
        <p style="color: #999; margin-top: 16px; font-size: 12px;">Sent at: ${new Date().toISOString()}</p>
      </div>
    `,
  });
}

export async function isSmtpConfigured(): Promise<boolean> {
  const config = await getSmtpConfig();
  return !!config && config.host.length > 0 && config.user.length > 0;
}

export async function sendPasswordResetEmail(email: string, resetUrl: string): Promise<{ success: boolean; error?: string }> {
  return sendEmail({
    to: email,
    subject: 'Password Reset Request - CodeVirtox Portfolio',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
        <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
        <p style="color: #555; font-size: 16px; line-height: 1.5;">You requested a password reset for your CodeVirtox admin account. Please click the button below to set a new password.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #ff5722; color: #fff; padding: 12px 24px; text-decoration: none; font-size: 16px; border-radius: 4px; font-weight: bold; display: inline-block;">Set New Password</a>
        </div>
        <p style="color: #777; font-size: 14px; text-align: center;">If you did not request this, you can safely ignore this email. This link will expire in 30 minutes.</p>
      </div>
    `,
  });
}
