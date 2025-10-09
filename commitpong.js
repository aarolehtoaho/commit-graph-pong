const UPDATE_SPEED = 500;
const GRAPH_HEIGHT = 7;
const GRAPH_WIDTH = 52;
const SQUARE_COUNT = GRAPH_HEIGHT * GRAPH_WIDTH;

var gameTiles = Array.from(Array(GRAPH_HEIGHT), () => new Array(GRAPH_WIDTH));

function addSquares() {
    const squares = document.querySelector('.squares');
    for (var i = 0; i < SQUARE_COUNT; i++) {
        squares.insertAdjacentHTML('beforeend', `<li id="square${i}" data-level="0"></li>`);
    } 
}
function updateSquares() {
    for (var i = 0; i < SQUARE_COUNT; i++) {
        const square = document.getElementById(`square${i}`);
        const row = i % GRAPH_HEIGHT;
        const column = Math.floor(i / GRAPH_HEIGHT);
        const color = gameTiles[row][column];
        square.setAttribute('data-level', color);        
    }
}
function updateGame() {
    for (var row = 0; row < GRAPH_HEIGHT; row++) {
        for (var column = 0; column < GRAPH_WIDTH; column++) {
            gameTiles[row][column] = Math.floor(Math.random() * 4);
        }
    }
}

addSquares();
setInterval(() => {
    updateGame();
    updateSquares();
}, 10 * UPDATE_SPEED);