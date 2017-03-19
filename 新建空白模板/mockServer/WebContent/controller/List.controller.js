sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/odata/v2/ODataModel"
], function(Controller,ODataModel) {
	"use strict";

	return Controller.extend("demo.controller.List", {
		/**
		 * Responds to the button press event.
		 * Upon pressing, we bind the items aggregation of the list to the "Meetups" entityset.
		 * We pass a custom URL parameter "first=3" (assuming our OData BE knows how to process it).
		 */
		onInit: function(){
			var oOdataModel = new ODataModel("/odata");
			console.log(oOdataModel);
			this.getView().setModel(oOdataModel, "invoice");
		}
//		onPressAction: function() {
//			var oList = this.getView().byId("list");
//			oList.bindItems({
//				path: "/Meetups",
//				parameters: {
//					custom: {
//						first: "3"
//					}
//				},
//				template: new sap.m.ObjectListItem({
//					title: "{Title}",
//					number: {
//						path: 'EventDate',
//						type: 'sap.ui.model.type.DateTime',
//						formatOptions: {
//							style: 'medium'
//						}
//					},
//					attributes: [
//						new sap.m.ObjectAttribute({
//							text: "{Description}"
//						})
//					]
//				})
//			});
//		}
	});

});
