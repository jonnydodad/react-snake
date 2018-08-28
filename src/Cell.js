import React, { Component } from 'react';

const Cell = (props) => {

  const alive = props.cell.alive;

  return (
    <div style={{ 
    	backgroundColor: 
    	`${
    		alive ? 
    		  alive === 'mouse' ? 
    		    'white' : 
    		    'green' : 
    		    'lightgrey'
    	}`, 
    	display: 'inline-block', 
    	height: '20px', 
    	width: '20px', 
    	borderRight: '1px solid black'
    }}>
    </div>
  );
}

export default Cell;
