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
				if ((typeof(this[attr])=="function") && this[attr].toString().match(/function.\(\)/)) {
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
								elem[fctName].apply(elem, arguments);
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
var ContentView = HTMLable;

/* And assign them to their markup keywords in the
 * view-type attribute of each html element in a 
 * template
 */
var ViewTypes = {
		"contentview" : ContentView,
		"container" : Container,
};
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
			if (data && data['empty']) {
					_doHide = data['empty'];
					data = _.omit(data, 'empty');

			} 
			else _doHide = false;

			this.hide(_doHide);
			var extendedData = _.extend({
					fromViewController : this
			}, data);
			var MixedVcClass = ViewControllerClass.extend(extendedData);
			new MixedVcClass({ el : element});
	}, 

	/*
	 * This will transition back to the last view controller shown.
	 * It only works when the content of the element was not emptied or
	 * overwritten.
	 */
	transitionBack : function() {
			if (this.fromViewController) {
					this.hide();
					this.fromViewController.show();
			}
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
	 * You can provide an own render function if you want to load different templates
	 * within the same view controller.
	 * Otherwise you can just set the template_url property and this URL will be loaded
	 * when calling render();
	 */
	render : function() {
			if (!this.template_url) {
				console.error("no template_url property provided in the view controller");
				return;
			}
			else {
				this._render(this.template_url);
			}
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
			if (elem.attr("id") && this[elem.attr("id")]) return;


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

							if (elem.attr("id")) this[elem.attr("id")] = view;

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
							var fullEventSelector = splitted[0].trim() + " #" + elem.attr("id");
							that.events[fullEventSelector] = splitted[1].trim();
					}
			});
	},
});
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

// List views


//TODO write documentation
var CollectionsAdapter = {
				count : function() {
						return this._filteredCollection().length;
				},

				_filteredCollection : function() {
						if (this.filter) {
							var that = this;
							return this.collection.filter(function(obj) {
									return that.filter(obj);
							});
						}
						else {
							return this.collection.filter(function(obj) {
									return true;
							});
						}
				},
				build : function(idx) {
						if (this.buildItemFromModel) {
							return this.buildItemFromModel(this._filteredCollection()[idx]);
						}
						else {
							return $('<li>' + this._filteredCollection()[idx].toString() + "</li>");
						}
				},
				selectedItem : function(idx) {
						if (this.selectedItemFromModel) {
								this.selectedItemFromModel(this._filteredCollection()[idx]);
						}
				},
				setCollection : function(_collection) {
					this.collection = _collection;
					var that = this;
					_.each(["add", "remove","change"], function(evt) {
							that.collection.on(evt, function() {
									console.log(evt + " thrown");
									that.rebuildListView();
							});
					});
				},
				extend : function(extension) {
						return _.extend(_.clone(this), extension);
				},
};


var ListView = function(elem, vc, mixins) {
		var myMixins = {
				initialize : function() {
						$(this.element).addClass("listview");

						var adapterName = $(this.element).attr("view-adapter");
						if (adapterName) {
							var adapterClass = this.getClassByName(adapterName);
							if (adapterClass) {
								this.setAdapter(adapterClass);
							}
						}
				},
				setAdapter : function(_adapter) {
						this.adapter = _adapter;
						this.adapter.listView = this;
						this.adapter.attachedViewController = vc;

						var that = this;
						this.adapter.rebuildListView = function() {
								that.build();
						};
				},

				build : function() {
						if (!this.adapter) return null;
						if (!this.adapter.count) return null;
						if (!this.adapter.build) return null;

						var that = this;
						var clickHandlerProducer = function(idx) {
								return function() {
									that.adapter.selectedItem(idx);
								}
						};

						this.resetChildren();
						for (var i=0; i < this.adapter.count(); i++) {
								var elem = this.adapter.build(i);
								var lItem = new ListItem(elem, vc);
								lItem.initialize();

								if (this.adapter.selectedItem) {
									// I cannot write the handler directly in here
									// because i changes and not the value is bound
									// but the variable as a for loop is not a fct.
									//
									// Sometimes JS sucks
									lItem.click(clickHandlerProducer(i));
								}

								this.append(lItem);

								if (this.adapter.customizeListItem) {
									this.adapter.customizeListItem(lItem, i);
								}
						}
							
				},
		};
		mergedMixins = _.extend(mixins || {}, myMixins);
		return Container(elem, vc, mergedMixins);
};
var ListItem = function(elem, vc, mixins) {
		var myMixins = {
				initialize : function() {
					$(this.element).addClass("listitem");
				}
		};
		mergedMixins = _.extend(mixins || {}, myMixins);
		return HTMLable(elem, vc, mergedMixins);
};

ViewTypes["listview"] = ListView;
ViewTypes["listitem"] = ListItem;

// Tab functions
var TabView = function(elem, vc, mixins) {
		//TODO indicate active tabs
		var myMixins = {
				initialize : function() {
						$(this.element).addClass("tabview");

						var tabViewContentViewId = $(this.element).attr("tabview-content-view");
						if (tabViewContentViewId) {
								this.setContentElement($("#" + tabViewContentViewId));
						}
				},
				setContentElement : function(element) {
						this.contentElement = element;
				},
				loadDefaultTab : function() {
						this.childViews[0].click();
				},
		}
		mergedMixins = _.extend(mixins || {} , myMixins);
		return Container(elem, vc, mergedMixins);
};
var TabItem = function(elem, vc, mixins) {
		//TODO indicate active tabs
		var myMixins = {
				initialize : function() {
						$(this.element).addClass("tab");

						var vcName = $(this.element).attr("view-controller");
						if (vcName) {
								var vcClass = this.getClassByName(vcName);
								if (vcClass) {
										this.setViewController(vcClass);	
								}
						};
				},
				setViewController : function(viewControllerClass) {
						var that = this;
						this.click(function() {
								var children = $(that.parentContainer.element).children();
								for (var i=0; i< children.length; i++) {
										$(children[i]).removeClass("active-tab");
								}

								$(elem).addClass("active-tab");
								var MixedVcClass = viewControllerClass.extend({parentViewController : vc});
								new MixedVcClass({el : $(that.parentContainer.contentElement)});
						});
				}
		};
		mergedMixins = _.extend(mixins || {}, myMixins);
		return HTMLable(elem, vc, mergedMixins);

};

ViewTypes["tabview"] = TabView;
ViewTypes["tabitem"] = TabItem;
var BackLink = function(elem, vc, mixins) {
		var myMixins = {
				initialize : function() {
						$(this.element).click(function(e) {
								vc.transitionBack();
								e.preventDefault();
						});
				},
		};
		mergedMixins = _.extend(myMixins, mixins);
		return HTMLable(elem, vc, mergedMixins);
};

ViewTypes["backlink"] = BackLink;
