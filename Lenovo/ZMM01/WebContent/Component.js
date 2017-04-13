sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"lenovo/mtm/model/models",
	"lenovo/mtm/model/Dialog",
], function(UIComponent, Device, models, Dialog) {
	"use strict";
	jQuery.sap.require("lenovo.mtm.model.simpleExcel");
	return UIComponent.extend("lenovo.mtm.Component", {

		metadata: {
			"version": "1.0.0",
			"includes" : [ "css/MTM.css" ],
			"rootView": {
				"viewName": "lenovo.mtm.view.App",
				"type": "XML",
				"id": "app"
			},
			"dependencies": {
				"libs": ["sap.ui.core", "sap.m", "sap.ui.layout"]
			},
			"config": {
				"i18nBundle": "lenovo.mtm.i18n.i18n",
				"serviceUrl": "/sap/opu/odata/sap/ZMMPP_MTM_001_SRV/",
				"msgs":[
				 	   {"text": "Only for CSV Type Now"},
				 	   {"text": "Choose a CSV file first"},
				 	   {"text": "Choose a CSV file not empty"},
				 	   {"text": "Server Connection Aborted!"},
				 	   {"text": "Please select one item at least"},
				 	   {"text": "No Valid Data Selected or Selected Items with Error"},
				 	   {"text": "Failed to get odata for ComboBox"},
   				 	   {"text": "Update successfully"},
   				 	   {"text": "Update failed"},
   				 	   {"text": "The count of uploaded data should be less than 200"},
				 ],
				"bds":[
				      {"text": "Upload"},
				      {"text": "Uploading CSV Content and Checking Data..."},
				      {"text": "Update"},
				      {"text": "Update backend table from upload data..."},
				      {"text": "Download"},
				      {"text": "Download data from table data..."},
				      {"text": "Search"},
				      {"text": "Search data from Back-End System..."},
			     ], 
				"icon": "",
				"favIcon": "",
				"phone": "",
				"phone@2": "",
				"tablet": "",
				"tablet@2": ""
			},
			"routing": {
				"config": {
					"routerClass": "sap.m.routing.Router",
					"viewType": "XML",
					"viewPath": "lenovo.mtm.view",
					"controlId": "app",
					"controlAggregation": "pages",
					"bypassed": {
						"target": "master"
					}
				},

				"routes": [{
					"pattern": "",
					"name": "master",
					"target": "master"
				}, {
					"pattern": "ZMTM_INFOSet{objectId}",// which appears in URL, while you navigate
					"name": "Object",// Name that is used in navTo method
					"target": "Object"
				},{
					"pattern": "Upload",
					"name": "Upload",
					"target": "Upload"
				},{
					"pattern": "Upload1",
					"name": "Upload1",
					"target": "Upload1"
				},{
					"pattern": "Upload2",
					"name": "Upload2",
					"target": "Upload2"
				},{
					"pattern": "Upload3",
					"name": "Upload3",
					"target": "Upload3"
				},
				{
					"pattern": "Report",
					"name": "Report",
					"target": "Report"
				},
				{
					"pattern": "Issue",
					"name": "Issue",
					"target": "Issue"
				}
				],

				"targets": {
					"master": {
						"viewName": "Master",
						"viewId": "master",
						"viewLevel": 1
					},
					"Object": {
						"viewName": "Object",
						"viewId": "Object",
						"viewLevel": 2
					},
					"Upload": {
						"viewName": "Upload",
						"viewId": "Upload",
						"viewLevel": 2
					},
					"Upload1": {
						"viewName": "Upload1",
						"viewId": "Upload1",
						"viewLevel": 2
					},
					"Upload2": {
						"viewName": "Upload2",
						"viewId": "Upload2",
						"viewLevel": 2
					},
					"Upload3": {
						"viewName": "Upload3",
						"viewId": "Upload3",
						"viewLevel": 2
					},
					"Report": {
						"viewName": "Report",
						"viewId": "Report",
						"viewLevel": 2
					},
					"Issue": {
						"viewName": "Issue",
						"viewId": "Issue",
						"viewLevel": 2
					},
				}
			}
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * In this function, the resource and application models are set and the router is initialized.
		 * @public
		 * @override
		 */
		init: function() {
			var mConfig = this.getMetadata().getConfig();

			// create and set the ODataModel
			var oModel = models.createODataModel({
				urlParametersForEveryRequest: [
					"sap-server",
					"sap-client",
					"sap-language"
				],
				url: this.getMetadata().getConfig().serviceUrl,
				config: {
					metadataUrlParams: {
						"sap-documentation": "heading"
					}
				}
			});
			this.setModel(oModel);
			this._createMetadataPromise(oModel);
			// set the i18n model
			this.setModel(models.createResourceModel(mConfig.i18nBundle), "i18n");

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			// set the FLP model
			this.setModel(models.createFLPModel(), "FLP");
		    
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			
			// create the views based on the url/hash
			this.getRouter().initialize();
			// A new way to share busydialog,
			// To-Be Fullfiled
			this.Dialog = new Dialog;
		},
		
		_createMetadataPromise: function(oModel) {
			this.oWhenMetadataIsLoaded = new Promise(function(fnResolve, fnReject) {
				oModel.attachEventOnce("metadataLoaded", fnResolve);
				oModel.attachEventOnce("metadataFailed", fnReject);
			});
		}

	});

});