Slider
======

A slider is a [ BaseView ](../baseview.md) that holds the value of a 
html5 range-input. Its view-type is `slider`.


It's getter and setter function use jQuerys [val-function](http://api.jquery.com/val/) to
access the content of the textview.

A slider offers no additional functionality other than the get and set functions.

##Example
Given the following html template

```html
<input type="range" min=0 max=5 id="ratingSlider" view-type="slider" />
````

the following code in a view controller would work

```javascript
// This binds the rating slider to the rating attribute of the todo thus
// changing its value once the slider is moved.
this.todo.bindView("rating", this.ratingSlider);
```


##See also
The code for the slider view can be found in [ `views/forms.js` ](../../views/forms.js) and `baseview.js`
