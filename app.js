const express   = require('express');
const app       = express();
const http      = require('http');
const server    = require('http').createServer(app);  
const io        = require('socket.io')(server);

const LISTEN_PORT   = 8080;

app.get( '/', function( req, res ){ 
    res.sendFile( __dirname + '/public/3D.html' );
});

//socket.io stuff
//https://socket.io/docs/v3/emit-cheatsheet/

//server side varibles
let playerNum = 0;
let coopTotal = 0;

//on player connection
io.on('connection', (socket) => {
    
    //if the number of players is 0
    if(playerNum == 0){
        //make the first player to join player one
        console.log( socket.id + " Is Player One" );
        socket.id = "playerOne";
        console.log(socket.id);
        playerNum = 1;

        //emit the player number to the client
        socket.emit("assign_playernum", {id:playerNum});
    }
    //if there is already a player in the lobby and the connecting player is not player one
    else if(playerNum == 1 && socket.id !== "playerOne"){
        //make the second player to join player two
        console.log( socket.id + " Is Player Two" );
        socket.id = "playerTwo";
        console.log(socket.id);
        playerNum = 2;

        //emit the player number to the client
        socket.emit("assign_playernum", {id:playerNum});
    }
    //when recieved that players are shooting
    socket.on("shooting", (data) => {
        //if the shooting player is player one
        if(socket.id === "playerOne"){
            console.log( "player one shooting" );
            //emit to the clients that player one is shooting
            io.emit("player1_shooting", {id:socket.id});
        }
        //if the shooting player is player two
        else if(socket.id === "playerTwo"){
            console.log( "player two shooting" );
             //emit to the clients that player two is shooting
            io.emit("player2_shooting", {id:socket.id});
        }
    
    });
    socket.on("joinGame", (data) => {
        //print that a play has connected
    console.log( socket.id + " connected" );

    
    //if the player ID is connected to player one
    if(socket.id === "playerOne"){
        //when player one data is received
        console.log("player 1 moving");
        socket.on("player1Pos", (data) => {
            //emit the data to all the clients
            io.emit("player1_update", {xPos:data.xPos, yPos:data.yPos, zPos:data.zPos, xRot:data.xRot, yRot:data.yRot, zRot:data.zRot});
        });
    }
    //if the player ID is connected to player two
    else if(socket.id === "playerTwo"){
        //when player two data is received
        console.log("player 2 moving");
        socket.on("player2Pos", (data) => {
            //emit the data to all the clients
            io.emit("player2_update", {xPos:data.xPos, yPos:data.yPos, zPos:data.zPos, xRot:data.xRot, yRot:data.yRot, zRot:data.zRot});
        });
    }
    });
    
    //on player disconnect
    socket.on('disconnect', () => {
        //if the player is player one
        if(socket.id === "playerOne"){
            console.log( socket.id + " disconnected" );
            //set the player number to zero (to prepare for when player one joins again)
            playerNum = 0;
            io.emit('resetScores');

        }
        //if the player is player two
        else if(socket.id === "playerTwo"){
            console.log( socket.id + " disconnected" );
            //if player 1 is not disconnected, let player two disconnect so another player two can join
            if(playerNum != 0)
            {
                playerNum = 1;

            }
            io.emit('resetScores');
        }
    });
    //on teal being hit recieved
    socket.on("tealHit", (data) => {
        console.log( "player 1 hit" );
        //emit pink_wins to check is pick wins or increase pink's hit count
        io.emit("pink_wins", {r:255, g:0, b:0});
    });
    //on pink being hit recieved
    socket.on("pinkHit", (data) => {
        console.log( "player 2 hit" );
        //emit teal_wins to check is pick wins or increase teal's hit count 
        io.emit("teal_wins", {r:255, g:0, b:0});
    });

    //on recieving tally the score from teal
    socket.on("tealTallyScore", (data) => {
        //increase the team score
        coopTotal++;
        console.log("score is:" + coopTotal);
        //if the score is 20
        if(coopTotal === 20){
            //emit coop win
            io.emit("coopWin");
            //reset the score
            coopTotal = 0;
        }
    });
    //on recieving tally the score from pink
    socket.on("pinkTallyScore", (data) => {
        //increase the team score
        coopTotal++;
        console.log("score is:" + coopTotal);
        //if the score is 20
        if(coopTotal === 20){
            //emit coop win
            io.emit("coopWin");
            //reset the score
            coopTotal = 0;
        }
    });
});

app.use(express.static(__dirname + '/public')); //set root path of server ...
server.listen(LISTEN_PORT);
console.log("Listening on port: " + LISTEN_PORT );