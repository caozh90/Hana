//Created by Zhang Ruixue at 2014-12-04
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
sap.ui.jsview("lenovo.view.cfe.operation.fcsbbMapping", {
	setConfig: function(config, oServiceUrl, auth){

		// table
		config.columns = [{
			field: "MATNR", label: "CTO", type: "TextField"
		},{
			field: "ATNAM", label: "Characteristic", type:"TextField"
		},{
			field: "ATWRT", label: "Value", type:"TextField"
		},{
			field: "CHAR_DESC", label: "CHAR.DESC", type:"TextField"
		},{
			field: "FC", label: "FC", type:"TextField"
		},{
			field: "IDNRK", label: "SBB", type:"TextField"
		},{
			field: "VARCOND", label: "VK", type:"TextField"
		},{
			field: "SYS_LAST_MODIFIED_BY", label: "LAST MODIFIED BY", type:"TextField"
		},{
			field: "SYS_LAST_MODIFIED_DATE", label: "LAST MODIFIED DATE", type:"TextField"
		}];
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
//		var headerHeight = 290;
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(2);

		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight);

		//filter
		config.filtersRaw = [{
			field: "CYCLE", label: "Cycle", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L5 M5 S5", linebreak: true}),
			dropdownbox : {
				defaultFilterValue: "CURRENT",
				layout: new sap.ui.layout.GridData({span: "L7 M7 S7"}),
				odata:{
					defaultSelectAll: false,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_BIZ_FCSBBMAP_DROPDOWNLIST?$filter=ITEM_TYPE eq 'CYCLE'&$format=json"
				}				
			}
		},{
			field: "FC", label: "Feature Code", type: "DropdownTable", 
			labelLayout: new sap.ui.layout.GridData({span: "L5 M5 S5", linebreak: true}),
			dropdowntable : {
				layout: new sap.ui.layout.GridData({span: "L7 M7 S7"}),
				defaultFilterOp: "EQ",
				url: oServiceUrl,
				selectionMode: sap.ui.table.SelectionMode.Single,
				field: "ITEM_VALUE",	
				columns: [{
					label: "Feature Code",
					field: "ITEM_VALUE",
					type: "TextField"
				}],
				notRefreshTable: true,
				filters: [[{
					field: "ITEM_VALUE",
					label: "Feature Code",
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
		},/*{
			field: "FC", label: "Feature Code", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L5 M5 S5", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L7 M7 S7"}),
				odata:{
					defaultSelectAll: true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_BIZ_FCSBBMAP_DROPDOWNLIST?$filter=ITEM_TYPE eq 'FC'&$format=json"
				}				
			}
		},*/{
			field: "MATNR", label: "CTO", type: "DropdownTable",
			labelLayout: new sap.ui.layout.GridData({span: "L2 M2 S2", linebreak: true}),
			dropdowntable: {
				layout: new sap.ui.layout.GridData({span: "L10 M10 S10"}),
				defaultFilterOp: "EQ",
				url: oServiceUrl,
				bindRowUrl: "/UI_BIZ_FCSBBMAP_MATNR",
				selectionMode: sap.ui.table.SelectionMode.Single,
				field: "MATNR",
				columns: [{
					label: "CTO",
					field: "MATNR",
					type: "TextField"
				}],
				filters: [[{
					label: "CTO",
					field: "MATNR",
					type: "MultiTextField",
					multitextfield: {
	//					defaultFilterOp: "EQ"
					}
				}]]
			}
		},{
			field: "IDNRK", label: "SBB", type: "DropdownTable",
			labelLayout: new sap.ui.layout.GridData({span: "L2 M2 S2", linebreak: true}),
			dropdowntable: {
				layout: new sap.ui.layout.GridData({span: "L10 M10 S10"}),
				defaultFilterOp: "EQ",
				url: oServiceUrl,
				bindRowUrl: "/UI_BIZ_FCSBBMAP_IDNRK",
				selectionMode: sap.ui.table.SelectionMode.Single,
				field: "IDNRK",
				columns: [{
					label: "SBB",
					field: "IDNRK",
					type: "TextField"
				}],
				filters: [[{
					label: "SBB",
					field: "IDNRK",
					type: "MultiTextField",
					multitextfield: {
	//					defaultFilterOp: "EQ"
					}
				}]]
			}
		},{
			field: "ATNAM", label: "Characteristic", type: "DropdownTable",
			labelLayout: new sap.ui.layout.GridData({span: "L5 M5 S5", linebreak: true}),
			dropdowntable: {
				layout: new sap.ui.layout.GridData({span: "L7 M7 S7"}),
				defaultFilterOp: "EQ",
				url: oServiceUrl,
				bindRowUrl: "/UI_BIZ_FCSBBMAP_ATNAM",
				selectionMode: sap.ui.table.SelectionMode.Single,
				field: "ATNAM",
				columns: [{
					label: "Characteristic",
					field: "ATNAM",
					type: "TextField"
				}],
				filters: [[{
					label: "Characteristic",
					field: "ATNAM",
					type: "MultiTextField",
					multitextfield: {
	//					defaultFilterOp: "EQ"
					}
				}]]
			}
		},{
			field: "VARCOND", label: "VK", type: "DropdownTable",
			labelLayout: new sap.ui.layout.GridData({span: "L5 M5 S5", linebreak: true}),
			dropdowntable: {
				layout: new sap.ui.layout.GridData({span: "L7 M7 S7"}),
				defaultFilterOp: "EQ",
				url: oServiceUrl,
				bindRowUrl: "/UI_BIZ_FCSBBMAP_VARCOND",
				selectionMode: sap.ui.table.SelectionMode.Single,
				field: "VARCOND",
				columns: [{
					label: "VK",
					field: "VARCOND",
					type: "TextField"
				}],
				filters: [[{
					label: "VK",
					field: "VARCOND",
					type: "MultiTextField",
					multitextfield: {
	//					defaultFilterOp: "EQ"
					}
				}]]
			}
		},{
			field: "ATWRT", label: "Value", type: "DropdownTable",
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
			dropdowntable: {
				layout: new sap.ui.layout.GridData({span: "L9 M9 S9"}),
				defaultFilterOp: "EQ",
				url: oServiceUrl,
				bindRowUrl: "/UI_BIZ_FCSBBMAP_ATWRT",
				selectionMode: sap.ui.table.SelectionMode.Single,
				field: "ATWRT",
				columns: [{
					label: "Value",
					field: "ATWRT",
					type: "TextField"
				}],
				filters: [[{
					label: "Value",
					field: "ATWRT",
					type: "MultiTextField",
					multitextfield: {
	//					defaultFilterOp: "EQ"
					}
				}]]
			}
		}];
		config.filters = lenovo.control.commontable.Toolkit.splitChunck(4, config.filtersRaw);
		
		//download
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.biz_fcsbbmap/CV_BIZ_FCSBBMAP"';
		config.download.columns=[
			"MATNR","ATNAM","ATWRT","FC","IDNRK",
			"VARCOND", "SYS_LAST_MODIFIED_BY","SYS_LAST_MODIFIED_DATE"];
		config.download.filename= "BIZ_FCSBBMAP";
		
		//toolbar , auth
		config.create.visible=false;
		config.deleteable.visible=false;
		config.upload.visible=false;
		config.edit.visible=false;
		config.download.visible = auth.exportable;
		config.download.roleName = auth.exportableRoleName;
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
		var bindUrl = "/UI_BIZ_FCSBBMAP_DROPDOWNLIST?$filter=ITEM_TYPE eq 'FC'&$format=json";
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
		var bindUrl = "/UI_BIZ_FCSBBMAP_DROPDOWNLIST?";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	
	createContent: function(){
		var service = new lenovo.service.CFE();
		var oServiceUrl = service.getEBGCfe();
		var oModel = new sap.ui.model.odata.ODataModel(oServiceUrl, true);
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		var auth = lenovo.control.commontable.Table.getViewAuth("fcsbbMapping");
		this.setConfig(config, oServiceUrl, auth);
		
		var header = lenovo.control.commontable.Table.createHeader("Operation", "FC-SBB Mapping");

		config.bindRowUrl = "/CFE_BIZ_FCSBBMAP";
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
		
		//filter		
		var filterPanel = lenovo.control.commontable.Table.createFilter(config, table);	
		this.table = table;
		this.oModel = oModel;
		this.config = config;
		this.oForm = filterPanel.getContent()[0];
		sap.ui.getCore().getEventBus().subscribe("TreeNavigation", "Ready", this.onTreeNavigation, this);
		

		//toolbar		
		var oEditDeleteUploadDownload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table);

		//app
		var app = new sap.m.App(); 
	    var page = new sap.m.Page({
	      	  showHeader: false,
	          content :[header, filterPanel, oEditDeleteUploadDownload, table]//[layout]                
	    });
        app.insertPage(page);
        app.setInitialPage(page);
        return app;	

	},
	onTreeNavigation: function(sChannel, sEvent, oData){
		if(oData.view === "FC-SBB Mapping") {
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