 //Created by Zhang Ruixue at 2014-12-25
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.control.Validation");
jQuery.sap.require("lenovo.service.CFE");
sap.ui.jsview("lenovo.view.cfe.controlPoint.newCycle", {
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
			field: "CYCLE", label: "Cycle", type:"TextField",width:"150px"
		},{
			field: "CYCLE_NAME", label: "Cycle Name", type: "TextField",width:"150px"
		},{
			field: "CYCLE_FCST_MONTH", label: "Forcast Month", type:"TextField",width:"150px"
		},{
			field: "LAST_CYCLE", label: "Last Cycle", type:"TextField",width:"150px"
		},{
			field: "CYCLE_CUR_MONTH", label: "Cycle Month", type:"TextField",width:"150px"
		},{
			field: "CYCLE_TYPE", label: "Cycle Type", type:"TextField",width:"150px"
		},{
			field: "M1", label: labelArr.M1, type:"TextField", width:"100px"
		},{
			field: "M2", label: labelArr.M2, type:"TextField", width:"100px"
		},{
			field: "M3", label: labelArr.M3, type:"TextField", width:"100px"
		},{
			field: "M4", label: labelArr.M4, type:"TextField", width:"100px"
		},{
			field: "M5", label: labelArr.M5, type:"TextField", width:"100px"
		},{
			field: "M6", label: labelArr.M6, type:"TextField", width:"100px"
		},{
			field: "M7", label: labelArr.M7, type:"TextField", width:"100px"
		},{
			field: "M8", label: labelArr.M8, type:"TextField", width:"100px"
		},{
			field: "M9", label: labelArr.M9, type:"TextField", width:"100px"
		},{
			field: "M10", label: labelArr.M10, type:"TextField", width:"100px"
		},{
			field: "M11", label: labelArr.M11, type:"TextField", width:"100px"
		},{
			field: "M12", label: labelArr.M12, type:"TextField", width:"100px"
		},{
			field: "M13", label: labelArr.M13, type:"TextField", width:"100px"
		},{
			field: "M14", label: labelArr.M14, type:"TextField", width:"100px"
		},{
			field: "M15", label: labelArr.M15, type:"TextField", width:"100px"
		},{
			field: "M16", label: labelArr.M16, type:"TextField", width:"100px"
		},{
			field: "M17", label: labelArr.M17, type:"TextField", width:"100px"
		},{
			field: "M18", label: labelArr.M18, type:"TextField", width:"100px"
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
			dropdownbox : {
				defaultFilterValue: "CURRENT",
				odata:{
					defaultSelectAll: false,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/CFE_UI_CYCLE_DDL?$filter=ITEM_TYPE eq 'CYCLE'&$format=json"
				}				
			}
		},{
			field: "LAST_CYCLE", label: "Last Cycle", type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/CFE_UI_CYCLE_DDL?$filter=ITEM_TYPE eq 'LAST_CYCLE'&$format=json"
				}	
					
			}
		},{
			field: "CYCLE_NAME", label: "Cycle Name", type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/CFE_UI_CYCLE_DDL?$filter=ITEM_TYPE eq 'CYCLE_NAME'&$format=json"
				}	
					
			}
		},{
			field: "CYCLE_CUR_MONTH", label: "Cycle Month", type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/CFE_UI_CYCLE_DDL?$filter=ITEM_TYPE eq 'CYCLE_CUR_MONTH'&$format=json"
				}	
					
			}
		},{
			field: "CYCLE_FCST_MONTH", label: "Forcast Month", type: "DropdownBox", 
//			labelLayout: new sap.ui.layout.GridData({span: "L5 M5 S5", linebreak: true}),
			dropdownbox : {
//				layout: new sap.ui.layout.GridData({span: "L7 M7 S7"}),
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/CFE_UI_CYCLE_DDL?$filter=ITEM_TYPE eq 'CYCLE_FCST_MONTH'&$format=json"
				}	
					
			}
		},{
			field: "CYCLE_TYPE", label: "Cycle Type",type: "DropdownBox",
//			labelLayout: new sap.ui.layout.GridData({span: "L5 M5 S5", linebreak: true}),
			dropdownbox : {
//				layout: new sap.ui.layout.GridData({span: "L7 M7 S7"}),
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/CFE_UI_CYCLE_DDL?$filter=ITEM_TYPE eq 'CYCLE_TYPE'&$format=json"
				}	
					
			}
		},{
			field: "CYCLE_STATUS", label: "Cycle Status",type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/CFE_UI_CYCLE_DDL?$filter=ITEM_TYPE eq 'CYCLE_STATUS'&$format=json"
				}	
					
			}
		}];

		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);

		//create
		config.insertRaw=[{
			field: "CYCLE_NAME", label: "Cycle Name",  type:"TextField",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Cycle Name is required"
			}]
		},{
			field: "CYCLE_MONTH", label: "Cycle Month",  type:"DatePicker",
			datepicker: {
				format: 'MM/dd/yyyy'
			},
			required: true,
			validation: [{
				validType:lenovo.control.Validation.require,
				errMsg: "Cycle Month is required"
			}]
		},{
			field: "FORCAST_MONTH", label: "Forcast Month",  type:"DatePicker",
			datepicker: {
				format: 'MM/dd/yyyy'
			},
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Forcast Month is required"
			}]
		},{
			field: "CYCLE_TYPE", label: "Cycle Type",  type:"DropdownBox",
			//modified by Chris Gao 2015-10-19
//			dropdownbox: {
//				data: [{
//					key: "FINAL",
//					text: "FINAL"
//				},{
//					key: "B",
//					text: "B"
//				}]
//			},
			dropdownbox : {
				
				odata:{
					url: oServiceUrl +"/CFE_UI_CYCLE_CREATE_DDL?$filter=ITEM_TYPE eq 'CYCLE_TYPE' &$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			},
			//end modification
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Cycle Type is required"
			}]
		}];
		config.create = {
			tooltip: "create new cycle",
			columns: lenovo.control.commontable.Toolkit.splitChunck(2, config.insertRaw),
			insert: {
				func: this.createNewCycle, 
				context: this
			}
		};
		
		//download
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.ui_cycle/CV_UI_CYCLE"';
		config.download.columns=[
		                         "CYCLE", "CYCLE_NAME", "CYCLE_FCST_MONTH", "LAST_CYCLE",
		                         "CYCLE_CUR_MONTH","CYCLE_TYPE", "M1", "M2", "M3", "M4", "M5", 
		                         "M6", "M7", "M8", "M9", "M10", "M11", "M12", "M13", "M14", "M15", "M16", "M17", "M18",
		                         "SYS_LAST_MODIFIED_BY", "SYS_LAST_MODIFIED_DATE"
		                         ];
		config.download.filename= "UI_CYCLE";
		//toolbar , auth
		config.edit.visible = false;
		config.deleteable.visible = false;
		config.upload.visible = false;
		config.create.visible = true;
		config.download.visible = auth.exportable;
		config.download.roleName = auth.exportableRoleName;

	},
	createNewCycle: function(config, insertModel, table, dialog){
		var isAllValidated = lenovo.control.commontable.Toolkit._getInsertAllValidted(config, dialog);
		if(!isAllValidated)
			return;
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
			pattern: "MM/dd/yyyy"
		});
		var oModel = table.getModel();
		var cycleName = insertModel.getProperty("/CYCLE_NAME/value");
		var forcastDate = insertModel.getProperty("/FORCAST_MONTH/value");
		var cycleDate = insertModel.getProperty("/CYCLE_MONTH/value");
		var forcastMonth = dateFormat.format(forcastDate);//dateFormat.format(insertModel.getProperty("/FORCAST_MONTH/value"));
		var cycleMonth = dateFormat.format(cycleDate);//dateFormat.format(insertModel.getProperty("/CYCLE_MONTH/value"));
		var cycleType = insertModel.getProperty("/CYCLE_TYPE/value");
	
		if(this.compareDate(cycleDate, forcastDate) ) {
			lenovo.control.commontable.Toolkit.showErrorMsg("Forcast date must be equal or later than current date", "ERROR", "Create New Cycle");
			return;
		}
		
		dialog.setBusy(true);
		$.ajax({
			url: "/cdp/ebgcfe/service/logic/ui_cycle.xsjs",
			//type: "POST",
			type: "get",
			datatype: "text",
			data:{
				"cycle_name": cycleName,
				"cycle_type": cycleType,
				"cycle_cur_mon": cycleMonth,
				"cycle_fcst_mon": forcastMonth
			},
			success: function(){
				dialog.setBusy(false);
				lenovo.control.commontable.Toolkit.showErrorMsg("Successfully create new cycle", "SUCCESS", "Create New Cycle");
				dialog.close();
				oModel.refresh(true);
				//console.log(oModel);

			},
			error: function(err){
				err = err && err.responseText ;
				dialog.setBusy(false);
				if(!(typeof err === "string"))
					err = JSON.stringify(err);
				lenovo.control.commontable.Toolkit.showErrorMsg(err, "ERROR", "Create New Cycle");
//				dialog.close();
			}
		});
	},
	
	compareDate: function(earlyDate, lateDate){
		var result = false;
		var earlyyear = earlyDate.getYear() + 1;
		if(earlyDate.getYear() - lateDate.getYear() > 0)
		{
			result = true;
		}
		else if (earlyDate.getYear() - lateDate.getYear() == 0)
		{
			if(earlyDate.getMonth() - lateDate.getMonth() > 0)
			{
				result = true;
			}
		}
		return result;
	},
	
	createContent: function(){
		var app = new sap.m.App(); 

		var service = new lenovo.service.CFE();
		var oServiceUrl = service.getEBGCfe();

		var oModel = new sap.ui.model.odata.ODataModel(oServiceUrl, true);
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		var auth = lenovo.control.commontable.Table.getViewAuth("newCycle");
		//console.log("funcAuth",auth);
		this.setConfig(config, oServiceUrl, auth);
		var header = lenovo.control.commontable.Table.createHeader("Control Point", "New Cycle");

		config.bindRowUrl = "/CFE_UI_CYCLE";
		var table = lenovo.control.commontable.Table.createTable(config);
		table.setBusy(true);
		table.setModel(oModel);
		oModel.attachRequestCompleted(function(){
			table.setBusy(false);
		});

		var filterPanel = lenovo.control.commontable.Table.createFilter(config, table);
		this.table = table;
		this.oModel = oModel;
		this.config = config;
		this.oForm = filterPanel.getContent()[0];
		sap.ui.getCore().getEventBus().subscribe("TreeNavigation", "Ready", this.onTreeNavigation, this);
		
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
						var oStartIndex = 6;
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
		//app
	    var page = new sap.m.Page({
	      	  showHeader: false,
	          content :[header, filterPanel, oEditDeleteUploadDownload, table]               
	    });
        app.insertPage(page);
        app.setInitialPage(page);
        return app;	

	},
	onTreeNavigation: function(sChannel, sEvent, oData){
		if(oData.view === "New Cycle") {
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