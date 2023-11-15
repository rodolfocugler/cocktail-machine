FROM python:3.9

ENV FLASK_PORT 5000

WORKDIR /app
ENV BASE_PATH /app

COPY requirements.txt ./
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

COPY ./ .

ENTRYPOINT gunicorn -b=5000 --workers=2 cocktail_machine:create_app