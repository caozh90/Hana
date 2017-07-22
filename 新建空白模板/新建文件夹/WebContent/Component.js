sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/resource/ResourceModel",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/odata/v2/ODataModel"
], function (UIComponent, ResourceModel,JSONModel, ODataModel) {
	"use strict";
 
	return UIComponent.extend("demo.Component", {
 
		metadata : {
			rootView: "demo.view.App"
		},
 
		init : function () {
			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);
 
			// set i18n model
			var i18nModel = new ResourceModel({
				bundleName : "demo.i18n.i18n"
			});
			this.setModel(i18nModel, "i18n");
			
			//set ODataModel
//			var oDataModel = new ODataModel("/sap/opu/odata/sap/ZFIORI_ZPSR004_SRV/");
//			this.setModel(oDataModel);
			
		}
	});
 
});
