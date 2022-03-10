import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import X from './assets/tiktok1.png';
import O from './assets/tiktok2.png';

function Square(props){

  return (
    <button
      className="square"
      onClick={props.onClick}
    >
      <img className="icon" src={props.value}></img>
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div className="entire-board">
        <div className="board-row">
          {this.renderSquare(0)}
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
   constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      isHidden: true,
      buttonText: "Show Moves",
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
    squares[i] = this.state.xIsNext ? X : O;
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  handleButtonClick() {

    if(this.state.isHidden) {
      this.setState({buttonText: "Hide Moves"});
      document.querySelector(".game-info").style.display = "block";
    } else {
      this.setState({buttonText: "Show Moves"});
      document.querySelector(".game-info").style.display = "none";
    }
    this.setState({isHidden: !this.state.isHidden});
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + (this.state.xIsNext ? 'Player 2' : 'Player 1');
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'Player 1' : 'Player 2');
    }

    return (
        <div className="game">
          <div className="game-board">
            <h1 className="title">TikTokToe</h1>
            <Board 
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="player">{status}</div>
          <div className="show-moves">
            <button className="show-button" onClick={() => this.handleButtonClick()}>{this.state.buttonText}</button>
          </div>
          <div className="game-info">
            <ol>{moves}</ol>
          </div>
        </div>
    );
  }
}

function calculateWinner(squares) {
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
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);