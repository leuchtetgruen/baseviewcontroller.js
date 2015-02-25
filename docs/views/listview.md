ListView
========

A ListView is a [ Container ](container.md) that has the view-type `listview`. It's a wrapper around
`<ul>s` or `<ol>s`. It offers additional functionality like an adapter mechanism, that defines a 
class that renders a view for each list item and holds a click handler for each list item, just like
it's common in mobile programming.

All ListViews have the `listview` CSS-class. Their [Adapter-class](#adapters) can be either defined by the
`view-adapter` attribute in the HTML or via the `setAdapter`-method. The `build`-function renders the list.

##Adapters

An adapter is a class that provides views and functionalities for each list item. Therefore an Adapter should implement
the following functions:

###count()

The count function should return the number of items to be rendered in the list

###build(idx)

This function should return a jQuery-Element containing the list item. The returned element will
be wrapped in a [ListItem](listitem.md). The given `idx` parameter holds the index in the list of
the item to be rendered.

###selectedItem(idx)

This is a callback function. It will be called when the list item at the position `idx` is selected (clicked, touched).

If your `build`-method returns an element that has a subelement with the CSS-class `cell-content` only the subelement with this CSS element will react to clicks and call `selectedItem`.

###customizeListItem(listItem, idx)

This is an optional callback. If it's implemented it's called right after the listItem (an [ListItem](listitem.md) object) is produced using the `build`-function. This function can be used to customize the produced listItem (e.g. setting other listeners, or manipulate it in other ways).


##More on adapters

As lists oftentimes represent items from a Collection there is a specific adapter called [ `CollectionsAdapter` ](collectionsadapter.md) that
can be extended to provide an adapter for items from a collection.


##Functions

Other than a `initialize`-function and the functions described in [ `Container` ](container.md) this view contains the 
following functions:

###setAdapter(adapter)

Tells the listview to use the provided `adapter` as the data source for the list. It also sets the property `attachedViewController` of the adapter to the viewcontroller that holds the listview. It also creates a `rebuildListView`-function in the adapter that will when called call the `build`-function of the listview.


###build() 

This function builds the list using the adapter and renders it into the jQuery-Element of this listview.


##Example

Given this html

```html
	<ul id="todoList" view-type="listview" view-adapter="TodoAdapter"></ul>
```

The following javascript code could render todos into a list (using the models `toString`-function):


```javascript
		var Todo = BaseModel.extend({
				//...
				toString : function() {
						return this.get("title");
				}
		});

		var TodoCollection = Backbone.Collection.extend({
				model : Todo,
		});

		var TodoAdapter = CollectionAdapter.extend({
				selectedItemFromModel : function(todo) {
						alert("Selected todo : " + todo.toString());
				},
		});


		// within the view controller in the doneRendering function
		var todos = new TodoCollection();
		todos.fetch();

		this.todoList.adapter.setCollection(todos);
		this.todoList.build();
```

##See also

You can take a look at the source code of the list view in the [ `views/lists.js` ](../../views/lists.js) file.
