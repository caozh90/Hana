/************************************
* Created by bianzh at 2015-8-21
* Version 1.0 2015-08-21
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
sap.ui.jsview("lenovo.view.ebgdf.workFlow.Step_4_2_Rel_Config_Class", { 
/******Copy_Change_End*******/	
	getControllerName: function() {

	},
	/*ADDED BY BIANZH1 20150821  'execute'*/
	
	confirm: function(){

	},
/*	execute: function(filterPanel){
		var that = this;
		var process_name = "DF_APO_INTERLOCK";
		var obj = {
			"process_name": process_name
		};
		this.table.setBusy(true);
		$.ajax({
			url: this.logicServiceUrl + "/ui_mfi_ppn_refresh.xsjs",
			type:"POST",
			data: obj,
			datatype: "json",
			success: function(data){
				that.table.setBusy(false);
				lenovo.control.commontable.Toolkit.showErrorMsg("Executed successfully!", "SUCCESS", "Execute");
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
	},*/
	
	NEXT: function(){
		var that = this;
		var step = '6';
		var obj = {
			"STEP": step
		};
		this.table.setBusy(true);
		
		/***********************
		 * added by Chris Gao
		 * updated by Chris Gao 2015-08-20
		 **********************/
		var targetWorkFlowNode = null;
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
		if(targetWorkFlowNode != null)
		{
			$.ajax({
				url: stepServiceUrl + "/setSteps.xsjs",
				type:"POST",
				data: obj,
				datatype: "json",
				success: function(data){
					
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
					//if(step > sap.ui.getCore().getModel("UserEBGDFStepData").getData())
					//{
						sap.ui.getCore().getModel("UserEBGDFStepData").setData(step);
					//}
					
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
		var auth = lenovo.control.commontable.Table.getViewAuth("Step_4_2_Rel_Config_Class");
		/******Copy_Change_End*******/
		
		//generate UI
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel); //declare ui_view configuration
		this.setConfig(config, oServiceUrl, uServiceUrl,auth);   //call private function -- ui_view configuration
		/******Copy_Change_Start*******/
		var header = lenovo.control.commontable.Table.createHeader("LCPE Calculation", "Step 4: RelConfClass Report");
		/******Copy_Change_End*******/
		
		//set data connection
		/******Copy_Change_Start*******/
		config.bindRowUrl = "/UI_REL_CONFIG_CLASS";
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
			if(auth.editable && oTooltip === 'edit'){
				editButton = buttons[i];
				continue;
			}
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
		config.columns = [{
			field: "CYCLE_ID", label: "CYCLE ID", type:"TextField", width: "100px"
		},{
			field: "MTM", label: "MTM", type:"TextField", width: "100px"
		},{
			field: "MACH_T", label: "MACH T", type:"TextField", width: "100px"
		},{
			field: "X_NAME", label: "X NAME", type:"TextField", width: "150px"
		},{
			field: "PROJECT", label: "PROJECT", type:"TextField", width: "200px"
		},{
			field: "LOD", label: "LOD", type:"DatePicker", 
		    datepicker: {

                format: 'MM/dd/yyyy'

        },width: "150px"
		},{
			field: "ABCD", label: "ABCD", type:"TextField", width: "80px"
		},{
			field: "ABCD_1", label: "ABCD 1", type:"TextField", width: "80px"
		},{
			field: "ABCD_2", label: "ABCD 2", type:"TextField", width: "80px"
		},{
			field: "ABCD_3", label: "ABCD 3", type:"TextField", width: "80px"
		},{
			field: "ABCD_4", label: "ABCD 4", type:"TextField", width: "80px"
		},{
			field: "ABCD_5", label: "ABCD 5", type:"TextField", width: "80px"
		},{
			field: "CREATE_TS", label: "CREATE TIME", type:"TextField", width: "100px", dateformat: "MM-dd-yyyy"
		},{
			field: "CREATE_USERID", label: "CREATE USER", type:"TextField", width: "100px"
		},{
			field: "LAST_UPDATE_TS", label: "LAST UPDATE TIME", type:"TextField", width: "100px", dateformat: "MM-dd-yyyy"
		},{
			field: "LAST_UPDATE_USERID", label: "LAST UPDATE USER", type:"TextField", width: "100px"
		}];
		/******Copy_Change_End*******/
		
			
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(2);
		var rowHeight = 30;
		
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight-65);
		
		
		/******Copy_Change_Start*******/
		//filter
		config.filtersRaw = [{
			field: "MTM", label: "MTM", type: "TextField", 		
			labelLayout: new sap.ui.layout.GridData({span: "L2 M2 S2", linebreak: true}),
		},{
			field: "MACH_T", label: "MACH T", type: "TextField", 
			labelLayout: new sap.ui.layout.GridData({span: "L2 M2 S2", linebreak: true}),
			/*dropdownbox : {
				defaultFilterValue: "",
				odata:{
					defaultSelectAll: true,
					url: oServiceUrl +"/UI_REL_CONFIG_CLASS_SEARCH?$filter=ITEM_TYPE eq 'MACH_T' &$format=json",
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE"
				}			
			}*/	
		},{
			field: "BIZ_LINE", label: "BIZ LINE", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L2 M2 S2", linebreak: true}),
			dropdownbox : {
				//layout: new sap.ui.layout.GridData({span: "L9 M9 S9"}),
				odata:{
					defaultSelectAll:true,
					url: oServiceUrl +"/UI_REL_CONFIG_CLASS_SEARCH?$filter=ITEM_TYPE eq 'BIZ_LINE' &$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		},{
			field: "X_NAME", label: "X NAME", type: "TextField", 
			labelLayout: new sap.ui.layout.GridData({span: "L2 M2 S2", linebreak: true}),
			
		},{
			field: "PROJECT", label: "PROJECT", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L2 M2 S2", linebreak: true}),
			dropdownbox : {
				//layout: new sap.ui.layout.GridData({span: "L9 M9 S9"}),
				odata:{
					defaultSelectAll:true,
					url: oServiceUrl +"/UI_REL_CONFIG_CLASS_SEARCH?$filter=ITEM_TYPE eq 'PROJECT' &$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		}];
		/******Copy_Change_End*******/
		
		config.filters = lenovo.control.commontable.Toolkit.splitChunck(2, config.filtersRaw);
		
		
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
  			field: "ABCD_1", 
  			label: "ABCD 1",
		},{
			field: "ABCD_2", 
			label: "ABCD 2"
		},{
			field: "ABCD_3", 
			label: "ABCD 3"
		},{
			field: "ABCD_4", 
			label: "ABCD 4"
		},{
			field: "ABCD_5", 
			label: "ABCD 5"
		}];
		
		//create
		config.insertRaw=[{
			field: "CYCLE_ID", 
			label: "CYCLE_ID", 
			type:"TextField",
		},{
			field: "MTM", 
			label: "MTM", 
			type:"TextField",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
		},{
			field: "MACH_T", 
			label: "MACH_T", 
			type: "TextField", 
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
		},{
			field: "BIZ_LINE", 
			label: "BIZ_LINE", 
			type: "TextField", 
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
		},{
			field: "X_NAME", 
			label: "X_NAME", 
			type: "TextField", 
		},{
			field: "PROJECT", 
			label: "PROJECT", 
			type: "TextField", 
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
		},{
			field: "LOD", 
			label: "LOD", 
			type: "DatePicker", 
			datepicker: {

                format: 'MM/dd/yyyy'

        },

        required: true,

        validation: [{

                validType:lenovo.control.Validation.require,

                errMsg: "LOD is required"

        }]	
		},{
			field: "ABCD", 
			label: "ABCD", 
			type:"DropdownBox",
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				odata:{
				
					url: oServiceUrl +"/UI_REL_CONFIG_CLASS_CREATE?$filter=ITEM_TYPE eq 'ABCD' &$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
					
		},{
			field: "ABCD_1", 
			label: "ABCD_1", 
			type:"DropdownBox",
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				odata:{
				
					url: oServiceUrl +"/UI_REL_CONFIG_CLASS_CREATE?$filter=ITEM_TYPE eq 'ABCD' &$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
					
		},{
			field: "ABCD_2", 
			label: "ABCD_2", 
			type:"DropdownBox",
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				odata:{
				
					url: oServiceUrl +"/UI_REL_CONFIG_CLASS_CREATE?$filter=ITEM_TYPE eq 'ABCD' &$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
					
		},{
			field: "ABCD_3", 
			label: "ABCD_3", 
			type:"DropdownBox",
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				odata:{
				
					url: oServiceUrl +"/UI_REL_CONFIG_CLASS_CREATE?$filter=ITEM_TYPE eq 'ABCD' &$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
					
		},{
			field: "ABCD_4", 
			label: "ABCD_4", 
			type:"DropdownBox",
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				odata:{
				
					url: oServiceUrl +"/UI_REL_CONFIG_CLASS_CREATE?$filter=ITEM_TYPE eq 'ABCD' &$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
					
		},{
			field: "ABCD_5", 
			label: "ABCD_5", 
			type:"DropdownBox",
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				odata:{
				
					url: oServiceUrl +"/UI_REL_CONFIG_CLASS_CREATE?$filter=ITEM_TYPE eq 'ABCD' &$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
					
		}];
		
		config.create.columns = lenovo.control.commontable.Toolkit.splitChunck(2, config.insertRaw);
		config.create.url = "/UI_REL_CONFIG_CLASS";
		
		/******Copy_Change_End*******/

		/******Copy_Change_Start*******/
		//download
		config.download.url = "/cdp/common/services/getFileOfNoSymbol.xsjs";
		config.download.table = '"_SYS_BIC"."cdp.ebgdf.models.ui_rel_config_class/CV_UI_REL_CONFIG_CLASS"';
		config.download.columns=[
			 "CYCLE_ID","MTM","MACH_T","BIZ_LINE","X_NAME","PROJECT",
			 "LOD","ABCD","ABCD_1","ABCD_2","ABCD_3","ABCD_4","ABCD_5","CREATE_TS","CREATE_USERID","LAST_UPDATE_TS","LAST_UPDATE_USERID"];
		config.download.filename= "UI_REL_CONFIG_CLASS";
		/******Copy_Change_End*******/
		
		
		/******Copy_Change_Start*******/
		//upload
		config.upload = {
			url: uServiceUrl + "/ui_rel_config_class.xsjs",
			excelUrl: "ebgdf/workflow/Step_4_2_Rel_Config_Class.xlsx"
		};
		//status view
		config.viewstatus = {
				viewUploadHistory: {
					url: uServiceUrl + "/upload.xsodata",
					bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'RPT_RELCONFCLASS'",
					selectionMode: sap.ui.table.SelectionMode.Single
				},
				viewErrorInfo: {
					url: uServiceUrl + "/upload.xsodata",
					bindRowUrl: "/UPLOAD_ERR_INFO"
				},
				viewUploadErrorDetail: {
					url: uServiceUrl + "/upload.xsodata/UI_REL_CONFIG_CLASS_ERR_DETAIL?$format=json",
					columns: [[{
						field: "CYCLE_ID",
						label: "CYCLE_ID",
						type:  "TextField"
					},{
						field: "MTM",
						label: "MTM",
						type:  "TextField"
					},{
						field: "MACH_T",
						label: "MACH_T",
						type:  "TextField"
					},{
						field: "BIZ_LINE",
						label: "BIZ_LINE",
						type:  "TextField"
					},{
						field: "X_NAME",
						label: "X_NAME",
						type:  "TextField"
					},{
						field: "PROJECT",
						label: "PROJECT",
						type:  "TextField"
					},{
						field: "LOD",
						label: "LOD",
						type:  "TextField"
					},{
						field: "ABCD",
						label: "ABCD",
						type:  "TextField"
					},{
						field: "ABCD_1",
						label: "ABCD_1",
						type:  "TextField"
					},{
						field: "ABCD_2",
						label: "ABCD_2",
						type:  "TextField"
					},{
						field: "ABCD_3",
						label: "ABCD_3",
						type:  "TextField"
					},{
						field: "ABCD_4",
						label: "ABCD_4",
						type:  "TextField"
					},{
						field: "ABCD_5",
						label: "ABCD_5",
						type:  "TextField"
					}]],
					resubmit: {
						url: uServiceUrl + "/ui_rel_config_class.xsjs"
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
				var table_name = "RPT_RELCONFCLASS";
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
});