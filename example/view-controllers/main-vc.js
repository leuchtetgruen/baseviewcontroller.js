var MainViewController = BaseViewController.extend({
		todos : null,
		newTodoVc : null,

		events : {
				"click #newTodo" : "newTodoClicked",
		},

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

		newTodoClicked : function() {
				if (this.newTodoVc && this.newTodoVc.$el.is(":visible")) {
						this.newTodoVc.hide();
						this.newTodo.set("+");
				}
				else {
						var VC = NewTodoController.extend({ todos : this.todos});
						this.newTodoVc = new VC({ el : $('#newTodoItemView')});
						this.newTodo.set("x");
				}

				
		},
});
