import Component from '@ember/component';

export default Component.extend({
  // Define data that will be used in to check the status and show different views on
  playing: false,
  winner: undefined,
  draw: false,

  didInsertElement: function(){
    // Define the element where the borad will be drawn onto
    var stage = new createjs.Stage(this.$('#stage')[0]);

    // The game board will now be drawn with the various elements
    var board = new createjs.Shape();
    var graphics = board.graphics;

    // Define the counters
    var counters = {
      red: [],
      yellow: []
    }

    // Draw the blank circle for the counters
    for(var idx1 = 0; idx1 < 7; idx1++){
      var start_x = idx1 == 0 ? 15 : (idx1 * 60) + 15
      start_x =  start_x + 15
      for(var idx2 = 0; idx2 < 6; idx2++){
        var start_y = idx2 == 0 ? 15 : (idx2 * 60) + 15
        start_y =  start_y + 15

        // First create the placeholder which will give the
        // Connect 4 Game look
        var placeholder =  new createjs.Shape();
        graphics = placeholder.graphics;
        graphics.beginFill('#EFEFEF');
        graphics.drawCircle(start_x, start_y, 25);
        stage.addChild(placeholder);
      }
    }

    // Add the counters that will be placed on the board, only 21 are needed of each
    for(var idx3 = 0; idx3 < 21; idx3++){
      // Create the red counter which will be invisible initially
      var redCounter =  new createjs.Shape();
      graphics = redCounter.graphics;
      graphics.beginStroke('#BF2035'); // This will give a connect 4 look to the counter
      graphics.setStrokeStyle(5);
      graphics.beginFill('#FF2B47');
      graphics.drawCircle(0, 0, 25);
      redCounter.visible = false;
      createjs.Tween.get(redCounter).to({alpha: 0}, 0); // This will set the counter transparent ready for the fade effect
      stage.addChild(redCounter);
      counters.red.push(redCounter);

      // Create the yellow counter which will also be hidden initially
      var yellowCounter =  new createjs.Shape();
      graphics = yellowCounter.graphics;
      graphics.beginStroke('#CCC133'); // This will give a connect 4 look to the counter
      graphics.setStrokeStyle(5);
      graphics.beginFill('#FFF240');
      graphics.drawCircle(0, 0, 25);
      yellowCounter.visible = false;
      createjs.Tween.get(yellowCounter).to({alpha: 0}, 0); // This will set the counter transparent ready for the fade effect
      stage.addChild(yellowCounter);
      counters.yellow.push(yellowCounter);
    }

    // Store the values for the counters and the stage
    this.set('counters', counters);
    this.set('stage', stage);



    // Update the drawing
    createjs.Ticker.addEventListener('tick', stage);
  },

  click: function(ev){
    // Check that they are playing and that someone has not won yet
    if(this.get('playing') && !this.get('winner')){
      // Ensure that the click is in the canvas and not elsewhere on
      // the page
      if(
        ev.target.tagName.toLowerCase() == 'canvas' &&
        ev.offsetX >= 0 &&
        ev.offsetY >= 0 &&
        ev.offsetX <= 420 &&
        ev.offsetY <= 360
      ) {
        // X and Y will be the position in each array. They will need to be divided
        // by the size of each counter in order to get the one they clicked
        var x = Math.floor(ev.offsetX / 60);
        var y = Math.floor(ev.offsetY / 60);
        // Get the stored state
        var state = this.get('state');
        // Check if the move is a valid move
        if(!state[x][y]){
          var player = this.get('player');
          state[x][y] = player;
          // Get the number of move it is
          var moveCounter = this.get('moves')[player];
          // Get a counter to move to the correct location
          var counter = this.get('counters')[player][moveCounter];

          // Move the counter to the correct location
          counter.x = (x * 60) + 30
          counter.y = (y * 60) + 30
          // Make the counter visible
          counter.visible = true;
          // Fade the counter into the correct place
          createjs.Tween.get(counter).to({alpha: 1}, 500);


          // Increment that players move
          this.get('moves')[player] = moveCounter + 1;

          // Swap the players move from red to yellow and yellow to red
          if(player == 'red') {
            this.set('player', 'yellow');
          } else {
            this.set('player', 'red');
          }
        }
      }
    }
  },

  actions: {
    start: function(){
      // Fetch the stored board
      var board = this.get('board');

      if(this.get('playing')){
        var counters = this.get('counters');
        for(var idx = 0; idx < 21; idx++){
          createjs.Tween.get(counters.red[idx]).to({alpha: 0}, 500);
          createjs.Tween.get(counters.yellow[idx]).to({alpha: 0}, 500);
        }
      }

      // Set the state that will show which player has a counter in that area
      // undefined is the row(y) and the arrays are the columns(x)
      this.set('state', [
        [undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined]
      ]);
      // Set the move counter and the player value
      this.set('moves', { red: 0, yellow: 0 });
      this.set('player', 'red'); // This will show who is the current player

      // Set the playing, winner and draw value to the playable states
      this.set('playing', true);
      this.set('winner', undefined);
      this.set('draw', false);
    }
  }
});
