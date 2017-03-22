//Created by Zhang Ruixue at 2014-12-04
//Edit by Coral Zhang at 2015-03-23
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
sap.ui.jsview("lenovo.view.cfe.materialMaster.sbbCategory", {
	setConfig: function(config, oServiceUrl, uServiceUrl, auth){
		//table
		config.columns = [{
			field: "BBID", label: "SBB", type: "TextField"
		},{
			field: "SBB_DESC", label: "SBB Desc", type:"TextField"
		},{
			field: "SBB_TYPE", label: "SBB Type", type:"TextField"
		},{
			field: "CHARACTER_V", label: "Characteristic", type:"TextField"
		},{
			field: "COST_CATEGORY", label: "Cost Category", type:"DropdownBox",
			dropdownbox : {
				odata:{
					/*defaultEmpty: true,
					url: oServiceUrl +"/CFE_UI_SBBCategory_EDIT_COST_CATEGORY?$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"*/
					defaultEmpty: true,
					url: oServiceUrl +"/CFE_UI_SBBCategory_DROPDOWNLIST?$filter=ITEM_TYPE eq 'COST_CATEGORY'&$format=json",
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE"
				}
			}			
		},{
			field: "SYS_LAST_MODIFIED_BY", label: "LAST MODIFIED BY", type:"TextField"
		},{
			field: "SYS_LAST_MODIFIED_DATE", label: "LAST MODIFIED DATE", type:"TextField"
		}];
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
//		var headerHeight = 250;
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(2);

		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight);

		//filter
		config.filtersRaw = [{
			field: "CYCLE", label: "Cycle", type: "DropdownBox", 
//			labelLayout: new sap.ui.layout.GridData({span: "L2 M2 S2", linebreak: true}),
			dropdownbox : {
				defaultFilterValue: "CURRENT",
				odata:{
					defaultSelectAll: false,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/CFE_UI_SBBCategory_DROPDOWNLIST?$filter=ITEM_TYPE eq 'CYCLE'&$format=json"
				}				
			}
		}, {
			field: "BBID", label: "SBB", type: "DropdownTable",
//			labelLayout: new sap.ui.layout.GridData({span: "L2 M2 S2", linebreak: true}),
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: oServiceUrl,
				bindRowUrl: "/CFE_UI_SBBCategory_SBB",
				selectionMode: sap.ui.table.SelectionMode.Single,
				field: "BBID",
				columns: [{
					label: "SBB",
					field: "BBID",
					type: "TextField"
				}],
				filters: [[{
					label: "SBB",
					field: "BBID",
					type: "MultiTextField",
					multitextfield: {
//						defaultFilterOp: "EQ"
					}
				}]]
			}
		},{
			field: "CHARACTER_V", label: "Characteristic", type: "DropdownTable",
//			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: oServiceUrl,
				bindRowUrl: "/CFE_UI_SBBCategory_Character",
				selectionMode: sap.ui.table.SelectionMode.Single,
				field: "CHARACTER_V",
				columns: [{
					label: "Characteristic",
					field: "CHARACTER_V",
					type: "TextField"
				}],
				filters: [[{
					label: "Characteristic",
					field: "CHARACTER_V",
					type: "MultiTextField",
					multitextfield: {
//						defaultFilterOp: "EQ"
					}
				}]]
			}
		},{
			field: "COST_CATEGORY", label: "Cost Category", type: "DropdownBox", 
//			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					url: oServiceUrl +"/CFE_UI_SBBCategory_DROPDOWNLIST?$filter=ITEM_TYPE eq 'COST_CATEGORY'&$format=json",
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE"
				}				
			}
		},{
			field: "SYS_LAST_MODIFIED_BY", label: "Last Modified By", type: "DropdownBox", 
//			labelLayout: new sap.ui.layout.GridData({span: "L2 M2 S2", linebreak: true}),
			dropdownbox : {
				odata:{
					defaultSelectAll: true,
					url: oServiceUrl +"/CFE_UI_SBBCategory_DROPDOWNLIST?$filter=ITEM_TYPE eq 'LAST_MODIFIED_BY'&$format=json",
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE"
				}				
			}
		}];
		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);
	/*	config.filterLayout = {
				0: new sap.ui.layout.GridData({span: "L5 M5 S5"}),
				1: new sap.ui.layout.GridData({span: "L5 M5 S5"})
			};*/
		
		//edit		
		config.editRaw = [
		                  {field: "COST_CATEGORY",label: "Cost Category"}
		                  ];

		//download
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.ui_sbbcategory/CV_UI_SBBCategory"';
		config.download.columns=[
			"BBID","SBB_DESC","SBB_TYPE","CHARACTER_V","COST_CATEGORY","SYS_LAST_MODIFIED_BY","SYS_LAST_MODIFIED_DATE"];
		config.download.filename= "UI_SBBCategory";
		
		//upload
		config.upload = {
			url: uServiceUrl + "/ui_sbb_category.xsjs",
			excelUrl: "cfe/materialMaster/sbb_category.xlsx"
		};
		config.viewstatus = {
			viewUploadHistory: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'UI_SBBCATEGORY'",
				selectionMode: sap.ui.table.SelectionMode.Single 
			},
			viewErrorInfo: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_ERR_INFO"
			},
			viewUploadErrorDetail: {
				url: uServiceUrl + "/upload.xsodata/UI_SBBCATEGORY_ERR_DETAIL?$format=json",
				columns: [[{
					label: "Cycle",
					field: "CYCLE",
					type:  "TextField"
				},{
					label: "SBB",
					field: "BBID",
					type:  "TextField"
				},{
					label: "Cost Category",
					field: "COST_CATEGORY",
					type:  "TextField"
					
				}]],
				resubmit: {
					url: uServiceUrl + "/ui_sbb_category.xsjs"
				}
			}
		};

		//toolbar , auth
		config.edit.visible = auth.editable;
		//config.upload.visible = auth.uploadable;
		config.upload.visible = false;
//		config.viewstatus.visible = auth.uploadable;
		config.download.visible = auth.exportable;
		config.create.visible=false;
		config.deleteable.visible=false;
		config.download.roleName = auth.exportableRoleName;
//		config.upload.roleName =  auth.uploadableRoleName;
	},
	createContent: function(){
		var app = new sap.m.App(); 

		var service = new lenovo.service.CFE();
		var oServiceUrl = service.getEBGCfe();
		var uServiceUrl = service.getEBGCfeUpload();

		var oModel = new sap.ui.model.odata.ODataModel(oServiceUrl, true);
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		var auth = lenovo.control.commontable.Table.getViewAuth("sbbCategory");
		this.setConfig(config, oServiceUrl, uServiceUrl,auth);
		var header = lenovo.control.commontable.Table.createHeader("Material Master", "SBB Category");

		config.bindRowUrl = "/CFE_UI_SBBCategory";
		var table = lenovo.control.commontable.Table.createTable(config);
		table.setBusy(true);
		table.setModel(oModel);
		oModel.attachRequestCompleted(function(){
			table.setBusy(false);
		});
		
		//filter		
		var filterPanel = lenovo.control.commontable.Table.createFilter(config, table);
		
		//toolbar		
		var oEditDeleteUploadDownload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table, app);
		
		var oForm = filterPanel.getContent()[0];
		var cycleDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Cycle")[0];
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
				}	*/	
			}
		});

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