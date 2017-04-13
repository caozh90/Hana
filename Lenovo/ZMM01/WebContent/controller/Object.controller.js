sap.ui.define([
	"lenovo/mtm/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/util/Export", 
	"sap/ui/core/util/ExportTypeCSV",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/Device",
	"sap/m/Table",
	"sap/m/MessageToast",
	"jquery.sap.global",
	'sap/ui/core/Fragment',
	"sap/ui/model/odata/ODataModel",
	"sap/m/TablePersoController",
	"sap/ui/model/resource/ResourceModel",
], function(BaseController, JSONModel, Export, ExportTypeCSV, Filter, FilterOperator, Device,Table, MessageToast,jQuery,Fragment,ODataModel,TablePersoController,ResourceModel) {
	"use strict";
	return BaseController.extend("lenovo.mtm.controller.Object", {
		oPersonalizationDialog : null,
		onInit: function() {
			this.getRouter().getRoute("Object").attachPatternMatched(this._onObjectMatched, this);	
		},	
		_onObjectMatched: function(oEvent) {
			//设置首列CSS格式
			var items = this.getView().byId("ObjectTable").getItems();
			for (i = 0; i < items.length; i++) {
				var item = items[i];
				var obj = item.getBindingContext().getObject();
				if(obj.Zdesc != undefined){
					items[i].getCells()[0].addStyleClass("fontset");
				}
			};		
			var sObjectId = oEvent.getParameter("arguments").objectId;
			this.getOwnerComponent().oWhenMetadataIsLoaded.then(function() {
				var sObjectPath = this.getModel().createKey("ZMTM_INFOSet", {
					Matnr: sObjectId
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
		},
		
		_bindView: function(sObjectPath) {

			this.getView().bindElement({
				path: sObjectPath
			});
		},
		
		onBeforeRendering: function() {
			
		},
		onAfterRendering: function(){
			
		},
	});

});