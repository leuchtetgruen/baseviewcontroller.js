var TodoListAdapter = CollectionsAdapter.extend({
		setShouldBeDone : function(done) {
				this.shouldBeDone = done;
		},
		filter : function(todo) {
				return (todo.get("done")==this.shouldBeDone);
		},
});

var createTodoListController = function(shouldBeDone) {
		return BaseViewController.extend({
				todos : null,

			   	template_url : "templates/todolist.html",

				initialize : function() {
						console.log("ShouldBeDone is " + shouldBeDone);
						this.todos = new TodoCollection();
						this.todos.fetch();
						this.render();
				},

			   doneRendering : function() {
					   this.filterList();
			   },

			   filterList : function() {
					   this.todoList.adapter.setShouldBeDone(shouldBeDone);
					   this.todoList.adapter.setCollection(this.todos);
					   this.todoList.build();

					   if (this.todoList.adapter.count() > 0) {
							   this.noItems.hide();
					   } 
					   else {
							   this.noItems.show();
					   }
			   },
		});
};

var TodoListController = createTodoListController(false);
var DoneListController = createTodoListController(true);
