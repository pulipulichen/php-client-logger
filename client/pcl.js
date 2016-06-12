/**
 * 主程式
 * @param {JSON} _config
 * @author 20160611 Pulipuli Chen
 * @returns {$pcl}
 */
$pcl = function (_config) {
    
    var _ = this;
    
    //var _store_queue = [];
    
    _.vars = {};
    _.config = _config;
    
    // -----------------------------------------------------------------
    // 載入拆開的程式碼
    for (var _i = 0; _i < PCL_LIB.length; _i++) {
        PCL_LIB[_i](_);
    }
    
    // ------------------------------------------------------------------
    _.init();
    
    return _;
};

