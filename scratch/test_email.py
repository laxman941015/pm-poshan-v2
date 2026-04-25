import asyncio
import os
from dotenv import load_dotenv
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType

# Force reload env from the backend folder
dotenv_path = os.path.join(os.path.dirname(__file__), '..', 'backend', '.env')
load_dotenv(dotenv_path)

conf = ConnectionConfig(
    MAIL_USERNAME = os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD"),
    MAIL_FROM = os.getenv("MAIL_FROM"),
    MAIL_PORT = int(os.getenv("MAIL_PORT", 587)),
    MAIL_SERVER = os.getenv("MAIL_SERVER", "smtp.gmail.com"),
    MAIL_STARTTLS = os.getenv("MAIL_STARTTLS", "True").lower() == "true",
    MAIL_SSL_TLS = os.getenv("MAIL_SSL_TLS", "False").lower() == "true",
    USE_CREDENTIALS = True,
    VALIDATE_CERTS = True
)

async def test_send():
    html = """
    <html>
    <body>
        <h1>Test Email</h1>
        <p>This is a test to verify SMTP settings.</p>
    </body>
    </html>
    """
    message = MessageSchema(
        subject="SMTP Test - PM-POSHAN Tracker",
        recipients=["laxman941015@gmail.com"], # The user's email from context or a known test email
        body=html,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    try:
        print(f"Attempting to send email using {conf.MAIL_USERNAME}...")
        await fm.send_message(message)
        print("✅ Email sent successfully!")
    except Exception as e:
        print(f"❌ Error sending email: {e}")

if __name__ == "__main__":
    asyncio.run(test_send())
