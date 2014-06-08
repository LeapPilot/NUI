function init_annyang() {
    console.log("Starting Annyang . . .");
    if (annyang) {
      console.log("Started Annyang");
      var openView = function (view) {
        var notFound = 0;

        if (view.search("config") != -1) {
          $('div.wrapper').load("views/config/config.html");
        } else if (view.search("pilot") != -1) {
          $('div.wrapper').load("views/pilot/pilot.html");
        } else if (view.search("media") != -1) {
          $('div.wrapper').load("views/media/media.html");
        } else {
          notFound = 1;
          $('div.speechRecognition').text("Could not find a match for: " + view);
          $('div.speechRecognition').css('backgroundColor', '#A0000F');
        }

        if (notFound != 1) {
          $('div.speechRecognition').text("Opened " + view);
          $('div.speechRecognition').css('backgroundColor', '#008500');
        }

        $('div.speechRecognition').animate({'marginTop': '0px'}, 200, "swing", function() {
            $(this).delay(3000).animate({'marginTop' : '-70px'});
        });
      }

      var menuOptions = function (menuItem) {
        var notFound = 0;

        if (menuItem.search("basic") != -1) {
          $('#basic-link').trigger("click");
          $("body").animate({scrollTop: 0}, "500");
        } else if (menuItem.search("advance") != -1) {
          $('#advanced-link').trigger("click");
          $("body").animate({scrollTop: $("#advanced").offset().top}, "500");
        } else if (menuItem.search("status") != -1) {
          $('#status-link').trigger("click");
          $("body").animate({scrollTop: $("#status").offset().top}, "500");
        } else if (menuItem.search("about") != -1) {
          $('#about-link').trigger("click");
          $("body").animate({scrollTop: $("#about").offset().top}, "500");
        } else if (menuItem.search("page") != -1 || menuItem.search("landing") != -1) {
          $('#back-link').trigger("click");
          parent.history.back();
          return false;
        } else {
          notFound = 1;
          $('div.speechRecognition').text("Could not find a match for: " + menuItem);
          $('div.speechRecognition').css('backgroundColor', '#A0000F');
        }

        if (notFound != 1) {
          $('div.speechRecognition').text("Selecting " + menuItem);
          $('div.speechRecognition').css('backgroundColor', '#008500');
          notFound = 0;
        }

        $('div.speechRecognition').animate({'marginTop': '0px'}, 300).delay(3000).animate({'marginTop' : '-70px'});
      }

      var setProps = function (Property, Value) {
        var notFound = 0;

          console.log("Property: "+ Property + " | Value: " + Value);

          if (Property.search("altitude") != -1) {
            console.log("Called Altitude");
              if (Value >= 3 && Value <= 100) {
                flightSettings.basic["Altitude"] = Value;
                $("#altitudeSlider").slider({value: Value});
                $("#altitudeValue").text(Value + " m");
              } else {
                notFound = 2;
                $('div.speechRecognition').text("Your named value must be inside the range of 3 and 100.");
                $('div.speechRecognition').css('backgroundColor', '#A0000F');
              }
          } else if (Property.search("vertical") != -1) {
            console.log("Called VSpeed");
            if (Value >= 200 && Value <= 2000) {
              flightSettings.basic["VSpeed"] = Value;
              $("#vspeedSlider").slider({value: Value});
              $("#vspeedValue").text(Value + " mm/s");
            } else {
              notFound = 2;
              $('div.speechRecognition').text("Your named value must be inside the range of 200 and 2000.");
              $('div.speechRecognition').css('backgroundColor', '#A0000F');
            }
          } else if (Property.search("rotation") != -1) {
            console.log("Called RSpeed");
            if (Value >= 40 && Value <= 350) {
              flightSettings.basic["RSpeed"] = Value;
              $("#rotspeedSlider").slider({value: Value});
              $("#rotspeedValue").text(Value + " °/s");
            } else {
              notFound = 2;
              $('div.speechRecognition').text("Your named value must be inside the range of 40 and 350.");
              $('div.speechRecognition').css('backgroundColor', '#A0000F');
            }
          } else if (Property.search("tilt") != -1 || Property.search("angle") != -1) {
            console.log("Called TAngle");
            if (Value >= 5 && Value <= 30) {
              flightSettings.basic["TAngle"] = Value;
              $("#tiltangleSlider").slider({value: Value});
              $("#tiltangleValue").text(Value + " °");
            } else {
              notFound = 2;
              $('div.speechRecognition').text("Your named value must be inside the range of 5 and 30.");
              $('div.speechRecognition').css('backgroundColor', '#A0000F');
            }
          } else if (Property.search("flip") != -1 || Property.search("orientation") != -1) {
            console.log("Called Flip");

            if (Value == "write") {
              Value = "right";
            } else if (Value == "neck" || Value == "Beck") {
              Value = "back";
            }

            if (Value == "front" || Value == "back" || Value == "left" || Value == "right") {
              flightSettings.advanced["FlipOrientation"] = Value;
              
              $("#orientation > label[for='" + Value + "']").each(function() {
               // if ($(this).attr("for") == Value) {
                  $(this).trigger("click");
                //}
              });
            } else {
              notFound = 2;
              $('div.speechRecognition').text("Your named value must be either 'Front', 'Back', 'Left' or 'Right'.");
              $('div.speechRecognition').css('backgroundColor', '#A0000F');
            }            
          } else {
            console.log("Called Else");
            notFound = 1;
            $('div.speechRecognition').text("Could not find a match for: " + Property + " and value: " + Value);
            $('div.speechRecognition').css('backgroundColor', '#A0000F');
          }

          if (notFound != 1 && notFound != 2) {
            $('div.speechRecognition').text("Setting " + Property + " to " + Value);
            $('div.speechRecognition').css('backgroundColor', '#008500');
          }
          notFound = 0;

          $('div.speechRecognition').animate({'marginTop': '0px'}, 300).delay(3000).animate({'marginTop' : '-70px'});
      }

      var turnOn = function (Property) {
        var notFound = 0;

        if (Property == "light" || Property == "flood") {
          Property = "flight";
        } 

        if (Property.search("flight") != -1) {
          if (!$("#checkboxFlipEnabled > input[name='OutDoorFlightCheckBox']").is(":checked")) {
            $("#checkboxFlipEnabled > label[for='OutDoorFlightCheckBox']").trigger("click");
            flightSettings.basic["OutDoorFlight"] = 1;
          }
        } else if (Property.search("protection") != -1) {
          if (!$("#checkboxFlipEnabled > input[name='OutDoorHullCheckBox']").is(":checked")) {
            $("#checkboxFlipEnabled > label[for='OutDoorHullCheckBox']").trigger("click");
            flightSettings.basic["OutDoorHull"] = 1;
          }
        } else if (Property.search("flip") != -1 || Property.search("enabled") != -1) {
          if (!$("#checkboxFlipEnabled > input[name='checkboxFlipEnabled']").is(":checked")) {
            $("#checkboxFlipEnabled > label[for='FlipEnabled']").trigger("click");
            flightSettings.advanced["FlipEnabled"] = 1;
          }
        } else if (Property.search("absolute") != -1 || Property.search("mode") != -1) {
          if (!$("#checkboxFlipEnabled > input[name='AbsoluteMode']").is(":checked")) {
            $("#checkboxFlipEnabled > label[for='AbsoluteMode']").trigger("click");
            flightSettings.advanced["AbsoluteMode"] = 1;
          }
        } else {
          notFound = 1;
          $('div.speechRecognition').text("Could not enable: " + Property);
          $('div.speechRecognition').css('backgroundColor', '#A0000F');
        }

        if (notFound != 1 && notFound != 2) {
          $('div.speechRecognition').text("Enabling " + Property);
          $('div.speechRecognition').css('backgroundColor', '#008500');
        }
        notFound = 0;

        $('div.speechRecognition').animate({'marginTop': '0px'}, 300).delay(3000).animate({'marginTop' : '-70px'});
      }

      var turnOff = function (Property) {
        var notFound = 0;

        if (Property == "light") {
          Property = "flight";
        } 

        if (Property.search("flight") != -1) {
          if ($("#checkboxFlipEnabled > input[name='OutDoorFlightCheckBox']").is(":checked")) {
            $("#checkboxFlipEnabled > label[for='OutDoorFlightCheckBox']").trigger("click");
            flightSettings.basic["OutDoorFlight"] = 0;
          }
        } else if (Property.search("protection") != -1) {
          if ($("#checkboxFlipEnabled > input[name='OutDoorHullCheckBox']").is(":checked")) {
            $("#checkboxFlipEnabled > label[for='OutDoorHullCheckBox']").trigger("click");
            flightSettings.basic["OutDoorHull"] = 0;
          }
        } else if (Property.search("flip") != -1 || Property.search("enabled") != -1) {
          console.log("FLIPPING");
          if ($("#checkboxFlipEnabled > input[name='checkboxFlipEnabled']").is(":checked")) {
            $("#checkboxFlipEnabled > label[for='FlipEnabled']").trigger("click");
            flightSettings.advanced["FlipEnabled"] = 0;
          }
        } else if (Property.search("absolute") != -1 || Property.search("mode") != -1) {
          if ($("#checkboxFlipEnabled > input[name='AbsoluteMode']").is(":checked")) {
            $("#checkboxFlipEnabled > label[for='AbsoluteMode']").trigger("click");
            flightSettings.advanced["AbsoluteMode"] = 0;
          }
        } else {
          notFound = 1;
          $('div.speechRecognition').text("Could not enable: " + Property);
          $('div.speechRecognition').css('backgroundColor', '#A0000F');
        }

        if (notFound != 1 && notFound != 2) {
          $('div.speechRecognition').text("Enabling " + Property);
          $('div.speechRecognition').css('backgroundColor', '#008500');
        }
        notFound = 0;

        $('div.speechRecognition').animate({'marginTop': '0px'}, 300).delay(3000).animate({'marginTop' : '-70px'});
      }


      var commands = {
          'Open *view': openView,
          'Select *menuItem': menuOptions,
          '(Set) *Property to *Value' : setProps,
          'Enable (outdoor) *Property' : turnOn,
          'Disable (outdoor) *Property' : turnOff
      };
        
      annyang.addCommands(commands);
      annyang.debug();
      annyang.start();
    }
}