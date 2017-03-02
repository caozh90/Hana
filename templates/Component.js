//������Ҫ��JS�ļ�
//jQuery.sap.require("lenovo.MyRouter");
sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"demo/controller/HelloDialog",
	"sap/ui/model/odata/v2/ODataModel"
], function (UIComponent, JSONModel, HelloDialog, ODataModel) {
	"use strict";
 
	return UIComponent.extend("demo.Component", {
 
		//ͨ��manifest.json�����ļ���������ʼ����Ļ
		metadata : {
			manifest: "json"
		},
		//SAPUI5�汾���ͣ��޷�ʹ��manifest.json�����ļ�ʱ
//		metadata: {
//			rootView: "demo.view.App"
//		}
		onShowHello: function(){
			alert("123");
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
			
		
			var oConfig = this.getMetadata().getConfig();
//			var sNamespace = this.getMetadata().getManifestEntry("sap.app").id;
//			var oInvoiceModel = new JSONModel(jQuery.sap.getModulePath(sNamespace,oConfig.invoiceLocal));
			var oInvoiceModel = new ODataModel(oConfig.invoiceRemote);
			this.setModel(oInvoiceModel, "invoice");
			
			this.helloDialog = new HelloDialog();
		},
		//�ļ��������ִ�иú���
		createContent: function(){
//			return sap.ui.view({
//				viewName: "demo.view.App",
//				type: sap.ui.core.mvc.ViewType.JS
//			});
		}
	});
 
});
