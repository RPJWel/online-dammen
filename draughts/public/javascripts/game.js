// Initialization of variables used throughout code
var selected1 = null,
    selected2 = null,
    col = document.getElementsByClassName("board"),
    whites = '<img src="images/White draught.png" class="whiteDraught">',
    blacks = '<img src="images/Black draught.png" class="blackDraught">',
    pWhites = '<img src="images/Promoted White.png" class="promoWhite">',
    pBlacks = '<img src="images/Promoted Black.png" class="promoBlack">',
    p1Left = document.getElementById("checkersLeft1"),
    p2Left = document.getElementById("checkersLeft2"),
    p1Captured = document.getElementById("checkersCaptured1"),
    p2Captured = document.getElementById("checkersCaptured2"),
    turn = whites;

// Setup the board when the document is fully loaded
var main = function() {
    "use strict"
    setupClick();
    setupDraughts(blacks + '</img>', 0, 4);
    setupDraughts(whites + '</img>', 6, 10);
}

// Setup all click events on black tiles
var setupClick = function() {
    for (var i = 0; i < col.length; i++) {
        var box = col[i].getElementsByClassName("black");
        
        for (var a = 0; a < box.length; a++) {
            box[a].onclick = select;
        }
    }
}

// Call with src of draughts and the colums on which they stand, then initializes the html inside with the images
var setupDraughts = function(src, start, end) {
    for (var i = start; i < end; i++) {
        var blk = col[i].getElementsByClassName("black");
    
        for(var a = 0; a < blk.length; a++) {
            blk[a].innerHTML = src;
        }
    }
}

// Initializes the two selected variables onclick
var select = function() {
    // Set selected1 to the first clicked item and border it
    if (selected1 === null) {
        selected1 = this;
        checkSlag()
        
        if ((selected1.innerHTML === whites || selected1.innerHTML ===pWhites) && turn === whites && selected1.innerHTML !== "") {
            selected1.style.background = "rgba(255, 0, 0, 0.4)"
        }
        else {                              // Else set selected1 back to null
            if ((selected1.innerHTML === blacks || selected1.innerHTML === pBlacks) && turn === blacks && selected1.innerHTML !== "" && selected1 !== null) {
                selected1.style.background = "rgba(255, 0, 0, 0.4)"
            }
            else {
                selected1 = null;
            }
        }
    }
    else {  // When selected1 is initialized, set selected2 to the second clicked item and make calls
        selected1.style.background = "";
        selected2 = this;
        move();
        promote();
        setNull();        
        checkEnd();
        changeTurn();
    }

}

// Look if the game has ended when either p1Left or p2Left = 0
var checkEnd = function() {
    if(parseInt(p1Left) === 0 || parseInt(p2Left) === 0) {
        window.alert("Game over");
    }
}

// Change turns when necessary
var changeTurn = function() {
    if (turn === whites) {
        turn = blacks;
    }
    else {
        turn = whites;
    }
}

// Checks if the two selected tiles are valid and if so swaps the two
var move = function() {

    if(valid()) {
        swap(selected1, selected2);
    }
    else {
        changeTurn();
    }
}

// Swap the contents of sel1 and sel2
var swap = function(sel1, sel2) {
    var temp = sel1.innerHTML;
    sel1.innerHTML = sel2.innerHTML;
    sel2.innerHTML = temp;
}

// Set selected1 and selected2 to null for the next turn
var setNull = function() {
    selected1 = null;
    selected2 = null;
}

// Returns a boolean when selected1 and selected2 are valid spaces in the game
var valid = function() {
    // Check if there is a slag between the two selected tiles and execute it, when executed the turn ends
    if(slag(selected1, selected2)) {
        selected1 = null;
        checkSlag();
        return false;
    }
    
    // When selected1 = selected2 don't move anything but keep the turn;
    if (selected1 === selected2) {
        return false;
    }

    if (selected1.innerHTML !== "") {   // Check if selected1 contains a draught
        if (selected2.innerHTML === "") {   // Check if selected2 is empty
            if(validSpace(selected1, selected2)) {  // Call validSpace to look if selected1 can move to selected2, if so return true;
                return true;       
            }
            else {
                return false;
            }
        }
        else {                              // When selected2 is occupied return false
            return false;
        }
    }
    else {                              // When selected1 is empty return false
        return false;
    }
}

// Check if draught can move to space, by looking at each square's original id
var validSpace = function(draught, space) {
    var side = (draught.id - space.id).toFixed(1) * 10; // side is the difference between the two id's multiplied by ten to get an integer
        
    // When draught is a white only let it move 'forward'
    if (draught.innerHTML === whites) {
        if (side === 11 || side === 9) {    // Check if side=11 or side=9 since then the square relative to the one selected is diagonal in front
            return true;
        }
    }
    // When draught is a black only let it move 'backwards'
    if (draught.innerHTML === blacks) {
        if (side === -11 || side === -9) {  // If side=-11 or side=-9 the square relative to the one selected is diagonal in the back
            return true;
        }
    }
    // When draught is a double of either color it can move diagonal in all directions
    if (draught.innerHTML === pWhites || draught.innerHTML === pBlacks) {
        // Check by remainder since every diagonal square relative to the draught is a multiple of 9 or 11
        if (side % 9 === 0) {
            return true;
        }
        if (side % 11 === 0) {
            return true;
        }
        
    }
    return false;
}

// Check wheter a slag can be done and then executes it
var slag = function(draught1, draught2) {
    var side = (draught1.id - draught2.id).toFixed(1) * 10,
        resSpace,
        resID;

    // When the two selected are opposites execute the following conditionals and return true to prevent another move
if (draught1.innerHTML === whites && (draught2.innerHTML === blacks || draught2.innerHTML === pBlacks) || draught1.innerHTML === blacks && (draught2.innerHTML === whites || draught2.innerHTML === pWhites)) {        
        /*
            For every case where side is a diagonal of the first selected get the ID of the square in front of it and set it to resID
            Then get the square from the HTML with resID and put it in resSpace
            update the player counter of left and captured
            then execute the slag
        */
        var execute = function(draught1, draught2, resID) {
            resSpace = document.getElementById(resID);
            if (doIt(draught1, draught2, resSpace)) {
                selected1 = null;
                selected2 = null;
                select();
                changeTurn();
            }
        }

        if (side === 9) {
            resID = (draught1.id - 1.8).toFixed(1);
            execute(draught1, draught2, resID);
        }

        if (side === 11) {
            resID = (draught1.id - 2.2).toFixed(1);
            execute(draught1, draught2, resID);
        }
        if (side === -9) {
            resID = (draught1.id - -1.8).toFixed(1);
            execute(draught1, draught2, resID);
        }
        if (side === -11) {
            resID = (draught1.id - -2.2).toFixed(1);
            execute(draught1, draught2, resID);
        }
        return true;
    }

    // When the first selected is promoted to a double create an array available and initialize a function add which pushes elements to available
    // Then put a local variable checked to null
    if (draught1.innerHTML === pWhites || draught1.innerHTML === pBlacks) {
        var available = new Array,
        add = function(x){available.push(document.getElementById(x))},
        checked = null;        

        /*
            Check if remainder of side % 9 or side % 11 = 0 to execute the code
                Check whether draught2.id is bigger or smaller then draught1.id
                    Then initialize available with every diagonal square going from draught2 to draught1 but not draught1
        */
        if (side % 9 === 0) {
            if (draught2.id > draught1.id) {
                for(var i = draught2.id; i > draught1.id; i = parseFloat(i - 0.9).toFixed(1)) {
                    add(i);
                }
            }
            else {
                for(var i = draught2.id; i < draught1.id; i = parseFloat(i - -0.9).toFixed(1)) {
                    add(i);
                }
            }
        }
        if (side % 11 === 0) {
            if (draught2.id > draught1.id) {
                for(var i = draught2.id; i > draught1.id; i = parseFloat(i - 1.1).toFixed(1)) {
                    add(i);
                }
            }
            else {
                for(var i = draught2.id; i < draught1.id; i = parseFloat(i - -1.1).toFixed(1)) {
                    add(i);
                }
            }
        }

        // Walk trough the array to check if a slag can be done
        for (var i = available.length - 1; i >= 0; i--) {
            /*
                First check if spot in the array is a black draught and that draught1 is a promoted White
                    If checked is null set checked to available[i]
                    Else return true so back in the call from valid it evaluates to false

                Second check if available[i] is empty
                    If checked !== null then set checked to an empty space and update the slag counter
                    lastly put checked back to null for the next in the array

                Lastly if any stone in the array is of the same color as the promoted return true so the move get's cancelled
            */
            if ((available[i].innerHTML === blacks || available[i].innerHTML === pBlacks) && draught1.innerHTML === pWhites) {
                if (checked === null) {
                    checked = available[i];
                }
                else {
                    return true;
                }
            }
            if (available[i].innerHTML === "") {
                if (checked !== null) {
                    checked.innerHTML = "";
                    update();
                    checked = null;
                }
            }
            if ((available[i].innerHTML === whites || available[i].innerHTML === pWhites) && draught1.innerHTML ===pWhites) {
                return true;
            }

            // Repetition of the code above but for the promoted blacks
            if ((available[i].innerHTML === whites || available[i].innerHTML === pWhites) && draught1.innerHTML === pBlacks) {
                if (checked === null) {
                    checked = available[i];
                }
                else {
                    return true;
                }
            }
            if (available[i].innerHTML === "") {
                if (checked !== null) {
                    checked.innerHTML = "";
                    update();
                    checked = null;
                }
            }
            if ((available[i].innerHTML === blacks || available[i].innerHTML === pBlacks) && draught1.innerHTML ===pBlacks) {
                return true;
            }
        }
    }
}

// Updates left and captured counters when a slag is made
var update = function() {
    if (selected1.innerHTML === whites || selected1.innerHTML === pWhites) {
        document.getElementById("val3").innerHTML = document.getElementById("val3").innerHTML - 1;
        document.getElementById("val2").innerHTML = parseInt(document.getElementById("val2").innerHTML) + 1;
    }
    if (selected1.innerHTML === blacks || selected1.innerHTML === pBlacks) {
        document.getElementById("val1").innerHTML = document.getElementById("val1").innerHTML - 1;
        document.getElementById("val4").innerHTML = parseInt(document.getElementById("val4").innerHTML) + 1;
    }
}

// make a slag when two regulare stones make a slag
var doIt = function(sel1, sel2, sel3) {
    if (sel3.innerHTML === "" && sel3.className === "black") {    // double check if sel3 is empty
        update();
        swap(sel1, sel3);               // swap sel1 and sel3 making sel1 skip one diagonal space
        sel2.innerHTML = "";            // set sel2 to a blank space
        selected2 = sel3                // then set selected2 to sel3
        return true;
    }
    else {
        return false;
    }
}

// When a stone reaches the end of the board, promoted them to a double
var promote = function() {
    if (selected2 === null) {
        return;
    }
    // When selected2 is white look if selected2.id begins with 0 for the end of the board
    if (selected2.innerHTML === whites) {
        if (Math.floor(selected2.id) === 0) {
            selected2.innerHTML = pWhites + "</img>";
        }
    }
    // When selected2 is black look if selected2.id begins with 9 for the end of the board
    if (selected2.innerHTML === blacks) {
        if (Math.floor(selected2.id) === 9) {
            selected2.innerHTML = pBlacks + "</img>";
        }
    }
}

var checkSlag = function() {
    var occupied = new Array
    if (turn === whites) {
        for(var i = 0; i < col.length; i++) {
            occupied.push(col[i].getElementsByClassName("black"));
        }
        callID(occupied, turn);
    }
    if (turn === blacks) {
        for(var i = 0; i < col.length; i++) {
            occupied.push(col[i].getElementsByClassName("black"));
        }
        callID(occupied, turn);
    }
}

var callID = function(occupied, turn) {
    var checkID,
        space = new Array;
    for (var i = 0; i < occupied.length; i++) {

    for (var a = 0; a < occupied[i].length; a++) {
        // console.log(occupied[i][a]);
        if (occupied[i][a].innerHTML === turn) {
            checkID = (occupied[i][a].id - -0.9).toFixed(1);
            if(domain(checkID)) {
                if(checkSpace(document.getElementById(checkID), turn, occupied[i][a].id)) {
                    // console.log('1');
                    space.push(occupied[i][a]);
                }
            }
            checkID = (occupied[i][a].id - 0.9).toFixed(1);
            if (domain(checkID)) {
                if(checkSpace(document.getElementById(checkID), turn, occupied[i][a].id)) {
                    // console.log('2');
                    space.push(occupied[i][a]);
                }
            }
            checkID = (occupied[i][a].id - -1.1).toFixed(1);
            if (domain(checkID)) {
                if(checkSpace(document.getElementById(checkID), turn, occupied[i][a].id)) {
                    // console.log('3');
                    space.push(occupied[i][a]);
                }
            }
            checkID = (occupied[i][a].id - 1.1).toFixed(1);
            if (domain(checkID)) {
                if(checkSpace(document.getElementById(checkID), turn, occupied[i][a].id)) {
                    // console.log('4');
                    space.push(occupied[i][a]);
                }
            }
        }
        if (turn === whites) {
            if (occupied[i][a].innerHTML === pWhites) {
                
            }

        }
        else {
            if (occupied[i][a].innerHTML === pBlacks) {

            }
        }
    }
    }
    styleIt(space);
}

var domain = function(x) {
    if(x <= 0.9 || x >= 9.0) {
        return false;
    }
    var dec = (x - Math.floor(x)).toFixed(1);

    if(dec === 0.9 || dec === 0.0) {
        return false;
    }
    return true
}

var styleIt = function(x) {
    for (var i = 0; i < x.length; i++) {
        x[i].style.background = "rgba(255, 0, 0, 0.5";
        if (x[i] === selected1) {
            x.forEach(e => {
                e.style.background = "";
            });
            return;
        }
        else {
            console.log(x.length);
            if (i === x.length - 1) {
                console.log(i, x.length);
                selected1 = null;
            }
        }
    }

}

var checkSpace = function(x, color, y) {
    if (color === whites) {
        if (x.innerHTML === blacks || x.innerHTML === pBlacks) {
            if (checkRes(x, y)) {
                return true;
            }
        }
    }
    if (color === blacks) {
        if (x.innerHTML === whites || x.innerHTML === pBlacks.whites) {
            if(checkRes(x, y)) {
                return true;
            }
        }
    }
    return false;
}

var checkRes = function(x, y) {
    var res = null;
    if ((x.id - 0.9).toFixed(1) === y) {
        res = (x.id - -0.9).toFixed(1);
        if (document.getElementById(res).innerHTML === "" && document.getElementById(res).className === "black") {
            return true;
        }
    }
    if ((x.id - -0.9).toFixed(1) === y) {
        res = (x.id - 0.9).toFixed(1);
        if (document.getElementById(res).innerHTML === "" && document.getElementById(res).className === "black") {
            return true;
        }
    }
    if ((x.id - 1.1).toFixed(1) === y) {
        res = (x.id - -1.1).toFixed(1);
        if (document.getElementById(res).innerHTML === "" && document.getElementById(res).className === "black") {
            return true;
        }
    }
    if ((x.id - -1.1).toFixed(1) === y) {
        res = (x.id - 1.1).toFixed(1);
        if (document.getElementById(res).innerHTML === "" && document.getElementById(res).className === "black") {
            return true;
        }
    }
    return false;
}

// Run main when the document is loaded
$(document).ready(main);