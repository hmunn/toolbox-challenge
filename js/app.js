"use strict";

var tiles = [];
var idx;
for (idx = 1; idx <= 32; idx++) {    
    tiles.push({
        tileNum: idx,
        src: 'img/tile' + idx + '.jpg',
        flipped: false,
        matched: false
    });
}


var gameTimer;
var gameSeconds = 0;
var gamePairs
$(document).ready(function() { 
    $('#start-game').click(function() {
        var matches = 0;
        var turns = 0;
        $('#game-board').empty();
        $('#game-board').css('display', 'inline');
        clearInterval(gameTimer);
        
        var startTime = Date.now();
        gameTimer = window.setInterval(function() {
            gameSeconds = Math.floor((Date.now() - startTime) / 1000);
            if (gameSeconds === 1) {
           		$('#game-seconds').text(gameSeconds + ' second');
        	} else {
            	$('#game-seconds').text(gameSeconds + ' seconds');
        	}
            $('#successful-matches').text(matches);
            $('#remaining-matches').text(gamePairs - matches);
            $('#game-turns').text(turns);
        }, 1000);
        
        tiles = _.shuffle(tiles);
        var selectedTiles = tiles.slice(0,8);
        gamePairs = selectedTiles.length;
        var tilePairs = [];
        _.forEach(selectedTiles, function(tile) {
            tile.flipped = false;
            tile.matched = false;
            tilePairs.push(tile);
            tilePairs.push(_.clone(tile));
        });
        tilePairs = _.shuffle(tilePairs);
        var gameBoard = $('#game-board');
        var row = $(document.createElement('div'));
        var img;
        _.forEach(tilePairs, function(tile, elemIndex) {
            if(elemIndex > 0 && 0 == (elemIndex % 4)) {
                gameBoard.append(row);
                row = $(document.createElement('div'));
            }
            var img = $(document.createElement('img'));
            img.attr({
                src: 'img/tile-back.png',
                alt: 'tile ' + tile.tileNum
            });
            
            img.data('tile', tile);
            row.append(img);
        });
        gameBoard.append(row);
        row.fadeIn(1000);
        
        var count = 0;
        var prevTile;
        var prevClickedImg;
        var timeOut = null;
        $('#game-board img').click(function() { 
            if(timeOut != null) {
                if(!prevClickedImg.flipped) {
                    window.setTimeout(function() {
                        clearTimeout(timeOut);    
                        timeOut = null;
                    }, 1000);
                }
                return;
            }
            if($(this).data('tile').flipped) {return;}
            count++;
            if(count % 2 == 0) {
                count = 0;
                turns++;
                var clickedImg = $(this);
                var tile = clickedImg.data('tile');
                flipTile(tile, clickedImg);

                if(tile.tileNum == prevTile.tileNum) {
                    matches++;
                } else {
                    timeOut = window.setTimeout(function() {
                        flipTile(tile, clickedImg);
                        flipTile(prevTile, prevClickedImg);
                        timeOut = null;
                    }, 1000);
                    
                }
            } else {
                prevClickedImg = $(this);
                prevTile = prevClickedImg.data('tile');
                flipTile(prevTile, prevClickedImg);
            }
            if(matches == 8) {
                var winTime = Math.floor(gameSeconds);
                clearInterval(gameTimer);
                clearInterval(timeOut);
                $('#score').fadeOut(1000);
                $('#end-game').text('Congratulations! You won in ' + turns + ' turns and ' + winTime + ' seconds');
                $('#end-game').fadeIn(1000);
                $('#successful-matches').text(matches); 
                $('#remaining-matches').text(gamePairs - matches);

            }
        });// img click
        
    });// start game button click

});// ready function

function flipTile(tile, img) {
    img.fadeOut(100, function() {
        if (tile.flipped) {
            img.attr('src', 'img/tile-back.png');
        } else {
            img.attr('src', tile.src);
        }
        tile.flipped = !tile.flipped;
        img.fadeIn(100);
    });
}// flip tile function