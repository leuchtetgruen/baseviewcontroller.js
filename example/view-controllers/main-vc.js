var MainViewController = BaseViewController.extend({
		todos : null,

		template_url : "templates/main.html",

		initialize : function() {
				this.todos = new TodoCollection();
				this.todos.fetch();
				this.render();
		},
});
