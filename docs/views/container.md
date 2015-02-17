Container
=========

A container is a [BaseView](../baseview.md) that holds several childViews as subviews.
Its view-type is `container`. The content of the element of a container is also scanned 
via the `injectView`-mechanism. Each childview has a property called `parentContainer`
that holds a reference to the container view that holds the child.

A container should not be used in conjunction with view binding to models. It also has no set
function. The get function will return the list of childviews, which is not useful in this context.

However a container provides some additional functionality that is especially useful when extending
a container as done with [TabViews](tabview.md) and [ListViews](listview.md).

##Functions

###append(view)
This function appends another childview to the container view. The childviews jQuery-element is appended to
the containers jQuery-element. The childviews `parentContainer`-attribute will hold a reference to
the container.

###resetChildren
This function removes all children of the container from the DOM and clears the list of childViews.


##See also
See [ `baseview.js` ](../../baseview.js) for more information.
