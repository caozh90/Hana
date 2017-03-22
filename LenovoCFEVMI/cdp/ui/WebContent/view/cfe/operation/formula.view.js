//Created by Zhang Ruixue at 2014-12-03
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
sap.ui.jsview("lenovo.view.cfe.operation.formula", {
	setCreateCascade: function(oServiceUrl){
		var defaultBrand = null, defaultFamily = null;
		$.ajax({
			url: oServiceUrl+"/CREATE_BRAND_DDL?$filter=ITEM_TYPE eq 'BRAND'&$format=json",
			type: "GET",
			dataType: "json", 
			async: false,
			success: function(data){
				if(data.d.results.length > 0)
					defaultBrand = data.d.results[0].ITEM_VALUE;
			}		
		});
		if(defaultBrand !== null) {

			$.ajax({
				url: oServiceUrl + "/INPUT_BRAND5(INPUT_BRAND='" + defaultBrand + "')/Results?$format=json",
				type: "GET",
				dataType: "json", 
				async: false,
				success: function(data){
					if(data.d.results.length > 0)
						defaultFamily = data.d.results[0].ITEM_VALUE;
				}
			});	
		}
		return {
			defaultBrand: defaultBrand,
			defaultFamily: defaultFamily
		};
	},
	setConfig: function(config, oServiceUrl, uServiceUrl, auth){

		//table		
		config.columns = [{
			field: "BRAND", label: "Brand", type:"TextField", width: "150px"
		},{
			field: "PRODFAMILY", label: "Product Family", type:"TextField", width: "150px"
		},{
			field: "CATEGORY", label: "Category", type:"TextField", width: "150px"
		},{
			field: "PLANT", label: "Plant", type:"TextField", width: "150px"
		},{
			field: "SUBGEO", label: "SUBGEO", type:"TextField", width: "150px"
		},{
			field: "LEVEL1_TBAS", label: "Level1 Tabs", type:"TextField", width: "200px"
		},{
			field: "LEVEL2_TBAS", label: "Level2 Tabs", type:"TextField", width: "200px"
		},{
			field: "LEVEL3_TBAS", label: "Level3 Tabs", type:"TextField", width: "200px"
		},{
			field: "LEVEL4_TBAS", label: "Level4 Tabs", type:"TextField", width: "200px"
		},{
			field: "LEVEL5_TBAS", label: "Level5 Tabs", type:"TextField", width: "200px"
		},{
			field: "LEVEL6_TBAS", label: "Level6 Tabs", type:"TextField", width: "200px"
		},{
			field: "SYS_LAST_MODIFIED_BY", label: "Last Modified By", type:"TextField", width: "150px"
		},{
			field: "SYS_LAST_MODIFIED_DATE", label: "Last Modified Date", type:"TextField", width: "150px"
		}];
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
//		var headerHeight = 255;
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(2);

		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight - 10);
		
		//filter
		config.filtersRaw = [{
			field: "CYCLE", label: "Cycle", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
			dropdownbox : {
				defaultFilterValue: "CURRENT",
				odata:{
					defaultSelectAll: false,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_COST_CALCU_FORMU_SEARCH_DDL?$filter=ITEM_TYPE eq 'CYCLE'&$format=json"
				}				
			}
		},{
			field: "CATEGORY", label: "Category", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
			dropdownbox : {
				odata: {
					defaultSelectAll:true,
					url: oServiceUrl +"/UI_COST_CALCU_FORMU_SEARCH_DDL?$filter=ITEM_TYPE eq 'Category'&$format=json",
					bindTextField:'ITEM_VALUE',
					bindKeyField:'ITEM_VALUE'
				}
			}
		},{
			field: "BRAND", label: "Brand", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L2 M2 S2", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L9 M9 S9"}),
				odata:{
					defaultSelectAll:true,
					url: oServiceUrl +"/UI_COST_CALCU_FORMU_SEARCH_DDL?$filter=ITEM_TYPE eq 'Brand'&$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		},{
			field: "PLANT", label: "Plant", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L2 M2 S2", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L9 M9 S9"}),
				odata:{
					defaultSelectAll:true,
					url: oServiceUrl +"/UI_COST_CALCU_FORMU_SEARCH_DDL?$filter=ITEM_TYPE eq 'Plant'&$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		},{
			field: "PRODFAMILY", label: "Product Family", type: "DropdownBox", 
			dropdownbox : {
				data:[{"text": lenovo.control.Constants.allDropdownBoxListItem, "key": lenovo.control.Constants.allDropdownBoxListItem}]					
			}
		},{
			field: "SUBGEO", label: "SUBGEO", type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					url: oServiceUrl +"/UI_COST_CALCU_FORMU_SEARCH_DDL?$filter=ITEM_TYPE eq 'SUBGEO'&$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		}];

		config.filters = lenovo.control.commontable.Toolkit.splitChunck(4, config.filtersRaw);
		
		//create	
		var defaultInsertValue = this.setCreateCascade(oServiceUrl);
		config.insertRaw=[{
			field: "BRAND", label: "Brand", type:"DropdownBox",
			dropdownbox : {
				defaultValue: defaultInsertValue.defaultBrand,
				odata:{
					url: oServiceUrl +"/CREATE_BRAND_DDL?$filter=ITEM_TYPE eq 'BRAND'&$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		},{
			field: "PRODFAMILY", label: "Product Family", type:"DropdownBox",
			dropdownbox : {
				defaultValue: defaultInsertValue.defaultFamily,			
			}
		},{
			field: "CATEGORY", label: "Category", type:"DropdownBox",
			dropdownbox : {
				odata:{
					url: oServiceUrl +"/UI_COST_CALCU_FORMU_CREATE_DDL?$filter=ITEM_TYPE eq 'Category'&$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		},{
			field: "PLANT", label: "Plant", type:"DropdownBox",
			dropdownbox : {
				odata:{
					url: oServiceUrl +"/UI_COST_CALCU_FORMU_CREATE_DDL?$filter=ITEM_TYPE eq 'Plant'&$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		},{
			field: "SUBGEO", label: "SUBGEO", type:"DropdownBox",
			dropdownbox : {
				odata:{
					url: oServiceUrl +"/UI_COST_CALCU_FORMU_CREATE_DDL?$filter=ITEM_TYPE eq 'SUBGEO'&$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		}];
		
		config.create.columns = lenovo.control.commontable.Toolkit.splitChunck(2, config.insertRaw);
		config.create.url = "/UI_COST_CALCU_FORMU";
		config.create.fakeData = {
				"PRODUCT_GROUP" : "EBG",
				"CYCLE": "CURRENT"	
		};
		
		//edit		
		config.editRaw = [
		                  {field: "LEVEL1_TBAS", label: "Level1 Tabs"},
		                  {field: "LEVEL2_TBAS", label: "Level2 Tabs"},
		                  {field: "LEVEL3_TBAS", label: "Level3 Tabs"},
		                  {field: "LEVEL4_TBAS", label: "Level4 Tabs"},
		                  {field: "LEVEL5_TBAS", label: "Level5 Tabs"},
		                  {field: "LEVEL6_TBAS", label: "Level6 Tabs"}
		                  ];
		
		//download
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.ui_cost_calcu_formu/CV_UI_COST_CALCU_FORMU"';
		config.download.columns=[
			 "CYCLE","BRAND","PRODFAMILY","CATEGORY","PLANT","SUBGEO","LEVEL1_TBAS","LEVEL2_TBAS",
			 "LEVEL3_TBAS","LEVEL4_TBAS","LEVEL5_TBAS","LEVEL6_TBAS"];
		config.download.filename= "UI_COST_CALCU_FORMU";
		
		//upload
		config.upload = {
			url: uServiceUrl + "/ui_calculation_formula.xsjs",
			excelUrl: "cfe/operation/formula.xlsx"
		};
		config.viewstatus = {
			viewUploadHistory: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'UI_COST_CALCU_FORMU'",
				selectionMode: sap.ui.table.SelectionMode.Single
			},
			viewErrorInfo: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_ERR_INFO"
			},
			viewUploadErrorDetail: {
				url: uServiceUrl + "/upload.xsodata/UI_COST_CALCU_FORMU_ERR_DETAIL?$format=json",
				columns: [[{
					label: "Cycle",
					field: "CYCLE",
					type:  "TextField"
				},{
					label: "Brand",
					field: "BRAND",
					type:  "TextField"
				},{
					label: "Product Family",
					field: "PRODFAMILY",
					type:  "TextField"
				},{
					label: "Category",
					field: "CATEGORY",
					type:  "TextField"
					
				},{
					label: "Plant",
					field: "PLANT",
					type:  "TextField"
				},{
					label: "SUBGEO",
					field: "SUBGEO",
					type:  "TextField"
					
				}],[{
					field: "LEVEL1_TBAS", 
					label: "Level1 Tabs",
					type:  "TextField"
				},{
					field: "LEVEL2_TBAS", 
					label: "Level2 Tabs",
					type:  "TextField"
				},{
					field: "LEVEL3_TBAS", 
					label: "Level3 Tabs",
					type:  "TextField"
				},{
					field: "LEVEL4_TBAS", 
					label: "Level4 Tabs",
					type:  "TextField"
				},{
					field: "LEVEL5_TBAS", 
					label: "Level5 Tabs",
					type:  "TextField"
				},{
					field: "LEVEL6_TBAS", 
					label: "Level6 Tabs",
					type:  "TextField"
				}]],
				resubmit: {
					url: uServiceUrl + "/ui_calculation_formula.xsjs"
				}
			}
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
	createContent: function(){
		var app = new sap.m.App(); 
		var service = new lenovo.service.CFE();
		var oServiceUrl = service.getEBGCfe();
		var uServiceUrl = service.getEBGCfeUpload();

		var oModel = new sap.ui.model.odata.ODataModel(oServiceUrl, true);
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		var auth = lenovo.control.commontable.Table.getViewAuth("formula");
		
		this.setConfig(config, oServiceUrl, uServiceUrl,auth);
		var header = lenovo.control.commontable.Table.createHeader("Operation", "Formula");

		config.bindRowUrl = "/UI_COST_CALCU_FORMU";
		var table = lenovo.control.commontable.Table.createTable(config);
		table.setBusy(true);
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
		table.setModel(oModel);
		oModel.attachRequestCompleted(function(){
			table.setBusy(false);
		});
		
		var filterPanel = lenovo.control.commontable.Table.createFilter(config, table);

		//toolbar		
		var oEditDeleteUploadDownload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table, app);
		
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
					case "upload, only xlsx and csv files are allowed"://update by Chris Gao 2015-11-01
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
		 
		//filter: brand, prod_family cascade
		var brandDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Brand")[0];
		var prodFamilyDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Product Family")[0];
		lenovo.control.commontable.Toolkit.relateDropDwonBox(brandDropdownBox, prodFamilyDropdownBox, {
			transform: function (data){
				return data.d.results;
			},
			url: function(selectedKey){
				return oServiceUrl+"/INPUT_BRAND4(INPUT_BRAND='" + selectedKey + "')/Results?$format=json";
			},
			bindTextField:"ITEM_VALUE",
			bindKeyField:"ITEM_VALUE"
		});
		
		//create: brand, prod_family cascade
		if(auth.createable){
			var insertDialog = oEditDeleteUploadDownload.data("insertDialog");
		    var insertForm = insertDialog.getContent()[0];
		    var brandDropdownBox2 = lenovo.control.commontable.Toolkit.getFormElementByLabel(insertForm, "Brand")[0];
		    var prodFamilyDropdownBox2 = lenovo.control.commontable.Toolkit.getFormElementByLabel(insertForm, "Product Family")[0];
		    var opts = {
		    		transform: function (data){
						return data.d.results;
					},
					url: function(selectedKey){
						return oServiceUrl+"/INPUT_BRAND5(INPUT_BRAND='" + selectedKey + "')/Results?$format=json";
					},
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE",
					notAddFirstListItem:true
		    };
		    var createBrandValue = brandDropdownBox2.getValue();
		    opts.selectedKey = createBrandValue;
		    lenovo.control.commontable.Toolkit.reReloadDropdownBox(prodFamilyDropdownBox2, opts);
			lenovo.control.commontable.Toolkit.relateDropDwonBox(brandDropdownBox2, prodFamilyDropdownBox2, opts);	
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