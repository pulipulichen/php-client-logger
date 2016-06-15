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


$(function () {
    
    
    setTimeout(function () {
        $("div.contain label.hc-name").each(function (_index, _element) {
            //console.log(1);
            _element = $(_element);
            var _offset = _element.offset();
            var _clone = _element.clone().appendTo(_element.parents(".line"));
            _clone.addClass("hc-name-clone")
                    .removeClass("hc-name")
                    .removeAttr("id")
                    .css("top", _offset.top + "px")
                    .css("left", _offset.left + "px")
                    .width(_element.width())
                    .height(_element.height())
                    .text("");
        });
        
    }, 100);

    var _timer_mouseenter = {};
    var _timer_mouseleave = {};
    
    var _div = $("div.contain > div");
    _div.mouseenter(function () {
        var _this = $(this);
        var _index = _this.parent().children().index(_this);
        _index = "div" + _index;
        //console.log(_index);
        if (_this.attr("enter") === "true") {
            return;
        }
        
        //clearTimeout(_timer_mouseenter[_index]);
        //clearTimeout(_timer_mouseleave[_index]);
        _this.attr("enter", "true");
        _timer_mouseenter[_index] = setTimeout(function () {
            //clearTimeout(_timer_mouseenter[_index]);
            //clearTimeout(_timer_mouseleave[_index]);
            _this.find("label").mouseenter();
            _this.attr("enter", "false");
            console.log("enter: " + _index);
        }, 10);
    });
        
    _div.mouseout(function () {
        
        var _this = $(this);
        var _index = _this.parent().children().index(_this);
        _index = "div" + _index;
        if (_this.attr("leave") === "true") {
            return;
        }
        _this.attr("leave", "true");
        //clearTimeout(_timer_mouseenter[_index]);
        _timer_mouseleave[_index] = setTimeout(function () {
            _this.find(".hc-details").fadeOut(function () {
                //clearTimeout(_timer_mouseenter[_index]);
                _this.find("label").mouseleave();
                _this.attr("leave", "false");
                console.log("leave: " + _index);
            });
        }, 2000);
        
    });
});