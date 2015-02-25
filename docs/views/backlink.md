Backlinks
=========

A Backlink is a view that brings back the view that was last used. You can declare any element (but preferably use
a anchor-element) with a `view-type=backlink` attribute. This will add an onClick listener that will call the
`transitionBack`-method of the active ViewController. For more information on this mechanism see the documentation
on [BaseViewController](../baseviewcontroller.js).

If there is no view controller to go back (that is if `transitionTo` is not used or if this is the first view controller)
this view will hide. You can still show it by calling `show` (as all jquery functions of the element are available on
the view as well).


##Example

See this piece of html within a template for an example of how to use a backLink

```html
	<a href="#" id="myBackLink" view-type="backlink">Go back</a>
```

##See also

You can also take a look at the sourcecode of backlinks in the [ `views/utils.js` ](../../views/utils.js) file.
