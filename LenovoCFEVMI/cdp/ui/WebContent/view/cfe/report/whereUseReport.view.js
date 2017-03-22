/************************************
* Created by Chris Gao at 2015-8-18
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
sap.ui.jsview("lenovo.view.cfe.report.whereUseReport", { 
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
		var auth = lenovo.control.commontable.Table.getViewAuth("whereUseReport");
		/******Copy_Change_End*******/

		//generate UI
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel); //declare ui_view configuration
		this.setConfig(config, oServiceUrl, uServiceUrl,auth);   //call private function -- ui_view configuration
		/******Copy_Change_Start*******/
		var header = lenovo.control.commontable.Table.createHeader("Report", "Where Use Report");
		/******Copy_Change_End*******/
		
		//set data connection
		/******Copy_Change_Start*******/
		//INPUT_CYCLE_ITEM(in_cycle='CURRENT', in_partnumber='000000C25127,000000C25128')/Results
		config.bindRowUrl = "/INPUT_CYCLE_ITEM(in_cycle='CURRENT', in_partnumber='')/Results";
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
		var cycleDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Cycle")[0];
		var partNumTextBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Part Number")[0];
		
		//add import buuton
		
		var oImportBtn = new sap.ui.commons.Button({
			tooltip: "import",
			icon: "sap-icon://cause",
			lite: true,
			press: function(oEvent) {
				var uploadDialog = lenovo.control.commontable.Toolkit._createImportDiaglog(partNumTextBox, config.import, table);
				uploadDialog.open();
			}
		});
		filterPanel.addButton(oImportBtn);
		
		/*********************************
		 * Added by Chris Gao
		 * 2015-09-10
		 ********************************/
		//add download import template
		var oDownloadTemplateButton = new sap.ui.commons.Button({
			lite: true,
			icon: "sap-icon://sys-next-page",
			tooltip: "download upload template",
			press: function() {
				window.open(lenovo.control.Constants.uploadTemplatesBaseUrl + "cfe/report/Part_Number.xlsx");
			}
		}).addStyleClass("commontable-toolbar-btn");
		
		filterPanel.addButton(oDownloadTemplateButton);
		
		/*********************************
		 * End by Chris Gao
		 ********************************/
		
		this.partNumTextBox = partNumTextBox;
		this.cycleDropdownBox = cycleDropdownBox;	
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
			field: "PART_NUMBER", label: "Part Number", type: "TextField", width: "100px"
		},{
			field: "DESCRIPTION", label: "Description", type:"TextField", width: "100px"
		},{
			field: "TOP_LEVEL", label: "Top Level", type:"TextField", width: "100px"
		},{
			field: "TOP_LEVEL_TYPE", label: "Top Level Type", type:"TextField", width: "100px"
		},{
			field: "BRAND", label: "Brand", type:"TextField", width: "100px"
		},{
			field: "PROD_FAMILY", label: "Family", type:"TextField", width: "100px"
		},{
			field: "SYS_LAST_MODIFIED_BY", label: "Last Modified BY", type:"TextField", width: "100px"
		},{
			field: "SYS_LAST_MODIFIED_DATE", label: "Last Modified DATE", type:"TextField", width: "100px"
		}];
		/******Copy_Change_End*******/
		
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(1);
		var rowHeight = 30;
		
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight);
		
		
		/******Copy_Change_Start*******/
		//filter
		config.filtersRaw = [{
			field: "CYCLE", label: "Cycle", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				defaultFilterValue: "CURRENT",
				odata:{
					defaultSelectAll: false,
					url: oServiceUrl +"/UI_RPT_WHEREUSED_DDL?$filter=ITEM_TYPE%20eq%20%27CYCLE%27&$format=json",
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE"
				}				
			}
		},{
			field: "PART_NUMBER", label: "Part Number", type: "DropdownTable", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdowntable : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				defaultFilterOp: "EQ",
				url: oServiceUrl,
	//			selectionMode: sap.ui.table.SelectionMode.Single,
				field: "ITEM",	
				columns: [{
					label: "Part Number",
					field: "ITEM",
					type: "TextField"
				}],
				notRefreshTable: true,
				filters: [[{
					field: "ITEM",
					label: "Part Number",
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
		}];
		/******Copy_Change_End*******/
		
		config.filters = lenovo.control.commontable.Toolkit.splitChunck(2, config.filtersRaw);
		
		//import
		config.import = {
				url: uServiceUrl + "/ui_import_where_use_report.xsjs"
			};
		
		/******Copy_Change_Start*******/
		//download
		config.download.url = "/cdp/common/services/getFileWithTableInputParas.xsjs";
		config.download.tablewithinputpara = '"_SYS_BIC"."cdp.ebgcfe.models.rpt_where_used/CV_RPT_WHERE_USED2"';
		config.download.urlInputParas = [{item: "in_cycle", value:"", bindFilterPath:"CYCLE"},
		      			               {item: "in_partnumber", value:"", bindFilterPath:"PART_NUMBER"}];
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.rpt_where_used/CV_RPT_WHERE_USED2"';
		config.download.columns=["CYCLE","PART_NUMBER","DESCRIPTION","TOP_LEVEL","TOP_LEVEL_TYPE",
		             			"BRAND", "PROD_FAMILY", "SYS_LAST_MODIFIED_BY", "SYS_LAST_MODIFIED_DATE"];
		config.download.filename= "RPT_WHERE_USED";
		/******Copy_Change_End*******/
		
		//toolbar , auth
		config.create.visible=false;
		config.deleteable.visible=false;
		config.edit.visible=false;
		config.upload.visible=false;
		config.download.visible = auth.exportable;
		config.download.roleName = auth.exportableRoleName;
		config.upload.roleName =  auth.uploadableRoleName;
		
		/******************************
		 * config with Odata Service
		 * Added by Chris Gao
		 * 2015-08-18
		 *****************************/
		//config.bindRowUrl = "INPUT_CYCLE_ITEM(in_cycle='CURRENT', in_partnumber='000000C25127,000000C25128')/Results";
		config.searchInputs = {
			abandonFilter: true, //chris 2016-8-12
			hasInputPara: true,
			urlId : "/INPUT_CYCLE_ITEM",
			urlInputParas:[{item: "in_cycle", value:"", bindFilterPath:"CYCLE"},
			               {item: "in_partnumber", value:"", bindFilterPath:"PART_NUMBER"}]
		};
		
		
		/******************************
		 * config with order by
		 * Added by Chris Gao
		 * 2015-08-30
		 *****************************/
		config.defaultSort = [{
			field: "PART_NUMBER",
			bDescending: true
		},{
			field: "TOP_LEVEL_TYPE",
			bDescending: true
		},{
			field: "TOP_LEVEL",
			bDescending: true
		}];
		
	},
	
	reloadItemDropdownTable: function(dropdownTable){
		var cycle = this.cycleDropdownBox.getValue();
		var bindUrl = "/INPUT_CYCLE1(input_cycle='"+ cycle +"')/Results";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
	reloadSearchItemDropdownTable: function(filterModel, filterPanel, table){
		var cycle = this.cycleDropdownBox.getValue();
		var filter = filterModel.getProperty("/ITEM");
		var filterModel = null;
		if(filter.filterValue) {
			filterModel = new sap.ui.model.Filter({
				path: "ITEM",
				operator: filter.filterOperator,
				value1: filter.filterValue
			});
		}
		var bindUrl = "/INPUT_CYCLE1(input_cycle='"+ cycle +"')/Results";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
		
	
});
