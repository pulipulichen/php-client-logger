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
         * @type {String} 伺服器的位置
         */
        server: "/php-client-logger/",
        
        /**
         * @type {Boolean} 是否自動開始記錄
         */
        auto_start_log: true,
        
        /**
         * @type {Number} 偏移天數
         */
        log_day_offset: 0
    };
    
    var _log = [];
    var _store_queue = [];
    
    var _profile = {
        name: undefined,
        uuid: undefined
        //ip: undefined,
        //referer: undefined
    };
    
    // ------------------------------------------------------------------
    
    
    _.init = function () {
        _config = _u.setup_config();
        
        _u.load_jquery(function () {
            _.init_lib(function () {
                //_u.t("已經讀取完成囉");

                // 開場先把profile設定好
                _.set_profile_uuid(_u.create_uuid());
                
                _.mouse_event.init();
            });
        });
        return this;
    };
    
    /**
     * 載入必要的函式庫
     * @param {function} _callback
     * @returns {$pcl}
     */
    _.init_lib = function (_callback) {
        var _url = _config.server + "client/lib/fingerprint/fingerprint.min.js";
        $.getScript(_url, function () {
            _u.trigger_callback(_callback);
        });
        return this;
    };
    
    // ------------------------------------------------------------------
    
    /**
     * 
     * @param {type} _name
     * @returns {$pcl}
     */
    _.set_profile_name = function (_name) {
        _profile.name = _name;
        return this;
    };
    
    _.set_profile_uuid = function (_uuid) {
        _profile.uuid = _uuid;
        return this;
    };
    
    /**
     * 
     * @param {type} _log = {
     *      x: @,
     *      y: @,
     *      event: @,
     *      note: @
     * }
     * @returns {$pcl}
     */
    _.add_log = function (_log) {
        return this;
    };
    
    _.store_log = function () {
        
    };
    
    // -----------------------------------------------------------------
    _.mouse_event = {};
    
    _.mouse_event.init = function () {
        return this;
    };
    
    _.mouse_event.move = function () {
        return this;
    };
    
    _.mouse_event.click = function () {
        return this;
    };
    
    _.mouse_event.dblclick = function () {
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
    
    /**
     * 建立UUID
     * @returns {String}
     */
    _u.create_uuid = function () {
        var _fingerprint = new Fingerprint().get();
        _fingerprint = _fingerprint + _u.get_timestamp();
        _fingerprint = _u.int_to_letters(_fingerprint);
        return _fingerprint;
    };
    
    /**
     * 壓縮字串
     * @param {type} _int
     * @returns {String|$pcl._u.int_to_letters._code}
     */
    _u.int_to_letters = function (_int) {
        var _code = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$-_.+!*'()".split("");
        //$.console_trace(_code.length);  // 72
        // 72*72 = 5184
        var _output = "";
        while (_int > _code.length - 1) {
            //var _division = Math.floor(_int / _code.length)-1;
            //$.console_trace(_division);
            
            var _mode = _int % _code.length;
            //_mode = _mode - 1;
            _output = _code[_mode] + _output;
            
            _int = (_int - _mode) / _code.length;
        }
        _output = _code[_int] + _output;
        //_output = _output + _code[_int];
        return _output;
    };
    
    /**
     * 取得時間戳記
     * @param {Number} _offset
     * @returns {_config.log_day_offset|Number}
     */
    _u.get_timestamp = function (_offset) {
        var _timestamp = (new Date()).getTime();

        if (_config.log_day_offset !== 0) {
            _timestamp = _timestamp + _config.log_day_offset * 24 * 60 * 60 * 1000;
        }
        
        if (typeof (_offset) === "number") {
            _timestamp = _timestamp + _offset * 24 * 60 * 60 * 1000;
        }

        return _timestamp;
    };
    
    _u.json_parse = function (_json) {
        if (_json === undefined || typeof(_json) !== "string") {
            return _json;
        }
        else {
            try {
                _json = JSON.parse(_json);
            }
            catch (_error) {
                $.console_trace(_error);
            }
            return _json;
        }
    };
    
    // ------------------------------------------------------------------
    _.init();
    
    return _;
};

