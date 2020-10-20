import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

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

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 每个格子的标记状态，分别为：“X”，“O”，“null（未标记）”
      squares: Array(9).fill(null),
      // 判断下一个落子的是“X”还是“O”，利用下一个该落子的是否为“X”进行判定
      xIsNext: true,
    };
  }

  // 每次点击格子的时候调用，将格子标记为“X”或者“O”
  handleClick(i) {
    // 该格子已经被标记过或者胜负已分，则直接返回不处理
    if (this.calculateWinner(this.state.squares) || this.state.squares[i])
      return;
    const squares = this.state.squares.slice();
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({ squares: squares, xIsNext: !this.state.xIsNext });
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

  // 将Square作为函数组件，方便复用
  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => {
          this.handleClick(i);
        }}
      />
    );
  }

  renderSquare2(i) {
    return (
      <button
        className="square"
        onClick={() => {
          this.handleClick(i);
        }}
      >
        {this.state.squares[i]}
      </button>
    );
  }

  render() {
    let status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    const winner = this.calculateWinner(this.state.squares);
    if (winner) {
      status = "Winner is: " + (this.state.xIsNext ? "O" : "X");
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare2(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
