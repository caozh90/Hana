/************************************
* Created by chenwh at 2015-8-12
* Version 1.0 2015-08-12
* Version 1.0
************************************/
//require what you need
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
jQuery.sap.require("lenovo.control.Validation");

sap.ui.jsview("lenovo.view.cfe.controlPoint.forecastcostpublish",{
	 
	 
	/******Copy_Change_End*******/	
		getControllerName: function() {

		},
		execute: function(filterPanel){
			var that = this;
			var process_name = "FORECAST_COST";
			var cycle = that.cyclePanel.getItems();
			var obj = {
				"process_name": process_name,
				"product_group":'EBG',
				"cycle"	: cycle[1].getValue()
			};
			$.ajax({
				url: this.logicServiceUrl + "/ui_forecastcost_calculation.xsjs",
				type:"GET",
				data: obj,
				//datatype: "json",
				contentType: "text",
				success: function(data){
					var resultMsg = "";
					if(data != "SUCCESSFUL")
					{
						resultMsg = data;
						lenovo.control.commontable.Toolkit.showErrorMsg(resultMsg, "ERROR", "Execute");
					}
					else
					{
						resultMsg = "Successfully execute";
						lenovo.control.commontable.Toolkit.showErrorMsg(resultMsg, "SUCCESS", "Execute");
					}
				},
				error: function(data){

					data = data && data.responseText;
					if(!(typeof data === "string")) {
						data = JSON.stringify(data);
					}
					lenovo.control.commontable.Toolkit.showErrorMsg(data, "ERROR", "Execute");
				}
			});
		},
		publish: function(filterPanel){
			var that = this;
			var process_name_1 = "CFE_WBMTM_TO_ECC";
			var process_name_2 = "CFE_WBVAR_TO_ECC";
			var process_name_3 = "CFE_WBVAR_DFLT_TO_ECC";
			var process_name_4 = "CFE_TO_VENDAVO";
			var process_name_5 = "CFE_TO_PRNS";
			
			//EMEA PROESS_NAME
			var process_name_7 = "EMEA_CFE_TO_LBP_MTM";
			var process_name_8 = "EMEA_CFE_TO_PPT_XCTO";
			var process_name_9 = "EMEA_CFE_TO_PPT_XDEFAULT";
			var process_name_10 = "EMEA_CFE_TO_PPT_XMTM";
			var process_name_11 = "EMEA_CFE_TO_PSAT_CTO";
			var process_name_13 = "EMEA_CFE_TO_PSAT_EXCHANGE_RATE";
			var process_name_14 = "EMEA_CFE_TO_PSAT_MTM";
			var process_name_15 = "EMEA_CFE_TO_LBP_CTO";
			var process_name_16 = "EMEA_CFE_TO_BW_BMC";
			//AP LA PROCESS_NAME
			var process_name_17 = "AP_CFE_TO_LBP_CTO";
			var process_name_18 = "AP_CFE_TO_LBP_MTM";
			var process_name_19 = "LA_CFE_TO_LBP_CTO";
			var process_name_20 = "LA_CFE_TO_LBP_MTM";
			var process_name_21 = "CFE_CTO_TO_BW";		// added by caozh4 20161202 for SR305190
			/************************************
			 * Modified by Chris Gao 2015-09-17
			 ************************************/
			var process_array = [process_name_1,process_name_2,process_name_3,process_name_4,
			                     process_name_5,process_name_7,process_name_8,process_name_9,
			                     process_name_10,process_name_11,process_name_13,process_name_14,
			                     process_name_15,process_name_16,process_name_17,process_name_18,
			                     process_name_19,process_name_20,process_name_21];
			var obj = {"process_name": JSON.stringify(process_array)};
			
			
			$.ajax({
				url: this.logicServiceUrl + "/ui_forecastcost_publish.xsjs",
				type: "get",
				contentType: "text",
				data: obj,
				success: function(data){
					
					if(data.split("SUCCESSFUL").length < 6)
					{
						
						lenovo.control.commontable.Toolkit.showErrorMsg(data, "ERROR", "Execute");
					}
					else
					{
						
						lenovo.control.commontable.Toolkit.showErrorMsg(data, "SUCCESS", "Execute");
					}
				},
				error: function(data){

					data = data && data.responseText;
					if(!(typeof data === "string")) {
						data = JSON.stringify(data);
					}
					lenovo.control.commontable.Toolkit.showErrorMsg(data, "ERROR", "Execute");
				}
			});
			/************************************
			 * End by Chris Gao 2015-09-17
			 ************************************/
		},
		//Create Page Content including all the UI items
		createContent: function(){
			
			//declare app
			var app = new sap.m.App();
			//declare service url
			var service = new lenovo.service.CFE();
			var oServiceUrl = service.getEBGCfe();        //model service url
			var uServiceUrl = service.getEBGCfeUpload();  //upload service url
			var logicServiceUrl = service.getEBGCfeLogic();
			this.logicServiceUrl = logicServiceUrl;
			//declare model 
			var oModel = new sap.ui.model.odata.ODataModel(oServiceUrl, true);
			var oModel1 = new sap.ui.model.odata.ODataModel(oServiceUrl, true);
			/*********************************************************
			 * Added by Chris Gao - 2015-11-03
			 * to close the default count url called by table model
			 * default count model = "Both"
			 * because of the long waiting time of loading
			 *******************************************************/
//			oModel.setDefaultCountMode("None");
//			oModel1.setDefaultCountMode("None");
			/********************************************************
			 * End by Chris Gao
			 *******************************************************/
			//declare authorization
			/******Copy_Change_Start*******/
			var auth = lenovo.control.commontable.Table.getViewAuth("forecastcostpublish");
			/******Copy_Change_End*******/

			//declare tab strip
			var oTabStrip =  new sap.ui.commons.TabStrip("tabResult");
			
			//generate UI
			var config_MTM = lenovo.control.commontable.Table.getDefaultTableConfig(oModel); //declare ui_view configuration
			var config_CTO =  lenovo.control.commontable.Table.getDefaultTableConfig(oModel1);
			this.setConfig_MTM(config_MTM, oServiceUrl, uServiceUrl,auth, "MTM");   //call private function -- ui_view configuration
			this.setConfig_CTO(config_CTO, oServiceUrl, uServiceUrl,auth, "CTO");
			
			/******Copy_Change_Start*******/
			var header = lenovo.control.commontable.Table.createHeader("Control Point", "Forecast Cost Publish");
			/******Copy_Change_End*******/
			//set data connection
			/******Copy_Change_Start*******/
			config_MTM.bindRowUrl = "/FORECAST_COST_PUBLISH_MTM";
			config_CTO.bindRowUrl = "/FORECAST_COST_PUBLISH_CTO";
			/******Copy_Change_End*******/
			var table_MTM = lenovo.control.commontable.Table.createTable(config_MTM);
			var table_CTO = lenovo.control.commontable.Table.createTable(config_CTO);
			
			//added by Chris Gao 2015-08-23
			this.table_MTM = table_MTM;
			this.table_CTO = table_CTO;
			
			//table.setBusy(true);
			table_MTM.setModel(oModel);
			table_CTO.setModel(oModel1);
			
			oModel.attachRequestCompleted(function(){
				table_MTM.setBusy(false);
				table_CTO.setBusy(false);
			});
			
			oModel1.attachRequestCompleted(function(){
				table_MTM.setBusy(false);
				table_CTO.setBusy(false);
			});
			
			//filter panel
			var filterPanel_MTM = lenovo.control.commontable.Table.createFilter(config_MTM, table_MTM);
			var filterPanel_CTO = lenovo.control.commontable.Table.createFilter(config_CTO, table_CTO);
			
			/*// SET THE VALUE OF CYCLE IN filter of MTM /CTO
			var oform_MTM = filterPanel_MTM.getContent()[0];
			var cycle_MTM = lenovo.control.commontable.Toolkit.getFormElementByLabel(oform_MTM,'CYCLE')[0];
			cycle_MTM.setEditable(false);
			$.ajax({
				url: oServiceUrl+"/FORECAST_COST_PUBLISH_SEARCH_MTM_DDL?$filter=ITEM_TYPE eq 'CYCLE'&$select=ITEM_VALUE&$format=json",//oServiceUrl+"/INPUT_ABCD(ABCD='" + selectedKey + "')/Results?$format=json",
				type: "GET",
				dataType: "json", 
				async: false,
				success: function(data){
					if(data.d.results.length > 0)							
						cycle_MTM.setValue(data.d.results[0].ITEM_VALUE);
				}		
			});
			var oform_CTO = filterPanel_CTO.getContent()[0];
			var cycle_CTO = lenovo.control.commontable.Toolkit.getFormElementByLabel(oform_CTO,'CYCLE')[0];
			cycle_CTO.setEditable(false);
			$.ajax({
				url: oServiceUrl+"/FORECAST_COST_PUBLISH_SEARCH_CTO_DDL?$filter=ITEM_TYPE eq 'CYCLE'&$select=ITEM_VALUE&$format=json",//oServiceUrl+"/INPUT_ABCD(ABCD='" + selectedKey + "')/Results?$format=json",
				type: "GET",
				dataType: "json", 
				async: false,
				success: function(data){
					if(data.d.results.length > 0)							
						cycle_CTO.setValue(data.d.results[0].ITEM_VALUE);
				}		
			});*/
			//tool bar		
			/*var oEditDeleteUploadDownload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table, app);
			var oEditDeleteUploadDownload_sub = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table_sub, app);
			*/
			
			//var oForm = filterPanel.getContent()[0];
			/******Copy_Change_Start*******/

			var oVLayout1 = new sap.ui.layout.VerticalLayout ("tablayout1", {
				width: "100%",
				content: [filterPanel_MTM, table_MTM]
			});
			
			var oVLayout2 = new sap.ui.layout.VerticalLayout ("tablayout2", {
				width: "100%",
				content: [filterPanel_CTO,table_CTO]
			});
			
			//add tab strip
			var oTab1 = new sap.ui.commons.Tab("tab1");
			oTab1.setTooltip("MTM");
			oTab1.setTitle(new sap.ui.core.Title("MTM",{text:" MTM",icon:"sap-icon://open-folder"}));
			oTab1.addContent(oVLayout1);
			
			var oTab2 = new sap.ui.commons.Tab("tab2");
			oTab2.setTooltip("CTO");
			oTab2.setTitle(new sap.ui.core.Title("CTO",{text:" CTO",icon:"sap-icon://folder"}));
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
			var that = this;
			var oExecuteBtn = new sap.ui.commons.Button({
				lite: true,
				icon: "sap-icon://begin",
				tooltip: "Execute",
				press : function(){
					var oLabel = new sap.ui.commons.Label({
						text: "Do you want to Execute?",
						width: "350px",
					});
					sap.ui.commons.MessageBox.confirm(oLabel, function(result){
						if(result) {
							//that.busydialog.open();
							that.execute();
							//that.busydialog.close();
							that.table.setBusy(false);
						}
					}, 	"Confirm");
				} 
			});
			var oPublishBtn = new sap.ui.commons.Button({
				lite: true,
				icon: "sap-icon://action",
				tooltip: "Publish",
				press : function(){
					var oLabel = new sap.ui.commons.Label({
						text: "Do you want to Publish?",
						width: "350px",
					});
					sap.ui.commons.MessageBox.confirm(oLabel, function(result){
						if(result) {
							
							that.publish();
						}
					}, 	"Confirm");
				} 
			});
			
			var nextPanel = new sap.ui.commons.Panel({
				title: {
					text: "Execute & Publish"
				},
				showCollapseIcon: false 
			}).addStyleClass("filter-panel ondemandRefresh-dslayout");
			
			nextPanel.addButton(oPublishBtn);
			//nextPanel.addButton(oExecuteBtn);
			/*if(auth.executable )
			{
				var buttons = nextPanel.getButtons();
				for(var i = 0; i < buttons.length; i++) 
				{
					if (buttons[i].getTooltip() == 'Execute')
						{
							buttons[i].setVisible(true);
						};
				}
			
			}
		else{
			var buttons = nextPanel.getButtons();
			for(var i = 0; i < buttons.length; i++) 
			{
				if (buttons[i].getTooltip() == 'Execute')
					{
						buttons[i].setVisible(false);
					};
			}
		};*/
		if(auth.publishable )
		{
			var buttons = nextPanel.getButtons();
			for(var i = 0; i < buttons.length; i++) 
			{
				if (buttons[i].getTooltip() == 'Publish')
					{
						buttons[i].setVisible(true);
					};
			}
		
		}
	else{
		var buttons = nextPanel.getButtons();
		for(var i = 0; i < buttons.length; i++) 
		{
			if (buttons[i].getTooltip() == 'Publish')
				{
					buttons[i].setVisible(false);
				};
		}
	};
			/**/
			var cyclelabel = new sap.ui.commons.Label({
				text:'CYCLE:'
			}).addStyleClass("filter-panel ondemandRefresh-dslayout-nocolor");
			var cycle = new sap.ui.commons.TextField({
				editable:false
				
			});
			
			$.ajax({
				url: oServiceUrl+"/CV_EXECUTE_PUBLISH_CYCLE?$format=json",
				type: "GET",
				dataType: "json", 
				async: false,
				success: function(data){
					if(data.d.results.length > 0)							
						cycle.setValue(data.d.results[0].CYCLE);
				}		
			});
			
			var statuslabel = new sap.ui.commons.Label({
				text:'Publish Status:'
			}).addStyleClass("filter-panel ondemandRefresh-dslayout-nocolor");
			var status = new sap.ui.commons.TextField({
				editable:false
				
			});
			
			$.ajax({
				url:oServiceUrl+ "/CV_EXECUTE_PUBLISH_STATUS?$format=json",
				type: "GET",
				dataType: "json", 
				async: false,
				success: function(data){
					if(data.d.results.length > 0)							
						status.setValue(data.d.results[0].STATUS);
				}		
			});
			
			
			var cyclePanel = new sap.ui.commons.Toolbar({
				title: {
				
				},
				showCollapseIcon: false 
			}).addStyleClass("filter-panel ondemandRefresh-dslayout-nocolor");
			cyclePanel.addItem(cyclelabel);
			cyclePanel.addItem(cycle);
			cyclePanel.addItem(statuslabel);
			cyclePanel.addItem(status);
			
			this.cyclePanel = cyclePanel;
			//generate page into app
			var page = new sap.m.Page({
		      	showHeader: false,
		      	content :[header,nextPanel,cyclePanel, oTabStrip] //header,nextPanel,cyclePanel, oTabStrip           
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
setConfig_MTM: function(config, oServiceUrl, uServiceUrl, auth, fixTypeConfig) {
					//table columns setting
			/******Copy_Change_Start*******/
			config.columns =[{
				label: "Cycle", 
				field: "CYCLE",
				type: "TextField",
				width:"60px"
			},{
				label: "MTM", 
				field: "MTM_NO",
				type: "TextField",
				width:"100px"
			}, {
				label: "Sales Org",
				field: "SALES_ORG",
				type: "TextField",
				width:"100px"
			},{
				label: "Currency",
				field: "CURRENCY_NAME",
				type: "TextField",
				width:"80px"
			}, {
				label: "From Date",
				field: "FROM_DATE",
				type: "TextField"
			}, {
				label: "To Date",
				field: "TO_DATE",
				type: "TextField"
			}, {
				label: "M1",
				field: "M1",
				type: "TextField",
				width:"50px"
			}, {
				label: "Last Modified By",
				field: "SYS_LAST_MODIFIED_BY",
				type: "TextField"
			}, {
				label: "Last Modified Date",
				field: "SYS_LAST_MODIFIED_DATE",
				type: "TextField"
			}];
			/******Copy_Change_End*******/
			
			//updated by Chris Gao
			var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
			var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(3);
			var rowHeight = 30;
			
			config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight);
			
			
			/******Copy_Change_Start*******/
			//filter
			config.filtersRaw =  [
			{
				field: "MTM_NO",
				label: "MTM",
				type: "DropdownTable",
				dropdowntable: {
					defaultFilterOp: "EQ",
					url: oServiceUrl,
					bindRowUrl: "/CV_MTM",
					selectionMode: sap.ui.table.SelectionMode.Single,
					field: "MTM_NO",
					columns: [{
						label: "MTM",
						field: "MTM_NO",
						type: "TextField"
					}],
					filters: [[{
						field: "MTM_NO",
						label: "MTM",
						type: "MultiTextField",
						multitextfield: {
//							defaultFilterOp: "EQ"
						}
					}]]
				}
			
			}, 
			{
				field: "SALES_ORG",
				label: "Sales Org",
				type: "DropdownBox",
				dropdownbox: {
					odata: {
						defaultSelectAll: true,
						url: oServiceUrl+"/FORECAST_COST_PUBLISH_SEARCH_MTM_DDL?$filter=ITEM_TYPE eq 'Sales'&$select=ITEM_VALUE&$format=json",
						bindTextField: "ITEM_VALUE",
						bindKeyField: "ITEM_VALUE"
					}
				}
			},{
				field: "CYCLE",
				label: "CYCLE",
				type: "DropdownBox",
				dropdownbox: {
					odata: {
						defaultSelectAll: true,
						url: oServiceUrl+"/FORECAST_COST_PUBLISH_SEARCH_MTM_DDL?$filter=ITEM_TYPE eq 'CYCLE'&$select=ITEM_VALUE&$orderby=ITEM_VALUE desc&$format=json",
						bindTextField: "ITEM_VALUE",
						bindKeyField: "ITEM_VALUE"
					}
				}
				
			},{
				field: "CURRENCY_NAME",
				label: "Currency",
				type: "DropdownBox",
				dropdownbox: {
					odata: {
						defaultSelectAll: true,
						url: oServiceUrl+"/FORECAST_COST_PUBLISH_SEARCH_MTM_DDL?$filter=ITEM_TYPE eq 'Currency'&$select=ITEM_VALUE&$format=json",
						bindTextField: "ITEM_VALUE",
						bindKeyField: "ITEM_VALUE"
					}
				}
			}];
			/******Copy_Change_End*******/
			
			config.filters = lenovo.control.commontable.Toolkit.splitChunck(4, config.filtersRaw);

			/******Copy_Change_Start*******/
			//download  
			//config.download.url = "/cdp/common/services/getFileWithTableInputParas.xsjs";
			//config.download.tablewithinputpara = '"_SYS_BIC"."cdp.ebgcfe.models.ui_forecast_cost_publish/CV_UI_FORECAST_COST_PUBLISH_MTM"';
			/*config.download.urlInputParas = [{item: "IN_MFI_FFI_FC_IND", value:"",bindFilterPath:"MFI_FFI_FC_IND"},
			      			               {item: "IN_MFI_FFI_FC", value:"",bindFilterPath:"MFI_FFI_FC"},
			    			               {item: "IN_PPN", value:"",bindFilterPath:"PPN"},
			    			               {item: "IN_ABCD_T", value:"",bindFilterPath:"ABCD_T"},
			    			               {item: "IN_TYPE", value: fixTypeConfig, bindFilterPath:"TYPE"}];*/
			config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.ui_forecast_cost_publish/CV_UI_FORECAST_COST_PUBLISH_MTM_SCRIPT"';
			config.download.columns=["CYCLE","MTM_NO","SALES_ORG","CURRENCY_NAME","FROM_DATE","TO_DATE",
			                         "M1","SYS_LAST_MODIFIED_BY","SYS_LAST_MODIFIED_DATE"];
			config.download.filename= "UI_FORECAST_COST_PUBLISH_MTM" ;
			/******Copy_Change_End*******/

			//status view
			config.viewstatus = {};
			//config.create.columns = lenovo.control.commontable.Toolkit.splitChunck(2, config.insertRaw);
			//config.create.url = "/CV_UI_PN_CLASS";
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
			
			
		},
setConfig_CTO: function(config, oServiceUrl, uServiceUrl, auth, fixTypeConfig) {
			//table columns setting
	/******Copy_Change_Start*******/
	config.columns =[{
		field: "CYCLE",
		label: "Cycle",
		type: "TextField",
		width:"60px"
	}, {
		field: "SALES_ORG",
		label: "Sales Org",
		type: "TextField",
		width:"90px"
	}, {
		field: "VARIANT",
		label: "Variant",
		type: "TextField",
		width:"80px"
	},{
		field: "PRODUCTHIER_1",
		label: "PH1",
		type: "TextField",
		width:"50px"
	}, {
		field: "PRODUCTHIER_2",
		label: "PH2",
		type: "TextField",
		width:"50px"
	},{
		field: "PRODUCTHIER_3",
		label: "PH3",
		type: "TextField",
		width:"50px"
	}, {
		field: "PRODUCTHIER_4",
		label: "PH4",
		type: "TextField",
		width:"50px"
	}, {
		field: "CURRENCY_NAME",
		label: "Currency",
		type: "TextField",
		width:"80px"
	}, {
		field: "FROM_DATE",
		label: "From Date",
		type: "TextField"
	}, {
		field: "TO_DATE",
		label: "To Date",
		type: "TextField"
	}, {
		label: "M1",
		field: "M1",
		type: "TextField",
		width:"50px"
	}, {
		label: "Last Modified By",
		field: "SYS_LAST_MODIFIED_BY",
		type: "TextField"
	}, {
		label: "Last Modified Date",
		field: "SYS_LAST_MODIFIED_DATE",
		type: "TextField"
		
	}];
	/******Copy_Change_End*******/
	
	//updated by Chris Gao
	var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
	var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(4);
	var rowHeight = 30;
	
	config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight);
	
	
	/******Copy_Change_Start*******/
	//filter
	config.filtersRaw = [{
		field: "VARIANT",
		label: "Variant",
		type: "DropdownTable",
		dropdowntable: {
			defaultFilterOp: "EQ",
			url: oServiceUrl,
			bindRowUrl: "/CV_VARIANT",
			selectionMode: sap.ui.table.SelectionMode.Single,
			field: "VARIANT",
			columns: [{
				label: "Variant",
				field: "VARIANT",
				type: "TextField"
			}],
			filters: [[{
				label: "Variant",
				field: "VARIANT",
				type: "MultiTextField",
				multitextfield: {
//					defaultFilterOp: "EQ"
				}
			}]]
		}
	
	}, {
		field: "PRODUCTHIER_1",
		label: "PH1",
		type:"TextField"
	/*	type: "DropdownBox",
		dropdownbox: {
				odata: {
					defaultSelectAll: true,
					url: oServiceUrl+"/FORECAST_COST_PUBLISH_SEARCH_CTO_DDL?$filter=ITEM_TYPE eq 'PH_1'&$select=ITEM_VALUE&$format=json",
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE"
				}
			}*/
	}, {
		field: "SALES_ORG",
		label: "Sales Org",
		type: "DropdownBox",
		dropdownbox: {
			odata: {
				defaultSelectAll: true,
				url: oServiceUrl+"/FORECAST_COST_PUBLISH_SEARCH_CTO_DDL?$filter=ITEM_TYPE eq 'Sales'&$select=ITEM_VALUE&$format=json",
				bindTextField: "ITEM_VALUE",
				bindKeyField: "ITEM_VALUE"
			}
		}
	},
	{
		field: "PRODUCTHIER_2",
		label: "PH2",
		type:"TextField"
	/*	type: "DropdownBox",
		dropdownbox: {
			odata: {
				defaultSelectAll: true,
				url: oServiceUrl+"/FORECAST_COST_PUBLISH_SEARCH_CTO_DDL?$filter=ITEM_TYPE eq 'PH_2'&$select=ITEM_VALUE&$format=json",
				bindTextField: "ITEM_VALUE",
				bindKeyField: "ITEM_VALUE"
			}
		}*/
	},
	{
		field: "CYCLE",
		label: "CYCLE",
		type: "DropdownBox",
		dropdownbox: {
			odata: {
				defaultSelectAll: true,
				url: oServiceUrl+"/FORECAST_COST_PUBLISH_SEARCH_CTO_DDL?$filter=ITEM_TYPE eq 'CYCLE'&$orderby=ITEM_VALUE desc&$select=ITEM_VALUE&$format=json",
				bindTextField: "ITEM_VALUE",
				bindKeyField: "ITEM_VALUE"
			}
		}
	
	},{
		field: "PRODUCTHIER_3",
		label: "PH3",
		type:"TextField"
		/*type: "DropdownBox",
		dropdownbox: {
			odata: {
				defaultSelectAll: true,
				url: oServiceUrl+"/FORECAST_COST_PUBLISH_SEARCH_CTO_DDL?$filter=ITEM_TYPE eq 'PH_3'&$select=ITEM_VALUE&$format=json",
				bindTextField: "ITEM_VALUE",
				bindKeyField: "ITEM_VALUE"
			}
		}*/
	},{
		field: "CURRENCY_NAME",
		label: "Currency",
		type: "DropdownBox",
		dropdownbox: {
			odata: {
				defaultSelectAll: true,
				url:oServiceUrl+ "/FORECAST_COST_PUBLISH_SEARCH_CTO_DDL?$filter=ITEM_TYPE eq 'Currency'&$select=ITEM_VALUE&$format=json",
				bindTextField: "ITEM_VALUE",
				bindKeyField: "ITEM_VALUE"
			}
		}
	},{
		field: "PRODUCTHIER_4",
		label: "PH4",
		type:"TextField"
		/*type: "DropdownBox",
		dropdownbox: {
			odata: {
				defaultSelectAll: true,
				url: oServiceUrl+"/FORECAST_COST_PUBLISH_SEARCH_CTO_DDL?$filter=ITEM_TYPE eq 'PH_4'&$select=ITEM_VALUE&$format=json",
				bindTextField: "ITEM_VALUE",
				bindKeyField: "ITEM_VALUE"
			}
		}*/
	}];
	/******Copy_Change_End*******/
	
	config.filters = lenovo.control.commontable.Toolkit.splitChunck(4, config.filtersRaw);

	/******Copy_Change_Start*******/
	//download  
	//config.download.url = "/cdp/common/services/getFileWithTableInputParas.xsjs";
	//config.download.tablewithinputpara = '"_SYS_BIC"."cdp.ebgcfe.models.ui_forecast_cost_publish/CV_UI_FORECAST_COST_PUBLISH_MTM"';
	/*config.download.urlInputParas = [{item: "IN_MFI_FFI_FC_IND", value:"",bindFilterPath:"MFI_FFI_FC_IND"},
	      			               {item: "IN_MFI_FFI_FC", value:"",bindFilterPath:"MFI_FFI_FC"},
	    			               {item: "IN_PPN", value:"",bindFilterPath:"PPN"},
	    			               {item: "IN_ABCD_T", value:"",bindFilterPath:"ABCD_T"},
	    			               {item: "IN_TYPE", value: fixTypeConfig, bindFilterPath:"TYPE"}];*/
	config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.ui_forecast_cost_publish/CV_UI_FORECAST_COST_PUBLISH_CTO_SCRIPT"';
	config.download.columns=["CYCLE","SALES_ORG","VARIANT","PRODUCTHIER_1","PRODUCTHIER_2","PRODUCTHIER_3","PRODUCTHIER_4",
	                         "CURRENCY_NAME","FROM_DATE","TO_DATE","M1","SYS_LAST_MODIFIED_BY","SYS_LAST_MODIFIED_DATE"];
	config.download.filename= "UI_FORECAST_COST_PUBLISH_CTO" ;
	/******Copy_Change_End*******/

	//status view
	config.viewstatus = {};
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
	
	
}	
	

});