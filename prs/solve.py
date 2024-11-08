from typing import List
import numpy as np

Board = List[List[int]]

def check_if_possible(board: Board, row: int, col: int, num: int):
  for i in range(len(board[row])):
    if i == col:
      continue
    if board[row][i] == num:
      return False
  
  for i in range(len(board)):
    if i == row:
      continue
    if board[i][col] == num:
      return False
  
  block_row = row // 3
  block_col = col // 3

  for i in range(block_row * 3, block_row * 3 + 3):
    for j in range(block_col * 3, block_col * 3 + 3):
      if i == row and j == col:
        continue
      if board[i][j] == num:
        return False

  return True

def solve_board(board: Board):
  for row in range(len(board)):
    for col in range(len(board[row])):
      if board[row][col] == 0:
        for num in range(1, 10):
          possible = check_if_possible(board, row, col, num)
          if possible:
              board[row][col] = num
              if solve_board(board) is not None:
                  return board
              board[row][col] = 0
        return None
  return board

# board: Board = [
#     [5,1,6,8,4,9,7,3,2],
#     [3,0,7,6,0,5,0,0,0],
#     [8,0,9,7,0,0,0,6,5],
#     [1,3,5,0,6,0,9,0,7],
#     [4,7,2,5,9,1,0,0,6],
#     [9,6,8,3,7,0,0,5,0],
#     [2,5,3,1,8,9,0,7,4],
#     [6,8,4,2,0,7,5,0,0],
#     [7,9,1,0,5,0,6,0,8]
# ]
# solved = solve_board(board)
# print(solved is None)
# print(np.matrix(solved))