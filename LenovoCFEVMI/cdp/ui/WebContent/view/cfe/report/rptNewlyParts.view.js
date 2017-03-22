/************************************
* Created by Chris Gao at 2015-8-28
* Version 1.0 2015-08-28
************************************/
//require what you need
/******Copy_Change_Start*******/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
jQuery.sap.require("lenovo.control.Validation");
/******Copy_Change_End*******/	

//main
/******Copy_Change_Start*******/
sap.ui.jsview("lenovo.view.cfe.report.rptNewlyParts", { 
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
		var auth = lenovo.control.commontable.Table.getViewAuth("rptNewlyParts");
		/******Copy_Change_End*******/

		//generate UI
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel); //declare ui_view configuration
		this.setConfig(config, oServiceUrl, uServiceUrl,auth);   //call private function -- ui_view configuration
		/******Copy_Change_Start*******/
		var header = lenovo.control.commontable.Table.createHeader("Report", "Newly Parts Report");
		/******Copy_Change_End*******/
		
		//set data connection
		/******Copy_Change_Start*******/
		config.bindRowUrl = "/RPT_NEWLY_PARTS";
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
//		var cycleDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Cycle")[0];
//		var partNumTextBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Part Number")[0];
		

		this.config = config;
		this.filterPanel = filterPanel;
		this.table = table;
		
		
		//generate page into app
		var page = new sap.m.Page({
	      	showHeader: false,
	      	content :[header, filterPanel, oEditDeleteUploadDownload, table] //header, filterPanel, oEditDeleteUploadDownload, table             
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
			field: "ITEM", label: "Part Number", type: "TextField", width: "100px"
		},{
			field: "PLANT", label: "Plant", type:"TextField", width: "100px"
		},{
			field: "ITEM_DESC", label: "Description", type:"TextField", width: "100px"
		},{
			field: "ITEM_TYPE", label: "Item Type", type:"TextField", width: "100px"
		},{
			field: "SYS_LAST_MODIFIED_BY", label: "Last Modified By", type:"TextField", width: "100px"
		},{
			field: "SYS_LAST_MODIFIED_DATE", label: "Last Modified Date", type:"TextField", width: "100px"
		}];
		/******Copy_Change_End*******/
		
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(2);
		var rowHeight = 30;
		
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight);
		
		
		/******Copy_Change_Start*******/
		//filter
		config.filtersRaw = [{
			field: "ITEM", label: "Part Number", type: "DropdownTable", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdowntable : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				defaultFilterOp: "EQ",
				url: oServiceUrl,
	//			selectionMode: sap.ui.table.SelectionMode.Single,
				field: "ITEM_VALUE",	
				columns: [{
					label: "Part Number",
					field: "ITEM_VALUE",
					type: "TextField"
				}],
				notRefreshTable: true,
				filters: [[{
					field: "ITEM_VALUE",
					label: "Part Number",
					type: "MultiTextField"
				}]],
				_search: {
					func: this.reloadPartNumberSearchItemDropdownTable,
					context: this
				},
				reload: {
					func: this.reloadPartNumberItemDropdownTable,
					context: this
				}
			}
		},{
			field: "PLANT", label: "Plant", type: "DropdownTable", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdowntable : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				defaultFilterOp: "EQ",
				url: oServiceUrl,
	//			selectionMode: sap.ui.table.SelectionMode.Single,
				field: "ITEM_VALUE",	
				columns: [{
					label: "Plant",
					field: "ITEM_VALUE",
					type: "TextField"
				}],
				notRefreshTable: true,
				filters: [[{
					field: "ITEM_VALUE",
					label: "Plant",
					type: "MultiTextField"
				}]],
				_search: {
					func: this.reloadPlantSearchItemDropdownTable,
					context: this
				},
				reload: {
					func: this.reloadPlantItemDropdownTable,
					context: this
				}
			}
		}];
		/******Copy_Change_End*******/
		
		config.filters = lenovo.control.commontable.Toolkit.splitChunck(2, config.filtersRaw);
		
		
		/******Copy_Change_Start*******/
		//download
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.rpt_newly_parts/CV_RPT_NEWLY_PARTS"';
		config.download.columns=["ITEM","PLANT","ITEM_DESC","ITEM_TYPE","SYS_LAST_MODIFIED_BY", "SYS_LAST_MODIFIED_DATE"];
		config.download.filename= "RPT_NEWLY_PARTS";
		/******Copy_Change_End*******/
		/******************************
		 * Added by Chris Gao
		 * 2015-09-24
		 * to do the mapping table header and download header
		 *****************************/
		config.download.url = "/cdp/common/services/getFileWithHeaderMapping.xsjs";
		config.download.mappingTableHeader = {ITEM:"PART_NUMBER",ITEM_DESC:"ITEM_DESCRIPTION"};
		/*****************************
		 * End by Chris Gao
		 ****************************/
		
		
		//toolbar , auth
		config.create.visible=false;
		config.deleteable.visible=false;
		config.edit.visible=false;
		config.upload.visible=false;
		config.download.visible = auth.exportable;
		config.download.roleName = auth.exportableRoleName;
		config.upload.roleName =  auth.uploadableRoleName;
		
		
		/******************************
		 * config with order by and download order by
		 * Added by Chris Gao
		 * 2015-09-24
		 *****************************/
		config.defaultSort = [{
			field: "ITEM",
			bDescending: false
		}];
		
		config.download.defaultOrderColumn = "ITEM";
		config.download.defaultOrderSort = "ASC";
		
		/*******************
		 * End by Chris Gao 
		 * 2015-09-24
		 *******************/
		
	},
	
	reloadPartNumberItemDropdownTable: function(dropdownTable){
		//var cycle = this.cycleDropdownBox.getValue();
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
		var bindUrl = "/RPT_NEWLY_PARTS_SEARCH_DDL?$filter=ITEM_TYPE eq 'ITEM'&$format=json";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
	reloadPartNumberSearchItemDropdownTable: function(filterModel, filterPanel, table){
		//var cycle = this.cycleDropdownBox.getValue();
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
                value1: "'ITEM'"
			})];
		}
		var bindUrl = "/RPT_NEWLY_PARTS_SEARCH_DDL?";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	
	reloadPlantItemDropdownTable: function(dropdownTable){
		//var cycle = this.cycleDropdownBox.getValue();
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
		var bindUrl = "/RPT_NEWLY_PARTS_SEARCH_DDL?$filter=ITEM_TYPE eq 'PLANT'&$format=json";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
	reloadPlantSearchItemDropdownTable: function(filterModel, filterPanel, table){
		//var cycle = this.cycleDropdownBox.getValue();
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
                value1: "'PLANT'"
			})];
		}
		var bindUrl = "/RPT_NEWLY_PARTS_SEARCH_DDL?";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},

});