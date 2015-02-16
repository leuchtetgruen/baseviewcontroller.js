Toggleable
==========
A toggleable is a [BaseView](../baseview.md) that can have one of two states. It can
be used as a toggle switch. Its view-type is `toggleable`.

The get-function returns true if the toggle is checked and false if not. Thus the set function
takes a boolean parameter.

A checked toggleable has the css class `toggleable-checked` whereas an unchecked one doesnt. All
toggleables have the css class `toggleable`.

The state of the toggleable is changed when the corresponding element is clicked or touched.

##Example

The following html would produce a div box that changes its color from light gray to black when checked.

```html
<style type='text/css'>

		div.toggleable-checked {
			background-color: black;
			color: white;
		}
		div.toggleable {
			background-color: light-gray;
			color: black;
		}

</style>

<div id="myCheckbox" view-type="toggleable"></div>
```

A corresponding view controller could hold the following code:

```javascript
var checkbox = this.myCheckbox;
checkbox.on("change", function(isChecked) {
		checkbox.html(isChecked ? "Yes" : "No");
});
````

##See also
The source code for toggleables can be found in `views/forms.js`
