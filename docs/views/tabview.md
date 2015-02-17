TabView
=======

A TabView (view-type `tabview`) is a [container view](container.md). Its child elements are [tab items](tabitem.md).
A TabView has a content Element. This is the container for loading actual content. Each tabview has the CSS class `tabview`.
Using the `tabview-content-view` attribute the view that should be used for the content can be defined within the template.

It is recommended to use `<ul>s` as tabviews.


##Functions

###setContentElement(element)

Sets the content element into which the content of the tabs will be loaded. The element should be a jQuery element.
When the TabItems are clicked, their view controller will be instantiated with the element as `$el`.


###loadDefaultTab()

Loads the first tab.


##Example

Given the following html a tabview with three tabs and according view controllers for the content element is defined.

```html
<ul id="myTabs" view-type="tabview" tabview-content-view="tabContent">
	<li id="tab1" view-type="tabitem" view-controller="TabOneController">Tab 1</li>
	<li id="tab2" view-type="tabitem" view-controller="TabTwoController">Tab 2</li>
	<li id="tab3" view-type="tabitem" view-controller="TabThreeController">Tab 3</li>
</ul>

<div id="tabContent">
</div>
```

##See also

For more information on TabItems see the [TabItem](tabitem.md) documentation. For the source of the tabview see
`views/tabs.js`.

