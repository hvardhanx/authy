# authy

### Running the backend:

### Create your virtualenv and clone the repo:

```bash
* python3 -m venv <virtualenv_name>
* git clone https://github.com/royalharsh/authy.git
- pip install -r requirements.txt
- python manage.py migrate
- python manage.py runserver
```

### Running the frontend:

```bash
- npm install
- npm start
```

### Don't forget to configure your .env file:
 - SECRET_KEY
 - REACT_APP_SECRET_KEY
 - REACT_APP_API (Backend API URL)
 - DEBUG
 - DATABASE_URL
 - ALLOWED_HOSTS
 - JWT_ALGORITHMS
