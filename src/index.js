import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
//  console.log('props at square',props)
  if (props.isWinning){
  return (
    <button className="winningsquare" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
  else
  {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  )  ;
}
}
class Board extends React.Component {
  renderSquare(i) {
//    console.log('props at render square',this.state,this.props)
    return (
      <Square
        value={this.props.squares[i]}
        //isWinning={false}
        isWinning={this.props.winningSquares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }
  renderSquares(i) {
    const squares = [];
    for (let j=0;j<3;j++){
       squares.push(this.renderSquare(i*3+j));
      };
    
    return squares;
  }
  
renderRows(){
  const allRows = []
  for (let l=0;l<3;l++){
    allRows.push(<div className="board-row">{this.renderSquares(l)}</div>);
  };
//  console.log("props at renderRows",this.props)
    return allRows;
}

  render() {
    return (
      <div>{this.renderRows()}</div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          winningSquares: Array(9).fill(false),
        }
      ],
      stepNumber: 0,
      orderStateReverse: false,
      xIsNext: true,
      clicksArray: []
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const winningSquares = current.winningSquares.slice();
    this.state.clicksArray.concat(i);
    console.log('this stat clicksarray :'+this.state.clicksArray.toString())    ;
    console.log("this step:"+this.state.stepNumber);
    console.log("clicked on "+i);
    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      
      history: history.concat([
        {
          squares: squares,
          winningSquares:winningSquares,
          clickedOn: i
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  ToggleOrder(orderStateReverse) {
    if (orderStateReverse === true){
      orderStateReverse = false;
      this.setState({orderStateReverse:false})
    }
    else {
      this.setState({orderStateReverse:true})
      orderStateReverse = true;} 
    return orderStateReverse;
  }
  

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winnerObject = calculateWinner(current.squares);
    console.log(winnerObject)
    const winner = winnerObject.winner
    const winnerSquaresIDs = winnerObject.squares

    const moves = history.map((step, move) => {
      const desc = move ?
        
        'Go to move #' + move + "  "+this.state.clicksArray.toString() + " Clicked on: "+ getLocation(history[move].clickedOn):
        'Go to game start';
        
      if (move === this.state.stepNumber) {
        //const classNameText = "selectedMoveButton"
        return (
          <li key={move}>
            <button className='selectedMoveButton' onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      }
      else{
        return (
        <li key={move}>
          <button className='moveButton' onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )};
    });

    if (this.state.orderStateReverse === true)
      {moves.reverse()};

    let status;
    if (winner) {
      for (let i=0;i<3;i++){
        current.winningSquares[winnerSquaresIDs[i]] = true;
      }
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
  }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winningSquares={current.winningSquares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
        <div><button className='RenderToggleButton' onClick={() => this.ToggleOrder(this.state.orderStateReverse)}>Reverse Order of Moves</button></div>
        
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {winner:squares[a],squares:lines[i]};
    }
  }
  return {winner:null,squares:[null,null,null]};
}

function getLocation(id){
  return ['0,0','1,0','2,0','0,1','1,1','2,1','0,2','1,2','2,2'][id]
}