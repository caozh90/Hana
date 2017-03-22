//Created by Leon Bian at 2015-10-12
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE"); 
jQuery.sap.require("lenovo.control.Validation");
sap.ui.jsview("lenovo.view.cfe.priceMask.uiPmBom", {
	setConfig: function(config, oServiceUrl, uServiceUrl, auth){
		//table		
		config.columns = [{
			field: "ITEM", label: "Item", type: "TextField",width:"150px"
		},{
			field: "ITEM_DESC", label: "Item Desc", type:"TextField",width:"250px"
		},{
			field: "ITEM_TYPE", label: "Item Type", type:"TextField",width:"150px"
		},{
			field: "BS_PART", label: "B/S Part", type:"TextField", width:"150px"
		},{
			field: "COMMODITY", label: "Commodity", type:"TextField", width:"200px"
		},{
			field: "PART_DESC", label: "Part Desc", type:"TextField", width:"250px"
		},{
			field: "PART_QTY", label: "Part Qty", type:"TextField", width:"150px"
		},{
			field: "SYS_LAST_MODIFIED_BY", label: "Last Modified By", type:"TextField",width:"200px"
		},{
			field: "SYS_LAST_MODIFIED_DATE", label: "Last Modified Date", type:"TextField",width:"200px"
		}];
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(2);

		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight);
		
		//filter
		config.filtersRaw = [{
			field: "ITEM", label: "Item", type: "DropdownTable", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdowntable: {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				defaultFilterOp: "EQ",
				url: oServiceUrl,
				//selectionMode: sap.ui.table.SelectionMode.Single,
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
					type: "MultiTextField",
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
		},{
			field: "ITEM_TYPE", label: "Item Type", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				odata:{
					defaultSelectAll: true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_PM_BOM_SEARCH?$filter=ITEM_TYPE eq 'ITEM_TYPE'&$format=json"
				}	
			}
		},{
			field: "BS_PART", label: "B/S Part", type: "DropdownTable", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdowntable: {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				defaultFilterOp: "EQ",
				url: oServiceUrl,
				//selectionMode: sap.ui.table.SelectionMode.Single,
				field: "ITEM_VALUE",
				columns: [{
					label: "B/S Part",
					field: "ITEM_VALUE",
					type: "TextField"
				}],
				notRefreshTable: true,
				filters: [[{
					field: "ITEM_VALUE",
					label: "B/S Part",
					type: "MultiTextField",
				}]],
				_search: {
					func: this.reloadSearchBsPartDropdownTable,
					context: this
				},
				reload: {
					func: this.reloadBsPartDropdownTable,
					context: this
				}
			}
		}];

		config.filters = lenovo.control.commontable.Toolkit.splitChunck(4, config.filtersRaw);
		
		//edit		
		config.editRaw = [{
			field: "PART_QTY", 
		    label: "Part Qty",
		    validation: [{
		    	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The data type of this field is Float (11,4)!"
			}]
		}];
		
		//download
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.ui_pm_bom/CV_UI_PM_BOM"';
		config.download.columns=[
		                        "ITEM", "ITEM_DESC", "ITEM_TYPE", "BS_PART", "COMMODITY", "PART_DESC", "PART_QTY", "SYS_LAST_MODIFIED_BY", "SYS_LAST_MODIFIED_DATE"
		                         ];
		config.download.filename= "UI_PM_BOM";
		
		//upload
		config.upload = {
			url: uServiceUrl + "/ui_pm_bom.xsjs",
			excelUrl: "cfe/priceMask/PM_BOM.xlsx"
		};
		config.viewstatus = {
			viewUploadHistory: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'UI_PM_BOM'",
				selectionMode: sap.ui.table.SelectionMode.Single
			},
			viewErrorInfo: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_ERR_INFO"
			},
	
			viewUploadErrorDetail: {
				url: uServiceUrl + "/upload.xsodata/UI_PM_BOM_ERR_DETAIL?$format=json",
				columns: [[{
					label: "Item",
					field: "ITEM",
					type:  "TextField"
				},{
					label: "B/S Part",
					field: "BS_PART",
					type:  "TextField"
					
				},{
					label: "Part Qty",
					field: "PART_QTY",
					type:  "TextField"
					
				}]],
				resubmit: {
					url: uServiceUrl + "/ui_pm_bom.xsjs"
				}
			}
		};
		
		//create
		config.insertRaw=[{
			field: "OEM_NAME", label: "OEM Name", type:"DropdownBox", 
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
			dropdownbox : {
				odata:{
					url: oServiceUrl+"/UI_PM_BOM_CREATE?$filter=ITEM_TYPE eq 'OEM_NAME'&$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		},{
			field: "ITEM", label: "Item", type:"DropdownTable", 
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
					bindByField: "ITEM",
					field: "ITEM_VALUE"
				}],
				columns: [{
					label: "Item",
					field: "ITEM_VALUE",
					type: "TextField"
				}],
				notRefreshTable: true,
				filters: [[{
					field: "ITEM_VALUE",
					label: "Item",
					type: "MultiTextField",
				}]],
				_search: {
					func: this.reloadCreateItemDropdownTable,
					context: this
				},
				reload: {
					func: this.reloadItemDropdownTableCreate,
					context: this
				}
			}
		},{
			field: "BS_PART", label: "B/S Part", type:"DropdownTable", 
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: oServiceUrl,
				selectionMode: sap.ui.table.SelectionMode.Single,
				fields: [{
					bindByField: "BS_PART",
					field: "ITEM_VALUE"
				}],
				columns: [{
					label: "B/S Part",
					field: "ITEM_VALUE",
					type: "TextField"
				}],
				notRefreshTable: true,
				filters: [[{
					field: "ITEM_VALUE",
					label: "B/S Part",
					type: "MultiTextField",
				}]],
				_search: {
					func: this.reloadCreateBsPartDropdownTable,
					context: this
				},
				reload: {
					func: this.reloadBsPartDropdownTableCreate,
					context: this
				}
			}
		},{
			field: "PART_QTY", label: "Part Qty", type:"TextField", 
			required: true,
			validation: [{
				validType: /^\d{0,11}(\.\d{0,})?$/,
				errMsg: "The data type of this field is Float (11,n)!"
			}]
		}];
		
		config.create.columns = lenovo.control.commontable.Toolkit.splitChunck(2, config.insertRaw);
		config.create.url = "/UI_PM_BOM";
		config.create.fakeData = {
				"CYCLE":"CURRENT",			
				"PRODUCT_GROUP":"EBG"	
		};
		
		//toolbar , auth
		config.create.visible = false;
		config.edit.visible = false;
		config.deleteable.visible = false;
		config.upload.visible = false;
		config.viewstatus.visible = false;
		config.download.visible = auth.exportable;
		config.download.roleName = auth.exportableRoleName;
		config.upload.roleName =  auth.uploadableRoleName;

	},
	reloadItemDropdownTable: function(dropdownTable){
		dropdownTable.getModel().setDefaultCountMode("None");
		var bindUrl = "/UI_PM_BOM_SEARCH?$filter=ITEM_TYPE eq 'ITEM'&$format=json";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
	reloadSearchItemDropdownTable: function(filterModel, filterPanel, table){

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
                value1: "'ITEM'"
			})
			];
		}
		var bindUrl = "/UI_PM_BOM_SEARCH?";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	reloadBsPartDropdownTable: function(dropdownTable){
		dropdownTable.getModel().setDefaultCountMode("None");
		var bindUrl = "/UI_PM_BOM_SEARCH?$filter=ITEM_TYPE eq 'BS_PART'&$format=json";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
	reloadSearchBsPartDropdownTable: function(filterModel, filterPanel, table){

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
                value1: "'BS_PART'"
			})
			];
		}
		var bindUrl = "/UI_PM_BOM_SEARCH?";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	reloadItemDropdownTableCreate: function(dropdownTable){
		dropdownTable.getModel().setDefaultCountMode("None");
		var bindUrl = "/UI_PM_BOM_CREATE?$filter=ITEM_TYPE eq 'ITEM'&$format=json";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
	reloadCreateItemDropdownTable: function(filterModel, filterPanel, table){

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
                value1: "'ITEM'"
			})
			];
		}
		var bindUrl = "/UI_PM_BOM_CREATE?";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	reloadBsPartDropdownTableCreate: function(dropdownTable){
		dropdownTable.getModel().setDefaultCountMode("None");
		var bindUrl = "/UI_PM_BOM_CREATE?$filter=ITEM_TYPE eq 'BS_PART'&$format=json";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
	reloadCreateBsPartDropdownTable: function(filterModel, filterPanel, table){

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
                value1: "'BS_PART'"
			})
			];
		}
		var bindUrl = "/UI_PM_BOM_CREATE?";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	createContent: function(){
		var app = new sap.m.App(); 

		var service = new lenovo.service.CFE();
		var oServiceUrl = service.getEBGCfe();
		var uServiceUrl = service.getEBGCfeUpload();

		var oModel = new sap.ui.model.odata.ODataModel(oServiceUrl, true);
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		var auth = lenovo.control.commontable.Table.getViewAuth("uiPmBom");
		
		this.setConfig(config, oServiceUrl, uServiceUrl,auth);
		var header = lenovo.control.commontable.Table.createHeader("Price Mask", "PM BOM");

		config.bindRowUrl = "/UI_PM_BOM";
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
		var createButton = null, editButton = null, uploadButton = null,deleteButton = null, uploadTemButton = null, viewStatusButton = null;
		for(var i = 0; i < buttons.length; i++) {
			var oTooltip = buttons[i].getTooltip();
			
			if(auth.createable && oTooltip === 'create an item'){
				createButton = buttons[i];
				continue;
			}
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
		
		var that = this;
		var oToolbarCtn = oEditDeleteUploadDownload.getContent()[0];
		var oPublishBtn = new sap.ui.commons.Button({
			//lite: true,
			style: sap.ui.commons.ButtonStyle.Emph,
			icon: "sap-icon://process",
			tooltip: "BOM Sync",
			press: function(){
				that.process(table, oServiceUrl);
			}
		}).addStyleClass("ondemandRefresh-dslayout-flatcolor-button");//.addStyleClass("commontable-toolbar-btn");
		//check authorization
		for (var i in auth) {
			switch(i) {
				case "executable":
					//oToolbarCtn.insertContent(oPublishBtn,0);
					break;
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
	process: function(table, oServiceUrl) {
		
		var oLabel = new sap.ui.commons.Label({
			text: "Do you want to BOM Sync?",
			width: "350px",
		});
		sap.ui.commons.MessageBox.confirm(oLabel, function(result){
			if(result) {
				var service = new lenovo.service.CFE();
				var logicServiceUrl = service.getEBGCfeLogic();
				
				table.setBusy(true);
				$.ajax({
					url: logicServiceUrl+"/ui_pm_bom_sync.xsjs?process_name=PRC_GET_PM_BOM",
					//data: data,
					type: "get",
					contentType: "text",
					success: function(data){
						table.setBusy(false);
						
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
						
					},
					error: function(err){
						err = err && err.responseText ;
						table.setBusy(false);
						if(!(typeof err === "string"))
							err = JSON.stringify(err);
						lenovo.control.commontable.Toolkit.showErrorMsg(err, "ERROR", "Execute");			
					}
				});
			}
		}, 	"Confirm");	
	}
});