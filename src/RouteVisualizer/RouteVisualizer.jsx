import React, { useState, useEffect, useRef } from 'react';
import Node from './Node/Node';
import { dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijkstra';

import './RouteVisualizer.css';
import { FINISH_NODE_COL, FINISH_NODE_ROW, START_NODE_COL, START_NODE_ROW, getInitialGrid, getNewGridWithWallToggled } from './gridUtils';

const RouteVisualizer = () => {
  const [grid, setGrid] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [run, setRun] = useState(false);
 const gridRef = useRef([]);

  useEffect(() => {
    const initialGrid = getInitialGrid();
    setGrid(initialGrid);
    // Initialize the grid ref with null values
    gridRef.current = Array.from({ length: 20 }, () =>
      Array.from({ length: 50 }, () => null)
    );
  }, []);

  const handleMouseDown = (row, col) => {
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
    setMouseIsPressed(true);// CLICK AND DRAG TO MAKE WALLS
  };

  const handleMouseEnter = (row, col) => {
    if (!mouseIsPressed || run) return;
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
  };

  const handleMouseUp = () => {
    setMouseIsPressed(false);
  };

  const animateShortestPath = (nodesInShortestPathOrder) => {
    nodesInShortestPathOrder.forEach((node, i) => {
      setTimeout(() => {
        gridRef.current[node.row][node.col].classList.add(
          'node-shortest-path'
        );
      }, 50 * i);
    });
  };

  const animateDijkstra = (visitedNodesInOrder, nodesInShortestPathOrder) => {
    visitedNodesInOrder.forEach((node, i) => {
      setTimeout(() => {
        gridRef.current[node.row][node.col].classList.add('node-visited');
        gridRef.current[node.row][node.col].innerHTML=node.distance;
      }, 10 * i);
    });

    setTimeout(() => {
      animateShortestPath(nodesInShortestPathOrder);
    }, 10 * visitedNodesInOrder.length);
  };

  const visualizeDijkstra = () => {
    setRun(!run);
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  };

  const resetBoard = () => {
    setRun(!run);
    const initialGrid = getInitialGrid();
    setGrid(initialGrid);
     var mat=(gridRef.current);
    let r = mat.length;
    let c = mat[0].length;
    for (let i = 0; i < r; i++)
      for (let j = 0; j < c; j++) {
        mat[i][j].classList = ['node'];
        mat[i][j].innerHTML = '0';
        if (i === START_NODE_ROW && j === START_NODE_COL)
          mat[i][j].classList.add('node-start');
        if (i === FINISH_NODE_ROW && j === FINISH_NODE_COL)
          mat[i][j].classList.add('node-finish');
      }

  }

  return (
    <>
      {!run && (
        <button onClick={visualizeDijkstra}>
          Visualize Dijkstra's Algorithm
        </button>
      )}

      {run && <button onClick={resetBoard}>Reset Board</button>}

      <div className="grid">
        {grid.map((row, rowIdx) => (
          <div key={rowIdx}>
            {row.map((node, nodeIdx) => {
              const { row, col, isFinish, isStart, isWall } = node;
              return (
                <Node
                  key={nodeIdx}
                  col={col}
                  isFinish={isFinish}
                  isStart={isStart}
                  isWall={isWall}
                  mouseIsPressed={mouseIsPressed}
                  onMouseDown={(row, col) => handleMouseDown(row, col)}
                  onMouseEnter={(row, col) => handleMouseEnter(row, col)}
                  onMouseUp={() => handleMouseUp()}
                  row={row}
                  ref={(el) => (gridRef.current[row][col] = el)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
};

export default RouteVisualizer;
