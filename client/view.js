if (typeof(PCL_LIB) === "undefined") {PCL_LIB = [];}
PCL_LIB.push(function (_) {
    // 檢視模式
    
    _.view = {};
    
    _.view.start = function () {
        
        var _scripts = [
            _.config.server + "client/lib/heatmap/heatmap.min.js"
        ];
        
        var _styles = [
            _.config.server + "client/lib/heatmap/heatmap.css"
        ];
        
        _.u.load_script(_scripts, function () {
            _.u.load_style(_styles, function () {
                _.view_headmap.init();
                _.view_headmap.display_mousemove_live();
                //_.view_headmap.display_movestay();
            });
        });
    };
});