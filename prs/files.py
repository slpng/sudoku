import os
from shutil import rmtree
from typing import List
import cv2
from cv2 import Mat

from werkzeug.datastructures.file_storage import FileStorage

def build_dir_paths(id: str):
  report_dir = os.path.join('reports', id)
  cells_dir = os.path.join(report_dir, "cells")
  stages_dir = os.path.join(report_dir, "stages")

  return report_dir, cells_dir, stages_dir

def build_original_image_path(id: str):
  report_dir, cells_dir, stages_dir = build_dir_paths(id)
  return os.path.join(report_dir, 'original.png')

def save_original_image(id: str, image: FileStorage):
  original_image_path = build_original_image_path(id)
  image.save(original_image_path)

def get_original_image(id: str) -> Mat:
  original_image_path = build_original_image_path(id)
  return cv2.imread(original_image_path)

def init_dirs(id: str):
  report_dir, cells_dir, stages_dir = build_dir_paths(id)
  try:
    os.makedirs(report_dir)
    os.makedirs(cells_dir)
    os.makedirs(stages_dir)
  except:
    pass
    
def cleanup_dirs(id: str):
  report_dir, cells_dir, stages_dir = build_dir_paths(id)
  try:
    rmtree(cells_dir)
  except:
    pass
  
def write_cells(id: str, cell_images: list):
  report_dir, cells_dir, stages_dir = build_dir_paths(id)
  
  for (index, cell_image) in enumerate(cell_images, 1):
    cv2.imwrite(os.path.join(cells_dir, f'{index}.png'), cell_image)

def get_cells(id: str):
  report_dir, cells_dir, stages_dir = build_dir_paths(id)

  cell_images = []

  for i in range(1, 82):
    cell_image = cv2.imread(os.path.join(cells_dir, f'{i}.png'))
    cell_images.append(cell_image)

  return cell_images

def write_stages(id: str, stages: List[Mat]):
  report_dir, cells_dir, stages_dir = build_dir_paths(id)

  for (index, stage) in enumerate(stages, 1):
    cv2.imwrite(os.path.join(stages_dir, f'{index}.png'), stage)
