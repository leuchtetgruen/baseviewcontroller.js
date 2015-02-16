/*
 * BaseModel is an extension of the Backbone Models that
 * works well together with the injected views from
 * BaseViewController. 
 * In order for that to work and for your own convenience
 * it also allows to treat functions like attributes.
 * Functions that dont require parameters are treated like
 * attributes and are therefore included in the toJSON
 * and can be requested via .get (but of course not be set via .set)
 */
var BaseModel = Backbone.Model.extend({

		/*
		 * Overriden getter. This one also treats functions
		 * without parameters as attributes.
		 */
		get: function (attr) {
				if ((typeof(that[attr])=="function") && that[attr].toString().match(/function.\(\)/)) {
						return this[attr]();
				}
				else {
						return Backbone.Model.prototype.get.call(this, attr);
				}
		},

		/*
		 * This function binds a view (see the views in BaseViewController.js for more info)
		 * as an attribute. So you can e.g. attach a textfield as a property of a model. So once
		 * the content of the textfield changes the property of the model also changes.
		 */
		bindView : function(attr, view, save) {
				this[attr] = view;
				var that = this;
				view.set(this.get(attr));
				view.on("change", function() {
						that.set(attr, view());
				});
				this.on("change:" + attr, function(model,value) {
						// change the value in the view as well but dont trigger another change event
						view.set(value);
						if (save) model.save();
				});
		},

		/*
		 * This is an internal function that lists all the attributes that are there
		 * already (as provided by Backbone.Model) as well as those that are provided
		 * as a function without a parameter
		 */
		_attributes : function() {
				var withoutAttrs = ["constructor"].concat(_.keys(Backbone.Model.prototype)).concat(_.keys(Backbone.Model));
				var nativeAttrs = _.keys(this.attributes);

				var myAttrs = _.keys(this.__proto__);
				var that = this;
				var myFctAttrs = _.filter(myAttrs, function(attr) {
						// return functions without arguments
						return (
								typeof(that[attr]=="function") && 
								that[attr].toString().match(/function.\(\)/)
								);
				});
				return _.difference(nativeAttrs.concat(myFctAttrs), withoutAttrs);
		},

		/*
		 * Overrides the toJSON-function that Backbone.Model already provides.
		 * This one also includes the parameters that are there as functions
		 * without parameters.
		 */
		toJSON : function() {
				var ret = {};
				var attrs = this._attributes();
				for (i in attrs) {
						attr = attrs[i];
						ret[attr] = this.get(attr);
				}
				return ret;
		},
});
