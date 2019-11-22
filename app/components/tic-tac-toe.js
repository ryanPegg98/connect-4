import Component from '@ember/component';

export default Component.extend({
  playing: false,
  winner: undefined,
  draw: false,

  init: function() {
    this._super(...arguments);
    createjs.Sound.registerSound('assets/sounds/click.wav', 'place-marker');
    createjs.Sound.registerSound('assets/sounds/falling.mp3', 'falling');
  },

  didInsertElement: function() {
    var stage = new createjs.Stage(this.$('#stage')[0]);
    // Draw the game board
    var board = new createjs.Shape();
    var graphics = board.graphics;
    graphics.beginFill('#ffffff');
    graphics.rect(0, 0, 100, 100);
    graphics.rect(200, 0, 100, 100);
    graphics.rect(100, 100, 100, 100);
    graphics.rect(0, 200, 100, 100);
    graphics.rect(200, 200, 100, 100);
    graphics.beginFill('#000000');
    graphics.rect(100, 0, 100, 100);
    graphics.rect(0, 100, 100, 100);
    graphics.rect(200, 100, 100, 100);
    graphics.rect(100, 200, 100, 100);
    board.x = 40;
    board.y = 40;
    board.alpha = 0;
    this.set('board', board);
    stage.addChild(board);

    // Create markers
    var markers = {
      x: [],
      o: []
    };
    for (var x = 0; x < 5; x++) {
      var circleMarker = new createjs.Shape();
      graphics = circleMarker.graphics;
      graphics.beginStroke('#66ff66');
      graphics.setStrokeStyle(10);
      graphics.drawCircle(0, 0, 30);
      circleMarker.visible = false;
      stage.addChild(circleMarker);
      markers.o.push(circleMarker);

      var crossMarker = new createjs.Shape();
      graphics = crossMarker.graphics;
      graphics.beginStroke('#6666ff');
      graphics.setStrokeStyle(10, 'round', 'miter', 30);
      graphics.moveTo(0, 0);
      graphics.lineTo(39, 43);
      graphics.moveTo(0, 40);
      graphics.lineTo(41, 2);
      crossMarker.visible = false;
      stage.addChild(crossMarker);
      markers.x.push(crossMarker);
    }

    this.set('markers', markers);
    this.set('stage', stage);

    // Update the drawing
    createjs.Ticker.addEventListener('tick', stage);
  },

  click: function(ev) {
    if (this.get('playing') && !this.get('winner')) {
      if (
        ev.target.tagName.toLowerCase() == 'canvas' &&
        ev.offsetX >= 40 &&
        ev.offsetY >= 40 &&
        ev.offsetX <= 340 &&
        ev.offsetY <= 340
      ) {
        var x = Math.floor((ev.offsetX - 40) / 100);
        var y = Math.floor((ev.offsetY - 40) / 100);
        var state = this.get('state');
        if (!state[x][y]) {
          createjs.Sound.play('place-marker');
          var player = this.get('player');
          state[x][y] = player;

          var move_count = this.get('moves')[player];
          var marker = this.get('markers')[player][move_count];
          marker.visible = true;
          if (player == 'x') {
            marker.x = 70 + x * 100;
            marker.y = 70 + y * 100;
          } else {
            marker.x = 90 + x * 100;
            marker.y = 90 + y * 100;
          }

          this.check_winner();
          this.get('moves')[player] = move_count + 1;
          if (player == 'x') {
            this.set('player', 'o');
          } else {
            this.set('player', 'x');
          }
          //this.get('stage').update();
        }
      }
    }
  },

  check_winner: function() {
    var patterns = [
      [[0, 0], [1, 1], [2, 2]],
      [[0, 2], [1, 1], [2, 0]],
      [[0, 0], [0, 1], [0, 2]],
      [[1, 0], [1, 1], [1, 2]],
      [[2, 0], [2, 1], [2, 2]],
      [[0, 0], [1, 0], [2, 0]],
      [[0, 1], [1, 1], [2, 1]],
      [[0, 2], [1, 2], [2, 2]]
    ];
    var state = this.get('state');
    for (var pidx = 0; pidx < patterns.length; pidx++) {
      var pattern = patterns[pidx];
      console.log(pattern[0][0]);
      console.log(pattern[0][1]);
      var winner = state[pattern[0][0]][pattern[0][1]];
      if (winner) {
        for (var idx = 1; idx < pattern.length; idx++) {
          if (winner != state[pattern[idx][0]][pattern[idx][1]]) {
            winner = undefined;
            break;
          }
        }
        if (winner) {
          this.set('winner', winner);
          break;
        }
      }
    }
    if (!this.get('winner')) {
      var draw = true;
      for (var x = 0; x <= 2; x++) {
        for (var y = 0; y <= 2; y++) {
          if (!state[x][y]) {
            draw = false;
            break;
          }
        }
      }
      this.set('draw', draw);
    }
  },

  actions: {
    start: function() {
      var board = this.get('board');
      board.alpha = 0;
      if (this.get('playing')) {
        var markers = this.get('markers');
        for (var i = 0; i < 5; i++) {
          createjs.Tween.get(markers.x[i]).to({ y: 600 }, 500);
          createjs.Tween.get(markers.o[i]).to({ y: 600 }, 500);
        }
        createjs.Sound.play('falling');
        createjs.Tween.get(board)
          .wait(500)
          .to({ alpha: 1 }, 1000);
      } else {
        createjs.Tween.get(board).to({ alpha: 1 }, 1000);
      }
      this.set('playing', true);
      this.set('winner', undefined);
      this.set('draw', false);
      this.set('state', [
        [undefined, undefined, undefined],
        [undefined, undefined, undefined],
        [undefined, undefined, undefined]
      ]);
      this.set('moves', { x: 0, o: 0 });
      this.set('player', 'x');
      //var markers = this.get('markers');

      //this.get('stage').update();
    }
  }
});
