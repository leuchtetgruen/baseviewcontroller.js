ListItem
========

A ListItem is a [ BaseView ](../baseview.md) that is used as a subview in a [ ListView ](listview.md). 
The view type of a ListeItem is "listitem".
ListItems can be generated automatically using the adapter mechanism in Listviews. Other than that
they are ordinary views, that return their HTML-content via the `get`-function and so their content can
be set via the `set`-function.

A ListItem has the `listitem` CSS class.

For an example on how to use ListViews see the [according documentation](listview.md).

##See also

The sourcecode for ListItems can be found in the [ `views/lists.js` ](../../views/lists.js) file.
