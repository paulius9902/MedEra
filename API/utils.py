from os import environ
from django.core.mail import EmailMessage
from django.conf import settings

class Util:
    @staticmethod
    def send_email(data):
        email=EmailMessage(data['email_subject'],data['email_body'],settings.EMAIL_HOST_USER,[data['to_email']])
        email.send()