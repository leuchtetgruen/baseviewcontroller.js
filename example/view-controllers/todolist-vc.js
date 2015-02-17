var TodoListAdapter = CollectionsAdapter.extend({
		setShouldBeDone : function(done) {
				this.shouldBeDone = done;
		},
		filter : function(todo) {
				return (todo.get("done")==this.shouldBeDone);
		},
		
		selectedItemFromModel : function(model) {
				model.set("done", !this.shouldBeDone);
				model.save();
		},
});

var createTodoListController = function(shouldBeDone) {
		return BaseViewController.extend({
				todos : null,

			   	template_url : "templates/todolist.html",

				initialize : function() {
						console.log("ShouldBeDone is " + shouldBeDone);
						this.todos = this.parentViewController.todos;
						this.render();
				},

			   doneRendering : function() {
					   var that = this;
					   this.todos.on("add remove change", function() {
							   that.filterList();
					   });
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
