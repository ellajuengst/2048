/*
Add your code for Game here
 */


export default class Game {
    constructor(width) {
        this.width = width;
        this.gameState = {
            board: [],
            score: 0,
            won: false,
            over: false
        }
        this.setupNewGame();
        this.moveListeners = [];
        this.winListeners = [];
        this.loseListeners = [];
        this.alreadyWon = false;
    } 

    setupNewGame() {
        this.gameState.board = new Array(this.width**2).fill(0);
        for (let i=0; i<2; i++) {
            this.addNewTile();
        }
        this.gameState.score = 0;
        this.gameState.won = false;
        this.gameState.over = false;

    }

    loadGame(gameState) {
        this.gameState.board = gameState.board;
        this.gameState.score = gameState.score;
        this.gameState.won = gameState.won;
        this.gameState.over = gameState.over;

    }

    updateMoveListeners(gameState) {
        this.moveListeners.forEach( f => f(gameState));

    }

    updateWinListeners(gameState) {
        this.winListeners.forEach( f => f(gameState));
    }

    updateLoseListeners(gameState) {
        this.loseListeners.forEach( f => f(gameState));
    }

    move(direction) {
        if (this.gameState.over == true) {
            return;
        }
        let arrays = new Array(this.width);
        let width = this.width;
        if (direction == "left" || direction == "right") {
            for (let i=0; i<arrays.length; i++) {
                arrays[i] = this.gameState.board.slice(i*this.width, i*this.width + this.width);
                if (direction == "right") {
                    arrays[i] = arrays[i].reverse();
                }
            }
        } else {
            for (let i=0; i<arrays.length; i++) {
                arrays[i] = this.gameState.board.filter(function (val, idx) {
                    return (idx-i) % width == 0;
                });
                if (direction == "down") {
                    arrays[i] = arrays[i].reverse();
                }
            }
        }
        let score = 0;
        
        let new_arrays = [];
        arrays.forEach(function (value, arr_idx) {
            let i=0;
            let zeros = 0;
            let duplicates = 0;
            let new_arr = [];
            
            if (value.every(num => num == 0)) {
                new_arr = new Array(width).fill(0); 
                new_arrays[arr_idx] = new_arr;
                return;
            }
            
            while (i < value.length) {
                if (value[i] == 0) {
                    zeros++;
                    i++;
                    continue;
                } else {
                    let searching = true;
                    let j = i+1;
                    while(searching && j<value.length) {
                        if (value[j] == 0) {
                            j++;
                        } else if (value[j] == value[i]) {
                            duplicates++;
                            new_arr.push(value[i]+value[j]);
                            score += value[i]+value[j];
                            i = j+1;
                            searching = false;
                        } else if (value[j] != value[i]) {
                            new_arr.push(value[i]);
                            i++;
                            searching = false;
                        }
                    }
                    if (searching) {
                        new_arr.push(value[i]);
                        i++;
                    }
                    
                }
            }
            if (new_arr.length < width) {
                for (let k=new_arr.length; k<width; k++) {
                    new_arr[k] = 0;
                }
            }
            new_arrays[arr_idx] = new_arr;
            
                
            
        })
        let invalid_move_count = 0;
        for (let i=0; i<new_arrays.length; i++) {
            if (new_arrays[i].every((val, index) => val === arrays[i][index])) {
                invalid_move_count++;
            }
        }
        let invalid_move_bool = false;
        if (invalid_move_count == this.width) {
            invalid_move_bool = true;
        }

        this.gameState.score += score;
        this.gameState.board = [];
        if (direction == "left" || direction == "right") {
            for (let i=0; i<new_arrays.length; i++) {
                if (direction == "right") {
                    new_arrays[i] = new_arrays[i].reverse();
                }
                new_arrays[i].forEach(val => this.gameState.board.push(val));                
            }
        } else {
            if (direction == "down") {
                new_arrays.forEach(arr => arr.reverse());
            } 
            for (let i=0; i<new_arrays.length; i++) {
                
                for (let j=0; j<new_arrays.length; j++) {
                    
                    this.gameState.board.push(new_arrays[j][i]);
                }
            }
        }
        if (!invalid_move_bool) {
            this.addNewTile();
        }

        
        this.updateMoveListeners(this.gameState);
        this.checkWin();
        this.checkLose();
    }

    addNewTile() {
        let searching = true;
        while (searching) {
            let index = getRandomIndex(this.width**2);
            if (this.gameState.board[index] == 0) {
                searching = false;
                this.gameState.board[index] = getNewTileValue();
            }
        }
    }

    toString() {
        let str = "";
        for (let i=0; i<this.gameState.board.length; i=i+this.width) {
            let j = i;
            while (j < i + this.width) {
                str = str + (this.gameState.board[j] + "  ");
                j++;
            }
            str = str + ("\n");
        }
        return str;
    }

    onMove(callback) {
        this.moveListeners.push(callback);
    }

    onWin(callback) {
        this.winListeners.push(callback);
    }

    onLose(callback) {
        this.loseListeners.push(callback);
        
    }

    checkWin() {
        
        if (this.gameState.board.includes(2048)) {
            this.gameState.won = true;
            this.updateWinListeners(this.gameState)
            return true;
        } else {
            return false;
        }
    }

    checkLose() {
        let board = this.gameState.board;
        let duplicates = false;
        board.forEach((val, ind) => {
            if (ind == 0) { //top left corner 
                if(val != 0 && (val == board[ind+1] || val == board[this.width])) {
                    duplicates = true;
                }
            } else if (ind < this.width && ind < this.width-1) { //top row
                if(val != 0 && (val == board[ind+1] || val == board[ind+this.width] || val == board[ind-1])) {
                    duplicates = true;
                }     
            } else if (ind == this.width-1) { //top right corner
                if(val != 0 && (val == board[ind-1] || val == board[ind+this.width])) {
                    duplicates = true;
                }  
            } else if (ind % this.width == 0 && ind >= this.width && ind <= this.width*(this.width-2)) { //left col
                if(val != 0 && (val == board[ind+1] || val == board[ind+this.width] || val == board[ind-this.width])) {
                    duplicates = true;
                } 
            } else if (ind >= this.width+1 && ind <= this.width*(this.width-1)-2 && ind % this.width != 0 && (ind+1) % this.width != 0) { //middle section
                if(val != 0 && (val == board[ind+1] || val == board[ind+this.width] || val == board[ind-this.width] || val == board[ind-1])) {
                    duplicates = true;
                } 
            } else if (ind != this.width-1 && ind !=(this.width*this.width) - 1 && (ind+1) % this.width == 0) { //right col
                if(val != 0 && (val == board[ind-1] || val == board[ind+this.width] || val == board[ind-this.width])) {
                    duplicates = true;
                }
            } else if (ind == this.width*(this.width-1)) { //bottom left corner
                if(val != 0 && (val == board[ind+1] || val == board[ind-this.width])) {
                    duplicates = true;
                } 
            } else if (ind == (this.width*this.width) - 1) { //bottom right corner
                if(val != 0 && (val == board[ind-1] || val == board[ind-this.width])) {
                    duplicates = true;
                } 
            } else if (ind > this.width*(this.width-1) && ind <this.width*this.width - 1) { //bottom row
                if(val != 0 && (val == board[ind-1] || val == board[ind-this.width] || val == board[ind+1])) {
                    duplicates = true;
                } 
            }

        })
        if (!duplicates && !this.gameState.board.includes(0)) {
            this.gameState.over = true;
            this.updateLoseListeners(this.gameState);
            return true;
        } else {
            return false;
        }
    }

    getGameState() {
        return this.gameState;
    }
}

 

function getRandomIndex(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function getNewTileValue() {
    if(Math.random() < .9) {
        return 2;
    } else {
        return 4;
    }
}

