import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import tensorflow as tf
from tensorflow import keras
from sklearn.model_selection import train_test_split

dataframe = pd.read_csv(os.path.join('datasets', 'TMNIST_Data.csv'), header=0)

x = dataframe.drop(columns={'names', 'labels'}, axis=1)
y = dataframe['labels']

x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=4)

# x_train = x_train.values.reshape(-1, 28, 28, 1)
# x_test = x_test.values.reshape(-1, 28, 28, 1)
# print(x_train.shape)

# x_train = x_train.reshape(x_train.shape[0], 28, 28, 1)
# x_test = x_test.reshape(x_test.shape[0], 28, 28, 1)

x_train = x_train / 255.0
x_test = x_test / 255.0

model = keras.Sequential()

model.add(tf.keras.layers.Conv2D(32, (3, 3), input_shape=(28,28,1), activation='relu'))
model.add(tf.keras.layers.MaxPool2D())
model.add(tf.keras.layers.Flatten())
model.add(tf.keras.layers.Dense(512, activation='relu'))
model.add(tf.keras.layers.Dropout(0.2))
model.add(tf.keras.layers.Dense(10, activation='softmax'))
model.compile(optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"])

# model = keras.Sequential([
#     # keras.layers.Dense(128, input_shape=(28, 28, 1), activation='relu'),
#     keras.layers.Dense(128, input_shape=(784,), activation='relu'),
#     keras.layers.Dense(10, activation='softmax')
# ])

# model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

history = model.fit(x_train, y_train, epochs=10, validation_split=0.2)

test_loss, test_acc = model.evaluate(x_test, y_test)

print('Test accuracy:', test_acc)

model.save(os.path.join('models', 'test.h5'), overwrite=True)






#############################################################
# # Plot the training and validation accuracy over the epochs
# plt.plot(history.history['accuracy'])
# plt.plot(history.history['val_accuracy'])
# plt.title('Model accuracy')
# plt.ylabel('Accuracy')
# plt.xlabel('Epoch')
# plt.legend(['Train', 'Validation'], loc='upper left')
# plt.savefig('model_accuracy.png')
# plt.clf()

# # Plot the training and validation loss over the epochs
# plt.plot(history.history['loss'])
# plt.plot(history.history['val_loss'])
# plt.title('Model loss')
# plt.savefig('model_loss.png')
# plt.clf()

# # Get the predicted labels for the test data
# y_pred = model.predict(x_test)

# # Plot a random sample of test images with their predicted labels
# figure = plt.figure(figsize=(20, 8))
# for i, index in enumerate(np.random.choice(x_test.shape[0], size=15, replace=False)):
#     ax = figure.add_subplot(3, 5, i + 1, xticks=[], yticks=[])
#     ax.imshow(np.reshape(x_test.iloc[index].values, (28, 28)), cmap='PuBuGn')
#     pred_label = np.argmax(y_pred[index])
#     true_label = y_test.iloc[index]
#     ax.set_title("Predicted: {} | True: {}".format(pred_label, true_label),
#                  color=("green" if pred_label == true_label else "red"))

# figure.savefig('results.png')