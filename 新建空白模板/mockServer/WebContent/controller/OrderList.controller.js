sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/util/MockServer"
], function(Controller,MockServer) {
	"use strict";

	return Controller.extend("demo.controller.OrderList", {
//	onInit: function(){
//			var oMockServer = new MockServer({
//				rootUri: "ServerRouting/"
//			});
//			var metadataPath = jQuery.sap.getModulePath("demo", "/localService/metadata.xml");
//			var mockdataPath = jQuery.sap.getModulePath("demo", "/localService/mockdata");
//			oMockServer.simulate(metadataPath, mockdataPath);
//			oMockServer.start();
//			this._oMockServer = oMockServer;
//
//			var oModel = new sap.ui.model.odata.v2.ODataModel("ServerRouting");
//			oModel.setCountSupported(false);
//			this.getView().setModel(oModel);
//		},
		onExit: function() {
			this._oMockServer.stop();
		}
	});

});
