/************************************
* Created by FangXing Fan at 2015-8-17
* Version 1.0 2015-08-17
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
sap.ui.jsview("lenovo.view.ebgdf.workFlow.Step_2_Report_Interlock", { 
/******Copy_Change_End*******/	
	getControllerName: function() {

	},

	execute: function(filterPanel){
		var that = this;
		var process_name = "PRC_CONSOLIDATION";
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
		var step = '2';
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
//					if(step > sap.ui.getCore().getModel("UserEBGDFStepData").getData())
//					{
						sap.ui.getCore().getModel("UserEBGDFStepData").setData(step);
//					}
					
					/*****************************
					 * End by Chris Gao
					 * 2015-08-23
					 ****************************/
					
					that.table.setBusy(false);
	//				that.refreshnvagation();
	//				lenovo.control.commontable.Toolkit.showErrorMsg("Executed successfully!", "SUCCESS", "Execute");
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
		var auth = lenovo.control.commontable.Table.getViewAuth("Step_2_Report_Interlock");
		/******Copy_Change_End*******/

		//generate UI
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel); //declare ui_view configuration
		this.setConfig(config, oServiceUrl, uServiceUrl, auth);   //call private function -- ui_view configuration
		/******Copy_Change_Start*******/
		var header = lenovo.control.commontable.Table.createHeader("LCPE Calculation", "Step 2:Interlock Report");
		/******Copy_Change_End*******/
		
		//set data connection
		/******Copy_Change_Start*******/
		config.bindRowUrl = "/CV_UI_REPORT_INTERLOCK";
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
						that.execute();
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
		
		//generate page into app
		var page = new sap.m.Page({
	      	  showHeader: false,
	          content :[header, filterPanel, oEditDeleteUploadDownload, table, nextPanel] //header, filterPanel, oEditDeleteUploadDownload, table             
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
			field: "ABCD_T", label: "Abcd Type", type:"TextField", width: "100px"
		},{
			field: "SBB_OPT", label: "SBB/OPT", type:"TextField", width: "120px"
		},{
			field: "SBB_DES", label: "SBB Description", type:"TextField", width: "150px"
		},{
			field: "MFI_FFI_FC_IND", label: "MFI_FFI_FC_IND", type:"TextField", width: "150px"
		},{
			field: "GAD", label: "General Availability Date", type: "DatePicker", 
			datepicker: {

                format: 'MM/dd/yyyy'

        }, width: "200px"
		},{
			field: "LOD", label: "Last Order Date", type: "DatePicker", 
			datepicker: {

                format: 'MM/dd/yyyy'

        }, width: "200px"
		},{
			field: "PPN", label: "Purchased Part  Number", type:"TextField", width: "180px"
		},{
			field: "PP_DES", label: "Purchased Part Description", type:"TextField", width: "200px"
		},{
			field: "SUPPLIER", label: "Supplier Name", type:"TextField", width: "120px"
		},{
			field: "LENOVO_PPN_OHQ", label: "Lenovo PPN Onhand Qty", type:"TextField", width: "180px"
		},{
			field: "PPN_HIQ", label: "PPN Hub Inventory Qty", type:"TextField", width: "180px"
		},{
			field: "SBB_3M_FORECAST", label: "SBB/OPT 3 Month Demand Forecast", type:"TextField", width: "250px"
		},{
			field: "SBB_3M_SHIPMENT", label: "SBB/OPT 3 Month Actual Shipments", type:"TextField", width: "250px"
		},{
			field: "PPN_3M_SHIPMENT", label: "PPN 3 Month Actual Shipments", type:"TextField", width: "250px"
		},{
			field: "PRIOR_ABCD", label: "Prior Cycle ABCD Value", type:"TextField", width: "200px"
		},{
			field: "REC_ABCD", label: "Recommended ABCD Value", type:"TextField", width: "200px"
		},{
			field: "CREATE_TS", label: "CREATE TIME", type:"TextField", width: "120px", dateformat: "MM-dd-yyyy"
		},{
			field: "CREATE_USERID", label: "CREATE USER", type:"TextField", width: "120px"
		},{
			field: "LAST_UPDATE_TS", label: "LAST CHANGED TIME", type:"TextField", width: "180px", dateformat: "MM-dd-yyyy"
		},{
			field: "LAST_UPDATE_USERID", label: "LAST CHANGE USER", type:"TextField", width: "180px"
		}];
		/******Copy_Change_End*******/
		
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(3); //updated by Chris Gao
		var rowHeight = 30;
		
		
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight-30);
		
		
		/******Copy_Change_Start*******/
		//filter
		config.filtersRaw = [{
			field: "ABCD_T", label: "Abcd Type", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
			dropdownbox : {
				defaultFilterValue: "",
				odata:{
					defaultSelectAll: true,
					url: oServiceUrl +"/CV_UI_REPORT_INTERLOCK_SEARCH?$filter=ITEM_TYPE eq 'ABCD_T' &$format=json",
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE"
				}				
			}
		},{
			field: "SBB_OPT", label: "SBB/OPT", type: "TextField", 
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
		},{
			field: "PPN", label: "Purchased Part Number", type: "TextField", 
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
		},{
			field: "SUPPLIER", label: "Supplier Name", type: "TextField", 
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
		}];
		/******Copy_Change_End*******/
		
		//edit 
		config.editRaw = [{
			field: "SBB_DES",label: "SBB Description"
		},{
			field: "MFI_FFI_FC_IND",label: "MFI_FFI_FC_IND"
//			dropdownbox : {  , type: "DropdownBox", 
//				defaultFilterValue: "",
//				odata:{
//					defaultSelectAll: true,
//					url: oServiceUrl +"/CV_UI_REPORT_INTERLOCK_CREATE?$filter=ITEM_TYPE eq 'MFI_FFI_FC_IND' &$format=json",
//					bindTextField: "ITEM_VALUE",
//					bindKeyField: "ITEM_VALUE"
//				}				
//			}
		},{
			field: "GAD",label: "General Availability Date",type: "DatePicker",datepicker: {

                format: 'MM/dd/yyyy'

        }
		},{
			field: "LOD",label: "Last Order Date",type: "DatePicker",datepicker: {

                format: 'MM/dd/yyyy'

        }
		},{
			field: "PP_DES",label: "Purchased Part Description" //,  editable: true
		}/*,{
			field: "SUPPLIER",label: "Supplier Name" //, editable: true
		}*/,{
			field: "REC_ABCD",label: "Recommended ABCD Value" //, editable: true
		}];		
		
		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);
		
		/******Copy_Change_Start*******/
		//create
		config.insertRaw=[{
			field: "ABCD_T", 
			label: "ABCD_T", 
			type:"TextField",
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
		},{
			field: "SBB_OPT", 
			label: "SBB_OPT", 
			type:"TextField",
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
		},{
			field: "SBB_DES", 
			label: "SBB_DES", 
			type:"TextField",
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
		},{
			field: "MFI_FFI_FC_IND", 
			label: "MFI_FFI_FC_IND", 
			type:"TextField",
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
//			type:"DropdownBox",
//			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
//			dropdownbox : {
//				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
//				odata:{
//				
//					url: oServiceUrl +"/CV_UI_REPORT_INTERLOCK_CREATE?$filter=ITEM_TYPE eq 'MFI_FFI_FC_IND' &$format=json",
//					bindTextField:"ITEM_VALUE",
//					bindKeyField:"ITEM_VALUE"
//				}
//			}
		},{
			field: "GAD", 
			label: "GAD", 
//			type: "TextField", 
			type: "DatePicker", 
			datepicker: {

                format: 'MM/dd/yyyy'

            },
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
		},{
			field: "LOD", 
			label: "LOD", 
//			type: "TextField", 
			type: "DatePicker", 
			datepicker: {

                format: 'MM/dd/yyyy'

            },
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
		},{
			field: "PPN", 
			label: "PPN", 
			type: "TextField", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
		},{
			field: "PP_DES", 
			label: "PP_DES", 
			type: "TextField", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
		},{
			field: "SUPPLIER", 
			label: "SUPPLIER", 
			type: "TextField",
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
		},{
			field: "LENOVO_PPN_OHQ", 
			label: "LENOVO_PPN_OHQ", 
			type: "TextField", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
		},{
			field: "PPN_HIQ", 
			label: "PPN_HIQ", 
			type: "TextField", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
		},{
			field: "SBB_3M_FORECAST", 
			label: "SBB_3M_FORECAST", 
			type: "TextField", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
		},{
			field: "SBB_3M_SHIPMENT", 
			label: "SBB_3M_SHIPMENT", 
			type: "TextField", 
		},{
			field: "PPN_3M_SHIPMENT", 
			label: "PPN_3M_SHIPMENT", 
			type: "TextField", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
		},{
			field: "PRIOR_ABCD", 
			label: "PRIOR_ABCD", 
			type: "DropdownBox",
//			required: true,
//			validation: [{
//				validType: lenovo.control.Validation.require,
//				errMsg: "Required!"
//			}],
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				odata:{
				
					url: oServiceUrl +"/CV_UI_REPORT_INTERLOCK_CREATE?$filter=ITEM_TYPE eq 'ABCD' &$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		},{
			field: "REC_ABCD", 
			label: "REC_ABCD", 
			type: "DropdownBox", 
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				odata:{
				
					url: oServiceUrl +"/CV_UI_REPORT_INTERLOCK_CREATE?$filter=ITEM_TYPE eq 'ABCD' &$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		}];
		
		config.create.columns = lenovo.control.commontable.Toolkit.splitChunck(2, config.insertRaw);
		config.create.url = "/CV_UI_REPORT_INTERLOCK";

		/******Copy_Change_End*******/
		
		
		
		/******Copy_Change_Start*******/
		//download
		config.download.url = "/cdp/common/services/getFileOfNoSymbol.xsjs";
		config.download.table = '"_SYS_BIC"."cdp.ebgdf.models.ui_report_interlock/CV_UI_REPORT_INTERLOCK"';
		config.download.columns=[
			 "ABCD_T","SBB_OPT","SBB_DES","MFI_FFI_FC_IND","GAD","LOD","PPN","PP_DES","SUPPLIER",
		"LENOVO_PPN_OHQ","PPN_HIQ","SBB_3M_FORECAST","SBB_3M_SHIPMENT","PPN_3M_SHIPMENT","PRIOR_ABCD","REC_ABCD","CREATE_TS","CREATE_USERID",
		"LAST_UPDATE_TS","LAST_UPDATE_USERID"];
		config.download.filename= "PRT_Interlock";
		/******Copy_Change_End*******/
		
		
		/******Copy_Change_Start*******/
		//upload
		config.upload = {
			url: uServiceUrl + "/ui_report_interlock_.xsjs",
			excelUrl: "ebgdf/workflow/step_2_report_interlock.xlsx"
		};
		//status view
		config.viewstatus = {
				viewUploadHistory: {
					url: uServiceUrl + "/upload.xsodata",
					bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'RPT_INTERLOCK'",
					selectionMode: sap.ui.table.SelectionMode.Single
				},
				viewErrorInfo: {
					url: uServiceUrl + "/upload.xsodata",
					bindRowUrl: "/UPLOAD_ERR_INFO"
				},
				viewUploadErrorDetail: {
					url: uServiceUrl + "/upload.xsodata/UI_REPORT_INTERLOCK_ERR_DETAIL?$format=json", 
					columns: [[{
						field: "ABCD_T",
						label: "Abcd Type",
						type:  "TextField"
					},{
						field: "SBB_OPT",
						label: "SBB/OPT",
						type:  "TextField"
					},{
						field: "SBB_DES",
						label: "SBB Description",
						type:  "TextField"
					},{
						field: "MFI_FFI_FC_IND",
						label: "MFI_FFI_FC_IND",
						type:  "TextField"
					},{
						field: "GAD",
						label: "General Availability Date",
						type:  "TextField"
					},{
						field: "LOD",
						label: "Last Order Date",
						type:  "TextField"
					},{
						field: "PPN",
						label: "Purchased Part Number",
						type:  "TextField"
					},{
						field: "PP_DES",
						label: "Purchased Part Description",
						type:  "TextField"
					},{
						field: "SUPPLIER",
						label: "Supplier Name",
						type:  "TextField"
					},{
						field: "LENOVO_PPN_OHQ",
						label: "Lenovo PPN Onhand Qty",
						type:  "TextField"
					},{
						field: "PPN_HIQ",
						label: "PPN Hub Inventory Qty",
						type:  "TextField"
					},{
						field: "SBB_3M_FORECAST",
						label: "SBB/OPT 3 month Demand Forecast",
						type:  "TextField"
					},{
						field: "SBB_3M_SHIPMENT",
						label: "SBB/OPT 3 Mos Actual Shipments",
						type:  "TextField"
					},{
						field: "PPN_3M_SHIPMENT",
						label: "PPN 3 Month Actual Shipments",
						type:  "TextField"
					},{
						field: "PRIOR_ABCD",
						label: "Prior Cycle ABCD Value",
						type:  "TextField"
					},{
						field: "REC_ABCD",
						label: "Recommended ABCD Value",
						type:  "TextField"
					},{
						field: "CREATE_TS",
						label: "CREATE TIME",
						type:  "TextField"
					},{
						field: "CREATE_USERID",
						label: "CREATE USER",
						type:  "TextField"
					},{
						field: "LAST_UPDATE_TS",
						label: "LAST CHANGED TIME",
						type:  "TextField"
					},{
						field: "LAST_UPDATE_USERID",
						label: "LAST CHANGE USER",
						type:  "TextField"
					}]],
					resubmit: {
						url: uServiceUrl + "/ui_report_interlock_.xsjs"
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
				var table_name = "RPT_INTERLOCK";
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
//	//Navigation Setting if required
//	onTreeNavigation: function(sChannel, sEvent, oData){
//		/******Copy_Change_Start*******/
//		if(oData.view === "Additional Cost") {
//		/******Copy_Change_End*******/
//			if(this.table && this.oModel) {		
//				var defaultSort = lenovo.control.commontable.Table._getDefaultSort(this.config);
//				var defaultFilters = lenovo.control.commontable.Table._getDefaultFilter(this.config);
//				this.table.bindRows(this.config.bindRowUrl, null, defaultSort,defaultFilters);	
//				var filterModel = new sap.ui.model.json.JSONModel();				
//				var clearObj = this.oForm.data("clearObj");
//				var obj = JSON.stringify(clearObj);
//				lenovo.control.commontable.Table._clearAllFilterCondition(filterModel, this.oForm, obj);																						
//			}		
//		}
//	}
});