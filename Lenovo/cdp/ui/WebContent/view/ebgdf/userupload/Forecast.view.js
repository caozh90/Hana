/**
 * 
 */
/************************************
* Created by chenwh at 2015-8-12
* Version 1.0 2015-08-12
* Version 1.0
************************************/
//require what you need
/******Copy_Change_Start*******/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.EBGDF");
jQuery.sap.require("lenovo.control.Validation");
/******Copy_Change_End*******/	

//main
/******Copy_Change_Start*******/
sap.ui.jsview("lenovo.view.ebgdf.userupload.Forecast", { 
/******Copy_Change_End*******/	
	getControllerName: function() {

	},
	
	confirm: function(){

	},
		//Create Page Content including all the UI items
	createContent: function(){
		
		//declare app
		var app = new sap.m.App();
		//declare service url
		var service = new lenovo.service.EBGDF();
		var oServiceUrl = service.getebgdf();        //model service url
		var uServiceUrl = service.getebgdfUpload();  //upload service url
		var logicServiceUrl = service.getebgdfLogic();
		this.logicServiceUrl = logicServiceUrl;
		//declare model 
		var oModel = new sap.ui.model.odata.ODataModel(oServiceUrl, true);
		//declare authorization
		/******Copy_Change_Start*******/
		var auth = lenovo.control.commontable.Table.getViewAuth("Forecast");
		/******Copy_Change_End*******/

		//generate UI
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel); //declare ui_view configuration
		this.setConfig(config, oServiceUrl, uServiceUrl,auth);   //call private function -- ui_view configuration
		/******Copy_Change_Start*******/
		var header = lenovo.control.commontable.Table.createHeader("User Upload", "Forecast Upload");
		/******Copy_Change_End*******/
		
		//set data connection
		/******Copy_Change_Start*******/
		config.bindRowUrl = "/UI_FORECAST_MID";
		config.navigationMode = sap.ui.table.NavigationMode.Scrollbar;
		/******Copy_Change_End*******/
		
		var table = lenovo.control.commontable.Table.createTable(config);
		//added by Chris Gao
		this.table = table;
		
		table.setBusy(true);
		table.setModel(oModel);
		oModel.attachRequestCompleted(function(){
			table.setBusy(false);
		});
		
		//filter panel
		var filterPanel = lenovo.control.commontable.Table.createFilter(config, table);
		//tool bar		
		var oEditDeleteUploadDownload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table, app);
		//authorization buttons
		var buttons = oEditDeleteUploadDownload.getContent()[0].getContent();
		var editButton = null, uploadButton = null,deleteButton = null, uploadTemButton = null, viewStatusButton = null;
		for(var i = 0; i < buttons.length; i++) {
			var oTooltip = buttons[i].getTooltip();
			/*if(auth.editable && oTooltip === 'edit'){
				editButton = buttons[i];
				continue;
			}*/
			if(auth.createable && oTooltip === 'create'){
				createButton = buttons[i];
				continue;
			}
			if(auth.deleteable && oTooltip === 'delete'){
				deleteButton = buttons[i];
				continue;
			}
			if(auth.createable && oTooltip === 'execute'){
				createButton = buttons[i];
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
		
		var oForm = filterPanel.getContent()[0];
		/******Copy_Change_Start*******/
			
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
		config.columns = [
		{field: "SBB", label: "SBB", type:"TextField", width: "150px"},
		{field: "GEO", label: "GEO", type:"TextField", width: "100px"},
		{field: "FCSTQTY", label: "FCSTQTY", type:"TextField", width: "150px"},
		{field: "FCSTWEK", label: "FCSTWEK", type: "DatePicker",datepicker: {
            format: 'MM/dd/yyyy'
		} , width: "150px"},
		{field: "LOCID", label: "LOCID", type:"TextField", width: "100px"},
		{field: "TRANS_DATE", label: "TRANS_DATE", type: "DatePicker",datepicker: {
            format: 'MM/dd/yyyy'
		} , width: "150px"},
		{field: "SYS_CREATED_DATE", label: "Create date", type:"TextField", width: "200px", dateformat: "MM-dd-yyyy"},
		{field: "SYS_CREATED_BY", label: "Create user", type:"TextField", width: "100px"},
		{field: "SYS_LAST_MODIFIED_BY", label: "Last Modified BY", type:"TextField", width: "150px"},
		{field: "SYS_LAST_MODIFIED_DATE", label: "Last Modified DATE", type:"TextField", width: "150px", dateformat: "MM-dd-yyyy"}
		];
		/******Copy_Change_End*******/
		
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(2);
		var rowHeight = 30;
		
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight);
		
		
		/******Copy_Change_Start*******/
		//filter
		config.filtersRaw = [{
			field: "SBB", label: "SBB", type: "TextField", 
			labelLayout: new sap.ui.layout.GridData({span: "L2 M2 S2", linebreak: true}),
			//required: true,
			/*dropdownbox : {
				//layout: new sap.ui.layout.GridData({span: "L9 M9 S9"}),
				defaultFilterValue: "",
				odata:{
					defaultSelectAll:true,
					url: oServiceUrl +"/UI_FORECAST_MID_SEARCH?$filter=ITEM_TYPE eq 'SBB'&$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}*/
			
		},{
			field: "GEO", label: "GEO", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L2 M2 S2", linebreak: true}),
			//required: true,
			dropdownbox : {
				//layout: new sap.ui.layout.GridData({span: "L9 M9 S9"}),
				defaultFilterValue: "",
				odata:{
					defaultSelectAll:true,
					url: oServiceUrl +"/UI_FORECAST_MID_SEARCH?$filter=ITEM_TYPE eq 'GEO'&$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
			
		}];
		/******Copy_Change_End*******/
		
		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);
		
		
		/******Copy_Change_Start*******/
		//create
		config.insertRaw=[{
			field: "SBB", 
			label: "SBB", 
			type:"TextField",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
		
		},{
			field: "GEO", 
			label: "GEO", 
			type: "TextField", 
			/*required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				odata:{
				
					url: oServiceUrl +"/UI_FORECAST_MID_CREATE?$filter=ITEM_TYPE eq 'MTM_ABCD' &$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}*/
		},{
			field: "FCSTQTY", 
			label: "FCSTQTY", 
			type: "TextField", 
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
		},{
			field: "FCSTWEK", 
			label: "FCSTWEK", 
			type: "DatePicker", 
			datepicker: {
                format: 'MM/dd/yyyy'
        },
        required: true,
		validation: [{
			validType: lenovo.control.Validation.require,
			errMsg: "Required!"
		}],
		}];
		
		config.create.columns = lenovo.control.commontable.Toolkit.splitChunck(2, config.insertRaw);
		config.create.url = "/UI_FORECAST_MID";
		/******Copy_Change_End*******/
		/******Copy_Change_Start*******/
		//download
		config.download.table = '"_SYS_BIC"."cdp.ebgdf.models.ui_forecast_mid/CV_UI_FORECAST_MID"';
		config.download.columns=[
			"SBB","GEO","FCSTQTY","FCSTWEK","LOCID","TRANS_DATE",
			 "SYS_CREATED_DATE","SYS_CREATED_BY","SYS_LAST_MODIFIED_DATE","SYS_LAST_MODIFIED_BY"];

		config.download.filename= "Forecast";
		/******Copy_Change_End*******/
		
		
		/******Copy_Change_Start*******/
		//upload
		config.upload = {
			url: uServiceUrl + "/ui_forecast_mid.xsjs",
			excelUrl: "ebgdf/forecast/Forecast.xlsx"
		};
		//status view
		config.viewstatus = {
				viewUploadHistory: {
					url: uServiceUrl + "/upload.xsodata",
					bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'UI_FORECAST_MID'",
					selectionMode: sap.ui.table.SelectionMode.Single
				},
				viewErrorInfo: {
					url: uServiceUrl + "/upload.xsodata",
					bindRowUrl: "/UPLOAD_ERR_INFO"
				},
				viewUploadErrorDetail: {
					url: uServiceUrl + "/upload.xsodata/UI_FORECAST_MID_ERR_DETAIL?$format=json",
					columns: [[{
						field: "SBB",
						label: "SBB",
						type:  "TextField"
					},{
						field: "GEO",
						label: "GEO",
						type:  "TextField"
					}
					,{
						field: "FCSTQTY",
						label: "FCSTQTY",
						type:  "TextField"
					},{
						field: "FCSTWEK",
						label: "FCSTWEK",
						type:  "TextField"
					}]],
					resubmit: {
						url: uServiceUrl + "/ui_forecast_mid.xsjs"
					}
				}
			};
		/******Copy_Change_End*******/
		
		//toolbar , auth
		config.create.visible = false;
	    config.edit.visible = false;
		config.deleteable.visible = false;
		config.upload.visible = false;
		config.viewstatus.visible = false;
		config.download.visible = false;
		config.download.roleName = false;
		config.upload.roleName =  false;
	},
});