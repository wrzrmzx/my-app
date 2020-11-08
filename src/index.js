import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

// 棋盘的大小
const size = 3;

// 棋盘上的每个格子
class Square extends React.Component {
  render() {
    return (
      <button
        className="square"
        onClick={() => {
          this.props.onClick();
        }}
      >
        {this.props.value}
      </button>
    );
  }
}

// 棋盘
class Board extends React.Component {
  // 将Square作为函数组件，方便复用
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => {
          this.props.onClick(i);
        }}
      />
    );
  }

  // 棋盘上的每一行
  renderRow(rowNum) {
    let row = new Array(size);
    row.fill(1);
    row = row.map((item, index) => {
      return this.renderSquare(rowNum * size + index);
    });
    return row;
  }

  // 以行为单位渲染棋盘
  render() {
    let boardRow = new Array(size);
    boardRow.fill(null);
    return (
      <div>
        {boardRow.map((item, index) => {
          return (
            <div className="board-row" key={index}>
              {this.renderRow(index)}
            </div>
          );
        })}
      </div>
    );
  }
}

// 游戏总设置
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 游戏的历史进度
      history: [
        {
          // 棋盘情况
          squares: Array(9).fill(null),
          // 本次落子的坐标
          step: Array(2).fill(-1),
          // 落子的是"X"还是"O"
          act: "?",
        },
      ],
      // 当前跳转到的历史进度的步数
      stepNumber: 0,
      // 判断下一步落子的是"X"还是"O"
      xIsNext: true,
    };
  }

  // 每次点击格子的时候调用，将格子标记为“X”或者“O”
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const step = [Math.floor(i / 3), i % 3];
    // 该格子已经被标记过或者胜负已分，则直接返回不处理
    if (this.calculateWinner(squares) || squares[i]) return;
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        { squares: squares, step: step, act: this.state.xIsNext ? "X" : "O" },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  // 跳转到第几步
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  // 计算胜者为“X”还是“O”，没有胜者返回null
  calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      let [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[b] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = this.calculateWinner(current.squares);
    // 渲染时光机按钮
    const moves = history.map((step, move) => {
      const desc = move
        ? "go to move #" +
          move +
          ": " +
          this.state.history[move].act +
          " at (" +
          (this.state.history[move].step[0] + 1) +
          ", " +
          (this.state.history[move].step[1] + 1) +
          ")"
        : "go to start";
      return (
        <li key={move}>
          <button
            className={
              move === this.state.stepNumber ? "game-info-strong" : null
            }
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </button>
        </li>
      );
    });
    let status;
    if (winner) {
      status = "Winner is: " + (this.state.xIsNext ? "O" : "X");
    } else if (this.state.stepNumber === Math.pow(size, 2)) {
      status = "No winner!";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
