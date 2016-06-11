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
        log_day_offset: 0,
        
        /**
         * cookie 會過期的日子
         * undefined 表示關掉網頁就會忘記
         */
        cookie_expires_day: 30,
        
        /**
         * @type {String} Cookie適用範圍 
         */
        cookie_path: "/",
        
        log_queue_length: 100,
    };
    
    var _log_queue = [];
    //var _store_queue = [];
    
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
                //_.set_profile_uuid(_u.create_uuid());
                _.profile.load();
                
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
    
    _.profile = {};
    
    /**
     * @param {type} _name
     * @returns {$pcl}
     */
    _.profile.set_name = function (_name) {
        _profile.name = _name;
        _u.cookie.set("profile", _profile);
        return this;
    };
    
    _.profile.set_uuid = function (_uuid) {
        _profile.uuid = _uuid;
        _u.cookie.set("profile", _profile);
        return this;
    };
    
    
    _.profile.load = function () {
        _profile = _u.cookie.get("profile");
        if (typeof(_profile) !== "object") {
            _profile = {};
        }
        if (typeof(_profile.uuid) !== "string") {
            _.profile.set_uuid(_u.create_uuid());
        }
        return this;
    };
    
    // ---------------------------------------------
    
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
    _.log.add = function (_log) {
        if (typeof(_log) === "string") {
            _log = {
                event: _log
            };
        }
        
        if (typeof(_log.timestamp) !== "number") {
            _log.timestamp = _u.get_timestamp();
        }
        
        _log_queue.push(_log);
        
        // 如果太多，則送到伺服器
        if (_log_queue.length > _config.log_queue_length) {
            _.log.store();
        }
        
        return this;
    };
    
    _.log.store = function () {
        
        // 1. 先把原本的log_queue丟到store_queue
        var _store_queue = _log_queue;
        
        // 2. 清空log_queue
        _log_queue = [];
        
        // 3. 準備傳送資料
        var _url = _config.server + "server/store.php";
        var _data = {
            profile: _profile,
            log: _store_queue
        };
        
        $.post(_url, _data, function () {
            _u.t("_.log.store() 完成");
        });
        
    };
    
    // -----------------------------------------------------------------
    _.mouse_event = {};
    
    _.mouse_event.init = function () {
        
        $(document).mousemove(function (_event) {
            _.mouse_event.move(_event);
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
        
        return this;
    };
    
    _.mouse_event.click = function (_event) {
        return this;
    };
    
    _.mouse_event.dblclick = function (_event) {
        return this;
    };
    
    // ------------------------------------------------------------------
    
    _.window_event = {};
    
    _.window_event.init = function () {
        $(window).blur(function (_event) {
            _.window_event.blur(_event);
        });
        
        $(window).focus(function (_event) {
            _.window_event.focus(_event);
        });
        
        return this;
    };
    
    _.window_event.blur = function (_event) {
        _.log.add("window_event_blur");
        return this;
    };
    
    _.window_event.focus = function (_event) {
        _.log.add("window_event_focus");
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
            }, 500);
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
    
    _u.stringify = function (_value) {
        var _type = typeof(_value);
        if (_value === undefined || _value === null) {
            _u.t("無資料");
            return _value;
        }
        else if (_type === "object") {
            _u.t("轉換");
            return JSON.stringify(_value);
        }
        else {
            _u.t("什麼類型呢？" + _type);
            return _value;
        }
    };
    
    _u.cookie = {};
    
    _u.cookie.set = function (_key, _value) {
        var d = new Date();
        d.setTime(d.getTime() + (_config.cookie_expires_day * 24 * 60 * 60 * 1000));
        var expires = "expires="+ d.toUTCString();
        _value = _u.stringify(_value);
        _u.t(_value);
        document.cookie = _key + "=" + _value + "; " + expires + "; path=" + _config.cookie_path;
    };
    
    _u.cookie.get = function (_key) {
        var _name = _key + "=";
        var _ca = document.cookie.split(';');
        var _value;
        for(var i = 0; i < _ca.length; i++) {
            var _c = _ca[i];
            while (_c.charAt(0) === ' ') {
                _c = _c.substring(1);
            }
            if (_c.indexOf(_name) === 0) {
                _value = _c.substring(_name.length, _c.length);
                _value = _u.json_parse(_value);
                return _value;
            }
        }
        return;
    };
    
    _u.cookie.delete = function (_key) {
        document.cookie = _key + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    };
    
    // ------------------------------------------------------------------
    _.init();
    
    return _;
};

