var BackLink = function(elem, vc, mixins) {
		var myMixins = {
				initialize : function() {
						if (vc.fromViewController) {
								$(this.element).click(function(e) {
										vc.transitionBack();
										e.preventDefault();
								});
						}
						else {
							$(this.element).hide();
						}
				},
		};
		mergedMixins = _.extend(myMixins, mixins);
		return HTMLable(elem, vc, mergedMixins);
};

ViewTypes["backlink"] = BackLink;
