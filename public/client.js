(function () {
  
  var keymap, faye, speed, password;
  
  faye = new Faye.Client("/faye", { timeout: 60 }); // may need to adjust. If server doesn't send back any data for the given period of time, the client will assume the server has gone away and will attempt to reconnect. Timeout is given in seconds and should be larger than timeout on server side to give the server ample time to respond.

  keymap = {
    87: { // w
      action: 'front'
    },
    83: { // s
      action: 'back'
    },
    65: { // a
      action: 'left'
    },
    68: { // d
      action: 'right'
    },
    38: { // up arrow
      action: 'up'
    },
    40: { // down arrow
      action: 'down'
    },
    37: {  // left arrow
      action: 'counterClockwise'
    },
    39: { // right arrow
      action: 'clockwise'
    },
    32: {  // spacebar
      action: 'takeoff'
    },
    13: { // enter
      action: 'land'
    },
    49: { // '1'
      action: 'disableEmergency'
    }
  };

  $(document).keydown(function (event) {
	console.log("keydown: "+ event.keyCode + " keymap: " + keymap[event.keyCode]);
	
	var action;
    if (!keymap[event.keyCode]) { // prevents accidental keyboard controls: if key pressed is not assigned in the keymap above, return out of the function.
		console.log("pressed key not defined");
		return;
    }
	
	event.preventDefault(); // prevents a key's default action from occuring
	action = keymap[event.keyCode].action; // pulls the action parameter from the key pressed
	speed = 0.5; // should be more dynamic, but will move at half speed for now
	console.log(action);
	
    if (event.keyCode === 32 || event.keyCode === 13 || event.keyCode === 46) {
		return faye.publish("/drone/drone", { action: action }); // sends a message to /drone/ with details of the action and speed
	} else {
		/*
		 *	Highlight the control element on piloting view depending on recognized action
		 */
		var $control_element = $("#" + action).addClass('highlight');
		setTimeout(function() {
			$control_element.removeClass('highlight');
		}, 500);
		
      return faye.publish("/drone/move", { // sends a message to /drone/ with details of the action and speed
        action: action,
        speed: speed
      });
    } 
  });

  $(document).keyup(function () {  // stops the drone when no key is pressed
    return faye.publish("/drone/drone", { action: 'stop' });
  });
  
}).call(this);
