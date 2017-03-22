/************************************
* Created by zhaodan1 at 2016-3-22
* Version 1.0 2016-3-22
************************************/
//require what you need
/** ****Copy_Change_Start****** */
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
jQuery.sap.require("lenovo.control.Validation");
/** ****Copy_Change_End****** */	

// main
/** ****Copy_Change_Start****** */
sap.ui.jsview("lenovo.view.cfe.priceMask.uiPmForecast", { 
/** ****Copy_Change_End****** */	
	getControllerName: function() {

	},
	
	// Create Page Content including all the UI items
	createContent: function(){
		
		// declare app
		var app = new sap.m.App();
		// declare service url
		var service = new lenovo.service.CFE();
		var oServiceUrl = service.getEBGCfe();        // model service url
		var uServiceUrl = service.getEBGCfeUpload();  // upload service url
		
		// declare model
		var oModel = new sap.ui.model.odata.ODataModel(oServiceUrl, true);
		// declare authorization
		/** ****Copy_Change_Start****** */
		var auth = lenovo.control.commontable.Table.getViewAuth("uiPmForecast");
		/** ****Copy_Change_End****** */

		// generate UI
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel); // declare
																						// ui_view
																						// configuration
		this.setConfig(config, oServiceUrl, uServiceUrl,auth);   // call
																	// private
																	// function
																	// --
																	// ui_view
																	// configuration
		/** ****Copy_Change_Start****** */
		var header = lenovo.control.commontable.Table.createHeader("Price Mask", "Forecast PM");
		/** ****Copy_Change_End****** */
		
		// set data connection
		/** ****Copy_Change_Start****** */
		config.bindRowUrl = "/PM_RPT_FORECAST";
		/** ****Copy_Change_End****** */
		var table = lenovo.control.commontable.Table.createTable(config);
		table.setBusy(true);
		table.setModel(oModel);
		oModel.attachRequestCompleted(function(){
			table.setBusy(false);
		});
		
		
		// filter panel
		var filterPanel = lenovo.control.commontable.Table.createFilter(config, table);
		// tool bar
		var oEditDeleteUploadDownload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table, app);
		
		
//		var oForm = filterPanel.getContent()[0];
		/** ****Copy_Change_Start****** */
// var cycleDropdownBox =
// lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Cycle")[0];
// var partNumTextBox =
// lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Part
// Number")[0];
		

		this.config = config;
		this.filterPanel = filterPanel;
		this.table = table;
		
		
		// generate page into app
		var page = new sap.m.Page({
	      	showHeader: false,
	      	content :[header, filterPanel, oEditDeleteUploadDownload, table] // header,
																				// filterPanel,
																				// oEditDeleteUploadDownload,
																				// table
	    });
       app.insertPage(page);
       app.setInitialPage(page);
       return app;	
		
	},
	
	// private function -- ui_view columns configuration
	setConfig: function(config, oServiceUrl, uServiceUrl, auth) {
		
		// table columns setting
		/** ****Copy_Change_Start****** */
		config.columns = [  {
							field : "PLANT",
							label : "Plant",
							type : "TextField",
							width : "50px"		
						}, {
							field : "MTM",
							label : "MTM",
							type : "TextField",
							width : "100px"		
						}, {
							field : "PM_AMOUNT",
							label : "PM Amount",
							type : "TextField",
							width : "100px"	
						}, {
							field : "UNIT",
							label : "Unit",
							type : "TextField",
							width : "40px"			
						}, {
							field : "PER",
							label : "Per",
							type : "TextField",
							width : "40px"	
						}, {
							field : "UOM",
							label : "Uom",
							type : "TextField",
							width : "40px"			
						}];
		/** ****Copy_Change_End****** */
		
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(2);
		var rowHeight = 30;
		
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight);
		
		
		/** ****Copy_Change_Start****** */
		// filter
		config.filtersRaw = [
							
			{
				field: "PLANT", label: "Plant", type: "DropdownBox", 
				labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
				dropdownbox : {
					layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
					odata:{
						defaultSelectAll: true,
						url: oServiceUrl +"/PM_RPT_FORECAST_PLANT_DDL?$filter=ITEM_TYPE eq 'PLANT' &$format=json",
						bindTextField: "ITEM_VALUE",
						bindKeyField: "ITEM_VALUE"
					}				
				}
			},
			{
				field: "MTM", label: "MTM", type: "TextField",
				labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true})
			}			
		];
		/** ****Copy_Change_End****** */
		
		config.filters = lenovo.control.commontable.Toolkit.splitChunck(2, config.filtersRaw);
		
		
		/** ****Copy_Change_Start****** */
		// download
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.ui_pm_rpt_forecast/AT_UI_PM_RPT_FORECAST"';
		config.download.columns=
	    [		
		 "PLANT","MTM","PM_AMOUNT","UNIT","PER","UOM"
		];
		config.download.filename= "PM_RPT_FORECAST";
		/** ****Copy_Change_End****** */


		
		
		// toolbar , auth
		config.create.visible=false;
		config.deleteable.visible=false;
		config.edit.visible=false;
		config.upload.visible=false;
		config.download.visible = auth.exportable;
		config.download.roleName = auth.exportableRoleName;
		config.upload.roleName =  auth.uploadableRoleName;
		
		
		/***********************************************************************
		 * config with order by and download order by Added by Chris Gao
		 * 2015-09-24
		 **********************************************************************/
//		config.defaultSort = [{
//			field: "ITEM",
//			bDescending: false
//		}];
//		
//		config.download.defaultOrderColumn = "ITEM";
//		config.download.defaultOrderSort = "ASC";
		
		/***********************************************************************
		 * End by Chris Gao 2015-09-24
		 **********************************************************************/
		
		
		
	},
	//Navigation Setting if required
	onTreeNavigation: function(sChannel, sEvent, oData){
		/******Copy_Change_Start*******/
		if(oData.view === "Forecast PM") {
		/******Copy_Change_End*******/
			if(this.table && this.oModel) {		
				var defaultSort = lenovo.control.commontable.Table._getDefaultSort(this.config);
				var defaultFilters = lenovo.control.commontable.Table._getDefaultFilter(this.config);
				this.table.bindRows(this.config.bindRowUrl, null, defaultSort,defaultFilters);	
				var filterModel = new sap.ui.model.json.JSONModel();				
				var clearObj = this.oForm.data("clearObj");
				var obj = JSON.stringify(clearObj);
				lenovo.control.commontable.Table._clearAllFilterCondition(filterModel, this.oForm, obj);																						
			}		
		}
	}
	

});