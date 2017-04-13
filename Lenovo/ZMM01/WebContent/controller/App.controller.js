sap.ui.define([
	"lenovo/mtm/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/odata/ODataModel",
], function(BaseController, JSONModel, ODataModel) {
	"use strict";

	return BaseController.extend("lenovo.mtm.controller.App", {

		onInit: function() {
			var oViewModel,
				fnSetAppNotBusy,
				iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();

			oViewModel = new JSONModel({
				busy: true,
				delay: 0
			});
			this.setModel(oViewModel, "appView");

			fnSetAppNotBusy = function() {
				oViewModel.setProperty("/busy", false);
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			};

			this.getOwnerComponent().oWhenMetadataIsLoaded.
			then(fnSetAppNotBusy, fnSetAppNotBusy);
			
			this.onGetUserId();
			
		},
		onGetUserId: function() {
			var userId = sap.ushell.Container.getService("UserInfo").getId().toString();			
			
		},
		MaterialSearch: function(){
			
		}
	});

});