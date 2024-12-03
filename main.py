import os
from flask import Flask
from flask_restful import Api
from database.database import database
from server.routes.route import initAppRoutes
from server.routes.api import initApiRoutes
from flask_mail import Mail

app = Flask(__name__)
api = Api(app)

app.jinja_env.trim_blocks = True
app.jinja_env.lstrip_blocks = True

currentDir = os.path.abspath(os.path.dirname(__file__))
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(currentDir, "./database/essentialmend.sqlite3")
app.config['CELERY_BROKER_URL'] = 'redis://localhost:6379/0'
app.config['CELERY_RESULT_BACKEND'] = 'redis://localhost:6379/1'

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = "essentialmendnotifier@gmail.com"
app.config['MAIL_PASSWORD'] = "pbykzghmmkiqggat"
app.config['MAIL_DEFAULT_SENDER'] = "essentialmendnotifier@gmail.com"

mail = Mail(app)

database.init_app(app)

initAppRoutes(app)
initApiRoutes(api)

app.app_context().push()

with app.app_context():
    if not os.path.exists(os.path.join(currentDir, "./database/essentialmend.sqlite3")):
        database.create_all()

if (__name__ == '__main__'):
    app.run(
        debug=True,
        port=2023
    )