sap.ui.define(
		["sap/ui/core/mvc/Controller",
		 "sap/m/MessageToast"
		 ],
		function(Controller, MessageToast){
			"use strict";
			return Controller.extend("demo.controller.App",{
				onOpenDialog: function(){
					this.getOwnerComponent().helloDialog.open(this.getView());
				},
				pressNavButton: function(){
					var SplitContDemo =  this.getView().byId("splitContainer").byId("SplitContDemo");
					if(SplitContDemo.getMode() == sap.m.SplitAppMode.HideMode){
						//SplitContDemo.setMode("ShowHideMode");
						SplitContDemo.showMaster();
					}else{
						SplitContDemo.setMode("HideMode");
					}
				}
			})
		}
);