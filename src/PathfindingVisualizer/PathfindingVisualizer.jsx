import React, { Component } from "react";

import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';

import './PathfindingVisualizer.css';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;
const THRESHOLD = 0.1;

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

    handleMouseDown(row, col) {
        //console.log('[handleMouseDown.js]');
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid, mouseIsPressed: true});
    }

    handleMouseEnter(row, col) {
        //console.log('[handleMouseEnter.js]');
        if (!this.state.mouseIsPressed) return;
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid});
    }

    handleMouseUp() {
        //console.log('[handleMouseUp.js]');
        this.setState({mouseIsPressed: false});
    }

    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
          if (i === visitedNodesInOrder.length) {
            setTimeout(() => {
              this.animateShortestPath(nodesInShortestPathOrder);
            }, 10 * i);
            return;
          }
          setTimeout(() => {
            const node = visitedNodesInOrder[i];
            document.getElementById(`node-${node.row}-${node.col}`).className =
              'node node-visited';
          }, 10 * i);
        }
    }
    
    animateShortestPath(nodesInShortestPathOrder) {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
          setTimeout(() => {
            const node = nodesInShortestPathOrder[i];
            document.getElementById(`node-${node.row}-${node.col}`).className =
              'node node-shortest-path';
          }, 50 * i);
        }
    }

    visualizeDijkstra() {
        const {grid} = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    }

    animateMaze(){
        const nodesWithWall = this.generateMaze();
        for(let i = 0;i < nodesWithWall.length; i++){
            if(!nodesWithWall[i].isStart && !nodesWithWall[i].isFinish){
                setTimeout(() => {
                    const node = nodesWithWall[i];
                    document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-wall';
                }, 20*i);
            }
        }
        // setTimeout(() => {
        //     console.log('[animate function]',data.grid);
        // }, 20*nodesWithWall.length);    
    }

    generateMaze(){
        const {grid} = this.state;
        const nodesHavingWall = [];
        for(let row = 0; row < 20; row++){
            for(let col = 0; col < 50; col++){
                if(row === 0 || col === 0 || row === 19 || col === 49){
                    grid[row][col].isWall = true;
                    nodesHavingWall.push(grid[row][col]);
                } else if(row%2 === 0 && col%2 === 0){
                    if(Math.random() > THRESHOLD){
                        grid[row][col].isWall = true;
                        nodesHavingWall.push(grid[row][col]);

                        let a = Math.random() < 0.5 ? 0 : (Math.random() < .5 ? -1 : 1);
                        let b = a !== 0 ? 0 : (Math.random() < .5 ? -1 : 1);

                        grid[row + a][col + b].isWall = true;
                        nodesHavingWall.push(grid[row + a][col + b]);
                    }
                } 
            }
        }
        return nodesHavingWall;
    }
    
    render(){
        const {grid, mouseIsPressed} = this.state; 
        // console.log('[render function]');
        return(
            <>
                <h1>Path finding Visualizer</h1>
                <ul>
                    <button onClick={() => this.visualizeDijkstra()}>
                        Visualize Dijkstra's Algorithm
                    </button>
                    <button onClick={() => this.animateMaze()}>
                        Generate Maze
                    </button>
                </ul>
                
                <div className="grid">
                    {grid.map((row, rowIdx) => {
                        return (
                            <div className="rowSection" key={rowIdx}>
                                {row.map((node, nodeIdx) => {
                                const {row, col, isFinish, isStart, isWall} = node;
                                return (
                                    <Node
                                    key={nodeIdx}
                                    col={col}
                                    isFinish={isFinish}
                                    isStart={isStart}
                                    isWall={isWall}
                                    mouseIsPressed={mouseIsPressed}
                                    onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                                    onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                                    onMouseUp={() => this.handleMouseUp()}
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

const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};

export default PathfindingVisualizer;