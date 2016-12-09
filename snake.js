var food, speed, score, timer, snakeBody, snakeHead, direction,
	canvas = document.getElementById("canvas"),
	canvasContext = canvas.getContext("2d"),
	canvasWidth = canvas.width,
	canvasHeight = canvas.height,
	deadVoice = new Audio("explosion.wav"),
	growthVoice = new Audio("powerup.wav");

document.onkeydown = function(e) {
	if (e.keyCode == 37 && direction != "right") {
		direction = "left";
	} else if(e.keyCode == 38 && direction != "down") {
		direction = "up";
	} else if(e.keyCode == 39 && direction != "left") {
		direction = "right";
	} else if(e.keyCode == 40 && direction != "up") {
		direction = "down";
	}
};

function initialValues() {
	score = 0;
	speed = 100;
	direction = "right";
	snakeBody = [
		{x: 40, y: 0},
		{x: 50, y: 0},
		{x: 60, y: 0},
		{x: 70, y: 0},
		{x: 80, y: 0},
		{x: 90, y: 0},
		{x: 100, y: 0}
	];
}

function makeFood() {
	food = {
		x: Math.floor(Math.random() * (canvasWidth / 10)) * 10,
		y: Math.floor(Math.random() * (canvasHeight / 10)) * 10,
	};
	for (var i = 0; i < snakeBody.length; i++) {
		var snakePart = snakeBody[i];
		if (food.x == snakePart.x && food.y == snakePart.y) {
			makeFood();
		}
	}
}

function increaseSpeed() { 
	clearInterval(timer);
	speed *= 0.9999;
	timer = setInterval(increaseSpeed, speed);
	draw();
}

function draw() {
	canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);

	canvasContext.fillStyle = "#f1654c";
	canvasContext.fillRect(food.x, food.y, 9, 9);

	canvasContext.fillStyle = "#555";
	canvasContext.fillText("score: " + score, 10, 30);
	canvasContext.fillText("speed: " + Math.ceil(100 - speed), 10, 20);

	snakeBody.shift();

	snakeHead = snakeBody[snakeBody.length - 1];

	if (direction == "left") {
		snakeBody.push({x: snakeHead.x - 10, y: snakeHead.y});
	} else if(direction == "up") {
		snakeBody.push({x: snakeHead.x, y: snakeHead.y - 10});
	} else if(direction == "right") {
		snakeBody.push({x: snakeHead.x + 10, y: snakeHead.y});
	} else if(direction == "down") {
		snakeBody.push({x: snakeHead.x, y: snakeHead.y + 10});
	}

	if (snakeHead.x == food.x && snakeHead.y == food.y) {
		makeFood();
		score += 10;
		growthVoice.play();
		snakeBody.unshift({x: snakeBody[0].x, y: snakeBody[0].y});
	}

	for (var i = 0; i < snakeBody.length; i++) {
		var snakePart = snakeBody[i];

		if (i == snakeBody.length - 1) {
			canvasContext.fillStyle = "#249991";
		} else {
			canvasContext.fillStyle = "#3e4651";
		}

		if (snakePart.x >= canvasWidth) {
			snakePart.x = 0;
		} else if (snakePart.x < 0) {
			snakePart.x = canvasWidth - 10;
		} else if (snakePart.y >= canvasHeight) {
			snakePart.y = 0;
		} else if (snakePart.y < 0) {
			snakePart.y = canvasHeight - 10;
		}

		canvasContext.fillRect(snakePart.x, snakePart.y, 9, 9);

		if (snakeHead.x == snakePart.x && snakeHead.y == snakePart.y && i < snakeBody.length - 2) {
			deadVoice.play();
			initialValues();
			alert("Dedsec. Score: " + score);
		}
	}
}

initialValues();
makeFood();
draw();
timer = setInterval(increaseSpeed, speed);