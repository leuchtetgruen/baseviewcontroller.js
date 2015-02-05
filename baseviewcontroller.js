var Bindable = {
		bindTo : function(otherElem) {
				this.on("change", function(val) {
						otherElem.set(val);
				});

				var that = this;
				otherElem.on("change", function(val) {
						that.set(val);
				});
		},

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
								elem[fctName].apply(elem, arguments);
						};
				});

		},
};

var Valuable = function(elem) {
		var f = function() {
				return elem.val();
		};
		_.extend(f, Backbone.Events);
		_.extend(f, Bindable);

		f.set = function(val, dontTrigger) {
				elem.val(val);
				if (!dontTrigger) this.trigger("change", val);
		};
		f.get = function() {
				return elem.val();
		};

		elem.change(function(e) {
				f.trigger("change", elem.val());
		});

		f.element = elem;
		f.copyElementFunctions();

		return f;
};

var HTMLable = function(elem) {
		var f = function() {
				return elem.html();
		};
		_.extend(f, Backbone.Events);
		_.extend(f, Bindable);

		f.set = function(val, dontTrigger) {
				elem.html(val);
				if (!dontTrigger) this.trigger("change", val);
		};
		f.get = function() {
				return elem.html();
		};

		elem.change(function(e) {
				f.trigger("change", elem.html());
		});

		f.element = elem;
		f.copyElementFunctions();

		return f;
};

var TextView = Valuable;
var Slider = Valuable;
var ContentView = HTMLable;

var ViewTypes = {
		"textview" : TextView,
		"slider" : Slider,
		"contentview" : ContentView
};

var BaseViewController = Backbone.View.extend({
	/*
	 * This is the internal hide function that should also be called
	 * when overriding .hide()
	 * It calls the animateHide function and afterwars hides the
	 * element using the jQuery-hide function. If the doEmpty parameter
	 * is set to true it also empties the container element.
	 */
	_hide : function(doEmpty) {
			var that = this;
			this.animateHide(function() {
				that.$el.hide();
				if ((doEmpty == undefined) || (doEmpty)) that.$el.empty();
			});
	},

	/*
	 * This is the internal show function that should also be called
	 * when overriding .show()
	 * It assigns visibleViewController property to the window and
	 * calls the jquery-show function on the element. 
	 * Afterwars it puts the object in the foreground and calls .animateShow()
	 */
	_show : function() {
			window.visibleViewController = this;
			window.$el = this.$el;
			this.$el.show();
			this.$el.css("z-index", 1000);
			this.animateShow();
	},

	/*
	 * Animation of showing the viewcontrollers element.
	 * Only does something if the viewcontroller has a transition
	 * property specified.
	 * It then removes the animatable class and the visible class
	 * that might still be there and makes the object invisible
	 * without an animation by adding the invisible class (in the absence
	 * of the animatable class)
	 *
	 * After 50ms (dont ask me why this is necessary) it adds the animatable
	 * class again so css3-transitions will be visible and adds the
	 * visible class.
	 * After the animation is done it removes the invisible class and calls
	 * a callback if provided. The callback is also called when there is
	 * nothingto animate
	 */
	animateShow : function(callback) {
			if (this.hasAnimationProperty()) {
				visibleClass = this.getAnimationVisibleClass();
				invisibleClass = this.getAnimationInvisibleClass();

				// make invisible without animation
				this.$el.removeClass("animatable");
				this.$el.removeClass(visibleClass);
				this.$el.addClass(invisibleClass); 

				var that = this;
				window.setTimeout(function() {
						// make visible with animation
						that.$el.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){ 
								that.$el.removeClass(invisibleClass);
								that.$el.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd");
								if (callback) callback();
						});
						that.$el.addClass("animatable");
						that.$el.addClass(visibleClass);
				}, 50);
			}
			else if (callback) callback();
	},

	/*
	 * Animation of the hiding of the viewcontrollers element.
	 * Only does something if the viewcontroller has a transition
	 * property specified.
	 * It then removes the visible css class , adds the animatable css-class (which specifies 
	 * that transtion should take place etc.) and adds the invisible css class so the 
	 * animation will start.
	 * After the end of the animation or after not showing an animation the callbac will be
	 * called if it is provided.
	 */
	animateHide : function(callback) {
			if (this.hasAnimationProperty()) {
					visibleClass = this.getAnimationVisibleClass();
					invisibleClass = this.getAnimationInvisibleClass();


					var that = this;
					this.$el.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){ 
							if (callback) {
								callback();
							}
							that.$el.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd");
					});
					that.$el.removeClass(visibleClass);
					this.$el.addClass("animatable");
					this.$el.addClass(invisibleClass);
			}
			else if (callback) {
				callback();
			}
	},

	/*
	 * Checks wether or not the show
	 * and hide methods for this view
	 * controller should use visible
	 * css3 transitions
	 */
	hasAnimationProperty : function() {
			return (this.transition);
	},

	/*
	 * Returns the css class that should be used
	 * for displaying this item as visible in 
	 * the given transition
	 */
	getAnimationVisibleClass : function() {
			return "visible-" + this.transition;
	},

	/*
	 * Returns the css class that should be used
	 * for displaying this item as invisible in 
	 * the given transition
	 */
	getAnimationInvisibleClass : function() {
			return "invisible-" + this.transition;
	},

	/*
	 * You can override this function with your own
	 * hide function but remember to call 
	 * this._hide() within your code
	 */
	hide : function() {
			this._hide();
	},

	/*
	 * You can override this function with your own
	 * show function but remember to call
	 * this._show() within your code
	 */
	show : function() {
			this._show();
	},

	/*
	 * Render function fetches template from URL 
	 * and fills it with given values from the values
	 * object (using the _.template mechanism).
	 *
	 * It then injects the views into the viewcontroller
	 * and calls the show function.
	 * After being done it calls the given callback and
	 * the doneRendering-function of the viewcontroller
	 * (both only if provided)
	 */
	_render : function(url, values, callback) {
			$.ajaxSetup({
					// Disable caching of AJAX responses
					cache: false
			});
			that = this;
			$.get(url, function(data) {
					rendered_html_fct = _.template(data);
					rendered_html = rendered_html_fct(values || {});
					that.$el.html(rendered_html);
					that.$el.ready(function() {
							that.injectViews(that.$el);
					});
					that.show();
					if (callback) callback(data);
					if (that.doneRendering && (typeof(that.doneRendering)=="function")) that.doneRendering(data);
			});

	},

	/*
	 * Recursive function. Calls injectView on the root 
	 * element and then calls itself on all its children()
	 */
	injectViews : function(root) {
			this.injectView(root);

			var children = $(root).children();
			if (children.length > 0) {
					for (var i=0; i < children.length; i++) {
						var child = $(children[i]);
						this.injectViews(child);
					}
			}
	},

	/*
	 * Injects views that have certain view-type attributes into
	 * the viewcontroller as properties
	 */
	injectView : function(elem) {
			if (!elem.attr("id")) return;

			var viewType = elem.attr("view-type");

			/*
			 * Use the ViewType lookup dictionary to inject
			 * the elements into the ViewController.
			 * This works as the views are actually constructor like functions.
			 * and are therefore NOT to be instantiated with the new keyword.
			 */
			for (var vType in ViewTypes) {
					if (viewType == vType) {
							this[elem.attr("id")] = ViewTypes[vType].call(this, elem);
					}
			}
	},
});
