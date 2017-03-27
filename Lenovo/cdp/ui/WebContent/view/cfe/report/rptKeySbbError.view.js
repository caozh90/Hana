/************************************
* Created by zehan bian at 2016-2-3
* Version 1.0 2016-2-3
************************************/
//require what you need
/******Copy_Change_Start*******/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
jQuery.sap.require("lenovo.control.Validation");
/******Copy_Change_End*******/	

//main
/******Copy_Change_Start*******/
sap.ui.jsview("lenovo.view.cfe.report.rptKeySbbError", { 
/******Copy_Change_End*******/	
	getControllerName: function() {

	},
	
	//Create Page Content including all the UI items
	createContent: function(){
		
		//declare app
		var app = new sap.m.App();
		//declare service url
		var service = new lenovo.service.CFE();
		var oServiceUrl = service.getEBGCfe();        //model service url
		var uServiceUrl = service.getEBGCfeUpload();  //upload service url
		
		//declare model 
		var oModel = new sap.ui.model.odata.ODataModel(oServiceUrl, true);
		//declare authorization
		/******Copy_Change_Start*******/
		var auth = lenovo.control.commontable.Table.getViewAuth("rptKeySbbError");
		/******Copy_Change_End*******/

		//generate UI
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel); //declare ui_view configuration
		this.setConfig(config, oServiceUrl, uServiceUrl,auth);   //call private function -- ui_view configuration
		/******Copy_Change_Start*******/
		var header = lenovo.control.commontable.Table.createHeader("Report", "Key SBB Error Report");
		/******Copy_Change_End*******/
		
		//set data connection
		/******Copy_Change_Start*******/
		//INPUT_CYCLE_ITEM(in_cycle='CURRENT', in_partnumber='000000C25127,000000C25128')/Results
		config.bindRowUrl = "/RPT_KEYSBB_ERROR";
		/******Copy_Change_End*******/
		var table = lenovo.control.commontable.Table.createTable(config);
		table.setBusy(true);
		table.setModel(oModel);
		oModel.attachRequestCompleted(function(){
			table.setBusy(false);
		});

		
		//filter panel
		var filterPanel = lenovo.control.commontable.Table.createFilter(config, table);
		//tool bar		
		var oEditDeleteUploadDownload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table, app);
		
		
		var oForm = filterPanel.getContent()[0];
		/******Copy_Change_Start*******/
		
		//execute panel
		var executeConfig = {
				formWidth: "66.6%",
				columns: [
				     /************************************
				      * Added by Chris Gao
				      * 2015-09-14
				      ***********************************/
//				     [{
//						field: "CYCLE", label: "Cycle", type: "DropdownBox", 
//						labelLayout: new sap.ui.layout.GridData({span: "L2 M2 S2", linebreak: true}),  //modified by Chris Gao 2015-09-02
//						dropdownbox : {
//							defaultValue: "CURRENT",
//							odata:{
//								defaultSelectAll: false,
//								bindTextField: "ITEM_VALUE",
//								bindKeyField: "ITEM_VALUE",
//								url: oServiceUrl+"/RPT_KEYSBB_ERROR_SEARCH_DDL?$filter=ITEM_TYPE eq 'CYCLE' &$format=json"
//							}				
//						}
//				     }]
				     ],
				execute: {
					func: this.execute,
					context: this
				}
		};
		var executePanel =  lenovo.control.commontable.Table.createExecutePanel(executeConfig);

		if(auth.executeable)
		{
			var buttons = executePanel.getButtons();
			for(var i = 0; i < buttons.length; i++) 
			{
				buttons[i].setVisible(true);
			}
		}
		else
		{
			var buttons = executePanel.getButtons();
			for(var i = 0; i < buttons.length; i++) 
			{
				buttons[i].setVisible(false);
			}
		}
		/****************************
		 * End by Chris Gao
		 * 2015-09-11
		 ****************************/
		
		this.config = config;
		this.filterPanel = filterPanel;
		this.table = table;
		
		//generate page into app
		var page = new sap.m.Page({
	      	showHeader: false,
	      	content :[header, executePanel, filterPanel, oEditDeleteUploadDownload, table]             
	    });
       app.insertPage(page);
       app.setInitialPage(page);
       return app;	
		
	},
										

	//private function -- ui_view columns configuration
	setConfig: function(config, oServiceUrl, uServiceUrl, auth) {
		
		//table columns setting
		/******Copy_Change_Start*******/
		config.columns = [{
			field: "BRAND", label: "Brand", type: "TextField", width: "100px"
		},{
			field: "FAMILY", label: "Family", type:"TextField", width: "100px"
		},{
			field: "PLANT", label: "Plant", type:"TextField", width: "100px"
		},{
			field: "PART_NUMBER", label: "Part Number", type:"TextField", width: "100px"
		},{
			field: "BASIC_NAME", label: "BASIC_NAME", type:"TextField", width: "100px"
		},{
			field: "REASON", label: "REASON", type:"TextField", width: "100px"
		},{
			field: "DESCRIPTION", label: "Description", type:"TextField", width: "100px"
		},{
			field: "COMMODITY", label: "COMMODITY", type:"TextField", width: "100px"
		},{
			field: "COST", label: "COST", type:"TextField", width: "100px"
		},{
			field: "REASON_ID", label: "REASON ID", type:"TextField", width: "100px"
		},{
			field: "SYS_LAST_MODIFIED_BY", label: "Last Modified BY", type:"TextField", width: "100px"
		},{
			field: "SYS_LAST_MODIFIED_DATE", label: "Last Modified DATE", type:"TextField", width: "100px"
		}];
		/******Copy_Change_End*******/
		
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(4);
		var rowHeight = 30;
		
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight-20);
		
		
		/******Copy_Change_Start*******/
		//filter
		config.filtersRaw = [{
			field: "CYCLE", label: "Cycle", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				odata:{
					defaultSelectAll: true,
					url: oServiceUrl +"/RPT_KEYSBB_ERROR_SEARCH_DDL?$filter=ITEM_TYPE eq 'CYCLE'&$format=json",
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE"
				}				
			}
		},{
			field: "BRAND", label: "Brand", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				odata:{
					defaultSelectAll: true,
					url: oServiceUrl +"/RPT_KEYSBB_ERROR_SEARCH_DDL?$filter=ITEM_TYPE eq 'BRAND'&$format=json",
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE"
				}				
			}
		},{
			field: "FAMILY", label: "Family", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				odata:{
					defaultSelectAll: true,
					url: oServiceUrl +"/RPT_KEYSBB_ERROR_SEARCH_DDL?$filter=ITEM_TYPE eq 'FAMILY'&$format=json",
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE"
				}				
			}
		},{
			field: "PLANT", label: "Plant", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				odata:{
					defaultSelectAll: true,
					url: oServiceUrl +"/RPT_KEYSBB_ERROR_SEARCH_DDL?$filter=ITEM_TYPE eq 'PLANT'&$format=json",
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE"
				}				
			}
		},{
			field: "PART_NUMBER", label: "Part Number", type: "TextField"
		},{
			field: "BASIC_NAME", label: "Basic Name", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				odata:{
					defaultSelectAll: true,
					url: oServiceUrl +"/RPT_KEYSBB_ERROR_SEARCH_DDL?$filter=ITEM_TYPE eq 'BASIC_NAME'&$format=json",
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE"
				}				
			}
		},{
			field: "REASON", label: "Reason", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				odata:{
					defaultSelectAll: true,
					url: oServiceUrl +"/RPT_KEYSBB_ERROR_SEARCH_DDL?$filter=ITEM_TYPE eq 'REASON'&$format=json",
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE"
				}				
			}
		},{
			field: "REASON_ID", label: "Reason ID", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				odata:{
					defaultSelectAll: true,
					url: oServiceUrl +"/RPT_KEYSBB_ERROR_SEARCH_DDL?$filter=ITEM_TYPE eq 'REASON_ID'&$format=json",
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE"
				}				
			}
		}];
		/******Copy_Change_End*******/
		
		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);

		/******Copy_Change_Start*******/
		//download
		//download
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.rpt_key_sbb_error/CV_RPT_KEYSBB_ERROR"';
		/******************************
		 * Added by cui yue
		 * 2015-09-29
		 * add download columns
		 *****************************/

		
		config.download.columns=[
			 "CYCLE","BRAND","FAMILY","PLANT","PART_NUMBER","BASIC_NAME","REASON","DESCRIPTION","COMMODITY","COST","REASON_ID"];

		config.download.filename= "RPT_KEYSBB_ERROR";
		
		/******************************
		 * Added by Chris Gao
		 * 2015-09-24
		 * to do the mapping table header and download header
		 *****************************/
		config.download.url = "/cdp/common/services/getFileWithHeaderMapping.xsjs";
		config.download.mappingTableHeader = {CYCLE:"Cycle",FAMILY:"ASP_PRD_FAMILY"};
		/*****************************
		 * End by Chris Gao
		 ****************************/
		/******Copy_Change_End*******/
		
		
		//toolbar , auth
		config.create.visible=false;
		config.deleteable.visible=false;
		config.edit.visible=false;
		config.upload.visible=false;
		config.download.visible = auth.exportable;
		config.download.roleName = auth.exportableRoleName;
		config.upload.roleName =  auth.uploadableRoleName;
		
	},
	//pending to add new requirements
	execute: function(executePanel, executeModel){
		
		var oExecuteForm = executePanel.getContent()[0];
		//var itemTextBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oExecuteForm, "Delta to Cycle")[0];
		
		var oLabel = new sap.ui.commons.Label({
			text: "Do you want to execute?",
			width: "350px",
		});
		sap.ui.commons.MessageBox.confirm(oLabel, function(result){
			if(result) {
				
				var data = {
						"cycle": 'EBG', //added by Chris Gao 2015-09-14 executeModel.getProperty("/CYCLE/value")
						"process_name": 'PRC_RPT_KEYSBB_ERROR'
				};
				var service = new lenovo.service.CFE();
				var logicServiceUrl = service.getEBGCfeLogic();
				//var itemInput = itemTextBox.getValue();
				executePanel.setBusy(true);
				
				$.ajax({
					url: logicServiceUrl+"/report.xsjs",
					data: data,
					type: "get",
					contentType: "text",
					success: function(data){
						executePanel.setBusy(false);
						/********************************
						 * Modified by Chris Gao
						 * 2015-09-11
						 *******************************/
						var resultMsg = "";
						if(data != "SUCCESSFUL")
						{
							resultMsg = data;
							lenovo.control.commontable.Toolkit.showErrorMsg(resultMsg, "ERROR", "Execute");
						}
						else
						{
							resultMsg = "Successfully execute";
							lenovo.control.commontable.Toolkit.showErrorMsg(resultMsg, "SUCCESS", "Execute");
						}
						//itemTextBox.setValue("");
						/********************************
						 * End by Chris Gao
						 * 2015-09-11
						 *******************************/
					},
					error: function(err){
						err = err && err.responseText ;
						executePanel.setBusy(false);
						if(!(typeof err === "string"))
							err = JSON.stringify(err);
						lenovo.control.commontable.Toolkit.showErrorMsg(err, "ERROR", "Execute");			
					}
				});
			}
		}, 	"Confirm");	
	},
	
	
});