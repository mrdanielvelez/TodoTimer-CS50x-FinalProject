from flask import Blueprint, render_template, request, flash, jsonify, redirect, url_for
from flask_login import login_required, current_user
from .models import Todo, Completed_Todo
from . import db
import json
import os

routes = Blueprint("routes", __name__)

FLASH_MAXCHAR = 40
SOUND_DIR = "website/static/sounds/timer_complete"
MIN_TODO, MAX_TODO = 5, 200

@routes.route("/")
@login_required
def index():
    sounds = []
    for filename in os.listdir(SOUND_DIR):
        filepath = os.path.join(SOUND_DIR, filename)
        if os.path.isfile(filepath):
            sounds.append(filename.split(".")[0])
    return render_template("index.html", user=current_user, sounds=sounds)

@routes.route("/completions")
@login_required
def completed():
    return render_template("completions.html", user=current_user)
    
@routes.route("/add_todo", methods=["POST"])
@login_required
def add_todo():
    todo = json.loads(request.data)["todoText"]
    if len(todo) >= MIN_TODO and len(todo) <= MAX_TODO:
        new_todo = Todo(text=todo, user_id=current_user.id)
        db.session.add(new_todo)
        db.session.commit()
    return jsonify({})

@routes.route("/delete_todo", methods=["POST"])
@login_required
def delete_todo():
    todo_id = json.loads(request.data)["todoId"]
    todo = Todo.query.get(todo_id)
    if todo:
        if todo.user_id == current_user.id:
            db.session.delete(todo)
            db.session.commit()
    return jsonify({})

@routes.route("/complete_todo", methods=["POST"])
@login_required
def complete_todo():
    todo_id = json.loads(request.data)["todoId"]
    todo = Todo.query.get(todo_id)
    if todo:
        if todo.user_id == current_user.id:
            db.session.delete(todo)
            db.session.add(Completed_Todo(text=todo.text, creation_date=todo.date, user_id=current_user.id))
            db.session.commit()
    return jsonify({})

@routes.route("/delete_completed", methods=["POST"])
@login_required
def delete_completed():
    todo_id = json.loads(request.data)["todoId"]
    todo = Completed_Todo.query.get(todo_id)
    if todo:
        if todo.user_id == current_user.id:
            db.session.delete(todo)
            db.session.commit()
            if len(todo.text) > FLASH_MAXCHAR:
                flash(f"Todo \"{todo.text[:FLASH_MAXCHAR]}...\" deleted from completion history.", category="warning")
            else:
                flash(f"Todo \"{todo.text}\" deleted from completion history.", category="warning")
    return jsonify({})
