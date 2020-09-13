var minHeight=20;
var maxHeight=100;
var minWidth=10;
var maxWidth=30;
var minGap=100;
var maxGap=300;




gap = randGap();

//To define multiple obstacles, first declare the obstacle variable as an array.
var myObstacles=[];


//to make obstacle colorful
var colors=["red","blue","green","yellow","gray","indigo","Chocolate", "pink"];


//this run on every onload
function startGame(){
	gamearea.start();
}



function everyinterval(n){//frame counts how many types we run "update gameArea", if frame is a multiple of n we send true
	if(gamearea.frame % n==0) return true;
	return false;
}

function jump(spaceBar){
	if(spaceBar.keyCode == 32){
	player.speedY= -4;
}
}

function randGap(){
	return Math.floor(minGap+Math.random()*(maxGap-minGap+1));
}



//score
var scoreText={
	x:900,
	y:50,
	update:function(text){
		gamearea.context.fillStyle="red";
		gamearea.context.font="30px Consolas";
		gamearea.context.fillText(text,this.x,this.y);
	}
}

//player
var player={
	x:20,
	y:470,
	speedY:0,
	update:function(){
		gamearea.context.fillStyle="black";
		gamearea.context.fillRect(this.x,this.y,30,30);
	},
	// speed and maximum height reached by player is defined here. decreasing 280 will increase height.
	newPos:function(){
		if(this.y < 280){
		this.speedY=2;
		} 
		this.y = this.y + this.speedY;
		if(this.speedY==2 && this.y==470){
			this.speedY=0;
 }
	},
	crashWith:function(obs){//here 30 is added because this.x and this.y shows one point...adding 30 makes it the entire player.
		if(this.x+30 > obs.x  &&  this.x < obs.x+obs.width  &&  this.y+30 > obs.y){
			return true;
		}
		return false;
	}
}

//obstacle
function obstacle(){
	this.height=Math.floor(minHeight+Math.random()*(maxHeight-minHeight+1));
	this.width=Math.floor(minWidth+Math.random()*(maxWidth-minWidth+1));
	this.x=1200;
	this.y=gamearea.canvas.height-this.height;
	this.index=Math.floor(Math.random() * colors.length);
	this.color=colors[this.index];
	this.draw=function(){
		gamearea.context.fillStyle=this.color;
		gamearea.context.fillRect(this.x,this.y,this.width,this.height);
	}
	}


//handle the whole game
var gamearea={
	canvas:document.createElement("canvas"),
	start:function(){
		this.canvas.height=500;
		this.canvas.width=1200;
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.context=this.canvas.getContext("2d");
		this.frame=0;
		this.score=0;
		scoreText.update("Score: 0");
		this.interval=setInterval(this.updateGameArea,5);
		window.addEventListener("keydown",jump);
	},

  //In the updateGameArea function we must loop through every obstacle to see if there is a crash.
  // If there is a crash, the updateGameArea function will stop, and no more drawing is done.
	updateGameArea:function(){
		for(i=0; i<myObstacles.length; i++){
			if(player.crashWith(myObstacles[i])){
				gamearea.stop();
				return;
			}
		}
		gamearea.clear(); //clear the game area, so as to not create a huge obstacle with never ending width
		if(everyinterval(gap)){// here after running 'gap' value a new obstacle is added. example: if gap was 1 s, after every 1 sec a new obstacle will be added.
			myObstacles.push(new obstacle());// we added a new obstacle.
			gap=randGap();
			gamearea.frame=0;
		}// for decreasing x abscissa of the obstacles, meaning the obstacle will start from one one and with time go to another end.
		for(i=0;i<myObstacles.length;i++){
			myObstacles[i].x-=1;
			myObstacles[i].draw();
		}
		player.newPos();
		player.update();
		gamearea.frame+=1;
		gamearea.score+=0.01;
		scoreText.update("Score: "+Math.floor(gamearea.score));
	},
	clear:function(){
		gamearea.context.clearRect(0, 0, this.canvas.width, this.canvas.width);
	},
	stop:function(){
		clearInterval(this.interval);
		alert("Game over (*_*)");
		audio1.play();
	}
}
