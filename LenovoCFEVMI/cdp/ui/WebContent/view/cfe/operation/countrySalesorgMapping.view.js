//Created by Zhang Ruixue at 2015-02-02
//Modified by Chris Gao at 2015-10-07 as requirements changed
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
sap.ui.jsview("lenovo.view.cfe.operation.countrySalesorgMapping", {
	setConfig: function(config, oServiceUrl, uServiceUrl, auth){
		//table
		config.columns = [{
			field: "COUNTRY", label: "Country", type: "TextField"
		},{
			field: "SALES_ORG", label: "Sales Org", type:"TextField"
		},{
			field: "CURRENCY", label: "Currency", type:"TextField"
		},{
			field: "SALES_OFFICE", label: "Sales Office", type:"TextField"
		},{
			field: "COUNTRY_SALESORG_TYPE", label: "Country Salesorg Type", type:"TextField"
		},{
			field: "SALES_OFFICE_PCT", label: "Sales Office PCT", type:"TextField", suffix:"%"//added by Chris Gao to process the value suffix
		},{
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
			dropdownbox : {
				defaultFilterValue: "CURRENT",
				odata:{
					defaultSelectAll: false,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/CFE_UI_COUNTRY_SALESORG_MAPPING_DDL?$filter=ITEM_TYPE eq 'CYCLE'&$format=json"
				}				
			}
		},{
			field: "COUNTRY", label: "Country", type: "DropdownBox",
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/CFE_UI_COUNTRY_SALESORG_MAPPING_DDL?$filter=ITEM_TYPE eq 'COUNTRY'&$format=json"
				}	
					
			}
		},{
			field: "SALES_ORG", label: "Sales Org", type: "DropdownBox",
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/CFE_UI_COUNTRY_SALESORG_MAPPING_DDL?$filter=ITEM_TYPE eq 'SALES_ORG'&$format=json"
				}	
					
			}
		},{
			field: "SALES_OFFICE", label: "Sales Office", type: "DropdownBox",
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/CFE_UI_COUNTRY_SALESORG_MAPPING_DDL?$filter=ITEM_TYPE eq 'SALES_OFFICE'&$format=json"
				}	
					
			}
		}];

		config.filters = lenovo.control.commontable.Toolkit.splitChunck(2, config.filtersRaw);

		//download
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.ui_country_salesorg_mapping/CV_UI_COUNTRY_SALESORG_MAPPING"';
		config.download.columns = [
			"COUNTRY", "SALES_ORG","CURRENCY","SALES_OFFICE","COUNTRY_SALESORG_TYPE","SALES_OFFICE_PCT","SYS_LAST_MODIFIED_BY","SYS_LAST_MODIFIED_DATE"];//updated by Chris Gao 2015-10-07
		config.download.filename= "UI_COUNTRY_SALESORG_MAPPING";
		
		//upload
		config.upload = {
			url: uServiceUrl + "/ui_country_salesorg_mapping.xsjs",
			excelUrl: "cfe/operation/country_salesorg_mapping.xlsx",
			/******************************************
			 * Added by Chris Gao
			 * 2015-10-07
			 * as requirements changed 
			 * SALES OFFICE PCT Special Check when upload and delete
			 ******************************************/
			uploadCheckRule : {
					checkUrl : oServiceUrl +"/UI_COUNTRY_SALESORG_CHECK?$select=SALES_ORG&$format=json",
			}
			/*****************************************
			 * End by Chris Gao
			 ****************************************/
		};
		config.viewstatus = {
			viewUploadHistory: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'UI_COUNTRY_SALESORG_MAPPING'",
				selectionMode: sap.ui.table.SelectionMode.Single
			},
			viewErrorInfo: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_ERR_INFO"
			},
			viewUploadErrorDetail: {
				url: uServiceUrl + "/upload.xsodata/UI_COUNTRY_SALESORG_MAPPING_ERR_DETAIL?$format=json",
				columns: [[{
					label: "Cycle",
					field: "CYCLE",
					type:  "TextField"
				},{
					label: "Country",
					field: "COUNTRY",
					type:  "TextField"
				},{
					label: "Currency",
					field: "CURRENCY",
					type:  "TextField"
				},{
					label: "Sales Org",
					field: "SALES_ORG",
					type:  "TextField"		
				},{
					label: "Sales Office",
					field: "SALES_OFFICE",
					type:  "TextField"		
				},{
					label: "Country Salesorg Type",
					field: "COUNTRY_SALESORG_TYPE",
					type:  "TextField"		
				},{
					label: "Sales Office PCT",
					field: "SALES_OFFICE_PCT",
					type:  "TextField"		
				}]],
				resubmit: {
					url: uServiceUrl + "/ui_country_salesorg_mapping.xsjs"
				}
			}
		};
		
		/******************************************
		 * Added by Chris Gao
		 * 2015-10-07
		 * as requirements changed 
		 * SALES OFFICE PCT Special Check when upload and delete
		 ******************************************/
		config.deleteCheckRule = {
				checkUrl : oServiceUrl +"/UI_COUNTRY_SALESORG_CHECK?$select=SALES_ORG&$format=json",
		};
		/*****************************************
		 * End by Chris Gao
		 ****************************************/

		//toolbar , auth
		config.create.visible = false;
		config.edit.visible = false;
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
		var auth = lenovo.control.commontable.Table.getViewAuth("countrySalesorgMapping");
		
		this.setConfig(config, oServiceUrl, uServiceUrl,auth);
		var header = lenovo.control.commontable.Table.createHeader("Operation", "Country Salesorg Mapping");

		config.bindRowUrl = "/CFE_UI_COUNTRY_SALESORG_MAPPING";
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
		var uploadButton = null,deleteButton = null, uploadTemButton = null, viewStatusButton = null;
		for(var i = 0; i < buttons.length; i++) {
			var oTooltip = buttons[i].getTooltip();
			if(auth.deleteable && oTooltip === 'delete'){
				deleteButton = buttons[i];
				continue;
			}
			if(auth.uploadable){
				switch(oTooltip){
					case "upload, only xlsx and csv files are allowed": //updated by Chris Gao 2015-10-07
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
				if(deleteButton){
					deleteButton.setVisible(true);
				}
				if(auth.uploadable){
					uploadButton.setVisible(true);
					uploadTemButton.setVisible(true);
					viewStatusButton.setVisible(true);
				}
				
			} else {
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