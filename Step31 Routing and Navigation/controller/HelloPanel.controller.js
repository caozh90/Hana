sap.ui.define(
		["sap/ui/core/mvc/Controller",
		 "sap/m/MessageToast"],
		function(Controller, MessageToast){
			"use strict";
			return Controller.extend("demo.controller.HelloPanel",{
				onInit: function(){
					//alert('123');
				},
				onShowHello: function(){
					var oBundle = this.getView().getModel("i18n").getResourceBundle();
					var sRecipient = this.getView().getModel().getProperty("/recipient/name")
					var sMsg = oBundle.getText("helloMsg", [sRecipient, '第二个参数']);
					MessageToast.show(sMsg);
				},
				onOpenDialog: function(){
					var oView = this.getView();
					this.getOwnerComponent().helloDialog.open(oView);
				}
			})
		}
);