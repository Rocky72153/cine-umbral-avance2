"""Configuración para la demostración con bases locales y datos de prueba."""

import os
from secrets import token_urlsafe

from .settings import *  # noqa: F403

SECRET_KEY = os.environ.get("CINE_DJANGO_DEMO_KEY") or token_urlsafe(32)
DEBUG = False
ALLOWED_HOSTS = ["localhost", "127.0.0.1"]
CORS_ALLOWED_ORIGINS = ["http://localhost:4200", "http://127.0.0.1:4200"]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ.get("CINE_PG_DATABASE", "cine_bogota"),
        "USER": os.environ.get("CINE_PG_USER", "cine"),
        "PASSWORD": os.environ.get("CINE_PG_PASSWORD", ""),
        "HOST": "127.0.0.1",
        "PORT": os.environ.get("CINE_PG_PORT", "55482"),
        "OPTIONS": {"connect_timeout": 3},
    }
}
MONGO_URI = (
    f"mongodb://127.0.0.1:{os.environ.get('CINE_MONGO_PORT', '27182')}/"
    "?serverSelectionTimeoutMS=2500&timeoutMS=4000"
)
MONGO_DB_NAME = os.environ.get("CINE_MONGO_DATABASE", "cine_bogota_avance2")
