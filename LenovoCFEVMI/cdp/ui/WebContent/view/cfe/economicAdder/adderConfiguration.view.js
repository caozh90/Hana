//Created by Zhang Ruixue at 2014-12-08
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
jQuery.sap.require("lenovo.control.Validation");
sap.ui.jsview("lenovo.view.cfe.economicAdder.adderConfiguration", {
	setConfig: function(config, oServiceUrl, uServiceUrl, auth){
		
		//table		
		config.columns = [{
			field: "ADDER_NAME", label: "Adder Name", type:"TextField"
		},{
			field: "TBA_TYPE", label: "TBA_TYPE", type:"TextField"
		},{
			field: "ADDER_DESC", label: "Adder Description", type:"TextField"
		},{
			field: "ASP_PROD_FAMILY", label: "ASP_PROD_FAMILY", type: "DropdownBox", 
			dropdownbox : {
				odata:{
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_ADDER_CONF_CREATE_DDL?$filter=ITEM_TYPE eq 'ASP_PROD_FAMILY'&$format=json"
				}				
			}
		},{
			field: "FLEXIBLE", label: "Flexible", type:"TextField"
		},{
			field: "SYS_LAST_MODIFIED_BY", label: "Last Modified By", type:"TextField"
		},{
			field: "SYS_LAST_MODIFIED_DATE", label: "Last Modified Date", type:"TextField"
		}];
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
//		var headerHeight = 255;
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(2);

		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight);
		
		//filter
		config.filtersRaw = [{
			field: "CYCLE", label: "Cycle", type: "DropdownBox", 
			dropdownbox : {
				defaultFilterValue: "CURRENT",
				odata:{
					defaultSelectAll: false,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_ADDER_CONF_SEARCH_DDL?$filter=ITEM_TYPE eq 'CYCLE'&$format=json"
				}				
			}
		},{
			field: "ASP_PROD_FAMILY", label: "ASP_PROD_FAMILY",  type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_ADDER_CONF_SEARCH_DDL?$filter=ITEM_TYPE eq 'ASP_PROD_FAMILY'&$format=json"
				}					
			}		
		},{
			field: "ADDER_NAME", label: "Adder Name", type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_ADDER_CONF_SEARCH_DDL?$filter=ITEM_TYPE eq 'ADDER_NAME'&$format=json"
				}	
					
			}
		},{
			field: "FLEXIBLE", label: "Flexible", type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_ADDER_CONF_FLEXIBLE?$filter=ITEM_TYPE eq 'FLEXIBLE'&$format=json"
				}	
					
			}
			/*dropdownbox : {
				data:[{"text": lenovo.control.Constants.allDropdownBoxListItem, "key": lenovo.control.Constants.allDropdownBoxListItem}]			
			}*/
		},{
			field: "TBA_TYPE", label: "TBA Type",type: "TextField" ,
			textfield: {
				enabled: false,
				defaultFilterOp: "EQ"
			}
			
		}];

		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);
		config.filterLayout = {
				0: new sap.ui.layout.GridData({span: "L5 M5 S5"}),
				1: new sap.ui.layout.GridData({span: "L4 M4 S4"}),
				2: new sap.ui.layout.GridData({span: "L3 M3 S3"}),		
			};
		
		//edit		
		config.editRaw = [
		                  {field: "ADDER_DESC", label: "Adder Description"},
		                  {field: "ASP_PROD_FAMILY", label: "ASP_PROD_FAMILY"}
		                  ];
		
		//download
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.ui_adder_conf/CV_UI_ADDER_CONF"';
		config.download.columns=[
		                         "CYCLE", "ADDER_NAME", "ADDER_DESC", "ASP_PROD_FAMILY"];
		                       
		config.download.filename= "UI_ADDER_CONF";
		
		//upload
		config.upload = {
			url: uServiceUrl + "/ui_adder_conf.xsjs",
			excelUrl: "cfe/economicAdder/adder_configuration.xlsx"
		};
		config.viewstatus = {
			viewUploadHistory: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'UI_ADDER_CONF'",
				selectionMode: sap.ui.table.SelectionMode.Single,
				visibleRowCount: 10
			},
			viewErrorInfo: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_ERR_INFO",
				visibleRowCount: 10
			},
			viewUploadErrorDetail: {
				url: uServiceUrl + "/upload.xsodata/UI_ADDER_CONF_ERR_DETAIL?$format=json",
				columns: [[{
					label: "Cycle",
					field: "CYCLE",
					type:  "TextField"
				},{
					label: "Adder Name",
					field: "ADDER_NAME",
					type:  "TextField"
				},{
					label: "Adder Description",
					field: "ADDER_DESC",
					type:  "TextField"
				},{
					label: "Family",
					field: "ASP_PROD_FAMILY",
					type:  "TextField"
					
				}]],
				resubmit: {
					url: uServiceUrl + "/ui_adder_conf.xsjs"
				}
			}
		};
		
		//create
		config.insertRaw=[{
			field: "ADDER_NAME", label: "Adder Name", type: "TextField",
			validation: [{
				validType: lenovo.control.Validation.endWithDollorPercentage,
				errMsg: "Adder name should end width % or $"
			}]
		},{
			field: "ADDER_DESC", label: "Adder Description",  type:"TextField"
		},{
			field: "ASP_PROD_FAMILY", label: "ASP_PROD_FAMILY", type: "DropdownBox", 
			dropdownbox : {
				odata: {
					url: oServiceUrl+"/UI_ADDER_CONF_CREATE_DDL?$filter=ITEM_TYPE eq 'ASP_PROD_FAMILY'&$format=json",
					bindTextField:'ITEM_VALUE',
					bindKeyField:'ITEM_VALUE'
				}
			}
		}];
		
		config.create.columns = lenovo.control.commontable.Toolkit.splitChunck(1, config.insertRaw);
		config.create.url = "/UI_ADDER_CONF";
		
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
	getTBAType: function(oServiceUrl,adderName,tBATypeTextField){
		var lastLetter = adderName.substring(adderName.length-1);

		$.ajax({
			url: oServiceUrl + "/INPUT_ADDER_CONF_TBA(INPUT_ADDER_NAME='"+encodeURI(lastLetter)+"')/Results",
			type: "GET",
			dataType: "json", 
			success: function(data){
				var value = data.d.results[0].ITEM_VALUE;
				tBATypeTextField.setValue(value);
			}
		});	
	},
	createContent: function(){
		var app = new sap.m.App(); 

		var service = new lenovo.service.CFE();
		var oServiceUrl = service.getEBGCfe();
		var uServiceUrl = service.getEBGCfeUpload();

		var oModel = new sap.ui.model.odata.ODataModel(oServiceUrl, true);
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		var auth = lenovo.control.commontable.Table.getViewAuth("adderConfiguration");
		
		this.setConfig(config, oServiceUrl, uServiceUrl,auth);
		var header = lenovo.control.commontable.Table.createHeader("Ecomomic Adder", "Adder Configuration");

		config.bindRowUrl = "/UI_ADDER_CONF";
		var table = lenovo.control.commontable.Table.createTable(config);
		table.setBusy(true);
		table.setModel(oModel);
		oModel.attachRequestCompleted(function(){
			table.setBusy(false);
		});

		var filterPanel = lenovo.control.commontable.Table.createFilter(config, table);
		
		var oForm = filterPanel.getContent()[0];
		var cycleDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Cycle")[0];
		
		//toolbar	
		var oEditDeleteUploadDownload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table, app);	
		
		var oToolbarCtn = oEditDeleteUploadDownload.getContent()[0];	
		var buttons = oToolbarCtn.getContent();
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
		
		//filter, adder name,flexible cascade		
		var adderNameDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Adder Name")[0];
//		var flexibleDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Flexible")[0];
		var tbaTypeTextField = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "TBA Type")[0];
		/*lenovo.control.commontable.Toolkit.relateDropDwonBox(adderNameDropdownBox, flexibleDropdownBox, {
			transform: function (data){
				return data.d.results;
			},
			url: function(selectedKey){
				return oServiceUrl+"/INPUT_ADDER_CONF_FLEXIBLE(INPUT_ADDER_NAME='" + encodeURI(selectedKey) + "')/Results?$format=json";
			},
			bindTextField:"ITEM_VALUE",
			bindKeyField:"ITEM_VALUE"
		});*/
		
		//filter, addname, tba_type cascade
		var that = this;
		adderNameDropdownBox.attachChange(function(){
			var selectedKey = this.getSelectedKey();
			if(selectedKey === lenovo.control.Constants.allDropdownBoxListItem) {
				tbaTypeTextField.setValue(null);
			}else{
				//tBATypeTextField.setValue("anc");
				that.getTBAType(oServiceUrl,selectedKey,tbaTypeTextField);
			}
			console.log("selectedKey", selectedKey);
		});
	    
		//app
	    var page = new sap.m.Page({
	      	  showHeader: false,
	          content :[header, filterPanel, oEditDeleteUploadDownload, table]//[layout]                
	    });
        app.insertPage(page);
        app.setInitialPage(page);
        return app;	

	}
});