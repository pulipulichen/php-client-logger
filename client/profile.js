function profile(_) {
    
    _.profile = {};
    /**
     * @param {type} _name
     * @returns {$pcl}
     */
    _.profile.set_name = function (_name) {
        _.log.store();
        _.profile.name = _name;
        _.u.cookie.set("profile", _.vars.profile);
        _.log.add("profile.set_name", _name);
        return this;
    };
    
    _.profile.set_default_name = function (_name) {
        _.vars.profile.name = _name;
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
        
        if (typeof(_.vars.profile.name) !== "string" && typeof(_.config.profile_name) === "string") {
            _.profile.set_default_name(_.config.profile_name);
        }
        return this;
    };
    
    return this;
}