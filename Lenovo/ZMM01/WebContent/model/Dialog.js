sap.ui.define([ "sap/ui/base/Object", "sap/ui/model/json/JSONModel", ], 
	function(Object, JsonModel) {
	"use strict";
	return Object.extend("walkthrough_rd.js.HelloDialog", {
		oView : "",
		onInit:function(oView){
			if (oView) {
				this.oView = oView;
			}
			this.oDialog = this.onGetDialog();
			
		},
		
		open : function(oView, oConfig, iv_action) {
			switch (iv_action) {
			case "upload":
				var sTitle = oConfig.bds[0].text, sText = oConfig.bds[1].text;
				break;
			case "submit":
				var sTitle = oConfig.bds[2].text, sText = oConfig.bds[3].text;
				break;
		    case "download":
				var sTitle = oConfig.bds[4].text, sText = oConfig.bds[5].text;
				break;	
		    case "Search":
				var sTitle = oConfig.bds[6].text, sText = oConfig.bds[7].text;
				break;	
			}
			

			var oJsonDialog = new JsonModel({
				title : sTitle,
				text : sText,
				showCancelButton : false
			});
			// Get dialog
			//this.oDialog = this.onGetDialog();
			this.oDialog.setModel(oJsonDialog, "busyDialog");
			oView.addDependent(this.oDialog);
			this.oDialog.open();
		},

		onGetDialog : function(oView) {
			if (!this.oDialog) {
				this.oDialog = sap.ui.xmlfragment("lenovo.mtm.view.BusyDialog", this);
			}
			return this.oDialog;
		},

		onCloseDialog : function() {
			this.onGetDialog().close();
		},
	});

});