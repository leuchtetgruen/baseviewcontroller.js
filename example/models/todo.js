var Todo = BaseModel.extend({
		
		defaults : {
				title : "New todo",
				done : false,
		},

		toString : function() {
			return this.get("title");
		},
});

var TodoCollection = Backbone.Collection.extend({
		localStorage : new Backbone.LocalStorage("todos"),
		model : Todo,
});

