// GLOBAL VARIABLES
var amount = 10;
var gridX = window.innerWidth/2 - (55 * 5);
var gridY = window.innerHeight/8;

var snake, snakeX = gridX, snakeY = gridY, speed = 55, dir = "", lastDir = "", prevX = [], prevY = [];
var fruit, fruitX = 0, fruitY = 0, score = 1, body = [];
var eye, eye2, eyeCounter = 0, offsetX1 = 6, offsetX2 = -15, offsetY1 = -14, offsetY2 = -14, eyeWidth, eyeHeight;
var dead = false, paused = false, highscore = 0;
var eatsFruitTimerMax = 1, eatsFruitTimer = 0;
var framerate = 6, speedBonus = 0.1;
var color1 = "", color2 = "", r = document.querySelector(':root');
var amountOfPlayers = 1;
var snake2, snake2X = gridX, snake2Y = gridY; 
var snakeEye, snakeEye2, offset2X1 = 6, offset2X2 = -15, offset2Y1 = -14, offset2Y2 = -14, eye2Width, eye2Height
var score2 = 0, body2 = [], prev2X = [], prev2Y = [], dir2 = "", lastDir2 = "";
var timer = 60, timerOver = false;

$(function () {
    spawnGrid(amount);
    eye = spawnEye();
    eye2 = spawnEye();
    snakeEye = spawnEye();
    snakeEye2 = spawnEye();
    fruit = spawnFruit();
    stick = spawnStick();
    leaf = spawnLeaf();

    if (localStorage.getItem("amountOfPlayers")) {
        amountOfPlayers = localStorage.getItem("amountOfPlayers");
    }

    if (amountOfPlayers == 2) {
        snake2 = spawnSnake();
        snake2.css({"top": snake2Y + "px"});
        snake2.css({"left": snake2X + "px"});
        
        snakeY = gridY + (55 * amount - 55);
        snakeX = gridX + (55 * amount - 55);

        $("#highscore").css({"display": "none"});
        $("#score2").css({"left": gridX-28 + "px", "top": gridY+560 + "px"});
        $("#score").text("PLAYER 1 SCORE: 0");
        $("#tutorial").css({"display": "none"});

        score2 += 2;
        body2.push(spawnBody());
    } else {
        snakeEye.css({"display": "none"});
        snakeEye2.css({"display": "none"});
        $("#tutorial2").css({"display": "none"});
        $("#score2").css({"display": "none"});
        $("#timer").css({"display": "none"});

        highscore = localStorage.getItem("highscore");
        if (highscore == null) { highscore = 0; }
        $("#highscore").text("HIGHSCORE: " + highscore);
    }

    snake = spawnSnake();

    $("#onePlayer").click(function() { changeMode("onePlayer"); });
    $("#twoPlayer").click(function() { changeMode("twoPlayer"); });

    $("#score").css({"left": gridX-28 + "px", "top": gridY+527 + "px"});
    $("#title").css({"left": gridX+385 + "px", "top": gridY+527 + "px"});
    $("#timer").css({"left": gridX+326 + "px", "top": gridY+560 + "px"});
    $("#gameOver").css({"left": gridX+170 + "px", "top": gridY+527 + "px"});
    $("#highscore").css({"left": gridX-28 + "px", "top": gridY+560 + "px"});
    $("#paused").css({"left": gridX+195 + "px", "top": gridY+527 + "px"});
    $("#tutorial").css({"left": gridX+540 + "px", "top": gridY-30 + "px"});
    $("#tutorial2").css({"left": gridX+540 + "px", "top": gridY-30 + "px"});
    $("#onePlayer").css({"left": gridX-300 + "px", "top": gridY-30 + "px"});
    $("#twoPlayer").css({"left": gridX-306.5 + "px", "top": gridY+5 + "px"});
    
    score += 1;
    body.push(spawnBody());

    setTimeout(loop, 1000/framerate);

    window.addEventListener("keydown", callback);

    changeColorPalette();
});

function timerLoop() {
    if (timer > 0) {
        timer -= 1;
        if (timer < 10) { $("#timer").css({"left": gridX+346 + "px", "top": gridY+560 + "px"}); }
        setTimeout(timerLoop, 1000);
    } else {
        dir = "";
        dir2 = "";
        timerOver = true;
    }
    $("#timer").text(timer + " SECOND(S)");
}

function changeMode(mode) {
    switch (mode) {
        case "onePlayer":
            amountOfPlayers = 1;
            break;
        case "twoPlayer":
            amountOfPlayers = 2;
            break;   
    }
    localStorage.setItem("amountOfPlayers", amountOfPlayers);
    location.reload();
}

function changeColorPalette() {
    var randomN = Math.floor(Math.random() * 6);

    switch(randomN) {
        case 0:
            color1 = "#72a488";
            color2 = "#212c28";
        break;
        case 1:
            color1 = "#8bc8fe";
            color2 = "#051b2c";
        break;
        case 2:
            color1 = "#f0f6f0";
            color2 = "#222323";
        break;
        case 3:
            color1 = "#c6baac";
            color2 = "#1e1c32";
        break;
        case 4:
            color1 = "#edf4ff";
            color2 = "#c62b69";
        break;
        case 5:
            color1 = "#ffd500";
            color2 = "#002f40";
        break;
    }
    
    r.style.setProperty('--color1', color1);
    r.style.setProperty('--color2', color2);
}

function loop() {
    setTimeout(loop, 1000/framerate);

    if (eatsFruitTimer == 0) {
        switch (dir) {
            case "up":
                if (snakeY == gridY) {
                    snakeY = gridY + (55 * (amount-1));
                } else {
                    snakeY -= speed;
                }
                snake.css({"top": snakeY + "px"});
                offsetX1 = 6, offsetX2 = -15, offsetY1 = -14, offsetY2 = -14, eyeWidth = 8, eyeHeight = 14;
            break;
    
            case "down":
                if (snakeY == gridY + (55 * (amount-1))) {
                    snakeY = gridY;
                } else {
                    snakeY += speed;
                }
                snake.css({"top": snakeY + "px"});
                offsetX1 = 6, offsetX2 = -15, offsetY1 = 0, offsetY2 = 0, eyeWidth = 8, eyeHeight = 14;
            break;
    
            case "right":
                if (snakeX == gridX + (55 * (amount-1))) {
                    snakeX = gridX;
                } else {
                    snakeX += speed;
                }
                snake.css({"left": snakeX + "px"});
                offsetX1 = 0, offsetX2 = 0, offsetY1 = 7, offsetY2 = -13, eyeWidth = 14, eyeHeight = 8;
            break;
    
            case "left":
                if (Math.floor(snakeX) == Math.floor(gridX)) {
                    snakeX = gridX + (55 * (amount-1));
                } else {
                    snakeX -= speed;
                }
                snake.css({"left": snakeX + "px"});
                offsetX1 = -12, offsetX2 = -12, offsetY1 = 7, offsetY2 = -13, eyeWidth = 14, eyeHeight = 8;
            break;
        }

        switch (dir2) {
            case "up":
                if (snake2Y == gridY) {
                    snake2Y = gridY + (55 * (amount-1));
                } else {
                    snake2Y -= speed;
                }
                snake2.css({"top": snake2Y + "px"});
                offset2X1 = 6, offset2X2 = -15, offset2Y1 = -14, offset2Y2 = -14, eye2Width = 8, eye2Height = 14;
            break;
    
            case "down":
                if (snake2Y == gridY + (55 * (amount-1))) {
                    snake2Y = gridY;
                } else {
                    snake2Y += speed;
                }
                snake2.css({"top": snake2Y + "px"});
                offset2X1 = 6, offset2X2 = -15, offset2Y1 = 0, offset2Y2 = 0, eye2Width = 8, eye2Height = 14;
            break;
    
            case "right":
                if (snake2X == gridX + (55 * (amount-1))) {
                    snake2X = gridX;
                } else {
                    snake2X += speed;
                }
                snake2.css({"left": snake2X + "px"});
                offset2X1 = 0, offset2X2 = 0, offset2Y1 = 7, offset2Y2 = -13, eye2Width = 14, eye2Height = 8;
            break;
    
            case "left":
                if (Math.floor(snake2X) == Math.floor(gridX)) {
                    snake2X = gridX + (55 * (amount-1));
                } else {
                    snake2X -= speed;
                }
                snake2.css({"left": snake2X + "px"});
                offset2X1 = -12, offset2X2 = -12, offset2Y1 = 7, offset2Y2 = -13, eye2Width = 14, eye2Height = 8;
            break;
        }
    
        eye.css({"left": snakeX+offsetX1 + "px", "top": snakeY+offsetY1 + "px", "width": eyeWidth + "px", "height": eyeHeight + "px"});
        eye2.css({"left": snakeX+offsetX2 + "px", "top": snakeY+offsetY2 + "px", "width": eyeWidth + "px", "height": eyeHeight + "px"});

        snakeEye.css({"left": snake2X+offset2X1 + "px", "top": snake2Y+offset2Y1 + "px", "width": eye2Width + "px", "height": eye2Height + "px"});
        snakeEye2.css({"left": snake2X+offset2X2 + "px", "top": snake2Y+offset2Y2 + "px", "width": eye2Width + "px", "height": eye2Height + "px"});
        
        if (!dead && !paused && !timerOver) {
            if (dir == "") {
                body[0].css({"top": snakeY + "px"});
                body[0].css({"left": snakeX + "px"});
            }
            prevX.push(snakeX);
            prevY.push(snakeY);

            for (var i = 0; i<score; i++) {
                if (prevX.length > score) {
                    prevX.shift();
                    prevY.shift();
                }
            }
        
            for (var i=0; i<body.length; i++) {
                body[i].css({"left": prevX[i] + "px", "top": prevY[i] + "px"});

                if (snakeX == prevX[i] && snakeY == prevY[i] && dir != "" && amountOfPlayers == 1) {
                    $("#gameOver").css({"display": "block"});
                    dir = "";
                    dead = true;
                    localStorage.setItem("highscore", highscore);
                }
            }
        }

        if (amountOfPlayers == 2 && !timerOver) {
            if (dir2 == "") {
                body2[0].css({"top": snake2Y + "px"});
                body2[0].css({"left": snake2X + "px"});
            }
            prev2X.push(snake2X);
            prev2Y.push(snake2Y);

            for (var i = 0; i<score2; i++) {
                if (prev2X.length > score2) {
                    prev2X.shift();
                    prev2Y.shift();
                }
            }
        
            for (var i=0; i<body2.length; i++) {
                body2[i].css({"left": prev2X[i] + "px", "top": prev2Y[i] + "px"});
            }
        }

        if (Math.floor(snakeX) == Math.floor(fruitX)-1 && Math.floor(snakeY) == Math.floor(fruitY)-1) {
            score += 1;
            
            respawnFruit();
    
            body.push(spawnBody());
            
            var realScore = score - 2;
            if (realScore > highscore && amountOfPlayers == 1) {
                highscore = realScore;
                $("#highscore").text("HIGHSCORE: " + highscore);
            }
            if (amountOfPlayers == 2) {
                $("#score").text("PLAYER 1 SCORE: " + realScore);
            } else {
                $("#score").text("SCORE: " + realScore);
            }
        }

        if (Math.floor(snake2X) == Math.floor(fruitX)-1 && Math.floor(snake2Y) == Math.floor(fruitY)-1 && amountOfPlayers == 2) {
            score2 += 1;
            
            respawnFruit();
    
            body2.push(spawnBody());
            
            $("#score2").text("PLAYER 2 SCORE: " + (score2-2).toString());
        }

    } else {
        eatsFruitTimer -= 1;
    }
}

function respawnFruit() {
    framerate += speedBonus;
    eatsFruitTimer = eatsFruitTimerMax;
    fruit.remove();
    stick.remove();
    leaf.remove();
    fruit = spawnFruit();
    stick = spawnStick();
    leaf = spawnLeaf();
}

function spawnEye() {
    eyeCounter += 1;
    var eye = $("<div class='eye'></div>");
    $("body").append(eye);

    eye.css({"left": snakeX + "px"});
    eye.css({"top": snakeY + "px"});

    return eye;
}

function spawnSnake() {
    var snake = $("<div class='snake'></div>");
    $("body").append(snake);

    snake.css({"left": snakeX + "px"});
    snake.css({"top": snakeY + "px"});

    return snake;
}

function spawnBody() {
    var body = $("<div class='snake body'></div>");
    $("body").append(body);

    body.css({"left": snakeX + "px"});
    body.css({"top": snakeY + "px"});

    return body;
}

function spawnStick() {
    var stick = $("<div class='stick'></div>");
    $("body").append(stick);

    stick.css({"left": fruitX + "px"});
    stick.css({"top": fruitY-10 + "px"});

    return stick;
}

function spawnLeaf() {
    var leaf = $("<div class='leaf'></div>");
    $("body").append(leaf);

    leaf.css({"left": fruitX + 4 + "px"});
    leaf.css({"top": fruitY - 16 + "px"});

    return leaf;
}

function spawnFruit() {
    var fruit = $("<div class='fruit'></div>");
    $("body").append(fruit);

    fruitX = gridX + (55 * Math.floor(Math.random() * (amount-1)) + 1);
    fruitY = gridY + (55 * Math.floor(Math.random() * (amount-1)) + 1);

    if (score == 1) {
        fruitX = gridX + (55 * Math.floor(0.5 * (amount-1)) + 1);
        fruitY = gridY + (55 * Math.floor(0.5 * (amount-1)) + 1);
    }
    
    fruit.css({"left": fruitX + "px"});
    fruit.css({"top": fruitY + "px"});

    return fruit;
}

function callback(e) {
    if (!dead && !timerOver) {
        if (e.keyCode == 38 && dir != "down" && !paused) {
            // UP 
            dir = "up";
        } else if (e.keyCode == 40 && dir != "up" && !paused) {
            // DOWN
            dir = "down";
        } else if (e.keyCode == 39 && dir != "left" && !paused) {
            // RIGHT
            dir = "right";
        } else if (e.keyCode == 37 && dir != "right" && !paused) {
            // LEFT
            dir = "left";
        } else if (e.keyCode == 87 && dir2 != "down" && !paused) {
            // W
            dir2 = "up";
        } else if (e.keyCode == 83 && dir2 != "up" && !paused) {
            // S
            dir2 = "down";
        } else if (e.keyCode == 68 && dir2 != "left" && !paused) {
            // D
            dir2 = "right";
        } else if (e.keyCode == 65 && dir2 != "right" && !paused) {
            // A
            dir2 = "left";
        } else if (e.keyCode == 27 && amountOfPlayers == 1) {
            // ESC
            paused = !paused;

            if (paused) {
                lastDir = dir;
                dir = "";
                $("#paused").css({"display": "block"});
            } else {
                dir = lastDir;
                $("#paused").css({"display": "none"});
            }
        }

        if (amountOfPlayers == 2) {
            if (dir != "" && dir2 == "") { dir2 = "down"; setTimeout(timerLoop, 1000); }
            if (dir == "" && dir2 != "") { dir = "up"; setTimeout(timerLoop, 1000); }
        }
    }
}

function spawnGrid(amount) {
    for (var i=0; i<amount; i++) {
        for (var j=0; j<amount; j++) {
            var square = $("<div class='square' id=" + "x" + j.toString() + "y" + i.toString() + "></div>");
            $("body").append(square);
            square.css("left", gridX + (55 * i));
            square.css("top", gridY + (55 * j));
        }
    }
}