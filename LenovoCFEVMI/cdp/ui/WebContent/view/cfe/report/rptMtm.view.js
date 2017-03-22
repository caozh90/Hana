
/******Copy_Change_Start*******/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
jQuery.sap.require("lenovo.control.Validation");
/******Copy_Change_End*******/	

//main
/******Copy_Change_Start*******/
sap.ui.jsview("lenovo.view.cfe.report.rptMtm", { 
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
		var logicServiceUrl = service.getEBGCfeLogic();
		
		//declare model 
		var oModel = new sap.ui.model.odata.ODataModel(oServiceUrl, true);
		//declare authorization
		/******Copy_Change_Start*******/
		var auth = lenovo.control.commontable.Table.getViewAuth("rptMtm");
		/******Copy_Change_End*******/

		//generate UI
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel); //declare ui_view configuration
		this.setConfig(config, oServiceUrl, uServiceUrl,auth);   //call private function -- ui_view configuration
		/******Copy_Change_Start*******/
		var header = lenovo.control.commontable.Table.createHeader("Report", "Month to Month Report");
		/******Copy_Change_End*******/
		
		//set data connection
		/******Copy_Change_Start*******/
		//INPUT_CYCLE_ITEM(in_cycle='CURRENT', in_partnumber='000000C25127,000000C25128')/Results
		config.bindRowUrl = "/RPT_MTM";
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
				formWidth: "100%",
				columns: [
				     [{
						field: "CYCLEA", label: "Cycle A", type: "DropdownBox", 
						required: true,
						validation: [{
							validType: lenovo.control.Validation.require,
							errMsg: "CYCLEA is required!"
						}],
						labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}), 
						dropdownbox : {
							defaultValue: "CURRENT",
							odata:{
								defaultSelectAll: false,
								bindTextField: "ITEM_VALUE",
								bindKeyField: "ITEM_VALUE",
								url: oServiceUrl+"/RPT_MTM_E_CYCLE_DDL?$filter=ITEM_TYPE eq 'CYCLE' &$orderby=ITEM_VALUE desc &$format=json"
							}				
						}
				     }],  
				     [{
						field: "MONTHA", label: "Month A", type: "DropdownBox", 
						required: true,
						validation: [{
							validType: lenovo.control.Validation.require,
							errMsg: "MONTHA is required!"
						}],
						labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}), 
						dropdownbox : {
							layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
							odata:{
								defaultSelectAll: false,
								bindTextField: "ITEM_VALUE",
								bindKeyField: "ITEM_VALUE",
								url: oServiceUrl+"/IN_RPT_MTM_E_MONTH_DDL(IN_CYCLE='CURRENT')/Results?$filter=ITEM_TYPE eq 'MONTH' &$orderby=SEQ asc &$format=json"
							}					
						}
					 }],
					 [{
						field: "CYCLEB", label: "Cycle B", type: "DropdownBox", 
						required: true,
						validation: [{
							validType: lenovo.control.Validation.require,
							errMsg: "CYCLEB is required!"
						}],
						labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}), 
						dropdownbox : {
							defaultValue: "CURRENT",
							odata:{
								defaultSelectAll: false,
								bindTextField: "ITEM_VALUE",
								bindKeyField: "ITEM_VALUE",
								url: oServiceUrl+"/RPT_MTM_E_CYCLE_DDL?$filter=ITEM_TYPE eq 'CYCLE' &$orderby=ITEM_VALUE desc &$format=json"
							}				
						}
					  }],
					  [{
						field: "MONTHB", label: "Month B", type: "DropdownBox", 
						required: true,
						validation: [{
							validType: lenovo.control.Validation.require,
							errMsg: "MONTHB is required!"
						}],
						labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}), 
						dropdownbox : {
							layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
							odata:{
								defaultSelectAll: false,
								bindTextField: "ITEM_VALUE",
								bindKeyField: "ITEM_VALUE",
								url: oServiceUrl+"/IN_RPT_MTM_E_MONTH_DDL(IN_CYCLE='CURRENT')/Results?$filter=ITEM_TYPE eq 'MONTH' &$orderby=SEQ asc &$format=json"
							}					
						}
					  }]
					   ],
				execute: {
					func: this.execute,
					context: this
				},
				
				batchexecute:{
					header:"Month to Month Report",
				    subheader:"Batch Execute",
					visible: auth.exportable,
					forBatchDownload: true,
					uploadHistoryConfig: {
						url: oServiceUrl,
						bindRowUrl: "/INPUT_RPT_MTM_BATCH_EXECUTE(IN_REPORT_NAME='RPT_MTM')/Results",
						defaultSort:[{
							field: "ITEM",
							bDescending: true
						},{
							field: "MT",
							bDescending: true
						},{
							field: "FAMILY",
							bDescending: true
						}],
						columns:[{
							label: "ITEM",
							field: "ITEM",
							type: "TextField"
						},{
							label: "MT",
							field: "MT",
							type: "TextField"
						},{
							label: "FAMILY",
							field: "FAMILY",
							type: "TextField"
						}]
						//selectionMode: sap.ui.table.SelectionMode.Single
					},
					mentionLabel: "Only one column need to be maintained per entry",
					deleteConfig:{
						url: logicServiceUrl + "/rpt_mtm_batch_execute_delete.xsjs",
						fields:["ITEM","MT","FAMILY"]
					},
					deleteAllConfig:{
						url: logicServiceUrl + "/ui_delete_all_with_report_name.xsjs",
						reportname: "RPT_MTM",
						tablename: "UI_RPT_MODELLIST"
					},
					upload: {
							url: uServiceUrl + "/rpt_mtm_batch_upload.xsjs",
							excelUrl: "cfe/report/rpt_mtm_batch_template.xlsx"
					},
//					execute:{
//						url:logicServiceUrl + "/ui_materialmargin_batch_execute.xsjs",
//					}
				}
		};
		
		var executePanel =  lenovo.control.commontable.Table.createExecutePanel(executeConfig);
		
		var oExecuteForm = executePanel.getContent()[0];
		var cycleABox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oExecuteForm, "Cycle A")[0];
		var cycleBBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oExecuteForm, "Cycle B")[0];
		var monthABox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oExecuteForm, "Month A")[0];
		var monthBBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oExecuteForm, "Month B")[0];
		//cascade
		lenovo.control.commontable.Toolkit.relateDropDwonBox(cycleABox, monthABox, {
			transform: function (data){
				return data.d.results;
			},
			url: function(selectedKey){
				return oServiceUrl+"/IN_RPT_MTM_E_MONTH_DDL(IN_CYCLE='" + selectedKey + "')/Results?$orderby=SEQ asc &$format=json";
			},
			bindTextField:"ITEM_VALUE",
			bindKeyField:"ITEM_VALUE"
		});
		lenovo.control.commontable.Toolkit.relateDropDwonBox(cycleBBox, monthBBox, {
			transform: function (data){
				return data.d.results;
			},
			url: function(selectedKey){
				return oServiceUrl+"/IN_RPT_MTM_E_MONTH_DDL(IN_CYCLE='" + selectedKey + "')/Results?$orderby=SEQ asc &$format=json";
			},
			bindTextField:"ITEM_VALUE",
			bindKeyField:"ITEM_VALUE"
		});
		
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
		
		var labelArr={
				"A_M1": "A_M1",
				"B_M1": "B_M1"		
		};
		$.ajax({
			url:oServiceUrl+"/RPT_MTM_HEADER?$format=json",
			type:"GET",
			async: false,
			dataType:"json",
			success: function(data){
				var oResult = data.d.results;
				if(oResult.length>0){
					labelArr.A_M1 = data.d.results[0].A_M1;
					labelArr.B_M1 = data.d.results[0].B_M1;
				}
			}
		});
		
		//table columns setting
		/******Copy_Change_Start*******/
		config.columns = [{
			field: "CYCLEA", label: "Cycle A", type: "TextField", width: "100px"
		},{
			field: "MONTHA", label: "Month A", type:"TextField", width: "100px"
		},{
			field: "CYCLEB", label: "Cycle B", type:"TextField", width: "100px"
		},{
			field: "MONTHB", label: "Month B", type:"TextField", width: "100px"
		},{
			field: "BRAND", label: "Brand", type:"TextField", width: "100px"
		},{
			field: "FAMILY", label: "Family", type:"TextField", width: "100px"
		},{
			field: "CTO", label: "CTO", type:"TextField", width: "100px"
		},{
			field: "ASSEMBLY", label: "Assembly", type:"TextField", width: "100px"
		},{
			field: "EOL_STATUS", label: "EOL Status", type:"TextField", width: "140px"
		},{
			field: "ASSEMBLY_DESC", label: "Assembly Desc", type:"TextField", width: "140px"
		},{
			field: "QTY", label: "QTY", type:"TextField", width: "100px"
		},{
			field: "COMPONENT", label: "Component", type:"TextField", width: "140px"
		},{
			field: "COMP_DESC", label: "Component Desc", type:"TextField", width: "140px"
		},{
			field: "PLANT", label: "Plant", type:"TextField", width: "100px"
		},{
			field: "SUBGEO", label: "Subgeo", type:"TextField", width: "100px"
		},{
			field: "COUNTRY", label: "Country", type:"TextField", width: "100px"
		},{
			field: "A_M1", label: labelArr.A_M1, type:"TextField", width: "100px"
		},{
			field: "B_M1", label: labelArr.B_M1, type:"TextField", width: "100px"
		},{
			field: "DELTACOST", label: "Delta Cost", type:"TextField", width: "100px"
		},{
			field: "SYS_LAST_MODIFIED_BY", label: "Last Modified BY", type:"TextField", width: "100px"
		},{
			field: "SYS_LAST_MODIFIED_DATE", label: "Last Modified DATE", type:"TextField", width: "100px"
		}];
		/******Copy_Change_End*******/
		
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(5);
		var rowHeight = 30;
		
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight-30);
		
		
		/******Copy_Change_Start*******/
		//filter
		config.filtersRaw = [{
			field: "BRAND", label: "Brand", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				odata:{
					defaultSelectAll: true,
					url: oServiceUrl +"/RPT_MTM_SEARCH_DDL?$filter=ITEM_TYPE eq 'BRAND'&$format=json",
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE"
				}				
			}
		},{
			field: "FAMILY", label: "Family", type: "DropdownTable", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdowntable : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				defaultFilterOp: "EQ",
				url: oServiceUrl,
	//			selectionMode: sap.ui.table.SelectionMode.Single,
				field: "ITEM_VALUE",	
				columns: [{
					label: "Family",
					field: "ITEM_VALUE",
					type: "TextField"
				}],
				notRefreshTable: true,
				filters: [[{
					field: "ITEM_VALUE",
					label: "Family",
					type: "MultiTextField"
				}]],
				_search: {
					func: this.reloadSearchFamilyDropdownTable,
					context: this
				},
				reload: {
					func: this.reloadFamilyDropdownTable,
					context: this
				}
			}
		},{
			field: "SUBGEO", label: "Subgeo", type: "DropdownTable", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdowntable : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				defaultFilterOp: "EQ",
				url: oServiceUrl,
	//			selectionMode: sap.ui.table.SelectionMode.Single,
				field: "ITEM_VALUE",	
				columns: [{
					label: "Subgeo",
					field: "ITEM_VALUE",
					type: "TextField"
				}],
				notRefreshTable: true,
				filters: [[{
					field: "ITEM_VALUE",
					label: "Subgeo",
					type: "MultiTextField"
				}]],
				_search: {
					func: this.reloadSearchSubgeoDropdownTable,
					context: this
				},
				reload: {
					func: this.reloadSubgeoDropdownTable,
					context: this
				}
			}
		},{
			field: "COUNTRY", label: "Country", type: "DropdownTable", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdowntable : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				defaultFilterOp: "EQ",
				url: oServiceUrl,
	//			selectionMode: sap.ui.table.SelectionMode.Single,
				field: "ITEM_VALUE",	
				columns: [{
					label: "Country",
					field: "ITEM_VALUE",
					type: "TextField"
				}],
				notRefreshTable: true,
				filters: [[{
					field: "ITEM_VALUE",
					label: "Country",
					type: "MultiTextField"
				}]],
				_search: {
					func: this.reloadSearchCountryDropdownTable,
					context: this
				},
				reload: {
					func: this.reloadCountryDropdownTable,
					context: this
				}
			}
		},{
			field: "CTO", label: "CTO", type: "DropdownTable", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdowntable : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				defaultFilterOp: "EQ",
				url: oServiceUrl,
	//			selectionMode: sap.ui.table.SelectionMode.Single,
				field: "ITEM_VALUE",	
				columns: [{
					label: "CTO",
					field: "ITEM_VALUE",
					type: "TextField"
				}],
				notRefreshTable: true,
				filters: [[{
					field: "ITEM_VALUE",
					label: "CTO",
					type: "MultiTextField"
				}]],
				_search: {
					func: this.reloadSearchCTODropdownTable,
					context: this
				},
				reload: {
					func: this.reloadCTODropdownTable,
					context: this
				}
			}
		},{
			field: "ASSEMBLY", label: "Assembly", type: "DropdownTable", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdowntable : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				defaultFilterOp: "EQ",
				url: oServiceUrl,
	//			selectionMode: sap.ui.table.SelectionMode.Single,
				field: "ITEM_VALUE",	
				columns: [{
					label: "Assembly",
					field: "ITEM_VALUE",
					type: "TextField"
				}],
				notRefreshTable: true,
				filters: [[{
					field: "ITEM_VALUE",
					label: "Assembly",
					type: "MultiTextField"
				}]],
				_search: {
					func: this.reloadSearchAssemblyDropdownTable,
					context: this
				},
				reload: {
					func: this.reloadAssemblyDropdownTable,
					context: this
				}
			}
		},{
			field: "PLANT", label: "Plant", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				odata:{
					defaultSelectAll: true,
					url: oServiceUrl +"/RPT_MTM_SEARCH_DDL?$filter=ITEM_TYPE eq 'PLANT'&$format=json",
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE"
				}				
			}
		}];
		/******Copy_Change_End*******/
		
		config.filters = lenovo.control.commontable.Toolkit.splitChunck(4, config.filtersRaw);
		
		
		/******Copy_Change_Start*******/
		//download
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.rpt_mtm/CV_RPT_MTM"';
		/******************************
		 * Added by cui yue
		 * 2015-09-29
		 * add download columns
		 *****************************/
		config.download.columns=[
					"CYCLEA",
					"MONTHA",
					"CYCLEB",
					"MONTHB",
					"BRAND",
					"FAMILY",
					"CTO",
					"ASSEMBLY",
					"EOL_STATUS",
					"ASSEMBLY_DESC",
					"QTY",
					"COMPONENT",
					"COMP_DESC",
					"PLANT",
					"SUBGEO",
					"COUNTRY",
					"A_M1",
					"B_M1",
					"DELTACOST",
					"SYS_LAST_MODIFIED_DATE", 
					"SYS_LAST_MODIFIED_BY"];
		/*****************************
		 * End by cui yue
		 ****************************/
		config.download.filename= "RPT_MTM";
		
		/******************************
		 * Chris Gao
		 * to do the mapping table header and download header
		 *****************************/
		config.download.url = "/cdp/common/services/getFileWithHeaderMapping.xsjs";
		config.download.mappingTableHeader = {A_M1:labelArr.A_M1, B_M1:labelArr.B_M1};
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
	/**********************
	 * Value Help Logic
	 * Chris Gao
	 *********************/
	///FAMILY
	reloadFamilyDropdownTable: function(dropdownTable){

		dropdownTable.getModel().setDefaultCountMode("None");
		var bindUrl = "/RPT_MTM_SEARCH_FAMILY_DDL?$filter=ITEM_TYPE eq 'FAMILY'&$format=json";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
	reloadSearchFamilyDropdownTable: function(filterModel, filterPanel, table){

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
                value1: "'FAMILY'"
			})];
		}
		var bindUrl = "/RPT_MTM_SEARCH_FAMILY_DDL?";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	//SUBGEO
	reloadSubgeoDropdownTable: function(dropdownTable){

		dropdownTable.getModel().setDefaultCountMode("None");
		var bindUrl = "/RPT_MTM_SEARCH_SUBGEO_COUNTRY_DDL?$filter=ITEM_TYPE eq 'SUBGEO'&$format=json";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
	reloadSearchSubgeoDropdownTable: function(filterModel, filterPanel, table){

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
                value1: "'SUBGEO'"
			})];
		}
		var bindUrl = "/RPT_MTM_SEARCH_SUBGEO_COUNTRY_DDL?";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	//COUNTRY
	reloadCountryDropdownTable: function(dropdownTable){

		dropdownTable.getModel().setDefaultCountMode("None");
		var bindUrl = "/RPT_MTM_SEARCH_SUBGEO_COUNTRY_DDL?$filter=ITEM_TYPE eq 'COUNTRY'&$format=json";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
	reloadSearchCountryDropdownTable: function(filterModel, filterPanel, table){

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
                value1: "'COUNTRY'"
			})];
		}
		var bindUrl = "/RPT_MTM_SEARCH_SUBGEO_COUNTRY_DDL?";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	//CTO
	reloadCTODropdownTable: function(dropdownTable){

		dropdownTable.getModel().setDefaultCountMode("None");
		var bindUrl = "/RPT_MTM_SEARCH_CTO_DDL?$filter=ITEM_TYPE eq 'CTO'&$format=json";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
	reloadSearchCTODropdownTable: function(filterModel, filterPanel, table){

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
                value1: "'CTO'"
			})];
		}
		var bindUrl = "/RPT_MTM_SEARCH_CTO_DDL?";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	//ASSEMBLY
	reloadAssemblyDropdownTable: function(dropdownTable){

		dropdownTable.getModel().setDefaultCountMode("None");
		var bindUrl = "/RPT_MTM_SEARCH_ASSEMBLY_DDL?$filter=ITEM_TYPE eq 'ASSEMBLY'&$format=json";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
	reloadSearchAssemblyDropdownTable: function(filterModel, filterPanel, table){

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
                value1: "'ASSEMBLY'"
			})];
		}
		var bindUrl = "/RPT_MTM_SEARCH_ASSEMBLY_DDL?";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	/**********************
	 * End Value Help Logic
	 * Chris Gao
	 *********************/
	
	
	//pending to add new requirements
	execute: function(executePanel, executeModel){
		
		var oExecuteForm = executePanel.getContent()[0];
		
		var oLabel = new sap.ui.commons.Label({
			text: "Do you want to execute?",
			width: "350px",
		});
		sap.ui.commons.MessageBox.confirm(oLabel, function(result){
			if(result) {
				
				var data = {
						"cycle": executeModel.getProperty("/CYCLEA/value"), 
						"delta_cycle": executeModel.getProperty("/CYCLEB/value"),
						"montha": executeModel.getProperty("/MONTHA/value"), 
						"monthb": executeModel.getProperty("/MONTHB/value"),
						"process_name": 'PRC_RPT_MTM'
				};
				var service = new lenovo.service.CFE();
				var logicServiceUrl = service.getEBGCfeLogic();
				executePanel.setBusy(true);
				
				$.ajax({
					url: logicServiceUrl+"/report.xsjs",
					data: data,
					type: "get",
					contentType: "text",
					success: function(data){
						executePanel.setBusy(false);
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