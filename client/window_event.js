if (typeof(PCL_LIB) === "undefined") {PCL_LIB = [];}
PCL_LIB.push(function (_) {
    _.window_event = {};
    
    _.window_event.init = function () {
        $(window).blur(function (_event) {
            _.window_event.blur(_event);
        });
        
        $(window).focus(function (_event) {
            _.window_event.focus(_event);
        });
        
        $(window).unload(function (_event) {
            _.window_event.unload(_event);
        });
        
        $(window).scroll(function () {
            _.window_event.scroll();
        });
        
        return this;
    };
    
    _.window_event.blur = function (_event) {
        _.log.add("window_event.blur");
        _.log.store();
        return this;
    };
    
    _.window_event.focus = function (_event) {
        _.log.add("window_event.focus");
        return this;
    };
    
    _.window_event.unload = function (_event) {
        _.log.add("window_event.unload");
        _.log.store(false);
        return this;
    };
    
    _.window_event.scroll = function () {
        var _t = $(this);
        _.log.add({
            event: "window_event.scroll",
            x: _t.scrollLeft(),
            y: _t.scrollTop()
        });
        //_.u.t("捲動");
        return this;
    };
});