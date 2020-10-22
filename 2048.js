import Game from "./engine/game.js";
import View from "./view.js";

let game = null;
let controller = null;
let view = null;



$(document).ready(() => {
    $('body').append("<div>Hello</div>"); 
    game = new Game(4);
    view = new View(game);


    $('body').empty().append(view.div);
});
