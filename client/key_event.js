if (typeof(PCL_LIB) === "undefined") {PCL_LIB = [];}
PCL_LIB.push(function (_) {
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
        var _xpath = _.u.get_xpath(_event);
        if (_xpath !== "/html/body") {
            _log.xpath = _xpath;
        }
        _.log.add(_log);
        return this;
    };
    
    _.key_event.form_onchange = function (_event) {
        var _log = {
            event: "key_event.form_onchange",
            xpath: _.u.get_xpath(_event)
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
});