#!/usr/bin/env bash
set -o errexit

# Install pipenv
pip install pipenv

# Install backend dependencies
pipenv install --deploy --ignore-pipfile

# Collect static files
python manage.py collectstatic --no-input

# Run migrations
python manage.py migrate
