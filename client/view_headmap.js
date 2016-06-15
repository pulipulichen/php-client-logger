if (typeof(PCL_LIB) === "undefined") {PCL_LIB = [];}
PCL_LIB.push(function (_) {
    _.view_headmap = {};
    
    _.view_headmap.instance;
    
    _.view_headmap.init = function () {
        // create instance
        _.view_headmap.instance = h337.create({
          container: document.body,
          radius: 90
        });
        return this;
    };
    
    _.view_headmap.display_mousemove_live = function () {
        
        var _last_timestamp;
        
        var _url = _.config.server + "log/get/mouse/move/heatmap/live";
        
        var _next = function () {
            if (_.log._sending_data === true) {
                setTimeout(function () {
                    _loop();
                }, 1000);
                return false;
            }
            return true;
        };
        
        var _looping = false;
        
        var _loop = function () {
            
            
            var _data = {};
            if (_last_timestamp !== undefined) {
                _data.min_timestamp = _last_timestamp;
            }
            
            $.getJSON(_url, _data, function (_data) {
                var _data_point_array = {
                    max: 5,
                    data: []
                };
                for (var _i = 0; _i < _data.length; _i++) {
                    _data_point_array.data.push({
                        x: _data[_i][0],
                        y: _data[_i][1],
                        value: 1
                    });
                }
                
                _.view_headmap.instance.setData(_data_point_array);

                //$(document).click(function () {
                //    _.view_headmap.instance.setData({data: []});
                //});
                
                _last_timestamp = _.u.get_timestamp() - 30000;
                
                setTimeout(function () {
                    _loop();
                }, 1000);
            });
        };
        
        _loop();
        //$(document).mousemove(_loop());
        //}, 1000);
            
    };
    
    _.view_headmap.display_movestay = function () {
        
        var _url = _.config.server + "log/get/mouse/move_stay/heatmap";
        
        $.getJSON(_url, function (_data) {
            var _data_point_array = {
                max: 50,
                data: []
            };
            for (var _i = 0; _i < _data.length; _i++) {
                _data_point_array.data.push({
                    x: _data[_i][0],
                    y: _data[_i][1],
                    value: 1
                });
            }
            _.u.t(_data_point_array);
            _.view_headmap.instance.setData(_data_point_array);

        });
        return this;
    };
    
    _.view_headmap.clear = function () {
        _.view_headmap.instance.setData({data: []});
    };
});