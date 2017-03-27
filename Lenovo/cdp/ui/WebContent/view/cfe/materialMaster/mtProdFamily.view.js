//Created by Zhang Ruixue at 2014-12-01
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
sap.ui.jsview("lenovo.view.cfe.materialMaster.mtProdFamily", {
	setConfig: function(config, oServiceUrl, uServiceUrl, auth){
		//table
		config.columns = [{
			field: "BRAND", label: "Brand", type:"DropdownBox",
				 dropdownbox : {
				 	odata:{
				 		url: oServiceUrl+"/CFE_UI_MACHINE_TYPE_CREATE_DDL?$filter=ITEM_TYPE eq 'BRAND'&$format=json",
				 		bindTextField:"ITEM_VALUE",
				 		bindKeyField:"ITEM_VALUE"
				 	}
				 }
		},{
			field: "PROD_FAMILY", label: "Prodoct Family", type:"DependentDropdown"
			// dropdownbox : {
			// 	odata:{
			// 		url: oServiceUrl+"/CFE_UI_MACHINE_TYPE_SEARCH_DDL?$filter=ITEM_TYPE eq 'PROD_FAMILY'&$format=json",
			// 		bindTextField:"ITEM_VALUE",
			// 		bindKeyField:"ITEM_VALUE"
			// 	}
			// }
		},{
			field: "MACHINETYPE", label: "MT", type:"TextField"
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
//			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
			dropdownbox : {
				defaultFilterValue: "CURRENT",
				odata:{
					defaultSelectAll: false,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl+"/CFE_UI_MACHINE_TYPE_SEARCH_DDL?$filter=ITEM_TYPE eq 'CYCLE'&$format=json"
				}				
			}
		},{
			field: "BRAND", label: "Brand", type: "DropdownBox", 
//			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
			dropdownbox : {
				odata: {
					defaultSelectAll:true,
					url: oServiceUrl+"/CFE_UI_MACHINE_TYPE_SEARCH_DDL?$filter=ITEM_TYPE eq 'BRAND'&$format=json",
					bindTextField:'ITEM_VALUE',
					bindKeyField:'ITEM_VALUE'
				}
			}
		},{
			field: "PROD_FAMILY", label: "Prod_Family", type: "DropdownBox", 
			dropdownbox : {
				data: [{
					text: lenovo.control.Constants.allDropdownBoxListItem,
					key: lenovo.control.Constants.allDropdownBoxListItem
				}]
			}
		},{
			field: "MACHINETYPE", label: "MT", type: "DropdownBox", 
//			labelLayout: new sap.ui.layout.GridData({span: "L2 M2 S2", linebreak: true}),
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					url: oServiceUrl+"/CFE_UI_MACHINE_TYPE_SEARCH_DDL?$filter=ITEM_TYPE eq 'MACHINETYPE'&$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		}];

		config.filters = lenovo.control.commontable.Toolkit.splitChunck(2, config.filtersRaw);

		//edit		
		config.editRaw = [
		                  {field: "BRAND", label: "Brand"},
		                  {field: "PROD_FAMILY", 
		                  label: "Prodoct Family", 
		                  refer: "Brand",
		              	  url: oServiceUrl+"/INPUT_BRAND5(INPUT_BRAND='",
		              	   bindTextField:"ITEM_VALUE",
                          bindKeyField:"ITEM_VALUE",
                          emptyFirstListItem:false
		              	}];
		
		//download
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.ui_machine_type/CV_UI_MACHINE_TYPE"';
		config.download.columns=[
			"CYCLE","BRAND","PROD_FAMILY","MACHINETYPE"];
		config.download.filename= "UI_MACHINETYPE";
		
		//upload
		config.upload = {
			visible: true,
			url: uServiceUrl + "/ui_mt_family_mapping.xsjs",
			excelUrl: "cfe/materialMaster/mt_prod_family.xlsx"
		};
		config.viewstatus = {
			visible: true,
			viewUploadHistory: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'UI_MACHINETYPE'",
				selectionMode: sap.ui.table.SelectionMode.Single
			},
			viewErrorInfo: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_ERR_INFO"
			},
			viewUploadErrorDetail: {
				url: uServiceUrl + "/upload.xsodata/UI_MACHINETYPE_ERR_DETAIL?$format=json",
				columns: [[{
					label: "Cycle",
					field: "CYCLE",
					type:  "TextField"
				},{
					label: "MT",
					field: "MACHINETYPE",
					type:  "TextField"
				},{
					field: "BRAND", 
					label: "Brand",
					type:  "TextField"
				},{
					field: "PROD_FAMILY", 
					label: "Prodoct Family",
					type:  "TextField"
				}]],
				resubmit: {
					url: uServiceUrl + "/ui_mt_family_mapping.xsjs"
				}
			}
		};
		
		//toolbar , auth
		config.edit.visible = auth.editable;
		config.upload.visible = auth.uploadable;
		config.viewstatus.visible = auth.uploadable;
		config.download.visible = auth.exportable;
		config.deleteable.visible=false;
		config.create.visible = false;
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
		var auth = lenovo.control.commontable.Table.getViewAuth("mtProdFamily");

		this.setConfig(config, oServiceUrl, uServiceUrl, auth);
		var header = lenovo.control.commontable.Table.createHeader("Material Master", "MT - PROD Family");

		config.bindRowUrl = "/CFE_UI_MACHINE_TYPE";
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
		var brandDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Brand")[0];
		var proFamilyDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Prod_Family")[0];
		lenovo.control.commontable.Toolkit.relateDropDwonBox(brandDropdownBox, proFamilyDropdownBox, {
			transform: function (data){
				return data.d.results;
			},
			url: function(selectedKey){
				return oServiceUrl+"/INPUT_BRAND6(INPUT_BRAND='" + selectedKey + "')/Results?$format=json";
			},
			bindTextField:"ITEM_VALUE",
			bindKeyField:"ITEM_VALUE",
			emptyFirstListItem:true
		});
		var buttons = oEditDeleteUploadDownload.getContent()[0].getContent();
		var editButton = null, uploadButton = null, uploadTemButton = null, viewStatusButton = null;
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
				if(auth.uploadable){
					uploadButton.setVisible(true);
					uploadTemButton.setVisible(true);
					viewStatusButton.setVisible(true);
				}
			} else {
				if(editButton){
					editButton.setVisible(false);
				}
				if(auth.uploadable && uploadButton){ //coral 4/23/2015
					uploadButton.setVisible(false);
					uploadTemButton.setVisible(false);
					viewStatusButton.setVisible(false);
				}		
			}
		});
		
////		//create, brand, prod_family cascade
//		var insertDialog = oEditDeleteUploadDownload.data("insertDialog");
//		console.log("insertDialog",insertDialog.getContent());
//	    var insertForm = insertDialog.getContent()[0];
//	    	
//		var brandDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(insertForm, "Brand")[0];
//		var prodFamilyDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(insertForm, "Prod Family")[0];
//		lenovo.control.commontable.Toolkit.relateDropDwonBox(brandDropdownBox, prodFamilyDropdownBox, {
//			transform: function (data){
//				return data.d.results;
//			},
//			url: function(selectedKey){
//				return oServiceUrl+"/INPUT_BRAND5(INPUT_BRAND='" + selectedKey + "')/Results?$format=json";
//			},
//			bindTextField:"ITEM_VALUE",
//			bindKeyField:"ITEM_VALUE",
//			emptyFirstListItem:true
//
//		});

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