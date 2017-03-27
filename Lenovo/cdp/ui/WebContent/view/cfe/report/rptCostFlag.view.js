/************************************
* Created by Chris Gao at 2015-8-19
* Version 1.0 2015-08-18
* Version 1.0
************************************/
//require what you need
/******Copy_Change_Start*******/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
jQuery.sap.require("lenovo.control.Validation");
/******Copy_Change_End*******/	

//main
/******Copy_Change_Start*******/
sap.ui.jsview("lenovo.view.cfe.report.rptCostFlag", { 
/******Copy_Change_End*******/	
	getControllerName: function() {

	},
	
	//default value
	setDefaultCycleValue: function(oServiceUrl){
		var result = "";
		$.ajax({
			url: oServiceUrl+"/RPT_COST_FLAG_SEARCH_DDL?$filter=ITEM_TYPE eq 'S_CYCLE' &$format=json",
			type: "GET",
			dataType: "json", 
			async: false,
			success: function(data){
				if(data.d.results.length > 0)
				{
					result = data.d.results[0].ITEM_VALUE;
				}
					
			}		
		});
		return result;
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
		var auth = lenovo.control.commontable.Table.getViewAuth("rptCostFlag");
		/******Copy_Change_End*******/

		//generate UI
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel); //declare ui_view configuration
		this.setConfig(config, oServiceUrl, uServiceUrl,auth);   //call private function -- ui_view configuration
		/******Copy_Change_Start*******/
		var header = lenovo.control.commontable.Table.createHeader("Report", "Cost Flag Report");
		/******Copy_Change_End*******/
		
		//set data connection
		/******Copy_Change_Start*******/
		config.bindRowUrl = "/RPT_COST_FLAG";
		/******Copy_Change_End*******/
		
		var table = lenovo.control.commontable.Table.createTable(config);
		/*********************************************************
		 * Added by Chris Gao - 2015-10-31
		 * to close the default count url called by table model
		 * default count model = "Both"
		 * because of the long waiting time of loading
		 *******************************************************/
		//oModel.setDefaultCountMode("None");
		/********************************************************
		 * End by Chris Gao
		 *******************************************************/
		table.setBusy(true);
		table.setModel(oModel);
		oModel.attachRequestCompleted(function(){
			table.setBusy(false);
		});
		
		//filter panel
		var filterPanel = lenovo.control.commontable.Table.createFilter(config, table);
		//tool bar		
		var oEditDeleteUploadDownload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table, app);
		//authorization buttons
		var buttons = oEditDeleteUploadDownload.getContent()[0].getContent();
		var editButton = null, uploadButton = null,deleteButton = null, uploadTemButton = null, viewStatusButton = null;
		for(var i = 0; i < buttons.length; i++) {
			var oTooltip = buttons[i].getTooltip();
			if(auth.editable && oTooltip === 'edit'){
				editButton = buttons[i];
				continue;
			}
			if(auth.deleteable && oTooltip === 'delete'){
				deleteButton = buttons[i];
				continue;
			}
			if(auth.uploadable){
				switch(oTooltip){
					case "upload, only xlsx and csv files are allowed":
						uploadButton = buttons[i];
						break;
					case "download upload template":
						uploadTemButton = buttons[i];
						break;
					case "view status":
						viewStatusButton = buttons[i];
						break;
				}
			}
		}
		
		var oForm = filterPanel.getContent()[0];
		/******Copy_Change_Start*******/
		var cycleDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Cycle")[0];
		
		//execute panel
		var executeConfig = {
				//formWidth: "100%",
				columns: [[{
						field: "CYCLE", label: "Cycle", type: "DropdownBox", 
						labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),  //modified by Chris Gao 2015-09-02
						dropdownbox : {
							defaultValue: "CURRENT",
							odata:{
								defaultSelectAll: false,
								bindTextField: "ITEM_VALUE",
								bindKeyField: "ITEM_VALUE",
								url: oServiceUrl+"/RPT_COST_FLAG_SEARCH_DDL?$filter=ITEM_TYPE eq 'E_CYCLE' &$format=json"
							}				
						}
				}]],
				execute: {
					func: this.execute,
					context: this
				}
		};
		var executePanel =  lenovo.control.commontable.Table.createExecutePanel(executeConfig);
		
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
		
		//generate page into app
		var page = new sap.m.Page({
	      	  showHeader: false,
	          content : [header, executePanel, filterPanel, oEditDeleteUploadDownload, table]             
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
			field: "CYCLE", label: "Cycle", type:"TextField", width: "100px"
		},{
			field: "VK", label: "VK", type:"TextField", width: "100px"
		},{
			field: "C", label: "Characteristic", type:"TextField", width: "100px"
		},{
			field: "SBB", label: "SBB", type:"TextField", width: "100px"
		},{
			field: "SBB_DESC", label: "SBB_DESC", type:"TextField", width: "100px"
		},{
			field: "SBB_TYPE", label: "SBB Type", type:"TextField", width: "100px"
		},{
			field: "COST_FLAG", label: "Cost Flag", type:"TextField", width: "100px"
		},{
			field: "SYS_CREATED_BY", label: "Created By", type:"TextField", width: "100px"
		},{
			field: "SYS_CREATED_DATE", label: "Created Date", type:"TextField", width: "100px"
		}];
		/******Copy_Change_End*******/
		
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(4);
		var rowHeight = 30;
		
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight - 20);
		
		
		/******Copy_Change_Start*******/
		//filter
		var defaultCycleValue = this.setDefaultCycleValue(oServiceUrl);
		config.filtersRaw = [{
			field: "CYCLE", label: "Cycle", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
			dropdownbox : {
				defaultFilterValue: defaultCycleValue, //comment by Chris Gao 2015-11-5 in case the ddl does not have 'current' value
				odata:{
					defaultSelectAll: true,
					url: oServiceUrl +"/RPT_COST_FLAG_SEARCH_DDL?$filter=ITEM_TYPE eq 'S_CYCLE' &$format=json",
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE"
				}				
			}
		},{
			field: "SBB", label: "SBB", type: "TextField", 
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
			textfield : {
				enabled: true			
			}
		},{
			field: "VK", label: "VK", type: "TextField", 
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
			textfield : {
				enabled: true			
			}
		},{
			field: "SBB_TYPE", label: "SBB Type", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
			dropdownbox : {
				//layout: new sap.ui.layout.GridData({span: "L9 M9 S9"}),
				odata:{
					defaultSelectAll:true,
					url: oServiceUrl +"/RPT_COST_FLAG_SEARCH_DDL?$filter=ITEM_TYPE eq 'SBB_TYPE' &$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		},{
			field: "C", label: "Characteristic", type: "DropdownTable", 
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
			dropdowntable : {
//				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				defaultFilterOp: "EQ",
				url: oServiceUrl,
				selectionMode: sap.ui.table.SelectionMode.Single,
				field: "ITEM_VALUE",	
				columns: [{
					label: "Characteristic",
					field: "ITEM_VALUE",
					type: "TextField"
				}],
				notRefreshTable: true,
				filters: [[{
					field: "ITEM_VALUE",
					label: "Characteristic",
					type: "MultiTextField"
				}]],
				_search: {
					func: this.reloadSearchCharacteristicDropdownTable,
					context: this
				},
				reload: {
					func: this.reloadCharacteristicDropdownTable,
					context: this
				}
			}
		},/*{
			field: "C", label: "Characteristic", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
			dropdownbox : {
				//layout: new sap.ui.layout.GridData({span: "L9 M9 S9"}),
				odata:{
					defaultSelectAll:true,
					url: oServiceUrl +"/RPT_COST_FLAG_SEARCH_DDL?$filter=ITEM_TYPE eq 'C' &$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		},*/{
			field: "COST_FLAG", label: "Cost Flag", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
			dropdownbox : {
				//layout: new sap.ui.layout.GridData({span: "L9 M9 S9"}),
				odata:{
					defaultSelectAll:true,
					url: oServiceUrl +"/RPT_COST_FLAG_SEARCH_DDL?$filter=ITEM_TYPE eq 'COST_FLAG' &$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		}];
		/******Copy_Change_End*******/
		
		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);
		
		
		/******Copy_Change_Start*******/
		//download
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.rpt_cost_flag/CV_RPT_COST_FLAG"';
		config.download.columns=[
			 "CYCLE","VK","C","SBB","SBB_DESC","SBB_TYPE","COST_FLAG","SYS_CREATED_BY","SYS_CREATED_DATE"];
		config.download.filename= "RPT_COST_FLAG";
		/******Copy_Change_End*******/

		//toolbar , auth
		config.create.visible=false;
		config.deleteable.visible=false;
		config.edit.visible=false;
		config.upload.visible=false;
		config.download.visible = auth.exportable;
		config.download.roleName = auth.exportableRoleName;
		
		/******************************
		 * config with order by and download order by
		 * Added by Chris Gao
		 * 2015-09-24
		 *****************************/
		config.defaultSort = [{
			field: "VK",
			bDescending: false
		}];
		
		config.download.defaultOrderColumn = "VK";
		config.download.defaultOrderSort = "ASC";
		
		/*******************
		 * End by Chris Gao 
		 * 2015-09-24
		 *******************/
	},
	
	//pending to add new requirements
	execute: function(executePanel, executeModel){
		
		/*********************************
		 * Added by Chris Gao
		 * 2015-09-11
		 *********************************/
		var oExecuteForm = executePanel.getContent()[0];
		var itemTextBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oExecuteForm, "Cycle")[0];
		
		var oLabel = new sap.ui.commons.Label({
			text: "Do you want to execute?",
			width: "350px",
		});
		sap.ui.commons.MessageBox.confirm(oLabel, function(result){
			if(result) {
				
				var data = {
						"cycle": executeModel.getProperty("/CYCLE/value"),
						"process_name": 'PRC_RPT_COST_FLAG'
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
	
	reloadCharacteristicDropdownTable: function(dropdownTable){
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
		var bindUrl = "/RPT_COST_FLAG_SEARCH_DDL?$filter=ITEM_TYPE eq 'C' &$format=json";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
	reloadSearchCharacteristicDropdownTable: function(filterModel, filterPanel, table){

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
                value1: "'C'"
			})
			];
		}
		var bindUrl = "/RPT_COST_FLAG_SEARCH_DDL?";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	
	
	//Navigation Setting if required
	onTreeNavigation: function(sChannel, sEvent, oData){
		/******Copy_Change_Start*******/
		if(oData.view === "Cost Flag Report") {
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