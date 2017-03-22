/************************************
* Created by David Meng at 2016-3-18
* Version 1.0 2016-03-18
************************************/
//require what you need
/** ****Copy_Change_Start****** */
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
jQuery.sap.require("lenovo.control.Validation");
/** ****Copy_Change_End****** */	

// main
/** ****Copy_Change_Start****** */
sap.ui.jsview("lenovo.view.cfe.priceMask.uiInventoryReport", { 
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
		var auth = lenovo.control.commontable.Table.getViewAuth("uiInventoryReport");
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
		var header = lenovo.control.commontable.Table.createHeader("Price Mask", "Inventory Report");
		/** ****Copy_Change_End****** */
		
		// set data connection
		/** ****Copy_Change_Start****** */
		config.bindRowUrl = "/SEARCH_INVENTORY_REPORT_INFO";
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
		config.columns = [{
			               field : "OEM_NAME",
	                       label : "OEM Name",
	                       type : "TextField",
	                       width : "100px"		
                          },{
							field : "TIME_FENCE",
							label : "Time Fence",
							type : "TextField",
							width : "100px"	
						}, {
							field : "FUNCTION_TYPE",
							label : "Function Type",
							type : "TextField",
							width : "100px"	
						},  {
							field : "PROFIT_CENTER",
							label : "Profit Center",
							type : "TextField",
							width : "100px"	
						}, {
							field : "PARTS",
							label : "Parts",
							type : "TextField",
							width : "100px"			
						}, {
							field : "PARTS_DESC",
							label : "Parts Desc",
							type : "TextField",
							width : "100px"	
						}, {
							field : "OPEN_INV_QTY",
							label : "Open Inv Qty",
							type : "TextField",
							width : "100px"	
						}, {
							field : "OPEN_INV_TOTAL_INCOME",
							label : "Open Inv Total Incoming",
							type : "TextField",
							width : "100px"	
						}, {
							field : "OPEN_INV_TOTAL_COST",
							label : "Open Inv Total Cost",
							type : "TextField",
							width : "100px"	
						}, {
							field : "OPEN_INV_TOTAL_MASK",
							label : "Open Inv Total Mask",
							type : "TextField",
							width : "100px"	
						}, {
							field : "OPEN_INV_UNIT_MASK",
							label : "openr inv unit mask",
							type : "TextField",
							width : "100px"			
						},{
							field : "NEW_SALES_QTY",
							label : "New Sales Qty",
							type : "TextField",
							width : "100px"	
						}, {
							field : "NEW_SALES_TOTAL_INCOME",
							label : "New Sales Total Incoming",
							type : "TextField",
							width : "100px"			
						}, {
							field : "NEW_SALES_TOTAL_COST",
							label : "New Sales Total Cost",
							type : "TextField",
							width : "100px"		
						}, {
							field : "NEW_SALES_TOTAL_MASK",
							label : "New Sales Total Mask",
							type : "TextField",
							width : "100px"	
						}, {
							field : "NEW_SALES_UNIT_MASK",
							label : "new sales unit mask",
							type : "TextField",
							width : "100px"			
						}, {
							field : "AVAILABLE_QTY",
							label : "available qty",
							type : "TextField",
							width : "100px"			
						}, {
							field : "AVAILABLE_TOTAL_INCOME",
							label : "available total income",
							type : "TextField",
							width : "100px"			
						}, {
							field : "AVAILABLE_TOTAL_COST",
							label : "available total cost",
							type : "TextField",
							width : "100px"			
						}, {
							field : "AVAILABLE_TOTAL_MASK",
							label : "available total mask",
							type : "TextField",
							width : "100px"			
						}, {
							field : "AVAILABLE_UNIT_MASK",
							label : "available unit mask",
							type : "TextField",
							width : "100px"			
						}, {
							field : "CONSUMED_QTY",
							label : "consumed qty",
							type : "TextField",
							width : "100px"			
						}, {
							field : "CONSUMED_TOTAL_INCOME",
							label : "consumed total income",
							type : "TextField",
							width : "100px"			
						}, {
							field : "CONSUMED_TOTAL_COST",
							label : "consumed total cost",
							type : "TextField",
							width : "100px"			
						}, {
							field : "CONSUMED_TOTAL_MASK",
							label : "consumed total mask",
							type : "TextField",
							width : "100px"			
						},{
							field : "CONSUMED_UNIT_MASK",
							label : "consumed unit mask",
							type : "TextField",
							width : "100px"			
						}, {
							field : "END_INV_QTY",
							label : "end inv qty",
							type : "TextField",
							width : "100px"			
						}, {
							field : "END_INV_TOTAL_INCOME",
							label : "end inv total income",
							type : "TextField",
							width : "100px"			
						}, {
							field : "END_INV_TOTAL_COST",
							label : "end inv total cost",
							type : "TextField",
							width : "100px"			
						}, {
							field : "END_INV_TOTAL_MASK",
							label : "end inv total mask",
							type : "TextField",
							width : "100px"			
						}, {
							field : "END_INV_UNIT_MASK",
							label : "end inv total mask",
							type : "TextField",
							width : "100px"			
						}, {
							field : "TOTAL_MINUS_INVENTORY",
							label : "total minus inventory",
							type : "TextField",
							width : "100px"			
						}, {
							field : "STATUS",
							label : "status",
							type : "TextField",
							width : "100px"			
						}, {
							field : "USER_ACTION",
							label : "user action",
							type : "TextField",
							width : "100px"			
						}, {
							field : "SYS_CREATED_BY",
							label : "created by",
							type : "TextField",
							width : "100px"			
						}, {
							field : "SYS_CREATED_DATE",
							label : "created date",
							type : "TextField",
							width : "100px"			
						}, {
							field : "SYS_LAST_MODIFIED_BY",
							label : "last modified by",
							type : "TextField",
							width : "100px"			
						}, {
							field : "SYS_LAST_MODIFIED_DATE",
							label : "last modified date",
							type : "TextField",
							width : "100px"			
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
				field: "OEM_NAME", label: "OEM Name", type: "DropdownBox", 
				labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
				dropdownbox : {
					layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
					odata:{
						defaultSelectAll: true,
						url: oServiceUrl +"/SEARCH_INVENTORY_REPORT_DDL?$filter=ITEM_TYPE eq 'OEM_NAME' &$format=json",
						bindTextField: "ITEM_VALUE",
						bindKeyField: "ITEM_VALUE"
					}				
				}
			},
			{
				field: "PROFIT_CENTER", label: "Profit Center", type: "DropdownBox", 
				labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
				dropdownbox : {
					layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
					odata:{
						defaultSelectAll: true,
						url: oServiceUrl +"/SEARCH_INVENTORY_REPORT_DDL?$filter=ITEM_TYPE eq 'PROFIT_CENTER' &$format=json",
						bindTextField: "ITEM_VALUE",
						bindKeyField: "ITEM_VALUE"
					}				
				}
			},			
			{
				field: "TIME_FENCE", label: "Time Fence", type: "DropdownBox", 
				labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
				dropdownbox : {
					layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
					odata:{
						defaultSelectAll: true,
						url: oServiceUrl +"/SEARCH_INVENTORY_REPORT_DDL?$filter=ITEM_TYPE eq 'TIME_FENCE' &$format=json",
						bindTextField: "ITEM_VALUE",
						bindKeyField: "ITEM_VALUE"
					}				
				}
			},	
			{
				field: "PARTS", label: "Parts", type: "TextField",
				labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true})
			}			
		];
		/** ****Copy_Change_End****** */
		
		config.filters = lenovo.control.commontable.Toolkit.splitChunck(2, config.filtersRaw);
		
		
		/** ****Copy_Change_Start****** */
		// download
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.ui_inventory_report/UI_INVENTORY_REPORT_INFO"';
		config.download.columns=
	    [		
		 "OEM_NAME",
							"TIME_FENCE",
							"FUNCTION_TYPE",
							 "PROFIT_CENTER",
							"PARTS",
							"PARTS_DESC",
							"OPEN_INV_QTY",
							"OPEN_INV_TOTAL_INCOME",
							"OPEN_INV_TOTAL_COST",
							"OPEN_INV_TOTAL_MASK",
							"OPEN_INV_UNIT_MASK",
							"NEW_SALES_QTY",
							"NEW_SALES_TOTAL_INCOMe",
							"NEW_SALES_TOTAL_COST",
							"NEW_SALES_TOTAL_MASK",
						
							"NEW_SALES_UNIT_MASK",
							"AVAILABLE_QTY",
							"AVAILABLE_TOTAL_INCOME",
							"AVAILABLE_TOTAL_COST",
							"AVAILABLE_TOTAL_MASK",
							"AVAILABLE_UNIT_MASK",
							"CONSUMED_QTY",
							"CONSUMED_TOTAL_INCOME",
							"CONSUMED_TOTAL_COST",
							"CONSUMED_TOTAL_MASK",
							"CONSUMED_UNIT_MASK",
							"END_INV_QTY",
							"END_INV_TOTAL_INCOME",
							"END_INV_TOTAL_COST",
							"END_INV_TOTAL_MASK",
							"END_INV_UNIT_MASK",
							"TOTAL_MINUS_INVENTORY",
							"STATUS",
							"USER_ACTION",
							"SYS_CREATED_BY",
							"SYS_CREATED_DATE",
							"SYS_LAST_MODIFIED_BY",
							"SYS_LAST_MODIFIED_DATE"
							
		];
		config.download.filename= "INVENTORY_REPORT";
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
	

});