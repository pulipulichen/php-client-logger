if (typeof(PCL_LIB) === "undefined") {PCL_LIB = [];}
PCL_LIB.push(function (_) {
    
    _.u = {};
    
    /**
     * 暫存區
     * @type {Object}
     */
    var _tmp = {};
    
    /**
     * 設定檔調整，載入預設值
     * @author 20160611 Pulipuli Chen
     * @returns {$pcl._.default_config|JSON|Function|_.init}
     */
    _.u.setup_config = function () {
        if (_.config === undefined || typeof(_.config) !== "object") {
            return _.default_config;
        }
        
        for (var _key in _.default_config) {
            if (typeof(_.config[_key]) === "undefined") {
                _.config[_key] = _.default_config[_key];
            }
        }
        
        return _.config;
    };
    
    /** 
     * 負責載入jQuery
     * @param {function} _callback
     * @returns {$pcl._u}
     */
    _.u.load_jquery = function (_callback) {
        if (typeof($) === "function") {
            $(function () {
                _.u.trigger_callback(_callback);
            });
        }
        else if (typeof(jQuery) === "function") {
            $ = jQuery;
            $(function () {
                _.u.trigger_callback(_callback);
            });
        }
        else {
            
            if (typeof(_tmp.loading_jquery) === "undefined") {
                var _script = document.createElement('script');
                _script.type = 'text/javascript';
                var _url = _.config.server + "client/lib/jquery/jquery-1.12.4.min.js";
                _script.src = _url;

                document.getElementsByTagName('head')[0].appendChild(_script);

                _tmp.loading_jquery = true;
            }
            
            setTimeout(function () {
                _.u.load_jquery(_callback);
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
    _.u.trigger_callback = function (_callback, _parameter1, _parameter2, _parameter3) {
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
    _.u.t = function (_title, _message) {
        if (_message === undefined) {
            _message = _title;
        }
        else {
            _message = "[" + _title + "] " + _.u.stringify(_message);
        }
        console.trace(_message);
        return this;
    };
    
    /**
     * 建立UUID
     * @returns {String}
     */
    _.u.create_uuid = function () {
        var _fingerprint = new Fingerprint().get();
        _fingerprint = _fingerprint + _.u.get_timestamp();
        _fingerprint = _.u.int_to_letters(_fingerprint);
        return _fingerprint;
    };
    
    /**
     * 壓縮字串
     * @param {type} _int
     * @returns {String|$pcl._.u.int_to_letters._code}
     */
    _.u.int_to_letters = function (_int) {
        var _code = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$-_.+!*()".split("");
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
     * @returns {_.config.log_day_offset|Number}
     */
    _.u.get_timestamp = function (_offset) {
        var _timestamp = (new Date()).getTime();

        if (_.config.log_day_offset !== 0) {
            _timestamp = _timestamp + _.config.log_day_offset * 24 * 60 * 60 * 1000;
        }
        
        if (typeof (_offset) === "number") {
            _timestamp = _timestamp + _offset * 24 * 60 * 60 * 1000;
        }

        return _timestamp;
    };
    
    _.u.json_parse = function (_json) {
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
    
    _.u.stringify = function (_value) {
        var _type = typeof(_value);
        if (_value === undefined || _value === null) {
            //_.u.t("無資料");
            return _value;
        }
        else if (_type === "object") {
            //_.u.t("轉換");
            return JSON.stringify(_value);
        }
        else {
            //_.u.t("什麼類型呢？" + _type);
            return _value;
        }
    };
    
    _.u.cookie = {};
    
    _.u.cookie.set = function (_key, _value) {
        var d = new Date();
        d.setTime(d.getTime() + (_.config.cookie_expires_day * 24 * 60 * 60 * 1000));
        var expires = "expires="+ d.toUTCString();
        _value = _.u.stringify(_value);
        _.u.t(_value);
        document.cookie = _key + "=" + _value + "; " + expires + "; path=" + _.config.cookie_path;
    };
    
    _.u.cookie.get = function (_key) {
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
                _value = _.u.json_parse(_value);
                return _value;
            }
        }
        return;
    };
    
    _.u.cookie.delete = function (_key) {
        document.cookie = _key + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    };
    
    _.u.get_xpath = function ( _element ) {
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
    
    _.u.get_aoi = function (_element) {
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
    
    _.u.get_pos = function(_el) {
        if (typeof(_el.get) === "function") {
            _el = _el.get(0);
        }
        // yay readability
        for (var _lx=0, _ly=0;
             _el !== null;
             _lx += _el.offsetLeft, _ly += _el.offsetTop, _el = _el.offsetParent);
        return {x: _lx,y: _ly};
    };
    
    _.u.query_string = function () {
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
      
    _.u.load_script = function (_scripts, _callback) {
        if (typeof(_scripts) === "string") {
            _scripts = [_scripts];
        }
        //_.u.t("如何？");
        var _loop = function (_i) {
            if (_i === _scripts.length) {
                //_.u.t("跳出囉");
                _.u.trigger_callback(_callback);
                return;
            }
            
            var _url = _scripts[_i];
            //_.u.t(_url);
            $.getScript(_url, function () {
                _i++;
                _loop(_i);
            });
        };
        _loop(0);
        return this;
    };
    
    _.u.load_style = function (_styles, _callback) {
        if (typeof(_styles) === "string") {
            _styles = [_styles];
        }
        for (var _i = 0; _i < _styles.length; _i++) {
            var _url = _styles[_i];
            $('<link rel="stylesheet" type="text/css" href="' + _url + '">').appendTo("head");
        }
        _.u.trigger_callback(_callback);
    };
    
}); //PCL_LIB.push(function (_) {
