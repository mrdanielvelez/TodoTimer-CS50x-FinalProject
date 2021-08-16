from flask import Blueprint, render_template, request, flash, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from .models import User
from . import db
from flask_login import login_user, login_required, logout_user, current_user

auth = Blueprint("auth", __name__)

@auth.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]
        user = User.query.filter_by(email=email).first()
        if user:
            if password == "":
                flash("Password field cannot be blank.", category="danger")
            elif check_password_hash(user.password_hash, password):
                flash(f"Welcome back, {user.first_name}!", category="success")
                login_user(user, remember=True)
                return redirect(url_for("routes.index"))
            else:
                flash("Incorrect password.", category="danger")
        else:
            flash(f"User with email \"{email}\" does not exist.", category="danger")

    return render_template("login.html", user=current_user)

@auth.route("/logout")
@login_required
def logout():
    logout_user()
    flash("Logged out.", category="warning")
    return redirect(url_for("auth.login"))

@auth.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        email = request.form["email"]
        first_name = request.form["first_name"]
        password = request.form["password"]
        password_confirmation = request.form["password_confirmation"]

        if len(email) < 7:
            flash("Email length must be greater than 7 characters.", category="danger")
        elif len(first_name) < 2:
            flash("First name must be greater than 2 characters.", category="danger")
        elif password == "":
            flash("Password field cannot be blank.", category="danger")
        elif password_confirmation == "":
            flash("Password confirmation field cannot be blank.", category="danger")
        elif password != password_confirmation:
            flash("Passwords do not match.", category="danger")
        elif len(password) < 6:
            flash("Password length must be at least 6 characters.", category="danger")
        elif User.query.filter_by(email=email).first():
            flash(f"User with email \"{email}\" already exists.", category="danger")
        else:
            new_user = User(email=email, first_name=first_name, password_hash=generate_password_hash(password))
            db.session.add(new_user)
            db.session.commit()
            flash("Account successfully created.", category="success")
            login_user(new_user, remember=True)
            return redirect(url_for("routes.index"))

    return render_template("register.html", user=current_user)
