FROM docker-public.docker.devstack.vwgroup.com/python:3.9

ENV FLASK_PORT 80

WORKDIR /app
ENV BASE_PATH /app

COPY requirements.txt ./
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

COPY ./ .

ENTRYPOINT waitress-serve --port=$FLASK_PORT --call cocktail_machine:create_app