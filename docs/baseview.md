BaseView
========

BaseView is *not* an extension of an existing Backbone mechanism. Views are wrappers
around [jQuery](http://jquery.com/)-elements in a DOM. They provide additional functionality
as compared to the pure jQuery-element.

They provide getters and setters and can be used as attributes in models. Through a mechanism
called "view-injection" they can be automatically injected into a view controller as properties.

This document only describes the general way views work. The way specific views work are described
in seperate documents.

Once a viewcontroller loads a template the template is scanned for views that can be injected into
the viewcontroller. In order for a view to be injected into a view controller the element has to
have a `view-type` attribute. The view-type has to have one of the following values:

* [ contentview ](views/contentview.md)
* [ container ](views/container.md)
* [ textview ](views/textview.md)
* [ slider ](views/slider.md)
* toggleable
* listview
* listitem
* tabview
* tabitem
* backlink

For information on how to extend existing views into own views see `views/forms.js` as an example.

##Example

In order to explain this mechanism further. We'll take a look at a part of a template:

```html
<input type="text" id="titleView" view-type="textview" placeholder="Todos title" />
```

Once this piece of html code is loaded from a template the `_render`-function will detect
the element by its `view-type`-attribute. It will then instantiate a TextView object with
the jquery-element of this input-field and the view controller that calls for rendering this
template. The textview will be available after rendering (so best use it in the `doneRendering`-callback)
and the property will be named like the id of the element (so in this case `titleView`).

Here's some code that could be present in the view-controller that renders this template.

```javascript
var EditTodoViewController {
	todo : null,
	todoList : null,

	initialize : function() {
			this.todoList = new TodoList();
			this.todoList.fetch();

			this.todo = new Todo();
			this.todoList.add(todo);
			
	},

	render : function() {
			this._render("templates/edit-todo.html");
	},

	doneRendering : function() {
			this.titleView.set("I just set the text of the input field");

			this.titleView.on("change", function(newValue) {
					console.log("The field's new value is " + newValue);
			});

			// bind the titleView to the Todo-Models title property
			// See BaseModels documentation for more infos
			this.todo.bindView('title', this.titleView, true);
	}
}
```


##See also
The basic functionality of Baseview is defined in `baseview.js`
