from flask import make_response, render_template, redirect, request, g, jsonify
from server.utils.authentication_utils import isValidRequest
from server.utils.data_util import getUserConfig
import os


PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))

def initAppRoutes (app):

    @app.before_request
    def validateRequest():
        g.cookies = []
        g.config = {}
        if (
            request.endpoint == "static" or 
            request.path.startswith("/api/signin") or 
            request.path.startswith("/api/signup") or
            request.path.startswith("/api/services") or
            request.path.startswith("/api/user")
        ):
            pass
        else:
            validationObj = isValidRequest({
                "emat": request.cookies.get("emat"),
                "emrt": request.cookies.get("emrt")
            })

            g.cookies = validationObj["cookies"]
            uid = validationObj["uid"] if validationObj["isValid"] else None
            g.uid = uid
            g.config = getUserConfig(uid)
            if (request.path == "/" or request.path == "/logout"):
                pass
            elif (validationObj["isValid"]):
                if (request.path == "/account-blocked" and g.config["userInfo"]["status"] != "blocked"):
                    return redirect("/", 302)
                if (not g.config["authorized"] and request.path != "/professional-request-pending" and request.path != "/professional-service-not-found") and request.path != "/professional-request-declined" and request.path != "/account-blocked":
                    if (g.config["userInfo"]["status"] == "blocked"):
                        return redirect("/account-blocked")
                    if (g.config["isServiceNotFound"]):
                        return redirect("/professional-service-not-found")
                    if (g.config["userInfo"]["isProfessional"] and g.config["professionalRequestInfo"]["status"] == "declined"):
                        return redirect("/professional-request-declined")
                    if (g.config["userInfo"]["isProfessional"]):
                        return redirect("/professional-request-pending")
                    else:
                        return redirect("/")
                if (request.path == "/register" or (request.path == "/professional-request-pending" and g.config["authorized"])):
                    return redirect("/dashboard", 302)
            elif (request.path != "/register"):
                return redirect("/register", 302)


    @app.route("/")
    @app.route('/<path>') 
    def index(path=None):
        response = make_response(
            render_template(
                "index.html",
                config=(g.config or {})
            )
        )
        return response