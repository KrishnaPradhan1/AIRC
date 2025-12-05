from flask import Blueprint

bp = Blueprint('applications', __name__)

from . import routes
