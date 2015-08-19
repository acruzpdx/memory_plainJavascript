"use strict";

var game = (function Game() {
    var pairsFound = 0;
    var view       = null;         // holds display reference
    var tile = ["green_card", "blue_card", "red_card", "pink_card",
                     "purple_card", "orange_card", "green_card",
                     "blue_card", "red_card", "pink_card", "purple_card",
                     "orange_card"
                    ];
    var TOTAL_PAIRS = tile.length/2;

    /*-----------------------------------------------------------------------*/
    /* Function:    startWithView(globalView)
    /* Purpose:     initializes game controller and sets view property to the
    /*              global view object that handles display.
    /*-----------------------------------------------------------------------*/
    function startWithView(globalView) {
        // INITIALIZATION - Start
        // Scramble the tiles
        _scrambleTiles();
        // Link the Game and the view

        if (globalView != null) {
            view = globalView;
            view.injectGame(this);
        }

    }     
    /*-----------------------------------------------------------------------*/
    /* Function:    _scrambleTiles()
    /* Purpose:     Randomly rearranges the tiles array. This array acts as
    /*              the model that the view uses to display the tiles and
    /*              that the game controller uses to determine game play. 
    /*-----------------------------------------------------------------------*/
    function _scrambleTiles() {
        var temp = null;
        var j = 0;
        for (var i=0;i< tile.length;i++) {
            j = Math.floor( (Math.random() *(tile.length - 1)));		
            temp = tile[i];
            tile[i] = tile[j];
            tile[j] = temp;
        }
    }
    /*-----------------------------------------------------------------------*/
    /* Function:    incrementPairsFound()
    /* Purpose:     Incrments counter that tracks game progress.
    /*-----------------------------------------------------------------------*/
    function incrementPairsFound() {
        pairsFound++;
    }
    
    /*-----------------------------------------------------------------------*/
    /* Function:    tileValueAtIndex(index)
    /* Purpose:     Returns tile[index] value. Assumes a one-to-one mapping
    /*              of the screentiles and the game tiles.
    /*-----------------------------------------------------------------------*/
    function tileValueAtIndex(i) {
        return tile[i];
    }
    /*-----------------------------------------------------------------------*/
    /* Function:    tileMatch(i,j)
    /* Purpose:     Returns true if tiles at indices i and j are equal.
    /*              Returns false, otherwise.
    /*-----------------------------------------------------------------------*/
    function tilesMatch(i,j) {
        return (tile[i] === tile[j]);
    }
    /*-----------------------------------------------------------------------*/
    /* Function:    reset()
    /* Purpose:     Sets game progress (pairsFound) to zero. Recreates game
    /*              tile order for new game experience.
    /*              Returns false, otherwise.
    /*-----------------------------------------------------------------------*/
    function reset() {
        _scrambleTiles();
        pairsFound = 0;
    }     
    /*-----------------------------------------------------------------------*/
    /* Function:    isOver()
    /* Purpose:     Returns true, if all tile pairs have been found.
    /*              Returns false, otherwise.
    /*-----------------------------------------------------------------------*/
    function isOver() {
      return (pairsFound == TOTAL_PAIRS);
    }
    return {
        startWithView: startWithView,
        tileValueAtIndex: tileValueAtIndex,
        tilesMatch: tilesMatch,
        incrementPairsFound: incrementPairsFound,
        isOver: isOver,
        reset: reset,
    }
})(); // end IIFE
