from celery import Celery
from server.utils.data_util import getProfessionalsWithPendingRequests, getUsersWithServiceRequests
from flask_mail import Message
from main import mail
import datetime
from celery import Celery
from celery.schedules import crontab

# PYTHONPATH=$(pwd) celery -A tasks.celeryApp worker -B --loglevel=info


celeryApp = Celery()
celeryApp.conf.update(
    broker_url='redis://localhost:6379/0',
    result_backend='redis://localhost:6379/0',
    timezone='Asia/Kolkata'
)

celeryApp.autodiscover_tasks(["tasks"])
@celeryApp.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=18, minute=0),
        checkAndSendDailyReminder.s(),
    ),

    sender.add_periodic_task(
        crontab(day_of_month='1', hour=0, minute=0),
        sendMonthlyReportToUsers.s(),
    )


@celeryApp.task
def checkAndSendDailyReminder():
    pendingRequestProfessionals = getProfessionalsWithPendingRequests()
    for professional in pendingRequestProfessionals:
        sendNotifierEmailToProfessional(professional)

def sendNotifierEmailToProfessional(professional):
    msg = Message("EM Subject", recipients=[professional['email']])
    msg.html = f"""
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>EssentialMend Notifier</title>
    </head>
    <body style="font-family: monospace;text-align: center;">
        <h1>EssentialMend</h1>
        <p>Hi {professional['name']}, Looks like you were offline for a while now and there are some pending requests that are yet to be viewed. Kindly get back to them.</p>
        <section>
            <h2>How to Respond</h2>
            <p>To respond to the pending requests, please follow these steps:</p>
            <p>Log in to your account</p>
            <p>Navigate to the 'Service Requests' section</p>
            <p>Find your pending requests under the pending tab</p>
        </section>
        <a href="http://localhost:2023" style="display: block;margin-top: '4px';margin-inline: auto;width: fit-content; color: white;background-color: black;padding: 10px 20px;border-radius: 5px;text-decoration: none;">Open EssentialMend Now</a>
    </body>
    </html>
    """
    mail.send(msg)
    
@celeryApp.task
def sendMonthlyReportToUsers():
    usersWithServiceRequests = getUsersWithServiceRequests()
    for user in usersWithServiceRequests:
        createAndSendMonthlyReportToUser(user)

def createAndSendMonthlyReportToUser(user):
    msg = Message("Monthly Service Report", recipients=[user['email']])
    service_requests = user['serviceRequests']
    table_rows = ""
    for request in service_requests:
        created_at = datetime.datetime.fromtimestamp(int(request['createdAt']) / 1000).strftime('%Y-%m-%d %H:%M:%S')
        closed_at = datetime.datetime.fromtimestamp(int(request['closedAt']) / 1000).strftime('%Y-%m-%d %H:%M:%S') if request.get('closedAt') else 'N/A'
        table_rows += f"""
        <tr>
            <td>{request['serviceInfo']['name']}</td>
            <td>{request['professionalInfo']['name']}</td>
            <td>{request['professionalInfo']['email']}</td>
            <td>{request['status']}</td>
            <td>{request['statusInfo']}</td>
            <td>{created_at}</td>
            <td>{closed_at}</td>
        </tr>
        """
    msg.html = f"""
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Monthly Service Report</title>
    </head>
    <body style="font-family: Arial, sans-serif;">
        <h1>Monthly Service Report</h1>
        <p>Dear {user['name']},</p>
        <p>Here is your monthly service report:</p>
        <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
            <thead>
                <tr>
                    <th>Service Name</th>
                    <th>Professional Name</th>
                    <th>Professional Email</th>
                    <th>Status</th>
                    <th>Status Info</th>
                    <th>Created At</th>
                    <th>Closed At</th>
                </tr>
            </thead>
            <tbody>
                {table_rows}
            </tbody>
        </table>
        <p>Thank you for using our services!</p>
    </body>
    </html>
    """
    mail.send(msg)