import os
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType  # type: ignore
from pydantic import EmailStr
from dotenv import load_dotenv
from datetime import datetime

def get_mail_config():
    # Force reload env from the backend folder
    dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
    load_dotenv(dotenv_path)
    
    return ConnectionConfig(
        MAIL_USERNAME = os.getenv("MAIL_USERNAME"),
        MAIL_PASSWORD = os.getenv("MAIL_PASSWORD").replace(" ", "") if os.getenv("MAIL_PASSWORD") else None,
        MAIL_FROM = os.getenv("MAIL_FROM"),
        MAIL_PORT = int(os.getenv("MAIL_PORT", 587)),
        MAIL_SERVER = os.getenv("MAIL_SERVER", "smtp.gmail.com"),
        MAIL_STARTTLS = os.getenv("MAIL_STARTTLS", "True").lower() == "true",
        MAIL_SSL_TLS = os.getenv("MAIL_SSL_TLS", "False").lower() == "true",
        USE_CREDENTIALS = True,
        VALIDATE_CERTS = True,
        MAIL_FROM_NAME = "PM-POSHAN Tracker"
    )

async def send_reset_password_email(email: EmailStr, otp: str):
    conf = get_mail_config()
    log_file = "email_debug.log"
    
    with open(log_file, "a") as f:
        f.write(f"[{datetime.now()}] Attempting to send OTP to {email}...\n")
    
    html = f"""
    <html>
    <body style="font-family: sans-serif; color: #333; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #2563eb; text-align: center;">PM-POSHAN Tracker</h2>
            <p>Hello,</p>
            <p>We received a request to reset your password. Please use the 6-digit Verification Code (OTP) below to proceed:</p>
            <div style="text-align: center; margin: 30px 0;">
                <span style="display: inline-block; padding: 15px 30px; background-color: #f3f4f6; border: 1px dashed #d1d5db; font-size: 32px; font-weight: bold; color: #1f2937; letter-spacing: 5px;">
                    {otp}
                </span>
            </div>
            <p>This code will expire in 1 hour. Please return to the website and enter it to set your new password.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="font-size: 12px; color: #9ca3af; text-align: center;">PM-POSHAN Tracker - Secure Password Recovery</p>
        </div>
    </body>
    </html>
    """

    message = MessageSchema(
        subject="Your Password Reset OTP - PM-POSHAN Tracker",
        recipients=[email],
        body=html,
        subtype=MessageType.html
    )

    try:
        fm = FastMail(conf)
        await fm.send_message(message)
        with open(log_file, "a") as f:
            f.write(f"[{datetime.now()}] ✅ OTP sent successfully to {email}\n")
    except Exception as e:
        with open(log_file, "a") as f:
            f.write(f"[{datetime.now()}] ❌ Failed to send OTP to {email}: {str(e)}\n")
        print(f"ERROR sending email: {e}")
