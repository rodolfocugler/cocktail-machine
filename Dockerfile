FROM python:3.9

ENV FLASK_PORT 80

WORKDIR /app
ENV BASE_PATH /app

COPY requirements.txt ./
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

COPY ./ .

ENTRYPOINT gunicorn --port=$FLASK_PORT --workers=2 cocktail_machine:create_app