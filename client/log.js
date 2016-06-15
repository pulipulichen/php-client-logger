if (typeof(PCL_LIB) === "undefined") {PCL_LIB = [];}
PCL_LIB.push(function (_) {
    
    _.vars.log_queue = [];
    
    _.log = {};
    
    /**
     * 
     * @param {type} _log = {
     *      timestamp: @number,
     *      x: @,
     *      y: @,
     *      event: @,
     *      note: @
     * }
     * @returns {$pcl}
     */
    _.log.add = function (_log, _note) {
        if (typeof(_log) === "string") {
            _log = {
                event: _log
            };
        }
        if (_note !== undefined && typeof(_log.note) === "undefined") {
            _log.note = _note;
        }
        
        if (typeof(_log.timestamp) !== "number") {
            _log.timestamp = _.u.get_timestamp();
        }
        
        if (_log.event !== "mouse_event.move" 
                && _log.event !== "mouse_event.move_stay" 
                && _log.event !== "aoi_map.mouseenter"
                && _log.event !== "aoi_map.mouseleave"
                && _log.event !== "window_event.scroll") {
            _.u.t("log", _log);
        }
        
        _.vars.log_queue.push(_log);
        
        // 如果太多，則送到伺服器
        if (_.vars.log_queue.length > _.config.log_queue_length - 1
                && _.log._sending_data === false) {
            _.log._sending_data = true;
            _.log.store();
        }
        
        return this;
    };
    
    /**
     * 
     * @param {Boolean} _async 預設true，設成false的時候會強制同步
     * @returns {$pcl.log}
     */
    _.log.store = function (_async) {
        if (_.vars.log_queue.length === 0) {
            return this;
        }
        
        // 1. 先把原本的log_queue丟到store_queue
        var _store_queue = _.vars.log_queue;
        
        // 2. 清空log_queue
        _.vars.log_queue = [];
        
        // 3. 準備傳送資料
        var _url = _.config.server + "log/set";
        var _data = {
            profile: _.u.stringify(_.vars.profile),
            logs: _.u.stringify(_store_queue)
        };
        
        if (_.aoi_map.stored === false && _.config.enable_aoi_map === true) {
            _data.aoi_map = _.u.stringify(_.aoi_map.locate());
            _.aoi_map.stored = true;
        }
        
        //_.u.t("_.log.store() 要儲存囉");
        if (_async !== false) {
            $.post(_url, _data, function () {
                // 完成之後
                _.log._sending_data = false;
            });
        }
        else {
            $.ajax({
                type: "POST",
                async: false,
                url: _url,
                data: _data,
                complete: function () {
                    _.log._sending_data = false;
                }
            });
        }
        
        return this;
    };
    
    _.log._sending_data = false;
});