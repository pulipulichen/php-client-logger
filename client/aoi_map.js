if (typeof(PCL_LIB) === "undefined") {PCL_LIB = [];}
PCL_LIB.push(function (_) {
    _.aoi_map = {};
    
    _.aoi_map.attr_name = "[data-pcl-aoi]";
    
    _.aoi_map.locate = function () {
        var _aoi_data = {};
        
        // 找尋 [data-pcl-aoi]
        $(_.aoi_map.attr_name).each(function (_index, _element) {
            _element = $(_element);
            var _aoi_name = _element.attr("data-pcl-aoi");
            if (typeof(_aoi_data[_aoi_name]) === "undefined") {
                _aoi_data[_aoi_name] = [];
            }
            var _pos = _.u.get_pos(_element);
            var _width = _element.width();
            var _height = _element.height();
            _aoi_data[_aoi_name].push({
                lt: [_pos.x, _pos.y],  //左上
                rt: [_pos.x + _width, _pos.y],  //右上
                lb: [_pos.x, _pos.y + _height],  //左下
                rb: [_pos.x + _width, _pos.y + _height]  //右下
            });
        });
        
        //_.u.t(_aoi_data);
        return _aoi_data;
    };
    
    _.aoi_map.stored = false;
    
    // ---------------------------------------
    
    _.aoi_map.init = function () {
        $(_.aoi_map.attr_name).hover(function (_event) {
            _.aoi_map.mouseenter(_event);
        }, function (_event) {
            _.aoi_map.mouseleave(_event);
        });
    };
    
    _.aoi_map.mouseenter = function (_event) {
        var _log = _.u.create_mouse_log(_event, "aoi_map.mouseenter");
        var _name = _log.xpath;
        if (typeof(_log.aoi) !== "undefined") {
            _name = _log.aoi;
        }
        _.u.interval_timer.set("aoi_map.mouseenter", _name);
        _.log.add(_log);
        return this;
    };
    
    _.aoi_map.mouseleave = function (_event) {
        var _log = _.u.create_mouse_log(_event, "aoi_map.mouseleave");
        var _name = _log.xpath;
        if (typeof(_log.aoi) !== "undefined") {
            _name = _log.aoi;
        }
        var _interval_time = _.u.interval_timer.get("aoi_map.mouseenter", _name);
        _log.note = _interval_time + "";
        _.log.add(_log);
        return this;
    };
    
});