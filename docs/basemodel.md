BaseModel
=========

BaseModel is an extension of [Backbones model class](http://backbonejs.org/#Model). It allows binding
views to models. Use this model class just like you would use Backbones model class.

In order to make binding views (which are functions) to models work, BaseModel supports treating functions
of the model, that have no arguments like attributes of the model. Therefore the following functions have
been overridden:

* `get`
* `toJSON`

In order to bind your views to you model please use the `bindView`-function.

##Functions

###bindView(attr, view, save)

Binds a view (as provided by the `view` argument) to an attribute (as provided by the `attr` argument) within this model.
The third parameter `save` is a boolean value, that indicates wether or not a change in the view should immediatly be
saved within the model.


##Example

This example shows the use of view binding for a fictional todo application where we bind a input-field that
is automatically injected as `titleView` into the view controller to the todos `title`-attribute.

```javascript
// Fetch the list of todos
myTodoList = new TodoList();
myTodoList.fetch();

// Create a new todo and bind the titleView to it. Automatically
// save the todo once the tites content changes
myTodo = new Todo();
myTodoList.add(myTodo);
myTodo.bindView('title', titleView, true);


```
