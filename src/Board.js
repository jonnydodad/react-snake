import React, { Component } from 'react';
import Cell from './Cell';

const rowStyles = { 
	margin: '0 auto',
	width: '420px', 
	height: '20px', 
	borderBottom: '1px solid red'
}

const makeBoard = (SIZE) => {
	const arr = [];

	for (let i = 0; i < SIZE; i++){
		const innerArr = [];
		for (let j = 0; j < SIZE; j++){
			innerArr.push({ id: i+'_'+j, alive: false })
		}
		arr.push(innerArr);
	}
	return arr;
}


class Board extends Component {

	state = {
		board: makeBoard(20),
		size: 20,
		currentCount: 0,
		snake: [{ x:7, y:7 }],
		mouse: { x:12, y:7 },
		direction: { dx: 1, dy: 0 },
		gameOver: false,
		addPoint: false
	}

	componentDidMount() {
    this.intervalId = setInterval(this.timer, 150);
  }
  componentWillUnmount(){
    clearInterval(this.intervalId);
  }

  timer = () => {
		// every tick check:
		// 1) game over
		// 2) we check for point so that we can generate new mouse and make the snake longer 
		if (this.state.gameOver) { 
    	console.log('GAME OVER')
      clearInterval(this.intervalId);
      return;
    }

		const addPoint = this.checkPoint();
		const mouse = this.randomMouse(addPoint)
		const newSnake = this.updateSnake(addPoint);
		this.checkGameOver(newSnake);
		const newBoard = this.updateBoard();

		//update state
    this.setState((prev) => {
    	return {
	      currentCount: prev.currentCount + 1,
	      snake: newSnake,
	      board: newBoard,
	      addPoint: false,
	      mouse: mouse
	    }
    })
  }

  checkPoint = () => {
		const { x, y } = this.state.mouse;
		const { snake } = this.state;
		for (let i = 0; i < snake.length; i++){
			const seg = snake[i];
			if (seg.x+'_'+seg.y === x+'_'+y) return true;
		}
		return false;
	}

	randomMouse = (add) => { 
		const mouse = { 
			x: Math.floor(Math.random()*20), 
			y: Math.floor(Math.random()*20) 
		} 
		return add ? mouse : this.state.mouse;
	}


	updateSnake = (add) => {
		let { snake, direction } = this.state;

		const newSnake = snake.slice();
		const tail = snake[snake.length-1];
		const X = tail.x+direction.dx;
		const Y = tail.y+direction.dy;

		newSnake.push({ x:X, y:Y })

		return add ? newSnake : newSnake.slice(1);
	}

	updateBoard = () => {
		let { snake, board, mouse } = this.state;

		let newBoard = board.map((row) => {
			return row.map((cell) => {

				if (cell.id === mouse.x+'_'+mouse.y) return { id: cell.id, alive: 'mouse' }

				const snakeSegment = snake.reduce((acc, seg) => {
					const id = seg.x + '_' + seg.y;
					if (cell.id === id) acc = id;				
					return acc;
				}, null);		

				if (!snakeSegment && !cell.alive) return cell;
				if (!snakeSegment) return { id: cell.id, alive: false }
				return { id: cell.id, alive: 'seg' }
			})
		})

		return newBoard;		
	}

	checkGameOver = (snake) => {
		for (let i = 0; i < snake.length; i++){

			if (snake.filter((seg) => seg.x+'_'+seg.y === snake[i].x+'_'+snake[i].y).length > 1) {
				this.setState( prev => {
					return {
						gameOver: true
					}
				})
				return;
			}

			if (snake[i].x >= 20 || snake[i].y >= 20 || snake[i].x < 0 || snake[i].y < 0) {
				this.setState( prev => {
					return {
						gameOver: true
					}
				});
				return;
			}
		}
	}

  handleChange = (e) => {
  	let dir;

  	switch (e.keyCode) {
  		case 37:
  		dir = { dx: 0, dy: -1 } 
  		break;
  		case 38:
  		dir = { dx: -1, dy: 0 } 
  		break;
  		case 39:
  		dir = { dx: 0, dy: 1 } 
  		break;
  		case 40:
  		dir = { dx: 1, dy: 0 } 
  		break;
  		default:
  		dir = { dx: 0, dy: 0 }
  	}

  	this.setState((prev) => {
  		return { 
  			direction: dir
  		}
  	})
  }

  renderBoard = () => {
		const { x, y } = this.state.mouse;
		
		return this.state.board.map((row, i) => {
			return ( 
				<div key={i} style={rowStyles}>
					{row.map((cell, j) => (
							<Cell 
							  key={ i+'_'+j } 
							  id={ i+'_'+j } 
							  cell={ cell } 
							/>
						)
					)}
				</div>
			)
		})
	}

  render() {
    return (
    <section style={{ textAlign: 'center', fontSize: '20px'}}>
    <div> time: {this.state.currentCount}</div>
    <div 
      style={{ margin: '0 auto', backgroundColor: 'lightgrey' }} 
      onKeyDown={this.handleChange} 
      tabIndex="0"
      autofocus={true}
    >
      {this.renderBoard()}
    </div>
    </section>
    );
  }
}

export default Board;
