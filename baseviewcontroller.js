var Valuable = function(elem) {
		var f = function() {
				return elem.val();
		};
		_.extend(f, Backbone.Events);

		f.set = function(val) {
				elem.val(val);
				this.trigger("change", val);
		};
		f.get = function() {
				return elem.val();
		};

		elem.change(function(e) {
				f.trigger("change", elem.val());
		});

		return f;
};

var TextView = Valuable;
var Slider = Valuable;



var BaseViewController = Backbone.View.extend({
	_hide : function(doEmpty) {
			var that = this;
			this.animateHide(function() {
				that.$el.hide();
				if ((doEmpty == undefined) || (doEmpty)) that.$el.empty();
			});
	},

	_show : function() {
			window.visibleViewController = this;
			window.$el = this.$el;
			this.$el.show();
			this.$el.css("z-index", 1000);
			this.animateShow();
	},

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

	hasAnimationProperty : function() {
			return (this.transition);
	},

	getAnimationVisibleClass : function() {
			return "visible-" + this.transition;
	},

	getAnimationInvisibleClass : function() {
			return "invisible-" + this.transition;
	},

	hide : function() {
			this._hide();
	},

	show : function() {
			this._show();
	},

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
			});

	},

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

	injectView : function(elem) {
			if (!elem.attr("id")) return;

			var viewType = elem.attr("view-type");
			if (viewType == "textview") {
					this[elem.attr("id")] = TextView(elem);
			}
			else if (viewType == "slider") {
					this[elem.attr("id")] = TextView(elem);
			}
	},
});
