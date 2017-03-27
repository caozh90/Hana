//Created by Zhang Ruixue at 2015-1-14
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
sap.ui.jsview("lenovo.view.cfe.report.ctcReport", {
	getDeltaCycle: function(oServiceUrl){
		/*var defaultDeltaCycle = null;
		$.ajax({
			url: oServiceUrl+"/V_CYCLE_CTC(V_CYCLE='CURRENT')/Results?$format=json",
			type: "GET",
			dataType: "json", 
			async: false,
			success: function(data){
				if(data.d.results.length > 0)
					defaultDeltaCycle = data.d.results[0].DELTACYCLE;
			}		
		});
		 
		return defaultDeltaCycle;*/

		var defaultDeltaCycle = null;
		$.ajax({
			// url: oServiceUrl + "/UI_RPT_CTC_SEARCH_DDL_DELTACYCLE?$filter=ITEM_TYPE eq 'DELTACYCLE'&$format=json",
			url: oServiceUrl + "/UI_RPT_CTC_SEARCH_DDL_MS?$select=DELTACYCLE,MS&$format=json",
			type: "GET",
			dataType: "json", 
			async: false,
			success: function(data){
				if(data.d.results.length > 0)
					defaultDeltaCycle = data.d.results[0].DELTACYCLE;
			}		
		});

		return defaultDeltaCycle;
	
	},
	setConfig: function(config, oServiceUrl, auth){
		var defaultDeltaCycle = this.getDeltaCycle(oServiceUrl);
		var labelArr={
				"M1": "M1",
				"DELTAM1": "DELTAM1"		
		};
		$.ajax({
			url:oServiceUrl+"/V_CYCLE(INPUT_CYCLE='CURRENT')/Results?$format=json",
			type:"GET",
			async: false,
			dataType:"json",
			success: function(data){
				var oResult = data.d.results;
				if(oResult.length>0){
					labelArr.M1 = data.d.results[0].CYCLE_FCST_MONTH;//M1->CYCLE_FCST_MONTH ZHAODAN1 20160926
				}
			}
		});
		$.ajax({
			url:oServiceUrl+"/V_CYCLE(INPUT_CYCLE='"+defaultDeltaCycle+"')/Results?$format=json",
			type:"GET",
			async: false,
			dataType:"json",
			success: function(data){
				var oResult = data.d.results;
				if(oResult.length>0){
					labelArr.DELTAM1 = data.d.results[0].CYCLE_FCST_MONTH;//M1->CYCLE_FCST_MONTH ZHAODAN1 20160926
				}
			}
		});
		//table
		config.columns = [{
			field: "CYCLE", label: "Cycle", type: "TextField", width: "150px"
		},{
			field: "DELTACYCLE", label: "Delta to Cycle", type:"TextField", width: "150px"
		},{
			field: "BRAND", label: "Brand", type:"TextField", width: "150px"
		},{
			field: "FAMILY", label: "Family", type:"TextField", width: "150px"
		},{
			field: "CTO", label: "CTO", type:"TextField", width: "150px"
		},{
			field: "MODEL", label: "Assembly", type:"TextField", width: "150px"
		},{
			field: "STATUS", label: "Status", type:"TextField", width: "150px"
		},{
			field: "DESCRIPTION", label: "Description", type:"TextField", width: "150px"
		},{
			field: "PLANT", label: "Plant", type:"TextField", width: "150px"
		},{
			field: "SUBGEO", label: "Subgeo", type:"TextField", width: "150px"
		},{
			field: "COUNTRY", label: "Country", type:"TextField", width: "150px"
		},{
			field: "M1", label: labelArr.M1, type:"TextField", width: "150px"
		},{
			field: "DELTA_M1", label: labelArr.DELTAM1, type:"TextField", width: "150px"
		},{
			field: "DELTACOST", label: "Delta Cost", type:"TextField", width: "150px"
		},{
			field: "DELTAPERCENTAGE", label: "Delta Percentage", type:"TextField", width: "150px"
		},{
			field: "CHANGE_REASON", label: "Change Reason", type:"TextField", width: "150px"
		},{
			field: "SYS_LAST_MODIFIED_BY", label: "Last Modified BY", type:"TextField", width: "150px"
		},{
			field: "SYS_LAST_MODIFIED_DATE", label: "Last Modified DATE", type:"TextField", width: "150px"
		}];
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(7);
		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight - 30);
		//filter
		config.filtersRaw = [ {
			field: "CYCLE", label: "Cycle", type: "DropdownBox", 
			dropdownbox : {
				// defaultFilterValue: "CURRENT",
				odata:{
					defaultSelectAll: true,
					bindTextField: "CYCLE",
					bindKeyField: "CYCLE",
					url: oServiceUrl+"/UI_RPT_CTC_SEARCH_DDL_MS?$select=CYCLE,MS&$format=json" 
				}				
			}
		},{
			field: "FAMILY", label:"Family",type: "DropdownBox", 
			dropdownbox : {
				data:[{"text": lenovo.control.Constants.allDropdownBoxListItem, "key": lenovo.control.Constants.allDropdownBoxListItem}]					
			}
		}, {
			field: "STATUS", label:"Status",type: "DropdownBox", 
			dropdownbox :{
				odata:{
					defaultSelectAll:true,
					bindTextField: "STATUS",
					bindKeyField: "STATUS",
					url: oServiceUrl+"/UI_RPT_CTC_SEARCH_DDL_MS?$select=STATUS,MS&$format=json"
				}	
			}
		},{
			field: "SUBGEO", label:"Subgeo",type: "DropdownBox", 
			dropdownbox :{
				odata:{
					defaultSelectAll:true,
					bindTextField: "SUBGEO",
					bindKeyField: "SUBGEO",
					url: oServiceUrl+"/UI_RPT_CTC_SEARCH_DDL_MS?$select=SUBGEO,MS&$format=json"
				}	
			}
		},{
			field: "DELTACYCLE", label: "Delta to Cycle", type: "DropdownBox", 
			dropdownbox : {
				data:[{"text": lenovo.control.Constants.allDropdownBoxListItem, "key": lenovo.control.Constants.allDropdownBoxListItem}]					
			}
		},{
			field: "CTO", label:"CTO",type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: oServiceUrl,
				bindRowUrl: "/UI_RPT_CTC_SEARCH_DDL_MS",
				//selectionMode: sap.ui.table.SelectionMode.Single,
				field: "CTO",
				columns: [{
					label: "CTO",
					field: "CTO",
					type: "TextField"
				}],
				filters: [[{
					field: "CTO",
					label: "CTO",
					type: "MultiTextField",
					multitextfield: {
//						defaultFilterOp: "EQ"
					}
				}]]
			}
		},{
			field: "PLANT", label:"Plant",type: "DropdownBox", 
			dropdownbox :{
				odata:{
					defaultSelectAll: true,
					bindTextField: "PLANT",
					bindKeyField: "PLANT",
					url: oServiceUrl+"/UI_RPT_CTC_SEARCH_DDL_MS?$select=PLANT,MS&$format=json"
				}	
			}
		},{
			field: "COUNTRY", label:"Country",type: "DropdownBox", 
			dropdownbox : {
				data:[{"text": lenovo.control.Constants.allDropdownBoxListItem, "key": lenovo.control.Constants.allDropdownBoxListItem}]					
			}
		},{
			field: "BRAND", label:"Brand",type: "DropdownBox", 
			dropdownbox :{
				odata:{
					defaultSelectAll: true,
					bindTextField: "BRAND",
					bindKeyField: "BRAND",
					url: oServiceUrl+"/UI_RPT_CTC_SEARCH_DDL_MS?$select=BRAND,MS&$format=json"
				}	
			}
		},{
			field: "MODEL", label:"Assembly",type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: oServiceUrl,
				bindRowUrl: "/UI_RPT_CTC_SEARCH_DDL_MODEL",
				//selectionMode: sap.ui.table.SelectionMode.Single,
				field: "MODEL",
				columns: [{
					label: "Model",
					field: "MODEL",
					type: "TextField"
				}],
				filters: [[{
					field: "MODEL",
					label: "Model",
					type: "MultiTextField",
					multitextfield: {
//						defaultFilterOp: "EQ"
					}
				}]]
			}
		},{
			field: "CHANGE_REASON", label:"Change Reason",type: "DropdownBox", 
			dropdownbox :{
				odata:{
					defaultSelectAll: true,
					bindTextField: "CHANGE_REASON",
					bindKeyField: "CHANGE_REASON",
					url: oServiceUrl+"/UI_RPT_CTC_SEARCH_DDL_CHANGE?$select=CHANGE_REASON&$format=json"
				}	
			}
		}];
		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);

		//download
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.rpt_ctc/AT_RPT_CTC"';
		config.download.columns=[
			"CYCLE","DELTACYCLE","BRAND","FAMILY","CTO","MODEL","STATUS", "DESCRIPTION", "PLANT",
			"SUBGEO","COUNTRY","M1","DELTA_M1","DELTACOST","DELTAPERCENTAGE","CHANGE_REASON","SYS_LAST_MODIFIED_BY", "SYS_LAST_MODIFIED_DATE"];
		
		config.download.filename= "RPT_CTC";
		
		//toolbar , auth
		config.create.visible=false;
		config.deleteable.visible=false;
		config.edit.visible=false;
		config.upload.visible=false;
		config.download.visible = auth.exportable;
		config.download.roleName = auth.exportableRoleName;
		
	},
	setColumnName:function(oServiceUrl, cycleDropdownBox, deltaCycleDropdownBox){
		var selectedKey = cycleDropdownBox.getSelectedKey();
		var table = this.table;
		$.ajax({
			url:oServiceUrl+"/V_CYCLE(INPUT_CYCLE='"+selectedKey+"')/Results?$format=json",
			type:"GET",
			dataType:"json",
			success: function(data){
				var oResult = data.d.results;
				if(oResult.length>0){
					var labelArr = oResult[0];
					var oColumns = table.getColumns();
					oColumns[9].setLabel(new sap.ui.commons.Label({
						text: "Cycle "+labelArr["M1"]
					}));		
				}			
			}
		});
		var deltaSelectedKey = deltaCycleDropdownBox.getSelectedKey();
		$.ajax({
			url:oServiceUrl+"/V_CYCLE(INPUT_CYCLE='"+deltaSelectedKey+"')/Results?$format=json",
			type:"GET",
			dataType:"json",
			success: function(data){
				var oResult = data.d.results;
				if(oResult.length>0){
					var labelArr = oResult[0];
					var oColumns = table.getColumns();
					oColumns[10].setLabel(new sap.ui.commons.Label({
						text: "Delta Cycle "+labelArr["M1"]
					}));		
				}			
			}
		});	
	},
	execute: function(executePanel, executeModel){
		var oLabel = new sap.ui.commons.Label({
			text: "Do you want to execute?",
			width: "350px",
		});
		sap.ui.commons.MessageBox.confirm(oLabel, function(result){
			if(result) {
				var cycle = executeModel.getProperty("/CYCLE/value");
				var delta_cycle = executeModel.getProperty("/DELTACYCLE/value");

				var data = {
						"cycle": cycle,
						"delta_cycle": delta_cycle,
						"process_name": 'PRC_RPT_CTC'
				};
				var service = new lenovo.service.CFE();
				var logicServiceUrl = service.getEBGCfeLogic();
				executePanel.setBusy(true);
				$.ajax({
					url: logicServiceUrl+"/report.xsjs",
					data: data,
					type: "get",
					dataType: "text",
					contentType: "application/json",
					success: function(data){
						executePanel.setBusy(false);
						lenovo.control.commontable.Toolkit.showErrorMsg("Successfully execute", "SUCCESS", "Execute");							
					},
					error: function(err){
						err = err && err.responseText ;
						executePanel.setBusy(false);
						if(!(typeof err === "string"))
							err = JSON.stringify(err);
						lenovo.control.commontable.Toolkit.showErrorMsg(err, "ERROR", "Execute");			
					}
				});
			}
		});
	},
	relateFilter: function(oForm, oServiceUrl){		
		//search, cycle, delta cycle cascade	
		/*var cycleDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Cycle")[0];
		var deltaCycleDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Delta to Cycle")[0];
	    var deltaCycleOpts = {
	    		transform: function (data){
					return data.d.results;
				},
				url: function(selectedKey){
					return oServiceUrl+"/V_CYCLE_CTC(V_CYCLE='" + selectedKey + "')/Results?$format=json";
				},
				bindTextField:"DELTACYCLE",
				bindKeyField:"DELTACYCLE",
				notAddFirstListItem:true
	    };
		lenovo.control.commontable.Toolkit.relateDropDwonBox(cycleDropdownBox, deltaCycleDropdownBox, deltaCycleOpts);*/
	},
	onTreeNavigation: function(sChannel, sEvent, oData){
		if(this.first){
			this.first = false;
			return;
		}
		if(oData.view === "CTC Report") {		
			this.initialPage();
		}
	},
	initialPage: function(){
		var preFilterPanel = this.filterPanel; 
		var preToolbar = this.oEditDeleteUploadDownload;
		var preTable = this.table;
		var page = this.page;
		if(preFilterPanel){
			page.removeContent(preFilterPanel);
		}
		if(preToolbar){
			page.removeContent(preToolbar);
		}
		if(preTable){
			page.removeContent(preTable);
		}
	
		var oServiceUrl = this.oServiceUrl;
		var oModel = new sap.ui.model.odata.ODataModel(oServiceUrl, true);
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		var auth = lenovo.control.commontable.Table.getViewAuth("ctcReport");
		var app = this.app;
		this.setConfig(config, oServiceUrl,auth);
		config.bindRowUrl = "/UI_RPT_CTC2";
		var table = lenovo.control.commontable.Table.createTable(config);
		table.setBusy(true);
		table.setModel(oModel);
		oModel.attachRequestCompleted(function(){
			table.setBusy(false);
		});		
		this.table = table;
		var filterPanel = lenovo.control.commontable.Table.createFilter(config, table);
		this.filterPanel = filterPanel;
		var oForm = filterPanel.getContent()[0];
//		this.oForm = oForm;

		var oFilterBtn = filterPanel.getButtons();
		var searchBtn = null;
		for(var i = 0; i < oFilterBtn.length; i++) {
			var oTooltip = oFilterBtn[i].getTooltip();
			if(oTooltip==="search"){
				searchBtn = oFilterBtn[i];
				break;	
			}	
		}
		
		var opts = {
			transform: function (data){
				return data.d.results;
			},
			url: function(selectedKey){
				return oServiceUrl +"/IN_DELTACYCLE(IN_CYCLE='" + selectedKey + "')/Results?$format=json";
			},
			bindTextField:"DELTACYCLE",
			bindKeyField:"DELTACYCLE"
		};	
		var cycleDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Cycle")[0];
		var deltaCycleDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Delta to Cycle")[0];
		opts.selectedKey = cycleDropdownBox.getValue();
		lenovo.control.commontable.Toolkit.reReloadDropdownBox(deltaCycleDropdownBox, opts);
		lenovo.control.commontable.Toolkit.relateDropDwonBox(cycleDropdownBox, deltaCycleDropdownBox, opts);
//		this.cycleDropdownBox = cycleDropdownBox;
//		this.deltaCycleDropdownBox = deltaCycleDropdownBox;
		var that = this;

		searchBtn.attachPress(function(){	
			that.setColumnName(oServiceUrl, cycleDropdownBox, deltaCycleDropdownBox);
			
		});
		//brand, family cascade		
		var opts = {
			transform: function (data){
				return data.d.results;
			},
			url: function(selectedKey){
				return oServiceUrl +"/IN_FAMILY(IN_BRAND='" + selectedKey + "')/Results?$format=json";
			},
			bindTextField:"FAMILY",
			bindKeyField:"FAMILY"
		};	
		var brandDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Brand")[0];
		var familyDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Family")[0];
		opts.selectedKey = brandDropdownBox.getValue();
		lenovo.control.commontable.Toolkit.reReloadDropdownBox(familyDropdownBox, opts);
		lenovo.control.commontable.Toolkit.relateDropDwonBox(brandDropdownBox, familyDropdownBox, opts);
		//country, subgeo cascade			
		var opts = {
			transform: function (data){
				return data.d.results;
			},
			url: function(selectedKey){
				return oServiceUrl +"/IN_COUNTRY(IN_SUBGEO='" + selectedKey + "')/Results?$format=json";
			},
			bindTextField:"COUNTRY",
			bindKeyField:"COUNTRY"
		};	
		var countryDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Country")[0];
		var subgeoDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Subgeo")[0];
		opts.selectedKey = subgeoDropdownBox.getValue();
		lenovo.control.commontable.Toolkit.reReloadDropdownBox(countryDropdownBox, opts);
		lenovo.control.commontable.Toolkit.relateDropDwonBox(subgeoDropdownBox, countryDropdownBox, opts);

		//toolbar		
		var oEditDeleteUploadDownload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table,app);
		this.oEditDeleteUploadDownload = oEditDeleteUploadDownload;
		
		this.page.insertContent(filterPanel,2);
		this.page.insertContent(oEditDeleteUploadDownload,3);
		this.page.insertContent(table,4);
	},
	createContent: function(){
		this.first = true;
		sap.ui.getCore().getEventBus().subscribe("TreeNavigation", "Ready", this.onTreeNavigation, this);
		var app = new sap.m.App(); 
		this.app = app;
		var service = new lenovo.service.CFE();
		var oServiceUrl = service.getEBGCfe();
		this.oServiceUrl = oServiceUrl;
		
//		var oModel = new sap.ui.model.odata.ODataModel(oServiceUrl, true);
//		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
//		var auth = lenovo.control.commontable.Table.getViewAuth("ctcReport");
//		
//		this.setConfig(config, oServiceUrl,auth);
//		config.bindRowUrl = "/UI_RPT_CTC";
		var header = lenovo.control.commontable.Table.createHeader("Report", "CTC Report");
//		var table = lenovo.control.commontable.Table.createTable(config);
//		table.setBusy(true);
//		table.setModel(oModel);
//		oModel.attachRequestCompleted(function(){
//			table.setBusy(false);
//		});		
//		this.tableModel = oModel;
//		this.table = table;
//		var filterPanel = lenovo.control.commontable.Table.createFilter(config, table);
//		var oForm = filterPanel.getContent()[0];
//		this.oForm = oForm;
//		//this.relateFilter(oForm, oServiceUrl);
//		var oFilterBtn = filterPanel.getButtons();
//		var searchBtn = null;
//		for(var i = 0; i < oFilterBtn.length; i++) {
//			var oTooltip = oFilterBtn[i].getTooltip();
//			if(oTooltip==="search"){
//				searchBtn = oFilterBtn[i];
//				break;	
//			}	
//		}
//		var cycleDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Cycle")[0];
//		var deltaCycleDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Delta to Cycle")[0];
//		this.cycleDropdownBox = cycleDropdownBox;
//		this.deltaCycleDropdownBox = deltaCycleDropdownBox;
//		var that = this;
//
//		searchBtn.attachPress(function(){	
//			that.setColumnName(oServiceUrl, cycleDropdownBox, deltaCycleDropdownBox);
//			/*var selectedKey = cycleDropdownBox.getSelectedKey();
//			$.ajax({
//				url:oServiceUrl+"/V_CYCLE(INPUT_CYCLE='"+selectedKey+"')/Results?$format=json",
//				type:"GET",
//				dataType:"json",
//				success: function(data){
//					var oResult = data.d.results;
//					if(oResult.length>0){
//						var labelArr = oResult[0];
//						var oColumns = table.getColumns();
//						oColumns[9].setLabel(new sap.ui.commons.Label({
//							text: "Cycle "+labelArr["M1"]
//						}));		
//					}			
//				}
//			});
//			var deltaSelectedKey = deltaCycleDropdownBox.getSelectedKey();
//			$.ajax({
//				url:oServiceUrl+"/V_CYCLE(INPUT_CYCLE='"+deltaSelectedKey+"')/Results?$format=json",
//				type:"GET",
//				dataType:"json",
//				success: function(data){
//					var oResult = data.d.results;
//					if(oResult.length>0){
//						var labelArr = oResult[0];
//						var oColumns = table.getColumns();
//						oColumns[10].setLabel(new sap.ui.commons.Label({
//							text: "Delta Cycle "+labelArr["M1"]
//						}));		
//					}			
//				}
//			});	*/
//		});
//		//toolbar		
//		var oEditDeleteUploadDownload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table,app);
		
		//app
	    var page = new sap.m.Page({
	      	  showHeader: false,
	          content :[header]//[header, filterPanel, oEditDeleteUploadDownload, table]//[layout]                
	    }); 
	    this.page = page;
		var executeConfig = {
				formWidth: "66.6%",
				columns: [[{
						field: "CYCLE", label: "Cycle", type: "DropdownBox", 
						dropdownbox : {
							defaultValue: "CURRENT",
							odata:{
								defaultSelectAll: false,
								bindTextField: "ITEM_VALUE",
								bindKeyField: "ITEM_VALUE",
								url: oServiceUrl+"/UI_PRT_EXECUTE_DDL?$filter=ITEM_TYPE eq 'CYCLE'&$orderby=ITEM_VALUE desc&$format=json" //add sort by zhaodan1 201609
							}				
						}
				}],[{
					field: "DELTACYCLE", label: "Delta to Cycle", type: "DropdownBox", 
					dropdownbox : {
						odata:{
							defaultSelectAll: false,
							bindTextField: "ITEM_VALUE",
							bindKeyField: "ITEM_VALUE",
							url: oServiceUrl+"/UI_PRT_EXECUTE_DDL?$filter=ITEM_TYPE eq 'DELTACYCLE'&$orderby=ITEM_VALUE desc&$format=json"//add sort by zhaodan1 201609
						}				
					}
				}]],
				execute: {
					func: this.execute,
					context: this
				}
		};
		oPanel =  lenovo.control.commontable.Table.createExecutePanel(executeConfig);
		
		//modified by Chris Gao 2015-09-02 change Execute Panel Color
		oPanel.addStyleClass("filter-panel ondemandRefresh-dslayout");
		
		page.insertContent(oPanel, 1);
		
		this.initialPage();	
		
        app.insertPage(page);
        app.setInitialPage(page);
        return app;	
	}
});
