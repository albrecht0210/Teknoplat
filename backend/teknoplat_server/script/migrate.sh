cd ..

python manage.py makemigrations accounts
python manage.py makemigrations pitches
python manage.py makemigrations meetings
python manage.py makemigrations comments
python manage.py makemigrations chats
python manage.py makemigrations criteria
python manage.py makemigrations feedbacks
python manage.py makemigrations ratings
python manage.py makemigrations remarks
python manage.py makemigrations video

python manage.py migrate
