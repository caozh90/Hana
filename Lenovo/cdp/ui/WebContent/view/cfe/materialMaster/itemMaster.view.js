//Created by Zhang Ruixue at 2014-11-26
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
sap.ui.jsview("lenovo.view.cfe.materialMaster.itemMaster", {
	setConfig: function(config, oServiceUrl, uServiceUrl, auth){
		//table
		config.columns = [{
			field: "ITEM", label: "Item", type: "TextField",width: "150px"
		},{
			field: "ITEM_DESC", label: "Description", type:"TextField",width: "250px"
		},{
			field: "ITEM_TYPE", label: "Item Type", type:"TextField",width: "120px"
		},{
			field: "BRAND", label: "Brand", type:"TextField",width: "120px"
		},{
			field: "ASP_PRD_FAMILY", label: "Prod Family", type:"TextField",width: "120px"
		},{
			field: "MACHINE_TYPE", label: "Machine Type", type:"TextField",width: "120px"
		},{
			field: "PROD_H", label: "PH", type:"TextField",width: "120px"
		},{
			field: "EOL_STATUS", label: "EOL Status", type:"TextField",width: "120px"/*type:"DropdownBox",
			dropdownbox : {
				odata:{
					defaultEmpty: true,
					url: oServiceUrl+"/EDIT_EOL_STATUS_DROPDOWNLIST?$filter=ITEM_TYPE eq 'EOL_STATUS'&$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}*/
		},{
			field: "EOL_STARTDATE", label: "EOL StartDate", type:"DatePicker",width:"150px"
		},{
			field: "EOL_ENDDATE", label: "EOL EndDate", type:"DatePicker",width:"150px"
		},{
			field: "SYS_LAST_MODIFIED_BY", label: "Last Modified BY", type:"TextField",width: "150px"
		},{
			field: "SYS_LAST_MODIFIED_DATE", label: "Last Modified DATE", type:"TextField",width: "150px"
		}];
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
//		var headerHeight = 290;
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(4);

		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight);

		//filter
		config.filtersRaw = [{
			field: "CYCLE", label: "Cycle", type: "DropdownBox", 
			dropdownbox : {
				defaultFilterValue: "CURRENT",
				odata:{
					defaultSelectAll: false,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl+"/CFE_UI_ITEM_DROPDOWNLIST?$filter=ITEM_TYPE eq 'CYCLE'&$format=json"
				}				
			}
		}, {
			field: "MACHINE_TYPE", label: "MT", type: "TextField", 
			textfield: {
				defaultFilterOp: "EQ"
				//layout: new sap.ui.layout.GridData({span: "L2 M2 S2"})
			}
		},{
			field: "ITEM", label: "Item", type: "DropdownTable",
			dropdowntable : {
				defaultFilterOp: "EQ",
				url: oServiceUrl,
	//			selectionMode: sap.ui.table.SelectionMode.Single,
				field: "ITEM",	
				columns: [{
					label: "Item",
					field: "ITEM",
					type: "TextField"
				}],
				notRefreshTable: true,
				filters: [[{
					field: "ITEM",
					label: "Item",
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
		},{
			field: "PROD_H", label: "PH", type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: oServiceUrl,
				bindRowUrl: "/UI_ITEM_PROD_H",
				selectionMode: sap.ui.table.SelectionMode.Single,
				field: "PROD_H",
				columns: [{
					label: "PH",
					field: "PROD_H",
					type: "TextField"
				}],
				filters: [[{
					field: "PROD_H",
					label: "PH",
					type: "MultiTextField",
					multitextfield: {
//						defaultFilterOp: "EQ"
					}
				}]]
			}
		},{
			field: "ITEM_TYPE", label: "Item Type", type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl+"/CFE_UI_ITEM_DROPDOWNLIST?$filter=ITEM_TYPE eq 'ITEM_TYPE'&$format=json"
				}				
			}
		},{
			field: "EOL_STATUS", label: "EOL Status", type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					url: oServiceUrl+"/CFE_UI_ITEM_DROPDOWNLIST?$filter=ITEM_TYPE eq 'EOL_STATUS'&$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		},{
			field: "BRAND", label: "Brand", type: "DropdownBox",
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L4 M4 S4"}),
				odata: {
					defaultSelectAll:true,
					url: oServiceUrl+"/CFE_UI_ITEM_DROPDOWNLIST?$filter=ITEM_TYPE eq 'BRAND'&$format=json",
					bindTextField:'ITEM_VALUE',
					bindKeyField:'ITEM_VALUE'
				}
			}
		},{
			field: "ASP_PRD_FAMILY", label: "Prod_Family", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L4 M4 S4"}),
				data:[{"text": lenovo.control.Constants.allDropdownBoxListItem, "key": lenovo.control.Constants.allDropdownBoxListItem}]			
			}
		},{
			field: "SYS_LAST_MODIFIED_DATE", label: "Last Modified Date", type: "TimeRange",
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true})
		/*	timerange: {
				fromLabelLayout: new sap.ui.layout.GridData({span: "L1 M1 S1"}),
				fromDatePickerLayout: new sap.ui.layout.GridData({span: "L2 M2 S2"}),
				endLabelLayout: new sap.ui.layout.GridData({span: "L1 M1 S1"}),
				endDatePickerLayout: new sap.ui.layout.GridData({span: "L2 M2 S2"}),

			}*/
		}];
		config.filters = lenovo.control.commontable.Toolkit.splitChunck(4, config.filtersRaw);

		config.filterLayout = {
			0: new sap.ui.layout.GridData({span: "L3 M3 S3"}),
			1: new sap.ui.layout.GridData({span: "L3 M3 S3"}),
			2: new sap.ui.layout.GridData({span: "L6 M6 S6"})	
		};

		//edit		
		config.editRaw = [
//		                  {field: "ITEM_DESC",label: "Description"},
//		                  {field: "EOL_STATUS", label: "EOL Status"},
		                  {field: "EOL_STARTDATE", label: "EOL StartDate", type: "DatePicker"},
		                  {field: "EOL_ENDDATE", label: "EOL EndDate", type: "DatePicker",referTo: "EOL StartDate"}
		                  ];

		//download
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.ui_item/CV_UI_ITEM"';
		config.download.columns=[
		       "ITEM","ITEM_DESC","ITEM_TYPE","BRAND","ASP_PRD_FAMILY","MACHINE_TYPE","PROD_H","EOL_STATUS",
		       "EOL_STARTDATE","EOL_ENDDATE","SYS_LAST_MODIFIED_BY","SYS_LAST_MODIFIED_DATE"
             
/*"CYCLE", "ITEM","ITEM_DESC",
			"EOL_STATUS","EOL_STARTDATE","EOL_ENDDATE"*/];
		config.download.filename= "UI_ITEM";
		
		/*//upload
		config.upload = {
			visible: true,
			url: uServiceUrl + "/ui_item.xsjs",
			excelUrl: "cfe/materialMaster/item_master.xlsx"
		};
		config.viewstatus = {
			visible: true,
			viewUploadHistory: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'UI_ITEM'",
				selectionMode: sap.ui.table.SelectionMode.Single,
				visibleRowCount: 10
			},
			viewErrorInfo: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_ERR_INFO",
				visibleRowCount: 10
			},
			viewUploadErrorDetail: {
				url: uServiceUrl + "/upload.xsodata/UI_ITEM_ERR_DETAIL?$format=json",
				columns: [[
				           {label: "Cycle",field: "CYCLE",type:  "TextField"},
				           {label: "Item",field: "ITEM",type:  "TextField"},
//				           {field: "ITEM_DESC",label: "Description", type:  "TextField"},
//			               {field: "EOL_STATUS", label: "EOL Status", type:  "TextField"},
			               {field: "EOL_STARTDATE", label: "EOL StartDate", type: "TextField"},
			               {field: "EOL_ENDDATE", label: "EOL EndDate", type: "TextField"}
				          ]],
				resubmit: {
					url: uServiceUrl + "/ui_item.xsjs"
				}
			}
		};*/
		
		//auth
		config.edit.visible=auth.editable;
		config.upload.visible=false;//auth.uploadable;
//		config.viewstatus.visible=auth.uploadable;
		config.download.visible = auth.exportable;
		
		config.create.visible=false;
		config.deleteable.visible=false;
		config.download.roleName = auth.exportableRoleName;
//		config.upload.roleName =  auth.uploadableRoleName;
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
	createContent: function(){
		var app = new sap.m.App(); 

		var service = new lenovo.service.CFE();
		var oServiceUrl = service.getEBGCfe();
		var uServiceUrl = service.getEBGCfeUpload();

		var oModel = new sap.ui.model.odata.ODataModel(oServiceUrl, true);
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		var auth = lenovo.control.commontable.Table.getViewAuth("itemMaster");

		this.setConfig(config,oServiceUrl, uServiceUrl, auth);
		config.bindRowUrl = "/CFE_UI_ITEMS";
		var header = lenovo.control.commontable.Table.createHeader("Material Master", "Item Master");
		var table = lenovo.control.commontable.Table.createTable(config);
		table.setBusy(true);
		table.setModel(oModel);
		oModel.attachRequestCompleted(function(){
			table.setBusy(false);
		});		
		var filterPanel = lenovo.control.commontable.Table.createFilter(config, table);
		this.table = table;
		this.oModel = oModel;
		this.config = config;
		this.oForm = filterPanel.getContent()[0];
		sap.ui.getCore().getEventBus().subscribe("TreeNavigation", "Ready", this.onTreeNavigation, this);
		
		//toolbar				
		var oEditDeleteUploadDownload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table,app);
	
		var oForm = filterPanel.getContent()[0];
		var cycleDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Cycle")[0];
		this.cycleDropdownBox = cycleDropdownBox;
		var buttons = oEditDeleteUploadDownload.getContent()[0].getContent();
				
		var editButton = null;//, uploadButton = null, uploadTemButton = null, viewStatusButton = null;
		for(var i = 0; i < buttons.length; i++) {
			var oTooltip = buttons[i].getTooltip();
			if(auth.editable && oTooltip === 'edit'){
				editButton = buttons[i];
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
		cycleDropdownBox.attachChange(function(){
			var selectedKey = this.getSelectedKey();
			if(selectedKey === "CURRENT") {
				if(editButton){
					editButton.setVisible(true);
				}
				/*if(auth.uploadable){
					uploadButton.setVisible(true);
					uploadTemButton.setVisible(true);
					viewStatusButton.setVisible(true);
				}*/
			} else {
				if(editButton){
					editButton.setVisible(false);
				}
				/*if(auth.uploadable){
					uploadButton.setVisible(false);
					uploadTemButton.setVisible(false);
					viewStatusButton.setVisible(false);
				}*/		
			}
		});
		
		/*var editButton,uploadButton, uploadTemButton, viewStatusButton;
		for(var i = 0; i < buttons.length; i++) {
			var oTooltip = buttons[i].getTooltip();
			switch(oTooltip){
				case "edit":
					editButton = buttons[i];
					break;
				case "upload":
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
		cycleDropdownBox.attachChange(function(){
			var selectedKey = this.getSelectedKey();
			if(selectedKey === "CURRENT") {
				editButton.setVisible(true);
				uploadButton.setVisible(true);
				uploadTemButton.setVisible(true);
				viewStatusButton.setVisible(true);
			} else {
				editButton.setVisible(false);
				uploadButton.setVisible(false);
				uploadTemButton.setVisible(false);
				viewStatusButton.setVisible(false);
			}
		});*/

		//brand, prod_family cascade		
		var brandDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Brand")[0];
		var prodFamilyDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Prod_Family")[0];
		lenovo.control.commontable.Toolkit.relateDropDwonBox(brandDropdownBox, prodFamilyDropdownBox, {
			transform: function (data){
				return data.d.results;
			},
			url: function(selectedKey){
				return oServiceUrl+"/INPUT_BRAND(INPUT_BRAND='" + selectedKey + "')/Results?$format=json";
			},
			bindTextField:"ITEM_VALUE",
			bindKeyField:"ITEM_VALUE"
		});

		//app
	    var page = new sap.m.Page({
	      	  showHeader: false,
	          content :[header, filterPanel, oEditDeleteUploadDownload, table]//[layout]                
	    });
        app.insertPage(page);
        app.setInitialPage(page);
        return app;	

	},
	onTreeNavigation: function(sChannel, sEvent, oData){
		if(oData.view === "Item Master") {
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