/************************************
* Created by Chris Gao at 2016-05-18
* Version 1.0 2016-05-18
************************************/
//require what you need
/******Copy_Change_Start*******/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
jQuery.sap.require("lenovo.control.Validation");
/******Copy_Change_End*******/	

//main
/******Copy_Change_Start*******/
sap.ui.jsview("lenovo.view.cfe.priceMask.uiPmBsPartNo", { 
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
		var auth = lenovo.control.commontable.Table.getViewAuth("uiPmBsPartNo");
		/******Copy_Change_End*******/

		//generate UI
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel); //declare ui_view configuration
		this.setConfig(config, oServiceUrl, uServiceUrl,auth);   //call private function -- ui_view configuration
		/******Copy_Change_Start*******/
		var header = lenovo.control.commontable.Table.createHeader("Price Mask", "PM BS PART NO");
		/******Copy_Change_End*******/
		
		/******Add by Cuiyue start*******/
		config.bindRowUrl ="/UI_PM_BS_PART_NO";
		var table = lenovo.control.commontable.Table.createTable(config);
		table.setBusy(true);
		table.setModel(oModel);
		oModel.attachRequestCompleted(function(){
			table.setBusy(false);
			
		});
		
		var filterPanel = lenovo.control.commontable.Table.createFilter(config, table);		

	
		var oForm = filterPanel.getContent()[0];
		//toolbar	
		//config.create.visible=false;
		var oEditDeleteUploadDownload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table, app);	
		
		var oToolbarCtn = oEditDeleteUploadDownload.getContent()[0];	
		var oDelete = new sap.ui.commons.Button({
			lite: true,
			icon: "sap-icon://delete",
			tooltip: "delete",
			press: function(){
				that.deleteBatch(table, oServiceUrl);
				
			}
		}).addStyleClass("commontable-toolbar-btn");
		
		if(auth.deleteable){
			oToolbarCtn.insertContent(oDelete,3);
			
		}
		
		/*************************************
		 * Added by Chris Gao
		 * 2015-09-24
		 * to implement the dynamic edit mode
		 *********************************/
		
		
		var that = this;
		
	
		
		/******Add by Cuiyue end*******/
		//generate page into app
		var page = new sap.m.Page({
	      	  showHeader: false,
	          content :[header, filterPanel, oEditDeleteUploadDownload, table]           
	    });
       app.insertPage(page);
       app.setInitialPage(page);
       return app;	
		
	},

	
	deleteBatch: function(table){
		sap.ui.commons.MessageBox.confirm("Do you want to delete selected items?", function(result){
			if(result){
				
				var selectedIndices = table.getSelectedIndices();
				var oUpdateData = {};
				//var oData = [];
				var temp = [];
				
				
				if(0 == selectedIndices.length){
					lenovo.control.commontable.Toolkit.showErrorMsg("Please select a row at least!", "ERROR", "Error");
					return;
				}
				
				for(var i = 0;i < selectedIndices.length; i++){
					var selectedObject = table.getContextByIndex(selectedIndices[i]).getObject();
					 
					    oUpdateData = {};
						oUpdateData.PART_NO = selectedObject.PART_NO;
						temp.push(oUpdateData);
					
				}//
				
			    /*  temp.sort("PART_NO");
				    for(i = 0; i < temp.length; i++) {
				    	if(temp[i+1] != undefined){
				    		if( temp[i].PRODUCT_GROUP == temp[i+1].PRODUCT_GROUP && temp[i].BRAND == temp[i+1].BRAND
				    				&& temp[i].PLANT == temp[i+1].PLANT && temp[i].GEO == temp[i+1].GEO
				    				&& temp[i].FAMILY == temp[i+1].FAMILY && temp[i].MACHINETYPE == temp[i+1].MACHINETYPE ) {
				    			continue;
				    		}
				    	}
				    	oData[oData.length]=temp[i];
				    }*/
				var service = new lenovo.service.CFE();
				var logicServiceUrl = service.getEBGCfeLogic();
				
				var obj = {
					"data":temp//oData
				};
				table.setBusy(true);
				$.ajax({
					url: logicServiceUrl+ "/ui_delete_pm_bs_part_no.xsjs",
					type: "POST",
					data: JSON.stringify(obj),
					dataType: "text",
					contentType: "application/json",
					success: function(data){
						lenovo.control.commontable.Toolkit.showErrorMsg("Successfully delete", "SUCCESS", "Delete");
						var oModel = table.getModel();
						table.setBusy(false);
						
						table.clearSelection();
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
		
	},
	//private function -- ui_view columns configuration
	setConfig: function(config, oServiceUrl, uServiceUrl, auth) {
		
		//table columns setting
		/******Copy_Change_Start*******/
		config.columns = [{
			field: "PART_NO", label: "Part NO", type:"TextField", width: "100px"
		},
		{
			field: "PART_DESC", label: "Part Desc", type:"TextField", width: "200px"
		},{
			field: "CREATED_BY", label: "Created By", type:"TextField", width: "50px"
		},{
			field: "CREATION_DATE", label: "Creation date", type:"TextField", width: "100px"
		}];
		/******Copy_Change_End*******/
		
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(1);
		var rowHeight = 30;
		
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight - 10);
		
		
		/******Copy_Change_Start*******/
		//filter
		//filter
		config.filtersRaw = [{
			field: "PART_NO", label: "Part NO", type: "DropdownTable",
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
	
		dropdowntable: {
			//defaultFilterOp: "EQ",
			//url: oServiceUrl,
			//bindRowUrl: "/UI_XOUTFR_RATE_SEARCH_DDL?$filter=ITEM_TYPE eq 'FAMILY'&$format=json",
			defaultFilterOp: "EQ",
			url: oServiceUrl,
//			selectionMode: sap.ui.table.SelectionMode.Single,
			field: "PART_NO",	
			columns: [{
				label: "Part NO",
				field: "PART_NO",
				type: "TextField"
			}],
			notRefreshTable: true,
			filters: [[{
				field: "PART_NO",
				label: "Part NO",
				type: "MultiTextField"
			}]],
			_search: {
				func: this.reloadSearchPartNoDropdownTable,
				context: this
			},
			reload: {
				func: this.reloadPartNoDropdownTable,
				context: this
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
		//create

		/******Copy_Change_End*******/
		
		/******Copy_Change_Start*******/
		//edit
	
		/******Copy_Change_End*******/
		
		/******Copy_Change_Start*******/
		//download
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.ui_pm_bs_part_no/CV_UI_PM_BS_PART_NO"';
		config.download.columns=[
			 "PART_NO","PART_DESC","CREATED_BY","CREATION_DATE"];
		config.download.filename= "UI_PM_BS_PART_NO";

		/******Copy_Change_End*******/
		
		
		/******Copy_Change_Start*******/
		//upload
		config.upload = {
			url: uServiceUrl + "/ui_pm_bs_part_no.xsjs",
			excelUrl: "cfe/priceMask/pm_bs_part_no.xlsx"
		};
		//status view
		config.viewstatus = {
				viewUploadHistory: {
					url: uServiceUrl + "/upload.xsodata",
					bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'PM_UI_BS_PART'",
					selectionMode: sap.ui.table.SelectionMode.Single
				},
				viewErrorInfo: {
					url: uServiceUrl + "/upload.xsodata",
					bindRowUrl: "/UPLOAD_ERR_INFO"
				},
				viewUploadErrorDetail: {
					url: uServiceUrl + "/upload.xsodata/UI_PM_BS_PART_NO_ERR_DETAIL?$format=json",
					columns: [[{
						label: "Part NO",
						field: "PART_NO",
						type:  "TextField"
					}]],
					resubmit: {
						url: uServiceUrl + "/ui_pm_bs_part_no.xsjs"
					}
				}
			};
		
		
		/******Copy_Change_End*******/
		
		config.defaultSort = [{
			field: "PART_NO",
			bDescending: false
		}];
		
		//toolbar , auth
		config.create.visible = false;
		config.edit.visible = false;
		config.deleteable.visible = auth.deleteable;
		config.upload.visible = auth.uploadable;
		config.viewstatus.visible = auth.uploadable;
		config.download.visible = auth.exportable;
		config.download.roleName = auth.exportableRoleName;
		config.upload.roleName =  auth.uploadableRoleName;
	},
	
	/******Copy_Change_Start*******/

	
	/******Copy_Change_End*******/
	
	
	reloadSearchPartNoDropdownTable: function(filterModel, filterPanel, table){

		var filter = filterModel.getProperty("/PART_NO");
		var filterModel = null;
		if(filter.filterValue) {
			filterModel = [new sap.ui.model.Filter({
				path: "PART_NO",
				operator: filter.filterOperator,
				value1: "'" + filter.filterValue + "'"
			})];
		}
		var bindUrl = "/UI_PM_BS_PART_NO_SEARCH_DDL?";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	reloadPartNoDropdownTable: function(dropdownTable){
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
		var bindUrl = "/UI_PM_BS_PART_NO_SEARCH_DDL?$format=json";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	}
});