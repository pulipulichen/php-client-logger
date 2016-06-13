if (typeof(PCL_LIB) === "undefined") {PCL_LIB = [];}
PCL_LIB.push(function (_) {
    
    _.default_config = {
        
        /**
         * @type {Boolean} 檢視模式
         * ?pcl_view_mode=true
         */
        view_mode: true,
        
        /**
         * @type {Boolean} 是否自動開始記錄
         * ?pcl_log_start=true
         */
        log_start: true,
        
        /**
         * @type {Boolean} 自動跳出來設定profile_name
         */
        auto_prompt_profile_name: true,
        
        /**
         * @type {String} 伺服器的位置
         */
        server: "/php-client-logger/",
        
        /**
         * @type {Number} 要儲存的資料量
         */
        log_queue_length: 10,
        
        
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
        mouse_stay_interval: 1000
    };
});