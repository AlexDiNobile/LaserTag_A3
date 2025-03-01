const express   = require('express');
const app       = express();
const http      = require('http');
const server    = require('http').createServer(app);  
const io        = require('socket.io')(server);

const LISTEN_PORT   = 8080;

//our routes
app.get( '/', function( req, res ){ 
    res.sendFile( __dirname + '/public/index.html' );
});

app.get( '/2D', function( req, res ){ 
    res.sendFile( __dirname + '/public/2D.html' );
});

app.get( '/3D', function( req, res ){ 
    res.sendFile( __dirname + '/public/3D.html' );
});

//socket.io stuff
//https://socket.io/docs/v3/emit-cheatsheet/

let playerNum = 0;
let coopTotal = 0;
let timerStarted = false;

io.on('connection', (socket) => {
    console.log( socket.id + " connected" );

    if(playerNum == 0){
        console.log( socket.id + " Is Player One" );
        socket.id = "playerOne";
        console.log(socket.id);
        playerNum = 1;
        io.local.emit("assign_playernum", {id:playerNum});
        io.local.emit("swap_cam", {id:playerNum});
    }
    else if(playerNum == 1 && socket.id !== "playerOne"){
        console.log( socket.id + " Is Player Two" );
        socket.id = "playerTwo";
        console.log(socket.id);
        playerNum = 2;
        console.log("precam swap");
        //sends player number
        io.local.emit("assign_playernum", {id:playerNum});
        io.local.emit("swap_cam", {id:playerNum});
    }


    socket.on("shooting", (data) => {
        if(socket.id === "playerOne"){
            console.log( "player one shooting" );
            io.emit("player1_shooting", {id:socket.id});
        }
        else if(socket.id === "playerTwo"){
            console.log( "player two shooting" );
            io.emit("player2_shooting", {id:socket.id});
        }
    
    });
    

    if(socket.id === "playerOne"){
        socket.on("player1Pos", (data) => {
            //console.log( "Player One Present" );
            io.emit("player1_update", {xPos:data.xPos, yPos:data.yPos, zPos:data.zPos, xRot:data.xRot, yRot:data.yRot, zRot:data.zRot});
        });
    }
    else if(socket.id === "playerTwo"){
        socket.on("player2Pos", (data) => {
            //console.log( "Player Two Present" );
            io.emit("player2_update", {xPos:data.xPos, yPos:data.yPos, zPos:data.zPos, xRot:data.xRot, yRot:data.yRot, zRot:data.zRot});
        });
    }
    
    socket.on('disconnect', () => {
        if(socket.id === "playerOne"){
            console.log( socket.id + " disconnected" );
            playerNum = 0;
        }
        else if(socket.id === "playerTwo"){
            console.log( socket.id + " disconnected" );
            //if player 1 is not disconnected already, prepare for player 2 to join
            //otherwise keep as 0 as we will need both players to join
            if(playerNum != 0)
            {
                playerNum = 1;
            }
        }
    });

    socket.on("tealHit", (data) => {
        console.log( "player 1 hit" );
        io.emit("pink_wins", {r:255, g:0, b:0});
    });

    socket.on("pinkHit", (data) => {
        console.log( "player 2 hit" );
        io.emit("teal_wins", {r:255, g:0, b:0});
    });

    socket.on("startTimer", (data) => {
        if(timerStarted === false){
            var timer = 10;
            var timerCountdown = setInterval(function(){
                console.log(timer);
                io.sockets.emit('timer', {time:timer});
                timer--
                if (timer === -1) {
                    io.sockets.emit('coopFailed');
                    clearInterval(timerCountdown);
                    timerStarted = false;
                }
            }, 1000);
            timerStarted = true;
        }
    });

    socket.on("tealTallyScore", (data) => {
        coopTotal++;
        console.log(data.tealScore);
        console.log("score is:" + coopTotal);
        if(coopTotal === 20){
            console.log("Teal Team work!");
            io.emit("coopWin");
            coopTotal = 0;
        }
    });
    socket.on("pinkTallyScore", (data) => {
        coopTotal++;
        console.log(data.pinkScore);
        console.log("score is:" + coopTotal);
        if(coopTotal === 20){
            console.log("Pink Team work!");
            io.emit("coopWin");
            coopTotal = 0;
        }
    });

    
    //question 1: how do you continuously update the network, e.g., users position and orientation?
    //question 2: how do you synch clients to current state?
});

app.use(express.static(__dirname + '/public')); //set root path of server ...
server.listen(LISTEN_PORT);
console.log("Listening on port: " + LISTEN_PORT );