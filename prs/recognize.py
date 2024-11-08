import os
from typing import List
import cv2
from cv2 import Mat
import numpy as np
import tensorflow as tf

model_path = os.path.join('models', 'model.hdf5')
model = tf.keras.models.load_model(model_path)

def recognize_cell(cell_image: Mat):
  img = cv2.cvtColor(cell_image, cv2.COLOR_BGR2GRAY)
  
  white_pixels = np.sum(img == 255)
  if (white_pixels < 50):
    return 0

  img = cv2.resize(img, (28, 28))
  img = img.reshape(-1, 28, 28, 1)
  img = img.astype("float")
  img = img / 255.0

  return int(np.argmax(model.predict(img), axis=1)[0])

def recognize_board(cell_images: List[Mat]):
  board = []
  row = []

  for (index, cell_image) in enumerate(cell_images, 1):
    prediction = recognize_cell(cell_image)
    row.append(prediction)

    if index % 9 == 0:
      board.append(row)
      row = []

  # print(np.matrix(board))

  return board