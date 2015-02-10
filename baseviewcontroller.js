// -------------------------------------------------


/*
 * BaseViewController is an extension of Backbone.View that
 * acts as a real view controller. It features
 * - Injection of views as objects
 * - Animations / Transitions of views
 *
 */
var BaseViewController = Backbone.View.extend({


	/*
	 * This is a method to transition to another view
	 * controller. You need to pass the element the view
	 * controllers content will be rendered in.
	 * You can also pass additional data that the new
	 * view controller will work with.
	 */
	transitionTo : function(ViewControllerClass, element, data) {
			this.hide(true);
			if (data) {
					var MixedVcClass = ViewControllerClass.extend(data);
			}
			new MixedVcClass({ el : element});
	}, 

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
	hide : function(doEmpty) {
			this._hide(doEmpty);
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
							that.injectViews(that.$el, 0);
					});
					that.show();
					if (callback) callback(data);
					if (that.doneRendering && (typeof(that.doneRendering)=="function")) that.doneRendering(data);
			});

	},

	/*
	 * Recursive function. Calls injectView on the root 
	 * element and then calls itself on all its children()
	 *
	 * Then calls the delegateEvents function again to 
	 * delegate events specified in injected views
	 */
	injectViews : function(root, level) {
			if (level > 5) return;

			this.injectView(root);

			var children = $(root).children();
			if (children.length > 0) {
					for (var i=0; i < children.length; i++) {
						var child = $(children[i]);
						this.injectViews(child, level + 1);
					}
					this.delegateEvents();
			}
	},

	/*
	 * Injects views that have certain view-type attributes into
	 * the viewcontroller as properties
	 */
	injectView : function(elem) {
			if (!elem.attr("id")) return;
			if (this[elem.attr("id")]) return;  // This element already exists


			var viewType = elem.attr("view-type");

			/*
			 * Use the ViewType lookup dictionary to inject
			 * the elements into the ViewController.
			 * This works as the views are actually constructor like functions.
			 * and are therefore NOT to be instantiated with the new keyword.
			 */
			for (var vType in ViewTypes) {
					if (viewType == vType) {
							var view = ViewTypes[vType].apply(ViewTypes[vType], [elem, this]);
							if (view.initialize) {
									view.initialize();
							}

							this[elem.attr("id")] = view;

							this.parseEvents(elem);
							return view;
					}
			}
	},


	/*
	 * Called when a view is injected. This will also put
	 * the events described in the view-events attribute
	 * into events hash of the object, which is then evaluated
	 * by backbone.js
	 *
	 * The syntax of this element is 'event : methodName'
	 * e.g. 'click  : tab1Clicked'
	 */
	parseEvents : function(elem) {
			if (!elem.attr("view-events")) return;

			if (!this.events) {
				this.events = {};
			}

			var that = this;
			var viewEvents = elem.attr("view-events").split(",");
			_.each(viewEvents, function(eventString) {
					var splitted = eventString.split(":");
					if (splitted.length == 2) {
							var fullEventSelector = splitted[0] + " #" + elem.attr("id");
							that.events[fullEventSelector] = splitted[1].trim();
					}
			});
	},
});
