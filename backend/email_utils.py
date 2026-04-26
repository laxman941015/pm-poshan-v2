import os
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType  # type: ignore
from pydantic import EmailStr
from dotenv import load_dotenv
from datetime import datetime

def get_mail_config():
    return ConnectionConfig(
        MAIL_USERNAME = os.getenv("MAIL_USERNAME"),
        MAIL_PASSWORD = os.getenv("MAIL_PASSWORD"),
        MAIL_FROM = os.getenv("MAIL_FROM"),
        MAIL_PORT = int(os.getenv("MAIL_PORT", 587)),
        MAIL_SERVER = os.getenv("MAIL_SERVER", "smtp.gmail.com"),
        MAIL_STARTTLS = os.getenv("MAIL_STARTTLS", "True").lower() == "true",
        MAIL_SSL_TLS = os.getenv("MAIL_SSL_TLS", "False").lower() == "true",
        USE_CREDENTIALS = True,
        VALIDATE_CERTS = True,
        MAIL_FROM_NAME = os.getenv("MAIL_FROM_NAME", "PM-POSHAN Tracker")
    )

async def send_reset_password_email(email: EmailStr, otp: str):
    conf = get_mail_config()
    
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
    except Exception as e:
        print(f"ERROR sending email: {e}")
        raise e

async def send_master_security_otp(email: EmailStr, otp: str, action: str = "unlock administrative settings"):
    conf = get_mail_config()
    
    html = f"""
    <html>
    <body style="font-family: sans-serif; color: #333; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #ef4444; border-radius: 15px;">
            <h2 style="color: #ef4444; text-align: center;">🛡️ MASTER SECURITY ALERT</h2>
            <p>Hello Administrator,</p>
            <p>A request was made to <strong>{action}</strong> on the PM-POSHAN Tracker platform.</p>
            <p>Please use the following 6-digit Security Code to proceed:</p>
            <div style="text-align: center; margin: 30px 0;">
                <span style="display: inline-block; padding: 15px 30px; background-color: #fee2e2; border: 2px solid #ef4444; font-size: 36px; font-weight: 900; color: #b91c1c; letter-spacing: 8px; border-radius: 10px;">
                    {otp}
                </span>
            </div>
            <p style="color: #6b7280; font-size: 14px;">This code is valid for 10 minutes. If you did not initiate this request, please change your credentials immediately.</p>
            <hr style="border: 0; border-top: 1px solid #fee2e2; margin: 30px 0;">
            <p style="font-size: 11px; color: #9ca3af; text-align: center; text-transform: uppercase; letter-spacing: 1px;">PM-POSHAN Tracker - High Privilege Access</p>
        </div>
    </body>
    </html>
    """

    message = MessageSchema(
        subject="SECURITY ALERT: Master OTP for Administrative Access",
        recipients=[email],
        body=html,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    await fm.send_message(message)
