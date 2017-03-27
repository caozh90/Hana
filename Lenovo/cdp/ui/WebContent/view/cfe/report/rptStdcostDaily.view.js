/************************************
* Created by Chris Gao at 2015-8-24
* Version 1.0 2015-08-24
************************************/
//require what you need
/******Copy_Change_Start*******/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
jQuery.sap.require("lenovo.control.Validation");
/******Copy_Change_End*******/	

//main
/******Copy_Change_Start*******/
sap.ui.jsview("lenovo.view.cfe.report.rptStdcostDaily", { 
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
		var auth = lenovo.control.commontable.Table.getViewAuth("rptStdcostDaily");
		/******Copy_Change_End*******/

		//generate UI
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel); //declare ui_view configuration
		this.setConfig(config, oServiceUrl, uServiceUrl,auth);   //call private function -- ui_view configuration
		/******Copy_Change_Start*******/
		var header = lenovo.control.commontable.Table.createHeader("Report", "Daily StdCost Report");
		/******Copy_Change_End*******/
		
		//set data connection
		/******Copy_Change_Start*******/
		//INPUT_CYCLE_ITEM(in_cycle='CURRENT', in_partnumber='000000C25127,000000C25128')/Results
		config.bindRowUrl = "/RPT_STDCOST_DAILY";
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
					/****************************
					 * Added by Chris Gao
					 * 2015-09-13
					 ***************************/
				    [{
						field: "CYCLE", label: "Cycle", type: "TextField",
						labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
						textfield : {
							layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
							enabled : false,
							//value: "CURRENT"
						}
					}],
					/***********************
					 * End by Chris Gao
					 **********************/
					[{
						field: "ITEM", label: "Item", type: "DropdownTable", 
						labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
						dropdowntable : {
							layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
							defaultFilterOp: "EQ",
							url: oServiceUrl,
							/*******************************************************
							*custom execute panel drop down table multiple selection
							*Because execute config use toolkit._saveAndReturnInsert
							*Add by Chris Gao 
							*2015-08-26
							********************************************************/
							multiSelection: true,
							/*******************************************************
							*End by Chris Gao 
							*2015-08-26
							********************************************************/
				//			selectionMode: sap.ui.table.SelectionMode.Single,
							fields: [{
								bindByField: "ITEM",
								field: "ITEM"
							}],
							columns: [{
								label: "Item",
								field: "ITEM",
								type: "TextField"
							}],
							notRefreshTable: true,
							filters: [[{
								field: "ITEM",
								label: "Item",
								type: "MultiTextField"
							}]],
							_search: {
								func: this.reloadExecutedSearchItemDropdownTable,
								context: this
							},
							reload: {
								func: this.reloadExecutedItemDropdownTable,
								context: this
							}
						}
				}]],
				execute: {
					func: this.execute,
					context: this
				}
		};
		var executePanel =  lenovo.control.commontable.Table.createExecutePanel(executeConfig);
		
		//special request
		var oExecuteForm = executePanel.getContent()[0];
		var itemTextBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oExecuteForm, "Item")[0];
		
		/****************************
		 * Added by Chris Gao
		 * 2015-09-13
		 ***************************/
		var cycleBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oExecuteForm, "Cycle")[0];
		cycleBox.setValue("CURRENT");
		/***********************
		 * End by Chris Gao
		 **********************/
		
		//add import button
		var oImportBtn = new sap.ui.commons.Button({
			tooltip: "import",
			icon: "sap-icon://cause",
			lite: true,
			press: function(oEvent) {
				var uploadDialog = lenovo.control.commontable.Toolkit._createImportDiaglog(itemTextBox, config.import, table);
				uploadDialog.open();
			}
		});
		executePanel.addButton(oImportBtn);
		
		//add download import template
		var oDownloadTemplateButton = new sap.ui.commons.Button({
			lite: true,
			icon: "sap-icon://sys-next-page",
			tooltip: "download upload template",
			press: function() {
				window.open(lenovo.control.Constants.uploadTemplatesBaseUrl + "cfe/report/stdcost_daily_import_execute.xlsx");
			}
		}).addStyleClass("commontable-toolbar-btn");
		
		executePanel.addButton(oDownloadTemplateButton);
		
		//modified by Chris Gao 2015-09-02 change Execute Panel Color
		executePanel.addStyleClass("filter-panel ondemandRefresh-dslayout");
		
		/****************************
		 * added by Chris Gao
		 * to hide the execute buttons when no authorization
		 * 2015-09-11
		 ****************************/
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
			field: "ITEM", label: "Item", type: "TextField", width: "100px"
		},{
			field: "PLANT", label: "ECC Plant", type:"TextField", width: "100px"
		},{
			field: "ITEM_DESC", label: "Description", type:"TextField", width: "100px"
		},{
			field: "ITEM_TYPE", label: "Item Type", type:"TextField", width: "100px"
		},{
			field: "BOME", label: "Bome", type:"TextField", width: "100px"
		},{
			field: "MVA", label: "MVA", type:"TextField", width: "100px"
		},{
			field: "IFRT", label: "IFRT", type:"TextField", width: "100px"
		},{
			field: "SW", label: "SW", type:"TextField", width: "100px"
		},{
			field: "STDCOST", label: "StdCost", type:"TextField", width: "100px"
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
			field: "ITEM", label: "Item", type: "DropdownTable", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdowntable : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				defaultFilterOp: "EQ",
				url: oServiceUrl,
	//			selectionMode: sap.ui.table.SelectionMode.Single,
				field: "ITEM_VALUE",	
				columns: [{
					label: "Item",
					field: "ITEM_VALUE",
					type: "TextField"
				}],
				notRefreshTable: true,
				filters: [[{
					field: "ITEM_VALUE",
					label: "Item",
					type: "MultiTextField"
				}]],
				_search: {
					func: this.reloadSearchItemDropdownTable,
					context: this
				},
				reload: {
					func: this.reloadItemDropdownTable,
					context: this
				}
			}
		},{
			field: "PLANT", label: "ECC Plant", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				odata:{
					defaultSelectAll: true,
					url: oServiceUrl +"/RPT_STDCOST_DAILY_SEARCH_DDL?$filter=ITEM_TYPE eq 'PLANT'&$format=json",
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE"
				}				
			}
		},{
			field: "ITEM_TYPE", label: "Item Type", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				odata:{
					defaultSelectAll: true,
					url: oServiceUrl +"/RPT_STDCOST_DAILY_SEARCH_DDL?$filter=ITEM_TYPE eq 'ITEM_TYPE'&$format=json",
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE"
				}				
			}
		}];
		/******Copy_Change_End*******/
		
		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);
		
		//import
		config.import = {
				url: uServiceUrl + "/ui_daily_stdcost_report.xsjs"
			};
		
		/******Copy_Change_Start*******/
		//download
		//download
		
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.rpt_stdcost_daily/CV_RPT_STDCOST_DAILY"';
		config.download.columns=[
			 "ITEM","PLANT","ITEM_DESC","ITEM_TYPE","BOME","MVA","IFRT","SW","STDCOST","SYS_LAST_MODIFIED_DATE", "SYS_LAST_MODIFIED_BY"];
		config.download.filename= "RPT_STDCOST_DAILY";
		
		/******************************
		 * Added by Chris Gao
		 * 2015-09-24
		 * to do the mapping table header and download header
		 *****************************/
		config.download.url = "/cdp/common/services/getFileWithHeaderMapping.xsjs";
		config.download.mappingTableHeader = {PLANT:"ECC_PLANT"};
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
	
	reloadItemDropdownTable: function(dropdownTable){
		/*********************************************************
		 * Added by Chris Gao - 2015-09-10
		 * to close the default count url called by table model
		 * default count model = "Both"
		 * because of the wrong count url with filter 
		 *******************************************************/
		dropdownTable.getModel().setDefaultCountMode("None");
		/********************************************************
		 * End by Chris Gao
		 *******************************************************/
		var bindUrl = "/RPT_STDCOST_DAILY_SEARCH_DDL?$filter=ITEM_TYPE eq 'ITEM'&$format=json";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
	reloadSearchItemDropdownTable: function(filterModel, filterPanel, table){

		var filter = filterModel.getProperty("/ITEM_VALUE");
		var filterModel = null;
		if(filter.filterValue) {
			filterModel = [new sap.ui.model.Filter({
				path: "ITEM_VALUE",
				operator: filter.filterOperator,
				value1:  "'" + filter.filterValue + "'"
			}),
			new sap.ui.model.Filter({
				path: "ITEM_TYPE",
                operator: "EQ",
                value1: "'ITEM'"
			})
			];
		}
		var bindUrl = "/RPT_STDCOST_DAILY_SEARCH_DDL?";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	
	reloadExecutedItemDropdownTable: function(dropdownTable){
		
		var bindUrl = "/RPT_STDCOST_DAILY_ITEM_DDL";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
	reloadExecutedSearchItemDropdownTable: function(filterModel, filterPanel, table){

		var filter = filterModel.getProperty("/ITEM");
		var filterModel = null;
		if(filter.filterValue) {
			filterModel = new sap.ui.model.Filter({
				path: "ITEM",
				operator: filter.filterOperator,
				value1: filter.filterValue
			});
		}
		var bindUrl = "/RPT_STDCOST_DAILY_ITEM_DDL";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	
	//pending to add new requirements
	execute: function(executePanel, executeModel){
		
		var oExecuteForm = executePanel.getContent()[0];
		var itemTextBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oExecuteForm, "Item")[0];
		
		var oLabel = new sap.ui.commons.Label({
			text: "Do you want to execute?",
			width: "350px",
		});
		sap.ui.commons.MessageBox.confirm(oLabel, function(result){
			if(result) {
				
				var data = {
						"cycle": executeModel.getProperty("/CYCLE/value"), //added by Chris Gao 2015-09-14
						"item": executeModel.getProperty("/ITEM/value"),
						"process_name": 'PRC_RPT_STDCOST_DAILY'
				};
				var service = new lenovo.service.CFE();
				var logicServiceUrl = service.getEBGCfeLogic();
				var itemInput = itemTextBox.getValue();
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
						itemTextBox.setValue("");
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