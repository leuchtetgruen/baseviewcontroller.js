NewTodoController = BaseViewController.extend({
		//Bind a click on the button with the id saveTodoBtn to 
		//the saveTodo Function
		events : {
				"click #saveTodoBtn" : "saveTodo",
		},

		//render() will load this template
		template_url : "templates/newtodo.html",

		initialize : function() {
				// create the todo that will be filled in this VC
				this.todo = new Todo();
				this.render();
		},

		doneRendering : function() {
				// bind the titleView to the todos title attribute
				// so changes in the titleView textfield will
				// automatically be available in the title attribute
				this.todo.bindView("title", this.titleView);
		},


		saveTodo : function() {
				// Add it to the todos collection and then save it
				this.todos.add(this.todo);
				this.todo.save();

				// and hide this subview
				this.hide();
		},
});
