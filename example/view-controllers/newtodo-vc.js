NewTodoController = BaseViewController.extend({
		events : {
				"click #saveTodoBtn" : "saveTodo",
		},

		template_url : "templates/newtodo.html",

		initialize : function() {
				this.todo = new Todo();
				this.render();
		},

		doneRendering : function() {
				this.todo.bindView("title", this.titleView);
		},


		saveTodo : function() {
				this.todos.add(this.todo);
				this.todo.save();
				this.hide();
		},
});
