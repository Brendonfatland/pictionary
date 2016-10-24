var socket = io();
var currentlyDrawing = false;


var WORDS = [
"word", "letter", "number", "person", "pen", "class", "people",
"sound", "water", "side", "place", "man", "men", "woman", "women", "boy",
"girl", "year", "day", "week", "month", "name", "sentence", "line", "air",
"land", "home", "hand", "house", "picture", "animal", "mother", "father",
"brother", "sister", "world", "head", "page", "country", "question",
"answer", "school", "plant", "food", "sun", "state", "eye", "city", "tree",
"farm", "story", "sea", "night", "day", "life", "north", "south", "east",
"west", "child", "children", "example", "paper", "music", "river", "car",
"foot", "feet", "book", "science", "room", "friend", "idea", "fish",
"mountain", "horse", "watch", "color", "face", "wood", "list", "bird",
"body", "dog", "family", "song", "door", "product", "wind", "ship", "area",
"rock", "order", "fire", "problem", "piece", "top", "bottom", "king",
"space"
];

var word_gen = function () {
var word_num = Math.floor((Math.random() * 100)) + 1;
var guess_word = WORDS[word_num];
console.log(guess_word);
$('#word').text("Your word to draw: " + guess_word + word_num);
};



var pictionary = function() {
    var canvas, context;
    var guessBox;


    var onKeyDown = function(event) {
        if (event.keyCode != 13) { // Enter
            return;
        }

        console.log(guessBox.val());
        var theCurrentGuess = guessBox.val();
        socket.emit('theCurrentGuess', theCurrentGuess);// an event sent to all conected clients.
        guessBox.val('');
        // var guess = guessBox.val();
        // socket.emit('guess',guess);
        // guessBox.val('');
    };

    guessBox = $('#guess input');
    guessBox.on('keydown', onKeyDown);

    var usersGuess = function(usersGuess) {
      console.log(usersGuess);
           $('#usersGuess').text("User has guessed: " + usersGuess);
       };

    var draw = function(position) {
        context.beginPath(); // Starts drawing function for Javascript
        context.arc(position.x, position.y, // creates an arc/curve functionality
            6, 0, 2 * Math.PI);
        context.fill(); //Draws/fills in the drawing path
    };

    canvas = $('canvas'); // targets canvas from index.html
    context = canvas[0].getContext('2d'); // sets canvas to 2d
    canvas[0].width = canvas[0].offsetWidth; // Sets width of canvas
    canvas[0].height = canvas[0].offsetHeight; // sets height of canvas

    canvas.on('mousedown', function(event) {
        currentlyDrawing = true;
    });

    canvas.on('mouseup', function(event) {
        currentlyDrawing = false;
    });

    canvas.on('mousemove', function(event) {
        var offset = canvas.offset(); //offset() method set or returns the offset coordinates for the selected elements
        var position = {
            x: event.pageX - offset.left, // how far from the left
            y: event.pageY - offset.top
        }; // how far from the top

        if (currentlyDrawing === true) {
            draw(position); // call function.
            socket.emit('draw', position); // an event sent to all conected clients.  Sending the position obj
        }
    });

    socket.on('draw', draw); // Listens for events sent by server. Mistake I had this set to position and it was terrible.
    socket.on('theCurrentGuess', usersGuess);
};

$(document).ready(function() {
    pictionary(); // Starts pictionary
    word_gen(); // Seelcts random word through the list.
});
