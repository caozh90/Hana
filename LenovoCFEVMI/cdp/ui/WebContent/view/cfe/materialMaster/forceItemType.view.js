//Created by Zhang Ruixue at 2014-12-25
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
jQuery.sap.require("lenovo.control.Validation");
sap.ui.jsview("lenovo.view.cfe.materialMaster.forceItemType", {
	setConfig: function(config, oServiceUrl, uServiceUrl, auth){
		//table
		config.columns = [{
			field: "ITEM", label: "Item", type:"TextField"
		},{
			field: "USER_ITEM_DESC", label: "User Item Desc", type: "TextField"
		},{
			field: "USER_ITEM_TYPE", label: "User Item Type", type:"DropdownBox",
			dropdownbox : {
				odata:{
					defaultEmpty: true,
					url: oServiceUrl+"/CFE_UI_ITEM_TYPE_EDIT_DDL?$filter=ITEM_TYPE eq 'ITEM_TYPE'&$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		},{
			field: "USER_EOL_STATUS", label: "User EOL Status", type:"DropdownBox",
			dropdownbox : {
				odata:{
					defaultEmpty: true,
					url: oServiceUrl+"/CFE_UI_ITEM_TYPE_EDIT_DDL?$filter=ITEM_TYPE eq 'USER_EOL_STATUS'&$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		},{
			field: "USER_ASP_PRD_FAMILY", label: "User Family", type:"DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: oServiceUrl,
				bindRowUrl:"/UI_ITEM_EDIT_USER_FAMILY",//"/CFE_UI_ITEM_TYPE_EDIT_DDL?$filter=ITEM_TYPE eq 'USER_ASP_PRD_FAMILY'&$format=json",
				selectionMode: sap.ui.table.SelectionMode.Single,
				field: "PROD_FAMILY",
				columns: [{
					label: "User Family",
					field: "PROD_FAMILY",
					type: "TextField"
				}],
				filters: [[{
					field: "PROD_FAMILY",
					label: "User Family",
					type: "MultiTextField",
					multitextfield: {
//						defaultFilterOp: "EQ"
					}
				}]]
			}
		},{
			field: "SYS_LAST_MODIFIED_BY", label: "Last Modified By", type:"TextField"
		},{
			field: "SYS_LAST_MODIFIED_DATE", label: "Last Modified Date", type:"TextField"
		}];
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
//		var headerHeight = 250;
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(2);

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
					url: oServiceUrl+"/CFE_UI_ITEM_TYPE_SEARCH_DDL?$filter=ITEM_TYPE eq 'CYCLE'&$format=json"
				}				
			}
		},{
			field: "ITEM", label: "Item", type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: oServiceUrl,
				bindRowUrl: "/CFE_UI_ITEM_ITEM",
				//selectionMode: sap.ui.table.SelectionMode.Single,
				field: "ITEM",
				columns: [{
					label: "Item",
					field: "ITEM",
					type: "TextField"
				}],
				filters: [[{
					field: "ITEM",
					label: "Item",
					type: "MultiTextField",
					multitextfield: {
//						defaultFilterOp: "EQ"
					}
				}]]
			}
		},{
			field: "USER_ITEM_TYPE", label: "User Item Type", type: "DropdownBox", 
			dropdownbox : {
				odata: {
					defaultSelectAll:true,
					url: oServiceUrl+"/CFE_UI_ITEM_TYPE_SEARCH_DDL?$filter=ITEM_TYPE eq 'USER_ITEM_TYPE'&$format=json",
					bindTextField:'ITEM_VALUE',
					bindKeyField:'ITEM_VALUE'
				}
			}
		},{
			field: "USER_EOL_STATUS", label: "User EOL Status", type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					url: oServiceUrl+"/CFE_UI_ITEM_TYPE_SEARCH_DDL?$filter=ITEM_TYPE eq 'USER_EOL_STATUS'&$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		},{
			field: "USER_ASP_PRD_FAMILY", label: "User Family", type:"DropdownTable",
			dropdowntable:{
				defaultFilterOp:"EQ",
				url:oServiceUrl,
				bindRowUrl:"/UI_ITEM_SEARCH_USER_FAMILY_DDL",
				selectionMode: sap.ui.table.SelectionMode.Single,
				field:"USER_ASP_PRD_FAMILY",
				columns:[{
					field:"USER_ASP_PRD_FAMILY",
					label:"User Family",
					type: "TextField"
				}],
				filters: [[{
					field: "USER_ASP_PRD_FAMILY",
					label: "User Family",
					type: "MultiTextField",
					multitextfield: {
		//				defaultFilterOp: "EQ"
					}
				}]]
			}
			
		
		}];

		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);

		//create		
		/*config.insertRaw=[{
			field: "PART", label: "Part", type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: oServiceUrl,
				bindRowUrl: "/ITEM_UI_ITEM",
				selectionMode: sap.ui.table.SelectionMode.Single,
				fields: [{
					bindByField: "PART",
					field: "ITEM"
				}],	
				columns: [{
					label: "Part",
					field: "ITEM",
					type: "TextField"
				}],
				filters: [[{
					label: "Part",
					field: "ITEM",
					type: "MultiTextField",
					multitextfield: {
//						defaultFilterOp: "EQ"
					}
				}]]
			}
		},{
			field: "ITEM_TYPE", label: "Item Type",type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: oServiceUrl,
				bindRowUrl: "/CFE_UI_FROCE_ITEM_TYPE_ITEM_TYPE",
				selectionMode: sap.ui.table.SelectionMode.Single,
				fields: [{
					bindByField: "ITEM_TYPE",
					field: "ITEM_TYPE"
				}],	
				columns: [{
					label: "Item Type",
					field: "ITEM_TYPE",
					type: "TextField"
				}],
				filters: [[{
					label: "Item Type",
					field: "ITEM_TYPE",
					type: "MultiTextField",
					multitextfield: {
//						defaultFilterOp: "EQ"
					}
				}]]
			}
		},{
			field: "EOL_STATUS", label: "EOL Status", type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					url: oServiceUrl+"/CFE_UI_FROCE_ITEM_TYPE_CREATE_DDL?$filter=ITEM_TYPE eq 'EOL_STATUS'&$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		}];
		
		config.create.columns = lenovo.control.commontable.Toolkit.splitChunck(2, config.insertRaw);
		config.create.url = "/CFE_UI_ITEM_TYPE";
		config.create.fakeData = {
				"CYCLE" : "CURRENT",
				"PRODUCT_GROUP" : "EBG"
		};*/

		//edit		
		config.editRaw = [
		                  {
		                	  field: "USER_ITEM_DESC", 
		                	  label: "User Item Desc",
		                	  validation: [{
		          				validType: /^.{0,200}$/,
		          				errMsg: "The length of description should <= 200!"
		          			}]
		                  },
		                  {field: "USER_ITEM_TYPE", label: "User Item Type"},
		                  {field: "USER_EOL_STATUS", label: "User EOL Status"},
		                  {field: "USER_ASP_PRD_FAMILY", label: "User Family"}
		                  ];
		
		//download
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.ui_item_type/CV_UI_ITEM"';
		config.download.columns=[
			"CYCLE","ITEM", "USER_ITEM_DESC","USER_ITEM_TYPE", "USER_EOL_STATUS","USER_ASP_PRD_FAMILY"];
		config.download.filename= "UI_FORCEITEMTYPE";
		
		//upload
		config.upload = {
			visible: true,
			url: uServiceUrl + "/ui_force_item_type.xsjs",
			excelUrl: "cfe/materialMaster/force_item_type.xlsx"
		};
		config.viewstatus = {
			visible: true,
			viewUploadHistory: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'UI_ITEM'",
				selectionMode: sap.ui.table.SelectionMode.Single
			},
			viewErrorInfo: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_ERR_INFO"
			},
			viewUploadErrorDetail: {
				url: uServiceUrl + "/upload.xsodata/UI_ITEM_ERR_DETAIL?$format=json",
				columns: [[{
					label: "Cycle",
					field: "CYCLE",
					type:  "TextField"
				},{
					label: "Item",
					field: "ITEM",
					type:  "TextField"
				},{
					label: "User Item Desc",
					field: "USER_ITEM_DESC",
					type:  "TextField"
				},{
					label: "User Item Type",
					field: "USER_ITEM_TYPE",
					type:  "TextField"
				},{
					label: "User EOL Status",
					field: "USER_EOL_STATUS",
					type:  "TextField"
				},{
					label: "User Family",
					field: "USER_ASP_PRD_FAMILY",
					type:  "TextField"
				}]],
				resubmit: {
					url: uServiceUrl + "/ui_force_item_type.xsjs"
				}
			}
		};
		
		//toolbar , auth
		config.create.visible = false;//auth.createable;
		config.edit.visible = auth.editable;
		config.deleteable.visible = false;
		config.upload.visible = auth.uploadable;
		config.viewstatus.visible = auth.uploadable;
		config.download.visible = auth.exportable;
		config.download.roleName = auth.exportableRoleName;
		config.upload.roleName =  auth.uploadableRoleName;

	},
	createContent: function(){	
		var app = new sap.m.App(); 
		var service = new lenovo.service.CFE();
		var oServiceUrl = service.getEBGCfe();
		var uServiceUrl = service.getEBGCfeUpload();

		var oModel = new sap.ui.model.odata.ODataModel(oServiceUrl, true);
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		var auth = lenovo.control.commontable.Table.getViewAuth("forceItemType");

		this.setConfig(config, oServiceUrl, uServiceUrl, auth);
		var header = lenovo.control.commontable.Table.createHeader("Material Master", "Force Item Type");

		config.bindRowUrl = "/CFE_UI_ITEM_TYPE";
		var table = lenovo.control.commontable.Table.createTable(config);
		table.setBusy(true);
		table.setModel(oModel);
		oModel.attachRequestCompleted(function(){
			table.setBusy(false);
		});
		
		//filter
		var filterPanel = lenovo.control.commontable.Table.createFilter(config, table);
		
		//toolbar				
		var oEditDeleteUploadDownload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table,app);
		
		var oForm = filterPanel.getContent()[0];
		var cycleDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Cycle")[0];
		var buttons = oEditDeleteUploadDownload.getContent()[0].getContent();
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
		cycleDropdownBox.attachChange(function(){
			var selectedKey = this.getSelectedKey();
			if(selectedKey === "CURRENT") {
				if(editButton){
					editButton.setVisible(true);
				}
				if(deleteButton){
					deleteButton.setVisible(true);
				}
				if(auth.uploadable){
					uploadButton.setVisible(true);
					uploadTemButton.setVisible(true);
					viewStatusButton.setVisible(true);
				}
				
			} else {
				if(editButton){
					editButton.setVisible(false);
				}
				if(deleteButton){
					deleteButton.setVisible(false);
				}
				if(auth.uploadable && uploadButton){
					uploadButton.setVisible(false);
					uploadTemButton.setVisible(false);
					viewStatusButton.setVisible(false);
				}		
			}
		});
		
		/*//filter, part, item type cascade		
		var partDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Part")[0];
		var itemTypeDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Item Type")[0];
		lenovo.control.commontable.Toolkit.relateDropDwonBox(partDropdownBox, itemTypeDropdownBox, {
			transform: function (data){
				return data.d.results;
			},
			url: function(selectedKey){
				return oServiceUrl+"/INPUT_ITEMTYPE(INPUT_PART='" + selectedKey + "')/Results?$format=json";
			},
			bindTextField:"ITEM_VALUE",
			bindKeyField:"ITEM_VALUE"
		});*/
		
		//app
	    var page = new sap.m.Page({
	      	  showHeader: false,
	          content :[header, filterPanel, oEditDeleteUploadDownload, table]//[layout]                
	    });
        app.insertPage(page);
        app.setInitialPage(page);
        return app;	
	},
	
});