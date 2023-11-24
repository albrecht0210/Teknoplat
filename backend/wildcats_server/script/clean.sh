cd ..

# Remove __pycache__ directories
find . -type d -name "__pycache__" -exec rm -r {} \;

# Remove migrations directories (assuming they are inside each app directory)
find . -type d -name "migrations" -exec rm -r {} \;

# Remove the db.sqlite file (assuming it's in the project root directory)
if [ -f "db.sqlite3" ]; then
    rm db.sqlite3
fi