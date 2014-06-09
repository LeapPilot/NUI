$(document).ready(function() {
	faye = new Faye.Client("/faye", { timeout: 60 });
	
	/*
	 *	Style Changer Button functionality
	 */
	var metal = false;
	$(".style_changer").click(function(){
		if(metal){
			$(".metal").addClass("flat").removeClass("metal");
			$(".style_changer").html("Metal");
			metal = false;
		}else{
			$(".flat").addClass("metal").removeClass("flat");
			$(".style_changer").html("Standard");
			metal = true;
		}
	});
	
	/*
	 *	Save picture
	 */
	$(".picture").click(function(){
		var canvas = document.getElementById('drone_canvas');
		var image = canvas.toDataURL("image/jpeg");
		window.location.href = image;
		console.log(image);
	});
	
	/*
	 *	"Takeoff"- Button Command
	 */
	$("#takeoff_button").click(function(){
		faye.publish("/drone/drone", {
			action: "takeoff"
		});
	});
	
	/*
	 *	"Land"- Button Command
	 */
	$("#land_button").click(function(){
		faye.publish("/drone/drone", {
			action: "land"
		});
	});
	
	
	faye.subscribe("/drone/info", function (d) {
	  return updateGauges(d.battery, d.alt);
    });

	
	var batteryGauge;
		var speedGauge;
		
		function initGauges() {
			batteryGauge = new JustGage({
				id: "batteryGaugeCanvas", 
				value: 0, 
				min: 0,
				max: 100,
				title: "Battery",
				titleFontColor: "#888",
				gaugeWidthScale: 0.5,
				labelFontColor: "#888",
				valueFontColor: "#FFF",
				startAnimationTime: 1500,
				startAnimationType: "bounce",
				levelColorsGradient: true,
				levelColors: ["#e60000","#eaff00","#00cc00"]
			  }); 
			  
			speedGauge = new JustGage({
				id: "speedGaugeCanvas", 
				value: 0, 
				min: 0,
				max: 3,
				title: "Altitude",
				titleFontColor: "#888",
				gaugeWidthScale: 0.5,
				labelFontColor: "#888",
				valueFontColor: "#FFF",
				startAnimationTime: 1500,
				startAnimationType: "bounce",
			   levelColorsGradient: true,
			   levelColors: ["#00cc00","#eaff00","#e60000"]
			 }); 
		}
    
		function setBattery(battery){
			batteryGauge.refresh(battery);
		}
		
		function setAltitude(altitude){
			speedGauge.refresh(altitude);
		}
		
		function updateGauges(battery, horizontalSpeed){
			setBattery(battery);
			setAltitude(horizontalSpeed);
		}
		
		initGauges();
});