 
// this object is keeping track of the number,size and weather or 
// not they have been hit,miss or sunk
var model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,
    ships: [
    {
        locations:[0, 0, 0], 
        hits:["", "", ""]
    },

    {
        locations:[0, 0, 0], 
        hits:["", "", ""]
    },

    {
        locations:[0, 0, 0], 
        hits:["", "", ""]
    }],

    fire: function(guess){
        for (var i = 0; i < this.numShips; i++){
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess);

            if (index >= 0){
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("HIT!");

                if (this.isSunk(ship)) {
                    view.displayMessage("You sank my battlehship!");
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("You Missed.");
        return false;
    },

    isSunk: function(ship){
        for(i = 0; i < this.shipLength; i++){
            if (ship.hits[i] !== "hit"){
                return false;
            }
        }
        return true;
        
    },

    generateShipLocations: function() {
        var locations;

        for (var i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
        console.log("ships: ");
        console.log(this.ships);
    },

    generateShip: function() {
        var direction = Math.floor(Math.random() * 2);
        var row;
        var col;

        if (direction === 1) {  //horz
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
        } else {  //vert
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
            col = Math.floor(Math.random() * this.boardSize);
        }

        var newShipLocations = [];
        for (var i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + "" + (col + i));
            } else {
                newShipLocations.push((row + i) + "" + col);
            }
        }
        return newShipLocations;
    },

    collision: function(locations) {
        for (i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            for (var j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }

};

 
// model.fire("53");
// model.fire("06");
// model.fire("16");
// model.fire("26");
// model.fire("00");
// model.fire("01");
// model.fire("05");
// model.fire("03");
// model.fire("02");
// model.fire("31");
// model.fire("41");
var view = {
    // this method displays a string message in the display area
    displayMessage: function(msg){
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;

    },         
    displayHit: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");

    },        
    displayMiss: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");

    }        
      


};
 
function parseGuess(guess) {
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
    var alphabet = ["a", "b", "c", "d", "e", "f", "g"];

    if (guess === null || guess.length !== 2) {
        alert("Oops, please enter a letter and a number on the board.");
    } else {
        var row = alphabet.indexOf(guess.charAt(0));
        var column = guess.charAt(1);

        if (isNaN(row) || isNaN(column))  {
            alert("Opps, that isn't on the board.");
        } else if (row < 0 || row >= model.boardSize || 
                   column < 0 || column >= model.boardSize) {
            alert("Oops thats' off the board!");
        }  else if  (model.shipsSunk === model.numShips){
            view.displayMessage("You have already won. Take a break!");
        }else {
            return row + column;
        }     

       
    }
    return null;
    
    
}

// console.log(parseGuess("A0"));

var controller = {
    guesses: 0,

    processGuess: function(guess){
        var location = parseGuess(guess);
        if (location) {
            this.guesses++;
            var hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view . displayMessage("Your sank all my battleships, in " +
                this.guesses + " guesses");              
            }
        }
    }
};

// testing controller
// controller.processGuess("A0");
// controller.processGuess("A1");
// controller.processGuess("A2");
// controller.processGuess("C6");
// controller.processGuess("D1");
// controller.processGuess("E1");
// controller.processGuess("F1");
// controller.processGuess("B4");
// controller.processGuess("C4");
// controller.processGuess("D4");
// controller.processGuess("C3");

function init() {
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;

    model.generateShipLocations();

}
// tricks it into thinking the firebutton was clicked when enter key is pressed
function handleKeyPress(e) {
    var fireButton = document.getElementById("fireButton");
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}

 // get the players guess from the form
    // and then get it to the controller

function handleFireButton() {
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value;
    controller.processGuess(guess);

    guessInput.value = "";
   
}

window.onload = init;


