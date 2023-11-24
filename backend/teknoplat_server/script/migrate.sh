cd ..

python manage.py makemigrations accounts
python manage.py makemigrations pitches
python manage.py makemigrations meetings
python manage.py makemigrations comments
python manage.py makemigrations chats
python manage.py makemigrations criteria
python manage.py makemigrations evaluations
python manage.py makemigrations feedbacks

python manage.py migrate
