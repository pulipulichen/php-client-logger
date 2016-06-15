/*
	########  ##       ##     ## ########
	##     ## ##       ##     ## ##     ##
	##     ## ##       ##     ## ##     ##
	########  ##       ##     ## ########
	##     ## ##       ##     ## ##   ##
	##     ## ##       ##     ## ##    ##
	########  ########  #######  ##     ##
*/
$(document).ready(function(){
	
	var _log_add_blur = function(_event_name, _event) {
            PCL.log.add(_event_name);
	};
	var _blur_timer;
	var _blur_enable = false;
	
	// ---------------------

	var _set_event = function() {
		var _selector = ".hc-preview";
		$("label").mouseover(function (_event) {
			$("span").addClass("blur");
			$("label").not(this).addClass("blur");
			
			//--------------------------------------------
			PCL.blur.mouseover(_event);
			//--------------------------------------------
		});

		$(".hc-preview").mouseleave(function(_event) {
			$("span").removeClass("blur");
			$("label").not(this).removeClass("blur");
			
			//--------------------------------------------
			PCL.blur.mouseleave(_event);
			//--------------------------------------------
		});
	};
	if ($(".hc-preview").length > 0) {
		_set_event();
	}
	else {
		setTimeout(function () {
			_set_event();
		}, 500);
	}
/*
	########   #######  ##       ########
	##     ## ##     ## ##       ##     ##
	##     ## ##     ## ##       ##     ##
	########  ##     ## ##       ##     ##
	##     ## ##     ## ##       ##     ##
	##     ## ##     ## ##       ##     ##
	########   #######  ######## ########
*/
	$("#emph").mouseover(function () {
			$("abbr").addClass("bold");
		});
	});

/*
	 ######   ######  ########   #######  ##       ##
	##    ## ##    ## ##     ## ##     ## ##       ##
	##       ##       ##     ## ##     ## ##       ##
	 ######  ##       ########  ##     ## ##       ##
	      ## ##       ##   ##   ##     ## ##       ##
	##    ## ##    ## ##    ##  ##     ## ##       ##
	 ######   ######  ##     ##  #######  ######## ########

$("document").ready(function() {
	$('.top-title').mouseover(function(){
		$('html, body').animate({
			scrollTop: $(".middle").offset().top
		}, 1500);
	});

	$('.middle-title').mouseover(function(){
		$('html, body').animate({
			scrollTop: $(".bottom").offset().top
		}, 1500);
	});
	$('.middle-title-back').mouseover(function(){
		$('html, body').animate({
			scrollTop: $(".top").offset().top
		}, 1500);
	});

	$('.bottom-title').mouseover(function(){
		$('html, body').animate({
			scrollTop: $(".top").offset().top
		}, 1500);
	});
	$('.bottom-title-back').mouseover(function(){
		$('html, body').animate({
			scrollTop: $(".middle").offset().top
		}, 1500);
	});
});
*/

/*
	##     ##  ######              ##  ######
	##     ## ##    ##             ## ##    ##
	##     ## ##                   ## ##
	######### ##        ###        ##  ######
	##     ## ##             ##    ##       ##
	##     ## ##    ##       ##    ## ##    ##
	##     ##  ######         ######   ######
*/
