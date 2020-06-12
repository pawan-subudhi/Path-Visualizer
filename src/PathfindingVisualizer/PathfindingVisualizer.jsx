import React, { Component } from "react";

import Node from './Node/Node';
import './PathfindingVisualizer.css';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

class PathfindingVisualizer extends Component{
    constructor(props){
        super(props);
        this.state = {
            grid: [],
        };
    }

    componentDidMount(){
        const grid = getInitialGrid();
        this.setState({grid});
    }

    render(){
        const {grid, mouseIsPressed} = this.state; 

        return(
            <>
                <h1>Path finding Visualizer</h1>
                <div className="grid">
                    {grid.map((row, rowIdx) => {
                        return (
                            <div class="rowSection" key={rowIdx}>
                                {row.map((node, nodeIdx) => {
                                const {row, col, isFinish, isStart, isWall} = node;
                                return (
                                    <Node
                                    key={nodeIdx}
                                    col={col}
                                    isFinish={isFinish}
                                    isStart={isStart}
                                    isWall={isWall}
                                    // mouseIsPressed={mouseIsPressed}
                                    // onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                                    // onMouseEnter={(row, col) =>
                                    //     this.handleMouseEnter(row, col)
                                    // }
                                    // onMouseUp={() => this.handleMouseUp()}
                                    row={row}></Node>
                                );
                                })}
                            </div>
                        );
                    })}
                </div>
            </>
        );
    }
}

const getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < 20; row++) {
        const currentRow = [];
        for (let col = 0; col < 50; col++) {
            currentRow.push(createNode(col, row));
        }
        grid.push(currentRow);
    }
    return grid;
}

const createNode = (col, row) => {
    return {
        col,
        row,
        isStart: row === START_NODE_ROW && col === START_NODE_COL,
        isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: null,
    };
  };

export default PathfindingVisualizer;