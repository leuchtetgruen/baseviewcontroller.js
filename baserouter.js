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
		this._routes = {};

		this.registerRoute = function(routeDescription, ViewControllerClass, element) {
			this._routes[routeDescription] = function() {
					new ViewControllerClass({ el : element });
			};
		};

		this.setDefaultRoute = function(ViewControllerClass, element) {
				this.registerRoute("*actions", ViewControllerClass, element);
		};

		this.registerRouteWithCollections = function(routeDescription, ViewControllerClass, element, paramToCollectionHash) {
				if (!paramToCollectionHash) paramToCollectionHash = {};
				var that = this;
				this._routes[routeDescription] = function() {
						var params = _.filter(arguments, function(arg) {
								return (arg != null);
						});
						var sortedParams = that._sortParametersAccordingToAppearanceInRouteDescription(routeDescription, paramToCollectionHash);


						var extension = {};
						var next = function(idx) {
								console.log(params);
								if (idx >= params.length) {
										console.log("Showing VC");
										var MixedVcClass = ViewControllerClass.extend(extension);
										new MixedVcClass({ el : element});

										return; 
								}

								// let's load the item from the given collection
								// first instantiate the collection
								paramName = sortedParams[idx];
								CollectionClass = paramToCollectionHash[paramName];
								
								
								if (CollectionClass) {
									var collection = new CollectionClass();
									collection.fetch({
											success : function() {
													item = collection.get(params[idx]);
													extension[paramName] = item;

													next(idx + 1);
											},
									});
								}

						};

						next(0);
				};
		};

		this._buildRoutesHash = function() {
				return _.mapObject(this._routes, function(routeCallback, routeDescription) {
						return routeDescription.hashCode();
				});
		};

		this._registerRouteCallbacks = function(router) {
				_.each(this._routes, function(routeCallback, routeDescription) {
						console.log("on route:" + routeDescription.hashCode());
						console.log(routeCallback);

						router.on("route:" + routeDescription.hashCode(), routeCallback);
				});
		};

		this.build = function() {
				
				_routes = this._buildRoutesHash();
				var RouterClass = Backbone.Router.extend({
						routes : _routes
				});
				routerInstance = new RouterClass();
				this._registerRouteCallbacks(routerInstance);

				return routerInstance;
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


