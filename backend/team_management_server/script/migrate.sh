cd ..

python manage.py makemigrations accounts
python manage.py makemigrations courses
python manage.py makemigrations teams

python manage.py migrate
