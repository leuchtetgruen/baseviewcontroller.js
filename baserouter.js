String.prototype.hashCode = function(){
	var hash = 0;
	if (this.length == 0) return hash;
	for (i = 0; i < this.length; i++) {
		char = this.charCodeAt(i);
		hash = ((hash<<5)-hash)+char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
}


RouterBuilder = function() {
		// The reason why this is an array and not a hash
		// is that I want to preserve the order as to
		// not mix up default routes etc.
		this._routes = []


		// Adds a route to the array of routes
		// in the form of description -> routeFunction
		//
		// The description is the same as in Backbones router
		this.addRoute = function(routeDescription, routeFunction) {
				routeHash = {};
				routeHash[routeDescription] = routeFunction;
				this._routes.push(routeHash);
		};

		/*
		 * This will register a route that will when called instantiate a view controller
		 * and show the contents in the given element
		 */
		this.registerRouteForViewController = function(routeDescription, ViewControllerClass, element) {
			this.addRoute(routeDescription, function() {
					if (window.visibleViewController) {
						window.visibleViewController.transitionTo(ViewControllerClass, element);
					}
					else {
							new ViewControllerClass({ el : element });
					}
			});
		};

		/*
		 * This will show a certain view controller in a certain element
		 * as default (always matching) route
		 */
		this.setDefaultRoute = function(ViewControllerClass, element) {
				this.registerRouteForViewController("*actions", ViewControllerClass, element);
		};

		/*
		 * This route will load an element from a collection and put it into the loaded view controller as an attribute
		 *
		 * So /todos/:todo/participants, ParticipantsVC, $('#todoView') , { todo : TodoCollection } will, when a URL like
		 * index.html#/todos/2/participants load the todo with the id 2 and then inject it into the ParticipantsVC as an
		 * attribute named todo.
		 * Nice - isn't it?
		 */
		this.registerRouteWithCollections = function(routeDescription, ViewControllerClass, element, paramToCollectionHash) {
				if (!paramToCollectionHash) paramToCollectionHash = {};

				var that = this;
				routeFunction = function() {
						var params = _.filter(arguments, function(arg) {
								return (arg != null);
						});
						var sortedParams = that._sortParametersAccordingToAppearanceInRouteDescription(routeDescription, paramToCollectionHash);


						var extension = {};
						var next = function(idx) {
								if (idx >= params.length) {
										var MixedVcClass = ViewControllerClass.extend(extension);

										if (window.visibleViewController) {
												window.visibleViewController.transitionTo(MixedVcClass, element);
										}
										else {
												new MixedVcClass({ el : element});
										}

										return; 
								}

								// let's load the item from the given collection
								// first instantiate the collection
								paramName = sortedParams[idx];
								ItemClass = paramToCollectionHash[paramName];
								
								
								if (ItemClass) {
									var item = new ItemClass();
									item.id = params[idx];
									item.fetch({
											success : function() {
													extension[paramName] = item;

													next(idx + 1);
											},
									});
								}

						};

						next(0);
				};

				this.addRoute(routeDescription, routeFunction);
		};

		/*
		 * Use this function to finally build the router itself
		 */
		this.build = function() {
				
				_routes = this._buildRoutesHash();
				var RouterClass = Backbone.Router.extend({
						routes : _routes
				});
				routerInstance = new RouterClass();
				this._registerRouteCallbacks(routerInstance);

				return routerInstance;
		};

		this._buildRoutesHash = function() {
				routesHash = {};

				_.each(this._routes, function(route) {
						routeDescription = _.keys(route)[0];
						routesHash[routeDescription] = routeDescription.hashCode();
				});
				return routesHash;
		};

		this._registerRouteCallbacks = function(router) {
				_.each(this._routes, function(route) {
						routeDescription = _.keys(route)[0];
						routeCallback = route[routeDescription];

						router.on("route:" + routeDescription.hashCode(), routeCallback);
				});
		};



        this._sortParametersAccordingToAppearanceInRouteDescription = function(routeDescription, paramHash) {
				retHash = _.clone(paramHash);
				retPositions = _.mapObject(paramHash, function(val, key) {
						return routeDescription.indexOf(key);
				});
				retPositionsPairs = _.pairs(retPositions);
				sortedPairs = _.sortBy(retPositionsPairs, function(pair) {
						return pair[1];
				});
				sortedPairMappedIndizes = _.map(sortedPairs, function(pair) {
						return pair[0];
				});
				return sortedPairMappedIndizes;
		};

		this._getClassByName = function(name) {
				if (name.match(/[A-Za-z0-9]+/)) {
					return eval(name);
				}
				else return null;
		};
};


