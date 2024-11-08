import os
from shutil import rmtree
import uuid
import cv2
from flask import Flask, jsonify, request, send_from_directory
from files import cleanup_dirs, get_cells, get_original_image, init_dirs, save_original_image, write_cells, write_stages

from preprocess import crop_cells_from_grayscale, isolate_cells, warp_image
from recognize import recognize_board
from solve import solve_board

app = Flask(__name__)

@app.route("/")
def index():
    return "<p>index</p>"

@app.route("/reports/<path:path>")
def send_report(path):
    return send_from_directory('reports', path)

@app.route("/solve-board", methods=['POST'])
def solve_board_route():
    board = request.get_json()

    solved_board = solve_board(board)

    if solved_board is not None:
        data = {
            "message": "Успешно",
            "board": solved_board
        }
        return jsonify(data)
    else:
        data = {
            "message": "Нет решения"
        }
        return jsonify(data), 400

@app.route("/process-image", methods=['POST'])
def process_image():
    id = str(uuid.uuid4())

    try:    
        image = request.files['image']
        init_dirs(id)
        save_original_image(id, image)

        original_image = get_original_image(id)
        field_contour_image, warped_image = warp_image(original_image)
        grayscale_image, adaptive_threshold_image, removed_numbers_image, closed_image, inverted_image = isolate_cells(warped_image)

        write_stages(id, [
            original_image,
            field_contour_image,
            warped_image,
            grayscale_image,
            adaptive_threshold_image,
            removed_numbers_image,
            closed_image,
            inverted_image
        ])

        cell_images = crop_cells_from_grayscale(adaptive_threshold_image, inverted_image)
        write_cells(id, cell_images)

        cell_images = get_cells(id)
        board = recognize_board(cell_images)

        cleanup_dirs(id)

        data = {
            "id": id,
            "board": board
        }
        return jsonify(data), 200
    except:
        data = {
            "id": id,
            "message": "Не получилось распознать изображение"
        }
        return jsonify(data), 400

app.run(host='0.0.0.0', port=5000, debug=True)