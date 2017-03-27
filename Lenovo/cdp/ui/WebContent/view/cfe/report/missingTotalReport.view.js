//Created by Zhang Ruixue at 2014-1-14
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
sap.ui.jsview("lenovo.view.cfe.report.missingTotalReport", {
	setConfig: function(config, oServiceUrl, uServiceUrl, auth){
		
		//table		
		config.columns = [{
			field: "BRAND", label: "Brand", type:"TextField"
		},{
			field: "FAMILY", label: "Family", type: "TextField"
		},{
			field: "MODEL", label: "Model", type: "TextField"
		},{
			field: "SBB", label: "SBB", type:"TextField"
		},{
			field: "COMPONENT", label: "Component", type:"TextField"
		},{
			field: "PLANT", label: "Plant", type:"TextField"
		},{
			field: "SUBGEO", label: "Subgeo", type:"TextField"
		},{
			field: "COUNTRY", label: "Country", type:"TextField"
		},{
			field: "COMP_DESC", label: "COMP Desc", type:"TextField"
		},{
			field: "MISSING_REASON", label: "Missing Reason", type:"TextField"
		},{
			field: "SYS_LAST_MODIFIED_BY", label: "Last Modified By", type:"TextField"
		},{
			field: "SYS_LAST_MODIFIED_DATE", label: "Last Modified Date", type:"TextField"
		}];
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
//		var headerHeight = 255;
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(2);

		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight);
		
		//filter
		config.filtersRaw = [{
			field: "CYCLE", label: "Cycle", type: "DropdownBox", 
//			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
			dropdownbox : {
				defaultFilterValue: "CURRENT",
				odata:{
					defaultSelectAll: false,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl+"/UI_PRT_EXECUTE_DDL?$filter=ITEM_TYPE eq 'CYCLE'&$format=json"
				}				
			}
		},{
			field: "MODEL", label: "Model", type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: oServiceUrl,
				bindRowUrl: "/UI_RPT_BOMMISSINGTOTAL_MODEL",
//				selectionMode: sap.ui.table.SelectionMode.Single,
				field: "MODEL",
				columns: [{
					label: "Model",
					field: "MODEL",
					type: "TextField"
				}],
				filters: [[{
					label: "Model",
					field: "MODEL",
					type: "MultiTextField",
					multitextfield: {
//						defaultFilterOp: "EQ"
					}
				}]]
			}
		},{
			field: "BRAND", label: "Brand",  type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_RPT_BOMMISSINGTOTAL_DDL?$filter=ITEM_TYPE eq 'BRAND'&$format=json"
				}					
			}		
		},{
			field: "FAMILY", label: "Family",  type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_RPT_BOMMISSINGTOTAL_DDL?$filter=ITEM_TYPE eq 'FAMILY'&$format=json"
				}					
			}		
		},{
			field: "PLANT", label: "Plant",  type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_RPT_BOMMISSINGTOTAL_DDL?$filter=ITEM_TYPE eq 'PLANT'&$format=json"
				}					
			}		
		},{
			field: "SUBGEO", label: "Subgeo",  type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_RPT_BOMMISSINGTOTAL_DDL?$filter=ITEM_TYPE eq 'SUBGEO'&$format=json"
				}					
			}		
		},{
			field: "COUNTRY", label: "Country",  type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_RPT_BOMMISSINGTOTAL_DDL?$filter=ITEM_TYPE eq 'COUNTRY'&$format=json"
				}					
			}		
		}];

		config.filters = lenovo.control.commontable.Toolkit.splitChunck(4, config.filtersRaw);
	/*	config.filterLayout = {
			0: new sap.ui.layout.GridData({span: "L4 M4 S4"}),
			1: new sap.ui.layout.GridData({span: "L4 M4 S4"})	
		};	*/
		//download
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.rpt_bom_missing_total/CV_RPT_BOM_MISSING_TOTAL"';
		config.download.columns=[
		                        "CYCLE", "BRAND", "FAMILY", "MODEL", "SBB", "COMPONENT", "PLANT", "SUBGEO",
		                         "COUNTRY", "COMP_DESC", "MISSING_REASON",
		                         "SYS_LAST_MODIFIED_BY", "SYS_LAST_MODIFIED_DATE"];	                        
		                       
		config.download.filename= "RPT_BOMMISSTOTAL";
		
		
		//toolbar , auth
		config.create.visible = false;
		config.edit.visible = false;
		config.deleteable.visible = false;
		config.upload.visible = false;
		config.download.visible = auth.exportable;
		config.download.roleName = auth.exportableRoleName;
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
						"process_name": 'PRC_RPT_BOMMISSTOTAL'
				};
				var service = new lenovo.service.CFE();
				var logicServiceUrl = service.getEBGCfeLogic();
				executePanel.setBusy(true);
				$.ajax({
					url: logicServiceUrl+"/report.xsjs",
					data: data,
					type: "get",
					contentType: "application/json",
					dataType: "text",
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
		});	
	},
	onTreeNavigation: function(sChannel, sEvent, oData){
		if(this.first){
			this.first = false;
			return;
		}
		if(oData.view === "Missing Total Report") {	
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
		var auth = lenovo.control.commontable.Table.getViewAuth("missingTotalReport");
		
		this.setConfig(config, oServiceUrl, uServiceUrl,auth);

		config.bindRowUrl = "/UI_RPT_BOMMISSINGTOTAL";
		var table = lenovo.control.commontable.Table.createTable(config);
		table.setBusy(true);
		table.setModel(oModel);
		oModel.attachRequestCompleted(function(){
			table.setBusy(false);
		});
	
		this.table = table;
		var filterPanel = lenovo.control.commontable.Table.createFilter(config, table);
		this.filterPanel = filterPanel;

		//toolbar	
		var oEditDeleteUploadDownload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table, app);
		this.oEditDeleteUploadDownload = oEditDeleteUploadDownload;
		
		this.page.insertContent(filterPanel,2);
		this.page.insertContent(oEditDeleteUploadDownload,3);
		this.page.insertContent(table,4);
	},
	createContent: function(){
		this.first=true;
		sap.ui.getCore().getEventBus().subscribe("TreeNavigation", "Ready", this.onTreeNavigation, this);

		var app = new sap.m.App(); 
		var service = new lenovo.service.CFE();
		var oServiceUrl = service.getEBGCfe();
		this.oServiceUrl = oServiceUrl;
		var uServiceUrl = service.getEBGCfeUpload();
		this.uServiceUrl = uServiceUrl;

//		var oModel = new sap.ui.model.odata.ODataModel(oServiceUrl, true);
//		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
//		var auth = lenovo.control.commontable.Table.getViewAuth("missingTotalReport");
//		
//		this.setConfig(config, oServiceUrl, uServiceUrl,auth);
		var header = lenovo.control.commontable.Table.createHeader("Report", "BOM Missing Total Report");
//
//		config.bindRowUrl = "/UI_RPT_BOMMISSINGTOTAL";
//		var table = lenovo.control.commontable.Table.createTable(config);
//		table.setBusy(true);
//		table.setModel(oModel);
//		oModel.attachRequestCompleted(function(){
//			table.setBusy(false);
//		});
//	
//		this.table = table;
//		this.tableModel = oModel;
//		var filterPanel = lenovo.control.commontable.Table.createFilter(config, table);
//		this.oForm  = filterPanel.getContent()[0];
//
//		//toolbar	
//		var oEditDeleteUploadDownload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table, app);	
		
		//app
	    var page = new sap.m.Page({
	      	  showHeader: false,
	          content :[header]//[header, filterPanel, oEditDeleteUploadDownload, table]             
	    });
		/*var executeConfig = {
			formWidth: "33%",
			columns: [[{
					field: "CYCLE", label: "Cycle", type: "DropdownBox", 
					dropdownbox : {
						defaultValue: "CURRENT",
						odata:{
							defaultSelectAll: false,
							bindTextField: "ITEM_VALUE",
							bindKeyField: "ITEM_VALUE",
							url: oServiceUrl+"/UI_PRT_EXECUTE_DDL?$filter=ITEM_TYPE eq 'CYCLE'&$format=json"
						}				
					}
			}]],
			execute: {
				func: this.execute,
				context: this
			}
		};
		oPanel =  lenovo.control.commontable.Table.createExecutePanel(executeConfig);
		page.insertContent(oPanel, 1);*/
		this.app = app;
		this.page = page;
		this.initialPage();	
        app.insertPage(page);
        app.setInitialPage(page);
        return app;	

	}
});