TextView
========

A textview is a [BaseView](../baseview.md) that holds the contents of a input-textfield. Its 
view-type is `textview`

It's getter and setter function use jQuerys [val-function](http://api.jquery.com/val/) to
access the content of the textview.

A textview offers no additional functionality other than the get and set functions.

##Example

Given the following html template
```html
<input type="text" placeholder="Todo items title" id="titleView" view-type="textview" />
```

the viewcontroller could hold the following code.

```javascript
this.titleView.set("I just set the text of the input field");
```

##See also
See `views/forms.js` and `baseview.js` for the source of TextViews

