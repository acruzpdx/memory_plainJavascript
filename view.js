"use strict";

var view = (function View() {
    var game                  = null;
    var screenTileArray       = [];
    var firstTile             = null;
    var secondTile            = null;
    var timeSpan              = null;
    var seconds               = 0;
    var modalMsgBox           = null;
    var newGameButton         = null;
    var timerHandle           = null;

    var FACE_UP               = 0;
    var FACE_DOWN             = 1;
    var INVISIBLE             = 2;
    var DELAY                 = 500;
    
    /*-----------------------------------------------------------------------*/
    /* INITIALIZATION CODE -- Start
    /* Purpose:     Sets up initial UI elements when game created.
    /*-----------------------------------------------------------------------*/
    var element;

    // Wire up the screenTiles
    screenTileArray = document.getElementsByClassName("tile");
    for (var i = 0; i < screenTileArray.length; i++) {
        screenTileArray[i].addEventListener("click",_screenTileClickHandler);
    }

    // Clear the timer string
    timeSpan = document.getElementById("time");
    timeSpan.firstChild.nodeValue = " ";

    // Set the screen tiles to initial 'face down' state
    _setTilesToDefault(); 

    /*-----------------------------------------------------------------------*/
    /* Function:    _newGameButtonClickHandler
    /* Purpose:     Executed when newGameButton is pressed. Calls _reset()
    /*              for now.
    /*-----------------------------------------------------------------------*/
    function _newGameButtonClickHandler() {
        _reset();
    }
    /*-----------------------------------------------------------------------*/
    /* Function:    _screenTileClickHandler()
    /* Purpose:     Changes display of tiles and checks with the game object
    /*              to see how to continue.
    /*-----------------------------------------------------------------------*/
    function _screenTileClickHandler() {
        // Determine which tile has been selected
        var i = Array.prototype.indexOf.call(screenTileArray,this);
        
        if (timerHandle === null){
            _startTimer();
        }

        // ignore clicks on already selected tile or if
        // two tiles have already been selected
        if (i === firstTile || secondTile !== null) {
            return;
        }
        // it is either the first tile or the second
        if (firstTile === null) {
            firstTile = i;
        } else {
            secondTile = i;
        }
        // show the tile
        _setTile(i,FACE_UP);

        // if 2 tiles have been selected ...
        if (secondTile !== null) {
            // check if they match
            if (game.tileValueAtIndex(firstTile) === game.tileValueAtIndex(secondTile)) {
                // if they match, hide them, after letting the user see them
                setTimeout(function(){
                    _setTile(firstTile,INVISIBLE);
                    _setTile(secondTile,INVISIBLE);
                    // get ready for the next set of selections
                    firstTile = null;
                    secondTile = null;
                    // and increment the pairsFound counter
                    game.incrementPairsFound();
                    // check if we have found all the pairs
                    if (game.isOver()) {
                        clearInterval(timerHandle);
                        console.log("game over. all pairs found");
                        _askToPlayAgain();
                    }
                },DELAY);
            } else {
                // if they dont' match set them face down
                // after letting the user see them
                setTimeout(function() {
                    _setTile(firstTile,FACE_DOWN);
                    _setTile(secondTile,FACE_DOWN) 
                    // get ready for the next set of selections
                    firstTile = null;
                    secondTile = null;
                }, DELAY);
            }
        }
    }
    /*-----------------------------------------------------------------------*/
    /* Function:    _askToPlayAgai
    /* Purpose:     Unobtrusively adds DOM elements to create modal box and
    /*              button to restart game
    /*-----------------------------------------------------------------------*/
    function _askToPlayAgain() {
        var gameBoard = document.getElementById("gameboard");

        // Create modal Msg Box Container
        var modalMsgBoxContainer = document.createElement("DIV");
        modalMsgBoxContainer.innerHTML = "<h1>GAME OVER</h1>";
        modalMsgBoxContainer.setAttribute("id","modalMsgBoxContainer");

        // Add a button to the container
        var newGameButton = document.createElement("BUTTON");
        newGameButton.innerHTML = "Click to Play Again";
        newGameButton.setAttribute("id","newGameButton");
        modalMsgBoxContainer.appendChild(newGameButton);

        // Add modal msg Window to gameBoard
        gameBoard.appendChild(modalMsgBoxContainer);
        // Wire up code to the button
        newGameButton.addEventListener("click", _newGameButtonClickHandler);
    }
    /*-----------------------------------------------------------------------*/
    /* Function:    _startTimer
    /* Purpose:     Starts time to monitor time until tiles are cleared.
    /*              Also, updates the time on the gameboard.
    /*-----------------------------------------------------------------------*/
    function _startTimer() {
        if (timerHandle === null) {
            timerHandle = setInterval( function() {
                timeSpan.firstChild.nodeValue ="Time: " +
                    Math.floor(seconds/60) + ":" + _prependZeroIfNeeded(seconds%60);
                seconds += 1;
            }, 1000);
        } 
    }
    /*-----------------------------------------------------------------------*/
    /* Function:    _prependZeroIfNeeded(val)
    /* Purpose:     Prepends a zero if needed to make the time prettier.
    /*-----------------------------------------------------------------------*/
    function _prependZeroIfNeeded(val) {
        var temp = "";
        if (val<10 && val>=0) {
            temp = "0"+val;
            return temp;
        }
        return val.toString();
    }
    /*-----------------------------------------------------------------------*/
    /* Function:    _setTile(index,state)
    /* Purpose:     Changes how the clicked tile (tile at index) is displayed
    /*              Uses value returned by game controller to set color.
    /*-----------------------------------------------------------------------*/
    function _setTile(i,state) {
        var tempString = "";

        switch(state) {
            case FACE_UP:
                screenTileArray[i].classList.add(game.tileValueAtIndex(i));
                screenTileArray[i].children[0].classList.add("invisible");
                break;
            case FACE_DOWN:
                screenTileArray[i].setAttribute("class","tile");
                screenTileArray[i].children[0].setAttribute("class","");
                break;
            case INVISIBLE:
                tempString = screenTileArray[i].getAttribute("class");
                tempString = tempString + " invisible";
                screenTileArray[i].setAttribute("class",tempString);
                break;
        }
    }
    /*-----------------------------------------------------------------------*/
    /* Function:    _reset()
    /* Purpose:     Removes the modal box and button and resets all the tiles
    /*              and time string to default state. Also calls game
    /*              controller to create new tile values.
    /*-----------------------------------------------------------------------*/
    function _reset() {
        // Clear timer
        clearInterval(timerHandle);
        timerHandle = null;

        // Reset all UI elements to default states

        // Hide the modalMsg Box
        var element = document.getElementById("modalMsgBoxContainer");
        if (element != null) {
            var parent = element.parentNode;
            parent.removeChild(element);
        }
        // Clear the timer string value
        timeSpan.firstChild.nodeValue= "";
        // Set the screen tiles to the 'face down' state
        _setTilesToDefault();
        if (game!= null) {
            // Have the game controller recreate new game tiles
            game.reset();
        }
    }
    /*-----------------------------------------------------------------------*/
    /* Function:    _setTilesToDefault()
    /* Purpose:     Sets tiles to their default, face_down, state.
    /*-----------------------------------------------------------------------*/
    function _setTilesToDefault() {
        // Set screenTiles to "face-down" state
        for ( var i = 0; i < screenTileArray.length; i++) {
            // Make all tiles visible
            screenTileArray[i].setAttribute("class","tile");
            // Make "Click me" msgs visible on all tiles
            screenTileArray[i].children[0].setAttribute("class","");
        }
    }
    /*-----------------------------------------------------------------------*/
    /* Function:    injectGame(game)
    /* Purpose:     sets internal game variable to global game controller
    /*-----------------------------------------------------------------------*/
    function injectGame(gamecontroller) {
        if (gamecontroller !== null) {
            game = gamecontroller;
        }
    }
    return {
        injectGame: injectGame
    }
})(); // end of IIFE
