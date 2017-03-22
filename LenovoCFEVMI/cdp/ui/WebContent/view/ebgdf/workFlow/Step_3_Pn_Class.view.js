/************************************
* Created by chenwh at 2015-8-12
* Version 1.0 2015-08-12
* Version 1.0
************************************/
//require what you need
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.EBGDF");
jQuery.sap.require("lenovo.control.Validation");

sap.ui.jsview("lenovo.view.ebgdf.workFlow.Step_3_Pn_Class",{
	 
	 
	/******Copy_Change_End*******/	
		getControllerName: function() {

		},
		execute: function(filterPanel){
			var that = this;
			var process_name = "PRC_RELCONF_LEADTIME";
			var obj = {
				"process_name": process_name
			};
			//added by Chris Gao 2015-08-23
			that.table.setBusy(true);
			that.table_sub.setBusy(true);
			
			$.ajax({
				url: this.logicServiceUrl + "/ui_mfi_ppn_refresh.xsjs",
				type:"POST",
				data: obj,
				datatype: "json",
				success: function(data){
					//added by Chris Gao 2015-08-23
					that.table.setBusy(false);
					that.table_sub.setBusy(false);
					//lenovo.control.commontable.Toolkit.showErrorMsg("Executed successfully!", "SUCCESS", "Execute");
				},
				error: function(data){
					//added by Chris Gao 2015-08-23
					that.table.setBusy(false);
					that.table_sub.setBusy(false);
					
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
			
			//added by Chris Gao 2015-08-23
			that.table.setBusy(true);
			that.table_sub.setBusy(true);
			
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
					//	if(step > sap.ui.getCore().getModel("UserEBGDFStepData").getData())
					//	{
							sap.ui.getCore().getModel("UserEBGDFStepData").setData(step);
					//	}
						
						/*****************************
						 * End by Chris Gao
						 * 2015-08-23
						 ****************************/
						
						that.busydialog.close();
						//added by Chris Gao 2015-08-23
						that.table.setBusy(false);
						that.table_sub.setBusy(false);
					},
					error: function(data){
						that.table.setBusy(false);
						//added by Chris Gao 2015-08-23
						that.table_sub.setBusy(false);
						
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
			var oModel1 = new sap.ui.model.odata.ODataModel(oServiceUrl, true);
			//declare authorization
			/******Copy_Change_Start*******/
			var auth = lenovo.control.commontable.Table.getViewAuth("Step_3_Pn_Class");
			/******Copy_Change_End*******/

			//declare tab strip
			var oTabStrip =  new sap.ui.commons.TabStrip("tabResult");
			
			//generate UI
			var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel); //declare ui_view configuration
			var config_sub =  lenovo.control.commontable.Table.getDefaultTableConfig(oModel1);
			this.setConfig(config, oServiceUrl, uServiceUrl,auth, "PN_CLASS");   //call private function -- ui_view configuration
			this.setConfig(config_sub, oServiceUrl, uServiceUrl,auth, "OVERRIDEN");
			/******Copy_Change_Start*******/
			var header = lenovo.control.commontable.Table.createHeader("LCPE Calculation", "Step 3:PN Class Report");
			/******Copy_Change_End*******/
			
			
			
			//set data connection
			/******Copy_Change_Start*******/
			config.bindRowUrl = "/INPUT_PNCLASS(IN_MFI_FFI_FC_IND='', IN_MFI_FFI_FC='',IN_PPN='',IN_ABCD_T='',IN_TYPE='PN_CLASS')/Results";
			config_sub.bindRowUrl = "/INPUT_PNCLASS(IN_MFI_FFI_FC_IND='', IN_MFI_FFI_FC='',IN_PPN='',IN_ABCD_T='',IN_TYPE='OVERRIDEN')/Results";
			config.navigationMode = sap.ui.table.NavigationMode.Scrollbar;
			/******Copy_Change_End*******/
			var table = lenovo.control.commontable.Table.createTable(config);
			var table_sub = lenovo.control.commontable.Table.createTable(config_sub);
			
			//added by Chris Gao 2015-08-23
			this.table = table;
			this.table_sub = table_sub;
			
			//table.setBusy(true);
			table.setModel(oModel);
			table_sub.setModel(oModel1);
			
			oModel.attachRequestCompleted(function(){
				table.setBusy(false);
				table_sub.setBusy(false);
			});
			
			oModel1.attachRequestCompleted(function(){
				table.setBusy(false);
				table_sub.setBusy(false);
			});
			
			//filter panel
			var filterPanel = lenovo.control.commontable.Table.createFilter(config, table);
			var filterPanel_sub = lenovo.control.commontable.Table.createFilter(config_sub, table_sub);

			//tool bar		
			var oEditDeleteUploadDownload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table, app);
			var oEditDeleteUploadDownload_sub = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table_sub, app);
			
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
			
			var oToolbarCtn_sub = oEditDeleteUploadDownload_sub.getContent()[0];
			var oDeleteAll_sub = new sap.ui.commons.Button({
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
						oToolbarCtn_sub.insertContent(oDeleteAll_sub,3);
						oToolbarCtn.insertContent(oDeleteAll,3);
						break;
				}
			}
			//var oForm = filterPanel.getContent()[0];
			/******Copy_Change_Start*******/

			var oVLayout1 = new sap.ui.layout.VerticalLayout ("tablayout1", {
				width: "100%",
				content: [filterPanel, oEditDeleteUploadDownload, table]
			});
			
			var oVLayout2 = new sap.ui.layout.VerticalLayout ("tablayout2", {
				width: "100%",
				content: [filterPanel_sub, oEditDeleteUploadDownload_sub,table_sub]
			});
			
			//add tab strip
			var oTab1 = new sap.ui.commons.Tab("tab1");
			oTab1.setTooltip("PN_CLASS");
			oTab1.setTitle(new sap.ui.core.Title("PN_CLASS",{text:" PN_CLASS",icon:"sap-icon://open-folder"}));
			oTab1.addContent(oVLayout1);
			
			var oTab2 = new sap.ui.commons.Tab("tab2");
			oTab2.setTooltip("OVERRIDEN");
			oTab2.setTitle(new sap.ui.core.Title("OVERRIDEN",{text:" OVERRIDEN",icon:"sap-icon://folder"}));
			oTab2.addContent(oVLayout2);
			
			oTabStrip.addTab(oTab1);
			oTabStrip.addTab(oTab2);
			
			//change tab icon state
			oTabStrip.attachSelect(function(oEvent){
				if(oTabStrip.getSelectedIndex() == 0)
				{
					oTab1.getTitle().setProperty("icon","sap-icon://open-folder");
					oTab2.getTitle().setProperty("icon","sap-icon://folder");
				}
				else
				{
					oTab1.getTitle().setProperty("icon","sap-icon://folder");
					oTab2.getTitle().setProperty("icon","sap-icon://open-folder");
				}
			});
			
//			oTabStrip.createTab("PN_CLASS", oVLayout1);
//			
//			oTabStrip.createTab("OVERRIDEN", oVLayout2);
			/*added by zhaodan1 20150820 start excute*/
			
			
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
							//that.table.setBusy(false);
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
			/*added by chenwh3 20150820  end excute*/
			
			//generate page into app
			var page = new sap.m.Page({
		      	showHeader: false,
		      	content :[header, oTabStrip,nextPanel] //header, filterPanel, oEditDeleteUploadDownload, table             
		    });
	       app.insertPage(page);
	       app.setInitialPage(page);
	       return app;	
			
		},
		
		tabSelect : function(oEvent){
			
			var tabStrip = oEvent.getSource();
			console.log(tabStrip.getSelectedIndex());
		},
		
		//private function -- ui_view columns configuration
		setConfig: function(config, oServiceUrl, uServiceUrl, auth, fixTypeConfig) {
					//table columns setting
			/******Copy_Change_Start*******/
			config.columns = [
			{field: "CYCLE_ID", label: "CYCLE_ID", type: "TextField", width: "100px"
			},
			{field: "MFI_FFI_FC_IND", label: "MFI_FFI_FC_IND", type:"TextField", width: "150px"
			},
			{field: "MFI_FFI_FC", label: "MFI_FFI_FC", type:"TextField", width: "150px"
			},
			{field: "PPN", label: "PPN", type:"TextField", width: "150px"
			},
			{field: "ABCD_T", label: "ABCD_T", type:"TextField", width: "100px"
			},
			{field: "LOD", label: "LOD", type:"DatePicker",
			 datepicker: {

	                format: 'MM/dd/yyyy'

	        },width: "150px"
			},
			{field: "ABCD", label: "ABCD", type:"TextField", width: "100px"},
			{field: "ABCD_1", label: "ABCD_1", type:"TextField", width: "100px"},
			{field: "ABCD_2", label: "ABCD_2", type:"TextField", width: "100px"},
			{field: "ABCD_3", label: "ABCD_3", type:"TextField", width: "100px"},
			{field: "ABCD_4", label: "ABCD_4", type:"TextField", width: "100px"},
			{field: "ABCD_5", label: "ABCD_5", type:"TextField", width: "100px"},
			{field: "CREATE_TS", label: "Create date", type:"TextField", width: "100px", dateformat: "MM-dd-yyyy"},
			{field: "CREATE_USERID", label: "Create user", type:"TextField", width: "100px"},
			{field: "LAST_UPDATE_USERID", label: "Last Modified BY", type:"TextField", width: "150px"
			},
			{field: "LAST_UPDATE_TS", label: "Last Modified DATE", type:"TextField", width: "150px", dateformat: "MM-dd-yyyy"
			}];
			/******Copy_Change_End*******/
			
			//updated by Chris Gao
			var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
			var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(4);
			var rowHeight = 30;
			
			config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight-30);
			
			
			/******Copy_Change_Start*******/
			//filter
			config.filtersRaw = [{
				field: "MFI_FFI_FC_IND", label: "MFI_FFI_FC_IND", type: "DropdownBox", 
				labelLayout: new sap.ui.layout.GridData({span: "L2 M3 S3", linebreak: true}),
	
				dropdownbox : {
					defaultFilterValue: "",
					odata:{
						defaultSelectAll: true,
						url: oServiceUrl +"/CV_UI_PN_CLASS_SEARCH?$filter=ITEM_TYPE eq 'MFI_FFI_FC_IND'&$format=json",
						bindTextField: "ITEM_VALUE",
						bindKeyField: "ITEM_VALUE"
					}				
				}
			},{
				field: "MFI_FFI_FC", label: "MFI_FFI_FC", type: "TextField", 
				labelLayout: new sap.ui.layout.GridData({span: "L2 M3 S3", linebreak: true}),
				
			},{
				field: "PPN", label: "PPN", type: "TextField",
				labelLayout: new sap.ui.layout.GridData({span: "L2 M3 S3", linebreak: true}),
				
			},{
				field: "ABCD_T", label: "ABCD_T", type: "DropdownBox", 
				labelLayout: new sap.ui.layout.GridData({span: "L2 M3 S3", linebreak: true}),
				dropdownbox : {
					defaultFilterValue: "",
					odata:{
						defaultSelectAll: true,
						url: oServiceUrl +"/CV_UI_PN_CLASS_SEARCH?$filter=ITEM_TYPE eq 'ABCD_T'&$format=json",
						bindTextField: "ITEM_VALUE",
						bindKeyField: "ITEM_VALUE"
					}				
				}
			}
			];
			/******Copy_Change_End*******/
			
			config.filters = lenovo.control.commontable.Toolkit.splitChunck(2, config.filtersRaw);

			/******Copy_Change_Start*******/
			//download  
			config.download.url = "/cdp/common/services/getFileWithTableInputParas.xsjs";
			config.download.tablewithinputpara = '"_SYS_BIC"."cdp.ebgdf.models.ui_pn_class/CV_UI_PN_CLASS"';
			config.download.urlInputParas = [{item: "IN_MFI_FFI_FC_IND", value:"",bindFilterPath:"MFI_FFI_FC_IND"},
			      			               {item: "IN_MFI_FFI_FC", value:"",bindFilterPath:"MFI_FFI_FC"},
			    			               {item: "IN_PPN", value:"",bindFilterPath:"PPN"},
			    			               {item: "IN_ABCD_T", value:"",bindFilterPath:"ABCD_T"},
			    			               {item: "IN_TYPE", value: fixTypeConfig, bindFilterPath:"TYPE"}];
			config.download.table = '"_SYS_BIC"."cdp.ebgdf.models.ui_pn_class/CV_UI_PN_CLASS"';
			config.download.columns=["CYCLE_ID","MFI_FFI_FC_IND","MFI_FFI_FC","PPN","ABCD_T",
			                         "LOD","ABCD","ABCD_1","ABCD_2","ABCD_3","ABCD_4","ABCD_5"];
			config.download.filename= "UI_PN_CLASS_" + fixTypeConfig;
			/******Copy_Change_End*******/
			//EDIT
			config.editRaw = [{
	  			field: "CYCLE_ID", 
	  			label: "CYCLE_ID",
			},{
	  			field: "ABCD", 
	  			label: "ABCD",
			},{
				field: "ABCD_1", 
				label: "ABCD_1"
			},{
				field: "ABCD_2", 
				label: "ABCD_2"
			},{
				field: "ABCD_3", 
				label: "ABCD_3"
			},{
				field: "ABCD_4", 
				label: "ABCD_4"
			},{
				field: "ABCD_5", 
				label: "ABCD_5"
			}];
			//create
			config.insertRaw=[{
				field: "CYCLE_ID", 
				label: "CYCLE_ID", 
				type: "TextField", 
				
					required: true,
					validation: [{
	                validType:lenovo.control.Validation.require,
	                errMsg: "required"
	        		}]
			},{
				field: "MFI_FFI_FC_IND", 
				label: "MFI_FFI_FC_IND", 
				type:"TextField",
				required: true,
				validation: [{
					validType: lenovo.control.Validation.require,
					errMsg: "Required!"
				}],
				
			},{
				field: "PPN", 
				label: "PPN", 
				type: "TextField", 
				required: true,
				validation: [{
					validType: lenovo.control.Validation.require,
					errMsg: "Required!"
				}],
				labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
				
			},{
				field: "MFI_FFI_FC", 
				label: "MFI_FFI_FC", 
				type: "TextField", 
				required: true,
				validation: [{
					validType: lenovo.control.Validation.require,
					errMsg: "Required!"
				}],
				labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
				
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
	                errMsg: "required"
	        		}]
			},
			{
				field: "ABCD_T", 
				label: "ABCD_T", 
				type:"TextField",
				required: true,
				validation: [{
					validType: lenovo.control.Validation.require,
					errMsg: "Required!"
				}],
				
			},{
				field: "ABCD", 
				label: "ABCD", 
				type:"DropdownBox",
				dropdownbox : {
					defaultFilterValue: "",
					odata:{
						defaultSelectAll: true,
						url: oServiceUrl +"/CV_UI_PN_CLASS_CREATE?$filter=ITEM_TYPE eq 'ABCD' &$format=json",
						bindTextField:"ITEM_VALUE",
						bindKeyField:"ITEM_VALUE"
					}
				}
						
			},{
				field: "ABCD_1", 
				label: "ABCD_1", 
				type:"DropdownBox",
				dropdownbox : {
					defaultFilterValue: "",
					odata:{
						defaultSelectAll: true,
						url: oServiceUrl +"/CV_UI_PN_CLASS_CREATE?$filter=ITEM_TYPE eq 'ABCD' &$format=json",
						bindTextField:"ITEM_VALUE",
						bindKeyField:"ITEM_VALUE"
					}
				}
						
			},{
				field: "ABCD_2", 
				label: "ABCD_2", 
				type:"DropdownBox",
				dropdownbox : {
					defaultFilterValue: "",
					odata:{
						defaultSelectAll: true,
						url: oServiceUrl +"/CV_UI_PN_CLASS_CREATE?$filter=ITEM_TYPE eq 'ABCD' &$format=json",
						bindTextField:"ITEM_VALUE",
						bindKeyField:"ITEM_VALUE"
					}
				}
						
			},{
				field: "ABCD_3", 
				label: "ABCD_3", 
				type:"DropdownBox",
				dropdownbox : {
					defaultFilterValue: "",
					odata:{
						defaultSelectAll: true,
						url: oServiceUrl +"/CV_UI_PN_CLASS_CREATE?$filter=ITEM_TYPE eq 'ABCD' &$format=json",
						bindTextField:"ITEM_VALUE",
						bindKeyField:"ITEM_VALUE"
					}
				}
						
			},{
				field: "ABCD_4", 
				label: "ABCD_4", 
				type:"DropdownBox",
				dropdownbox : {
					defaultFilterValue: "",
					odata:{
						defaultSelectAll: true,
						url: oServiceUrl +"/CV_UI_PN_CLASS_CREATE?$filter=ITEM_TYPE eq 'ABCD' &$format=json",
						bindTextField:"ITEM_VALUE",
						bindKeyField:"ITEM_VALUE"
					}
				}
						
			},{
				field: "ABCD_5", 
				label: "ABCD_5", 
				type:"DropdownBox",
				dropdownbox : {
					defaultFilterValue: "",
					odata:{
						defaultSelectAll: true,
						url: oServiceUrl +"/CV_UI_PN_CLASS_CREATE?$filter=ITEM_TYPE eq 'ABCD' &$format=json",
						bindTextField:"ITEM_VALUE",
						bindKeyField:"ITEM_VALUE"
					}
				}
			}];
			//upload
			config.upload = {
				url: uServiceUrl + "/ui_pn_class.xsjs",
				excelUrl: "ebgdf/workflow/Step_3_Pn_Class.xlsx"
			};
			//status view
			config.viewstatus = {
					viewUploadHistory: {
						url: uServiceUrl + "/upload.xsodata",
						bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'RPT_PN_CLASS'",
						selectionMode: sap.ui.table.SelectionMode.Single
					},
					viewErrorInfo: {
						url: uServiceUrl + "/upload.xsodata",
						bindRowUrl: "/UPLOAD_ERR_INFO"
					},
					viewUploadErrorDetail: {
						url: uServiceUrl + "/upload.xsodata/UI_MFI_PPN_ERR_DETAIL?$format=json",
						columns: [[{
							field: "MFI_FFI_FC_IND",
							label: "MFI_FFI_FC_IND",
							type:  "TextField"
						},{
							field: "MFI_FFI_FC",
							label: "MFI_FFI_FC",
							type:  "TextField"
						},{
							field: "PPN",
							label: "PPN",
							type:  "TextField"
						},{
							field: "ABCD_T",
							label: "ABCD_T",
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
							url: uServiceUrl + "/ui_pn_class.xsjs"
						}
					}
				};
			config.create.columns = lenovo.control.commontable.Toolkit.splitChunck(2, config.insertRaw);
			config.create.url = "/CV_UI_PN_CLASS";
			//toolbar , auth
			config.create.visible=auth.createable;
			config.deleteable.visible=auth.deleteable;
			config.edit.visible=auth.editable;
			config.upload.visible=auth.uploadable;
			config.viewstatus.visible = auth.uploadable;
			config.download.visible = auth.exportable;
			config.download.roleName = auth.exportableRoleName;
			config.upload.roleName =  auth.uploadableRoleName;
			
			/******************************
			 * config with Odata Service
			 * Added by Chris Gao
			 * 2015-08-18
			 *****************************/
			//config.bindRowUrl = "INPUT_CYCLE_ITEM(in_cycle='CURRENT', in_partnumber='000000C25127,000000C25128')/Results";
			config.searchInputs = {
				hasInputPara: true,
				urlId : "/INPUT_PNCLASS",
				urlInputParas:[{item: "IN_MFI_FFI_FC_IND", value:"",bindFilterPath:"MFI_FFI_FC_IND"},
    			               {item: "IN_MFI_FFI_FC", value:"",bindFilterPath:"MFI_FFI_FC"},
    			               {item: "IN_PPN", value:"",bindFilterPath:"PPN"},
    			               {item: "IN_ABCD_T", value:"",bindFilterPath:"ABCD_T"},
    			               {item: "IN_TYPE", value: fixTypeConfig, bindFilterPath:"TYPE"}]
			}; 
			
			
		},
		deleteAll: function(table){
			sap.ui.commons.MessageBox.confirm("Do you want to delete all items?", function(result){
				if(result){
					var service = new lenovo.service.EBGDF();
					var logicServiceUrl = service.getebgdfLogic();
					var table_name = "RPT_PN_CLASS";
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