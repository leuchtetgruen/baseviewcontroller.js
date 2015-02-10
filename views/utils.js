var BackLink = function(elem, vc, mixins) {
		var myMixins = {
				initialize : function() {
						$(this.element).click(function(e) {
								vc.transitionBack();
								e.preventDefault();
						});
				},
		};
		mergedMixins = _.extend(myMixins, mixins);
		return HTMLable(elem, vc, mergedMixins);
};

ViewTypes["backlink"] = BackLink;
