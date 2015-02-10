
// Tab functions
var TabView = function(elem, vc, mixins) {
		var myMixins = {
				initialize : function() {
						$(this.element).addClass("tabview");
				},
				setContentElement : function(element) {
						this.contentElement = element;
				},
				loadDefaultTab : function() {
						this.childViews[0].click();
				},
		}
		mergedMixins = _.extend(mixins || {} , myMixins);
		return Container(elem, vc, mergedMixins);
};
var TabItem = function(elem, vc, mixins) {
		var myMixins = {
				initialize : function() {
						$(this.element).addClass("tab");

						var vcName = $(this.element).attr("view-controller");
						if (vcName) {
								var vcClass = this.getClassByName(vcName);
								if (vcClass) {
										this.setViewController(vcClass);	
								}
						};
				},
				setViewController : function(viewControllerClass) {
						var that = this;
						this.click(function() {
								new viewControllerClass({el : $(that.parentContainer.contentElement)});
						});
				}
		};
		mergedMixins = _.extend(mixins || {}, myMixins);
		return HTMLable(elem, vc, mergedMixins);

};

ViewTypes["tabview"] = TabView;
ViewTypes["tabitem"] = TabItem;
