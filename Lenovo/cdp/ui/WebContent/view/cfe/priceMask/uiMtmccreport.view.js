/************************************
* Created by zhengyq7 at 2016-3-22
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
sap.ui.jsview("lenovo.view.cfe.priceMask.uiMtmccreport", { 
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
		var auth = lenovo.control.commontable.Table.getViewAuth("uiMtmccreport");
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
		var header = lenovo.control.commontable.Table.createHeader("Price Mask", "PM Consumption Report");
		/** ****Copy_Change_End****** */
		
		// set data connection
		/** ****Copy_Change_Start****** */
		config.bindRowUrl = "/SEARCH_MTM_CC_INFO";
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
                          }, {
							field : "PROFIT_CENTER",
							label : "Profit Center",
							type : "TextField",
							width : "100px"	
						}, {
							field : "TIME_FENCE",
							label : "Time Fence",
							type : "TextField",
							width : "100px"	
						}, {
							field : "FUNCTION_TYPE",
							label : "Function Type",
							type : "TextField",
							width : "100px"	
						}, {
							field : "MTM_NO",
							label : "MTM NO",
							type : "TextField",
							width : "100px"	
						}, {
							field : "MTM_DESC",
							label : "MTM DESC",
							type : "TextField",
							width : "100px"	
						}, {
							field : "MTM_GR_QTY",
							label : "MTM GR QTY",
							type : "TextField",
							width : "100px"		
						}, {
							field : "PARTS_NO",
							label : "Parts NO",
							type : "TextField",
							width : "100px"			
						}, {
							field : "PARTS_DESC",
							label : "Parts Desc",
							type : "TextField",
							width : "100px"	
						}, {
							field : "USAGE",
							label : "Usage",
							type : "TextField",
							width : "100px"		
						},{
							field : "PARTS_STANDARD_QTY",
							label : "PARTS STANDARD QTY",
							type  : "TextField",
							width :	"100px"
						}, {
							field : "PARTS_CONSUMED_QTY",
							label : "PARTS CONSUMED QTY",
							type : "TextField",
							width : "100px"			
						}, {
							field : "PARTS_SHORT_QTY",
							label : "PARTS SHORT QTY",
							type : "TextField",
							width : "100px"	
						},{
							
							field : "SALES_PRICE",
							label : "Sales Price",
							type : "TextField",
							width : "100px"	
						}, {
							field : "COST_PRICE",
							label : "Cost Price",
							type : "TextField",
							width : "100px"	
						}, {
							field : "UNIT_PRICE_MASK",
							label : "UNIT PRICE MASK",
							type : "TextField",
							width : "100px"		
						}, {
							field : "PARTS_TOTAL_MASK",
							label : "PARTS TOTAL MASK",
							type : "TextField",
							width : "100px"	
						}, {
							field : "UNIT_MTM_PRICE_MASK",
							label : "UNIT MTM PRICE MASK",
							type : "TextField",
							width : "100px"
						}, {
							field : "TOTAL_PARTS_CONSUMED_MASK",
							label : "TOTAL PARTS CONSUMED MASK",
							type : "TextField",
							width : "100px"		
						}, {
							field : "TOTAL_MTM_PRICE_MASK",
							label : "TOTAL MTM PRICE MASK",
							type : "TextField",
							width : "100px"		
						}, {
							field : "MASK_PERCENTAGE",
							label : "MASK PERCENTAGE",
							type : "TextField",
							width : "100px"		
						}, {
							field : "STATUS",
							label : "STATUS",
							type : "TextField",
							width : "100px"		
						}, {
							field : "USER_ACTION",
							label : "USER ACTION",
							type : "TextField",
							width : "100px"		
						}, {
							field : "SYS_CREATED_BY",
							label : "SYS CREATED BY",
							type : "TextField",
							width : "100px"	
						}, {
							field : "SYS_CREATED_DATE",
							label : "SYS CREATED DATE",
							type : "TextField",
							width : "100px"	
						}, {
							field : "SYS_LAST_MODIFIED_BY",
							label : "SYS LAST MODIFIED BY",
							type : "TextField",
							width : "100px"	
						}, {
							field : "SYS_LAST_MODIFIED_DATE",
							label : "SYS LAST MODIFIED DATE",
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
						url: oServiceUrl +"/SEARCH_MTM_CC_REPORT_DDL?$filter=ITEM_TYPE eq 'OEM_NAME' &$format=json",
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
						url: oServiceUrl +"/SEARCH_MTM_CC_REPORT_DDL?$filter=ITEM_TYPE eq 'PROFIT_CENTER' &$format=json",
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
						url: oServiceUrl +"/SEARCH_MTM_CC_REPORT_DDL?$filter=ITEM_TYPE eq 'TIME_FENCE' &$format=json",
						bindTextField: "ITEM_VALUE",
						bindKeyField: "ITEM_VALUE"
					}				
				}
			},	
			{
				field: "MTM_NO", label: "MTM NO", type: "TextField",
				labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true})
			}			
		];
		/** ****Copy_Change_End****** */
		
		config.filters = lenovo.control.commontable.Toolkit.splitChunck(2, config.filtersRaw);
		
		
		/** ****Copy_Change_Start****** */
		// download
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.ui_mtm_cc_report/cv_mtm_cc_info"';
		config.download.columns=
	    [ "OEM_NAME", "PROFIT_CENTER",
							"TIME_FENCE",
							"FUNCTION_TYPE",
							
							"MTM_NO",
							"MTM_DESC",
							"MTM_GR_QTY",
							"PARTS_NO",
							"PARTS_DESC",
							"USAGE",
							"PARTS_STANDARD_QTY",
							"PARTS_CONSUMED_QTY",
							"PARTS_SHORT_QTY",
							"SALES_PRICE",
							"COST_PRICE",
							"UNIT_PRICE_MASK",
							"PARTS_TOTAL_MASK",
							"UNIT_MTM_PRICE_MASK",
							"TOTAL_PARTS_CONSUMED_MASK",
							"TOTAL_MTM_PRICE_MASK",
							"MASK_PERCENTAGE",
							"STATUS",
							"USER_ACTION",
							"SYS_CREATED_BY",
							"SYS_CREATED_DATE",
							"SYS_LAST_MODIFIED_BY",
							"SYS_LAST_MODIFIED_DATE"
		];
		config.download.filename= "MTM-Characters Consumption Report";
		/** ****Copy_Change_End****** */


		
		
		// toolbar , auth
		config.create.visible=false;
		config.deleteable.visible=false;
		config.edit.visible=false;
		config.upload.visible=false;
		config.download.visible = auth.exportable;
		config.download.roleName = auth.exportableRoleName;
		config.upload.roleName =  auth.uploadableRoleName;
		
		
	},
	

});