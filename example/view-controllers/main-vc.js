var MainViewController = BaseViewController.extend({
		todos : null,

		template_url : "templates/main.html",

		initialize : function() {
				this.todos = new TodoCollection();
				this.todos.fetch();
				this.render();
		},

		doneRendering : function() {
				this.tabView.loadDefaultTab();

				this.updateCounts();
				var that = this;
				this.todos.on("add remove change", function() {
						console.log("MainVC todos on add change remove");
						that.updateCounts();
				});
		},

		updateCounts : function() {
				var doneTodos = this.todos.filter(function(todo) {
						return todo.get("done");
				});
				var yetTodos = this.todos.filter(function(todo) {
						return !todo.get("done");
				});

				this.tabTodo.set("Yet to do (" + yetTodos.length + ")")
				this.tabDone.set("Done (" + doneTodos.length + ")")
		},
});
