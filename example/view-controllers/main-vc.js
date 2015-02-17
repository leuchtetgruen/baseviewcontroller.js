var MainViewController = BaseViewController.extend({
		todos : null,
		newTodoVc : null,

		// This is the events hash as Backbone.View describes it
		events : {
				"click #newTodo" : "newTodoClicked",
		},

		// A call to render() will render a template from this URL
		template_url : "templates/main.html",

		initialize : function() {
				// Fetch all todo items
				this.todos = new TodoCollection();
				this.todos.fetch();

				this.render();
		},

		doneRendering : function() {
				// load the first tab from the tabView
				this.tabView.loadDefaultTab();

				// Whenever an item in the list is changed the
				// counts in the tabs should be updated
				this.updateCounts();
				var that = this;
				this.todos.on("add remove change", function() {
						that.updateCounts();
				});
		},

		updateCounts : function() {
				// Get done and not done todos
				var doneTodos = this.todos.filter(function(todo) {
						return todo.get("done");
				});
				var yetTodos = this.todos.filter(function(todo) {
						return !todo.get("done");
				});

				this.tabTodo.set("Yet to do (" + yetTodos.length + ")")
				this.tabDone.set("Done (" + doneTodos.length + ")")
		},

		// The function that will be called when the plus was clicked
		newTodoClicked : function() {
				if (this.newTodoVc && this.newTodoVc.$el.is(":visible")) {
						// When the new todo view is visible - hide it and 
						// set the text of the newTodo-view to "+"
						this.newTodoVc.hide();
						this.newTodo.set("+");
				}
				else {
						// Otherwise create a NewTodoController and pass the
						// todos collection over to it
						// then instantiate it
						// and set the text of the newTodo-View to "x" to indicate
						// that hiding it is possible by clicking on it
						var VC = NewTodoController.extend({ todos : this.todos});
						this.newTodoVc = new VC({ el : $('#newTodoItemView')});
						this.newTodo.set("x");
				}

				
		},
});
