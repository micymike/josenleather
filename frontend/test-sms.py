import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

smtp_server = 'smtp.gmail.com'
port = 587
smtp_username = "uniconnect693@gmail.com"
#login = '96e1d9001@smtp-brevo.com'
password = 'kdxlnpqemrkrnusi'

sender_email = smtp_username
receiver_email = 'mosesmichael878@gmail.com'  # Change to the recipient's email address
subject = 'Test Email from Brevo SMTP'
body = 'This is a test email sent using Brevo SMTP relay.'

# Create the email message
msg = MIMEMultipart()
msg['From'] = sender_email
msg['To'] = receiver_email
msg['Subject'] = subject
msg.attach(MIMEText(body, 'plain'))

try:
    with smtplib.SMTP(smtp_server, port) as server:
        server.starttls()
        server.login(smtp_username, password)
        server.sendmail(sender_email, receiver_email, msg.as_string())
    print('Email sent successfully!')
except Exception as e:
    print(f'Error sending email: {e}')
