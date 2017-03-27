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
sap.ui.jsview("lenovo.view.ebgdf.workFlow.Step_4_1_Pegging", { 
/******Copy_Change_End*******/	
	getControllerName: function() {

	},
	/*ADDED BY CHENW3H3 20150817  'execute'*/
	
	confirm: function(){

	},
	execute: function(filterPanel){
		var that = this;
		var process_name = "AUTO_CONFIRM_DL_SZ";
		var obj = {
			"process_name": process_name
		};
		this.table.setBusy(true);
		$.ajax({
			url: this.logicServiceUrl + "/ui_mfi_ppn_refresh.xsjs",
			type:"POST",
			data: obj,
			datatype: "text",
			success: function(data){
				that.table.setBusy(false);
				//lenovo.control.commontable.Toolkit.showErrorMsg("Executed successfully!", "SUCCESS", "Execute");
			},
			error: function(data){
				that.table.setBusy(false);
				console.log(data);
				data = data && data.responseText;
				if(!(typeof data === "string")) {
					data = JSON.stringify(data);
				}
				lenovo.control.commontable.Toolkit.showErrorMsg(data, "ERROR", "Execute");
			}
		});
	},
	
	
	NEXT: function(){
		var that = this;
		var step = '6';
		var obj = {
			"STEP": step
		};
		this.table.setBusy(true);
		
		/***********************
		 * added by Chris Gao
		 **********************/
		var targetWorkFlowNode;
		var treeNavigationList = sap.ui.getCore().byId("navigation");
		var aNodes = treeNavigationList.getNodes();
		
		var service = new lenovo.service.EBGDF();
		var stepServiceUrl = service.getebgdfServiceUrl(); 
		
		for(var i=0; i < aNodes.length; i++)
		{
			var aNode = aNodes[i];
			if(aNode.getText() == 'LCPE Calculation')
			{
				targetWorkFlowNode = aNode;
			}
		}
		
		//Modified by Chris Gao 2015-08-23
		if(targetWorkFlowNode != null)
		{
				$.ajax({
					url: stepServiceUrl + "/setSteps.xsjs",
					type:"POST",
					data: obj,
					datatype: "json",
					success: function(data){
						//console.log(targetWorkFlowNode.getNodes());   //remove by Chris Gao
		
						for(var i=0;i<targetWorkFlowNode.getNodes().length;i++)
						{	
							if( i > step - 1 + 1  ) // current step + 1
							{
								var canAccessNode = targetWorkFlowNode.getNodes()[i];
								canAccessNode.getDomRef().className = 'sapUiTreeNode_Gray';										
								canAccessNode.getDomRef().innerHTML = '<span class="sapUiTreeNodeContent_Gray">'+canAccessNode.getText()+'</span>';
							}
							else
							{
								var canAccessNode = targetWorkFlowNode.getNodes()[i];
								canAccessNode.getDomRef().className = 'sapUiTreeNode';										
								canAccessNode.getDomRef().innerHTML = '<span class="sapUiTreeNodeContent">'+canAccessNode.getText()+'</span>';
							}
						}	
						
						/***********************************
						 * Modified by Chris Gao
						 * 2015-08-23
						 * to do the performance enhancement, reduce the number of requests to database 
						 ***********************************/
//						if(step > sap.ui.getCore().getModel("UserEBGDFStepData").getData())
//						{
							sap.ui.getCore().getModel("UserEBGDFStepData").setData(step);
//						}
						
						/*****************************
						 * End by Chris Gao
						 * 2015-08-23
						 ****************************/

						that.busydialog.close();
					},
					error: function(data){
						that.table.setBusy(false);
						console.log(data);
						data = data && data.responseText;
						if(!(typeof data === "string")) {
							data = JSON.stringify(data);
						}
						lenovo.control.commontable.Toolkit.showErrorMsg(data, "ERROR", "Execute");
					}
				});
		}
		//lenovo.control.commontable.Toolkit.showErrorMsg("Executed successfully!", "SUCCESS", "Execute");
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
		var auth = lenovo.control.commontable.Table.getViewAuth("Step_4_1_Pegging");
		/******Copy_Change_End*******/

		//generate UI
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel); //declare ui_view configuration
		this.setConfig(config, oServiceUrl, uServiceUrl,auth);   //call private function -- ui_view configuration
		/******Copy_Change_Start*******/
		var header = lenovo.control.commontable.Table.createHeader("LCPE Calculation", "Step 5:Pegging Report");
		/******Copy_Change_End*******/
		
		//set data connection
		/******Copy_Change_Start*******/
		config.bindRowUrl = "/UI_PEGGING";
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
		
		var that = this;			

		var oToolbarCtn = oEditDeleteUploadDownload.getContent()[0];
		var oDeleteAll = new sap.ui.commons.Button({
			lite: true,
			icon: "sap-icon://alert",
			tooltip: "delete all",
			press: function(){
				that.deleteAll(table, oServiceUrl);
			}
		}).addStyleClass("commontable-toolbar-btn");
		
		for (var i in auth) {
			switch(i) {
				case "deleteallable":
					oToolbarCtn.insertContent(oDeleteAll,3);
					break;
			}
		}
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
		
	
		this.busydialog =  new sap.m.BusyDialog({});
		var that = this;
		var onextBtn = new sap.ui.commons.Button({
			lite: true,
			icon: "sap-icon://arrow-right",
			tooltip: "Next",
			press : function(){
				var oLabel = new sap.ui.commons.Label({
					text: "Do you want to next step?",
					width: "350px",
				});
				sap.ui.commons.MessageBox.confirm(oLabel, function(result){
					if(result) {
						that.busydialog.open();
						//that.execute();
						that.NEXT();
						that.busydialog.close();
						that.table.setBusy(false);
						
					}
				}, 	"Confirm");
			} 
		});
		
		var nextPanel = new sap.ui.commons.Panel({
			title: {
				text: "Next"
			},
			showCollapseIcon: false 
		}).addStyleClass("filter-panel ondemandRefresh-dslayout-nocolor");
		
		nextPanel.addButton(onextBtn);
		/*added by chenwh3 20150817  end excute*/
		var oForm = filterPanel.getContent()[0];
		/******Copy_Change_Start*******/
			
		//generate page into app
		var page = new sap.m.Page({
	      	  showHeader: false,
	          content :[header, filterPanel, oEditDeleteUploadDownload, table,nextPanel] //header, filterPanel, oEditDeleteUploadDownload, table             
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
		  {field: "ABCD_T", label: "ABCD_T", type: "TextField", width: "100px"},
		{field: "MTM", label: "MTM", type:"TextField", width: "150px"},
		{field: "MTM_ABCD", label: "MTM_ABCD", type:"TextField", width: "150px"},
		{field: "SBB", label: "SBB", type:"TextField", width: "150px"},
		{field: "SBB_DES", label: "SBB_DES", type:"TextField", width: "100px"},
		{field: "SBB_ABCD", label: "SBB_ABCD", type:"TextField", width: "150px"},
		{field: "SBB_ABCD_1", label: "SBB_ABCD_1", type:"TextField", width: "100px"},
		{field: "SBB_ABCD_2", label: "SBB_ABCD_2", type:"TextField", width: "100px"},
		{field: "SBB_ABCD_3", label: "SBB_ABCD_3", type:"TextField", width: "100px"},
		{field: "SBB_ABCD_4", label: "SBB_ABCD_4", type:"TextField", width: "100px"},
		{field: "SBB_ABCD_5", label: "SBB_ABCD_5", type:"TextField", width: "100px"},
		{field: "CREATE_TS", label: "Create date", type:"TextField", width: "100px", dateformat: "MM-dd-yyyy"},
		{field: "CREATE_USERID", label: "Create user", type:"TextField", width: "100px"},
		{field: "LAST_UPDATE_USERID", label: "Last Modified BY", type:"TextField", width: "150px"},
		{field: "LAST_UPDATE_TS", label: "Last Modified DATE", type:"TextField", width: "150px", dateformat: "MM-dd-yyyy"}
		];
		/******Copy_Change_End*******/
		
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(2);
		var rowHeight = 30;
		
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight-40);
		
		
		/******Copy_Change_Start*******/
		//filter
		config.filtersRaw = [{
			field: "ABCD_T", label: "ABCD_T", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L2 M2 S2", linebreak: true}),
			/*required: true,
			validation:[ {
				validType: lenovo.control.Validation.require,
				errMsg: "ABCD_T is required!"
			}],*/
			dropdownbox : {
				defaultFilterValue: "",
				odata:{
					defaultSelectAll:true,
					url: oServiceUrl +"/UI_PEGGING_SEARCH?$filter=ITEM_TYPE eq 'ABCD_T'&$format=json",
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE"
				}				
			}
		},{
			field: "MTM", label: "MTM", type: "TextField", 
			labelLayout: new sap.ui.layout.GridData({span: "L2 M2 S2", linebreak: true}),
			//required: true,
			
		},{
			field: "MTM_ABCD", label: "MTM_ABCD", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L2 M2 S2", linebreak: true}),
			//required: true,
			
			dropdownbox : {
				//layout: new sap.ui.layout.GridData({span: "L9 M9 S9"}),
				defaultFilterValue: "",
				odata:{
					defaultSelectAll:true,
					url: oServiceUrl +"/UI_PEGGING_SEARCH?$filter=ITEM_TYPE eq 'ABCD'&$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		},{
			field: "SBB", label: "SBB", type: "TextField", 
			labelLayout: new sap.ui.layout.GridData({span: "L2 M2 S2", linebreak: true}),
			//required: true,
			/*dropdownbox : {
				//layout: new sap.ui.layout.GridData({span: "L9 M9 S9"}),
				defaultFilterValue: "",
				odata:{
					defaultSelectAll:true,
					url: oServiceUrl +"/UI_PEGGING_SEARCH?$filter=ITEM_TYPE eq 'SBB'&$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}*/
			
		}];
		/******Copy_Change_End*******/
		
		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);
		
		
		/******Copy_Change_Start*******/
		//create view - Default cascade Subgeo and Country
		//var defaultInsertValue = this.setDefaultCreateCascade(oServiceUrl);
		/******Copy_Change_End*******/
		
		
		/******Copy_Change_Start*******/
		//EDIT
		config.editRaw = [{
  			field: "ABCD", 
  			label: "ABCD",
		},{
  			field: "SBB_ABCD", 
  			label: "SBB_ABCD",
		},{
			field: "SBB_ABCD_1", 
			label: "SBB_ABCD_1"
		},{
			field: "SBB_ABCD_2", 
			label: "SBB_ABCD_2"
		},{
			field: "SBB_ABCD_3", 
			label: "SBB_ABCD_3"
		},{
			field: "SBB_ABCD_4", 
			label: "SBB_ABCD_4"
		},{
			field: "SBB_ABCD_5", 
			label: "SBB_ABCD_5"
		}];
		//create
		config.insertRaw=[{
			field: "ABCD_T", 
			label: "ABCD_T", 
			type:"TextField",
		
		},{
			field: "MTM_ABCD", 
			label: "MTM_ABCD", 
			type: "DropdownBox", 
			/*required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],*/
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				odata:{
				
					url: oServiceUrl +"/UI_PEGGING_CREATE?$filter=ITEM_TYPE eq 'ABCD' &$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		},{
			field: "MTM", 
			label: "MTM", 
			type: "TextField", 
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
		},{
			field: "SBB", 
			label: "SBB", 
			type: "TextField", 
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
		},{
			field: "SBB_DES", 
			label: "SBB_DES", 
			type:"TextField",
		},{
			field: "SBB_ABCD", 
			label: "SBB_ABCD", 
			type:"DropdownBox",
			dropdownbox : {
				odata:{
				
					url: oServiceUrl +"/UI_PEGGING_CREATE?$filter=ITEM_TYPE eq 'ABCD' &$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
					
		},{
			field: "SBB_ABCD_1", 
			label: "SBB_ABCD_1", 
			type:"DropdownBox",
			dropdownbox : {
				odata:{
				
					url: oServiceUrl +"/UI_PEGGING_CREATE?$filter=ITEM_TYPE eq 'ABCD' &$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
					
		},{
			field: "SBB_ABCD_2", 
			label: "SBB_ABCD_2", 
			type:"DropdownBox",
			dropdownbox : {
				odata:{
				
					url: oServiceUrl +"/UI_PEGGING_CREATE?$filter=ITEM_TYPE eq 'ABCD' &$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
					
		},{
			field: "SBB_ABCD_3", 
			label: "SBB_ABCD_3", 
			type:"DropdownBox",
			dropdownbox : {
				odata:{
				
					url: oServiceUrl +"/UI_PEGGING_CREATE?$filter=ITEM_TYPE eq 'ABCD' &$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
					
		},{
			field: "SBB_ABCD_4", 
			label: "SBB_ABCD_4", 
			type:"DropdownBox",
			dropdownbox : {
				odata:{
				
					url: oServiceUrl +"/UI_PEGGING_CREATE?$filter=ITEM_TYPE eq 'ABCD' &$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
					
		},{
			field: "SBB_ABCD_5", 
			label: "SBB_ABCD_5", 
			type:"DropdownBox",
			dropdownbox : {
				odata:{
				
					url: oServiceUrl +"/UI_PEGGING_CREATE?$filter=ITEM_TYPE eq 'ABCD' &$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
					
		}];
		
		config.create.columns = lenovo.control.commontable.Toolkit.splitChunck(2, config.insertRaw);
		config.create.url = "/UI_PEGGING";
		/******Copy_Change_End*******/
		
		
		
		/******Copy_Change_Start*******/
		//download
		config.download.url = "/cdp/common/services/getFileOfNoSymbol.xsjs";
		config.download.table = '"_SYS_BIC"."cdp.ebgdf.models.ui_pegging/CV_UI_PEGGING"';
		config.download.columns=[
			 "ABCD_T","MTM","MTM_ABCD","SBB","SBB_DES","SBB_ABCD","SBB_ABCD_1","SBB_ABCD_2","SBB_ABCD_3",
			 "SBB_ABCD_4","SBB_ABCD_5","CREATE_TS","CREATE_USERID","LAST_UPDATE_TS","LAST_UPDATE_USERID"];

		config.download.filename= "RPT_PEGGING";
		/******Copy_Change_End*******/
		
		
		/******Copy_Change_Start*******/
		//upload
		config.upload = {
			url: uServiceUrl + "/ui_pegging.xsjs",
			excelUrl: "ebgdf/workflow/Step_4_1_Pegging.xlsx"
		};
		//status view
		config.viewstatus = {
				viewUploadHistory: {
					url: uServiceUrl + "/upload.xsodata",
					bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'RPT_PEGGING'",
					selectionMode: sap.ui.table.SelectionMode.Single
				},
				viewErrorInfo: {
					url: uServiceUrl + "/upload.xsodata",
					bindRowUrl: "/UPLOAD_ERR_INFO"
				},
				viewUploadErrorDetail: {
					url: uServiceUrl + "/upload.xsodata/UI_PEGGING_ERR_DETAIL?$format=json",
					columns: [[{
						field: "ABCD_T",
						label: "ABCD_T",
						type:  "TextField"
					},{
						field: "MTM",
						label: "MTM",
						type:  "TextField"
					},{
						field: "MTM_ABCD",
						label: "MTM_ABCD",
						type:  "TextField"
					},{
						field: "SBB",
						label: "SBB",
						type:  "TextField"
					},{
						field: "SBB_DES",
						label: "SBB_DES",
						type:  "TextField"
					}
					,{
						field: "SBB_ABCD",
						label: "SBB_ABCD",
						type:  "TextField"
					},{
						field: "SBB_ABCD_1",
						label: "SBB_ABCD_1",
						type:  "TextField"
					},{
						field: "SBB_ABCD_2",
						label: "SBB_ABCD_2",
						type:  "TextField"
					},{
						field: "SBB_ABCD_3",
						label: "SBB_ABCD_3",
						type:  "TextField"
					},{
						field: "SBB_ABCD_4",
						label: "SBB_ABCD_4",
						type:  "TextField"
					},{
						field: "SBB_ABCD_5",
						label: "SBB_ABCD_5",
						type:  "TextField"
					}]],
					resubmit: {
						url: uServiceUrl + "/ui_pegging.xsjs"
					}
				}
			};
		/******Copy_Change_End*******/
		
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
	deleteAll: function(table){
		sap.ui.commons.MessageBox.confirm("Do you want to delete all items?", function(result){
			if(result){
				var service = new lenovo.service.EBGDF();
				var logicServiceUrl = service.getebgdfLogic();
				var table_name = "RPT_PEGGING";
				var obj = {
					"table_name": table_name
				};
				table.setBusy(true);
				$.ajax({
					url: logicServiceUrl+ "/ui_delete_all.xsjs",
					type:"POST",
					data: obj,
					datatype: "json",
					success: function(data){
						lenovo.control.commontable.Toolkit.showErrorMsg("Successfully delete", "SUCCESS", "Delete");
						var oModel = table.getModel();
						table.setBusy(false);
						oModel.refresh(true);
						lenovo.control.commontable.Toolkit.refreshDropdownbox();
					},
					error: function(err){
						err = err && err.responseText ;
						table.setBusy(false);
						if(!(typeof err === "string"))
							err = JSON.stringify(err);
						lenovo.control.commontable.Toolkit.showErrorMsg(err, "ERROR", "Delete");	
					}
				});
			}
		}, "Confirm");
		
	}
	/*
	//Navigation Setting if required
	onTreeNavigation: function(sChannel, sEvent, oData){
		*//******Copy_Change_Start*******//*
		if(oData.view === "Additional Cost") {
		*//******Copy_Change_End*******//*
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
	}*/
});