cd ..

python manage.py makemigrations organizations
python manage.py makemigrations accounts
python manage.py makemigrations services
python manage.py makemigrations authentication

python manage.py migrate
