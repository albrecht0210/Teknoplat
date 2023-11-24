cd ..

python manage.py makemigrations accounts
python manage.py makemigrations activities

python manage.py migrate
