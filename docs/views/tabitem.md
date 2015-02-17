TabItem
=======

A TabItem (view-type is `tabitem`) is part of a TabView. It is connected with a view controller that it
loads (when touched or clicked) into the element associated with the TabView. 

The controller that is connected with the tabitem can be declared via the `view-controller` attribute of a tabitem
or using the `setViewController` function.

##Functions

###setViewController(viewControllerClass)

This sets the view controller that will be instantiated when the tab is activated.


##See also

For an example on how to use a TabView see the [TabView](tabview.md) documentation. For the source code of 
the TabItem view see `views/tabs.js`.
