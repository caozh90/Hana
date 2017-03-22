/************************************
* Created by Chris Gao 2015-09-01
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
sap.ui.jsview("lenovo.view.cfe.standardCost.stdcostMonthly", { 
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
		var auth = lenovo.control.commontable.Table.getViewAuth("stdcostMonthly");
		/******Copy_Change_End*******/

		//generate UI
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel); //declare ui_view configuration
		this.setConfig(config, oServiceUrl, uServiceUrl,auth);   //call private function -- ui_view configuration
		/******Copy_Change_Start*******/
		var header = lenovo.control.commontable.Table.createHeader("Standard Cost", "Monthly Stdcost Publish");
		/******Copy_Change_End*******/
		
		//set data connection
		/******Copy_Change_Start*******/
		config.bindRowUrl = "/UI_STDCOST_MONTHLY";
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

		/***********************************
		 * CYCLE != CURRENT edit,delete unvisible
		 * Added by Chris Gao
		 * 2015-09-08
		 **********************************/
		var oForm = filterPanel.getContent()[0];
		var cycleDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Cycle")[0];
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
		
		/***********************************
		 * End by Chris Gao
		 * 2015-09-08
		 **********************************/
		
		/**************************************
		 * Change tool bar
		 * add new button and function
		 * Chris Gao
		 * 2015-08-21
		 *************************************/
		var that = this;
		
		var oToolbarCtn = oEditDeleteUploadDownload.getContent()[0];
		var oPublishBtn = new sap.ui.commons.Button({
			//lite: true,
			style: sap.ui.commons.ButtonStyle.Emph,
			icon: "sap-icon://action",
			tooltip: "Publish",
			press: function(){
				that.publish(table, oServiceUrl);
			}
		}).addStyleClass("ondemandRefresh-dslayout-flatcolor-button");//.addStyleClass("commontable-toolbar-btn");
		//check authorization
		for (var i in auth) {
			switch(i) {
				case "publishable":
					oToolbarCtn.insertContent(oPublishBtn,0);
					break;
			}
		}
		
		/**************************************
		 * End
		 * Chris Gao
		 * 2015-08-21
		 *************************************/
		
		/**************************************
		 * Change tool bar
		 * add new button and function
		 * zhangzj6
		 * 2016-06-16
		 *************************************/
		var logicServiceUrl = service.getEBGCfeLogic();
		var oPublishlogBtn = new sap.ui.commons.Button({
			style: sap.ui.commons.ButtonStyle.Emph,
			icon: "sap-icon://download",
			tooltip: "Publish Log Download",
			press: function(){
				that.publishlog(logicServiceUrl);
			}
		}).addStyleClass("ondemandRefresh-dslayout-flatcolor-button");//.addStyleClass("commontable-toolbar-btn");
		oToolbarCtn.insertContent(oPublishlogBtn,8);
		
		/**************************************
		 * End
		 * zhangzj6
		 * 2016-06-16
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
	 * download publish log
	 * zhangzj6 
	 * 2016-06-16
	 *************************************/
	publishlog: function(oServiceUrl){
		var tablename = '"PCDW"."RSP_STDCOST_MONTHLY"';
        var url = oServiceUrl+"/ui_stdcost_publishlog.xsjs?tablename=" + tablename;			
        window.open(url);
                
	},
	/**************************************
	 * End
	 * zhangzj6
	 * 2016-06-16
	 *************************************/	
	
	/**************************************
	 * Change tool bar
	 * add new button function
	 * Chris Gao
	 * 2015-08-21
	 *************************************/
	publish: function(table, oServiceUrl) {
		
		var oLabel = new sap.ui.commons.Label({
			text: "Do you want to publish?",
			width: "350px",
		});
		sap.ui.commons.MessageBox.confirm(oLabel, function(result){
			if(result) {
				var service = new lenovo.service.CFE();
				var logicServiceUrl = service.getEBGCfeLogic();
				
				table.setBusy(true);
				/********************************
				 * Modified by Chris Gao
				 * 2015-09-11
				 *******************************/
				$.ajax({
					url: logicServiceUrl+"/ui_stdcost_monthly_publish.xsjs?process_name=CFE_WBSTDCO_MONTHLY_TO_ECC", 
					//data: data,
					type: "get",
					contentType: "text",
					success: function(){
						table.setBusy(false);
						lenovo.control.commontable.Toolkit.showErrorMsg("Successfully execute", "SUCCESS", "Execute");		
					},
					error: function(err){
						err = err && err.responseText ;
						table.setBusy(false);
						if(!(typeof err === "string"))
							err = JSON.stringify(err);
						lenovo.control.commontable.Toolkit.showErrorMsg(err, "ERROR", "Execute");			
					}
				});
				/********************************
				 * End by Chris Gao
				 * 2015-09-11
				 *******************************/
			}
		}, 	"Confirm");	
	},
	
	//private function -- ui_view columns configuration
	setConfig: function(config, oServiceUrl, uServiceUrl, auth) {
		
		//table columns setting
		/******Copy_Change_Start*******/
		config.columns = [{
			field: "ITEM", label: "Item", type:"TextField", width: "100px"
		},{
			field: "PLANT", label: "Plant", type:"TextField", width: "100px"
		},{
			field: "STDCOST", label: "Standard Cost", type:"TextField", width: "100px"
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
			field: "CYCLE", label: "Cycle", type: "DropdownBox",
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				defaultFilterValue: "CURRENT",
				odata:{
					defaultSelectAll: false,
					url: oServiceUrl +"/UI_STDCOST_MONTHLY_SEARCH_DDL?$filter=ITEM_TYPE eq 'CYCLE' &$format=json",
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE"
				}				
			}
		},{
			field: "ITEM", label: "Item", type: "DropdownTable",
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdowntable : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				defaultFilterOp: "Contains",
				url: oServiceUrl,
				notRefreshTable: true,
				//selectionMode: sap.ui.table.SelectionMode.Single,
				field: "ITEM_VALUE",	
				columns: [{
					label: "Item",
					field: "ITEM_VALUE",
					type: "TextField"
				}],
				notRefreshTable: true,
				filters: [[{
					field: "ITEM_VALUE",
					label: "Item",
					type: "MultiTextField"
				}]],
				_search: {
					func: this.reloadSearchItemDropdownTable,
					context: this
				},
				reload: {
					func: this.reloadItemDropdownTable,
					context: this
				}
			}
		},{
			field: "PLANT", label: "Plant", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				odata:{
					defaultSelectAll:true,
					url: oServiceUrl +"/UI_STDCOST_MONTHLY_SEARCH_DDL?$filter=ITEM_TYPE eq 'PLANT' &$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		}];
		/******Copy_Change_End*******/
		
		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);
		
		
		/******Copy_Change_Start*******/
		//edit
		config.editRaw = [{
  			field: "STDCOST", 
  			label: "Standard Cost",
  			type:"TextField",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			},{
				validType: /^\d{0,11}(\.\d{0,})?$/,
				errMsg: "The data type of this field is Float (11,n)!"
			}]
		}];
		/******Copy_Change_End*******/
		
		/******Copy_Change_Start*******/
		//download
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.ui_stdcost_monthly/CV_UI_STDCOST_MONTHLY"';
		config.download.columns=[
			 "ITEM","PLANT","STDCOST"];
		config.download.filename= "UI_STDCOST_MONTHLY";
		/******Copy_Change_End*******/
		
		
		/******Copy_Change_Start*******/
		//upload
		config.upload = {
			url: uServiceUrl + "/ui_stdcostmonthly.xsjs",
			excelUrl: "cfe/standardCost/monthlyStdcostPublish.xlsx"
		};
		//status view
		config.viewstatus = {
				viewUploadHistory: {
					url: uServiceUrl + "/upload.xsodata",
					bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'UI_STDCOST_MONTHLY'",
					selectionMode: sap.ui.table.SelectionMode.Single
				},
				viewErrorInfo: {
					url: uServiceUrl + "/upload.xsodata",
					bindRowUrl: "/UPLOAD_ERR_INFO"
				},
				viewUploadErrorDetail: {
					url: uServiceUrl + "/upload.xsodata/UI_STDCOST_MONTHLY_ERR_DETAIL?$format=json",
					columns: [[{
						field: "ITEM",
						label: "Item",
						type:  "TextField"
					},{
						field: "PLANT",
						label: "Plant",
						type:  "TextField"
					},{
						field: "STDCOST",
						label: "Standard Cost",
						type:  "TextField"
					}]],
					resubmit: {
						url: uServiceUrl + "/ui_stdcostmonthly.xsjs"
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
	
	/****************** Start Select Data Helper Table******************************/
	reloadSearchItemDropdownTable: function(filterModel, filterPanel, table){
		
		var filter = filterModel.getProperty("/ITEM_VALUE");
		var filterModel = null;
		if(filter.filterValue) {
			filterModel = [new sap.ui.model.Filter({
				path: "ITEM_VALUE",
				operator: filter.filterOperator,
				value1: "'" + filter.filterValue + "'"
			}),
			new sap.ui.model.Filter({
				path: "ITEM_TYPE",
                operator: "EQ",
                value1: "'ITEM'"
			})
			];
		}
		var bindUrl = "/UI_STDCOST_MONTHLY_SEARCH_DDL?";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	
	reloadItemDropdownTable: function(dropdownTable){
		
		/*********************************************************
		 * Added by Chris Gao - 2015-09-09
		 * to close the default count url called by table model
		 * default count model = "Both"
		 * because of the wrong count url with filter 
		 *******************************************************/
		dropdownTable.getModel().setDefaultCountMode("None");
		/********************************************************
		 * End by Chris Gao
		 *******************************************************/
		
		var bindUrl = "/UI_STDCOST_MONTHLY_SEARCH_DDL?$filter=ITEM_TYPE eq 'ITEM' &$format=json";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
		
	},
	/******************* End Select Data Helper Table******************************/
	
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