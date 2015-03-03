var BaseViewFunctions = {
		/* 
		 * Bind one view to another so changes in one
		 * will be reflected in the other immediatly.
		 */
		bindTo : function(otherElem) {
				this.on("change", function(val) {
						otherElem.set(val);
				});

				var that = this;
				otherElem.on("change", function(val) {
						that.set(val);
				});
		},

		/*
		 * This function copies functions already present
		 * for the element to the view. These are e.g.
		 * jQuery functions.
		 * So you can e.g. on call .css("color", "red") on a
		 * ContentView instead of having to refer to the the 
		 * element of the contentView
		 */
		copyElementFunctions : function() {
				var that = this;
				var elem = this.element;

				/*
				 * Prepare list of functions to copy.
				 * They must meet the following criteria:
				 * - They are functions (obviously)
				 * - They are not present in the object already (dont override)
				 */ 
				var fcts = [];
				for (var key in elem) {
						if ((typeof(elem[key]=="function")) && (typeof(this[key])=="undefined")) {
								   fcts.push(key);
						}
				}

				/*
				 * Make new functions in this object and make them
				 * call the original functions on the elem object
				 */
				_.each(fcts, function(fctName) {
						that[fctName] = function() {
								return elem[fctName].apply(elem, arguments);
						};
				});

		},

		getClassByName : function(name) {
				if (name.match(/[A-Za-z0-9]+/)) {
					return eval(name);
				}
				else return null;
		},
};

/*
 * The general view mechanism goes like this:
 *
 * Views-constructors are functions that take an
 * element and return a function themselves.
 *
 * The returned function acts as a getter on the content
 * of the view (e.g. the text in a textfield)
 *
 * As functions are just "objects" and can also have properties
 * the returned function has several functions of itself.
 * These are set and get functions for manipulating and
 * reading the view content.
 * The Backbone.Events object is also mixed into the returned function
 * so it can react to changes. And the BaseViewFunctions indable object is mixed in.
 *
 * A change in the element will trigger a change event on the object.
 *
 * See the comments in BaseModel.js for learning how to easily use views
 * as properties in models.
 */


/* 
 * Valuables are Views that present their content via the jQuery val(...)-Function.
 * Other than that read the general comment on views above to learn more on how this
 * works
 */
var Valuable = function(elem, vc, mixins) {
		var f = function() {
				return elem.val();
		};
		_.extend(f, Backbone.Events);
		_.extend(f, BaseViewFunctions);
		if (mixins) _.extend(f, mixins);

		f.set = function(val, dontTrigger) {
				elem.val(val);
				if (!dontTrigger) this.trigger("change", val);
		};
		f.get = function() {
				return elem.val();
		};
		f.toString = function() {
				return "Valuable based on #" + $(elem).attr("id") + " => " + this.get();
		};

		elem.change(function(e) {
				f.trigger("change", elem.val());
		});

		f.element = elem;
		f.copyElementFunctions();
		f.attachedViewController = vc;

		return f;
};

/*
 * HTMLables are views that present their content via the jQuery html(...)-function.
 * Other than that read the general comment on views above to learn more on how this
 * works
 */
var HTMLable = function(elem, vc, mixins) {
		var f = function() {
				return elem.html();
		};
		_.extend(f, Backbone.Events);
		_.extend(f, BaseViewFunctions);
		if (mixins) _.extend(f, mixins);

		f.set = function(val, dontTrigger) {
				elem.html(val);
				if (!dontTrigger) this.trigger("change", val);
		};
		f.get = function() {
				return elem.html();
		};
		f.toString = function() {
				return "HTMLable based on #" + $(elem).attr("id") + " => " + this.get();
		}


		// For content editable
		elem.on("blur", function(e) {
				f.trigger("change", elem.html());
		});

		// For other kinds of changes
		elem.on("DOMCharacterDataModified", function(e) {
				if (elem.attr("contenteditable")!="true") {
					f.trigger("change", elem.html());
				}
		});

		f.element = elem;
		f.copyElementFunctions();
		f.attachedViewController = vc;

		return f;
};

var Container = function(elem, vc, mixins) {

		var f = function() {
				return this.childViews;
		};
		f.childViews = _.map($(elem).children(), function(child) {
				var childView = vc.injectView($(child));
				childView.parentContainer = f;
				return childView;
		});
		_.extend(f, Backbone.Events);
		_.extend(f, BaseViewFunctions);
		if (mixins) _.extend(f, mixins);

		f.get = function() {
			return this.childViews;
		};
		f.append = function(view) {
				this.childViews.push(view);
				elem.append(view.element);
				view.parentContainer = this;
		};
		f.resetChildren = function() {
				_.each(this.childViews, function(child) {
						$(child.element).remove();
				});
				this.childViews = [];
		};
		f.toString = function() {
				return "Container based on #" + $(elem).attr("id") + " => [" + _.map(this.childViews, function(c) {
						return c.toString();
				}) + "]";
		}

		f.element = elem;
		f.copyElementFunctions();
		f.attachedViewController = vc;

		return f;
}

/*
 * Define the different classes of views
 * that might be extended with different
 * functions later.
 */
var ContentView = function(elem, vc, mixins) {
	
		var myMixins = {
				initialize : function() {
						this._setContentAccordingToViewFillWith();
				},
				updateContents : function() {
						this._setContentAccordingToViewFillWith();
				},

				_setContentAccordingToViewFillWith : function() {
						var viewFillWith = $(this.element).attr("view-fill-with");

						if (viewFillWith && vc[viewFillWith]) {
								viewFillWithResult = vc[viewFillWith];

								if (typeof(viewFillWithResult)=="function") {
									this.set(viewFillWithResult.apply(vc));
								}
								else {
									this.set(viewFillWithResult);
								}
						}
				},
		};

		mergedMixins = _.extend(mixins || {} , myMixins);
		return HTMLable(elem, vc, mergedMixins);
};

/* And assign them to their markup keywords in the
 * view-type attribute of each html element in a 
 * template
 */
var ViewTypes = {
		"contentview" : ContentView,
		"container" : Container,
};
