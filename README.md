# DealShark-BE

A simple Django REST Framework API backend project.

## Features

- Django 4.2+ with Django REST Framework
- Pipfile for dependency management
- CORS support for cross-origin requests
- Simple API endpoints
- PostgreSQL support (optional)

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DealShark-BE
   ```

2. **Install dependencies using pipenv**
   ```bash
   pipenv install
   ```

3. **Activate virtual environment**
   ```bash
   pipenv shell
   ```

4. **Run database migrations**
   ```bash
   python manage.py migrate
   ```

5. **Create superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

6. **Start development server**
   ```bash
   python manage.py runserver
   ```

## API Endpoints

- `GET /api/` - API root with welcome message
- `GET /api/hello/` - Simple hello world endpoint
- `GET /admin/` - Django admin interface

## Project Structure

```
DealShark-BE/
├── Pipfile                    # Dependencies management
├── Pipfile.lock              # Locked dependencies
├── manage.py                 # Django management script
├── dealshark/               # Main project directory
│   ├── settings.py          # Django settings with DRF configured
│   ├── urls.py              # URL routing
│   ├── wsgi.py
│   └── asgi.py
└── venv/                    # Virtual environment
```

## Dependencies

- Django 4.2+
- Django REST Framework 3.14+
- django-cors-headers
- psycopg2-binary (PostgreSQL support)
- python-decouple

## Development

- **Code formatting**: The project includes black, flake8, and isort for code quality
- **Testing**: pytest and pytest-django for testing
- **Virtual environment**: Managed by pipenv

## License

This project is open source and available under the [MIT License](LICENSE).