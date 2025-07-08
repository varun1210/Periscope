import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
from ..config import settings


class EmailService:
    """Email service for sending verification and reset emails"""
    
    def __init__(self):
        self.smtp_server = settings.smtp_server
        self.smtp_port = settings.smtp_port
        self.smtp_username = settings.smtp_username
        self.smtp_password = settings.smtp_password
    
    def send_verification_email(self, to_email: str, verification_token: str) -> bool:
        """Send email verification email"""
        
        if not self._is_configured():
            print(f"Email not configured. Verification token for {to_email}: {verification_token}")
            return True  # Return True for development
        
        subject = "Verify Your Email Address"
        
        # Use frontend URL from config
        from ..config import settings
        verification_url = f"{settings.frontend_url}/verify-email?token={verification_token}"
        
        body = f"""
        Hi there!
        
        Thank you for registering. Please click the link below to verify your email address:
        
        {verification_url}
        
        If you didn't create an account, please ignore this email.
        
        Best regards,
        The Job Application Team
        """
        
        return self._send_email(to_email, subject, body)
    
    def send_password_reset_email(self, to_email: str, reset_token: str) -> bool:
        """Send password reset email"""
        
        if not self._is_configured():
            print(f"Email not configured. Reset token for {to_email}: {reset_token}")
            return True  # Return True for development
        
        subject = "Reset Your Password"
        
        # Use frontend URL from config
        from ..config import settings
        reset_url = f"{settings.frontend_url}/reset-password?token={reset_token}"
        
        body = f"""
        Hi there!
        
        You requested to reset your password. Please click the link below to reset it:
        
        {reset_url}
        
        This link will expire in 24 hours.
        
        If you didn't request this reset, please ignore this email.
        
        Best regards,
        The Job Application Team
        """
        
        return self._send_email(to_email, subject, body)
    
    def _send_email(self, to_email: str, subject: str, body: str) -> bool:
        """Send email using SMTP"""
        try:
            msg = MIMEMultipart()
            msg['From'] = self.smtp_username
            msg['To'] = to_email
            msg['Subject'] = subject
            
            msg.attach(MIMEText(body, 'plain'))
            
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_username, self.smtp_password)
                server.send_message(msg)
            
            return True
            
        except Exception as e:
            print(f"Failed to send email to {to_email}: {str(e)}")
            return False
    
    def _is_configured(self) -> bool:
        """Check if email service is properly configured"""
        return all([
            self.smtp_server,
            self.smtp_port,
            self.smtp_username,
            self.smtp_password
        ])