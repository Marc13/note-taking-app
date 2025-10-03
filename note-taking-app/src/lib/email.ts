import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Email templates
export async function sendVerificationEmail(email: string, url: string) {
  try {
    await resend.emails.send({
      from: 'Note Taking App <noreply@yourapp.com>', // Replace with your domain
      to: email,
      subject: 'Verify your email address',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Note Taking App!</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Please verify your email address to get started</p>
          </div>
          
          <div style="padding: 40px 20px; background: #f8fafc;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              Thank you for signing up! Click the button below to verify your email address and activate your account.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${url}" 
                 style="background: #3b82f6; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">
                Verify Email Address
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
              If the button doesn't work, you can copy and paste this link into your browser:
            </p>
            <p style="color: #3b82f6; font-size: 14px; word-break: break-all; margin: 10px 0 0 0;">
              ${url}
            </p>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
              This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
            </p>
          </div>
          
          <div style="background: #1f2937; padding: 20px; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              © 2024 Note Taking App. All rights reserved.
            </p>
          </div>
        </div>
      `,
    })
  } catch (error) {
    console.error('Failed to send verification email:', error)
    throw error
  }
}

export async function sendPasswordResetEmail(email: string, url: string) {
  try {
    await resend.emails.send({
      from: 'Note Taking App <noreply@yourapp.com>', // Replace with your domain
      to: email,
      subject: 'Reset your password',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Password Reset</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Reset your Note Taking App password</p>
          </div>
          
          <div style="padding: 40px 20px; background: #f8fafc;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              You requested a password reset for your Note Taking App account. Click the button below to reset your password.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${url}" 
                 style="background: #ef4444; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
              If the button doesn't work, you can copy and paste this link into your browser:
            </p>
            <p style="color: #3b82f6; font-size: 14px; word-break: break-all; margin: 10px 0 0 0;">
              ${url}
            </p>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
              This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
            </p>
          </div>
          
          <div style="background: #1f2937; padding: 20px; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              © 2024 Note Taking App. All rights reserved.
            </p>
          </div>
        </div>
      `,
    })
  } catch (error) {
    console.error('Failed to send password reset email:', error)
    throw error
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    await resend.emails.send({
      from: 'Note Taking App <noreply@yourapp.com>', // Replace with your domain
      to: email,
      subject: 'Welcome to Note Taking App! 🎉',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome, ${name}! 🎉</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Your account is ready to use</p>
          </div>
          
          <div style="padding: 40px 20px; background: #f8fafc;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              Thank you for joining Note Taking App! Your account has been successfully created and verified.
            </p>
            
            <div style="background: white; padding: 30px; border-radius: 8px; margin: 30px 0;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 20px;">Get Started</h2>
              <ul style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li>Create your first note</li>
                <li>Organize notes with categories</li>
                <li>Add tags for better organization</li>
                <li>Set up your profile</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL}" 
                 style="background: #10b981; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">
                Start Taking Notes
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
              If you have any questions, feel free to reach out to our support team.
            </p>
          </div>
          
          <div style="background: #1f2937; padding: 20px; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              © 2024 Note Taking App. All rights reserved.
            </p>
          </div>
        </div>
      `,
    })
  } catch (error) {
    console.error('Failed to send welcome email:', error)
    throw error
  }
}

export async function sendMagicLinkEmail(email: string, url: string) {
  try {
    await resend.emails.send({
      from: 'Note Taking App <noreply@yourapp.com>', // Replace with your domain
      to: email,
      subject: 'Your magic link to Note Taking App',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Magic Link Login</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Sign in to Note Taking App</p>
          </div>
          
          <div style="padding: 40px 20px; background: #f8fafc;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              Click the button below to sign in to your Note Taking App account. No password required!
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${url}" 
                 style="background: #8b5cf6; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">
                Sign In with Magic Link
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
              If the button doesn't work, you can copy and paste this link into your browser:
            </p>
            <p style="color: #3b82f6; font-size: 14px; word-break: break-all; margin: 10px 0 0 0;">
              ${url}
            </p>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
              This link will expire in 15 minutes. If you didn't request this, you can safely ignore this email.
            </p>
          </div>
          
          <div style="background: #1f2937; padding: 20px; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              © 2024 Note Taking App. All rights reserved.
            </p>
          </div>
        </div>
      `,
    })
  } catch (error) {
    console.error('Failed to send magic link email:', error)
    throw error
  }
}
