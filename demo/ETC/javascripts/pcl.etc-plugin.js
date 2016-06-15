PCL = $pcl();

PCL.hovercard = {};

PCL.hovercard._hovertimer = {};

PCL.hovercard._last_aoi;

PCL.hovercard.on_hover_in = function (_delay_time, _trigger) {
    var _aoi = $(_trigger).children(".hc-name").attr("id");
    clearTimeout(PCL.hovercard._hovertimer[_aoi]);
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