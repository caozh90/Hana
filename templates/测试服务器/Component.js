sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/resource/ResourceModel",
	"sap/ui/model/odata/v2/ODataModel"
], function (UIComponent, JSONModel, ResourceModel,ODataModel) {
	"use strict";
 
	return UIComponent.extend("demo.Component", {
 
		metadata : {
			manifest: "json"
		},
 
		init : function () {
			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);
		}
	});
 
});
