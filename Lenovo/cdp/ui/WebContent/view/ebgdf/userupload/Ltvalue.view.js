/**
 * 
 */
/************************************
* Created by bianzh1 at 2016-2-14
* Version 1.0 2016-2-14
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
sap.ui.jsview("lenovo.view.ebgdf.userupload.Ltvalue", { 
/******Copy_Change_End*******/	
	getControllerName: function() {

	},
	
	confirm: function(){

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
		var auth = lenovo.control.commontable.Table.getViewAuth("Ltvalue");
		/******Copy_Change_End*******/

		//generate UI
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel); //declare ui_view configuration
		this.setConfig(config, oServiceUrl, uServiceUrl,auth);   //call private function -- ui_view configuration
		/******Copy_Change_Start*******/
		var header = lenovo.control.commontable.Table.createHeader("User Upload", "LT ABCD Value");
		/******Copy_Change_End*******/
		
		//set data connection
		/******Copy_Change_Start*******/
		config.bindRowUrl = "/UI_LTVALUE";
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
		
		var oForm = filterPanel.getContent()[0];
		/******Copy_Change_Start*******/
			
		//generate page into app
		var page = new sap.m.Page({
	      	  showHeader: false,
	          content :[header, filterPanel, oEditDeleteUploadDownload, table] //header, filterPanel, oEditDeleteUploadDownload, table             
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
		{field: "ABCD", label: "ABCD", type:"TextField", width: "100px"},
		{field: "LEADTIME", label: "LEADTIME", type:"TextField", width: "150px"},
		{field: "CREATE_TS", label: "Create date", type:"TextField", width: "200px", dateformat: "MM-dd-yyyy"},
		{field: "CREATE_USERID", label: "Create user", type:"TextField", width: "100px"},
		{field: "LAST_UPDATE_TS", label: "Last Modified BY", type:"TextField", width: "150px", dateformat: "MM-dd-yyyy"},
		{field: "LAST_UPDATE_USERID", label: "Last Modified DATE", type:"TextField", width: "150px"}
		];
		/******Copy_Change_End*******/
		
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(2);
		var rowHeight = 30;
		
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight);
		
		
		/******Copy_Change_Start*******/
		//filter
		config.filtersRaw = [{
			field: "ABCD", label: "ABCD", type: "TextField", 
			labelLayout: new sap.ui.layout.GridData({span: "L2 M2 S2", linebreak: true})
		},{
			field: "LEADTIME", label: "LEADTIME", type: "TextField", 
			labelLayout: new sap.ui.layout.GridData({span: "L2 M2 S2", linebreak: true})
		}];
		/******Copy_Change_End*******/
		
		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);
		
		/******Copy_Change_Start*******/
		//EDIT
		config.editRaw = [{
  			field: "LEADTIME", 
  			label: "LEADTIME",
		}];
	
		/******Copy_Change_Start*******/
		//create
		config.insertRaw=[{
			field: "ABCD", 
			label: "ABCD", 
			type:"TextField",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
		
		},{
			field: "LEADTIME", 
			label: "LEADTIME", 
			type: "TextField", 
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
		}];

		config.create.columns = lenovo.control.commontable.Toolkit.splitChunck(2, config.insertRaw);
		config.create.url = "/UI_LTVALUE";
		/******Copy_Change_End*******/
		/******Copy_Change_Start*******/
		//download
		config.download.table = '"_SYS_BIC"."cdp.ebgdf.models.ui_ltvalue/CV_UI_LTVALUE"';
		config.download.columns=[
			"ABCD","LEADTIME","CREATE_TS","CREATE_USERID","LAST_UPDATE_TS","LAST_UPDATE_USERID"];

		config.download.filename= "ltvalue";
		/******Copy_Change_End*******/
		
		
		/******Copy_Change_Start*******/
		//upload
		/******Copy_Change_End*******/
		
		//toolbar , auth
		config.create.visible = auth.createable;
	    config.edit.visible = auth.editable;
		config.deleteable.visible = auth.deleteable;
		config.upload.visible=false;
		config.download.visible = auth.exportable;
		config.download.roleName = auth.exportableRoleName;
		config.upload.roleName =  auth.uploadableRoleName;
	},
	deleteAll: function(table){
		sap.ui.commons.MessageBox.confirm("Do you want to delete all items?", function(result){
			if(result){
				var service = new lenovo.service.EBGDF();
				var logicServiceUrl = service.getebgdfLogic();
				var table_name = "UI_LTVALUE";
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