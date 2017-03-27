//Created by Bian zehan at 2016-2-22
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
jQuery.sap.require("lenovo.control.Validation");
sap.ui.jsview("lenovo.view.cfe.controlPoint.partialCal", {
	setConfig: function(config, oServiceUrl, uServiceUrl, auth){
		//table
		config.columns = [{
			field: "ITEM", label: "Item", type:"TextField"
		},{
			field: "ITEM_TYPE", label: "Item type", type:"TextField"
		},{
			field: "SYS_LAST_MODIFIED_BY", label: "Last Modified By", type:"TextField"
		},{
			field: "SYS_LAST_MODIFIED_DATE", label: "Last Modified Date", type:"TextField"
		}];
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
//		var headerHeight = 250;
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(1);

		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight);

		//filter
		config.filtersRaw = [{
			field: "ITEM", label: "Item", type:"TextField",
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true})
		},{
			field: "ITEM_TYPE", label: "Item type", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
			dropdownbox : {
				odata:{
					defaultSelectAll: true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl+"/UI_PARTIAL_CAL_DDL?$filter=TYPE eq 'ITEM_TYPE'&$format=json"
				}				
			}
		},{
			field: "SYS_LAST_MODIFIED_BY", label: "Last Modified By", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
			dropdownbox : {
				odata:{
					defaultSelectAll: true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl+"/UI_PARTIAL_CAL_DDL?$filter=TYPE eq 'LASTMODIFIEDBY'&$format=json"
				}				
			}
		}];

		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);

		//download
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.ui_partial_cal/CV_UI_PARTIAL_CAL"';
		config.download.columns=[
			"ITEM","ITEM_TYPE","SYS_LAST_MODIFIED_BY","SYS_LAST_MODIFIED_DATE"];
		config.download.filename= "UI_PARTIAL_CAL";
		
		//upload
		config.upload = {
			url: uServiceUrl + "/ui_partial_cal.xsjs",
			excelUrl: "cfe/controlPoint/partial_cal.xlsx"
		};
		config.viewstatus = {
			viewUploadHistory: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'UI_ONDEMAND_CAL_LIST'",
				selectionMode: sap.ui.table.SelectionMode.Single
			},
			viewErrorInfo: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_ERR_INFO"
			},
			viewUploadErrorDetail: {
				url: uServiceUrl + "/upload.xsodata/UI_ONDEMAND_CAL_LIST_ERR_DETAIL?$format=json",
				columns: [[{
					label: "Item",
					field: "ITEM",
					type:  "TextField"
				}]],
				resubmit: {
					url: uServiceUrl + "/ui_partial_cal.xsjs"
				}
			}
		};
		
		//toolbar , auth
		config.create.visible = false;
		config.edit.visible = false;
		config.deleteable.visible = false;
		config.upload.visible = auth.uploadable;
		config.viewstatus.visible = auth.uploadable;
		config.download.visible = auth.exportable;
		config.download.roleName = auth.exportableRoleName;
		config.upload.roleName =  auth.uploadableRoleName;

	},
	
	createContent: function(){	
		var app = new sap.m.App(); 
		var service = new lenovo.service.CFE();
		var oServiceUrl = service.getEBGCfe();
		var uServiceUrl = service.getEBGCfeUpload();

		var oModel = new sap.ui.model.odata.ODataModel(oServiceUrl, true);
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		var auth = lenovo.control.commontable.Table.getViewAuth("partialCal");

		this.setConfig(config, oServiceUrl, uServiceUrl, auth);
		var header = lenovo.control.commontable.Table.createHeader("Control Point", "Partial CAL");

		config.bindRowUrl = "/UI_PARTIAL_CAL";
		var table = lenovo.control.commontable.Table.createTable(config);
		table.setBusy(true);
		table.setModel(oModel);
		oModel.attachRequestCompleted(function(){
			table.setBusy(false);
		});
		
		//filter
		var filterPanel = lenovo.control.commontable.Table.createFilter(config, table);
		
		//toolbar
		var oEditDeleteUploadDownload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table,app);
		
		var that = this;			

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
		
		
		var oDeleteAll = new sap.ui.commons.Button({
			lite: true,
			icon: "resource/img/Delete_All.png",//"sap-icon://alert",
			tooltip: "delete all",
			press: function(){
				that.deleteAll(table, oServiceUrl);
			}
		}).addStyleClass("commontable-toolbar-btn");
		
		for (var i in auth) {
			switch(i) {
				case "deleteallable":
					oToolbarCtn.insertContent(oDeleteAll,4);
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
		//app
	    var page = new sap.m.Page({
	      	  showHeader: false,
	          content :[header, filterPanel, oEditDeleteUploadDownload, table]//[layout]                
	    });
        app.insertPage(page);
        app.setInitialPage(page);
        return app;	
	},
	deleteAll: function(table){
		sap.ui.commons.MessageBox.confirm("Do you want to delete all items?", function(result){
		
			if(result){		
				var service = new lenovo.service.CFE();
				var logicServiceUrl = service.getEBGCfeLogic();
				var table_name = "UI_ONDEMAND_CAL_LIST";
				var obj = {
					"table_name": table_name,
					"no_user":true
				};
				

				table.setBusy(true);
				$.ajax({
					url: logicServiceUrl+ "/ui_delete_all.xsjs",
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
	deleteBatch: function(table){
		sap.ui.commons.MessageBox.confirm("Do you want to delete selected items?", function(result){
			if(result){
				
				var service = new lenovo.service.CFE();
				var logicServiceUrl = service.getEBGCfeLogic();
				var table_name = "UI_ONDEMAND_CAL_LIST";
				var obj = {
					"table_name": table_name,
					"condition":true
				};
				var selectedIndices = table.getSelectedIndices();
				var oUpdateData = {};
				var oData = [];
				
				
				if(0 == selectedIndices.length){
					lenovo.control.commontable.Toolkit.showErrorMsg("Please select a row at least!", "ERROR", "Error");
					return;
				}
				
				for(var i = 0;i < selectedIndices.length; i++){
					var selectedObject = table.getContextByIndex(selectedIndices[i]).getObject();
					
					    oUpdateData = {};
						oUpdateData.KEY = 'ITEM';
						oUpdateData.VAL = selectedObject.ITEM;
						oData.push(oUpdateData);
					
				}//
				
				var service = new lenovo.service.CFE();
				var logicServiceUrl = service.getEBGCfeLogic();
				var table_name = "UI_ONDEMAND_CAL_LIST";
				var obj = {
					"table_name": table_name,
					"condition":oData
				};
				table.setBusy(true);
				$.ajax({
					url: logicServiceUrl+ "/ui_delete_partialcal_batch.xsjs",
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
		
	}
});