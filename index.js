var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

let game = []
let gameResults = {
    'rock': { win: 'scissor', lose: 'paper' },
    'scissors': { win: 'paper', lose: 'rock' },
    'paper': { win: 'rock', lose: 'scissors' }
}

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    let eventName = 'playGame';
    socket.on(eventName, (msg, ackFn) => {
        game.push({playerid: socket.id, msg: msg, result: undefined})
        if ( game.length == 2 ){
            gameOutcome()
            io.to(game[0].playerid).emit( eventName, game[1].msg + " - " + game[0].result ) 
            io.to(game[1].playerid).emit( eventName, game[0].msg + " - " + game[1].result ) 
            // ToDo: log to database
            game = []
        }
    });
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});

function gameOutcome() {
    p1Choice = game[0].msg.match(/\w+$/g).join()
    p2Choice = game[1].msg.match(/\w+$/g).join()
        if ( p1Choice == p2Choice) { 
            game[0].result = 'You draw :-|', game[1].result = 'You Draw :-|'
        } else {
            game[0].result =  gameResults[p1Choice]['lose'] == p2Choice ? "You Lose :(" : "You Win :)" 
            game[1].result =  gameResults[p2Choice]['lose'] == p1Choice ? "You Lose :(" : "You Win :)"
            }
}