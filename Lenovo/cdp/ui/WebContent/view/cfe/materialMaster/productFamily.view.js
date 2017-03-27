//Created by Zhang Ruixue at 2014-12-01
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
sap.ui.jsview("lenovo.view.cfe.materialMaster.productFamily", {
	setConfig: function(config, oServiceUrl, uServiceUrl, auth){
		//table
		config.columns = [{
			field: "BRAND", label: "Brand", type:"TextField"
		},{
			field: "PROD_FAMILY", label: "Prodoct Family", type:"TextField"
		},{
			field: "EOL_STATUS", label: "EOL_Status", type:"DropdownBox",
			dropdownbox : {
				odata:{
					defaultEmpty: true,
					url: oServiceUrl+"/CV_UI_PRODFAMILY_CREATE_DROPDOWNLIST?$filter=ITEM_TYPE eq 'EOL_STATUS'&$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		},{
			field: "EOL_STARTDATE", label: "Life Start Date", type:"DatePicker",width:"150px"
		},{
			field: "EOL_ENDDATE", label: "Life End Date", type:"DatePicker",width:"150px"
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
					url: oServiceUrl+"/CV_UI_PRODFAMILY_DROPDOWNLIST?$filter=ITEM_TYPE eq 'CYCLE'&$format=json"
				}				
			}
		},{
			field: "EOL_STATUS", label: "EOL_Status", type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					url: oServiceUrl+"/CV_UI_PRODFAMILY_DROPDOWNLIST?$filter=ITEM_TYPE eq 'EOL_STATUS'&$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		},{
			field: "BRAND", label: "Brand", type: "DropdownBox", 
//			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
			dropdownbox : {
				odata: {
					defaultSelectAll:true,
					url: oServiceUrl+"/CV_UI_PRODFAMILY_DROPDOWNLIST?$filter=ITEM_TYPE eq 'BRAND'&$format=json",
					bindTextField:'ITEM_VALUE',
					bindKeyField:'ITEM_VALUE'
				}
			}
		},{
			field: "PROD_FAMILY", label: "Prod_Family", type: "DropdownBox", 
			dropdownbox : {
				data:[{"text": lenovo.control.Constants.allDropdownBoxListItem, "key": lenovo.control.Constants.allDropdownBoxListItem}]			
			}
		}];

		config.filters = lenovo.control.commontable.Toolkit.splitChunck(2, config.filtersRaw);

		//create		
		config.insertRaw=[{
			field: "BRAND", label: "Brand", type: "DropdownBox", 
			dropdownbox : {
				odata: {
					url: oServiceUrl+"/CV_UI_PRODFAMILY_CREATE_DROPDOWNLIST?$filter=ITEM_TYPE eq 'BRAND'&$format=json",
					bindTextField:'ITEM_VALUE',
					bindKeyField:'ITEM_VALUE'
				}
			}
		},{
			field: "PROD_FAMILY", label: "Prod_Family", type:"TextField"
		},{
			field: "EOL_STATUS", label: "EOL_Status",  type:"DropdownBox",
			dropdownbox : {
				odata:{
					url: oServiceUrl+"/CV_UI_PRODFAMILY_CREATE_DROPDOWNLIST?$filter=ITEM_TYPE eq 'EOL_STATUS'&$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		},{
			field: "EOL_STARTDATE", label: "Life Start Date", type:"DatePicker",width:"150px"
		},{
			field: "EOL_ENDDATE", label: "Life End Date", type:"DatePicker",width:"150px"
		}];
		
		config.create.columns = lenovo.control.commontable.Toolkit.splitChunck(2, config.insertRaw);
		config.create.url = "/CFE_UI_PRODFAMILY";
		config.create.fakeData = {
				"CYCLE" : "CURRENT",
				"PRODUCT_GROUP" : "EBG"
		};

		//edit		
		config.editRaw = [
		                  {field: "EOL_STATUS", label: "EOL_Status"},
		                  {field: "EOL_STARTDATE", label: "Life Start Date", type: "DatePicker"},
		                  {field: "EOL_ENDDATE", label: "Life End Date", type: "DatePicker",referTo: "Life Start Date"}
		                  ];
		
		//download
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.ui_prodfamily/CV_UI_PRODFAMILY"';
		config.download.columns=[
			"CYCLE","BRAND","PROD_FAMILY","EOL_STATUS","EOL_STARTDATE","EOL_ENDDATE"];
		config.download.filename= "UI_PRODFAMILY";
		
		//upload
		config.upload = {
			url: uServiceUrl + "/ui_prodfamily.xsjs",
			excelUrl: "cfe/materialMaster/prod_family.xlsx"
		};
		config.viewstatus = {
			viewUploadHistory: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'UI_PRODFAMILY'",
				selectionMode: sap.ui.table.SelectionMode.Single,
				visibleRowCount: 10
			},
			viewErrorInfo: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_ERR_INFO",
				visibleRowCount: 10
			},
			viewUploadErrorDetail: {
				url: uServiceUrl + "/upload.xsodata/UI_PRODFAMILY_ERR_DETAIL?$format=json",
				columns: [[
				{
					label: "Cycle",
					field: "CYCLE",
					type:  "TextField"
				},{
					label: "Brand",
					field: "BRAND",
					type:  "TextField"
				},{
					label: "Product Family",
					field: "PROD_FAMILY",
					type:  "TextField"
				}],[{
					label: "EOL_Status",
					field: "EOL_STATUS",
					type:  "TextField"
				},{
					label: "Life Start Date",
					field: "EOL_STARTDATE",
					type: "TextField"
				},{
					label: "Life End Date",
					field: "EOL_ENDDATE",
					type: "TextField"
				}]],
				resubmit: {
					url: uServiceUrl + "/ui_prodfamily.xsjs"
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
		var auth = lenovo.control.commontable.Table.getViewAuth("productFamily");
		
		this.setConfig(config, oServiceUrl, uServiceUrl,auth);
		var header = lenovo.control.commontable.Table.createHeader("Material Master", "Product Family");

		config.bindRowUrl = "/CFE_UI_PRODFAMILY";
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
				if(auth.uploadable && uploadButton){    //coral 4/23/2015
					uploadButton.setVisible(false);
					uploadTemButton.setVisible(false);
					viewStatusButton.setVisible(false);
				}		
			}
		});
		
		//create, compare startDate, endDate
		if(auth.createable){
			var insertDialog = oEditDeleteUploadDownload.data("insertDialog");
		    var insertForm = insertDialog.getContent()[0];
		    var oLifeStartDatePicker = lenovo.control.commontable.Toolkit.getFormElementByLabel(insertForm, "Life Start Date")[0];
		    var oLifeEndDatePicker = lenovo.control.commontable.Toolkit.getFormElementByLabel(insertForm, "Life End Date")[0];
		    lenovo.control.commontable.Toolkit.validateDatePickerCompare(oLifeStartDatePicker, oLifeEndDatePicker);  	
		}  
	    
		//brand, prod_family cascade
		var brandDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Brand")[0];
		var prodFamilyDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Prod_Family")[0];
		lenovo.control.commontable.Toolkit.relateDropDwonBox(brandDropdownBox, prodFamilyDropdownBox, {
			transform: function (data){
				return data.d.results;
			},
			url: function(selectedKey){
				return oServiceUrl+"/INPUT_BRAND2(INPUT_BRAND='" + selectedKey + "')/Results?$format=json";
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
	}
});