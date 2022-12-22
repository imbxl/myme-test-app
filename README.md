# Myme / Snippet test app
App para la prueba técnica de Myme / Snippet

## ¿Por qué API REST?
Ya que la aplicación es React e independiente del backend podria utilizarse para IOS o Android y funcionar igualmente solo cambiando la variable `REST_ENDPOINT` en App.js, por la URL donde se ejecutará el Python.

## Como instalar
1) Descargar e instalar Python 3.x.x https://www.python.org/downloads/, luego dirigirse a la ruta del proyecto desde un terminal.

2) Instalar Django ejecutando:
### `python -m pip install Django`

3) Instalar Django REST Framework y otros requisitos ejecutando:
### `pip install djangorestframework`
### `pip install markdown`
### `pip install django-filter`

4) Compilar React:
### `cd frontend`
### `npm run build`
### `cd ..`

5) Realizar migracion:
### `python manage.py migrate`

6) Crear usuario administrador:
### `python manage.py createsuperuser`

7) Ejecutar servidor:
### `python manage.py runserver`

URL backend:
### `http://127.0.0.1:8000/admin/`

URL front:
### `http://127.0.0.1:8000/`

## Comandos disponibles FRONTEND
En el directorio `frontend` dentro del proyecto se puede ejecutar los siguientes comandos:

### `npm test`
Ejecuta los tests de la app.\

### `npm start`
Ejecuta el frontend de la app en modo `development`.\
Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### `npm run build`
Compila la app al directorio `build`, que es el que utiliza Python para funcionar.\
La app se compilará minificada y optimizada.