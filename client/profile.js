if (typeof(PCL_LIB) === "undefined") {PCL_LIB = [];}
PCL_LIB.push(function (_) {
    
    _.vars.profile = {
        profile_name: undefined,
        uuid: undefined
    };
    
    _.profile = {};
    /**
     * @param {type} _name
     * @returns {$pcl}
     */
    _.profile.set_name = function (_name) {
        _.log.store();
        _.vars.profile.profile_name = _name + "";
        _.u.cookie.set("profile", _.vars.profile);
        _.log.add("profile.set_name", _name);
        return this;
    };
    
    _.profile.set_default_name = function (_name) {
        _.vars.profile.profile_name = _name;
        _.u.cookie.set("profile", _.vars.profile);
        return this;
    };
    
    _.profile.set_uuid = function (_uuid) {
        _.vars.profile.uuid = _uuid;
        _.u.cookie.set("profile", _.vars.profile);
        return this;
    };
    
    
    _.profile.load = function () {
        _.vars.profile = _.u.cookie.get("profile");
        if (typeof(_.vars.profile) !== "object") {
            _.vars.profile = {};
        }
        if (typeof(_.vars.profile.uuid) !== "string") {
            _.profile.set_uuid(_.u.create_uuid());
        }
        
        if (typeof(_.vars.profile.proflie_name) !== "string" && typeof(_.config.profile_name) === "string") {
            _.profile.set_default_name(_.config.profile_name);
        }
        
        if (_.profile.profile_name === undefined && _.config.auto_prompt_profile_name === true) {
            var _profile_name = window.prompt("請問您的座號");
            _.profile.set_name(_profile_name);
        }
        return this;
    };
    
    return this;
});