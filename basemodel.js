var BaseModel = Backbone.Model.extend({
		get: function (attr) {
				if (typeof this[attr] == 'function') {
						return this[attr]();
				}
				return Backbone.Model.prototype.get.call(this, attr);
		},

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
