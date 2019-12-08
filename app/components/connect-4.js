import Component from '@ember/component';

/*
  This method will be used to select the available position for each column
*/
function available_positins(state){
  var positions = [];
  for(var x = 0; x < state.length; x++){
    for(var y = 0; y < state.length; y++){
      if(y + 1 === state[x].length || state[x][y + 1] !== undefined) {
        positions.push([x, y]);
        break;
      }
    }
  }
  return positions;
}

function select_position(state, column) {
  var positions = available_positins(state);

  for(var position = 0; position < positions.length; position++){
    if(positions[position][0] === column){
      return positions[position];
    }
  }
  return undefined;
}

/*
  This method will clone the current state so that the computer player
  can make a better move
*/

function deepClone(state){
  // Initiate the new state which will be returned to the
  var new_state = [];
  // Loop over each of the arrays which are acting as the X axis for the board
  for(var x = 0; x < state.length; x++){
    new_state.push(state[x].slice(0));
  }
  return new_state;
}

/*
  Method to check who has won the game or if it is a draw
*/

function check_game_winner(state){
  // These are all the ways that a player could win
  var winning_patterns = [
    //Vertical Wins
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
    [[6, 0], [6, 1], [6, 2], [6, 3]],
    [[6, 1], [6, 2], [6, 3], [6, 4]],
    [[6, 2], [6, 3], [6, 4], [6, 5]],
    [[6, 3], [6, 4], [6, 5], [6, 6]],
    // Horizontal Wins
    [[0, 0], [1, 0], [2, 0], [3, 0]],
    [[1, 0], [2, 0], [3, 0], [4, 0]],
    [[2, 0], [3, 0], [4, 0], [5, 0]],
    [[3, 0], [4, 0], [5, 0], [6, 0]],
    [[0, 1], [1, 1], [2, 1], [3, 1]],
    [[1, 1], [2, 1], [3, 1], [4, 1]],
    [[2, 1], [3, 1], [4, 1], [5, 1]],
    [[3, 1], [4, 1], [5, 1], [6, 1]],
    [[0, 2], [1, 2], [2, 2], [3, 2]],
    [[1, 2], [2, 2], [3, 2], [4, 2]],
    [[2, 2], [3, 2], [4, 2], [5, 2]],
    [[3, 2], [4, 2], [5, 2], [6, 2]],
    [[0, 3], [1, 3], [2, 3], [3, 3]],
    [[1, 3], [2, 3], [3, 3], [4, 3]],
    [[2, 3], [3, 3], [4, 3], [5, 3]],
    [[3, 3], [4, 3], [5, 3], [6, 3]],
    [[0, 4], [1, 4], [2, 4], [3, 4]],
    [[1, 4], [2, 4], [3, 4], [4, 4]],
    [[2, 4], [3, 4], [4, 4], [5, 4]],
    [[3, 4], [4, 4], [5, 4], [6, 4]],
    [[0, 5], [1, 5], [2, 5], [3, 5]],
    [[1, 5], [2, 5], [3, 5], [4, 5]],
    [[2, 5], [3, 5], [4, 5], [5, 5]],
    [[3, 5], [4, 5], [5, 5], [6, 5]],
    // Diagonal Wins
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
        // return the winner value to the place it was called
        return winner;
      }
    }
  }
  // Loop over all of the columns
  for(var x = 0; x <= 6; x++){
    // Loop over all of the rows
    for(var y = 0; y <= 5; y++){
      // If one does not have a value then the game is still in motion
      if(!state[x][y]){
        // Return undefined to the place the method was called
        // This will initcate that the game is still active
        return undefined;
      }
    }
  }
  // Return a blank string. This will show it has been drawn.
  return '';
}

/*
  These are the possible ways that the computer could win
*/

var patterns = [
  {
    pattern: [['p', 0, 1], ['p', 0, 1], ['p', 0, 1], ['p']],
    score: 1000
  },
  {
    pattern: [['p', 0, -1], ['p', 0, -1], ['p', 0, -1], ['p']],
    score: 1000
  },
  {
    pattern: [['p', 1, 0], ['p', 1, 0], ['p', 1, 0], ['p']],
    score: 1000
  },
  {
    pattern: [['p', -1, 0], ['p', -1, 0], ['p', -1, 0], ['p']],
    score: 1000
  },
  {
    pattern: [['p', 1, 1], ['p', 1, 1], ['p', 1, 1], ['p']],
    score: 1000
  },
  {
    pattern: [['p', 1, -1], ['p', 1, -1], ['p', 1, -1], ['p']],
    score: 1000
  },
  {
    pattern: [['p', 0, 1], ['p', 0, 1], ['p']],
    score: 100
  },
  {
    pattern: [['p', 0, -1], ['p', 0, -1], ['p']],
    score: 100
  },
  {
    pattern: [['p', 1, 0], ['p', 1, 0], ['p']],
    score: 100
  },
  {
    pattern: [['p', -1, 0], ['p', -1, 0], ['p']],
    score: 100
  },
  {
    pattern: [['p', 1, 1], ['p', 1, 1], ['p']],
    score: 100
  },
  {
    pattern: [['p', 1, -1], ['p', 1, -1], ['p']],
    score: 100
  },
  {
    pattern: [['p', 0, 1], ['p']],
    score: 50
  },
  {
    pattern: [['p', 0, -1], ['p']],
    score: 50
  },
  {
    pattern: [['p', 1, 0], ['p']],
    score: 50
  },
  {
    pattern: [['p', -1, 0], ['p']],
    score: 50
  },
  {
    pattern: [['p', 1, 1], ['p']],
    score: 50
  },
  {
    pattern: [['p', 1, -1], ['p']],
    score: 50
  }
];


/*
  This fucntion will check for to see it there is a match in the current game board known as
  state in the code

  This method should return a boolean value (True or False)
*/

function match_pattern_at(state, pattern, player, x, y){
  // Ensure the that X and Y are within the state
  if( x >= 0 && x < state.length && y >= 0 && y < state[x].length ) {
    var element = pattern[0]; // This will get the first element in the patern array
    // If the first element is not occupied by the player then that pattern is not the right one
    if(element[0] === 'p' && state[x][y] !== player){
      // Return false as it does not match
      return false;
    } else if(element[0] === ' ' && state[x][y] !== undefined){ // Look to see if the slot has been occupied and is not meant to be
      // Return false as this is also not a match
      return false;
    }
    // Check that there is more than one element in the pattern
    if(pattern.length > 1){
      // this will reccusivley check the whole pattern
      return match_pattern_at(state, pattern.slice(1), player, x + element[1], y + element[2]);
    } else {
      // This pattern is a match so true should be returned
      return true;
    }
  }

  // If all else fails return false
  return false;
}

/*
  This function will look at the list of winable patterns to try and get the computer to win
  this will make it harder for the user
*/

function match_pattern(state, pattern, player){
  // First loop over the whole X axis of the board, hence why x has been used as a variable name
  for(var x = 0; x < state.length; x++){
    // Then loop over all of the Y axis, which is the reason y is being used as the variable name
    for(var y = 0; y < state[x].length; y++){
      var matches = match_pattern_at(state, pattern, player, x, y);
      // If there are any matches the match_pattern_at method will return true
      if(matches){
        return true;
      }
    }
  }
  // If nothing matches then return false
  return false;
}

/*
  This will improve the decisions made by the computer player using
  a heuristic approch to calculate the best move
*/

function heuristic(state){
  var score = 0; // The score of the move will need to be stored while the loop is running, this will outputted by the method
  for(var i = 0; i < patterns.length; i++){ // the variable i has been used. This stores which iteration of the for loop it is.
    if(match_pattern(state, patterns[i].pattern, 'yellow')){
      score = score + patterns[i].score; // Add the paterns score to the score variable
    }
    if(match_pattern(state, patterns[i].pattern, 'red')){
      score = score - patterns[i].score; // Remove the score from score variable
    }
  }

  return score; // Return the integer that has been set in the score variable
}

/*
  This method will try and find the best move for the computer
  to make it harder for the player

  This should return an array of moves
*/

function minimax(state, limit, player){
  // This will be the list of moves that the computer could take with the scores that they have
  var moves = [];
  // If the limit is less than one then the computers predictions have reached the end of the line
  if(limit > 0){
    // Loop over all of the X axis for the state, which is the reason x is being used as the variable
    var positions_available = available_positins(state);

    for(var position = 0; position < positions_available.length; position++){
      var x = positions_available[position][0];
      var y = positions_available[position][1];

      // Check to see if the slot in the state is undefined
      if(state[x][y] === undefined){
        /*
         Create the key value array for this being a potential move
         set the X and Y co-ordinates, clone the state and set the score to 0
        */
        var move = {
          x: x,
          y: y,
          state: deepClone(state),
          score: 0
        };
        // In the cloned state set it to be the player defined int he
        move.state[x][y] = player;

        // If the limit is one or the there is a result from the check winner method fetch the score
        if(limit === 1 || check_game_winner(move.state) !== undefined) {
          // use the heuristic method to get the score
          move.score = heuristic(move.state);
        } else { // otherwise reccusivley generate a potential win by simulating the next turn
          // Store the potential moves into its own array within the already defined key value array
          move.moves = minimax(move.state, limit - 1, player === 'red' ? 'yellow' : 'red');
          // Keep the score undefined for now
          var score = undefined;

          // Loop over all of the moves that have been found, the variable here is m, standing for move
          for(var m = 0; m < move.moves.length; m++){
            if (score === undefined){
              // if the score is undefined this should be set the the score value from the move in the m position
              score = move.moves[m].score;
            } else if(player === 'red') {
              // if the player is red (user) then select which is the biggest from the current score or the score from the move in the m position
              score = Math.max(score, move.moves[m].score);
            } else if(player === 'yellow') {
              // However, if it is the computer then the smallest score will need to be selected
              score = Math.min(score, move.moves[m].score);
            }
          }
          // Set the moves score as the value that has been found and stored in the score variable
          move.score = score;
        }

        // Append the move to the array of move moves that could be used
        moves.push(move);
      }
    }
  }

  // Time to return the list of moves for the computer to pick from
  return moves;
}

/*
  This function will be used to identify where to place the computers counter.

  It will return the X and Y co-oridinates of where to place the counter
*/

function computer_move(state){
  // Use the minimax function to get the moves that are available for the computer and store them in the move variable
  // These are the moved that it will pick from
  var moves = minimax(state, 3, 'yellow');
  var move_score = undefined; // This will need to be undefined by default as it will keep moves score
  var move = undefined; // This will store the co-ordinates for the next computer more and return them as the result

  // Loop over each move. Using the variable m, which stands for move
  for(var m = 0; m < moves.length; m++){
    // If the max_score has not been filled in or the moves score is greater than the current score
    if(move_score === undefined || moves[m].score > move_score) {
      // Set the move_score to be the new current moves score
      move_score = moves[m].score;
      // Set the move to be the co-ordinates for this current move
      move = {
        x: moves[m].x,
        y: moves[m].y
      }
    }
  }

  // Pass the key value array that is stored in the move variable
  return move;
}

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
    // set the component
    var component = this;
    // Check that they are playing and that someone has not won yet
    if(component.get('playing') && !component.get('winner')){
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


        // Get the stored state
        var state = component.get('state');

        // Drop the components in the correct place
        var position = select_position(state, x);
        // Make sure that the coulmn has a valid position
        if (position !== undefined){
          var y = position[1]
          // Check if the move is a valid move
          if(!state[x][y]){
            state[x][y] = 'red';
            // Get the number of move it is
            var moveCounter = component.get('moves')['red'];
            // Get a counter to move to the correct location
            var counter = component.get('counters')['red'][moveCounter];

            // Move the counter to the correct location
            counter.x = (x * 60) + 30
            counter.y = (y * 60) + 30
            // Make the counter visible
            counter.visible = true;
            // Fade the counter into the correct place
            createjs.Tween.get(counter).to({alpha: 1}, 500);
            createjs.Sound.play("dropping");

            // Check for the winner
            component.check_winner();

            // Increment that players move
            component.get('moves')['red'] = moveCounter + 1;

            // The computer should only play if there is a winner
            if(!component.get('winner') && !component.get('draw')){
              /*
                The setTimeout will add some time to the computers move.
                This will make it feel like they are playing a human
              */
              setTimeout(function(){
                // Get the computers move that has been picked by the computer move method
                var move = computer_move(state);
                // Get the number of moves to select the counter to move
                // The computer will always be yellow
                moveCounter = component.get('moves')['yellow'];
                // Set the board state to set the selected slot to be the computer player
                state[move.x][move.y] = 'yellow';
                // Select the counter that will need to be moved on the grid
                counter = component.get('counters')['yellow'][moveCounter];
                // Set the correct co-ordinates for the counter for the selected slot
                counter.x = (move.x * 60) + 30;
                counter.y = (move.y * 60) + 30;
                // Make the counter visable
                counter.visible = true;
                // Fade the counter in using the Tween package
                createjs.Tween.get(counter).to({alpha: 1}, 500);
                // Make the sound of dropping when placing the counter
                createjs.Sound.play("dropping");
                // Increment he move counter so that the next counter is selected
                component.get('moves')['yellow'] = moveCounter + 1;
                // Update the stage to show a the counters that are being displayed
                component.get('stage').update();
                // Check for the winner again incase the computer is the winner
                component.check_winner();
              }, 500);
            }
          }
        }
      }
    }
  },

  /*
    This method will find and set the winner, or set it as a draw if all
    the slots have been filled
  */

  check_winner: function(){
    // Get the state of the board
    var state = this.get('state');
    // Find the winner using the check_game_winner method passing in the
    // current state
    var winner = check_game_winner(state);
    // If undefined the game continues, not action required
    if(winner !== undefined){
      // if the value is blank then it is a draw
      if(winner === ''){
        this.set('draw', true);
      } else {
        // Anything else set it as the winner, this will end the game
        this.set('winner', winner);
      }
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
          // This will animate the board to remove all of the counters
          createjs.Tween.get(counters.red[idx]).to({alpha: 0}, 500);
          createjs.Tween.get(counters.yellow[idx]).to({alpha: 0}, 500);
        }
        // This will play the woosh sound that has been defined in the intial Method
        // This will only play when reseting the the board
        createjs.Sound.play("woosh");
      }

      /*
        Set the state that will show which player has a counter in that area
        undefined is the row(y) and the arrays are the columns(x)

        State is being used as this is the state of the board
      */
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
      this.set('draw', undefined);
    }
  }
});
