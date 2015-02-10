// List views
var ListView = function(elem, vc, mixins) {
		var myMixins = {
				initialize : function() {
						$(this.element).addClass("listview");

						var adapterName = $(this.element).attr("view-adapter");
						if (adapterName) {
							var adapterClass = this.getClassByName(adapterName);
							if (adapterClass) {
								this.setAdapter(adapterClass);
							}
						}
				},
				setAdapter : function(_adapter) {
						this.adapter = _adapter;
						this.adapter.listView = this;

						var that = this;
						this.adapter.rebuildListView = function() {
								that.build();
						};
						this.build();
				},
				build : function() {
						if (!this.adapter) return null;
						if (!this.adapter.count) return null;
						if (!this.adapter.build) return null;

						var that = this;
						var clickHandlerProducer = function(idx) {
								return function() {
									that.adapter.selectedItem(idx);
								}
						};

						this.resetChildren();
						for (var i=0; i < this.adapter.count(); i++) {
								var elem = this.adapter.build(i);
								console.log(elem);
								var lItem = new ListItem(elem, vc);

								if (this.adapter.selectedItem) {
									// I cannot write the handler directly in here
									// because i changes and not the value is bound
									// but the variable as a for loop is not a fct.
									//
									// Sometimes JS sucks
									lItem.click(clickHandlerProducer(i));
								}

								this.append(lItem);
						}
							
				},
		};
		mergedMixins = _.extend(mixins || {}, myMixins);
		return Container(elem, vc, mergedMixins);
};
var ListItem = function(elem, vc, mixins) {
		var myMixins = {
				initialize : function() {
					$(this.element).addClass("listitem");
				}
		};
		mergedMixins = _.extend(mixins || {}, myMixins);
		return HTMLable(elem, vc, mergedMixins);
};

ViewTypes["listview"] = ListView;
ViewTypes["listitem"] = ListItem;
