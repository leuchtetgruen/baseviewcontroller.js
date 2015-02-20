CollectionsAdapter
==================

A CollectionsAdapter is a predefined adapter that you can extend. It provides the 
contents of a collection to a [ListView](listview.md) . It offers useful things
like filtering, callbacks on building and on clicking.

##Functions

###setCollection(collection)

Set the collection that the adapter should work on. You should call this method before
calling `build()` on the listview. Otherwise the listview has nothing to show.


###extend(extension)

Use this function like you would use extend in Backbone anyway.

##Functions you should implement

You don't need to implement anything. If you dont do anything a Collectionsadapter will
produce list entries that consist of the result of the models `toString()`-function. You
will not be notified when the user clicks on a list entry. You will also not be able to
filter the list.

###filter(model)

This function should return `true` or `false`, depending on wether or not this object should be
part of the list. 

###buildItemFromModel(model)

This function should return a jQuery-`<li>`-Element containing the contents of the list item that
should be displayed for this object.

###selectedItemFromModel(model)

This function is called, when the user clicks on the list item that corresponds to the model that is
handed over as an argument.

##Example

The html for a list with an adapter could look like this

```html
<ul view-type="listview" view-adapter="PeopleAdapter" id="peopleList">
</ul>
```

The following javascript-code should be an adapter for a list of people.

```javascript
// Adapter

var PeopleAdapter = CollectionsAdapter.extend({
		
		shouldOnlyShowAdultPeople : false,

		setShouldOnlyShowAdultPeople(shouldIt) {
				this.shouldOnlyShowAdultPeople = shouldIt;
		},

		filter : function(person) {
			return this.shouldOnlyShowAdultPeople ? (person.get("age") > 18) : true;
		},

		buildItemFromModel : function(person) {
				var li = $('<li/>');

				li.html(person.get("name"));

				if (person.get("age") > 18) {
					// e.g. for CSS highlighting
					li.addClass("adult");
				}

				return li;
		},

		selectedItemFromModel : function(person) {
				this.attachedViewController.transitionToPersonDetail(person);
		},
});
```

The following could be part of the ViewController in the `doneRendering` method, given that a collection
was fetched and stored in the `people` variable.

```javascript
	this.peopleList.adapter.setCollection(people);
	this.peopleList.adapter.setShouldOnlyShowAdultPeople(true);
	this.peopleList.build();
```


##See also

The source code for the CollectionsAdapter can be found in [views/lists.js](../../views/lists.js).
