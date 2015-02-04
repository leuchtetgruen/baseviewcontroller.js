BaseViewController.js
=====================

BaseViewController.js is an extension of `Backbone.View` from Backbone.js .
It introduces the concepts of screens, useful for mobile applications. It also
enables you to fill screens with templates that you store in seperate files.
The extension also introduces transition animations between screens using CSS3.
It also introduces dynamic view injection allowing you to treat view kind of like
models.

#Requirements
* [Backbone.js](http://backbonejs.org/)
* [Underscore.js (needed by backbone)](http://underscorejs.org/)
* [jQuery (For async template loading)](http://jquery.com/)


#What you need to do
Include the baseviewcontroller.css and the baseviewcontroller.js file in your application.
Use seperate `div`s for each screen you want to use and add the `screen` class to their
classes list.

Other than that you only need to let your viewcontrollers extend `BaseViewController` instead
of `Backbone.View` .

#Customizing
You can customize the transition effect by setting the `transition`-property on the viewcontroller.
The following transitions are already implemented:

* `opacity` (fade in/out)
* `left` (slide in/out to the right)
* `top` (slide in/out to the bottom)
* fold-(top/bottom/left/right) (fold the content in from the top/bottom/left/right)

You can implement further effects by editing the `baseviewcontroller.css` file. Add an `invisible-...`
and a `visible-...` class.  For further details see the CSS file.

You can also override the `show()` and `hide()` methods but remember to call `this._show()` or 
`this._hide()` in them.

For rendering templates in the given `$el` you can use the `this._render(url, data, callback);` method.
This method loads a template from a URL and then evaluates it, loads it into the `$el` element. Then it
calls the `show()` method of the viewcontroller. The parameters have the following meaning:

* The URL is the url of the template
* The data is a hash that contains data for using in the template. See [`_.template`](http://underscorejs.org/#template)
  for further information on how to use variables in templates.
* The callback will be called after the templated is fully loaded. The template content is passed to the callback as a parameter.

# Dynamic View injection

TODO : Documentation is yet to come but see ScreenOneVC and template.html for an
impression of what you're able to do with this.

view-types :
* textview -> TextView



#Howto
Take a look the `index.html` in the `example/` folder to see an example project. It includes two view controllers
that show the functionailities. You need to run it in a browser that allows local XMLHttpRequests.
