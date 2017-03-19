sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/resource/ResourceModel",
	"sap/ui/model/odata/v2/ODataModel"
], function (UIComponent, JSONModel, ResourceModel,ODataModel) {
	"use strict";
 
	return UIComponent.extend("demo.Component", {
 
		metadata : {
			//rootView: "demo.view.App"
			manifest: "json"
		},
 
		init : function () {
			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);
			
//			var oOdataModel = new ODataModel("/");
//			console.log(oOdataModel);
//			this.setModel(oOdataModel);
 
			// set data model
//			var oData = {
//				recipient : {
//					name : "World"
//				}
//			};
//			var oModel = new JSONModel(oData);
//			this.setModel(oModel);
// 
//			// set i18n model
//			var i18nModel = new ResourceModel({
//				bundleName : "demo.i18n.i18n"
//			});
//			this.setModel(i18nModel, "i18n");
		}
	});
 
});