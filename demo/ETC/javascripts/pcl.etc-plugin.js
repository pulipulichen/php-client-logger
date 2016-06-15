PCL = $pcl();

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
        PCL.log.add(_log);
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

    PCL.log.add(_log);
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
        PCL.log.add(_log);
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
    PCL.log.add(_log);
    PCL.blur._enabled = false;
};