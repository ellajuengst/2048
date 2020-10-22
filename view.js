export default class View {
    constructor(game) {
        this.game = game;
        this.div = $('<div id="main-div"><h1>2048</h1></div>');
        $('body').attr('id', 'view-body');
        let board = $('<div class="board"></div>')
            .css('position', 'relative')
            .css('width', (120*game.width)+"px")
            .css('height', (120*game.width)+"px");


        let key_handler = (e) => {
            e = e || window.event;
            let direction="";
            if (e.keyCode == '38') {
                 direction = 'up';
            }
            else if (e.keyCode == '40') {
                 direction = 'down';
            }
            else if (e.keyCode == '37') {
                 direction = 'left';
            }
            else if (e.keyCode == '39') {
                 direction = 'right';
            }

            this.game.move(direction);
        };

        for (let r=0; r< (game.width * game.width); r++) {
            let value = game.gameState.board[r];
            let cell_view;
            if (value == 0) {
                cell_view = $(`<div class="cell tile${value}"></div>`).css('width', "100px")
            .css('height', "100px");
            } else {
                cell_view = $(`<div class="cell tile${value}">${value}</div>`).css('width', "100px")
                .css('height', "100px");
            }
            board.append(cell_view);
        }
        this.div.append(board);
        
        let reset_btn = $('<button class="reset_btn">Reset Game</button>');
        reset_btn.click(() => {
            this.game.setupNewGame();
            this.game.updateMoveListeners(this.game.gameState);
        });

        this.div.append(reset_btn);

        this.div.append($("<div class='score-div'><span id='score'>Score: 0</span> </div>"));
        
        document.addEventListener('keydown', key_handler);

        this.game.onMove(state => {
            this.div = $('<div id="main-div"><h1>2048</h1></div>'); 
            let board = $('<div class="board"></div>')
            .css('position', 'relative')
            .css('width', (120*this.game.width)+"px")
            .css('height', (120*this.game.width)+"px");
            for (let r=0; r< (this.game.width * this.game.width); r++) {
                
                let value = state.board[r];

                let cell_view;
                if (value == 0) {
                    cell_view = $(`<div class="cell tile${value}"></div>`).css('width', "100px")
                .css('height', "100px");
                } else {
                    cell_view = $(`<div class="cell tile${value}">${value}</div>`).css('width', "100px")
                    .css('height', "100px");
                }
                board.append(cell_view);
            }
            this.div.append(board);

            
            this.div.append(reset_btn);
    
            this.div.append($(`<div class='score-div'><span id='score'>Score: ${state.score}</span> </div>`));
            $('#view-body').empty();
            $('#view-body').append(this.div);
           
        })

        this.game.onWin(state => {
            let winDiv = $('<div id="main-div-win"><h1>2048</h1></div>'); 
            let board = $('<div class="board"></div>')
            .css('position', 'relative')
            .css('width', (120*this.game.width)+"px")
            .css('height', (120*this.game.width)+"px");
            for (let r=0; r< (this.game.width * this.game.width); r++) {
                
                let value = state.board[r];

                let cell_view;
                if (value == 0) {
                    cell_view = $(`<div class="cell tile${value}"></div>`).css('width', "100px")
                .css('height', "100px");
                } else {
                    cell_view = $(`<div class="cell tile${value}">${value}</div>`).css('width', "100px")
                    .css('height', "100px");
                }
                board.append(cell_view);
            }
            winDiv.append(board);
            winDiv.append(reset_btn);
           

            winDiv.append($(`<div class='score-div'>You won!<span id='score'> Your score: ${state.score}</span> </div>`));
           


           
            this.div = winDiv;
            document.getElementById("view-body").innerHTML = "";
            document.getElementById("view-body").appendChild(this.div[0]);
        })

        this.game.onLose(state => {
            let loseDiv = $('<div id="main-div-lose"><h1>2048</h1></div>'); 
            let board = $('<div class="board"></div>')
            .css('position', 'relative')
            .css('width', (120*this.game.width)+"px")
            .css('height', (120*this.game.width)+"px");
            for (let r=0; r< (this.game.width * this.game.width); r++) {
                
                let value = state.board[r];

                let cell_view;
                if (value == 0) {
                    cell_view = $(`<div class="cell tile${value}></div>`).css('width', "100px")
                .css('height', "100px");
                } else {
                    cell_view = $(`<div class="cell tile${value}">${value}</div>`).css('width', "100px")
                    .css('height', "100px");
                }
                board.append(cell_view);
            }
            loseDiv.append(board);
            loseDiv.append(reset_btn);
            loseDiv.append($(`<div class='score-div'><span>You Lost!</span><span id='score'> Final Score: ${state.score}</span> </div>`));
            this.div = loseDiv;

            
            document.getElementById("view-body").innerHTML = "";
            document.getElementById("view-body").appendChild(this.div[0]);
        
        })

    }

    
}
