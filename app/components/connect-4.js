import Component from '@ember/component';

export default Component.extend({
  // Define data that will be used in to check the status and show different views on
  playing: false,
  winner: undefined,
  draw: false,

  /*
    This will be how the sounds are imported into the application and used by Sound JS
  */
  init: function(){
    this._super(...arguments);
    createjs.Sound.registerSound("assets/sounds/dropping.wav", "dropping");
    createjs.Sound.registerSound("assets/sounds/woosh.wav", "woosh");
  },

  /*
    This will create board for the game using create JS. This whole method will complete
    FT1 and set the stage for all of the future work
  */
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

  /*
    This will handle the click function

    It will need to find the correct co-ordinates for the counter to place
    depending on the location within the canvas the user clicks

    It will animate the counters being placed and make a sound
  */
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
          createjs.Sound.play("dropping");

          // Check for the winner
          this.check_winner();

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

  /*
    This method will try and find the winner of the game or
    return a draw if all the slots have been filled.
  */

  check_winner: function(){
    // These are all the ways that a player could win
    var winning_patterns = [
      [[0, 0], [0, 1], [0, 2], [0, 3]],
      [[0, 1], [0, 2], [0, 3], [0, 4]],
      [[0, 2], [0, 3], [0, 4], [0, 5]],
      [[0, 3], [0, 4], [0, 5], [0, 6]],
      [[1, 0], [1, 1], [1, 2], [1, 3]],
      [[1, 1], [1, 2], [1, 3], [1, 4]],
      [[1, 2], [1, 3], [1, 4], [1, 5]],
      [[1, 3], [1, 4], [1, 5], [1, 6]],
      [[2, 0], [2, 1], [2, 2], [2, 3]],
      [[2, 1], [2, 2], [2, 3], [2, 4]],
      [[2, 2], [2, 3], [2, 4], [2, 5]],
      [[2, 3], [2, 4], [2, 5], [2, 6]],
      [[3, 0], [3, 1], [3, 2], [3, 3]],
      [[3, 1], [3, 2], [3, 3], [3, 4]],
      [[3, 2], [3, 3], [3, 4], [3, 5]],
      [[3, 3], [3, 4], [3, 5], [3, 6]],
      [[4, 0], [4, 1], [4, 2], [4, 3]],
      [[4, 1], [4, 2], [4, 3], [4, 4]],
      [[4, 2], [4, 3], [4, 4], [4, 5]],
      [[4, 3], [4, 4], [4, 5], [4, 6]],
      [[5, 0], [5, 1], [5, 2], [5, 3]],
      [[5, 1], [5, 2], [5, 3], [5, 4]],
      [[5, 2], [5, 3], [5, 4], [5, 5]],
      [[5, 3], [5, 4], [5, 5], [5, 6]],
      [[0, 0], [1, 0], [2, 0], [3, 0]],
      [[1, 0], [2, 0], [3, 0], [4, 0]],
      [[2, 0], [3, 0], [4, 0], [5, 0]],
      [[0, 1], [1, 1], [2, 1], [3, 1]],
      [[1, 1], [2, 1], [3, 1], [4, 1]],
      [[2, 1], [3, 1], [4, 1], [5, 1]],
      [[0, 2], [1, 2], [2, 2], [3, 2]],
      [[1, 2], [2, 2], [3, 2], [4, 2]],
      [[2, 2], [3, 2], [4, 2], [5, 2]],
      [[0, 3], [1, 3], [2, 3], [3, 3]],
      [[1, 3], [2, 3], [3, 3], [4, 3]],
      [[2, 3], [3, 3], [4, 3], [5, 3]],
      [[0, 4], [1, 4], [2, 4], [3, 4]],
      [[1, 4], [2, 4], [3, 4], [4, 4]],
      [[2, 4], [3, 4], [4, 4], [5, 4]],
      [[0, 5], [1, 5], [2, 5], [3, 5]],
      [[1, 5], [2, 5], [3, 5], [4, 5]],
      [[2, 5], [3, 5], [4, 5], [5, 5]],
      [[0, 6], [1, 6], [2, 6], [3, 6]],
      [[1, 6], [2, 6], [3, 6], [4, 6]],
      [[2, 6], [3, 6], [4, 6], [5, 6]],
      [[0, 2], [1, 3], [2, 4], [3, 5]],
      [[0, 1], [1, 2], [2, 3], [3, 4]],
      [[1, 2], [2, 3], [3, 4], [4, 5]],
      [[0, 0], [1, 1], [2, 2], [3, 3]],
      [[1, 1], [2, 2], [3, 3], [4, 4]],
      [[2, 2], [3, 3], [4, 4], [5, 5]],
      [[1, 0], [2, 1], [3, 2], [4, 3]],
      [[2, 1], [3, 2], [4, 3], [5, 4]],
      [[3, 2], [4, 3], [5, 4], [6, 5]],
      [[2, 0], [3, 1], [4, 2], [5, 3]],
      [[3, 1], [4, 2], [5, 3], [6, 4]],
      [[3, 0], [4, 1], [5, 2], [6, 3]],
      [[3, 0], [2, 1], [1, 2], [0, 3]],
      [[4, 0], [3, 1], [2, 2], [1, 3]],
      [[3, 1], [2, 2], [1, 3], [0, 4]],
      [[5, 0], [4, 1], [3, 2], [2, 3]],
      [[4, 1], [3, 2], [2, 3], [1, 4]],
      [[3, 2], [2, 3], [1, 4], [0, 5]],
      [[6, 0], [5, 1], [4, 2], [3, 3]],
      [[5, 1], [4, 2], [3, 3], [2, 4]],
      [[4, 2], [3, 3], [2, 4], [1, 5]],
      [[6, 1], [5, 2], [4, 3], [3, 4]],
      [[5, 2], [4, 3], [3, 4], [2, 5]],
      [[6, 2], [5, 3], [4, 4], [3, 5]],
    ];
    // Grab the current state
    var state = this.get('state');
    // Loop over all of the patterns that would win the game
    for(var pidx = 0; pidx < winning_patterns.length; pidx++){
      // Get the current pattern to check for
      var pattern = winning_patterns[pidx];

      // Select the user in the current slot
      var winner = state[pattern[0][0]][pattern[0][1]];
      // If the first record in the pattern has a value then test the pattern
      // If there is no player in that area there is no reason to test
      if(winner){
        // Loop over the patterns other slots
        for(var idx = 1; idx < pattern.length; idx++){
          // If the winner is not equal to the player in the slot then that is not a winning pattern
          if(winner != state[pattern[idx][0]][pattern[idx][1]]) {
            // Set the winner to undefined and break the loop so it moves on the the next pattern
            winner = undefined;
            break;
          }
        }
        // Check that the winner is still present
        if(winner){
          // Set the global variable to be the correct winner
          this.set('winner', winner);
          // Break the loop as a winner has been found
          break;
        }
      }
    }
    // If there is no winner, check for a draw
    if(!this.get('winner')){
      // Initiall set it to true
      var draw = true;
      // Loop over all of the columns
      for(var x = 0; x <= 6; x++){
        // Loop over all of the rows
        for(var y = 0; y <= 5; y++){
          // If one does not have a value then the game is still in motion
          if(!state[x][y]){
            // Set draw to false and break the rows loop
            draw = false;
            break;
          }
        }
      }
      // Set the draw value to be be the same as the variable
      this.set('draw', draw);
    }
  },

  actions: {
    /*
      This will start the game, clear the board and reset all the states
    */
    start: function(){
      if(this.get('playing')){
        var counters = this.get('counters');
        for(var idx = 0; idx < 21; idx++){
          createjs.Tween.get(counters.red[idx]).to({alpha: 0}, 500);
          createjs.Tween.get(counters.yellow[idx]).to({alpha: 0}, 500);
        }
        createjs.Sound.play("woosh");
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
