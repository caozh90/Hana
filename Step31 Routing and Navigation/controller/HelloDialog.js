sap.ui.define(
		["sap/ui/base/Object"],
		function(Object) {
			"use strict"
			return Object.extend("demo.controller.HelloDialog",{
				open: function(oView){
					var oDialog = this._getDialog();
					oView.addDependent(oDialog);
					oDialog.open();
				},
				onCloseDialog: function(){
					this._getDialog().close();
				},
				_getDialog: function(){
					if(!this.oDialog){
						this.oDialog = sap.ui.xmlfragment("demo.view.HelloDialog", this);
					};
					return this.oDialog;
				}
			});
		}
);