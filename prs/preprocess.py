# Гонсалес-Вудс - Обработка изобр. Морф. опер.

import os
from typing import Dict, Optional, Set
import cv2
from cv2 import Mat
from imutils.perspective import four_point_transform
from imutils.contours import sort_contours
from flask import jsonify
import numpy as np

def warp_image(image: Mat) -> tuple[Mat, Mat]:
  grayscale_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
  
  adaptive_threshold_image = cv2.adaptiveThreshold(grayscale_image, 255, cv2.ADAPTIVE_THRESH_MEAN_C , cv2.THRESH_BINARY_INV, 61, 5)
  
  contours = cv2.findContours(adaptive_threshold_image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

  sorted_contours = sorted(contours[0], key=lambda contour: cv2.contourArea(contour), reverse=True)

  field_contour_image = image.copy()
  cv2.drawContours(field_contour_image, sorted_contours, 0, (255, 0, 0), 3)

  perimeter = cv2.arcLength(sorted_contours[0], True)
  # Douglas-Peucker algorithm
  approx = cv2.approxPolyDP(sorted_contours[0], 0.02 * perimeter, True)
  warped_image = four_point_transform(image, approx.reshape(4, 2))
  warped_image = cv2.resize(warped_image, (500, 500))
  
  return field_contour_image, warped_image


def isolate_cells(image: Mat) -> tuple[Mat, Mat, Mat, Mat, Mat]:
  grayscale_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

  adaptive_threshold_image = cv2.adaptiveThreshold(grayscale_image, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY_INV, 61, 5)
  
  contours = cv2.findContours(adaptive_threshold_image, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

  removed_numbers_image = adaptive_threshold_image.copy()
  for contour in contours[0]:
    contour_area = cv2.contourArea(contour)
    if contour_area < (500 * 500) / 81 - 500:
      cv2.drawContours(removed_numbers_image, [contour], -1, (0, 0, 0), -1)

  closed_image = removed_numbers_image.copy()
  vertical_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (1, 5))
  closed_image = cv2.morphologyEx(closed_image, cv2.MORPH_CLOSE, kernel=vertical_kernel, iterations=11)
  horizontal_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 1))
  closed_image = cv2.morphologyEx(closed_image, cv2.MORPH_CLOSE, kernel=horizontal_kernel, iterations=9)
  inverted_image = 255 - closed_image

  return grayscale_image, adaptive_threshold_image, removed_numbers_image, closed_image, inverted_image


def sort_contours_topleft_to_bottomright(contours):
  (contours, _) = sort_contours(contours[0], method="top-to-bottom")
  
  rows = []
  row = []
  for (index, contour) in enumerate(contours, 1):
    area = cv2.contourArea(contour)
    if area < (500 * 500) / 2:
      row.append(contour)
      if index % 9 == 0:  
        (contours, _) = sort_contours(row, method="left-to-right")
        rows.append(contours)
        row = []
  return rows


def crop_cells_from_grayscale(src: Mat, mask_image: Mat):
  contours = cv2.findContours(mask_image, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
  rows = sort_contours_topleft_to_bottomright(contours)
  
  cell_images = []
  for (row_index, row) in enumerate(rows, 1):
    for (cell_index, c) in enumerate(row, 1):
      mask = np.zeros_like(src)
      cv2.drawContours(mask, [c], -1, 255, -1)
      result = np.zeros_like(src)
      result[mask == 255] = src[mask == 255]

      (y, x) = np.where(mask == 255)
      (topy, topx) = (np.min(y), np.min(x))
      (bottomy, bottomx) = (np.max(y), np.max(x))
      result = result[topy:bottomy+1, topx:bottomx+1]
      
      opening_kernel = np.ones((3, 3), np.uint8)
      result = cv2.morphologyEx(result, cv2.MORPH_OPEN, opening_kernel)

      cell_images.append(result)
  return cell_images