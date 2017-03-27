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
sap.ui.jsview("lenovo.view.cfe.report.rptCtcNewMaterial", { 
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
		var auth = lenovo.control.commontable.Table.getViewAuth("rptCtcNewMaterial");
		/******Copy_Change_End*******/

		//generate UI
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel); //declare ui_view configuration
		this.setConfig(config, oServiceUrl, uServiceUrl,auth);   //call private function -- ui_view configuration
		/******Copy_Change_Start*******/
		var header = lenovo.control.commontable.Table.createHeader("Report", "CTC New Material Report");
		/******Copy_Change_End*******/
		
		//set data connection
		/******Copy_Change_Start*******/
		//INPUT_CYCLE_ITEM(in_cycle='CURRENT', in_partnumber='000000C25127,000000C25128')/Results
		config.bindRowUrl = "/RPT_CTC_NEW_MATERIAL";
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
				     [{
						field: "CYCLE", label: "Cycle", type: "DropdownBox", 
						labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),  //modified by Chris Gao 2015-09-02
						dropdownbox : {
							defaultValue: "CURRENT",
							odata:{
								defaultSelectAll: false,
								bindTextField: "ITEM_VALUE",
								bindKeyField: "ITEM_VALUE",
								url: oServiceUrl+"/RPT_CTC_NEW_MATERIAL_SEARCH_DDL?$filter=ITEM_TYPE eq 'CYCLE' &$format=json"
							}				
						}
				     }],  
				     [{
						field: "DELTA_CYCLE", label: "Delta to Cycle", type: "DropdownBox", 
						labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),  //modified by Chris Gao 2015-09-02
						dropdownbox : {
							defaultValue: "CURRENT",
							odata:{
								defaultSelectAll: false,
								bindTextField: "ITEM_VALUE",
								bindKeyField: "ITEM_VALUE",
								url: oServiceUrl+"/RPT_CTC_NEW_MATERIAL_SEARCH_DDL?$filter=ITEM_TYPE eq 'CYCLE' &$format=json"
							}				
						}
				}]],
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
			field: "CYCLE", label: "Cycle", type: "TextField", width: "100px"
		},{
			field: "DELTA_CYCLE", label: "Delta to Cycle", type:"TextField", width: "100px"
		},{
			field: "BRAND", label: "Brand", type:"TextField", width: "100px"
		},{
			field: "FAMILY", label: "Family", type:"TextField", width: "100px"
		},{
			field: "MODEL", label: "Model", type:"TextField", width: "100px"
		},{
			field: "ITEM_TYPE", label: "Item Type", type:"TextField", width: "100px"
		},{
			field: "ITEM_DESC", label: "Description", type:"TextField", width: "100px"
		},{
			field: "EOL_STATUS", label: "EOL_STATUS", type:"TextField", width: "100px"
		},{
			field: "SYS_LAST_MODIFIED_BY", label: "Last Modified BY", type:"TextField", width: "100px"
		},{
			field: "SYS_LAST_MODIFIED_DATE_CHAR", label: "Last Modified DATE", type:"TextField", width: "100px"
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
					url: oServiceUrl +"/RPT_CTC_NEW_MATERIAL_SEARCH_DDL?$filter=ITEM_TYPE eq 'CYCLE'&$format=json",
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE"
				}				
			}
		},{			
			field: "DELTA_CYCLE", label: "Delta to Cycle", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				odata:{
					defaultSelectAll: true,
					url: oServiceUrl +"/RPT_CTC_NEW_MATERIAL_SEARCH_DDL?$filter=ITEM_TYPE eq 'CYCLE'&$format=json",
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
					url: oServiceUrl +"/RPT_CTC_NEW_MATERIAL_SEARCH_DDL?$filter=ITEM_TYPE eq 'BRAND'&$format=json",
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
					url: oServiceUrl +"/RPT_CTC_NEW_MATERIAL_SEARCH_DDL?$filter=ITEM_TYPE eq 'FAMILY'&$format=json",
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE"
				}				
			}
		},{
			field: "MODEL", label: "MODEL", type: "DropdownTable", 
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
					func: this.reloadSearchModelDropdownTable,
					context: this
				},
				reload: {
					func: this.reloadModelDropdownTable,
					context: this
				}
			}
		},{
			field: "ITEM_TYPE", label: "Item Type", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				odata:{
					defaultSelectAll: true,
					url: oServiceUrl +"/RPT_CTC_NEW_MATERIAL_SEARCH_DDL?$filter=ITEM_TYPE eq 'ITEM_TYPE'&$format=json",
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
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.rpt_ctc_new_material/CV_RPT_CTC_NEW_MATERIAL"';
		/******************************
		 * Added by cui yue
		 * 2015-09-29
		 * add download columns
		 *****************************/

		
		config.download.columns=[
			 "CYCLE","DELTA_CYCLE","BRAND","FAMILY","MODEL","ITEM_TYPE","ITEM_DESC","EOL_STATUS","SYS_LAST_MODIFIED_DATE", "SYS_LAST_MODIFIED_BY"];

		config.download.filename= "RPT_CTC_NEW_MATERIAL";
		
		/******************************
		 * Added by Chris Gao
		 * 2015-09-24
		 * to do the mapping table header and download header
		 *****************************/
		config.download.url = "/cdp/common/services/getFileWithHeaderMapping.xsjs";
		config.download.mappingTableHeader = {};
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
	reloadModelDropdownTable: function(dropdownTable){
		/*********************************************************
		 * Added by Chris Gao - 2015-09-09
		 * to close the default count url called by table model
		 * default count model = "Both"
		 * because of the wrong count url with filter 
		 *******************************************************/
		dropdownTable.getModel().setDefaultCountMode("None");
		/********************************************************
		 * End by Chris Gao
		 *******************************************************/
		var bindUrl = "/RPT_CTC_NEW_MATERIAL_SEARCH_DDL?$filter=ITEM_TYPE eq 'MODEL'&$format=json";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
	reloadSearchModelDropdownTable: function(filterModel, filterPanel, table){

		var filter = filterModel.getProperty("/ITEM_VALUE");
		var filterModel = null;
		if(filter.filterValue) {
			filterModel = [new sap.ui.model.Filter({
				path: "ITEM_VALUE",
				operator: filter.filterOperator,
				value1: "'" + filter.filterValue + "'"
			}),
			new sap.ui.model.Filter({
				path: "ITEM_TYPE",
                operator: "EQ",
                value1: "'MODEL'"
			})];
		}
		var bindUrl = "/RPT_CTC_NEW_MATERIAL_SEARCH_DDL?";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	//pending to add new requirements
	execute: function(executePanel, executeModel){
		
		var oExecuteForm = executePanel.getContent()[0];
		var itemTextBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oExecuteForm, "Delta to Cycle")[0];
		
		var oLabel = new sap.ui.commons.Label({
			text: "Do you want to execute?",
			width: "350px",
		});
		sap.ui.commons.MessageBox.confirm(oLabel, function(result){
			if(result) {
				
				var data = {
						"cycle": executeModel.getProperty("/CYCLE/value"), //added by Chris Gao 2015-09-14
						"delta_cycle": executeModel.getProperty("/DELTA_CYCLE/value"),
						"process_name": 'PRC_RPT_CTC_NEW_MATERIAL'
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