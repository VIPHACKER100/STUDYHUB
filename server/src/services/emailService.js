import nodemailer from 'nodemailer';
import config from '../config/index.js';

class EmailService {
    constructor() {
        this.transporter = null;
        this.isConnected = false;

        // Only create transporter if config exists
        if (config.email.host && config.email.user) {
            this.transporter = nodemailer.createTransport({
                host: config.email.host,
                port: config.email.port,
                secure: config.email.port === 465, // true for 465, false for other ports
                auth: {
                    user: config.email.user,
                    pass: config.email.password,
                },
            });

            this.verifyConnection();
        } else {
            console.warn('⚠️ Email service not configured: SMTP settings missing');
        }
    }

    async verifyConnection() {
        if (!this.transporter) return;
        try {
            await this.transporter.verify();
            this.isConnected = true;
            console.log('✅ Email service - SMTP connection established');
        } catch (error) {
            console.error('❌ Email service - SMTP connection failed:', error.message);
        }
    }

    async sendEmail({ to, subject, html, text }) {
        if (!this.transporter) {
            console.log(`[Email Mock] To: ${to}, Subject: ${subject}`);
            return { messageId: 'mock-id' };
        }

        try {
            const info = await this.transporter.sendMail({
                from: config.email.from || '"StudyHub" <viphacker.100.org@gmail.com>',
                to,
                subject,
                text,
                html,
            });
            console.log(`📧 Email sent: ${info.messageId}`);
            return info;
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }

    async sendWelcomeEmail(user) {
        return this.sendEmail({
            to: user.email,
            subject: 'Welcome to StudyHub!',
            html: `<h1>Welcome, ${user.username}!</h1><p>Thanks for joining StudyHub.</p>`,
        });
    }

    async sendDigest(user, notifications) {
        const notificationList = notifications
            .map(n => `<li><a href="${config.clientUrl}${n.link_url}">${n.title}</a>: ${n.message}</li>`)
            .join('');

        const html = `
            <h2>Daily Digest</h2>
            <p>Here's what you missed:</p>
            <ul>${notificationList}</ul>
            <p><a href="${config.clientUrl}/dashboard">Go to Dashboard</a></p>
        `;

        return this.sendEmail({
            to: user.email,
            subject: 'Your Daily Updates - StudyHub',
            html,
        });
    }
    async sendVerificationEmail(user, token) {
        const verifyUrl = `${config.clientUrl}/verify-email?token=${token}`;
        const html = `
            <h1>Welcome to StudyHub, ${user.username}!</h1>
            <p>Please click the link below to verify your email address:</p>
            <a href="${verifyUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
            <p>Or copy this link: ${verifyUrl}</p>
            <p>This link expires in 24 hours.</p>
        `;

        return this.sendEmail({
            to: user.email,
            subject: 'Verify Your Email - StudyHub',
            html,
        });
    }
    async sendPasswordResetEmail(user, token) {
        const resetUrl = `${config.clientUrl}/reset-password?token=${token}`;
        const html = `
            <h1>Password Reset Request</h1>
            <p>You requested a password reset for your StudyHub account.</p>
            <p>Click the link below to reset your password:</p>
            <a href="${resetUrl}" style="background-color: #F44336; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
            <p>Or copy this link: ${resetUrl}</p>
            <p>This link expires in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
        `;

        return this.sendEmail({
            to: user.email,
            subject: 'Reset Your Password - StudyHub',
            html,
        });
    }
}

export default new EmailService();

