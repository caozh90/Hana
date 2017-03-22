/************************************
* Created by Liss at 2015-10-21
* Version 1.0 2015-10-21
* Version 1.0
************************************/
//require what you need
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
jQuery.sap.require("lenovo.control.Validation");

sap.ui.jsview("lenovo.view.cfe.report.rptSalesOffice",{
	 
	 
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
			var logicServiceUrl = service.getEBGCfeLogic();
			this.logicServiceUrl = logicServiceUrl;
			//declare model 
			var oModel = new sap.ui.model.odata.ODataModel(oServiceUrl, true);
			var oModel1 = new sap.ui.model.odata.ODataModel(oServiceUrl, true);
			var oModel2 = new sap.ui.model.odata.ODataModel(oServiceUrl, true);
			//declare authorization
			/******Copy_Change_Start*******/
			var auth = lenovo.control.commontable.Table.getViewAuth("rptSalesOffice");
			/******Copy_Change_End*******/

			//declare tab strip
			var oTabStrip =  new sap.ui.commons.TabStrip();
			
			//generate UI
			var config_MTM = lenovo.control.commontable.Table.getDefaultTableConfig(oModel); //declare ui_view configuration
			var config_CTO =  lenovo.control.commontable.Table.getDefaultTableConfig(oModel1);
			var config_FCST =  lenovo.control.commontable.Table.getDefaultTableConfig(oModel2);
			
			this.setConfig_MTM(config_MTM, oServiceUrl, uServiceUrl,auth, "MTM");   //call private function -- ui_view configuration
			this.setConfig_CTO(config_CTO, oServiceUrl, uServiceUrl,auth, "CTO");
			this.setConfig_FCST(config_FCST, oServiceUrl, uServiceUrl,auth, "FCST");
			
			/******Copy_Change_Start*******/
			var header = lenovo.control.commontable.Table.createHeader("Report", "Sales office Report");
			/******Copy_Change_End*******/
			//set data connection
			/******Copy_Change_Start*******/
			config_MTM.bindRowUrl = "/SALES_OFFICE_MTM";
			config_CTO.bindRowUrl = "/SALES_OFFICE_CTO";
			config_FCST.bindRowUrl = "/SALES_OFFICE_CTO_DEFAULT_FCST";
			
			/******Copy_Change_End*******/
			var table_MTM = lenovo.control.commontable.Table.createTable(config_MTM);
			var table_CTO = lenovo.control.commontable.Table.createTable(config_CTO);
			var table_FCST = lenovo.control.commontable.Table.createTable(config_FCST);
			
			//added by Chris Gao 2015-08-23
			this.table_MTM = table_MTM;
			this.table_CTO = table_CTO;
			this.table_FCST = table_FCST;
			
			//table.setBusy(true);
			table_MTM.setModel(oModel);
			table_CTO.setModel(oModel1);
			table_FCST.setModel(oModel2);
			
			oModel.attachRequestCompleted(function(){
				table_MTM.setBusy(false);
				table_CTO.setBusy(false);
				table_FCST.setBusy(false);
			});
			
			oModel1.attachRequestCompleted(function(){
				table_MTM.setBusy(false);
				table_CTO.setBusy(false);
				table_FCST.setBusy(false);
			});
			oModel2.attachRequestCompleted(function(){
				table_MTM.setBusy(false);
				table_CTO.setBusy(false);
				table_FCST.setBusy(false);
			});
			
			//filter panel
			var filterPanel_MTM = lenovo.control.commontable.Table.createFilter(config_MTM, table_MTM);
			var filterPanel_CTO = lenovo.control.commontable.Table.createFilter(config_CTO, table_CTO);
			var filterPanel_FCST = lenovo.control.commontable.Table.createFilter(config_FCST, table_FCST);
			
			/******Copy_Change_Start*******/

			var oVLayout1 = new sap.ui.layout.VerticalLayout ("tablayoutSalesOffice1", {
				width: "100%",
				content: [filterPanel_MTM, table_MTM]
			});
			
			var oVLayout2 = new sap.ui.layout.VerticalLayout ("tablayoutSalesOffice2", {
				width: "100%",
				content: [filterPanel_CTO,table_CTO]
			});
			var oVLayout3 = new sap.ui.layout.VerticalLayout ("tablayoutSalesOffice3", {
				width: "100%",
				content: [filterPanel_FCST,table_FCST]
			});

			//add tab strip
			var oTab1 = new sap.ui.commons.Tab("tabSalesOffice1");
			oTab1.setTooltip("MTM");
			oTab1.setTitle(new sap.ui.core.Title("MTMSalesOffice",{text:" MTM",icon:"sap-icon://open-folder"}));
			oTab1.addContent(oVLayout1);
			
			var oTab2 = new sap.ui.commons.Tab("tabSalesOffice2");
			oTab2.setTooltip("CTO");
			oTab2.setTitle(new sap.ui.core.Title("CTOSalesOffice",{text:" CTO",icon:"sap-icon://folder"}));
			oTab2.addContent(oVLayout2);
			
			var oTab3 = new sap.ui.commons.Tab("tabSalesOffice3");
			oTab3.setTooltip("DEFAULT");
			oTab3.setTitle(new sap.ui.core.Title("DEFAULTSalesOffice",{text:" DEFAULT",icon:"sap-icon://folder"}));
			oTab3.addContent(oVLayout3);
			
			//redefine the tab width
			oTabStrip.addStyleClass("width3TabStrip");//added by Chris Gao 2015-10-24
			
			oTabStrip.addTab(oTab1);
			oTabStrip.addTab(oTab2);
			oTabStrip.addTab(oTab3);
			
			//oTabStrip.createTab("MTM", oVLayout1);
			//oTabStrip.createTab("CTO", oVLayout2);	
			//oTabStrip.createTab("FCST", oVLayout3);


			
			//change tab icon state
			oTabStrip.attachSelect(function(oEvent){
				if(oTabStrip.getSelectedIndex() == 0)
				{
					oTab1.getTitle().setProperty("icon","sap-icon://open-folder");
					oTab2.getTitle().setProperty("icon","sap-icon://folder");
					oTab3.getTitle().setProperty("icon","sap-icon://folder");
				}
				else if(oTabStrip.getSelectedIndex() == 1) 
				{
					oTab1.getTitle().setProperty("icon","sap-icon://folder");
					oTab2.getTitle().setProperty("icon","sap-icon://open-folder");
					oTab3.getTitle().setProperty("icon","sap-icon://folder");
				}
				else
				{
					oTab1.getTitle().setProperty("icon","sap-icon://folder");
					oTab2.getTitle().setProperty("icon","sap-icon://folder");
					oTab3.getTitle().setProperty("icon","sap-icon://open-folder");
				}				
			});
			var that = this;
			
		
			//generate page into app
			var page = new sap.m.Page({
		      	showHeader: false,
		      	content :[header, oTabStrip] //header,nextPanel,cyclePanel, oTabStrip           
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
				width:"100px"
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
			}, {
				label: "Sales Office",
				field: "SALES_OFFICE",
				type: "TextField",
				width:"100px"
			}, {
				label: "Cost Type",
				field: "COST_TYPE",
				type: "TextField",
				width:"100px"
			},{
				label: "Currency",
				field: "CURRENCY_NAME",
				type: "TextField",
				width:"100px"
			},{
				label: "M1",
				field: "M1",
				type: "TextField",
				width:"100px"
			}, {
				label: "M2",
				field: "M2",
				type: "TextField",
				width:"100px"
			}, {
				label: "M3",
				field: "M3",
				type: "TextField",
				width:"100px"
			}, {
				label: "M4",
				field: "M4",
				type: "TextField",
				width:"100px"
			}, {
				label: "M5",
				field: "M5",
				type: "TextField",
				width:"100px"
			}, {
				label: "M6",
				field: "M6",
				type: "TextField",
				width:"100px"
			}, {
				label: "M7",
				field: "M7",
				type: "TextField",
				width:"100px"
			}, {
				label: "M8",
				field: "M8",
				type: "TextField",
				width:"100px"
			}, {
				label: "M9",
				field: "M9",
				type: "TextField",
				width:"100px"
			}, {
				label: "M10",
				field: "M10",
				type: "TextField",
				width:"100px"
			}, {
				label: "M11",
				field: "M11",
				type: "TextField",
				width:"100px"
			}, {
				label: "M12",
				field: "M12",
				type: "TextField",
				width:"100px"
			}, {
				label: "Sys Created Date",
				field: "SYS_CREATED_DATE",
				type: "TextField",
				width:"160px",
				dateformat: "yyyy-mm-dd hh:mm:ss"
			}];
			/******Copy_Change_End*******/
			
			//updated by Chris Gao
			var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
			var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(2);//added by Chris Gao 2015-10-24
			var rowHeight = 30;
			
			config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight);
			
			
			/******Copy_Change_Start*******/
			//filter
			config.filtersRaw =  [
			{
				field: "CYCLE",
				label: "CYCLE",
				type: "DropdownBox",
				dropdownbox: {
					odata: {
						defaultSelectAll: true,
						url: oServiceUrl+"/SALES_OFFICE_SEARCH_MTM_DDL?$filter=ITEM_TYPE eq 'CYCLE'&$select=ITEM_VALUE&$format=json",
						bindTextField: "ITEM_VALUE",
						bindKeyField: "ITEM_VALUE"
					}
				}
				
			},{
				field: "SALES_OFFICE",
				label: "Sales Office",
				type: "DropdownBox",
				dropdownbox: {
					odata: {
						defaultSelectAll: true,
						url: oServiceUrl+"/SALES_OFFICE_SEARCH_MTM_DDL?$filter=ITEM_TYPE eq 'SalesOffice'&$select=ITEM_VALUE&$format=json",
						bindTextField: "ITEM_VALUE",
						bindKeyField: "ITEM_VALUE"
					}
				}
			},{
				field: "MTM_NO",
				label: "MTM",
				type: "DropdownTable",
				dropdowntable: {
					defaultFilterOp: "EQ",
					url: oServiceUrl,
					bindRowUrl: "/SALES_OFFICE_SEARCH_MTM_MTM_NO_DDL",
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
			
			},{
			
				field: "COST_TYPE",
				label: "Cost Type",
				type: "DropdownBox",
				dropdownbox: {
					odata: {
						defaultSelectAll: true,
						url: oServiceUrl+"/SALES_OFFICE_SEARCH_MTM_DDL?$filter=ITEM_TYPE eq 'COST_TYPE'&$select=ITEM_VALUE&$format=json",
						bindTextField: "ITEM_VALUE",
						bindKeyField: "ITEM_VALUE"
					}
				}
			},{
			
				field: "SALES_ORG",
				label: "Sales Org",
				type: "DropdownBox",
				dropdownbox: {
					odata: {
						defaultSelectAll: true,
						url: oServiceUrl+"/SALES_OFFICE_SEARCH_MTM_DDL?$filter=ITEM_TYPE eq 'Sales'&$select=ITEM_VALUE&$format=json",
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
						url: oServiceUrl+"/SALES_OFFICE_SEARCH_MTM_DDL?$filter=ITEM_TYPE eq 'Currency'&$select=ITEM_VALUE&$format=json",
						bindTextField: "ITEM_VALUE",
						bindKeyField: "ITEM_VALUE"
					}
				}
			}];
			/******Copy_Change_End*******/
			
			config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);

			/******Copy_Change_Start*******/
			
			config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.rpt_sales_office/CV_RPT_SALES_OFFICE_MTM"';
			config.download.columns=["CYCLE","MTM_NO","SALES_ORG","SALES_OFFICE","COST_TYPE","CURRENCY_NAME",
			                         "M1","M2","M3","M4","M5","M6","M7","M8","M9","M10","M11","M12","SYS_CREATED_DATE"];
			config.download.filename= "RPT_SALES_OFFICE_MTM" ;
			/******Copy_Change_End*******/

			//status view
			config.viewstatus = {};

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
setConfig_FCST: function(config, oServiceUrl, uServiceUrl, auth, fixTypeConfig) {
			//table columns setting
	/******Copy_Change_Start*******/
	config.columns =[{
		field: "VARIANT",
		label: "Variant",
		type: "TextField",
		width:"100px"
	},{
		field: "CURRENCY_NAME",
		label: "Currency",
		type: "TextField",
		width:"100px"
	}, {
		field: "PRICE_UNIT",
		label: "Price Unit",
		type: "TextField",
		width:"100px"
	}, {
		label: "M1",
		field: "M1",
		type: "TextField",
		width:"100px"
	}, {
		label: "M2",
		field: "M2",
		type: "TextField",
		width:"100px"
	}, {
		label: "M3",
		field: "M3",
		type: "TextField",
		width:"100px"
	}, {
		label: "M4",
		field: "M4",
		type: "TextField",
		width:"100px"
	}, {
		label: "M5",
		field: "M5",
		type: "TextField",
		width:"100px"
	}, {
		label: "M6",
		field: "M6",
		type: "TextField",
		width:"100px"
	}, {
		label: "M7",
		field: "M7",
		type: "TextField",
		width:"100px"
	}, {
		label: "M8",
		field: "M8",
		type: "TextField",
		width:"100px"
	}, {
		label: "M9",
		field: "M9",
		type: "TextField",
		width:"100px"
	}, {
		label: "M10",
		field: "M10",
		type: "TextField",
		width:"100px"
	}, {
		label: "M11",
		field: "M11",
		type: "TextField",
		width:"100px"
	}, {
		label: "M12",
		field: "M12",
		type: "TextField",
		width:"100px"
	}, {
		label: "Sys Created Date",
		field: "SYS_CREATED_DATE",
		type: "TextField",
		width:"160px",
		dateformat: "yyyy-mm-dd hh:mm:ss"
	}];
	/******Copy_Change_End*******/
	
	//updated by Chris Gao
	var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
	var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(1);//added by Chris Gao 2015-10-24
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
			bindRowUrl: "/SALES_OFFICE_SEARCH_CTO_DEFAULT_FCST_VARIANT_DDL",
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
	},{
		field: "CURRENCY_NAME",
		label: "Currency",
		type: "DropdownBox",
		dropdownbox: {
			odata: {
				defaultSelectAll: true,
				url: oServiceUrl+"/SALES_OFFICE_SEARCH_CTO_DDL?$filter=ITEM_TYPE eq 'Currency'&$select=ITEM_VALUE&$format=json",
				bindTextField: "ITEM_VALUE",
				bindKeyField: "ITEM_VALUE"
			}
		}
	}];
	/******Copy_Change_End*******/
	
	config.filters = lenovo.control.commontable.Toolkit.splitChunck(4, config.filtersRaw);

	/******Copy_Change_Start*******/
	//download  

	config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.rpt_sales_office/CV_RPT_SALES_OFFICE_CTO_DEFAULT_FCST"';
	config.download.columns=["VARIANT","CURRENCY_NAME","PRICE_UNIT","M1","M2","M3","M4","M5","M6","M7","M8","M9","M10","M11","M12","SYS_CREATED_DATE"];
	config.download.filename= "RPT_SALES_OFFICE_CTO_DEFAULT_FCST" ;
	/******Copy_Change_End*******/

	//status view
	config.viewstatus = {};

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
	},{
		field: "VARIANT",
		label: "Variant",
		type: "TextField",
		width:"80px"
	},{
		field: "PRODUCTHIER_1",
		label: "PH1",
		type: "TextField",
		width:"100px"
	}, {
		field: "PRODUCTHIER_2",
		label: "PH2",
		type: "TextField",
		width:"100px"
	},{
		field: "PRODUCTHIER_3",
		label: "PH3",
		type: "TextField",
		width:"100px"
	}, {
		field: "PRODUCTHIER_4",
		label: "PH4",
		type: "TextField",
		width:"100px"
	}, {
		field: "SALES_ORG",
		label: "Sales Org",
		type: "TextField",
		width:"90px"
	}, {
		label: "Sales Office",
		field: "SALES_OFFICE",
		type: "TextField",
		width:"100px"
	}, {
		label: "Cost Type",
		field: "COST_TYPE",
		type: "TextField",
		width:"100px"
	}, {
		field: "CURRENCY_NAME",
		label: "Currency",
		type: "TextField",
		width:"80px"
	}, {
		label: "M1",
		field: "M1",
		type: "TextField",
		width:"100px"
	}, {
		label: "M2",
		field: "M2",
		type: "TextField",
		width:"100px"
	}, {
		label: "M3",
		field: "M3",
		type: "TextField",
		width:"100px"
	}, {
		label: "M4",
		field: "M4",
		type: "TextField",
		width:"100px"
	}, {
		label: "M5",
		field: "M5",
		type: "TextField",
		width:"100px"
	}, {
		label: "M6",
		field: "M6",
		type: "TextField",
		width:"100px"
	}, {
		label: "M7",
		field: "M7",
		type: "TextField",
		width:"100px"
	}, {
		label: "M8",
		field: "M8",
		type: "TextField",
		width:"100px"
	}, {
		label: "M9",
		field: "M9",
		type: "TextField",
		width:"100px"
	}, {
		label: "M10",
		field: "M10",
		type: "TextField",
		width:"100px"
	}, {
		label: "M11",
		field: "M11",
		type: "TextField",
		width:"100px"
	}, {
		label: "M12",
		field: "M12",
		type: "TextField",
		width:"100px"
	}, {
		label: "Sys Created Date",
		field: "SYS_CREATED_DATE",
		type: "TextField",
		width:"160px",
		dateformat: "yyyy-mm-dd hh:mm:ss"
	}];
	/******Copy_Change_End*******/
	
	//updated by Chris Gao
	var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
	var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(3);//added by Chris Gao 2015-10-24
	var rowHeight = 30;
	
	config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight);
	
	
	/******Copy_Change_Start*******/
	//filter
	config.filtersRaw = [{
		field: "CYCLE",
		label: "CYCLE",
		type: "DropdownBox",
		dropdownbox: {
			odata: {
				defaultSelectAll: true,
				url: oServiceUrl+"/SALES_OFFICE_SEARCH_CTO_DDL?$filter=ITEM_TYPE eq 'CYCLE'&$select=ITEM_VALUE&$format=json",
				bindTextField: "ITEM_VALUE",
				bindKeyField: "ITEM_VALUE"
			}
		}
	
	},{
		field: "PRODUCTHIER_3",
		label: "PH3",
		type:"TextField"

	},{
		field: "SALES_OFFICE",
		label: "Sales Office",
		type: "DropdownBox",
		dropdownbox: {
			odata: {
				defaultSelectAll: true,
				url: oServiceUrl+"/SALES_OFFICE_SEARCH_CTO_DDL?$filter=ITEM_TYPE eq 'SalesOffice'&$select=ITEM_VALUE&$format=json",
				bindTextField: "ITEM_VALUE",
				bindKeyField: "ITEM_VALUE"
			}
		}
	},{
		field: "VARIANT",
		label: "Variant",
		type: "DropdownTable",
		dropdowntable: {
			defaultFilterOp: "EQ",
			url: oServiceUrl,
			bindRowUrl: "/SALES_OFFICE_SEARCH_CTO_VARIANT_DDL",
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
	
	},{
		field: "PRODUCTHIER_4",
		label: "PH4",
		type:"TextField"

	},{
		field: "CURRENCY_NAME",
		label: "Currency",
		type: "DropdownBox",
		dropdownbox: {
			odata: {
				defaultSelectAll: true,
				url: oServiceUrl+"/SALES_OFFICE_SEARCH_CTO_DDL?$filter=ITEM_TYPE eq 'Currency'&$select=ITEM_VALUE&$format=json",
				bindTextField: "ITEM_VALUE",
				bindKeyField: "ITEM_VALUE"
			}
		}
	},{
		field: "PRODUCTHIER_1",
		label: "PH1",
		type:"TextField"

	},{
		field: "SALES_ORG",
		label: "Sales Org",
		type: "DropdownBox",
		dropdownbox: {
			odata: {
				defaultSelectAll: true,
				url: oServiceUrl+"/SALES_OFFICE_SEARCH_CTO_DDL?$filter=ITEM_TYPE eq 'SALES_ORG'&$select=ITEM_VALUE&$format=json",
				bindTextField: "ITEM_VALUE",
				bindKeyField: "ITEM_VALUE"
			}
		}
	},{
		field: "COST_TYPE",
		label: "Cost Type",
		type: "DropdownBox",
		dropdownbox: {
			odata: {
				defaultSelectAll: true,
				url: oServiceUrl+"/SALES_OFFICE_SEARCH_CTO_DDL?$filter=ITEM_TYPE eq 'COST_TYPE'&$select=ITEM_VALUE&$format=json",
				bindTextField: "ITEM_VALUE",
				bindKeyField: "ITEM_VALUE"
			}
		}
	},{
		field: "PRODUCTHIER_2",
		label: "PH2",
		type:"TextField"

	}];
	/******Copy_Change_End*******/
	
	config.filters = lenovo.control.commontable.Toolkit.splitChunck(4, config.filtersRaw);

	/******Copy_Change_Start*******/
	//download  

	config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.rpt_sales_office/CV_RPT_SALES_OFFICE_CTO"';
	config.download.columns=["CYCLE","VARIANT","PRODUCTHIER_1","PRODUCTHIER_2","PRODUCTHIER_3","PRODUCTHIER_4","SALES_ORG","SALES_OFFICE","COST_TYPE",
	                         "CURRENCY_NAME","M1","M2","M3","M4","M5","M6","M7","M8","M9","M10","M11","M12","SYS_CREATED_DATE"];
	config.download.filename= "RPT_SALES_OFFICE_CTO" ;
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
	
}	
	

});


