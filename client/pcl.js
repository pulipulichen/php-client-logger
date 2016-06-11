/**
 * 主程式
 * @param {JSON} _config
 * @author 20160611 Pulipuli Chen
 * @returns {$pcl}
 */
$pcl = function (_config) {
    
    var _ = this;
    
    var _default_config = {
        /**
         * @type 伺服器的位置
         */
        server: "/php-client-logger/"
    };
    
    // ------------------------------------------------------------------
    
    
    _.init = function () {
        _config = _u.setup_config();
        
        _u.load_jquery(function () {
            _u.t("已經讀取完成囉");
        });
        return this;
    };
    
    // ------------------------------------------------------------------
    
    var _u = {};
    
    /**
     * 暫存區
     * @type {Object}
     */
    var _tmp = {};
    
    /**
     * 設定檔調整，載入預設值
     * @author 20160611 Pulipuli Chen
     * @returns {$pcl._default_config|JSON|Function|_.init}
     */
    _u.setup_config = function () {
        if (_config === undefined || typeof(_config) !== "object") {
            return _default_config;
        }
        
        for (var _key in _default_config) {
            if (typeof(_config[_key]) === "undefined") {
                _config[_key] = _default_config[_key];
            }
        }
        
        return _config;
    };
    
    /** 
     * 負責載入jQuery
     * @param {function} _callback
     * @returns {$pcl._u}
     */
    _u.load_jquery = function (_callback) {
        if (typeof($) === "function") {
            $(function () {
                _u.trigger_callback(_callback);
            });
        }
        else if (typeof(jQuery) === "function") {
            $ = jQuery;
            $(function () {
                _u.trigger_callback(_callback);
            });
        }
        else {
            
            if (typeof(_tmp.loading_jquery) === "undefined") {
                var _script = document.createElement('script');
                _script.type = 'text/javascript';
                var _url = _config.server + "client/lib/jquery/jquery-1.12.4.min.js";
                _script.src = _url;

                document.getElementsByTagName('head')[0].appendChild(_script);

                _tmp.loading_jquery = true;
            }
            
            setTimeout(function () {
                _u.load_jquery(_callback);
            }, 3000);
        }
        return this;
    };
    
    /**
     * 呼叫回呼函式
     * @param {type} _callback
     * @param {type} _parameter1
     * @param {type} _parameter2
     * @param {type} _parameter3
     * @returns {$pcl._u}
     */
    _u.trigger_callback = function (_callback, _parameter1, _parameter2, _parameter3) {
        if (typeof(_callback) === "function") {
            _callback(_parameter1, _parameter2, _parameter3);
        }
        return this;
    };
    
    /**
     * console.trace()的修正版
     * @author 20160611 Pulipuli Chen
     * @param {type} _title
     * @param {type} _message
     * @returns {$pcl._u}
     */
    _u.t = function (_title, _message) {
        if (_message === undefined) {
            _message = _title;
        }
        else {
            _message = "[" + _title + "] " + _message;
        }
        console.trace(_message);
        return this;
    };
    
    // ------------------------------------------------------------------
    _.init();
    
    return _;
};

