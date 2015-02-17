BaseViewController
==================

BaseViewController is the core component of the framework, after which it is also named. It links views and models,
thus providing the controller component in the ModelViewController paradigm.

Using the BaseViewController adds the possibility to provide transitions between view / screens, easy template loading and
using the view injection mechanism.

##Functions

###transitionTo(ViewControllerClass, element, data)

This will
	* Hide the current view controller (using the `hide` function)
	* will inject the data from the data hash into new ViewController
	* Instantiate the new ViewController class with the given `element` as `$el`

You can provide a `empty` boolean in the data hash and set it to true in order to empty the
element of the current view controller.

###transitionBack()

This will hide the current view controller and show the last view controller. This will of course only work
if the last view controller was not emptied. It will also not call `initialize` and thus `render` on the previous
view controller.


###_hide(doEmpty)

This function should only be called when overriding the `hide` method. It shows the hide animation (if any is provided via
the `transition`). If `doEmpty` is set to true it will empty the element of this view controller.

###_show()
This function should only be called when overriding the `show` method. It sets the `window.visibleViewController` to `this` and
sets the `window.$el` to the element of this view controller. It will call `show()` on the jQuery-Element and put the element
into the foreground (by setting its z-index). It will then show the animation for showing the view (if any is provided via the
`transition` property).

###animateShow() ,  animateHide() , hasAnimationProperty() , getAnimation[In]visibleClass()

The actual animation functions that show the show/hide animation of the view. These are not to be called from outside. This is
why I wont provide further information. If you want to read more see the source code and the lengthy comments in there.

###hide(doEmpty)

This function is called when the view should be hidden. It calls `_hide` by default but you can override this function. Remember to call `_hide(doEmpty)` yourself in this case.

###show()

This function is called when the view should be shown. It calls `_show` by default but you can override this function. Remember to call `_show()` yourself in this case.


###_render(url, values, callback)

This function will load a template from the given `url`. When loaded it will inject the values from the `values`-hash into the template using Underscores [_.template function](http://underscorejs.org/#template).

It sets the content of the view controllers element to the content of the template. After that it will inject the views included in
the template into the view controller. See `injectView`-function and the documentation on [BaseView](baseview.md) for more on that.

Afterwards it calls the `show` function of this view controller and calls the given `callback` function. If the view controller
has a `doneRendering`-function it will call this function and provide the loaded template as an argument.


###render()

This function calls the `_render` function with the provided `template_url` property if one is provided. You can and should override this function in case you want to provide additional data to the template or want to choose between different templates depending on the situation within the same view controller.


###injectViews(root, level)

This is part of the view injection mechanism. It will call `injectView` on the root element itself and then call itself on all
child elements. As this is recursive, it has to have a maximul level which in this case is set to 5.

###injectView(element)

This function will inject views that have a `view-type` attribute, that refers to one of the BaseViews into the view controller.
See the [Baseview documentation](baseview.md) to find out what a BaseView is. Using the id attribute of the element it will be
injected into the view controller as a property. So the following template-html would end up in the `myTextView` property of the view controller as a TextView-object, that could then also be bound to a attribute of a model. See [BaseModel documentation](basemodel.md)to read on how that works.

```html
	<input type="text" id="myTextView" view-type="textview" />
```

You can also event listeners directly in the html using the `view-events` attribute. They syntax here is a comma seperated list of eventnames (like click or change etc.) followed by a colon and the function name. This would be an example:

`click : reactOnClick, change : reactOnChange`

###parseEvents(elem)

This function parses the `view-events` attribute of the given element. It should only be called by the `injectView` function and is thus in depth described there.

##Properties

###template_url

This property describes where the template that should be rendered when the `render()` function is called should be rendered can be found.This only works when you don't override the `render` function yourself.

###transition

This property describes what animation to use when transitioning from one screen to another. If you want to use these transitions you should add the `screen` CSS class to the view-elements that form your screens. The following transitions are included:

* opacity 
* left (slide in/out)
* top (slide in/out)
* fold-top (fold the view to the top)
* fold-bottom (fold the view to the bottom)
* fold-left
* fold-right

They are defined in the `baseviewcontroller.css` file. Take a look there to see how you could implement your own transitions.

##General usage / example
Generally use a view controller just like you would use a [Backbone view](http://backbonejs.org/#View). Here's an example
of how to generally use a BaseViewController.

```javascript
var MyViewController = BaseViewController.extend({

		/*
		 * This template will be loaded when the
		 * render() function is called.
		 */
		template_url : "templates/myview.html",


		/*
		 * The graphical transition to use when showing
		 * or hiding the screen.
		 */
		transition : "fold-top",

		/*
		 * The events hash like it's described
		 * in the Backbone.View documentation.
		 * The syntax is:
		 * "event selector" :   "function name"
		 */
		events : {
				"click #editItem" : "editItem",
		},

		initialize : function() {
				// Initialize whatever you want to initialize

				/*
				 * Calling render() in the constructor
				 * is encouraged. The transitionTo
				 * method and others rely on it.
				 */
				this.render();
		},

		/*
		 * This function is called after the view was rendered and the
		 * views have been injected.
		 */
		doneRendering : function(data) {
				this.myTextView.set("This is a textview");
		},


		// An example function that loads another view
		editItem : function() {
				this.transitionTo(EditItem, $('#editItemScreen'), {item : this.item});
		},
});

$(document).ready(function() {
		var myVc = new MyViewController({ el : $('#myScreen')});
});
```

The corresponding HTML would have to look something like this:

```html
	<div id="myScreen" class="screen">
	</div>

	<div id="editItemScreen" class="screen">
	</div>
```

The according template (`templates/myview.html`) would look somewhat like this

```html
	A text view : <input type="text" id="myTextView" view-type="textview" />
	<button id="editItem">Go edit the Item</button>
 
```

##See also

See the `baseviewcontroller.js` file for the source code of the BaseViewController.

