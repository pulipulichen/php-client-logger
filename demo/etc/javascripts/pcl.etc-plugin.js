

PCL.hovercard = {};

PCL.hovercard._hovertimer = {};

PCL.hovercard._last_aoi;

PCL.hovercard.on_hover_in = function (_delay_time, _trigger) {
    var _aoi = $(_trigger).children(".hc-name").attr("id");
    if (typeof(PCL.hovercard._hovertimer[_aoi]) !== "undefined") {
        return this;
    }
    //clearTimeout(PCL.hovercard._hovertimer[_aoi]);
    PCL.hovercard._hovertimer[_aoi] = setTimeout(function () {
        var _aoi = $(_trigger).children(".hc-name").attr("id");
        var _log = {
            event: "etc.hovercard.on_hover_in",
            xpath: PCL.u.get_xpath(_trigger),
            aoi: _aoi
        };
        if (PCL.etc_config.enable_log) {
            PCL.log.add(_log);
        }
        PCL.u.interval_timer.set("etc.hovercard.on_hover", _aoi);
        PCL.hovercard._last_aoi = _aoi;
    }, _delay_time);
    return this;
};

PCL.hovercard.on_hover_out = function (_delay_time, _trigger) {
    var _aoi = PCL.hovercard._last_aoi;
    PCL.hovercard._last_aoi = undefined;
    clearTimeout(PCL.hovercard._hovertimer[_aoi]);
    var _log = {
        event: "etc.hovercard.on_hover_out",
        xpath: PCL.u.get_xpath(_trigger),
        aoi: _aoi
    };
    
    _log.note = PCL.u.interval_timer.get("etc.hovercard.on_hover", _aoi) + "";

    if (PCL.etc_config.enable_log) {
        PCL.log.add(_log);
    }
    return this;
};

// -------------------------------------

PCL.blur = {};
PCL.blur.timer;
PCL.blur._enabled = false;
PCL.blur._last_aoi = undefined;

PCL.blur.mouseover = function (_event) {
    clearTimeout(PCL.blur.timer);
    PCL.blur.timer = setTimeout(function () {
        var _log = PCL.u.create_mouse_log(_event, "etc.blur.mouseover");
        if (PCL.hovercard._last_aoi !== undefined) {
            PCL.blur._last_aoi = PCL.hovercard._last_aoi;
            _log.aoi = PCL.blur._last_aoi;
            PCL.u.interval_timer.set("etc.blur", _log.aoi);
        }
        if (PCL.etc_config.enable_log) {
            PCL.log.add(_log);
        }
        PCL.blur._enabled = true;
        
    }, 6000);
};

PCL.blur.mouseleave = function (_event) {
    if (PCL.blur._enabled === false) {
        return;
    }
    
    //clearTimeout(PCL.blur.timer);
    var _log = PCL.u.create_mouse_log(_event, "etc.blur.mouseleave");
    _log.aoi = PCL.blur._last_aoi;
    _log.note = PCL.u.interval_timer.get("etc.blur", _log.aoi) + "";
    PCL.blur._last_aoi = undefined;
    if (PCL.etc_config.enable_log) {
        PCL.log.add(_log);
    }
    PCL.blur._enabled = false;
};

PCL.mouseover = function (_event_name, _element, _enable_time, _min_time, _callback) {
    if (_element.length === 0 || typeof(_callback) !== "function") {
        return this;
    }
    
    var _prefix = "pcl-mouseover-" + _event_name + "-";
    
    //console.log([_enable_time, _min_time]);
    
//    var _index = 0;
//    var _timer = {};
    
    _element.mouseover(function () {
        var _this = $(this);
        
//        var _timer_index = _this.attr("pcl-mouseover-index");
//        if (_timer_index === undefined) {
//            _this.attr("pcl-mouseover-index", _index);
//            _timer_index = _index;
//            _index++;
//        }
        
        _this.attr(_prefix + "over", PCL.u.get_timestamp());
        
        if (_this.attr(_prefix + "set_timer") === "true") {
            return;
        }
        
        _this.attr(_prefix + "set_timer", "true");
        setTimeout(function () {
            var _sum = parseInt(_this.attr(_prefix + "sum"));
            
            // 做一次結算
            if (_this.attr(_prefix + "over") !== undefined) {
                var _timestamp = parseInt(_this.attr(_prefix + "over"));
                var _interval = PCL.u.get_timestamp() - _timestamp;
                _sum = _interval + _timestamp;
            }
            
            _this.removeAttr(_prefix + "over");
            _this.removeAttr(_prefix + "sum");
            _this.removeAttr(_prefix + "set_timer");
            
            if (_sum > _min_time) {
                _callback(_this);
            }
        }, _enable_time);
    });
    
    _element.mouseout(function () {
        var _this = $(this);
        var _timestamp = parseInt(_this.attr(_prefix + "over"));
        if (isNaN(_timestamp)) {
            return;
        }
        
        var _interval = PCL.u.get_timestamp() - _timestamp;
        var _sum = parseInt(_this.attr(_prefix + "sum"));
        if (_sum === undefined || isNaN(_sum)) {
            _sum = 0;
        }
        //console.log([_sum, _interval]);
        _sum = _sum + _interval;
        _this.attr(_prefix + "sum", _sum);
        _this.removeAttr(_prefix + "over");
    });
};


PCL.mouseout = function (_event_name, _element, _enable_time, _min_time, _callback) {
    if (_element.length === 0 || typeof(_callback) !== "function") {
        return this;
    }
    
    var _prefix = "pcl-mouseout-" + _event_name + "-";
    
    //console.log([_enable_time, _min_time]);
    
//    var _index = 0;
//    var _timer = {};
    
    _element.mouseout(function () {
        var _this = $(this);
        
//        var _timer_index = _this.attr("pcl-mouseover-index");
//        if (_timer_index === undefined) {
//            _this.attr("pcl-mouseover-index", _index);
//            _timer_index = _index;
//            _index++;
//        }
        
        _this.attr(_prefix + "out", PCL.u.get_timestamp());
        
        if (_this.attr(_prefix + "set_timer") === "true") {
            return;
        }
        
        _this.attr(_prefix + "set_timer", "true");
        setTimeout(function () {
            var _sum = parseInt(_this.attr(_prefix + "sum"));
            
            // 做一次結算
            if (_this.attr(_prefix + "out") !== undefined) {
                var _timestamp = parseInt(_this.attr(_prefix + "out"));
                var _interval = PCL.u.get_timestamp() - _timestamp;
                _sum = _interval + _timestamp;
            }
            
            _this.removeAttr(_prefix + "out");
            _this.removeAttr(_prefix + "sum");
            _this.removeAttr(_prefix + "set_timer");
            
            if (_sum > _min_time) {
                _callback(_this);
            }
        }, _enable_time);
    });
    
    _element.mouseover(function () {
        var _this = $(this);
        var _timestamp = parseInt(_this.attr(_prefix + "out"));
        if (isNaN(_timestamp)) {
            return;
        }
        
        var _interval = PCL.u.get_timestamp() - _timestamp;
        var _sum = parseInt(_this.attr(_prefix + "sum"));
        if (_sum === undefined || isNaN(_sum)) {
            _sum = 0;
        }
        //console.log([_sum, _interval]);
        _sum = _sum + _interval;
        _this.attr(_prefix + "sum", _sum);
        _this.removeAttr(_prefix + "out");
    });
};

//---------------------------------------------------

/*
	########  ##       ##     ## ########
	##     ## ##       ##     ## ##     ##
	##     ## ##       ##     ## ##     ##
	########  ##       ##     ## ########
	##     ## ##       ##     ## ##   ##
	##     ## ##       ##     ## ##    ##
	########  ########  #######  ##     ##
*/
//$(document).ready(function(){
//	
//	var _log_add_blur = function(_event_name, _event) {
//            PCL.log.add(_event_name);
//	};
//	var _blur_timer;
//	var _blur_enable = false;
//	
//	// ---------------------
//
//	var _set_event = function() {
//		var _selector = ".hc-preview";
//		$("label").mouseover(function (_event) {
//			$("span").addClass("blur");
//			$("label").not(this).addClass("blur");
//			
//			//--------------------------------------------
//			PCL.blur.mouseover(_event);
//			//--------------------------------------------
//		});
//
//		$(".hc-preview").mouseleave(function(_event) {
//			$("span").removeClass("blur");
//			$("label").not(this).removeClass("blur");
//			
//			//--------------------------------------------
//			PCL.blur.mouseleave(_event);
//			//--------------------------------------------
//		});
//	};
//	if ($(".hc-preview").length > 0) {
//		_set_event();
//	}
//	else {
//		setTimeout(function () {
//			_set_event();
//		}, 500);
//	}
//});


/*
	########   #######  ##       ########
	##     ## ##     ## ##       ##     ##
	##     ## ##     ## ##       ##     ##
	########  ##     ## ##       ##     ##
	##     ## ##     ## ##       ##     ##
	##     ## ##     ## ##       ##     ##
	########   #######  ######## ########
*/
//$(function () {
//    $("#emph").mouseover(function () {
//        $("abbr").addClass("bold");
//    });
//});



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
    
//    阻止hovercard事件發生，不過好像不用了？
//    setTimeout(function () {
//        $("div.contain label.hc-name").each(function (_index, _element) {
//            //console.log(1);
//            _element = $(_element);
//            var _offset = _element.offset();
//            var _clone = _element.clone().appendTo(_element.parents(".line"));
//            _clone.addClass("hc-name-clone")
//                    .removeClass("hc-name")
//                    .removeAttr("id")
//                    .css("top", _offset.top + "px")
//                    .css("left", _offset.left + "px")
//                    .width(_element.width())
//                    .height(_element.height())
//                    .text("");
//        });
//    }, 100);

    var _timer_mouseenter = {};
    var _timer_mouseleave = {};
    
    var _div = $("div.contain > div");
    var _mouseover_delay = PCL.etc_config.hovercard_mouseover_delay;
    var _mouseleave_delay = PCL.etc_config.hovercard_mouseleave_delay;
    var _blur_delay = PCL.etc_config.blur_enable_delay;
    
    var _prev_line = PCL.etc_config.eye_tracking_position_fix;
    
    var _height = window.innerHeight;
    var doc = document.documentElement;
    
//    _div.mouseover(function (_event) {
//        var _this = $(this);
//        
//        
//        var _current_top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
//        //console.trace([_event.pageY - _current_top, _this.offset().top - _current_top, _height]);
//        if (_prev_line === true && _this.next().length === 1 && (_this.offset().top- _current_top) > (_height / 3)) {
//            _this = _this.next();
//        }
//        
//        
//        var _index = _this.parent().children().index(_this);
//        _index = "div" + _index;
//        //console.log(_index);
//        if (_this.attr("enter") === "true") {
//            return;
//        }
//        //_disable_blur();
//        
//        //clearTimeout(_timer_mouseenter[_index]);
//        //clearTimeout(_timer_mouseleave[_index]);
//        _this.attr("enter", "true");
//        
//        _timer_mouseenter[_index] = setTimeout(function () {
//            //clearTimeout(_timer_mouseenter[_index]);
//            //clearTimeout(_timer_mouseleave[_index]);
//            
//            if (_this.attr("enter") === "false"
//                    || _this.attr("hovercard_display") === "true") {
//                return;
//            }
//            
//            //_this.find("label").mouseenter();
//            _this.find(".hc-details").addClass("hovercard-display");
//            //_disable_blur();
//            _this.attr("hovercard_display", "true");
//            
//            //_this.attr("enter", "false");
//            //console.log("enter: " + _index);
//            
//            _this.attr("leave", "true");
//            
//            _timer_mouseleave[_index] = setTimeout(function () {
//                _check_mouseleave(_this, _index);
//            }, _mouseleave_delay);
//        }, _mouseover_delay);
//    });
//    
//    var _check_mouseleave = function (_this, _index) {
//        if (_this.attr("enter") === "false" && _this.attr("leave") === "true") {
//            _this.attr("leave", "false");
//            _this.find(".hc-details").removeClass("hovercard-display");
//            _this.attr("hovercard_display", "false");
//            //_disable_blur();
//        }
//        else {
//            _timer_mouseleave[_index] = setTimeout(function () {
//                _check_mouseleave(_this, _index);
//            }, PCL.etc_config.hovercard_mouseleave_check_delay);
//        }
//    };
//    
//    _div.mouseout(function () {
//        var _this = $(this);
//        var _current_top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
//        if (_prev_line === true && _this.next().length === 1 && (_this.offset().top- _current_top) > (_height / 3)) {
//            _this = _this.next();
//        } 
//        _this.attr("enter", "false");
//    
//    });
    
    PCL.mouseover("on_hover_in", _div, _mouseover_delay, _mouseover_delay*0.5, function (_this) {
        if (_this.attr("display_hover") === undefined) {
            _this.attr("display_hover", "true");
            _on_hover_in(_this);
            _this.attr("display_hover_timestamp", PCL.u.get_timestamp());
        }
    });
    
    var _hover_display_min_time = 2000;
    
    var _mouseout_callback = function (_this) {
        if (_this.attr("display_hover") === "true") {
            var _last_timestamp = parseInt(_this.attr("display_hover_timestamp"));
            if (PCL.u.get_timestamp() - _last_timestamp < _hover_display_min_time) {
                setTimeout(function () {
                    _mouseout_callback(_this);
                }, PCL.u.get_timestamp() - _last_timestamp);
                return;
            }
            
            _this.removeAttr("display_hover");
            _on_hover_out(_this);
        }
    };
    
    PCL.mouseout("on_hover_out", _div, _mouseover_delay, _mouseover_delay*0.5, _mouseout_callback);
    
    var _on_hover_in = function (_this) {
        _this.find(".hc-details").addClass("hovercard-display");
    };
    
    var _on_hover_out = function (_this) {
        _this.find(".hc-details.hovercard-display").removeClass("hovercard-display");
    };
    
    // --------------------------------------------
    
    var _blur_enabled = false;
    var _blur_timer;
    
//    _div.mouseover(function () {
//        var _this = $(this);
//        clearTimeout(_blur_timer);
//        _blur_timer = setTimeout(function () {
//            _enable_blur(_this);
//        }, _blur_delay);
//    });

    PCL.mouseover( "blur", _div, _blur_delay, _blur_delay*0.5, function (_this) {
        _enable_blur(_this);        
    });
    
    var _enable_blur = function (_this) {
        //if (_blur_enabled === true) {
        //    return;
        //}
        
        
        var _next_line = _this.next();
        var _prev_line = _this.prev();
        _this.addClass("dont-blur");
        _next_line.addClass("dont-blur");
        _prev_line.addClass("dont-blur");
        
        $(".line:not(.dont-blur) > span").addClass("blur");
        $(".line:not(.dont-blur) > div.hc-preview").addClass("blur");
        
        $(".line:not(.dont-blur)").find(".hc-details.hovercard-display").removeClass("hovercard-display");
        
        // -------------------------
        
        _this.removeClass("dont-blur");
        _next_line.removeClass("dont-blur");
        _prev_line.removeClass("dont-blur");
        
        // -------------------------------
        
        _this.find(".blur").removeClass("blur");
        if (_next_line.length > 0) {
            _next_line.find(".blur").removeClass("blur");
        }
        if (_prev_line.length > 0) {
            _prev_line.find(".blur").removeClass("blur");
        }
        
        _blur_enabled = true;
    };
    
    _disable_blur = function () {
        $(".blur").removeClass("blur");
        _blur_enabled = false;
    };
    
//    _div.mouseout(function () {
//        
//        var _this = $(this);
//        var _index = _this.parent().children().index(_this);
//        _index = "div" + _index;
//        if (_this.attr("leave") === "true") {
//            return;
//        }
//        _this.attr("leave", "true");
//        //clearTimeout(_timer_mouseenter[_index]);
//        _timer_mouseleave[_index] = setTimeout(function () {
//            _this.find(".hc-details").fadeOut(function () {
//                //clearTimeout(_timer_mouseenter[_index]);
//                _this.find("label").mouseleave();
//                _this.attr("leave", "false");
//                console.log("leave: " + _index);
//            });
//        }, 2000);
//        
//    });
});

// ------------------------------------------------------
// 換頁功能

// 先插入兩個位置吧
$(function () {
    var _page_turner_up = $('<div class="page-turner up"></div>').appendTo("body");
    var _page_turner_down = $('<div class="page-turner down"></div>').appendTo("body");
    
    var doc = document.documentElement;
    
    var _height = window.innerHeight;
    
    //var _target_line = $(".line:last");
    //var _line_height = _target_line.outerHeight() * 4;
    //alert($(".line:first").height());
    //alert(_line_height);
    
    var body = document.body,
    html = document.documentElement;

    var _body_height = Math.max( body.scrollHeight, body.offsetHeight, 
                       html.clientHeight, html.scrollHeight, html.offsetHeight );
    
    var _page_timer = {
        "pageup":undefined,
        "pagedown":undefined
    };
    
    var _turner_delay = PCL.etc_config.page_turner_delay;
    var _remove_hover_delay = PCL.etc_config.page_turner_disable_delay;
    var _turner_height = PCL.etc_config.page_turner_page_height;
    
    //----------------------------------------------
    
    var _last_page_up = PCL.u.get_timestamp() - _remove_hover_delay;
    var _page_up = function (_this) {
        if (PCL.u.get_timestamp() - _last_page_up < _remove_hover_delay) {
            _this.removeClass("hover");
            return;
        }
        //_this.removeClass("hover");
        _page_turner_down.removeClass("disable");
        _disable_blur();
        
        var _top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
        
        var _match_line_border = _top + _page_turner_up.outerHeight();
        var _line_top;
        var _lines = $(".line");
        for (var _i = 0; _i < _lines.length; _i++) {
            _line_top = _lines.eq(_i).offset().top;
            if (_line_top > _match_line_border) {
                break;
            }
        }
        var _interval_height = _line_top - _page_turner_up.offset().top;
        var _to_top = _top - _height + _interval_height + _page_turner_down.outerHeight();
        
        //var _to_top = _top - (_height - _turner_height);
        //var _to_top = _top - _line_height;
        if (_to_top < (0 + PCL.etc_config.page_turner_top_padding)) {
            _to_top = 0;
            _this.addClass("disable");
        }
        else {
            _this.removeClass("hover");
        }
        _scrollTo(document.body, _to_top, PCL.etc_config.page_turner_speed);
        
        _last_page_up = PCL.u.get_timestamp();
    };
    
    PCL.mouseover("page_up", _page_turner_up, _turner_delay, _turner_delay*0.5, function (_this) {
        _page_up(_this);
    });
    
    _page_turner_up.mouseover(function () {
        if (PCL.u.get_timestamp() - _last_page_up > _remove_hover_delay) {
            $(this).addClass("hover");
        }
    });
    _page_turner_up.mouseout(function () {
        $(this).removeClass("hover");
    });
    
    // ----------------------------------
    
    var _last_page_down = PCL.u.get_timestamp() - _remove_hover_delay;
    var _page_down = function (_this) {
        if (PCL.u.get_timestamp() - _last_page_down < _remove_hover_delay) {
            _this.removeClass("hover");
            return;
        }
        //_this.removeClass("hover");
        _page_turner_up.removeClass("disable");
        _disable_blur();
        
        var _top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
        
        
        var _match_line_border = _top + _height - _page_turner_down.outerHeight();
        var _line_top;
        var _lines = $(".line");
        for (var _i = 0; _i < _lines.length; _i++) {
            _line_top = _lines.eq(_i).offset().top;
            if (_line_top > _match_line_border) {
                _i--;
                //_lines.eq(_i).css("color", "red");
                _line_top = _lines.eq(_i).offset().top;
                break;
            }
        }
        //var _interval_height = _line_top - (_page_turner_down.offset().top + _page_turner_down.outerHeight());
        var _to_top = _line_top - _page_turner_up.outerHeight();
        
        //var _to_top = _top + (_height - _turner_height);
        //var _to_top = _top + _line_height;
        
        //console.log([_to_top ,_body_height, _height, PCL.etc_config.page_turner_bottom_padding]);
        if (_to_top > (_body_height - _height - PCL.etc_config.page_turner_bottom_padding)) {
            _to_top = _body_height;
            _this.addClass("disable");
        }
        else {
            _this.removeClass("hover");
        }
        _scrollTo(document.body, _to_top, PCL.etc_config.page_turner_speed);
        
        _last_page_down = PCL.u.get_timestamp();
    };
    
    PCL.mouseover("page_down", _page_turner_down, _turner_delay, _turner_delay*0.5, function (_this) {
        _page_down(_this);
    });
    
    _page_turner_down.mouseover(function () {
        if (PCL.u.get_timestamp() - _last_page_down > _remove_hover_delay) {
            $(this).addClass("hover");
        }
    });
    _page_turner_down.mouseout(function () {
        $(this).removeClass("hover");
    });
    
    // -----------------------------------
    
    var _scrollTo = function(element, to, duration, _callback) {
        if (duration <= 0) {
            if (typeof(_callback) === "function") {
                _callback();
            }
            return;
        }
        var difference = to - element.scrollTop;
        var perTick = difference / duration * 10;

        setTimeout(function() {
            element.scrollTop = element.scrollTop + perTick;
            if (element.scrollTop === to) return;
            _scrollTo(element, to, duration - 10, _callback);
        }, 10);
    };
    
    // ------------------------
    // 確認初始位置，來決定是否要disable
    var _check_page_turner_disable = function () {
        var _current_top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
        //console.trace([_current_top, _height, _current_top + _height, _body_height]);
        if (_page_turner_up.attr("scrolling") !== "true") {
            if (_current_top === 0) {
                _page_turner_up.addClass("disable");
            }
            else {
                _page_turner_up.removeClass("disable");
            }
        }
        
        if (_current_top + _height > _body_height - 1) {
            _page_turner_down.addClass("disable");
        }
        else if (_page_turner_down.attr("scrolling") !== "true") {
            _page_turner_down.removeClass("disable");
        }
    };
    _check_page_turner_disable();
    $(window).scroll(_check_page_turner_disable);
});
