#react
cd frontend
npm install cross-env -g
npm install 
npm start


#flask windows
cd api
py -3 -m venv venv

#pip3 install whatever is missing
pip3 install Flask

venv\Scripts\activate
set FLASK_ENV=development
set FLASK_APP=hello.py
flask run

start website : http://localhost:7000/