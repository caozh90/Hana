/************************************
* Created by Chris Gao at 2015-8-19
* Version 1.0 2015-08-18
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
sap.ui.jsview("lenovo.view.cfe.report.rptCostFlag", { 
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
		var auth = lenovo.control.commontable.Table.getViewAuth("rptCostFlag");
//		/******Copy_Change_End*******/
//
//		//generate UI
//		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel); //declare ui_view configuration
//		this.setConfig(config, oServiceUrl, uServiceUrl,auth);   //call private function -- ui_view configuration
//		/******Copy_Change_Start*******/
		var header = lenovo.control.commontable.Table.createHeader("Report", "Cost Flag Report");
//		/******Copy_Change_End*******/
//		
//		//set data connection
//		/******Copy_Change_Start*******/
//		config.bindRowUrl = "/UI_ADDITIONAL_COST";
//		/******Copy_Change_End*******/
//		
//		var table = lenovo.control.commontable.Table.createTable(config);
//		table.setBusy(true);
//		table.setModel(oModel);
//		oModel.attachRequestCompleted(function(){
//			table.setBusy(false);
//		});
//		
//		//filter panel
//		var filterPanel = lenovo.control.commontable.Table.createFilter(config, table);
//		//tool bar		
//		var oEditDeleteUploadDownload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table, app);
//		//authorization buttons
//		var buttons = oEditDeleteUploadDownload.getContent()[0].getContent();
//		var editButton = null, uploadButton = null,deleteButton = null, uploadTemButton = null, viewStatusButton = null;
//		for(var i = 0; i < buttons.length; i++) {
//			var oTooltip = buttons[i].getTooltip();
//			if(auth.editable && oTooltip === 'edit'){
//				editButton = buttons[i];
//				continue;
//			}
//			if(auth.deleteable && oTooltip === 'delete'){
//				deleteButton = buttons[i];
//				continue;
//			}
//			if(auth.uploadable){
//				switch(oTooltip){
//					case "upload":
//						uploadButton = buttons[i];
//						break;
//					case "download upload template":
//						uploadTemButton = buttons[i];
//						break;
//					case "view status":
//						viewStatusButton = buttons[i];
//						break;
//				}
//			}
//		}
//		
//		var oForm = filterPanel.getContent()[0];
//		/******Copy_Change_Start*******/
//		var cycleDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Cycle")[0];
//		
		
		//generate page into app
		var page = new sap.m.Page({
	      	  showHeader: false,
	          content :[header] //header, filterPanel, oEditDeleteUploadDownload, table             
	    });
       app.insertPage(page);
       app.setInitialPage(page);
       return app;	
		
	},
	
});