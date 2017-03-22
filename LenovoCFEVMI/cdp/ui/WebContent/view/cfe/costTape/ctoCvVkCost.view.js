//Created by Leon Bian at 2015-9-1
//updated by Chris Gao at 2015-09-16
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE"); 
jQuery.sap.require("lenovo.control.Validation");
sap.ui.jsview("lenovo.view.cfe.costTape.ctoCvVkCost", {
	setConfig: function(config, oServiceUrl, uServiceUrl, auth){
		//table		
		config.columns = [{
			field: "PH", label: "PH", type:"TextField",width:"150px"
		},{
			field: "SALES_ORG", label: "Sales Org", type: "TextField",width:"150px"
		},{
			field: "CHARACTERISTIC", label: "Characteristic", type:"TextField",width:"150px"
		},{
			field: "VARIANT", label: "Variant", type:"TextField",width:"150px"
		},{
			field: "M1", label: "Cost Value", type:"TextField", width:"150px"
		},{
			field: "SYS_LAST_MODIFIED_BY", label: "Last Modified By", type:"TextField",width:"200px"
		},{
			field: "SYS_LAST_MODIFIED_DATE", label: "Last Modified Date", type:"TextField",width:"200px"
		}];
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
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
					url: oServiceUrl +"/UI_CTO_CV_VK_COST_SEARCH_DDL?$filter=ITEM_TYPE eq 'CYCLE'&$format=json"
				}				
			}
		},{
			field: "PH_4", label: "PH4", type: "TextField", 
		},{
			field: "PH_1", label: "PH1", type: "TextField", 
		},{
			field: "SALES_ORG", label: "Sales Org", type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_CTO_CV_VK_COST_SEARCH_DDL?$filter=ITEM_TYPE eq 'SALES_ORG'&$format=json"
				}	
					
			}
		},{
			field: "PH_2", label: "PH2", type: "TextField", 
		},{
			field: "CHARACTERISTIC", label: "Characteristic", type: "TextField", 
			//labelLayout: new sap.ui.layout.GridData({span: "L5 M5 S5", linebreak: true}),
		},{
			field: "PH_3", label: "PH3", type: "TextField", 
		},{
			field: "VARIANT", label: "Variant", type: "TextField", 
			//labelLayout: new sap.ui.layout.GridData({span: "L5 M5 S5", linebreak: true}),
		}];

		config.filters = lenovo.control.commontable.Toolkit.splitChunck(4, config.filtersRaw);
/*		config.filterLayout = {
				0: new sap.ui.layout.GridData({span: "L3 M3 S3"}),
				1: new sap.ui.layout.GridData({span: "L3 M3 S3"}),
				2: new sap.ui.layout.GridData({span: "L6 M6 S6"})	
			};*/
		
		//edit		
		config.editRaw = [{
			field: "M1", 
		    label: "Cost Value",
		    validation: [{
		    	validType: /^\d{0,11}(\.\d{0,})?$/,
				errMsg: "The data type of this field is Float (11,n)!"
			}]
		}];
		
		//download
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.ui_cto_cv_vk_cost/CV_UI_CTO_CV_VK_COST"';
		config.download.columns=[
		                        "CYCLE","PH_1", "PH_2", "PH_3", "PH_4", "SALES_ORG", "CHARACTERISTIC", "VARIANT", "M1"
		                         ];
		config.download.filename= "UI_CTO_CV_VK_COST";
		
		//upload
		config.upload = {
			url: uServiceUrl + "/ui_cto_cv_vk_cost.xsjs",
			excelUrl: "cfe/costTape/cto_cv_vk_cost.xlsx"
		};
		config.viewstatus = {
			viewUploadHistory: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'UI_CTO_CV_VK_COST'",
				selectionMode: sap.ui.table.SelectionMode.Single
			},
			viewErrorInfo: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_ERR_INFO"
			},
			viewUploadErrorDetail: {
				url: uServiceUrl + "/upload.xsodata/UI_CTO_CV_VK_COST_ERR_DETAIL?$format=json",
				columns: [[{
					label: "CYCLE",
					field: "CYCLE",
					type:  "TextField"
				},{
					label: "Characteristic",
					field: "CHARACTERISTIC",
					type:  "TextField"
				},{
					label: "Variant",
					field: "VARIANT",
					type:  "TextField"
				},{
					label: "Sales Org",
					field: "SALES_ORG",
					type:  "TextField"
				},{
					label: "PH1",
					field: "PH_1",
					type:  "TextField"
					
				},{
					label: "PH2",
					field: "PH_2",
					type:  "TextField"
					
				},{
					label: "PH3",
					field: "PH_3",
					type:  "TextField"
					
				},{
					label: "PH4",
					field: "PH_4",
					type:  "TextField"
					
				},{
					field: "M1", label: "Cost Value", type:"TextField"
				}]],
				resubmit: {
					url: uServiceUrl + "/ui_cto_cv_vk_cost.xsjs"
				}
			}
		};
		
		//create
		config.insertRaw=[{
			field: "PH_1", label: "PH1", type:"TextField", 
			required: true,
			validation: [{
				validType:  /^\s*[\s\S]{1,1}\s*$/,
				errMsg: "The date length of this field is 1!"
			}]
		},{
			field: "PH_2", label: "PH2", type:"TextField", 
			required: true,
			validation: [{
				validType:  /^\s*[\s\S]{3,3}\s*$/,
				errMsg: "The date length of this field is 3!"
			}]
		},{
			field: "PH_3", label: "PH3", type:"TextField", 
			required: true,
			validation: [{
				validType:  /^\s*[\s\S]{3,3}\s*$/,
				errMsg: "The date length of this field is 3!"
			}]
		},{
			field: "PH_4", label: "PH4", type:"TextField", 
			required: true,
			validation: [{
				validType:  /^\s*[\s\S]{4,4}\s*$/,
				errMsg: "The date length of this field is 4!"
			}]
		},{
			field: "SALES_ORG", label: "Sales Org", type:"DropdownBox",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
			dropdownbox : {
				odata:{
					url: oServiceUrl+"/UI_CTO_CV_VK_COST_CREATE_DDL?$filter=ITEM_TYPE eq 'SALES_ORG'&$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			},
		},{
			field: "CHARACTERISTIC", label: "Characteristic",  type:"TextField",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}]
			
		},{
			field: "VARIANT", label: "Variant",  type:"TextField",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}]
		},{
			field: "M1", label: "Cost Value", type:"TextField",
			required: true,
			validation: [{
				validType: /^\d{0,11}(\.\d{0,})?$/,
				errMsg: "The data type of this field is Float (11,n)!"
			}]//updated by Chris Gao at 2015-09-16
		}];
		
		config.create.columns = lenovo.control.commontable.Toolkit.splitChunck(2, config.insertRaw);
		config.create.url = "/UI_CTO_CV_VK_COST";
		config.create.fakeData = {
				"CYCLE":"CURRENT",			
				"PRODUCT_GROUP":"EBG"	
		};
		
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
	createContent: function(){
		var app = new sap.m.App(); 

		var service = new lenovo.service.CFE();
		var oServiceUrl = service.getEBGCfe();
		var uServiceUrl = service.getEBGCfeUpload();

		var oModel = new sap.ui.model.odata.ODataModel(oServiceUrl, true);
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		var auth = lenovo.control.commontable.Table.getViewAuth("ctoCvVkCost");
		
		this.setConfig(config, oServiceUrl, uServiceUrl,auth);
		var header = lenovo.control.commontable.Table.createHeader("Cost Tape", "CTO-CV VK Cost");

		config.bindRowUrl = "/UI_CTO_CV_VK_COST";
		var table = lenovo.control.commontable.Table.createTable(config);
		table.setBusy(true);
		table.setModel(oModel);
		oModel.attachRequestCompleted(function(){
			table.setBusy(false);
		});
		
		var filterPanel = lenovo.control.commontable.Table.createFilter(config, table);
		
		var oFilterBtn = filterPanel.getButtons();
		var searchBtn = null;
		for(var i = 0; i < oFilterBtn.length; i++) {
			var oTooltip = oFilterBtn[i].getTooltip();
			if(oTooltip==="search"){
				searchBtn = oFilterBtn[i];
				break;	
			}	
		}

		var oForm = filterPanel.getContent()[0];
		var cycleDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Cycle")[0];
		
		/*searchBtn.attachPress(function(){			
			var selectedKey = cycleDropdownBox.getSelectedKey();
			$.ajax({
				url:oServiceUrl+"/V_CYCLE(INPUT_CYCLE='"+selectedKey+"')/Results?$format=json",
				type:"GET",
				dataType:"json",
				success: function(data){
					var oResult = data.d.results;
					if(oResult.length>0){
						var labelArr = oResult[0];
						var oColumns = table.getColumns();
						var oStartIndex = 4;
						for(var i=oStartIndex; i<oStartIndex+18; i++){
							var oAttName = "M"+(i-oStartIndex+1);
							oColumns[i].setLabel(new sap.ui.commons.Label({
								text: labelArr[oAttName]
							}));
						}
						
					}			
				}
			});
					
		});*/
		
		//toolbar	
		var oEditDeleteUploadDownload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table, app);	
		
		var oToolbarCtn = oEditDeleteUploadDownload.getContent()[0];	
		var buttons = oToolbarCtn.getContent();
		var createButton = null, editButton = null, uploadButton = null,deleteButton = null, uploadTemButton = null, viewStatusButton = null;
		for(var i = 0; i < buttons.length; i++) {
			var oTooltip = buttons[i].getTooltip();
			
			if(auth.createable && oTooltip === 'create an item'){
				createButton = buttons[i];
				continue;
			}
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
		 * Modified by Chris Gao
		 * 2015-09-08
		 **********************************/
		cycleDropdownBox.attachChange(function(){
			var selectedKey = this.getSelectedKey();
			if(selectedKey === "CURRENT") {
				if(createButton){
					createButton.setVisible(true);
				}
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
				if(createButton){
					createButton.setVisible(false);
				}
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