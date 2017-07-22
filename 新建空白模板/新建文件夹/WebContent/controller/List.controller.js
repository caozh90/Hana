sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/util/MockServer"
], function(Controller,MockServer) {
	"use strict";

	return Controller.extend("demo.controller.List", {
		onInit: function(){
			var oMockServer = new MockServer({
				rootUri: "ServerRouting/"
			});
			oMockServer.simulate("localService/metadata.xml", {
				sMockdataBaseUrl: "localService/mockdata",
				bGenerateMissingMockData: true
			});
			oMockServer.start();
			this._oMockServer = oMockServer;

			var oModel = new sap.ui.model.odata.ODataModel("ServerRouting/", true);
			oModel.setCountSupported(false);
			this.getView().setModel(oModel);
		},
		onExit: function() {
			this._oMockServer.stop();
		}
	});

});
