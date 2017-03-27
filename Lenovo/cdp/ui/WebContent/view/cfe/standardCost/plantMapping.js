/************************************
* Created by Fan Fangxing at 2015-8-26
* Version 1.0 2015-08-26
* Version 1.0
************************************/
//require what you need
/******Copy_Change_Start*******/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
jQuery.sap.require("lenovo.control.Validation");
/******Copy_Change_End*******/	

//main
/******Copy_Change_Start*******/
sap.ui.jsview("lenovo.view.cfe.standardCost.plantMapping", { 
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
		var auth = lenovo.control.commontable.Table.getViewAuth("plantMapping");
		/******Copy_Change_End*******/

		//generate UI
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel); //declare ui_view configuration
		this.setConfig(config, oServiceUrl, uServiceUrl,auth);   //call private function -- ui_view configuration
		/******Copy_Change_Start*******/
		var header = lenovo.control.commontable.Table.createHeader(" Standard Cost", "CFE&ECC Plant Mapping");
		/******Copy_Change_End*******/
		
		//set data connection
		/******Copy_Change_Start*******/
//		config.bindRowUrl = "/UI_STDCOST_DAILY";
		/******Copy_Change_End*******/
		
		var table = lenovo.control.commontable.Table.createTable(config);
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
		var  editButton = null, uploadButton = null,deleteButton = null, uploadTemButton = null, viewStatusButton = null;
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

		var oForm = filterPanel.getContent()[0];
		/******Copy_Change_Start*******/
//		var cycleDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Cycle")[0];
//		cycleDropdownBox.setValue("CURRENT");
//		cycleDropdownBox.setEditable(false);
		
		//var oForm = filterPanel.getContent()[0];
		
		/**************************************
		 * Change tool bar
		 * add new button and function
		 * Chris Gao
		 * 2015-08-21
		 *************************************/
//		var that = this;
//		
//		var oToolbarCtn = oEditDeleteUploadDownload.getContent()[0];
//		var oPublishBtn = new sap.ui.commons.Button({
//			lite: true,
//			icon: "sap-icon://share",
//			tooltip: "Publish",
//			press: function(){
//				that.publish(table, oServiceUrl);
//			}
//		}).addStyleClass("commontable-toolbar-btn");
//		//check authorization
//		for (var i in auth) {
//			switch(i) {
//				case "publishable":
//					oToolbarCtn.insertContent(oPublishBtn,0);
//					break;
//			}
//		}
//		
		/**************************************
		 * End
		 * Chris Gao
		 * 2015-08-21
		 *************************************/
		
		
		//generate page into app
		var page = new sap.m.Page({
	      	  showHeader: false,
	          content :[header, filterPanel, oEditDeleteUploadDownload, table] //header, filterPanel, oEditDeleteUploadDownload, table             
	    });
       app.insertPage(page);
       app.setInitialPage(page);
       return app;	
		
	},
	
	/**************************************
	 * Change tool bar
	 * add new button function
	 * Chris Gao
	 * 2015-08-21
	 *************************************/
	publish: function(table, oServiceUrl) {
		console.log("publish");
	},
	
	//private function -- ui_view columns configuration
	setConfig: function(config, oServiceUrl, uServiceUrl, auth) {
		
		//table columns setting
		/******Copy_Change_Start*******/
		config.columns = [{
			field: "CFE_PLANT", label: "CFE Plant", type:"TextField", width: "100px"
		},{
			field: "ECC_PLANT", label: "ECC Plant", type:"TextField", width: "100px"
		},{
			field: "ITEM_TYPE", label: "ITEM TYPE", type:"TextField", width: "100px"
		},{
			field: "SUBGEO", label: "SUBGEO", type:"TextField", width: "100px"
		},{
			field: "CURRENCY", label: "CURRENCY", type:"TextField", width: "100px"
		},{
			field: "SYS_LAST_MODIFIED_BY", label: "Last Modified By", type:"TextField", width: "100px"
		},{
			field: "SYS_LAST_MODIFIED_DATE", label: "Last Modified On", type:"TextField", width: "100px"
		}];
		/******Copy_Change_End*******/
		
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(2);
		var rowHeight = 30;
		
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight);
		
		
		/******Copy_Change_Start*******/
		//filter
		config.filtersRaw = [{
			field: "CFE_PLANT", label: "CFE Plant", type: "TextField",
			labelLayout: new sap.ui.layout.GridData({span: "L2 M2 S2", linebreak: true}),
			textField : {
				//editable : false
			}
		},{
			field: "ECC_PLANT", label: "ECC Plant", type: "TextField", 
			labelLayout: new sap.ui.layout.GridData({span: "L2 M2 S2", linebreak: true}),
//			dropdownbox : {
//				//layout: new sap.ui.layout.GridData({span: "L9 M9 S9"}),
//				odata:{
//					defaultSelectAll:true,
//					url: oServiceUrl +"/UI_STDCOST_DAILY_SEARCH_DDL?$filter=ITEM_TYPE eq 'ITEM' &$format=json",
//					bindTextField:"ITEM_VALUE",
//					bindKeyField:"ITEM_VALUE"
//				}
//			}
		},{
			field: "ITEM_TYPE", label: "ITEM TYPE", type: "TextField", 
			labelLayout: new sap.ui.layout.GridData({span: "L2 M2 S2", linebreak: true}),
//			dropdownbox : {
//				//layout: new sap.ui.layout.GridData({span: "L9 M9 S9"}),
//				odata:{
//					defaultSelectAll:true,
//					url: oServiceUrl +"/UI_STDCOST_DAILY_SEARCH_DDL?$filter=ITEM_TYPE eq 'PLANT' &$format=json",
//					bindTextField:"ITEM_VALUE",
//					bindKeyField:"ITEM_VALUE"
//				}
//			}
		}];
		/******Copy_Change_End*******/
		
		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);
			
		/******Copy_Change_Start*******/
//		//edit
//		config.editRaw = [{
//  			field: "STDCOST", 
//  			label: "Standard Cost",
//  			type:"TextField",
//			required: true,
//			validation: [{
//				validType: lenovo.control.Validation.require,
//				errMsg: "Required!"
//			},{
//				validType: /^\d{0,11}(\.\d{0,4})?$/,
//				errMsg: "The date type of this field is Decimal(15,4)!"
//			}]
//		}];
		/******Copy_Change_End*******/
		
		/******Copy_Change_Start*******/
		//download
//		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.ui_stdcost_daily/CV_UI_STDCOST_DAILY"';
//		config.download.columns=[
//			 "ITEM","PLANT","STDCOST"];
//		config.download.filename= "UI_STDCOST_DAILY";
		/******Copy_Change_End*******/
		
		
		/******Copy_Change_Start*******/
		//upload
//		config.upload = {
//			url: uServiceUrl + "/ui_stdcostdaily.xsjs",
//			excelUrl: "cfe/standardCost/dailyStdcostPublish.xlsx"
//		};
		//status view
//		config.viewstatus = {
//				viewUploadHistory: {
//					url: uServiceUrl + "/upload.xsodata",
//					bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'UI_STDCOST_DAILY'",
//					selectionMode: sap.ui.table.SelectionMode.Single
//				},
//				viewErrorInfo: {
//					url: uServiceUrl + "/upload.xsodata",
//					bindRowUrl: "/UPLOAD_ERR_INFO"
//				},
//				viewUploadErrorDetail: {
//					url: uServiceUrl + "/upload.xsodata/UI_STDCOST_DAILY_ERR_DETAIL?$format=json",
//					columns: [[{
//						field: "ITEM",
//						label: "Item",
//						type:  "TextField"
//					},{
//						field: "PLANT",
//						label: "Plant",
//						type:  "TextField"
//					},{
//						field: "STDCOST",
//						label: "Standard Cost",
//						type:  "TextField"
//					}]],
//					resubmit: {
//						url: uServiceUrl + "/ui_stdcostdaily.xsjs"
//					}
//				}
//			};
		/******Copy_Change_End*******/
		
		//toolbar , auth
		
		//config.create.visible = true;  justin test create
		config.create.visible = false;
		config.edit.visible = auth.editable;
		config.deleteable.visible = auth.deleteable;
		config.upload.visible = auth.uploadable;
		config.viewstatus.visible = auth.uploadable;
		config.download.visible = auth.exportable;
		config.download.roleName = auth.exportableRoleName;
		config.upload.roleName =  auth.uploadableRoleName;
	},
	
	//Navigation Setting if required
	onTreeNavigation: function(sChannel, sEvent, oData){
		/******Copy_Change_Start*******/
		if(oData.view === "Additional Cost") {
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