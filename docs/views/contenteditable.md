ContentEditable
===============

A ContentEditable is a [ BaseView ](../baseview.md) that can make the content of a jQuery-Element editable by the user
using the HTML `contenteditable` attribute. Therefore it has a getter-method for this attribute and an `isEditable` method
that returns, wether the content off an element is editable. The view-type of this view is `editable-content`.

The view will return its content via the `get`-Method and the HTML-content of the element can be set via the `set`-Method.

##Functions

###setEditable(editable)

If set to true, the elements `contenteditable`-attribute will be set to true. Thus the user will be able to edit the content
of this element. If set to false the attribute will also be set to false.

###isEditable()

Returns wether or not the `contenteditable`-attribute of the element is set.


##Example

Imagine a page where you can edit a persons details. The headline of this view would be the persons name and it should be editable. This
could be the template for that view:

```html
<h1 id="personName" view-type="editable-content">Name of the person</h1>

<!-- ... -->

<a href="#" id="makeEditable">Edit</a>
```

The corresponding view controller  could look something like that (given that the persons details are available in
the `person` attribute):

```javascript
	events : { "click makeEditable" : "makeEditable" },
	// ... 
	doneRendering : function() {
			this.personName.set(this.person.get("name"));
	},

	makeEditable : function() {
			// Let's bind the personName view to the person's name
			this.person.bindView("name", this.personName);

			// and make the personName view editable
			this.personName.setEditable(true);
	},
	
```

##See also

The source code for the `ContentEditable`-view can be found in [views/forms.js](../../views.froms.js).

