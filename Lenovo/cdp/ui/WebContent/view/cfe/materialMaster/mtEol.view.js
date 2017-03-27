//Created by Zhao Dan at 2015-07-23
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE"); 
jQuery.sap.require("lenovo.control.Validation");
sap.ui.jsview("lenovo.view.cfe.materialMaster.mtEol", {
	createContent: function(){
		var app = new sap.m.App(); 

		var service = new lenovo.service.CFE();
		var oServiceUrl = service.getEBGCfe();
		var uServiceUrl = service.getEBGCfeUpload();

		var oModel = new sap.ui.model.odata.ODataModel(oServiceUrl, true);
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		var auth = lenovo.control.commontable.Table.getViewAuth("mtEol");//借用costflag wwvar
		this.setConfig(config, oServiceUrl, uServiceUrl, auth);
		
		var header = lenovo.control.commontable.Table.createHeader("Material Master", "MT EOL");

		config.bindRowUrl = "/UI_MT_EOL";
		var table = lenovo.control.commontable.Table.createTable(config);
		table.setBusy(true);
		table.setModel(oModel);
		oModel.attachRequestCompleted(function(){
			table.setBusy(false);
		});
	
		var filterPanel = lenovo.control.commontable.Table.createFilter(config, table);
		
		var oFilterBtn = filterPanel.getButtons();
		var searchBtn = null;
		for(var i = 0; i < oFilterBtn.length; i++) {
			var oTooltip = oFilterBtn[i].getTooltip();
			if(oTooltip==="search"){
				searchBtn = oFilterBtn[i];
				break;	
			}	
		}
		
		
		//toolbar	
		var oEditDeleteUploadDownload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table, app);	
		
		var oToolbarCtn = oEditDeleteUploadDownload.getContent()[0];	
		var buttons = oToolbarCtn.getContent();
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
		

		//app
	    var page = new sap.m.Page({
	      	  showHeader: false,
	          content :[header, filterPanel, oEditDeleteUploadDownload, table]               
	    });
        app.insertPage(page);
        app.setInitialPage(page);
        return app;	

	},
	
	setConfig: function(config, oServiceUrl, uServiceUrl, auth){

		//table		
		config.columns = [{
			field: "CYCLE", label: "CYCLE", type:"TextField",width:"100px"
		},{
			field: "MT", label: "MT", type: "TextField",width:"100px"
		},{
			field: "EOL_STATUS", label: "EOL Status", type:"DropdownBox",
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_MT_EOL_CREATE_DDL?$filter=ITEM_TYPE eq 'EOL_STATUS' &$format=json"//zhaodan1 20161116
				}				
			},width:"100px"
		},{
			field: "SYS_LAST_MODIFIED_BY", label: "Last Modified By", type:"TextField",width:"200px"
		},{
			field: "SYS_LAST_MODIFIED_DATE", label: "Last Modified Date", type:"TextField",width:"200px"
		}];
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();

		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(2);

		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight - 30);
		
		//filter
		config.filtersRaw = [{
			field: "CYCLE", label: "Cycle", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L5 M5 S5", linebreak: true}),
			dropdownbox : {
				defaultFilterValue: "CURRENT",
				layout: new sap.ui.layout.GridData({span: "L7 M7 S7"}),
				odata:{
					defaultSelectAll: false,
					url: oServiceUrl +"/UI_MT_EOL_SEARCH_DDL?$filter=ITEM_TYPE eq 'CYCLE' &$format=json",
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE"
				}				
			}
		},{
			field: "MT", label: "MT", type: "DropdownTable", 
			dropdowntable : {
//				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				defaultFilterOp: "EQ",
				url: oServiceUrl,
				selectionMode: sap.ui.table.SelectionMode.Single,
				field: "ITEM_VALUE",	
				columns: [{
					label: "MT",
					field: "ITEM_VALUE",
					type: "TextField"
				}],
				notRefreshTable: true,
				filters: [[{
					field: "ITEM_VALUE",
					label: "MT",
					type: "MultiTextField"
				}]],
				_search: {
					func: this.reloadSearchMTDropdownTable,
					context: this
				},
				reload: {
					func: this.reloadMTDropdownTable,
					context: this
				}
			}
		},{
			field: "EOL_STATUS", label: "EOL Status", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L5 M5 S5", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L7 M7 S7"}),
				odata:{
					defaultSelectAll: true,// false->true zhaodan1 20161116
					url: oServiceUrl +"/UI_MT_EOL_SEARCH_DDL?$filter=ITEM_TYPE eq 'EOL_STATUS' &$format=json",
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE"
				}				
			}
		}];

		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);
		
		//edit		
		config.editRaw = [
		{
			field: "EOL_STATUS", 
			label: "EOL Status"
		}];
		
		//download
		config.download.url = "/cdp/common/services/getFileOfNoSymbol.xsjs";
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.ui_mt_eol/CV_UI_MT_EOL"';
		config.download.columns=[
		                          "CYCLE", "MT", "EOL_STATUS","SYS_LAST_MODIFIED_BY","SYS_LAST_MODIFIED_DATE"];		                        
		config.download.filename= "UI_MT_EOL";
		
		//upload
		config.upload = {
			url: uServiceUrl + "/ui_mt_eol.xsjs",
			excelUrl: "cfe/materialMaster/mt_eol.xlsx"
		};
		config.viewstatus = {
			viewUploadHistory: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'UI_MT_EOL'",
				selectionMode: sap.ui.table.SelectionMode.Single,
				visibleRowCount: 10
			},
			viewErrorInfo: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_ERR_INFO",
				visibleRowCount: 10
			},
			viewUploadErrorDetail: {
				url: uServiceUrl + "/upload.xsodata/UI_MT_EOL_ERR_DETAIL?$format=json",
				columns: [[{
					label: "Cycle",
					field: "CYCLE",
					type:  "TextField"
				},{
					label: "MT",
					field: "MT",
					type:  "TextField"
				},{
					label: "EOL_Status",
					field: "EOL_STATUS",
					type:  "TextField"
				}]],
				resubmit: {
					url: uServiceUrl + "/ui_mt_eol.xsjs"
				}
			}
		};
		
		//create
//		var defaultInsertValue = this.setCreateCascade(oServiceUrl);
		config.insertRaw=[{
			field: "MT", label: "MT", type:"DropdownTable", 
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: oServiceUrl,
				//multiSelection: true,
				selectionMode: sap.ui.table.SelectionMode.Single,
				fields: [{
					bindByField: "MT",
					field: "ITEM_VALUE"
				}],
				columns: [{
					label: "MT",
					field: "ITEM_VALUE",
					type: "TextField"
				}],
				notRefreshTable: true,
				filters: [[{
					field: "ITEM_VALUE",
					label: "MT",
					type: "MultiTextField",
				}]],
				_search: {
					func: this.reloadCreateMTDropdownTable,
					context: this
				},
				reload: {
					func: this.reloadMTDropdownTableCreate,
					context: this
				}
			}
		},{
			field: "EOL_STATUS", label: "Eol Status", type: "DropdownBox", 
			dropdownbox : {
//				defaultValue: 'Y',
				odata: {
					url: oServiceUrl +"/UI_MT_EOL_CREATE_DDL?$filter=ITEM_TYPE eq 'EOL_STATUS' &$format=json",
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE"
				}
			}
		}];
		
		config.create.columns = lenovo.control.commontable.Toolkit.splitChunck(3, config.insertRaw);
		config.create.url = "/UI_MT_EOL";
//		config.create.caninitialnull = true; // to process pass initial null value by 2015-08-26 Chris Gao
		config.create.fakeData = {
				"CYCLE":"CURRENT",
				"PRODUCT_GROUP":"EBG"	
		};
		
		//toolbar , auth
		config.create.visible = auth.createable;
		config.edit.visible = auth.editable;
		config.deleteable.visible = auth.deleteable;
		config.upload.visible = auth.uploadable;
		config.viewstatus.visible = auth.uploadable;
		config.download.visible = auth.exportable;
		config.download.roleName = auth.exportableRoleName;
		config.upload.roleName =  auth.uploadableRoleName;

	},
	
	//SEARCH
	reloadMTDropdownTable: function(dropdownTable){
		dropdownTable.getModel().setDefaultCountMode("None");
		var bindUrl = "/UI_MT_EOL_SEARCH_DDL?$filter=ITEM_TYPE eq 'MT'&$format=json";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
	reloadSearchMTDropdownTable: function(filterModel, filterPanel, table){

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
                value1: "'MT'"
			})
			];
		}
		var bindUrl = "/UI_MT_EOL_SEARCH_DDL?";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	reloadMTDropdownTableCreate: function(dropdownTable){
		dropdownTable.getModel().setDefaultCountMode("None");
		var bindUrl = "/UI_MT_EOL_CREATE_DDL?$filter=ITEM_TYPE eq 'MT'&$format=json";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
	reloadCreateMTDropdownTable: function(filterModel, filterPanel, table){

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
                value1: "'MT'"
			})
			];
		}
		var bindUrl = "/UI_MT_EOL_CREATE_DDL?";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	}
});