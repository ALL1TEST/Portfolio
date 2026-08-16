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
    subject: `New Contact: ${data.subject}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">New Contact Form Submission</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr><td style="padding: 8px; border: 1px solid #eee; font-weight: bold;">Name</td><td style="padding: 8px; border: 1px solid #eee;">${data.name}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #eee; font-weight: bold;">Email</td><td style="padding: 8px; border: 1px solid #eee;">${data.email}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #eee; font-weight: bold;">Subject</td><td style="padding: 8px; border: 1px solid #eee;">${data.subject}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #eee; font-weight: bold;">Date</td><td style="padding: 8px; border: 1px solid #eee;">${data.createdAt.toISOString()}</td></tr>
        </table>
        <div style="margin-top: 16px; padding: 16px; background: #f9f9f9; border-radius: 8px;">
          <p style="font-weight: bold; margin-bottom: 8px;">Message:</p>
          <p style="white-space: pre-wrap;">${data.message}</p>
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
