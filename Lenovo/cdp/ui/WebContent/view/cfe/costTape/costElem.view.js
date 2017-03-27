//Created by Zhang Ruixue at 2014-12-08
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
sap.ui.jsview("lenovo.view.cfe.costTape.costElem", {
	setConfig: function(config, oServiceUrl, uServiceUrl, auth){

		//table		
		config.columns = [{
			field: "ELEMENT_NAME", label: "ELEM Name", type:"TextField"
		},{
			field: "ELEMENT_TYPE", label: "ELEM Type", type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultEmpty:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/CFE_UI_UI_COST_ELEM_CREATE_DROPDOWNLIST?$filter=ITEM_TYPE eq 'ELEM_TYPE'&$format=json"
				}	
					
			}
		},{
			field: "DESC", label: "Description", type:"TextField"
		},{
			field: "ASP_PROD_FAMILY", label: "ASP Family", type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultEmpty:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/CFE_UI_UI_COST_ELEM_CREATE_DROPDOWNLIST?$filter=ITEM_TYPE eq 'ASP_Family'&$format=json"
				}	
					
			}
		},/*{
			field: "NEGATIVE_FLAG", label: "Negative Flag", type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultEmpty:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/CFE_UI_UI_COST_ELEM_CREATE_DROPDOWNLIST?$filter=ITEM_TYPE eq 'Negative Flag'&$format=json"
				}	
					
			}
		},{
			field: "STATUS", label: "Status", type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultEmpty:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/CFE_UI_UI_COST_ELEM_CREATE_DROPDOWNLIST?$filter=ITEM_TYPE eq 'Status'&$format=json"
				}	
					
			}
		},*/{
			field: "TOTE", label: "TOTE", type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultEmpty:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/CFE_UI_UI_COST_ELEM_CREATE_DROPDOWNLIST?$filter=ITEM_TYPE eq 'TOTE'&$format=json"
				}	
					
			}
		},{
			field: "TOTL", label: "TOTL", type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultEmpty:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/CFE_UI_UI_COST_ELEM_CREATE_DROPDOWNLIST?$filter=ITEM_TYPE eq 'TOTL'&$format=json"
				}	
					
			}
		},{
			field: "SYS_LAST_MODIFIED_BY", label: "Last Modified By", type:"TextField"
		},{
			field: "SYS_LAST_MODIFIED_DATE", label: "Last Modified Date", type:"TextField"
		}];
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
//		var headerHeight = 255;
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
					url: oServiceUrl +"/CFE_UI_UI_COST_ELEM_DROPDOWNLIST?$filter=ITEM_TYPE eq 'CYCLE'&$format=json"
				}				
			}
		},/*{
			field: "STATUS", label: "Status", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L5 M5 S5", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L7 M7 S7"}),
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/CFE_UI_UI_COST_ELEM_DROPDOWNLIST?$filter=ITEM_TYPE eq 'STATUS'&$format=json"
				}	
					
			}
		},*/{
			field: "ELEMENT_NAME", label: "ELEM Name", type: "DropdownBox",
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/CFE_UI_UI_COST_ELEM_DROPDOWNLIST?$filter=ITEM_TYPE eq 'ELEMENT_NAME'&$format=json"
				}	
					
			}
		},{
			field: "TOTE", label: "TOTE", type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/CFE_UI_UI_COST_ELEM_DROPDOWNLIST?$filter=ITEM_TYPE eq 'TOTE'&$format=json"
				}	
					
			}
		},{
			field: "ELEMENT_TYPE", label: "ELEM Type", type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/CFE_UI_UI_COST_ELEM_DROPDOWNLIST?$filter=ITEM_TYPE eq 'ELEMENT_TYPE'&$format=json"
				}	
					
			}
		},{
			field: "TOTL", label: "TOTL", type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/CFE_UI_UI_COST_ELEM_DROPDOWNLIST?$filter=ITEM_TYPE eq 'TOTL'&$format=json"
				}	
					
			}
		},{
			field: "ASP_PROD_FAMILY", label: "ASP Family", type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/CFE_UI_UI_COST_ELEM_DROPDOWNLIST?$filter=ITEM_TYPE eq 'ASP_PROD_FAMILY'&$format=json"
				}	
					
			}
		}/*,{
			field: "SYS_LAST_MODIFIED_DATE", label: "Last Modified Date", type: "TimeRange",
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true})
		},{
			field: "NEGATIVE_FLAG", label: "Negative Flag", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L4 M4 S4"}),
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/CFE_UI_UI_COST_ELEM_DROPDOWNLIST?$filter=ITEM_TYPE eq 'NEGATIVE_FLAG'&$format=json"
				}	
					
			}
		}*/];

		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);
/*		config.filterLayout = {
				0: new sap.ui.layout.GridData({span: "L3 M3 S3"}),
				1: new sap.ui.layout.GridData({span: "L3 M3 S3"}),
				2: new sap.ui.layout.GridData({span: "L6 M6 S6"})	
			};*/
		//create		
		config.insertRaw=[{
			field: "ELEMENT_NAME", label: "ELEM Name", type:"TextField"
		},{
			field: "ELEMENT_TYPE", label: "ELEM Type", type:"DropdownBox",
			dropdownbox : {
				odata:{
					url: oServiceUrl +"/CFE_UI_UI_COST_ELEM_CREATE_DROPDOWNLIST?$filter=ITEM_TYPE eq 'ELEM_TYPE'&$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		},{
			field: "DESC", label: "Description", type:"TextField"
		},/*{
			field: "NEGATIVE_FLAG", label: "Negative Flag", type:"DropdownBox",
			dropdownbox : {
				odata:{
					url: oServiceUrl +"/CFE_UI_UI_COST_ELEM_CREATE_DROPDOWNLIST?$filter=ITEM_TYPE eq 'Negative Flag'&$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		},*/{
			field: "ASP_PROD_FAMILY", label: "ASP Family", type:"DropdownBox",
			dropdownbox : {
				odata:{
					url: oServiceUrl +"/CFE_UI_UI_COST_ELEM_CREATE_DROPDOWNLIST?$filter=ITEM_TYPE eq 'ASP_Family'&$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		},/*{
			field: "STATUS", label: "Status", type:"DropdownBox",
			dropdownbox : {
				odata:{
					url: oServiceUrl +"/CFE_UI_UI_COST_ELEM_CREATE_DROPDOWNLIST?$filter=ITEM_TYPE eq 'Status'&$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		},*/{
			field: "TOTE", label: "TOTE", type: "DropdownBox", 
			dropdownbox : {
				odata:{
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/CFE_UI_UI_COST_ELEM_CREATE_DROPDOWNLIST?$filter=ITEM_TYPE eq 'TOTE'&$format=json"
				}	
					
			}
		},{
			field: "TOTL", label: "TOTL", type: "DropdownBox", 
			dropdownbox : {
				odata:{
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/CFE_UI_UI_COST_ELEM_CREATE_DROPDOWNLIST?$filter=ITEM_TYPE eq 'TOTL'&$format=json"
				}	
					
			}
		}];
		
		config.create.columns = lenovo.control.commontable.Toolkit.splitChunck(2, config.insertRaw);
		config.create.url = "/CFE_UI_COST_ELEM";
		config.create.fakeData = {
				"CYCLE":"CURRENT"/*,
				"PRODUCT_GROUP" : "EBG"*/
		};
		
		//edit		
		config.editRaw = [
		                  {field: "ELEMENT_TYPE", label: "ELEM Type"},
		                  {field: "ASP_PROD_FAMILY", label: "ASP Family"},
		                 /* {field: "NEGATIVE_FLAG", label: "Negative Flag"},
		                  {field: "STATUS", label: "Status"},*/
		                  {field: "TOTE", label: "TOTE"},
		                  {field: "TOTL", label: "TOTL"}
		                  ];
		
		//download
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.ui_cost_elem/CV_UI_COST_ELEM"';
		config.download.columns=["CYCLE","ELEMENT_NAME", "ELEMENT_TYPE", "ASP_PROD_FAMILY",
		                        /* "NEGATIVE_FLAG","STATUS",*/ "TOTE", "TOTL"];
		config.download.filename= "UI_COST_ELEM";
		
		//upload
		config.upload = {
			url: uServiceUrl + "/ui_cost_elem.xsjs",
			excelUrl: "cfe/costTape/cost_elem.xlsx"
		};
		config.viewstatus = {
			viewUploadHistory: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'UI_COST_ELEM'",
				selectionMode: sap.ui.table.SelectionMode.Single
			},
			viewErrorInfo: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_ERR_INFO"
			},
			viewUploadErrorDetail: {
				url: uServiceUrl + "/upload.xsodata/UI_COST_ELEM_ERR_DETAIL?$format=json",
				columns: [[{
					label: "Cycle",
					field: "CYCLE",
					type:  "TextField"
				},{
					label: "Element Name",
					field: "ELEMENT_NAME",
					type:  "TextField"
				},{
					label: "Element Type",
					field: "ELEMENT_TYPE",
					type:  "TextField"
				}],[{
					label: "Asp Prod Family",
					field: "ASP_PROD_FAMILY",
					type:  "TextField"
				},/*{
					label: "Negative Flag",
					field: "NEGATIVE_FLAG",
					type:  "TextField"
					
				},{
					label: "Status",
					field: "STATUS",
					type: "TextField"
				},*/{
					label: "Tote",
					field: "TOTE",
					type: "TextField"
				}, {
					label: "Totl",
					field: "TOTL",
					type: "TextField"
				}]],
				resubmit: {
					url: uServiceUrl + "/ui_cost_elem.xsjs"
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
		var auth = lenovo.control.commontable.Table.getViewAuth("costElem");
		
		this.setConfig(config, oServiceUrl, uServiceUrl,auth);
		var header = lenovo.control.commontable.Table.createHeader("Cost Tape", "Cost Elem");

		config.bindRowUrl = "/CFE_UI_COST_ELEM";
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