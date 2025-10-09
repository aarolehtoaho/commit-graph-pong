const UPDATE_SPEED = 500;
const GRAPH_HEIGHT = 7;
const GRAPH_WIDTH = 52;
const SQUARE_COUNT = GRAPH_HEIGHT * GRAPH_WIDTH;

var gameTiles = Array.from(Array(GRAPH_HEIGHT), () => new Array(GRAPH_WIDTH));

function getRandomDirection() { return (Math.random() < 0.5 ? -1 : 1)}
function getRandomAngle() { return Math.round(1 - Math.random() * 2); }
const ball = {
    xPos: GRAPH_WIDTH / 2,
    yPos: GRAPH_HEIGHT / 2,
    direction: getRandomDirection(),
    angle: getRandomAngle(),
    updatePosition: function() {
        this.yPos += this.direction;
        this.xPos += this.angle;
    },
    handleCollisions: function() {
        if (this.xPos < 0 || this.xPos > GRAPH_WIDTH) {
            this.angle = -this.angle;
            this.xPos += this.angle;
        }
        if (this.yPos < 0 || this.yPos > GRAPH_HEIGHT) {
            this.xPos = GRAPH_WIDTH / 2;
            this.yPos = GRAPH_HEIGHT / 2;
            this.direction = getRandomDirection();
            this.angle = getRandomAngle();
        }
    }
}

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
function drawColor(x, y, level) {
    gameTiles[Math.floor(y)][Math.floor(x)] = level;
}
function updateGame() {
    drawColor(ball.xPos, ball.yPos, 0);
    ball.updatePosition();
    ball.handleCollisions();
    drawColor(ball.xPos, ball.yPos, 1 + Math.floor(Math.random() * 3));

    /*
    for (var row = 0; row < GRAPH_HEIGHT; row++) {
        for (var column = 0; column < GRAPH_WIDTH; column++) {
            gameTiles[row][column] = Math.floor(Math.random() * 4);
        }
    }
    */
}

addSquares();
setInterval(() => {
    updateGame();
    updateSquares();
}, UPDATE_SPEED);