//Created by Zhang Ruixue at 2014-12-08
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
sap.ui.jsview("lenovo.view.cfe.costTape.compCostTape", {
	setConfig: function(config, oServiceUrl, auth){
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
			field: "PART_NUMBER", label: "Part_number", type:"TextField", width:"150px"
		},{
			field: "PLANT", label: "Plant", type: "TextField", width:"150px"
		},{
			field: "COST_ELEM", label: "Cost_Elem", type:"TextField", width:"150px"
		},{
			field: "DESCRIPTION", label: "Description", type:"TextField", width:"150px"
		},{
			field: "STATUS", label: "Status", type:"TextField", width:"150px"
		},{
			field: "COMMODITY", label: "Commodity", type:"TextField", width:"150px"
		},{
			field: "CURRENCY_NAME", label: "Currency", type:"TextField", width:"150px"
		},{
			field: "M1", label: labelArr.M1, type:"TextField", width:"150px"
		},{
			field: "M2", label: labelArr.M2, type:"TextField", width:"150px"
		},{
			field: "M3", label: labelArr.M3, type:"TextField", width:"150px"
		},{
			field: "M4", label: labelArr.M4, type:"TextField", width:"150px"
		},{
			field: "M5", label: labelArr.M5, type:"TextField", width:"150px"
		},{
			field: "M6", label: labelArr.M6, type:"TextField", width:"150px"
		},{
			field: "M7", label: labelArr.M7, type:"TextField", width:"150px"
		},{
			field: "M8", label: labelArr.M8, type:"TextField", width:"150px"
		},{
			field: "M9", label: labelArr.M9, type:"TextField", width:"150px"
		},{
			field: "M10", label: labelArr.M10, type:"TextField", width:"150px"
		},{
			field: "M11", label: labelArr.M11, type:"TextField", width:"150px"
		},{
			field: "M12", label: labelArr.M12, type:"TextField", width:"150px"
		},{
			field: "M13", label: labelArr.M13, type:"TextField", width:"150px"
		},{
			field: "M14", label: labelArr.M14, type:"TextField", width:"150px"
		},{
			field: "M15", label: labelArr.M15, type:"TextField", width:"150px"
		},{
			field: "M16", label: labelArr.M16, type:"TextField", width:"150px"
		},{
			field: "M17", label: labelArr.M17, type:"TextField", width:"150px"
		},{
			field: "M18", label: labelArr.M18, type:"TextField", width:"150px"
		},{
			field: "OWNER_COSTTAPE", label: "Owner", type:"TextField", width:"150px"
		},{
			field: "SYS_LAST_MODIFIED_BY", label: "Last Modified By", type:"TextField", width:"150px"
		},{
			field: "SYS_LAST_MODIFIED_DATE", label: "Last Modified Date", type:"TextField", width:"150px"
		}];
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
//		var headerHeight = 225;
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(3);

		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight);
		
		//filter
		config.filtersRaw = [{
			field: "CYCLE", label: "Cycle", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L5 M5 S5", linebreak: true}),
			dropdownbox : {
				defaultFilterValue: "CURRENT",	
				layout: new sap.ui.layout.GridData({span: "L7 M7 S7"}),
				odata:{
					defaultSelectAll: false,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_COST_TAPE_DROPDOWNLIST?$filter=ITEM_TYPE eq 'CYCLE'&$format=json"
				}				
			}
		},{
			field: "COMMODITY", label: "Commodity", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L5 M5 S5", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L7 M7 S7"}),
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_COST_TAPE_DROPDOWNLIST?$filter=ITEM_TYPE eq 'COMMODITY'&$format=json"
				}	
					
			}
		},{
			field: "PART_NUMBER", label: "Part Number", type: "DropdownTable",
			labelLayout: new sap.ui.layout.GridData({span: "L5 M5 S5", linebreak: true}),
			dropdowntable: {
				layout: new sap.ui.layout.GridData({span: "L7 M7 S7"}),
				defaultFilterOp: "EQ",
				url: oServiceUrl,
				bindRowUrl: "/UI_COST_TAPE_PARTNUMBER",
//				selectionMode: sap.ui.table.SelectionMode.Single,
				field: "PART_NUMBER",
				columns: [{
					label: "Part Number",
					field: "PART_NUMBER",
					type: "TextField"
				}],
				filters: [[{
					label: "Part Number",
					field: "PART_NUMBER",
					type: "MultiTextField",
					multitextfield: {
	//					defaultFilterOp: "EQ"
					}
				}]]
			}
		},{
			field: "OWNER_COSTTAPE", label: "Owner", type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_COST_TAPE_DROPDOWNLIST?$filter=ITEM_TYPE eq 'OWNER'&$format=json"
				}	
					
			}
		},{
			field: "PLANT", label: "Plant", type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_COST_TAPE_DROPDOWNLIST?$filter=ITEM_TYPE eq 'PLANT'&$format=json"
				}	
					
			}
		},{
			field: "COST_ELEM", label: "Cost Elem", type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_COST_TAPE_DROPDOWNLIST?$filter=ITEM_TYPE eq 'COST_ELEM'&$format=json"
				}	
					
			}
		},{
			field: "STATUS", label: "Status", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L4 M4 S4"}),
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_COST_TAPE_DROPDOWNLIST?$filter=ITEM_TYPE eq 'IS_VALIDATE'&$format=json"
				}	
					
			}
		},{
			field: "SYS_LAST_MODIFIED_DATE", label: "Last Modified Date", type: "TimeRange",
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true})
		},{
			field:"SYS_LAST_MODIFIED_BY", label: "Last Modified By", type: "TextField",
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
		}];

		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);
		config.filterLayout = {
				0: new sap.ui.layout.GridData({span: "L3 M3 S3"}),
				1: new sap.ui.layout.GridData({span: "L3 M3 S3"}),
				2: new sap.ui.layout.GridData({span: "L6 M6 S6"})	
			};
		//edit		
		config.editRaw = [{
			field: "M1", 
		    label: labelArr.M1,
		    validation: [{
		    	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M2", 
			label: labelArr.M2,
			validation: [{
			    validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M3", 
			label: labelArr.M3,
			validation: [{
			   	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M4", 
			label: labelArr.M4,
			validation: [{
			   	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M5", 
			label: labelArr.M5,
			validation: [{
			   	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M6", 
			label: labelArr.M6,
			validation: [{
			   	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M7", 
			label: labelArr.M7,
			validation: [{
			   	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M8", 
			label: labelArr.M8,
			validation: [{
			   	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M9", 
			label: labelArr.M9,
			validation: [{
			   	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M10", 
			label: labelArr.M10,
			validation: [{
			   	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M11", 
			label: labelArr.M11,
			validation: [{
			   	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M12", 
			label: labelArr.M12,
			validation: [{
			   	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M13", 
			label: labelArr.M13,
			validation: [{
			   	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M14", 
			label: labelArr.M14,
			validation: [{
			   	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M15", 
			label: labelArr.M15,
			validation: [{
			   	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M16", 
			label: labelArr.M16,
			validation: [{
			   	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M17", 
			label: labelArr.M17,
			validation: [{
			   	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M18", 
			label: labelArr.M18,
			validation: [{
			   	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		}];
			
		//download
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.ui_cost_tape/CV_UI_COST_TAPE"';
		config.download.columns=[
		                         "PART_NUMBER", "PLANT", "COST_ELEM", "DESCRIPTION", "STATUS", 
		                         "COMMODITY", "CURRENCY_NAME", "M1", "M2", "M3", "M4", "M5", 
		                         "M6", "M7", "M8", "M9", "M10", "M11", "M12", "M13", "M14", "M15", "M16", "M17", "M18",
		                         "OWNER_COSTTAPE", "SYS_LAST_MODIFIED_BY", "SYS_LAST_MODIFIED_DATE"
		                         ];
		config.download.filename= "UI_COST_TAPE";
		
		//toolbar , auth
		config.edit.visible = auth.editable;
		config.download.visible = auth.exportable;
		config.create.visible=false;
		config.deleteable.visible = auth.deleteable;
		config.upload.visible=false;
		config.download.roleName = auth.exportableRoleName;
	},
	createContent: function(){
		var app = new sap.m.App(); 

		var service = new lenovo.service.CFE();
		var oServiceUrl = service.getEBGCfe();
		
		var oModel = new sap.ui.model.odata.ODataModel(oServiceUrl, true);
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		var auth = lenovo.control.commontable.Table.getViewAuth("compCostTape");		
		this.setConfig(config, oServiceUrl,auth);
		var header = lenovo.control.commontable.Table.createHeader("Cost Tape", "Comp Cost Tape");

		config.bindRowUrl = "/UI_COST_TAPE";
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
		
		searchBtn.attachPress(function(){			
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
						var oStartIndex = 7;
						for(var i=oStartIndex; i<oStartIndex+18; i++){
							var oAttName = "M"+(i-oStartIndex+1);
							oColumns[i].setLabel(new sap.ui.commons.Label({
								text: labelArr[oAttName]
							}));
						}
						
					}			
				}
			});
					
		});
		
		//toolbar	
		var oEditDeleteUploadDownload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table, app);
		if(auth.editable){
			var buttons = oEditDeleteUploadDownload.getContent()[0].getContent();
			var editButton = null;
			for(var i = 0; i < buttons.length; i++) {
				var oTooltip = buttons[i].getTooltip();
				if(oTooltip === "edit"){
					editButton = buttons[i];
					break;
				}	
			}
			cycleDropdownBox.attachChange(function(){
				var selectedKey = this.getSelectedKey();
				if(selectedKey === "CURRENT") {
					editButton.setVisible(true);
				} else {
					editButton.setVisible(false);
				}
			});	
		}
		
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