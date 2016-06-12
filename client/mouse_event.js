if (typeof(PCL_LIB) === "undefined") {PCL_LIB = [];}
PCL_LIB.push(function (_) {
    _.mouse_event = {};
    
    _.mouse_event.init = function () {
        
        $(document).mousemove(function (_event) {
            _.mouse_event.move(_event);
            _.mouse_event.move_stay(_event);
        });
        
        $(document).click(function (_event) {
            _.mouse_event.click(_event);
        });
        
        $(document).dblclick(function (_event) {
            _.mouse_event.dblclick(_event);
        });
        
        return this;
    };
    
    _.mouse_event.move = function (_event) {
//        var _x = _event.pageX;
//        var _y = _event.pageY;
//        var _event_name = "mouse_event_move";
        _.log.add({
            event: "mouse_event.move",
            x: _event.pageX,
            y: _event.pageY
        });
        return this;
    };
    
    _.mouse_event.move_stay_last_timestamp;
    _.mouse_event.move_stay_last_log;
    _.mouse_event.move_stay = function (_event) {
        var _current_timestamp = _.u.get_timestamp();
        if (_.mouse_event.move_stay_last_timestamp === undefined) {
            _.mouse_event.move_stay_update(_event, _current_timestamp);
        } else if (_current_timestamp - _.mouse_event.move_stay_last_timestamp > _.config.mouse_stay_interval) {
            _.log.add(_.mouse_event.move_stay_last_log);
            _.mouse_event.move_stay_update(_event, _current_timestamp);
        }
        return this;
    };
    
    _.mouse_event.move_stay_update = function (_event, _current_timestamp) {
        var _log = {
            event: "mouse_event.move_stay",
            x: _event.pageX,
            y: _event.pageY
        };
        _.mouse_event.move_stay_last_log = _log;
        _.mouse_event.move_stay_last_timestamp = _current_timestamp;
        return this;
    };
    
    
    _.mouse_event.click = function (_event) {
        var _log = {
            event: "mouse_event.click",
            x: _event.pageX,
            y: _event.pageY,
            xpath: _.u.get_xpath(_event)
        };
        
        var _aoi = _.u.get_aoi(_event);
        if (_aoi !== undefined) {
            _log.aoi = _aoi;
        }
        
        _.log.add(_log);
        return this;
    };
    
    _.mouse_event.dblclick = function (_event) {
        _.log.add({
            event: "mouse_event.dblclick",
            x: _event.pageX,
            y: _event.pageY,
            xpath: _.u.get_xpath(_event)
        });
        return this;
    };
});