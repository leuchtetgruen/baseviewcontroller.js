ContentView
===========

A ContentView is a [BaseView](../baseview.md) that provides the html-content of its
element as its content.  Its view-type is `contentview`.

##Example

Given the following part of a template:
```html
<p id="todosCount" view-type="contentview">This will hold the number of todos in the list</p>
```

This could be in the corresponding ViewController:
```javascript
//...
var that = this;
this.todoList.on("add remove", function() {
		that.todosCount.set(that.todosList.length + " todo(s)");
});
//...
```


##See also
See [ `baseview.js` ](../../baseview.js) for more information
