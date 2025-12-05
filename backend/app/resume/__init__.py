from flask import Blueprint

bp = Blueprint('resume', __name__)

from . import routes
