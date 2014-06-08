(function () {

  var controller, flying, speed, leap, faye, timeout, speedAdjuster, stopped;

  faye = new Faye.Client("/faye", {
    timeout: 60 // may need to adjust. If server doesn't send back any data for the given period of time, the client will assume the server has gone away and will attempt to reconnect. Timeout is given in seconds and should be larger than timeout on server side to give the server ample time to respond.
  });

  flying = false; // used to prevent action while drone is dormant
  timeout = 400;  // used for each server publish
  speedAdjuster = 2.5; // higher number decreases action speed.  DO NOT set to less than 1

  var mainRoutine = function (frame) { // Runs on every frame
    gestureHandler(frame);  // routine for handling takeoff, landing and rotations
    handPos(frame); // all other actions
  }

  var takeoff = function () {
  	flying = true; // enables actions to be published
  	return faye.publish("/drone/drone", {
      action: 'takeoff'
    });
   }

  var land = function () {
  	flying = false;	// prevents faye from publishing actions when drone has landed
  	return faye.publish("/drone/drone", {
      action: 'land'
    });
  }

  var handPos = function (frame) {
    var hands = frame.hands // leap detects all hands in field of vision
    if (hands.length === 0 && !stopped) {
      stopped = true;
        $("rect#highlight").attr({id: ''})
        setTimeout(function (){
          return faye.publish("/drone/drone", {
            action: 'stop'
          })
        }, timeout);
    } else if (hands.length > 0){
      var handOne = hands[0]; // first hand.  Can add second hand

      var pos = handOne.palmPosition;  // tracks palm of first hand
       
      var xPos = pos[0]; // position of hand on x axis
      var yPos = pos[1]; // position of hand on y axis
      var zPos = pos[2]; // position of hand on z axis

      var adjX = xPos / 250; // -1.5 to 1.5
      var adjXspeed = Math.abs(adjX)/ speedAdjuster; // left/right speed
      var adjY = (yPos - 60) / 500; // 0 to .8
      var adjYspeed = Math.abs(.4-adjY) // up/down speed
      var adjZ = zPos / 250; // -2 to 2
      var adjZspeed = Math.abs(adjZ) / speedAdjuster; // front/back speed

      if (adjX < 0 && flying) { // flying set in takeoff() and land() to prevent actions while drone landed
        stopped = false;
        var $left = $("#left").addClass('highlight');
		setTimeout(function() {
			$left.removeClass('highlight');
		}, 200);
        setTimeout(function (){
          return faye.publish("/drone/move", {
    	      action: 'left',
    	      speed: adjXspeed
 			    })
        }, timeout);
      } else if (adjX > 0 && flying) {
        stopped = false;
        var $right = $("#right").addClass('highlight');
		setTimeout(function() {
			$right.removeClass('highlight');
		}, 200);
        setTimeout(function (){
          return faye.publish("/drone/move", {
      	    action: 'right',
      	    speed: adjXspeed
   			  })
        }, timeout);
      }

      if (adjY > 0.4 && flying) {
        stopped = false;
        var $up = $("#up").addClass('highlight');
		setTimeout(function() {
			$up.removeClass('highlight');
		}, 200);
        setTimeout(function (){
          return faye.publish("/drone/move", {
      	    action: 'up',
      	    speed: adjYspeed
          })
        }, timeout/2);
      } else if (adjY < 0.4 && flying) {
        stopped = false;
        var $down = $("#down").addClass('highlight');
		setTimeout(function() {
			$down.removeClass('highlight');
		}, 200);
        setTimeout(function (){
          return faye.publish("/drone/move", {
      	    action: 'down',
      	    speed: adjYspeed
   			  })
        }, timeout/2);
      }

      if (adjZ < 0 && flying) {
        stopped = false;
        var $front = $("#front").addClass('highlight');
		setTimeout(function() {
			$front.removeClass('highlight');
		}, 200);
        setTimeout(function (){
          return faye.publish("/drone/move", {
      	    action: 'front',
      	    speed: adjZspeed
   			  })
        }, timeout/3);
      } else if (adjZ > 0 && flying) {
        stopped = false;
        var $back = $("#back").addClass('highlight');
		setTimeout(function() {
			$back.removeClass('highlight');
		}, 200);
        setTimeout(function (){
          return faye.publish("/drone/move", {
      	    action: 'back',
      	    speed: adjZspeed
   			  })
        }, timeout/3);
      }
    }
  }

  var gestureHandler = function (frame) { // handles rotation
    var gestures = frame.gestures;
    if (gestures && gestures.length > 0) {
      stopped = false;
      for( var i = 0; i < gestures.length; i++ ) {
        var gesture = gestures[i];
        if (gesture.type === 'circle' && gesture.state === 'start' && flying) {
          gesture.pointable = frame.pointable(gesture.pointableIds[0]);
          direction = gesture.pointable.direction;
          if(direction) {
            var normal = gesture.normal;
            clockwisely = Leap.vec3.dot(direction, normal) > 0;
            if(clockwisely) {
              return clockwise();
            } else {
              return counterClockwise();
            }
          }
        } else {
          if ( gesture.type === 'keyTap' ) { // motion that looks like clicking a mouse controls takeoff and landing
            if (flying) { // flying set in the takeoff() function and ensures that drone will land while flying and takeoff while dormant
              land();
            } else {
              takeoff();
            }
          }
        }
      }
    }
  };

  speed = 0.5; // used for rotation speed
  var counterClockwise = function () {
	var $counter = $("#counterClockwise").addClass('highlight');
	setTimeout(function() {
			$counter.removeClass('highlight');
		}, 200);
    faye.publish("/drone/move", {
      action: 'counterClockwise',
      speed: speed
    })
    setTimeout(function (){
      return faye.publish("/drone/drone", {
        action: 'stop'
      })
    }, timeout);
   };

  var clockwise = function () {
    var $clock = $("#clockwise").addClass('highlight');
	setTimeout(function() {
			$clock.removeClass('highlight');
		}, 200);
    faye.publish("/drone/move", {
      action: 'clockwise',
      speed: speed
    })
    setTimeout(function (){
      return faye.publish("/drone/drone", {
        action: 'stop'
      })
    }, timeout);
  }

  controller = new Leap.Controller({enableGestures: true});
  controller.connect();
  controller.on('frame', function (data) {
    mainRoutine(data)
  });

}).call(this);