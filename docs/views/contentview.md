ContentView
===========

A ContentView is a [BaseView](../baseview.md) that provides the html-content of its
element as its content.  Its view-type is `contentview`.

If you set a `view-fill-with` attribute the view will be initialized with the view-controller property that is
given in this attribute. The attribute can also refer to a function in the view controller, that takes no
arguments.

##Functions

###updateContents()

This function fetches the `view-fill-with` attribute again and fills the content again with the property or function
result from the view controller that is refered to by this attribute.

##Example

Given the following part of a template:
```html
<p id="todosCount" view-type="contentview" view-fill-with="numTodos">This will hold the number of todos in the list</p>
```

This could be in the corresponding ViewController:
```javascript

//...
numTodos : function() {
		return this.todoList.length + " todo(s)";
},

doneRendering : function() {
		var that = this;
		this.todoList.on("add remove", function() {
				that.todosCount.updateContents();
		});
},
//...
```


##See also
See [ `baseview.js` ](../../baseview.js) for more information
