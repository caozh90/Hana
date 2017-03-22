//Created by Zhang Ruixue at 2014-12-08
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
sap.ui.jsview("lenovo.view.cfe.costTape.compCostUpload", {
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
			field: "PART_NUMBER", label: "Part_number", type:"TextField",width:"150px"
		},{
			field: "MFG_PLANT", label: "Plant", type: "TextField",width:"100px"
		},{
			field: "COST_ELEM", label: "Cost_Elem", type:"TextField",width:"100px"
		},{
			field: "DESCRIPTION", label: "Description", type:"TextField",width:"200px"
		},{
			field: "STATUS", label: "Status", type:"TextField",width:"150px"
		},{
			field: "COMMODITY", label: "Commodity", type:"TextField",width:"150px"
		},{
			field: "CURRENCY_NAME", label: "Currency", type:"TextField",width:"100px"
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
			field: "OWNER_COSTTAPE", label: "Owner", type:"TextField",width:"200px"
		},{
			field: "SYS_LAST_MODIFIED_BY", label: "Last Modified By", type:"TextField",width:"200px"
		},{
			field: "SYS_LAST_MODIFIED_DATE", label: "Last Modified Date", type:"TextField",width:"200px"
		}];
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
//		var headerHeight = 255;
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(4);
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
					url: oServiceUrl +"/CFE_UI_COST_TAPE_ORI_DROPDOWNLIST?$filter=ITEM_TYPE eq 'CYCLE'&$orderby=ITEM_VALUE desc&$format=json"
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
					url: oServiceUrl +"/CFE_UI_COST_TAPE_ORI_DROPDOWNLIST?$filter=ITEM_TYPE eq 'COMMODITY'&$format=json"
				}	
					
			}
		},{
			field: "PART_NUMBER", label: "Part Number", type: "DropdownTable",
			labelLayout: new sap.ui.layout.GridData({span: "L5 M5 S5", linebreak: true}),
			dropdowntable: {
				layout: new sap.ui.layout.GridData({span: "L7 M7 S7"}),
				defaultFilterOp: "EQ",
				url: oServiceUrl,
				bindRowUrl: "/UI_COST_TAPE_ORI_PARTNUMBER",
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
					url: oServiceUrl +"/CFE_UI_COST_TAPE_ORI_DROPDOWNLIST?$filter=ITEM_TYPE eq 'OWNER_COSTTAPE'&$format=json"
				}	
					
			}
		},{
			field: "MFG_PLANT", label: "Plant", type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/CFE_UI_COST_TAPE_ORI_DROPDOWNLIST?$filter=ITEM_TYPE eq 'MFG_PLANT'&$format=json"
				}	
					
			}
		},{
			field: "COST_ELEM", label: "Cost Elem", type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/CFE_UI_COST_TAPE_ORI_DROPDOWNLIST?$filter=ITEM_TYPE eq 'COST_ELEM'&$format=json"
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
					url: oServiceUrl +"/CFE_UI_COST_TAPE_ORI_DROPDOWNLIST?$filter=ITEM_TYPE eq 'STATUS'&$format=json"
				}	
					
			}
		},{
			field: "SYS_LAST_MODIFIED_DATE", label: "Last Modified Date", type: "TimeRange",
			labelLayout: new sap.ui.layout.GridData({span: "L2 M2 S2", linebreak: true})
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
		config.download.url = "/cdp/common/services/getFileWithTableInputParas.xsjs";
		config.download.tablewithinputpara = '"_SYS_BIC"."cdp.ebgcfe.models.ui_cost_tape_ori/CV_UI_COST_TAPE_ORI"';
		config.download.urlInputParas = [{item: "IN_CYCLE", value:"", bindFilterPath:"CYCLE"}];
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.ui_cost_tape_ori/CV_UI_COST_TAPE_ORI"'
		config.download.columns=[
		                         "CYCLE","PART_NUMBER", "MFG_PLANT", "COST_ELEM", "COMMODITY", "CURRENCY_NAME",
		                         "DESCRIPTION","STATUS",
		                         "M1", "M2", "M3", "M4", "M5", 
		                         "M6", "M7", "M8", "M9", "M10", "M11", "M12",
		                         "M13", "M14", "M15", "M16", "M17", "M18", "OWNER_COSTTAPE",
		                         "SYS_LAST_MODIFIED_DATE","SYS_LAST_MODIFIED_BY"
		                         ];
		config.download.filename= "UI_COST_TAPE_ORI";
		
		
		//upload
		config.upload = {
			url: uServiceUrl + "/ui_comp_cost_upload_mid.xsjs",
			excelUrl: "cfe/costTape/comp_cost_upload.xlsx"
		};
		config.viewstatus = {
		    /*****************************
		     * Add New Function -- View State download Btn
		     * Chris Gao
		     * 2015.08.13
		     ****************************/
			viewUploadHistory: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'UI_COST_TAPE_ORI'",
				selectionMode: sap.ui.table.SelectionMode.Single,
				columns:[{
					label: "CODE",
					field: "CODE",
					type: "TextField"
				},{
					label: "BUSINESS NAME",
					field: "BUSINESS_NAME",
					type: "TextField"
				},{
					label: "BUSINESS_TIME",
					field: "BUSINESS_TIME",
					type: "TextField"
				},{
					label: "SUCCESS",
					field: "SUCCESS",
					type: "TextField"
				},{
					label: "ERROR",
					field: "ERROR",
					type: "TextField"
				},{
					label: "OPTION",
					field: "OPTION",
					type: "SubDownloadButton"
				}],
				viewUploadHistoryDownload : {
					table: '"_SYS_BIC"."cdp.ebgcfe.models.ui_upload/CV_UI_UPLOAD_ERR_DETAIL"',
					columns: [
		                         "ERROR_MESSAGE","PRODUCT_GROUP", "PART_NUMBER", "MFG_PLANT", "CYCLE", "COST_ELEM",
		                         "COMMODITY","CURRENCY_NAME","OWNER_COSTTAPE",
		                         "M1", "M2", "M3", "M4", "M5", 
		                         "M6", "M7", "M8", "M9", "M10", "M11", "M12",
		                         "M13", "M14", "M15", "M16", "M17", "M18"
		                         ],
		            bindRowFilterParameter: "CODE",
		            countServiceUrl: "UI_UPLOAD_ERR_DETAIL",
		            rolename : auth.exportableRoleName 
				}
				
			},
			viewErrorInfo: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_ERR_INFO"
			},
			viewUploadErrorDetail: {
				url: uServiceUrl + "/upload.xsodata/UI_COST_TAPE_ORI_ERR_DETAIL?$format=json",
				columns: [[/*{
					label: "Cycle",
					field: "CYCLE",
					type:  "TextField"
				},*/{
					label: "Part Number",
					field: "PART_NUMBER",
					type:  "TextField"
				},{
					label: "Mfg Plant",
					field: "MFG_PLANT",
					type:  "TextField"
				},{
					label: "Cost Elem",
					field: "COST_ELEM",
					type:  "TextField"
				},{
					label: "Commodity",
					field: "COMMODITY",
					type:  "TextField"
				},{
					label: "Currency Name",
					field: "CURRENCY_NAME",
					type:  "TextField"
				},{
					field: "M1", label: "M1", type:"TextField"
				},{
					field: "M2", label: "M2", type:"TextField"
				},{
					field: "M3", label: "M3", type:"TextField"
				},{
					field: "M4", label: "M4", type:"TextField"
				},{
					field: "M5", label: "M5", type:"TextField"
				},{
					field: "M6", label: "M6", type:"TextField"
				},{
					field: "M7", label: "M7", type:"TextField"
				}],[{
					field: "M8", label: "M8", type:"TextField"
				},{
					field: "M9", label: "M9", type:"TextField"
				},{
					field: "M10", label: "M10", type:"TextField"
				},{
					field: "M11", label: "M11", type:"TextField"
				},{
					field: "M12", label: "M12", type:"TextField"
				},{
					field: "M13", label: "M13", type:"TextField"
				},{
					field: "M14", label: "M14", type:"TextField"
				},{
					field: "M15", label: "M15", type:"TextField"
				},{
					field: "M16", label: "M16", type:"TextField"
				},{
					field: "M17", label: "M17", type:"TextField"
				},{
					field: "M18", label: "M18", type:"TextField"
				},{
					field: "OWNER_COSTTAPE", label: "Owner", type:"TextField"
				}]],
				resubmit: {
					url: uServiceUrl + "/ui_comp_cost_upload_mid.xsjs"
				}
			}
			
		};
		
		
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
	selectedActivate: function(table, oServiceUrl){
		sap.ui.commons.MessageBox.confirm("Do you want to activate the selected items?", function(result){
			if(result){
				var selectedIndices = table.getSelectedIndices();
				if(selectedIndices.length == 0) {
					lenovo.control.commontable.Toolkit.showErrorMsg("Please select an item", "ERROR", "Selected Activate");
					return;
				}
				/*************************
				 * To get if full calculation is running
				 * Chris Gao
				 ************************/
				var service = new lenovo.service.CFE();
				var logicServiceUrl = service.getEBGCfeLogic();
				//if full calculation is running 
				$.ajax({
					async: false,
					type: "GET",
					url: logicServiceUrl+ "/ui_full_calc_running.xsjs",
					success: function(data){
						if(data == 0)
						{
							var activateArr = [];
							for(var i = 0; i < selectedIndices.length; i++) {
								var index = table.getContextByIndex(selectedIndices[i]);
							    var selectedObject = index.getObject();
//							    if(selectedObject.STATUS !='INACTIVE'){
//							    	lenovo.control.commontable.Toolkit.showErrorMsg("The status must be 'INACTIVE'", "ERROR", "Selected Activate");
//									table.clearSelection();
//							    	return;
//							    }else{			    	
							    	var oPartNum = selectedObject.PART_NUMBER, oPlant =  selectedObject.MFG_PLANT;
							    	var oExist= false;
							    	for(var j=0, jl=activateArr.length; j<jl; j++){
							    		if(activateArr[j].PART_NUMBER == oPartNum && activateArr[j].MFG_PLANT == oPlant){
							    			var oNum = activateArr[j].COUNT;
							    			activateArr[j].COUNT = oNum+1;
							    			oExist=true;
							    			break;
							    		}
							    	}
							    	
							    	if(oExist==false){
							    		activateArr.push({
								    		"PART_NUMBER": selectedObject.PART_NUMBER,
								    		"MFG_PLANT": selectedObject.MFG_PLANT,
								    		"COST_ELEM": selectedObject.COST_ELEM,
								    		"COUNT": 1
								    	});
							    	}
							    	
//							    }
							}
							
							var objNum = 0, activateLen=activateArr.length;
							for(var i=0; i<activateLen; i++){
						    	var oPartNum = activateArr[i].PART_NUMBER, 
						    	oPlant =  activateArr[i].MFG_PLANT,
						    	oCount = activateArr[i].COUNT;
						    	oCostElem = activateArr[i].COST_ELEM;
								var oUrl= oServiceUrl+ "/CFE_UI_COST_TAPE_ORI/$count?$filter=(CYCLE eq 'CURRENT' and PART_NUMBER eq '"
										+ oPartNum +"' and MFG_PLANT eq '"+oPlant + "' and COST_ELEM eq '" + oCostElem
										+ "' and STATUS eq 'INACTIVE')";
								
								$.ajax({
									url:oUrl,
									async:false,
									success: function(data){
										if(oCount < data){
											lenovo.control.commontable.Toolkit.showErrorMsg("Not enough items for "
													+"PART NUMBER='"+ oPartNum +"', MFG_PLANT='"+ oPlant + "',COST_ELEM='" + oCostElem
													+"'","ERROR", "Selected Activate");
											return;
										}else{
											objNum++;
										}
									}
								});
								
							}
											
							if(activateLen>0 && objNum==activateLen){	
								var service = new lenovo.service.CFE();
								var logicServiceUrl = service.getEBGCfeLogic();
								var activateObj={"data":activateArr};
								table.setBusy(true);
								$.ajax({
									url: logicServiceUrl+ "/ui_cost_tape_ori_activate.xsjs",
									contentType:"application/json",
									type:"POST",
									data:JSON.stringify(activateObj),
									success: function(){
										lenovo.control.commontable.Toolkit.showErrorMsg("Successfully activate", "SUCCESS", "Activate");
										table.clearSelection();
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
										lenovo.control.commontable.Toolkit.showErrorMsg(err, "ERROR", "Activate");	
									}
								});
							}
						}
						else
						{
							lenovo.control.commontable.Toolkit.showErrorMsg("Full Calculation is running.", "ERROR", "Full Calc Running");
							return;
						}
					},
				});
				
			}
		}, "Confirm");
	},
	activateAll: function(table){
		sap.ui.commons.MessageBox.confirm("Do you want to activate all items?", function(result){
			if(result){
				var service = new lenovo.service.CFE();
				var logicServiceUrl = service.getEBGCfeLogic();
				/*************************
				 * To get if full calculation is running
				 * Chris Gao
				 ************************/
				//if full calculation is running 
				$.ajax({
					async: false,
					type: "GET",
					url: logicServiceUrl+ "/ui_full_calc_running.xsjs",
					success: function(data){
						if(data == 0)
						{
							table.setBusy(true);
							$.ajax({
								url: logicServiceUrl+ "/ui_cost_tape_ori_activate.xsjs",
								success: function(data){
									lenovo.control.commontable.Toolkit.showErrorMsg("Successfully activate", "SUCCESS", "Activate");
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
									lenovo.control.commontable.Toolkit.showErrorMsg(err, "ERROR", "Activate");	
								}
							});
						}
						else
						{
							lenovo.control.commontable.Toolkit.showErrorMsg("Full Calculation is running.", "ERROR", "Full Calc Running");
						}
					}
				});
				
			}
		}, "Confirm");
		
	},
	createContent: function(){
		var app = new sap.m.App(); 

		var service = new lenovo.service.CFE();
		var oServiceUrl = service.getEBGCfe();
		var uServiceUrl = service.getEBGCfeUpload();

		var oModel = new sap.ui.model.odata.ODataModel(oServiceUrl, true);
		oModel.setDefaultCountMode("None");
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		var auth = lenovo.control.commontable.Table.getViewAuth("compCostUpload");		
		this.setConfig(config, oServiceUrl, uServiceUrl,auth);
		var header = lenovo.control.commontable.Table.createHeader("Cost Tape", "Comp Cost Upload");
		
		config.searchInputs = {
				hasInputPara: true,
				urlId : "/IN_CFE_UI_COST_TAPE_ORI",
				urlInputParas:[{item: "IN_CYCLE", value:"", bindFilterPath:"CYCLE"}]
			};
		config.bindRowUrl = "/IN_CFE_UI_COST_TAPE_ORI(IN_CYCLE='CURRENT')/Results";
		
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
		var that = this;			

		var oToolbarCtn = oEditDeleteUploadDownload.getContent()[0];
		var oSelectActivateBtn = new sap.ui.commons.Button({
			lite: true,
			icon: "sap-icon://flag",
			tooltip: "selected activate",
			press: function(){
				that.selectedActivate(table, oServiceUrl);
			}
		}).addStyleClass("commontable-toolbar-btn");
			
		var oActivateAllBtn = new sap.ui.commons.Button({
			lite: true,
			icon: "resource/img/Flag_All.png",
			tooltip: "activate all",
			press: function(){
				that.activateAll(table);
			}
		}).addStyleClass("commontable-toolbar-btn");

		for (var i in auth) {
			switch(i) {
				case "activatable":
					oToolbarCtn.insertContent(oSelectActivateBtn,0);
					break;
				case "activateall":
					oToolbarCtn.insertContent(oActivateAllBtn,1);
					break;
			}
		}
				
		
		

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
		/***********************************
		 * CYCLE != CURRENT edit,delete unvisible
		 * Added by Chris Gao
		 * 2015-09-08
		 **********************************/
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
				oActivateAllBtn.setVisible(true);
				oSelectActivateBtn.setVisible(true);
				
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
				oActivateAllBtn.setVisible(false);
				oSelectActivateBtn.setVisible(false);
			}
		});
		
		/*********************
		 * End by Chris Gao
		 * 2015-09-08
		 *********************/
		
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