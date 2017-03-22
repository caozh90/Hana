/************************************
* Created by zhaodan1 
* Version 1.0 at 2016-03-09
************************************/
//require what you need
/******Copy_Change_Start*******/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
jQuery.sap.require("lenovo.control.Validation");
/******Copy_Change_End*******/	

//main
/******Copy_Change_Start*******/
sap.ui.jsview("lenovo.view.cfe.priceMask.uiPmGrMtm", { 
/******Copy_Change_End*******/	
	getControllerName: function() {

	},
	
	//Create Page Content including all the UI items
	createContent: function(){
		
		//declare app
		var app = new sap.m.App();
		//declare service url
		var service = new lenovo.service.CFE();
		var oServiceUrl = service.getEBGCfe();        //model service url
		var uServiceUrl = service.getEBGCfeUpload();  //upload service url
		
		//declare model 
		var oModel = new sap.ui.model.odata.ODataModel(oServiceUrl, true);
		//declare authorization
		/******Copy_Change_Start*******/
		var auth = lenovo.control.commontable.Table.getViewAuth("uiPmGrMtm");
		/******Copy_Change_End*******/

		//generate UI
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel); //declare ui_view configuration
		this.setConfig(config, oServiceUrl, uServiceUrl,auth);   //call private function -- ui_view configuration
		/******Copy_Change_Start*******/
		var header = lenovo.control.commontable.Table.createHeader("Price Mask", "PM GR MTM");
		/******Copy_Change_End*******/
		
		//set data connection
		/******Copy_Change_Start*******/
		config.bindRowUrl = "/UI_PM_GR_MTM";
		/******Copy_Change_End*******/
		
		var table = lenovo.control.commontable.Table.createTable(config);
		table.setBusy(true);
		table.setModel(oModel);
		oModel.attachRequestCompleted(function(){
			table.setBusy(false);
		});
		
		//filter panel
		var filterPanel = lenovo.control.commontable.Table.createFilter(config, table);
		
		var oForm = filterPanel.getContent()[0];
		var cycleDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Fence Type")[0];
		//tool bar		
		var oEditDeleteUploadDownload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table, app);
		//authorization buttons
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
			if(selectedKey === "CURRENT" || selectedKey === "") {
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
		//generate page into app
		var page = new sap.m.Page({
	      	  showHeader: false,
	          content :[header, filterPanel, oEditDeleteUploadDownload, table] //header, filterPanel, oEditDeleteUploadDownload, table             
	    });
       app.insertPage(page);
       app.setInitialPage(page);
       return app;	
		
	},
	
	//private function -- ui_view columns configuration
	setConfig: function(config, oServiceUrl, uServiceUrl, auth) {
		
		//table columns setting
		/******Copy_Change_Start*******/
		config.columns = [{
			field: "OEM_NAME", label: "OEM Name",  type:"DropdownBox",
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/INPUT_GR_MTM_E_DDL(INPUT_TYPE='OEM_NAME')/Results?$format=json"
				}				
			},width:"120px"
		},{
			field: "TIME_FENCE", label: "Time Fence",  type:"DropdownBox",
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/INPUT_GR_MTM_E_DDL(INPUT_TYPE='TIME_FENCE')/Results?$orderby=ITEM_VALUE desc&$format=json"
				}				
			},width:"140px"
		},{
			field: "FUNCTION_TYPE", label: "Function Type",  type:"DropdownBox",
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/INPUT_GR_MTM_E_DDL(INPUT_TYPE='FUNCTION_TYPE')/Results?$format=json"
				}				
			},width:"140px"
		},{
			field: "PROFIT_CENTER", label: "Profit Center",  type:"DropdownBox",
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/INPUT_GR_MTM_E_DDL(INPUT_TYPE='PROFIT_CENTER')/Results?$format=json"
				}				
			},width:"120px"
		},{
			field: "MTM_NO", label: "MTM NO", type:"TextField", width: "120px"
		},{
			field: "MTM_DESC", label: "MTM Desc", type:"TextField",width:"120px"
		},{
			field: "GR_DATE", label: "MTM GR Date", type:"DatePicker",
			datepicker: {
	            format: 'yyyy-MM-dd'
			}, 
			width: "140px"
		},{
			field: "GR_QTY", label: "MTM GR Qty", type:"TextField", width: "100px"
		},{
			field: "STATUS", label: "Status", type:"TextField", width: "120px"
		}];
		/******Copy_Change_End*******/
		
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(3);
		var rowHeight = 30;
		
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight);
		
		
		/******Copy_Change_Start*******/
		//filter
		config.filtersRaw = [{
			field: "TIME_FENCE_TYPE", label: "Fence Type", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				defaultFilterValue: "CURRENT",
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				odata:{
					defaultSelectAll: true,
					url: oServiceUrl +"/INPUT_GR_MTM_DDL(TYPE='TIME_FENCE_TYPE')/Results?$format=json",
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE"
				}				
			}
		},{
			field: "PROFIT_CENTER", label: "Profit Center", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				odata:{
					defaultSelectAll: true,
					url: oServiceUrl +"/INPUT_GR_MTM_DDL(TYPE='PROFIT_CENTER')/Results?$format=json",
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE"
				}				
			}
		},{
			field: "GR_DATE", label: "MTM GR Date", type:"MultiDatePicker",
//			timerange:{
//				datepicker: {
//					format: 'yyyy-MM-dd'
//					}
//			}
		},{
			field: "GR_QTY", label: "MTM GR Qty", type: "MultiEQ",
			multieq: {
				defaultFilterOp: "GE"
			}
		},{
			field: "TIME_FENCE", label: "Time Fence", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				odata:{
					defaultSelectAll: true,
					url: oServiceUrl +"/INPUT_GR_MTM_DDL(TYPE='TIME_FENCE')/Results?$orderby=ITEM_VALUE desc&$format=json",
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE"
				}				
			}
		},{
			field: "OEM_NAME", label: "OEM Name", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				odata:{
					defaultSelectAll: true,
					url: oServiceUrl +"/INPUT_GR_MTM_DDL(TYPE='OEM_NAME')/Results?$format=json",
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE"
				}				
			}
		},{
			field: "FUNCTION_TYPE", label: "Function Type", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				odata:{
					defaultSelectAll: true,
					url: oServiceUrl +"/INPUT_GR_MTM_DDL(TYPE='FUNCTION_TYPE')/Results?$format=json",
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE"
				}				
			}
		},{
			field: "STATUS", label: "Status", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				odata:{
					defaultSelectAll: true,
					url: oServiceUrl +"/INPUT_GR_MTM_DDL(TYPE='STATUS')/Results?$format=json",
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE"
				}				
			}
		},{
			field: "MTM_NO", label: "MTM NO", type: "TextField",
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true})
		},{
			field: "MTM_DESC", label: "MTM Desc", type: "TextField",
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true})
		}];
		/******Copy_Change_End*******/
		/********change filter date time zone exchange****/
		config.filterTimeZoneExchange = true;
		
		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);
		
		
		/******Copy_Change_Start*******/
		//edit
		config.editRaw = [
		          		{
		          			field: "OEM_NAME", 
		          			label: "OEM Name"
		          		},{
		          			field: "TIME_FENCE", 
		          			label: "Time Fence"
		          		},{
		          			field: "FUNCTION_TYPE", 
		          			label: "Function Type"
		          		},{
		          			field: "PROFIT_CENTER", 
		          			label: "Profit Center"
		          		},{
		          			field: "GR_DATE", 
		          			label: "MTM GR Date",
		          			type:"DatePicker"
		          		},{
		          			field: "GR_QTY", 
		          			label: "MTM GR Qty",
		          			validation: [{
		        				validType: lenovo.control.Validation.isNumberx,
		        				errMsg: "The date type of this field should be number!"
		        			}]
		          		}];
		/******Copy_Change_End*******/
		config.editExtend = [{
				sKey: "PRODUCT_GROUP", sValue: "EBG"	
		    }];
		config.editExtendKeyText = "DUMMY_PK";
		
		/******Copy_Change_Start*******/
		//download
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.ui_pm_gr_mtm/CV_PM_UI_GR_MTM"';
		config.download.columns=[
			 "OEM_NAME","TIME_FENCE","FUNCTION_TYPE","PROFIT_CENTER","MTM_NO","MTM_DESC","GR_DATE","GR_QTY","STATUS"];
		config.download.filename= "UI_PM_GR_MTM";
		/******Copy_Change_End*******/
		
		
		/******Copy_Change_Start*******/
		//upload
		config.upload = {
			url: uServiceUrl + "/pm_ui_gr_mtm.xsjs",
			excelUrl: "cfe/priceMask/MTM_GR.xlsx"
		};
		//status view
		config.viewstatus = {
				viewUploadHistory: {
					url: uServiceUrl + "/upload.xsodata",
					bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'PM_UI_GR_MTM'",
					selectionMode: sap.ui.table.SelectionMode.Single
				},
				viewErrorInfo: {
					url: uServiceUrl + "/upload.xsodata",
					bindRowUrl: "/UPLOAD_ERR_INFO"
				},
				viewUploadErrorDetail: {
					url: uServiceUrl + "/upload.xsodata/UI_PM_GR_MTM_ERR_DETAIL?$format=json",
					columns: [[{
						field: "OEM_NAME", label: "OEM Name", type:"TextField"
						
					},{
						field: "TIME_FENCE", label: "Time Fence", type:"TextField"					
						
					},{
						field: "FUNCTION_TYPE", label: "Function Type", type:"TextField"
						
					},{
						field: "PROFIT_CENTER", label: "Part NO", type:"TextField"
						
					}],[{
						field: "MTM_NO", label: "MTM NO", type:"TextField", width: "120px"
					},{
						field: "MTM_DESC", label: "MTM Desc", type:"TextField",width:"120px"
					},{
						field: "GR_DATE", label: "GR Date", type:"DatePicker",
						datepicker: {
				            format: 'yyyy-MM-dd'
						}
					},{
						field: "GR_QTY", label: "GR Qty", type:"TextField", width: "100px"
					}]],
					resubmit: {
						url: uServiceUrl + "/pm_ui_gr_mtm.xsjs"
					}
				}
			};
		/******Copy_Change_End*******/
		
		//toolbar , auth
		config.create.visible = false;
		config.edit.visible = auth.editable;
		config.deleteable.visible = auth.deleteable;
		config.upload.visible = auth.uploadable;
		config.viewstatus.visible = auth.uploadable;
		config.download.visible = auth.exportable;
		config.download.roleName = auth.exportableRoleName;
		config.upload.roleName =  auth.uploadableRoleName;
	},
	
	/******************* End Select Data Helper Table******************************/
	
	//Navigation Setting if required
	onTreeNavigation: function(sChannel, sEvent, oData){
		/******Copy_Change_Start*******/
		if(oData.view === "PM GR MTM") {
		/******Copy_Change_End*******/
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