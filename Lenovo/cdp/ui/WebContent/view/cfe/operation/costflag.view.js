//Created by Zhao Dan at 2015-07-23
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
sap.ui.jsview("lenovo.view.cfe.operation.costflag", {
	setConfig: function(config, oServiceUrl, uServiceUrl, auth){

		//table		
		config.columns = [{
			field: "SBB_TYPE", label: "SBB TYPE", type:"TextField",width:"100px"
		},{
			field: "VK", label: "VK", type: "TextField",width:"100px"
		},{
			field: "COST_FLAG", label: "COST FLAG", type:"DropdownBox",
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "COST_FLAG",
					bindKeyField: "COST_FLAG",
					url: oServiceUrl +"/COST_FLAG_LIST?$select=COST_FLAG&$format=json"
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
			field: "SBB_TYPE", label: "SBB Type", type: "DropdownTable",
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
			dropdowntable : {
				defaultFilterOp: "Contains",
				url: oServiceUrl,
				selectionMode: sap.ui.table.SelectionMode.Single,
				field: "SBB_TYPE",	
				columns: [{
					label: "SBB Type",
					field: "SBB_TYPE",
					type: "TextField"
				}],
				notRefreshTable: true,
				filters: [[{
					label: "SBB Type",
					field: "SBB_TYPE",
					type: "MultiTextField"
				}]],
				_search: {
					func: this.reloadSBBSearchItemDropdownTable,
					context: this
				},
				reload: {
					func: this.reloadSBBItemDropdownTable,
					context: this
				}
			}
			

		},{
			field: "VK", label: "VK", type: "DropdownTable",
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
			dropdowntable : {
				defaultFilterOp: "Contains",
				url: oServiceUrl,
				selectionMode: sap.ui.table.SelectionMode.Single,
				field: "VK",	
				columns: [{
					label: "VK",
					field: "VK",
					type: "TextField"
				}],
				notRefreshTable: true,
				filters: [[{
					label: "VK",
					field: "VK",
					type: "MultiTextField"
				}]],
				_search: {
					func: this.reloadVKSearchItemDropdownTable,
					context: this
				},
				reload: {
					func: this.reloadVKItemDropdownTable,
					context: this
				}
			}

		},{
			field: "COST_FLAG", label: "Cost Flag", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "COST_FLAG",
					bindKeyField: "COST_FLAG",
					url: oServiceUrl +"/COST_FLAG?$select=COST_FLAG&$format=json"
				}	
					
			}
		}];

		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);
		
		//edit		
		config.editRaw = [
		{
			field: "COST_FLAG", 
			label: "COST FLAG"
		}];
		
		//download
		config.download.url = "/cdp/common/services/getFileOfNoSymbol.xsjs";
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.ui_cost_flag/AV_UI_COSTFLAG"';
		config.download.columns=[
		                          "SBB_TYPE", "VK", "COST_FLAG","SYS_LAST_MODIFIED_BY","SYS_LAST_MODIFIED_DATE"];		                        
		config.download.filename= "UI_COSTFLAG";
		
		//upload
		config.upload = {
			url: uServiceUrl + "/ui_costflag.xsjs",
			excelUrl: "cfe/operation/ui_costflag.xlsx"
		};
		config.viewstatus = {
			viewUploadHistory: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'UI_COSTFLAG'",
				selectionMode: sap.ui.table.SelectionMode.Single,
				visibleRowCount: 10
			},
			viewErrorInfo: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_ERR_INFO",
				visibleRowCount: 10
			},
			viewUploadErrorDetail: {
				url: uServiceUrl + "/upload.xsodata/UI_COST_FLAG_ERR_DETAIL?$format=json",
				columns: [[{
					label: "SBB Type",
					field: "SBB_TYPE",
					type:  "TextField"
				},{
					label: "VK",
					field: "VK",
					type:  "TextField"
				},{
					label: "Cost Flag",
					field: "COST_FLAG",
					type:  "TextField"
				}]],
				resubmit: {
					url: uServiceUrl + "/ui_costflag.xsjs"
				}
			}
		};
		
		//create
//		var defaultInsertValue = this.setCreateCascade(oServiceUrl);
		config.insertRaw=[{
			field: "SBB_TYPE", label: "SBB Type", type: "TextField" , textfield : {defaultValue: ""} 
		},{
			field: "VK", label: "VK", type:"TextField" ,  textfield : {defaultValue: ""}  
		},{
			field: "COST_FLAG", label: "Cost Flag", type: "DropdownBox", 
			dropdownbox : {
				defaultValue: 'Y',
				odata: {
					url: oServiceUrl +"/COST_FLAG_LIST?$select=COST_FLAG&$format=json",
					bindTextField:'COST_FLAG',
					bindKeyField:'COST_FLAG'
				}
			}
		}];
		
		config.create.columns = lenovo.control.commontable.Toolkit.splitChunck(3, config.insertRaw);
		config.create.url = "/UI_COSTFLAG";
		config.create.caninitialnull = true; // to process pass initial null value by 2015-08-26 Chris Gao
/*		config.create.fakeData = {			
				"PRODUCT_GROUP":"EBG"	
		};*/
		
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
	
	/****************** Start Select Data Helper Table******************************/
	reloadSBBSearchItemDropdownTable: function(filterModel, filterPanel, table){
		
		var filter = filterModel.getProperty("/SBB_TYPE");
		var filterModel = null;
		if(filter.filterValue) {
			filterModel = new sap.ui.model.Filter({
				path: "SBB_TYPE",
				operator: filter.filterOperator,
				value1: filter.filterValue
			});
		}
		var bindUrl = "/SBB_TYPE";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	
	reloadSBBItemDropdownTable: function(dropdownTable){
		
		var bindUrl = "/SBB_TYPE";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
	
	reloadVKSearchItemDropdownTable: function(filterModel, filterPanel, table){
		
		var filter = filterModel.getProperty("/VK");
		var filterModel = null;
		if(filter.filterValue) {
			filterModel = new sap.ui.model.Filter({
				path: "VK",
				operator: filter.filterOperator,
				value1: filter.filterValue
			});
		}
		var bindUrl = "/VK";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	
	reloadVKItemDropdownTable: function(dropdownTable){
		
		var bindUrl = "/VK";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
	/******************* End Select Data Helper Table******************************/
	
	createContent: function(){
		var app = new sap.m.App(); 

		var service = new lenovo.service.CFE();
		var oServiceUrl = service.getEBGCfe();
		var uServiceUrl = service.getEBGCfeUpload();

		var oModel = new sap.ui.model.odata.ODataModel(oServiceUrl, true);
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		var auth = lenovo.control.commontable.Table.getViewAuth("costflag");
		this.setConfig(config, oServiceUrl, uServiceUrl, auth);
		
		var header = lenovo.control.commontable.Table.createHeader("Operation", "costflag");

		config.bindRowUrl = "/UI_COSTFLAG";
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
//		config.create.visible=false;
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
	          content :[header, filterPanel, oEditDeleteUploadDownload, table]//[layout]                
	    });
        app.insertPage(page);
        app.setInitialPage(page);
        return app;	

	}
});