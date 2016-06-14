if (typeof(PCL_LIB) === "undefined") {PCL_LIB = [];}
PCL_LIB.push(function (_) {
    
    _.init = function () {
        _.config = _.u.setup_config();
        
        _.u.load_jquery(function () {
            _.init_log_lib(function () {
                

                // 開場先把profile設定好
                //_.set_profile_uuid(_.u.create_uuid());
                _.profile.load();
                
                if (_.config.log_start === true 
                        || _.u.query_string.pcl_log_start === "true") {
                    //_.u.t("已經讀取完成囉");
                    _.start();
                }
                
                if (_.config.view_mode === true 
                        || _.u.query_string.pcl_view === "true") {
                    _.view.start();
                }
            });
        });
        return this;
    };
    
    _.start = function () {
        _.log.add("start");
        if (_.config.enable_mouse_event === true) {
            _.mouse_event.init();
            _.aoi_map.init();
        }
        if (_.config.enable_window_event === true) {
            _.window_event.init();
        } 
        if (_.config.enable_key_event === true) {
            _.key_event.init();
        }
        return this;
    };
    
    _.end = function () {
        _.log.add("end");
        _.log.store();
        return this;
    };
    
    /**
     * 載入必要的函式庫
     * @param {function} _callback
     * @returns {$pcl}
     */
    _.init_log_lib = function (_callback) {
        var _url = _.config.server + "client/lib/fingerprint/fingerprint.min.js";
        _.u.load_script(_url, _callback);
        return this;
    };
});