//Created by Zhang Ruixue at 2014-1-14
//Updated by Chris Gao at 2015-10-31
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
sap.ui.jsview("lenovo.view.cfe.report.outlookReport", {
	setConfig: function(config, oServiceUrl, uServiceUrl, auth){
		var labelArr={
				"M1": "M1",
				"M2": "M2",
				"M3": "M3",
				"M4": "M4",
				"M5": "M5",
				"M6": "M6",
				"M7": "M7",
				"M8": "M8",
				"M9": "M9",
				"M10": "M10",
				"M11": "M11",
				"M12": "M12",
				"M13": "M13",
				"M14": "M14",
				"M15": "M15",
				"M16": "M16",
				"M17": "M17",
				"M18": "M18"				
		};
		$.ajax({
			url:oServiceUrl+"/V_CYCLE(INPUT_CYCLE='CURRENT')/Results?$format=json",
			type:"GET",
			async: false,
			dataType:"json",
			success: function(data){
				var oResult = data.d.results;
				if(oResult.length>0){
					labelArr = data.d.results[0];
				}
			}
		});
		//table		
		config.columns = [{
			field: "BRAND", label: "Brand", type:"TextField",width:"100px"
		},{
			field: "FAMILY", label: "Family", type: "TextField",width:"100px"
		},{
			field: "CTO", label: "CTO", type: "TextField",width:"100px"
		},{
			field: "ASSEMBLY", label: "Assembly", type: "TextField",width:"100px"
		},{
			field: "FC", label: "FC", type:"TextField",width:"100px"
		},{
			field: "COST_TYPE", label: "Cost Type", type:"TextField",width:"100px"
		},{
			field: "EOL_STATUS", label: "Status", type:"TextField",width:"100px"
		},{
			field: "PLANT", label: "Plant", type:"TextField",width:"100px"
		},{
			field: "GEO", label: "GEO", type:"TextField",width:"100px"
		},{
			field: "SUBGEO", label: "SUBGEO", type:"TextField",width:"100px"
		},{
			field: "COUNTRY", label: "Country", type:"TextField",width:"100px"
		},{
			field: "CURRENCY", label: "Currency", type:"TextField",width:"100px"
		},{
			field: "DESCRIPTION", label: "Description", type:"TextField",width:"200px"
		},{
			field: "M1", label: labelArr.M1+"E", type:"TextField", width:"150px"
		},{
			field: "M2", label: labelArr.M2+"E", type:"TextField", width:"150px"
		},{
			field: "M3", label: labelArr.M3+"E", type:"TextField", width:"150px"
		},{
			field: "M4", label: labelArr.M4+"E", type:"TextField", width:"150px"
		},{
			field: "M5", label: labelArr.M5+"E", type:"TextField", width:"150px"
		},{
			field: "M6", label: labelArr.M6+"E", type:"TextField", width:"150px"
		},{
			field: "M7", label: labelArr.M7+"E", type:"TextField", width:"150px"
		},{
			field: "M8", label: labelArr.M8+"E", type:"TextField", width:"150px"
		},{
			field: "M9", label: labelArr.M9+"E", type:"TextField", width:"150px"
		},{
			field: "M10", label: labelArr.M10+"E", type:"TextField", width:"150px"
		},{
			field: "M11", label: labelArr.M11+"E", type:"TextField", width:"150px"
		},{
			field: "M12", label: labelArr.M12+"E", type:"TextField", width:"150px"
		},{
			field: "M13", label: labelArr.M13+"E", type:"TextField", width:"150px"
		},{
			field: "M14", label: labelArr.M14+"E", type:"TextField", width:"150px"
		},{
			field: "M15", label: labelArr.M15+"E", type:"TextField", width:"150px"
		},{
			field: "M16", label: labelArr.M16+"E", type:"TextField", width:"150px"
		},{
			field: "M17", label: labelArr.M17+"E", type:"TextField", width:"150px"
		},{
			field: "M18", label: labelArr.M18+"E", type:"TextField", width:"150px"
		},{
			field: "LM1", label: labelArr.M1+"L", type:"TextField", width:"150px"
		},{
			field: "LM2", label: labelArr.M2+"L", type:"TextField", width:"150px"
		},{
			field: "LM3", label: labelArr.M3+"L", type:"TextField", width:"150px"
		},{
			field: "LM4", label: labelArr.M4+"L", type:"TextField", width:"150px"
		},{
			field: "LM5", label: labelArr.M5+"L", type:"TextField", width:"150px"
		},{
			field: "LM6", label: labelArr.M6+"L", type:"TextField", width:"150px"
		},{
			field: "LM7", label: labelArr.M7+"L", type:"TextField", width:"150px"
		},{
			field: "LM8", label: labelArr.M8+"L", type:"TextField", width:"150px"
		},{
			field: "LM9", label: labelArr.M9+"L", type:"TextField", width:"150px"
		},{
			field: "LM10", label: labelArr.M10+"L", type:"TextField", width:"150px"
		},{
			field: "LM11", label: labelArr.M11+"L", type:"TextField", width:"150px"
		},{
			field: "LM12", label: labelArr.M12+"L", type:"TextField", width:"150px"
		},{
			field: "LM13", label: labelArr.M13+"L", type:"TextField", width:"150px"
		},{
			field: "LM14", label: labelArr.M14+"L", type:"TextField", width:"150px"
		},{
			field: "LM15", label: labelArr.M15+"L", type:"TextField", width:"150px"
		},{
			field: "LM16", label: labelArr.M16+"L", type:"TextField", width:"150px"
		},{
			field: "LM17", label: labelArr.M17+"L", type:"TextField", width:"150px"
		},{
			field: "LM18", label: labelArr.M18+"L", type:"TextField", width:"150px"
		},{
			field: "Q1", label: labelArr.Q1, type:"TextField", width:"150px"
		},{
			field: "Q2", label: labelArr.Q2, type:"TextField", width:"150px"
		},{
			field: "Q3", label: labelArr.Q3, type:"TextField", width:"150px"
		},{
			field: "Q4", label: labelArr.Q4, type:"TextField", width:"150px"
		},{
			field: "Q5", label: labelArr.Q5, type:"TextField", width:"150px"
		},{
			field: "Q6", label: labelArr.Q6, type:"TextField", width:"150px"
		},{
			field: "SYS_LAST_MODIFIED_BY", label: "Last Modified By", type:"TextField",width:"200px"
		},{
			field: "SYS_LAST_MODIFIED_DATE", label: "Last Modified Date", type:"TextField",width:"200px"
		}];
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
//		var headerHeight = 255;
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(7);

		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight - 10);
		
		//filter
		config.filtersRaw = [{
			field: "CYCLE", label: "Cycle", type: "DropdownBox", 
//			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
			dropdownbox : {
				defaultFilterValue: "CURRENT", 
				odata:{
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url:  oServiceUrl+"/UI_PRT_EXECUTE_DDL?$filter=ITEM_TYPE eq 'CYCLE'&$format=json&$orderby=ITEM_VALUE desc"
				}				
			}
		},{
			field: "CTO", label: "CTO", type: "DropdownTable", 
			dropdowntable : {
//				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				defaultFilterOp: "EQ",
				url: oServiceUrl,
				selectionMode: sap.ui.table.SelectionMode.Single,
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
//			dropdowntable: {
//				defaultFilterOp: "EQ",
//				url: oServiceUrl,
//				bindRowUrl: "/UI_RPT_OUTLOOK_DDL2?$select=CTO,MS",
////				selectionMode: sap.ui.table.SelectionMode.Single,
//				field: "CTO",
//				columns: [{
//					label: "CTO",
//					field: "CTO",
//					type: "TextField"
//				}],
//				filters: [[{
//					label: "CTO",
//					field: "CTO",
//					type: "TextField",
//					textfield: {
//						type: new lenovo.control.commontable.singleQuotes()
//	  				}
//				}]]
//			}
		},{
			field: "FC", label: "FC", type: "DropdownTable", 
			dropdowntable : {
//				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				defaultFilterOp: "EQ",
				url: oServiceUrl,
				selectionMode: sap.ui.table.SelectionMode.Single,
				field: "ITEM_VALUE",	
				columns: [{
					label: "FC",
					field: "ITEM_VALUE",
					type: "TextField"
				}],
				notRefreshTable: true,
				filters: [[{
					field: "ITEM_VALUE",
					label: "FC",
					type: "MultiTextField"
				}]],
				_search: {
					func: this.reloadSearchFCDropdownTable,
					context: this
				},
				reload: {
					func: this.reloadFCDropdownTable,
					context: this
				}
			} 
//			dropdownbox : {				
//				odata:{
//					defaultSelectAll:true,
//					bindTextField: "FC",
//					bindKeyField: "FC",
//					url:  oServiceUrl+"/UI_RPT_OUTLOOK_DDL2?$select=FC,MS&$format=json"
//				}				
//			}
		},{
			field: "BRAND", label: "Brand", type: "DropdownBox", 
//			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_RPT_OUTLOOK_DDL?$filter=ITEM_TYPE eq 'BRAND'&$format=json"
				}	
					
			}
		},{
			field: "ASSEMBLY", label: "Assembly",type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: oServiceUrl,
				bindRowUrl: "/UI_RPT_OUTLOOK_ASSEMBLY",
//				selectionMode: sap.ui.table.SelectionMode.Single,
				field: "ASSEMBLY",
				columns: [{
					label: "Assembly",
					field: "ASSEMBLY",
					type: "TextField"
				}],
				filters: [[{
					label: "Assembly",
					field: "ASSEMBLY",
					type: "MultiTextField",
					multitextfield: {
						// type: new lenovo.control.commontable.singleQuotes()
					}
				}]]
			}
		},{
			field: "GEO", label: "GEO", type: "DropdownBox", 
			dropdownbox : {				
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url:  oServiceUrl+"/UI_RPT_OUTLOOK_DDL?$filter=ITEM_TYPE eq 'GEO'&$format=json"
				}				
			}
		},{
			field: "PLANT", label: "Plant", type: "DropdownBox", 
			dropdownbox : {				
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url:  oServiceUrl+"/UI_RPT_OUTLOOK_DDL?$filter=ITEM_TYPE eq 'PLANT'&$format=json"
				}				
			}
		},{
			field: "FAMILY", label: "Family", type: "DropdownBox", 
			dropdownbox : {				
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url:  oServiceUrl+"/UI_RPT_OUTLOOK_DDL?$filter=ITEM_TYPE eq 'FAMILY'&$format=json"
				}				
			}
		},{
			field: "COUNTRY", label: "Country", type: "DropdownBox", 
			dropdownbox : {				
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url:  oServiceUrl+"/UI_RPT_OUTLOOK_DDL?$filter=ITEM_TYPE eq 'COUNTRY'&$format=json"
				}				
			}
		},{
			field: "SUBGEO", label: "SUBGEO", type: "DropdownBox", 
			dropdownbox : {				
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url:  oServiceUrl+"/UI_RPT_OUTLOOK_DDL?$filter=ITEM_TYPE eq 'SUBGEO'&$format=json"
				}				
			}
		},{
			field: "COST_TYPE", label: "Cost Type", type: "DropdownBox", 
			dropdownbox : {				
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url:  oServiceUrl+"/UI_RPT_OUTLOOK_DDL?$filter=ITEM_TYPE eq 'COST_TYPE'&$format=json"
				}				
			}
		},{
			field: "EOL_STATUS", label: "Status", type: "DropdownBox", 
			dropdownbox : {				
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url:  oServiceUrl+"/UI_RPT_OUTLOOK_DDL?$filter=ITEM_TYPE eq 'EOL_STATUS'&$format=json"
				}				
			}
		}];

		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);
		
		
		//download
		/*********************
		 * Chris Gao 2016-05-13
		 * to process multi-data download more than 1 million
		 *********************/
		config.download.batch = true;
		config.download.url = "/cdp/common/services/getBatchData.xsjs";
		config.download.batchrange = 400000;
		/*********************
		 * End by Chris Gao
		 ********************/
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.rpt_outlook/CV_RPT_OUTLOOK_DOWNLOAD"';
		config.download.columns=[
		                         "CYCLE", "BRAND", "FAMILY", "CTO","ASSEMBLY","FC","COST_TYPE", "EOL_STATUS", "PLANT","GEO", "SUBGEO", "COUNTRY", "DESCRIPTION","CURRENCY",
		                         "M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9", "M10", "M11", "M12", 
		                         "M13", "M14", "M15", "M16", "M17", "M18",
		                         "LM1", "LM2", "LM3", "LM4", "LM5", "LM6", "LM7", "LM8", "LM9", 
		                         "LM10", "LM11", "LM12", "LM13", "LM14", "LM15", "LM16", "LM17", "LM18",
		                         "Q1", "Q2", "Q3", "Q4", "Q5", "Q6", 
		                         "SYS_LAST_MODIFIED_BY", "SYS_LAST_MODIFIED_DATE"];	                        
		                       
		config.download.filename= "RPT_OUTLOOK";
		
		
		//toolbar , auth
		config.create.visible = false;
		config.edit.visible = false;
		config.deleteable.visible = false;
		config.upload.visible = false;
		config.download.visible = auth.exportable;
		config.download.roleName = auth.exportableRoleName;
		
		/******************************
		 * config with order by and download order by
		 * Added by Chris Gao
		 * 2015-11-05
		 *****************************/
		config.defaultSort = [{
			field: "BRAND",
			bDescending: false
		},{
			field: "FAMILY",
			bDescending: false
		},{
			field: "ASSEMBLY",
			bDescending: false
		},{
			field: "CTO",
			bDescending: false
		},{
			field: "FC",
			bDescending: false
		},{
			field: "COST_TYPE",
			bDescending: false
		},{
			field: "PLANT",
			bDescending: false
		},{
			field: "GEO",
			bDescending: false
		},{
			field: "SUBGEO",
			bDescending: false
		},{
			field: "COUNTRY",
			bDescending: false
		}];
		
		config.download.defaultOrderColumn = "BRAND,FAMILY,ASSEMBLY,CTO,FC,COST_TYPE,PLANT,GEO,SUBGEO,COUNTRY";
		config.download.defaultOrderSort = "ASC";
		
		/*******************
		 * End by Chris Gao 
		 * 2015-09-24
		 *******************/
		
	},
	
	reloadCTODropdownTable: function(dropdownTable){
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
		var bindUrl = "/UI_RPT_OUTLOOK_DDL2?$filter=ITEM_TYPE eq 'CTO' &$format=json";
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
				value1:  "'" + filter.filterValue + "'"
			}),
			new sap.ui.model.Filter({
				path: "ITEM_TYPE",
                operator: "EQ",
                value1: "'CTO'"
			})
			];
		}
		var bindUrl = "/UI_RPT_OUTLOOK_DDL2?";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	
	reloadFCDropdownTable: function(dropdownTable){
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
		var bindUrl = "/UI_RPT_OUTLOOK_DDL2?$filter=ITEM_TYPE eq 'FC' &$format=json";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
	reloadSearchFCDropdownTable: function(filterModel, filterPanel, table){

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
                value1: "'FC'"
			})
			];
		}
		var bindUrl = "/UI_RPT_OUTLOOK_DDL2?";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	
	execute: function(executePanel, executeModel){
		var oLabel = new sap.ui.commons.Label({
			text: "Do you want to execute?",
			width: "350px",
		});
		sap.ui.commons.MessageBox.confirm(oLabel, function(result){
			if(result) {
				var cycle = executeModel.getProperty("/CYCLE/value");
				var data = {
						"cycle": cycle,
						"delta_cycle": '',
						"process_name": 'PRC_RPT_OUTLOOK'
				};
				var service = new lenovo.service.CFE();
				var logicServiceUrl = service.getEBGCfeLogic();
				executePanel.setBusy(true);
				$.ajax({
					url: logicServiceUrl+"/report.xsjs",
					data: data,
					type: "GET",
					contentType: "text",
					success: function(data){
						executePanel.setBusy(false);
						lenovo.control.commontable.Toolkit.showErrorMsg("Successfully execute", "SUCCESS", "Execute");		
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
	setColumnName:function(oServiceUrl, cycleDropdownBox){
		var selectedKey = cycleDropdownBox.getSelectedKey();
		var table  = this.table;
		$.ajax({
			url:oServiceUrl+"/V_CYCLE(INPUT_CYCLE='"+selectedKey+"')/Results?$format=json",
			type:"GET",
			dataType:"json",
			success: function(data){
				var oResult = data.d.results;
				if(oResult.length>0){
					var labelArr = oResult[0];
					var oColumns = table.getColumns();
					var oStartIndex = 13;
					for(var i=oStartIndex; i<oStartIndex+18; i++){
						var oAttName = "M"+(i-oStartIndex+1);
						oColumns[i].setLabel(new sap.ui.commons.Label({
							text: labelArr[oAttName]+"E"
						}));
						oColumns[i+18].setLabel(new sap.ui.commons.Label({
							text: labelArr[oAttName]+"L"
						}));
					}
					var oQStartIndex = oStartIndex+36;
					for(var i=oQStartIndex; i<oQStartIndex+6; i++){
						var oAttName = "Q"+(i-oQStartIndex+1);
						oColumns[i].setLabel(new sap.ui.commons.Label({
							text: labelArr[oAttName]
						}));		
					}
				}			
			}
		});
	},
	onTreeNavigation: function(sChannel, sEvent, oData){
		if(this.first){
			this.first = false;
			return;
		}
		if(oData.view === "Outlook Report") {	
			this.initialPage();
		}
	},
	initialPage: function(){
		var preFilterPanel = this.filterPanel; 
		var preToolbar = this.oEditDeleteUploadDownload;
		var preTable = this.table;
		var page = this.page;
		var app = this.app;
		if(preFilterPanel){
			page.removeContent(preFilterPanel);
		}
		if(preToolbar){
			page.removeContent(preToolbar);
		}
		if(preTable){
			page.removeContent(preTable);
		}
		var oServiceUrl = this.oServiceUrl;
		var uServiceUrl = this.uServiceUrl;
		var oModel = new sap.ui.model.odata.ODataModel(oServiceUrl, true);
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		var auth = lenovo.control.commontable.Table.getViewAuth("outlookReport");
		
		this.setConfig(config, oServiceUrl, uServiceUrl,auth);

		config.bindRowUrl = "/UI_RPT_OUTLOOK";
		var table = lenovo.control.commontable.Table.createTable(config);
		table.setBusy(true);
		table.setModel(oModel);
		oModel.attachRequestCompleted(function(){
			table.setBusy(false);
		});
		this.table = table;
	
		var filterPanel = lenovo.control.commontable.Table.createFilter(config, table);
		this.filterPanel = filterPanel;
		var oFilterBtn = filterPanel.getButtons();
		var searchBtn = null;
		for(var i = 0; i < oFilterBtn.length; i++) {
			var oTooltip = oFilterBtn[i].getTooltip();
			if(oTooltip==="search"){
				searchBtn = oFilterBtn[i];
				break;	
			}	
		}
		var oForm = filterPanel.getContent()[0];
		var cycleDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Cycle")[0];
		var that = this;
		searchBtn.attachPress(function(){	
			that.setColumnName(oServiceUrl, cycleDropdownBox);	
		});
		
		//toolbar	
		var oEditDeleteUploadDownload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table, app);
		this.oEditDeleteUploadDownload = oEditDeleteUploadDownload;
		
		this.page.insertContent(filterPanel,2);
		this.page.insertContent(oEditDeleteUploadDownload,3);
		this.page.insertContent(table,4);
	},
	createContent: function(){
		this.first = true;
		sap.ui.getCore().getEventBus().subscribe("TreeNavigation", "Ready", this.onTreeNavigation, this);

		var app = new sap.m.App(); 

		var service = new lenovo.service.CFE();
		var oServiceUrl = service.getEBGCfe();
		var uServiceUrl = service.getEBGCfeUpload();
		this.oServiceUrl = oServiceUrl;
		this.uServiceUrl = uServiceUrl;

//		var oModel = new sap.ui.model.odata.ODataModel(oServiceUrl, true);
//		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
//		var auth = lenovo.control.commontable.Table.getViewAuth("outlookReport");
//		
//		this.setConfig(config, oServiceUrl, uServiceUrl,auth);
		var header = lenovo.control.commontable.Table.createHeader("Report", "Outlook Report");
//
//		config.bindRowUrl = "/UI_PRT_OUTLOOK";
//		var table = lenovo.control.commontable.Table.createTable(config);
//		table.setBusy(true);
//		table.setModel(oModel);
//		oModel.attachRequestCompleted(function(){
//			table.setBusy(false);
//		});
//		this.table = table;
//		this.tableModel = oModel;
//		this.oServiceUrl = oServiceUrl;
//	
//		var filterPanel = lenovo.control.commontable.Table.createFilter(config, table);
//		
//		var oFilterBtn = filterPanel.getButtons();
//		var searchBtn = null;
//		for(var i = 0; i < oFilterBtn.length; i++) {
//			var oTooltip = oFilterBtn[i].getTooltip();
//			if(oTooltip==="search"){
//				searchBtn = oFilterBtn[i];
//				break;	
//			}	
//		}
//		var oForm = filterPanel.getContent()[0];
//		this.oForm  = oForm;
//		var cycleDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Cycle")[0];
//		this.cycleDropdownBox = cycleDropdownBox;
//		var that = this;
//		searchBtn.attachPress(function(){	
//			that.setColumnName(oServiceUrl, cycleDropdownBox);
//			/*var selectedKey = cycleDropdownBox.getSelectedKey();
//			$.ajax({
//				url:oServiceUrl+"/V_CYCLE(INPUT_CYCLE='"+selectedKey+"')/Results?$format=json",
//				type:"GET",
//				dataType:"json",
//				success: function(data){
//					var oResult = data.d.results;
//					if(oResult.length>0){
//						var labelArr = oResult[0];
//						var oColumns = table.getColumns();
//						var oStartIndex = 7;
//						for(var i=oStartIndex; i<oStartIndex+18; i++){
//							var oAttName = "M"+(i-oStartIndex+1);
//							oColumns[i].setLabel(new sap.ui.commons.Label({
//								text: labelArr[oAttName]+"E"
//							}));
//							oColumns[i+18].setLabel(new sap.ui.commons.Label({
//								text: labelArr[oAttName]+"L"
//							}));
//						}
//						var oQStartIndex = oStartIndex+36;
//						for(var i=oQStartIndex; i<oQStartIndex+6; i++){
//							var oAttName = "Q"+(i-oQStartIndex+1);
//							oColumns[i].setLabel(new sap.ui.commons.Label({
//								text: labelArr[oAttName]
//							}));		
//						}
//					}			
//				}
//			});*/
//					
//		});
//		
//		//toolbar	
//		var oEditDeleteUploadDownload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table, app);	
		
		//app
	    var page = new sap.m.Page({
	      	  showHeader: false,
	          content :[header]//[header, filterPanel, oEditDeleteUploadDownload, table]             
	    });
//	    if(auth.executable){
			var executeConfig = {
				formWidth: "33.3%",
				columns: [[{
						field: "CYCLE", label: "Cycle", type: "DropdownBox", 
						dropdownbox : {
							defaultValue: "CURRENT",
							odata:{
								defaultSelectAll: false,
								bindTextField: "ITEM_VALUE",
								bindKeyField: "ITEM_VALUE",
								url: oServiceUrl+"/UI_PRT_EXECUTE_DDL?$filter=ITEM_TYPE eq 'CYCLE'&$format=json&$orderby=ITEM_VALUE desc"
							}				
						}
				}]],
				execute: {
					func: this.execute,
					context: this
				}
			};
			oPanel =  lenovo.control.commontable.Table.createExecutePanel(executeConfig);
			
			//modified by Chris Gao 2015-09-02 change Execute Panel Color
			oPanel.addStyleClass("filter-panel ondemandRefresh-dslayout");
			
			page.insertContent(oPanel, 1);
			this.app = app;
			this.page = page;
			this.initialPage();	
	  //}
        app.insertPage(page);
        app.setInitialPage(page);
        return app;	

	}
});