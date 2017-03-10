sap.ui.define([
		'jquery.sap.global',
		'sap/m/MessageToast',
		'sap/ui/core/Fragment',
		'sap/ui/core/mvc/Controller'
	], function(jQuery, MessageToast, Fragment, Controller) {
	"use strict";
 
	var CController = Controller.extend("demo.controller.SplitContainer", {
		onAfterRendering: function() {
			var oSplitCont= this.getSplitContObj();
			var ref = oSplitCont.getDomRef() && oSplitCont.getDomRef().parentNode;
			// set all parent elements to 100% height, this should be done by app developer, but just in case
			if (ref && !ref._sapui5_heightFixed) {
				ref._sapui5_heightFixed = true;
				while (ref && ref !== document.documentElement) {
					var $ref = jQuery(ref);
					if ($ref.attr("data-sap-ui-root-content")) { // Shell as parent does this already
						break;
					}
					if (!ref.style.height) {
						ref.style.height = "100%";
					}
					ref = ref.parentNode;
				}
			}
		},
		setSplitMode: function(oEvent){
			if(this.getSplitContObj().getMode() == sap.m.SplitAppMode.HideMode){
				this.getSplitContObj().setMode("ShowHideMode");
			}else{
				this.getSplitContObj().setMode("HideMode");
			}
		},

		getSplitContObj : function() {
			var result = this.byId("SplitContDemo");
			if (!result) {
				jQuery.sap.log.error("SplitApp object can't be found");
			}
			return result;
		}
 
	});
 
	return CController;
 
});
