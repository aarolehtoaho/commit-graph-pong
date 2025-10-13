const UPDATE_SPEED = 400;
const GRAPH_HEIGHT = 7;
const GRAPH_WIDTH = 52;
const SQUARE_COUNT = GRAPH_HEIGHT * GRAPH_WIDTH;
const UP = -1;
const DOWN = 1;
const COLOR = true
const NO_COLOR = false

function getRandomColor() { return 1 + Math.floor(Math.random() * 3); }
function getRandomDirection() { return (Math.random() < 0.5 ? -1 : 1)}
function getRandomAngle() { return Math.round(1 + Math.random()) * getRandomDirection(); }

var gameTiles = Array.from(Array(GRAPH_HEIGHT), () => new Array(GRAPH_WIDTH));
var updatedTiles = [];

function drawColor(xIndex, yIndex, level) {
    const intX = Math.floor(xIndex);
    const intY = Math.floor(yIndex);
    if (intX >= 0 && intX < GRAPH_WIDTH && intY >= 0 && intY < GRAPH_HEIGHT) {
        gameTiles[intY][intX] = level;
        updatedTiles.push({x: intX, y: intY});
    } else {
        console.log("Index out of bounds");
    }
}

const player1 = {
    xPos: Math.floor(GRAPH_WIDTH / 2),
    yPos: 0,
    draw: function(colored) {
        for (var i = -1; i <= 1; i++) {
            drawColor(this.xPos + i, this.yPos, colored ? getRandomColor() : 0);
        }
    },
    ballComing: function() {
        return ball.direction == UP;
    },
    distanceToBall: function() {
        return Math.abs(ball.xPos - this.xPos);
    },
    calculateSpeed: function() {
        var speed = Math.abs(ball.angle);

        if (this.distanceToBall() > 3) {
            speed += 1;
        }
        if (this.distanceToBall() > 6) {
            speed += 1;
        }
        
        var ballMovingAway = (this.xPos < ball.xPos && ball.angle > 0) || (this.xPos > ball.xPos && ball.angle < 0);
        if (ballMovingAway && this.distanceToBall() > 1) {
            speed += 1;
        }

        const speedCap = 3;
        return Math.min(speed, speedCap);
    },
    checkBounds: function() {
        if (this.xPos < 1) {
            this.xPos = 1;
        } else if (this.xPos > GRAPH_WIDTH - 2) {
            this.xPos = GRAPH_WIDTH - 2;
        }        
    },
    update: function() {
        if ((this.ballComing() && this.xPos != ball.xPos) || this.distanceToBall() > 5) {
            this.draw(NO_COLOR);
            var moveDistance = this.calculateSpeed() * (this.xPos < ball.xPos ? 1 : -1);
            this.xPos += moveDistance;
            this.checkBounds();
            this.draw(COLOR);
        }
    }
}

const player2 = Object.assign({}, player1);
player2.yPos = GRAPH_HEIGHT - 1;
player2.ballComing = function() {
    return ball.direction == DOWN;
};

const ball = {
    xPos: Math.floor(GRAPH_WIDTH / 2),
    yPos: Math.floor(GRAPH_HEIGHT / 2),
    direction: getRandomDirection(),
    angle: getRandomAngle(),
    updatePosition: function() {
        this.yPos = Math.floor(this.yPos + this.direction);
        this.xPos = Math.floor(this.xPos + this.angle);
    },
    reset: function() {
        this.xPos = Math.floor(GRAPH_WIDTH / 2);
        this.yPos = Math.floor(GRAPH_HEIGHT / 2);
        this.direction = getRandomDirection();
        this.angle = getRandomAngle();
    },
    bounce: function() {
        this.direction = -this.direction;
        this.yPos = Math.floor(this.yPos + this.direction);
        this.xPos = Math.floor(this.xPos - this.angle);
        this.angle = getRandomAngle();
        this.updatePosition();
    },
    handleCollisions: function() {
        var sideCollision = this.xPos < 0 || this.xPos >= GRAPH_WIDTH;
        if (sideCollision) {
            this.angle = -this.angle;
            this.xPos = Math.floor(this.xPos + this.angle * 2);
        }
        var outOfMap = this.yPos < 0 || this.yPos >= GRAPH_HEIGHT;
        if (outOfMap) {
            this.reset();
        }
        var player1Collision = this.yPos == player1.yPos && (this.xPos <= player1.xPos + 1) && (this.xPos >= player1.xPos - 1);
        var player2Collision = this.yPos == player2.yPos && (this.xPos <= player2.xPos + 1) && (this.xPos >= player2.xPos - 1);
        if (player1Collision || player2Collision) {
            this.bounce();
        }
    },
    update: function() {
        var ballOnPlayer = (this.yPos == player1.yPos && this.xPos <= player1.xPos + 1 && this.xPos >= player1.xPos - 1) ||
                           (this.yPos == player2.yPos && this.xPos <= player2.xPos + 1 && this.xPos >= player2.xPos - 1);
        if (!ballOnPlayer) {
            drawColor(this.xPos, this.yPos, 0);
        }
        this.updatePosition();
        this.handleCollisions();
        drawColor(this.xPos, this.yPos, getRandomColor());     
    }
}

function addSquares() {
    const squares = document.querySelector('.squares');
    for (var i = 0; i < SQUARE_COUNT; i++) {
        squares.insertAdjacentHTML('beforeend', `<li id="square${i}" data-level="0"></li>`);
    } 
}

function updateSquares() {
    /*
    for (var i = 0; i < SQUARE_COUNT; i++) {
        const square = document.getElementById(`square${i}`);
        const row = i % GRAPH_HEIGHT;
        const column = Math.floor(i / GRAPH_HEIGHT);
        const color = gameTiles[row][column];
        square.setAttribute('data-level', color);        
    }
    */
    updatedTiles.forEach(tile => {
        const square = document.getElementById(`square${(tile.x - 1) * GRAPH_HEIGHT + tile.y}`);
        const color = gameTiles[tile.y][tile.x];
        square.setAttribute('data-level', color);
    });
    updatedTiles = [];
}

function squareDrawTest() {
    for (var row = 0; row < GRAPH_HEIGHT; row++) {
        for (var column = 0; column < GRAPH_WIDTH; column++) {
            gameTiles[row][column] = Math.floor(Math.random() * 4);
        }
    }
}

function updateGame() {
    player1.update();
    player2.update();
    ball.update();

    //squareDrawTest();
}

function init() {
    player1.draw(COLOR);
    player2.draw(COLOR);
    addSquares();
}

init();
setInterval(() => {
    updateGame();
    updateSquares();
}, UPDATE_SPEED);