sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/odata/v2/ODataModel"
], function (UIComponent, JSONModel, HelloDialog, ODataModel) {
	"use strict";
 
	return UIComponent.extend("demo.Component", {
 
		metadata : {
			rootView: "demo.view.Overview"
		},
		init : function () {
			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);
 
			// set data model
			var oData = {
				recipient : {
					name : "World"
				}
			};
			var oModel = new JSONModel(oData);
			this.setModel(oModel);
			
		
//			var oConfig = this.getMetadata().getConfig();
//			var sNamespace = this.getMetadata().getManifestEntry("sap.app").id;
//			var oInvoiceModel = new JSONModel(jQuery.sap.getModulePath(sNamespace,oConfig.invoiceLocal));
//			var oInvoiceModel = new ODataModel(oConfig.invoiceRemote);
//			this.setModel(oInvoiceModel, "invoice");
			
//			this.helloDialog = new HelloDialog();
			
//			this.getRouter().initialize();
		}
	});
 
});