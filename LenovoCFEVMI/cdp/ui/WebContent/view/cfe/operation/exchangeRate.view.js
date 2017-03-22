//Created by Zhang Ruixue at 2014-12-08
/***********************************************
 * Modified by Chris Gao as requirements changed
 * 2015-09-28
 ***********************************************/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
sap.ui.jsview("lenovo.view.cfe.operation.exchangeRate", {
	setConfig: function(config, oServiceUrl, uServiceUrl, auth){
		var labelArr={
				"M1": "M1",
				"M2": "M2",
				"M3": "M3",
				"M4": "M4",
				"M5": "M5",
				"M6": "M6",
				"M7": "M7",
				"M8": "M8",
				"M9": "M9",
				"M10": "M10",
				"M11": "M11",
				"M12": "M12",
				"M13": "M13",
				"M14": "M14",
				"M15": "M15",
				"M16": "M16",
				"M17": "M17",
				"M18": "M18"				
		};
		$.ajax({
			url:oServiceUrl+"/V_CYCLE(INPUT_CYCLE='CURRENT')/Results?$format=json",
			type:"GET",
			async: false,
			dataType:"json",
			success: function(data){
				var oResult = data.d.results;
				if(oResult.length>0){
					labelArr = data.d.results[0];
				}
			}
		});
		
		//table		
		config.columns = [{
			field: "CURRENCY_NAME", label: "Currency", type:"TextField", width:"150px"
		},{
			field: "OUTPUT_M1", label: labelArr.M1, type:"TextField", width:"100px"
		},{
			field: "OUTPUT_M2", label: labelArr.M2, type:"TextField", width:"100px"
		},{
			field: "OUTPUT_M3", label: labelArr.M3, type:"TextField", width:"100px"
		},{
			field: "OUTPUT_M4", label: labelArr.M4, type:"TextField", width:"100px"
		},{
			field: "OUTPUT_M5", label: labelArr.M5, type:"TextField", width:"100px"
		},{
			field: "OUTPUT_M6", label: labelArr.M6, type:"TextField", width:"100px"
		},{
			field: "OUTPUT_M7", label: labelArr.M7, type:"TextField", width:"100px"
		},{
			field: "OUTPUT_M8", label: labelArr.M8, type:"TextField", width:"100px"
		},{
			field: "OUTPUT_M9", label: labelArr.M9, type:"TextField", width:"100px"
		},{
			field: "OUTPUT_M10", label: labelArr.M10, type:"TextField", width:"100px"
		},{
			field: "OUTPUT_M11", label: labelArr.M11, type:"TextField", width:"100px"
		},{
			field: "OUTPUT_M12", label: labelArr.M12, type:"TextField", width:"100px"
		},{
			field: "OUTPUT_M13", label: labelArr.M13, type:"TextField", width:"100px"
		},{
			field: "OUTPUT_M14", label: labelArr.M14, type:"TextField", width:"100px"
		},{
			field: "OUTPUT_M15", label: labelArr.M15, type:"TextField", width:"100px"
		},{
			field: "OUTPUT_M16", label: labelArr.M16, type:"TextField", width:"100px"
		},{
			field: "OUTPUT_M17", label: labelArr.M17, type:"TextField", width:"100px"
		},{
			field: "OUTPUT_M18", label: labelArr.M18, type:"TextField", width:"100px"
		},{
			field: "SYS_LAST_MODIFIED_BY", label: "Last Modified By", type:"TextField", width:"150px"
		},{
			field: "SYS_LAST_MODIFIED_DATE", label: "Last Modified Date", type:"TextField", width:"150px"
		}];
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
//		var headerHeight = 225;
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(1);

		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight - 10);
		
		//filter
		config.filtersRaw = [{
			field: "CYCLE", label: "Cycle", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L9 M9 S9"}),
				defaultFilterValue: "CURRENT",
				notAsInitialFilter: true,
				odata:{
					defaultSelectAll: false,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_EXCHANGE_RATE_DDL?$filter=ITEM_TYPE eq 'CYCLE'&$format=json"
				}				
			}
		},{
			field: "CURRENCY_NAME", label: "Currency Name", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L6 M6 S6", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L6 M6 S6"}),
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_EXCHANGE_RATE_DDL?$filter=ITEM_TYPE eq 'CURRENCY_NAME'&$format=json"
				}	
					
			}
		}];
		config.filters = lenovo.control.commontable.Toolkit.splitChunck(4, config.filtersRaw);
		config.filterLayout = {
			0: new sap.ui.layout.GridData({span: "L4 M4 S4"}),
			1: new sap.ui.layout.GridData({span: "L4 M4 S4"}),
			2: new sap.ui.layout.GridData({span: "L4 M4 S4"})
		};
		//edit		
		config.editRaw = [{
			field: "OUTPUT_M1", 
		    label: labelArr.M1,
		    validation: [{
		    	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "OUTPUT_M2", 
			label: labelArr.M2,
			validation: [{
			    validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "OUTPUT_M3", 
			label: labelArr.M3,
			validation: [{
			   	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "OUTPUT_M4", 
			label: labelArr.M4,
			validation: [{
			   	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "OUTPUT_M5", 
			label: labelArr.M5,
			validation: [{
			   	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "OUTPUT_M6", 
			label: labelArr.M6,
			validation: [{
			   	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "OUTPUT_M7", 
			label: labelArr.M7,
			validation: [{
			   	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "OUTPUT_M8", 
			label: labelArr.M8,
			validation: [{
			   	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "OUTPUT_M9", 
			label: labelArr.M9,
			validation: [{
			   	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "OUTPUT_M10", 
			label: labelArr.M10,
			validation: [{
			   	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "OUTPUT_M11", 
			label: labelArr.M11,
			validation: [{
			   	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "OUTPUT_M12", 
			label: labelArr.M12,
			validation: [{
			   	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "OUTPUT_M13", 
			label: labelArr.M13,
			validation: [{
			   	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "OUTPUT_M14", 
			label: labelArr.M14,
			validation: [{
			   	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "OUTPUT_M15", 
			label: labelArr.M15,
			validation: [{
			   	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "OUTPUT_M16", 
			label: labelArr.M16,
			validation: [{
			   	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "OUTPUT_M17", 
			label: labelArr.M17,
			validation: [{
			   	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "OUTPUT_M18", 
			label: labelArr.M18,
			validation: [{
			   	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		}];
		
		/************************************
		 * change update and delete key value
		 * updated by Chris Gao 2015-09-29
		 *************************************/

		//config.editModelReplaceKey = [{sourceKey: "CYCLE", targetKey: "P_CYCLE"}]; 
		
		/************************************
		 * End by Chris Gao
		 ***********************************/
			
		//download
		/*config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.ui_exchange_rate/CV_UI_EXCHANGE_RATE"'
			+'&modelIn="$$INPUT_RATE$$"=>\'fromUS\' and "$$P_CYCLE$$"=>\'CURRENT\' and "$$P_CURRENCY_NAME$$"=>\'CNY\'';*/
		config.download.columns=[
		                        "CURRENCY_NAME", "OUTPUT_M1", "OUTPUT_M2", "OUTPUT_M3", "OUTPUT_M4", "OUTPUT_M5", 
		                         "OUTPUT_M6", "OUTPUT_M7", "OUTPUT_M8", "OUTPUT_M9", "OUTPUT_M10", "OUTPUT_M11", "OUTPUT_M12",
		                         "OUTPUT_M13", "OUTPUT_M14", "OUTPUT_M15", "OUTPUT_M16", "OUTPUT_M17", "OUTPUT_M18"
		                         ];
		config.download.filename= "UI_EXCHANGE_RATE";
		
		/******************************
		 * Added by Chris Gao
		 * 2015-09-24
		 * to do the mapping table header and download header
		 *****************************/
		config.download.url = "/cdp/common/services/getFileWithHeaderMapping.xsjs";
		config.download.mappingTableHeader = {OUTPUT_M1:"M1",OUTPUT_M2:"M2",OUTPUT_M3:"M3",OUTPUT_M4:"M4",OUTPUT_M5:"M5",OUTPUT_M6:"M6",OUTPUT_M7:"M7",OUTPUT_M8:"M8",OUTPUT_M9:"M9",OUTPUT_M10:"M10",OUTPUT_M11:"M11",OUTPUT_M12:"M12",OUTPUT_M13:"M13",OUTPUT_M14:"M14",OUTPUT_M15:"M15",OUTPUT_M16:"M16",OUTPUT_M17:"M17",OUTPUT_M18:"M18"};
		/*****************************
		 * End by Chris Gao
		 ****************************/
		
		
		//upload
		config.upload = {
			url: uServiceUrl + "/ui_exchange_rate.xsjs",
			excelUrl: "cfe/operation/exchange_rate.xlsx"
		};
		config.viewstatus = {
			viewUploadHistory: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'UI_EXCHANGE_RATE'",
				selectionMode: sap.ui.table.SelectionMode.Single
			},
			viewErrorInfo: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_ERR_INFO"
			},
			viewUploadErrorDetail: {
				url: uServiceUrl + "/upload.xsodata/UI_EXCHANGE_RATE_ERR_DETAIL?$format=json",
				columns: [[{
					label: "Cycle",
					field: "CYCLE",
					type:  "TextField"
				},{
					label: "Currency Name",
					field: "CURRENCY_NAME",
					type:  "TextField"
				},{
					field: "OUTPUT_M1", label: "M1", type:"TextField"
				},{
					field: "OUTPUT_M2", label: "M2", type:"TextField"
				},{
					field: "OUTPUT_M3", label: "M3", type:"TextField"
				},{
					field: "OUTPUT_M4", label: "M4", type:"TextField"
				},{
					field: "OUTPUT_M5", label: "M5", type:"TextField"
				},{
					field: "OUTPUT_M6", label: "M6", type:"TextField"
				},{
					field: "OUTPUT_M7", label: "M7", type:"TextField"
				}],[{
					field: "OUTPUT_M8", label: "M8", type:"TextField"
				},{
					field: "OUTPUT_M9", label: "M9", type:"TextField"
				},{
					field: "OUTPUT_M10", label: "M10", type:"TextField"
				},{
					field: "OUTPUT_M11", label: "M11", type:"TextField"
				},{
					field: "OUTPUT_M12", label: "M12", type:"TextField"
				},{
					field: "OUTPUT_M13", label: "M13", type:"TextField"
				},{
					field: "OUTPUT_M14", label: "M14", type:"TextField"
				},{
					field: "OUTPUT_M15", label: "M15", type:"TextField"
				},{
					field: "OUTPUT_M16", label: "M16", type:"TextField"
				},{
					field: "OUTPUT_M17", label: "M17", type:"TextField"
				},{
					field: "OUTPUT_M18", label: "M18", type:"TextField"
				}]],
				resubmit: {
					url: uServiceUrl + "/ui_exchange_rate.xsjs"
				}
			}
		};
		
		//toolbar , auth
		config.edit.visible = auth.editable;
		config.deleteable.visible = auth.deleteable;
		config.upload.visible = auth.uploadable;
		config.viewstatus.visible = auth.uploadable;
		config.download.visible = auth.exportable;
		config.create.visible=false;
		config.download.roleName = auth.exportableRoleName;
		config.upload.roleName =  auth.uploadableRoleName;

	},
	_search: function(filterModel, table, oServiceUrl){
		var rate = sap.ui.getCore().byId("exchangeRate").getSelectedItem().getKey();
		table.setBusy(true);
		//var filters =  lenovo.control.commontable.Table._getAllFilters(filterModel);
		filterModel = JSON.parse(filterModel.getJSON());
		//console.log("filterModel", filterModel);
		
		var cycle = filterModel.CYCLE.filterValue;
		//var currencyName = filterModel.CURRENCY_NAME.filterValue || "ALL";
		var currencyName = filterModel.CURRENCY_NAME.filterValue; // updated by Chris Gao 2015-09-28
//		var country = filterModel.COUNTRY.filterValue || "ALL";
//		var bindRowUrl = "/INPUT_RATE(INPUT_RATE='"+rate+"', P_CYCLE='"+ cycle+"', P_CURRENCY_NAME='"
//						+ currencyName+"', P_COUNTRY='"
//						+ country +"')/Results";
		var bindRowUrl = "/INPUT_RATE(INPUT_RATE='"+rate+"')/Results?$filter=((substringof('" + currencyName + "', CURRENCY_NAME)) and CYCLE eq '" + cycle +"')&$format=json";
		table.bindRows(bindRowUrl);
		$.ajax({
			url:oServiceUrl+"/V_CYCLE(INPUT_CYCLE='"+cycle+"')/Results",
			type:"GET",
			dataType:"json",
			success: function(data){
				var oResult = data.d.results;
				if(oResult.length>0){
					var labelArr = oResult[0];
					var oColumns = table.getColumns();
					var oStartIndex = 1; //=2 updated by Chris Gao 2015-09-28
					for(var i=oStartIndex; i<oStartIndex+18; i++){
						var oAttName = "M"+(i-oStartIndex+1);
						oColumns[i].setLabel(new sap.ui.commons.Label({
							text: labelArr[oAttName]
						}));
					}
				}			
			}
		});
		
		//added by Chris Gao 2015-09-28
		this.searchCountURL = oServiceUrl + "/INPUT_RATE(INPUT_RATE='"+rate+"')/Results/$count?$filter=((substringof('" + currencyName + "', CURRENCY_NAME)) and CYCLE eq '" + cycle +"')";
		
	},
	addRateRadio: function(oForm){	
		var oFormContainer = new sap.ui.layout.form.FormContainer({
			layoutData: new sap.ui.layout.GridData({
				span: "L4 M4 S4",
				linebreak: false
			})
		});
		// Create a simple RadioButtonGroup: rate from US dollar, rate to US dollar
		var oRateRadio = new sap.ui.commons.RadioButtonGroup("exchangeRate", {
			columns : 2
			});
		var oRadioItem1 = new sap.ui.core.Item({
			text : "Rate from US dollar", 
			key : "fromUS"});

		oRadioItem2 = new sap.ui.core.Item({
			text : "Rate to US dollar", 
			key : "toUS"});
		
		oRateRadio.addItem(oRadioItem1);
		oRateRadio.addItem(oRadioItem2);
		
		var oFormElement = new sap.ui.layout.form.FormElement({
			fields: oRateRadio
		});
		// attach it to some element in the page
		oFormContainer.addFormElement(oFormElement);
		oForm.addFormContainer(oFormContainer);

	},
	
	//added by Chris Gao 2015-09-28
	downloadCountUrl: function(){
		console.log("downloadCountUrl: " + this.searchCountURL);
		return this.searchCountURL;
	},
	
	createContent: function(){
		var app = new sap.m.App(); 
		var service = new lenovo.service.CFE();
		var oServiceUrl = service.getEBGCfe();
		var uServiceUrl = service.getEBGCfeUpload();
		
		var oModel = new sap.ui.model.odata.ODataModel(oServiceUrl, true);
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		var auth = lenovo.control.commontable.Table.getViewAuth("exchangeRate");
		this.setConfig(config, oServiceUrl, uServiceUrl, auth);
		var header = lenovo.control.commontable.Table.createHeader("Operation", "Exchange Rate");

		//added by Chris Gao 2015-09-28
		this.searchCountURL = oServiceUrl + "/INPUT_RATE(INPUT_RATE='fromUS')/Results/$count?$filter=CYCLE eq 'CURRENT'";
		
		config.bindRowUrl = "/INPUT_RATE(INPUT_RATE='fromUS')/Results?$filter=CYCLE eq 'CURRENT'";
		var table = lenovo.control.commontable.Table.createTable(config);
		table.setBusy(true);
		oModel.setDefaultCountMode("None"); //added by Chris Gao 2015-09-28
		table.setModel(oModel);
		oModel.attachRequestCompleted(function(){
			table.setBusy(false);
		});
	
		var filterPanel = lenovo.control.commontable.Table.createFilter(config, table);
		
		

		config._search = {
			      args: [ table, oServiceUrl],
			      func: this._search,
			      context: this
		};
		
//		config.download.tableArgs = [filterPanel];
		config.download.table = function(filterModel){
	/*		console.log("export filterModel", filterModel);
			console.log("export filterPanel", filterPanel);*/
			var rate = sap.ui.getCore().byId("exchangeRate").getSelectedItem().getKey();
			filterModel = JSON.parse(filterModel.getJSON());
			var cycle = filterModel.CYCLE.filterValue;
			//var currencyName = filterModel.CURRENCY_NAME.filterValue || "ALL";
			var currencyName = filterModel.CURRENCY_NAME.filterValue; // updated by Chris Gao 2015-09-28
//			var country = filterModel.COUNTRY.filterValue || "ALL";
//			
//			var downloadPath = '"_SYS_BIC"."cdp.ebgcfe.models.ui_exchange_rate/CV_UI_EXCHANGE_RATE"'
//				+'&modelIn="$$INPUT_RATE$$"=>\''+rate+'\' and "$$P_CYCLE$$"=>\''
//				+cycle+'\' and "$$P_CURRENCY_NAME$$"=>\''+currencyName+'\' and "$$P_COUNTRY$$"=>\''
//				+country+'\'';
			var downloadPath = '"_SYS_BIC"."cdp.ebgcfe.models.ui_exchange_rate/CV_UI_EXCHANGE_RATE"'
				+'&modelIn="$$INPUT_RATE$$"=>\''+rate+'\'&filter='+"((substringof('" + currencyName + "', CURRENCY_NAME)) and CYCLE eq '" + cycle +"')";

			return downloadPath;
		
		};
		
		config.download.countUrl = {
				func: this.downloadCountUrl,
				context: this
		};
		
		var oForm = filterPanel.getContent()[0];

		this.addRateRadio(oForm);
		
		var cycleDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Cycle")[0];
		
		//toolbar	
		var oEditDeleteUploadDownload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table, app);
		
		var buttons = oEditDeleteUploadDownload.getContent()[0].getContent();
		var editButton = null, uploadButton = null,deleteButton = null, uploadTemButton = null, viewStatusButton = null;
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
		
		//app
	    var page = new sap.m.Page({
	      	  showHeader: false,
	          content :[header, filterPanel, oEditDeleteUploadDownload, table]               
	    });
        app.insertPage(page);
        app.setInitialPage(page);
        return app;	

	}
});