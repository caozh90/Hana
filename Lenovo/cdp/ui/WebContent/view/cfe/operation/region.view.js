//Created by Zhang Ruixue at 2014-12-04
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
jQuery.sap.require("lenovo.control.Validation");
sap.ui.jsview("lenovo.view.cfe.operation.region", {
	setConfig: function(config, oServiceUrl, uServiceUrl, auth){
		//table
		config.columns = [{
			field: "GEO", label: "GEO", type: "TextField"
		},{
			field: "SUBGEO", label: "SUBGEO", type:"TextField"
		},{
			field: "COUNTRY", label: "Country", type: "TextField"
		},{
			field: "COUNTRY_NAME", label: "Country Name", type:"TextField"
		},/*{
			field: "SALES_ORG", label: "Sales Org", type:"TextField"
		},{
			field: "SALES_OFFICE", label: "Sales Office", type:"TextField"
		},*/{
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
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
			dropdownbox : {
				defaultFilterValue: "CURRENT",
				layout: new sap.ui.layout.GridData({span: "L9 M9 S9"}),
				odata:{
					defaultSelectAll: false,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_REGION_DROPDOWNLIST?$filter=ITEM_TYPE eq 'CYCLE'&$format=json"
				}				
			}
		},{
			field: "COUNTRY", label: "Country", type: "DropdownBox",
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L9 M9 S9"}),
				data:[{"text": lenovo.control.Constants.allDropdownBoxListItem, "key": lenovo.control.Constants.allDropdownBoxListItem}]						
			}
		},{
			field: "GEO", label: "GEO", type: "DropdownBox",
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_REGION_DROPDOWNLIST?$filter=ITEM_TYPE eq 'GEO'&$format=json"
				}	
					
			}
		},/*{
			field: "SALES_ORG", label: "Sales Org", type: "TextField"
		},*/{
			field: "COUNTRY_NAME", label: "Country Name", type: "DropdownBox",
			dropdownbox : {
				data:[{"text": lenovo.control.Constants.allDropdownBoxListItem, "key": lenovo.control.Constants.allDropdownBoxListItem}]						
			}
		},{
			field: "SUBGEO", label: "SUBGEO", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L9 M9 S9"}),
				data:[{"text": lenovo.control.Constants.allDropdownBoxListItem, "key": lenovo.control.Constants.allDropdownBoxListItem}]						
			}
		},/*{
			field: "SALES_OFFICE", label: "Sales Office", type: "TextField"
		},*/];

		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);

		//create		
		config.insertRaw=[{
			field: "GEO", label: "GEO", type: "TextField",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "GEO is required!"
			},{
				validType: /^.{0,40}$/,
				errMsg: "The length of GEO should <= 40!"
			}]
		},{
			field: "SUBGEO", label: "SUBGEO", type: "TextField",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "SUBGEO is required!"
			},{
					validType: /^.{0,20}$/,
					errMsg: "The length of SUBGEO should <= 20!"
			}]
		},{
			field: "COUNTRY", label: "Country", type: "TextField",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Country is required!"
			},{
					validType: /^.{0,20}$/,
					errMsg: "The length of country should <= 20!"
			}]
		},{
			field: "COUNTRY_NAME", label: "Country Name", type: "TextField",
			validation: [{
					validType: /^.{0,40}$/,
					errMsg: "The length of country name should <= 40!"
			}]
		}/*,{
			field: "SALES_ORG", label: "Sales Org", type: "TextField"
		},{
			field: "SALES_OFFICE", label: "Sales Office", type: "TextField"
		}*/];
		
		config.create.columns = lenovo.control.commontable.Toolkit.splitChunck(2, config.insertRaw);
		config.create.url = "/CFE_UI_REGION";
		config.create.fakeData = {
				"PRODUCT_GROUP" : "EBG"
		};
		
		//edit		
		config.editRaw = [/*{
			field: "SUBGEO", 
			label: "SUBGEO",
			validation: [{
				validType: /^.{0,20}$/,
				errMsg: "The length of GEO should <= 20!"
			}]
		},{
			field: "COUNTRY", 
			label: "Country",
			validation: [{
				validType: /^.{0,20}$/,
				errMsg: "The length of country should <= 20!"
			}]
		},*/{
			field: "COUNTRY_NAME", 
			label: "Country Name",
			validation: [{
				validType: /^.{0,40}$/,
				errMsg: "The length of country name should <= 40!"
			}]
		}/*,
		                  {field: "SALES_ORG", label: "Sales Org"},
		                  {field: "SALES_OFFICE", label: "Sales Office"}*/
		                  ];
		
		//download
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.ui_region/CV_UI_REGION"';
		config.download.columns = [
			"CYCLE","GEO","SUBGEO","COUNTRY","COUNTRY_NAME"/*"SALES_ORG","SALES_OFFICE",*/];
		config.download.filename= "UI_REGION";
		
		//upload
		config.upload = {
			url: uServiceUrl + "/ui_region.xsjs",
			excelUrl: "cfe/operation/region.xlsx"
		};
		config.viewstatus = {
			viewUploadHistory: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'UI_REGION'",
				selectionMode: sap.ui.table.SelectionMode.Single
			},
			viewErrorInfo: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_ERR_INFO"
			},
			viewUploadErrorDetail: {
				url: uServiceUrl + "/upload.xsodata/UI_REGION_ERR_DETAIL?$format=json",
				columns: [[{
					label: "Cycle",
					field: "CYCLE",
					type:  "TextField"
				},{
					label: "GEO",
					field: "GEO",
					type:  "TextField"
				},{
					label: "SUBGEO",
					field: "SUBGEO",
					type:  "TextField"
				}],[{
					label: "Country",
					field: "COUNTRY",
					type:  "TextField"
				},{
					label: "Country Name",
					field: "COUNTRY_NAME",
					type:  "TextField"		
				}]],
				resubmit: {
					url: uServiceUrl + "/ui_region.xsjs"
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
		var auth = lenovo.control.commontable.Table.getViewAuth("region");
		
		this.setConfig(config, oServiceUrl, uServiceUrl,auth);
		var header = lenovo.control.commontable.Table.createHeader("Operation", "Region");

		config.bindRowUrl = "/CFE_UI_REGION";
		var table = lenovo.control.commontable.Table.createTable(config);
		table.setBusy(true);
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
		
		//geo, subgeo, country, country name cascade	
		var geoDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "GEO")[0];
		var subgeoDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "SUBGEO")[0];
		var countryDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Country")[0];
		var countryNameDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Country Name")[0];
		
		//GEO, SUBGEO
		lenovo.control.commontable.Toolkit.relateDropDwonBox(geoDropdownBox, subgeoDropdownBox, {
			transform: function (data){
				return data.d.results;
			},
			url: function(selectedKey){
				return oServiceUrl +"/INPUT_GEO(INPUT_GEO='" + selectedKey + "')/Results?$format=json";
			},
			bindTextField:"ITEM_VALUE",
			bindKeyField:"ITEM_VALUE"
		});
		
		//SUBGEO, COUNTRY
		lenovo.control.commontable.Toolkit.relateDropDwonBox(subgeoDropdownBox, countryDropdownBox, {
			transform: function (data) {
				return data.d.results;
			},
			url: function(selectedKey) {
				return oServiceUrl +"/INPUT_SUBGEO(INPUT_SUBGEO='" + selectedKey + "')/Results?$format=json";
			},
			bindTextField:"ITEM_VALUE",
			bindKeyField:"ITEM_VALUE"
		});
		
		//COUNTRY, COUNTRY_NAME
		lenovo.control.commontable.Toolkit.relateDropDwonBox(countryDropdownBox, countryNameDropdownBox, {
			transform: function (data) {
				return data.d.results;
			},
			url: function(selectedKey) {
				return oServiceUrl +"/INPUT_COUNTRY(INPUT_COUNTRY='" + selectedKey + "')/Results?$format=json";
			},
			bindTextField:"ITEM_VALUE",
			bindKeyField:"ITEM_VALUE"
		});
	
		//app
	    var page = new sap.m.Page({
	      	  showHeader: false,
	          content :[header, filterPanel, oEditDeleteUploadDownload, table]                
	    });
        app.insertPage(page);
        app.setInitialPage(page);
        return app;		
	}
});