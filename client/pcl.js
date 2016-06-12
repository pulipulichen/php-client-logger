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
         * @type {Number} 要儲存的資料量
         */
        log_queue_length: 100,
        
        /**
         * @type {Boolean} 是否自動開始記錄
         */
        log_start: true,
        
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
        
        /**
         * @type {String} 預設儲存的名字
         */
        profile_name: undefined,
        
        /**
         * @type {Boolean} 是否啟用滑鼠事件
         */
        enable_mouse_event: true,
        
        /**
         * @type {Boolean} 是否啟用視窗事件
         */
        enable_window_event: true,
        
        /**
         * @type {Boolean} 是否啟用鍵盤事件
         */
        enable_key_event: true,
        
        enable_aoi_map: true,
        
        enable_url_query: true,
        
        /**
         * 偵測停留時間，單位是毫秒
         */
        mouse_stay_interval: 1000,
        
        view_mode: false
    };
    
    var _log_queue = [];
    //var _store_queue = [];
    
    var _profile = {
        name: undefined,
        uuid: undefined
    };
    
    // ------------------------------------------------------------------
    
    
    _.init = function () {
        _config = _u.setup_config();
        
        _u.load_jquery(function () {
            _.init_log_lib(function () {
                

                // 開場先把profile設定好
                //_.set_profile_uuid(_u.create_uuid());
                _.profile.load();
                
                if (_config.log_start === true 
                        || _u.query_string.pcl_log_start === "true") {
                    //_u.t("已經讀取完成囉");
                    _.start();
                }
                
                if (_config.view_mode === true 
                        || _u.query_string.pcl_view === "true") {
                    _.view.start();
                }
            });
        });
        return this;
    };
    
    _.start = function () {
        _.log.add("start");
        if (_config.enable_mouse_event === true) {
            _.mouse_event.init();
        }
        if (_config.enable_window_event === true) {
            _.window_event.init();
        } 
        if (_config.enable_key_event === true) {
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
        var _url = _config.server + "client/lib/fingerprint/fingerprint.min.js";
        _u.load_script(_url, _callback);
        return this;
    };
    
    
    
    // ------------------------------------------------------------------
    
    _.profile = {};
    
    /**
     * @param {type} _name
     * @returns {$pcl}
     */
    _.profile.set_name = function (_name) {
        _.log.store();
        _profile.name = _name;
        _u.cookie.set("profile", _profile);
        _.log.add("profile.set_name", _name);
        return this;
    };
    
    _.profile.set_default_name = function (_name) {
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
        
        if (typeof(_profile.name) !== "string" && typeof(_config.profile_name) === "string") {
            _.profile.set_default_name(_config.profile_name);
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
            _log.timestamp = _u.get_timestamp();
        }
        
        _u.t("log", _log);
        
        _log_queue.push(_log);
        
        // 如果太多，則送到伺服器
        if (_log_queue.length > _config.log_queue_length - 1) {
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
        if (_log_queue.length === 0) {
            return this;
        }
        
        // 1. 先把原本的log_queue丟到store_queue
        var _store_queue = _log_queue;
        
        // 2. 清空log_queue
        _log_queue = [];
        
        // 3. 準備傳送資料
        var _url = _config.server + "server/log/set";
        var _data = {
            profile: _u.stringify(_profile),
            logs: _u.stringify(_store_queue)
        };
        
        if (_.aoi_map.stored === false && _config.enable_aoi_map === true) {
            _data.aoi_map = _u.stringify(_.aoi_map.locate());
            _.aoi_map.stored = true;
        }
        
        //_u.t("_.log.store() 要儲存囉");
        if (_async !== false) {
            $.post(_url, _data);
        }
        else {
            $.ajax({
                type: "POST",
                async: false,
                url: _url,
                data: _data
            });
        }
        
        return this;
    };
        
    // -----------------------------------------------------------------
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
        var _current_timestamp = _u.get_timestamp();
        if (_.mouse_event.move_stay_last_timestamp === undefined) {
            _.mouse_event.move_stay_update(_event, _current_timestamp);
        } else if (_current_timestamp - _.mouse_event.move_stay_last_timestamp > _config.mouse_stay_interval) {
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
            xpath: _u.get_xpath(_event)
        };
        
        var _aoi = _u.get_aoi(_event);
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
            xpath: _u.get_xpath(_event)
        });
        return this;
    };
    
    // ------------------------------------------------------------------
    
    _.key_event = {};
    
    _.key_event.init = function () {
        // 用change就好啦，不要用keypress啦
        //$(document).keypress(function (_event) {
        //    _.key_event.keypress(_event);
        //});
        
        $("input, textarea").change(function(_event) {
            _.key_event.form_onchange(_event);
        });
    };
    
    _.key_event.keypress = function (_event) {
        var _log = {
            event: "key_event.keypress",
            note: _event.which
        };
        var _xpath = _u.get_xpath(_event);
        if (_xpath !== "/html/body") {
            _log.xpath = _xpath;
        }
        _.log.add(_log);
        return this;
    };
    
    _.key_event.form_onchange = function (_event) {
        var _log = {
            event: "key_event.form_onchange",
            xpath: _u.get_xpath(_event)
        };
        var _note = {};
        var _element = $(_event.target);
        
        var _name = _element.attr("name");
        if (_name !== undefined) {
            _note.name = _name;
        }
        _note.value = _element.val();
        
        var _type = _element.attr("type");
        if (_type === "checkbox" || _type === "radio") {
            _note.checked = _element.attr("checked");
        }
        _log.note = _note;
        _.log.add(_log);
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
        //_u.t("捲動");
        return this;
    };
    
    // ------------------------------------------------------------------
    
    _.aoi_map = {};
    
    _.aoi_map.locate = function () {
        var _aoi_data = {};
        
        // 找尋 [data-pcl-aoi]
        $("[data-pcl-aoi]").each(function (_index, _element) {
            _element = $(_element);
            var _aoi_name = _element.attr("data-pcl-aoi");
            if (typeof(_aoi_data[_aoi_name]) === "undefined") {
                _aoi_data[_aoi_name] = [];
            }
            var _pos = _u.get_pos(_element);
            var _width = _element.width();
            var _height = _element.height();
            _aoi_data[_aoi_name].push({
                lt: [_pos.x, _pos.y],  //左上
                rt: [_pos.x + _width, _pos.y],  //右上
                lb: [_pos.x, _pos.y + _height],  //左下
                rb: [_pos.x + _width, _pos.y + _height]  //右下
            });
        });
        
        //_u.t(_aoi_data);
        return _aoi_data;
    };
    
    _.aoi_map.stored = false;
    
    // ------------------------------------------------------------------
    // 檢視模式
    
    _.view = {};
    
    _.view.start = function () {
        
        var _scripts = [
            _config.server + "client/lib/heatmap/heatmap.min.js"
        ];
        
        _u.load_script(_scripts, function () {
            _.view.headmap_display();
        });
    };
    
    _.view.headmap_display = function () {
        
        // create instance
        var heatmapInstance = h337.create({
          container: document.body,
          radius: 90
        });
        document.body.onclick = function(ev) {
          heatmapInstance.addData({
            x: ev.layerX,
            y: ev.layerY,
            value: 1
          });
        };
    };
    
    // ------------------------------------------------------------------
    // 工具模式
    
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
            _message = "[" + _title + "] " + _u.stringify(_message);
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
            //_u.t("無資料");
            return _value;
        }
        else if (_type === "object") {
            //_u.t("轉換");
            return JSON.stringify(_value);
        }
        else {
            //_u.t("什麼類型呢？" + _type);
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
    
    _u.get_xpath = function ( _element ) {
        if (typeof(_element.target) === "object") {
            _element = _element.target;
        }
        
        var _xpath = '';
        for ( ; _element && _element.nodeType === 1; _element = _element.parentNode )
        {
            var id = $(_element.parentNode).children(_element.tagName).index(_element) + 1;
            id > 1 ? (id = '[' + id + ']') : (id = '');
            _xpath = '/' + _element.tagName.toLowerCase() + id + _xpath;
        }
        return _xpath;
    };
    
    _u.get_aoi = function (_element) {
        if (typeof(_element.target) === "object") {
            _element = _element.target;
        }
        
        var _aoi;
        var _element = $(_element);
        if (_element.attr("data-pcl-aoi") !== undefined) {
            _aoi = $.trim(_element.attr("data-pcl-aoi"));
            if (_aoi !== "") {
                return _aoi;
            }
        }
        
        var _parent_element = _element.parents("[data-pcl-aoi]:first");
        if (_parent_element.length === 1) {
            _aoi = $.trim(_parent_element.attr("data-pcl-aoi"));
            if (_aoi !== "") {
                return _aoi;
            }
        }
    };
    
    _u.get_pos = function(_el) {
        if (typeof(_el.get) === "function") {
            _el = _el.get(0);
        }
        // yay readability
        for (var _lx=0, _ly=0;
             _el !== null;
             _lx += _el.offsetLeft, _ly += _el.offsetTop, _el = _el.offsetParent);
        return {x: _lx,y: _ly};
    };
    
    _u.query_string = function () {
        // This function is anonymous, is executed immediately and 
        // the return value is assigned to QueryString!
        var _query_string = {};
        var _query = window.location.search.substring(1);
        var _vars = _query.split("&");
        for (var _i=0;_i<_vars.length;_i++) {
            var _pair = _vars[_i].split("=");
                // If first entry with this name
            if (typeof _query_string[_pair[0]] === "undefined") {
                _query_string[_pair[0]] = decodeURIComponent(_pair[1]);
                // If second entry with this name
            } else if (typeof _query_string[_pair[0]] === "string") {
                var arr = [ _query_string[_pair[0]],decodeURIComponent(_pair[1]) ];
                _query_string[_pair[0]] = arr;
                // If third or later entry with this name
            } else {
                 _query_string[_pair[0]].push(decodeURIComponent(_pair[1]));
            }
        } 
        return _query_string;
    }();
      
    _u.load_script = function (_scripts, _callback) {
        if (typeof(_scripts) === "string") {
            _scripts = [_scripts];
        }
        //_u.t("如何？");
        var _loop = function (_i) {
            if (_i === _scripts.length) {
                //_u.t("跳出囉");
                _u.trigger_callback(_callback);
                return;
            }
            
            var _url = _scripts[_i];
            //_u.t(_url);
            $.getScript(_url, function () {
                _i++;
                _loop(_i);
            });
        };
        _loop(0);
        return this;
    };
    
    _u.load_style = function (_styles, _callback) {
        if (typeof(_styles) === "string") {
            _styles = [_styles];
        }
        for (var _i = 0; _i < _styles.length; _i++) {
            var _url = _styles[_i];
            $('<link rel="stylesheet" type="text/css" href="' + _url + '">').appendTo("head");
        }
        _u.trigger_callback(_callback);
    };
    
    // ------------------------------------------------------------------
    _.init();
    
    return _;
};

