FROM python:3.9.17

RUN apt-get update && apt-get install ffmpeg libsm6 libxext6 -y
RUN pip install pip==23.1.2

WORKDIR /app

COPY requirements_tf.txt ./
RUN pip install -r requirements_tf.txt

EXPOSE 5000

CMD python server.py