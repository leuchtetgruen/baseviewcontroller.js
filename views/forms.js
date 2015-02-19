var TextView = Valuable;
var Slider = Valuable;

var Toggleable = function(elem, vc, mixins) {
		var f = function() {
				return elem.hasClass("toggleable-checked");
		};
		_.extend(f, Backbone.events);
		_.extend(f, BaseViewFunctions);
		if (mixins) _.extend(f, mixins);

		f.set = function(val, dontTrigger) {
				if (val) elem.addClass("toggleable-checked");
				else elem.removeClass("toggleable-checked");
				if (!dontTrigger) this.trigger("change", val);
		};
		f.get = function() {
				return elem.hasClass("toggleable-checked");
		};
		f.toggle = function(dontTrigger) {
				this.set(!this.get(), dontTrigger);
		};
		f.toString = function() {
			return "Toggleable based on #" + $(elem).attr("id") + " => " + this.get();
		};

		elem.click(function() {
				f.toggle();
		});

		elem.addClass("toggleable");

		f.element = elem;
		f.copyElementFunctions();
		f.attachedViewController = vc;

		return f;
};

//TODO write documentation
var ContentEditable = function(elem, vc, mixins) {
		var myMixins = {
				setEditable : function(editable) {
						$(elem).attr("contenteditable", editable);
				},
				isEditable : function() {
						return ( $(elem).attr("contenteditable")=="true" );
				},
		};

		mergedMixins = _.extend(mixins || {} , myMixins);
		return HTMLable(elem, vc, mergedMixins);
};

ViewTypes["textview"] = TextView;
ViewTypes["slider"] = Slider;
ViewTypes["toggleable"] = Toggleable;
ViewTypes["editable-content"] = ContentEditable;

