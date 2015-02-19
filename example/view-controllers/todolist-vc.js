// This is the adapter that will fill the todoList
var TodoListAdapter = CollectionsAdapter.extend({

		// used for filtering and changing the done flag
		setShouldBeDone : function(done) {
				this.shouldBeDone = done;
		},

		// filter function will be called by the CollectionsAdapter
		// to determine which items of the collection to show
		// and which not
		filter : function(todo) {
				return (todo.get("done")==this.shouldBeDone);
		},
		
		// "OnClick"-handler. 
		// When an todo is clicked change its done
		// state and save it.
		selectedItemFromModel : function(model) {
				model.set("done", !this.shouldBeDone);
				model.save();
		},

		buildItemFromModel : function(model) {
				var li = $("<li/>");

				spanDelete = $("<span/>").appendTo(li);
				spanContent = $("<span/>").html(model.toString()).appendTo(li);

				return li;
		},
});

// This function will be used to create the two
// view controllers as they are basically the same
// and only differ in wether they should show 
// done or not done items
var createTodoListController = function(shouldBeDone) {

		// This is the actual view controller that will be returned
		return BaseViewController.extend({
				todos : null,

			   // This template will be loaded when calling render()
			   	template_url : "templates/todolist.html",

				initialize : function() {
						// Get the todos list from the parent controller
						// (the one with the tabview in it)
						this.todos = this.parentViewController.todos;

						this.render();
				},

			   doneRendering : function() {
					   // whenever something changes in the list call filterlist
					   // which will then update the list
					   var that = this;
					   this.todos.on("add remove change", function() {
							   that.filterList();
					   });

					   // and call filterlist for the first time on our
					   // own
					   this.filterList();
			   },

			   // This will filter the list accordingto the shouldBeDone
			   // argument from the function creating this view controller
			   filterList : function() {

					   // Use the parameter from the function creating this VC
					   // to make the adapter filter the right way
					   // then set the collection for the adapter
					   // and build the list
					   this.todoList.adapter.setShouldBeDone(shouldBeDone);
					   this.todoList.adapter.setCollection(this.todos);
					   this.todoList.build();

					   // If there are no items in the list
					   // we will unhide the No Items found view
					   // otherwise we will hide it
					   if (this.todoList.adapter.count() > 0) {
							   this.noItems.hide();
					   } 
					   else {
							   this.noItems.show();
					   }
			   },
		});
};

// Now let's just create the two view controllers for the TabView to use
var TodoListController = createTodoListController(false);
var DoneListController = createTodoListController(true);
