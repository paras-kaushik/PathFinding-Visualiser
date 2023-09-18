import React, { forwardRef } from 'react';

import './Node.css';

const Node = forwardRef(({
  col,
  isFinish,
  isStart,
  isWall,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  row,
  distance
},ref) => {
  const extraClassName = isFinish
    ? 'node-finish'
    : isStart
      ? 'node-start'
      : isWall
        ? 'node-wall'
        : '';

  return (
    <div
      id={`node-${row}-${col}`}
      className={`node ${extraClassName}`}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp()}
      ref={ref}
      distance={distance}
    ></div>
  );
});

export default Node;
