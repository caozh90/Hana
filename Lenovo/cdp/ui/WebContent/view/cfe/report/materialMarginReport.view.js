//Created by Zhang Ruixue at 2015-1-16
//Version 2.0 by Chris Gao at 2016-5-29
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
jQuery.sap.require("lenovo.control.Validation");
sap.ui.jsview("lenovo.view.cfe.report.materialMarginReport", {
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
			field: "CYCLE", label: "Cycle", type: "TextField", width:"150px"
		},{
			field: "DELTACYCLE", label: "Delta to Cycle", type:"TextField", width:"150px"
		},{
			field: "BRAND", label: "Brand", type:"TextField", width:"150px"
		},{
			field: "FAMILY", label: "Family", type:"TextField", width:"150px"
		},{
			field: "CTO", label: "CTO", type:"TextField", width:"150px"
		},{
			field: "ASSEMBLY", label: "Assembly", type:"TextField", width:"150px"
		},{
			field: "STATUS", label: "Status", type:"TextField", width:"150px"
		},{
			field: "ASSEMBLY_DESC", label: "Assembly Desc", type:"TextField", width:"150px"
		},{
			field: "QTY", label: "QTY", type:"TextField", width:"150px"
		},{
			field: "COMPONENT", label: "Component", type:"TextField", width:"150px"
		},{
			field: "COMP_DESC", label: "Comp Desc", type:"TextField", width:"150px"
		},{
			field: "PLANT", label: "Plant", type:"TextField", width:"150px"
		},{
			field: "SUBGEO", label: "Subgeo", type:"TextField", width:"150px"
		},{
			field: "COUNTRY", label: "Country", type:"TextField", width:"150px"
		},{
			field: "CYCLEM1", label: labelArr.M1+"E", type:"TextField", width:"150px"
		},{
			field: "CYCLEM2", label: labelArr.M2+"E", type:"TextField", width:"150px"
		},{
			field: "CYCLEM3", label: labelArr.M3+"E", type:"TextField", width:"150px"
		},{
			field: "CYCLEM4", label: labelArr.M4+"E", type:"TextField", width:"150px"
		},{
			field: "CYCLEM5", label: labelArr.M5+"E", type:"TextField", width:"150px"
		},{
			field: "CYCLEM6", label: labelArr.M6+"E", type:"TextField", width:"150px"
		},{
			field: "CYCLEM7", label: labelArr.M7+"E", type:"TextField", width:"150px"
		},{
			field: "CYCLEM8", label: labelArr.M8+"E", type:"TextField", width:"150px"
		},{
			field: "CYCLEM9", label: labelArr.M9+"E", type:"TextField", width:"150px"
		},{
			field: "CYCLEM10", label: labelArr.M10+"E", type:"TextField", width:"150px"
		},{
			field: "CYCLEM11", label: labelArr.M11+"E", type:"TextField", width:"150px"
		},{
			field: "CYCLEM12", label: labelArr.M12+"E", type:"TextField", width:"150px"
		},{
			field: "CYCLEM13", label: labelArr.M13+"E", type:"TextField", width:"150px"
		},{
			field: "CYCLEM14", label: labelArr.M14+"E", type:"TextField", width:"150px"
		},{
			field: "CYCLEM15", label: labelArr.M15+"E", type:"TextField", width:"150px"
		},{
			field: "CYCLEM16", label: labelArr.M16+"E", type:"TextField", width:"150px"
		},{
			field: "CYCLEM17", label: labelArr.M17+"E", type:"TextField", width:"150px"
		},{
			field: "CYCLEM18", label: labelArr.M18+"E", type:"TextField", width:"150px"
		},{
			field: "TOCYCLEM1", label: "Delta Cycle "+labelArr.M1+"E", type:"TextField", width:"150px"
		},{
			field: "TOCYCLEM2", label: "Delta Cycle "+labelArr.M2+"E", type:"TextField", width:"150px"
		},{
			field: "TOCYCLEM3", label: "Delta Cycle "+labelArr.M3+"E", type:"TextField", width:"150px"
		},{
			field: "TOCYCLEM4", label: "Delta Cycle "+labelArr.M4+"E", type:"TextField", width:"150px"
		},{
			field: "TOCYCLEM5", label: "Delta Cycle "+labelArr.M5+"E", type:"TextField", width:"150px"
		},{
			field: "TOCYCLEM6", label: "Delta Cycle "+labelArr.M6+"E", type:"TextField", width:"150px"
		},{
			field: "TOCYCLEM7", label: "Delta Cycle "+labelArr.M7+"E", type:"TextField", width:"150px"
		},{
			field: "TOCYCLEM8", label: "Delta Cycle "+labelArr.M8+"E", type:"TextField", width:"150px"
		},{
			field: "TOCYCLEM9", label: "Delta Cycle "+labelArr.M9+"E", type:"TextField", width:"150px"
		},{
			field: "TOCYCLEM10", label: "Delta Cycle "+labelArr.M10+"E", type:"TextField", width:"150px"
		},{
			field: "TOCYCLEM11", label: "Delta Cycle "+labelArr.M11+"E", type:"TextField", width:"150px"
		},{
			field: "TOCYCLEM12", label: "Delta Cycle "+labelArr.M12+"E", type:"TextField", width:"150px"
		},{
			field: "TOCYCLEM13", label: "Delta Cycle "+labelArr.M13+"E", type:"TextField", width:"150px"
		},{
			field: "TOCYCLEM14", label: "Delta Cycle "+labelArr.M14+"E", type:"TextField", width:"150px"
		},{
			field: "TOCYCLEM15", label: "Delta Cycle "+labelArr.M15+"E", type:"TextField", width:"150px"
		},{
			field: "TOCYCLEM16", label: "Delta Cycle "+labelArr.M16+"E", type:"TextField", width:"150px"
		},{
			field: "TOCYCLEM17", label: "Delta Cycle "+labelArr.M17+"E", type:"TextField", width:"150px"
		},{
			field: "TOCYCLEM18", label: "Delta Cycle "+labelArr.M18+"E", type:"TextField", width:"150px"
		},{
			field: "DELTAM1", label: "Delta "+labelArr.M1, type:"TextField", width:"150px"
		},{
			field: "DELTAM2", label: "Delta "+labelArr.M2, type:"TextField", width:"150px"
		},{
			field: "DELTAM3", label: "Delta "+labelArr.M3, type:"TextField", width:"150px"
		},{
			field: "DELTAM4", label: "Delta "+labelArr.M4, type:"TextField", width:"150px"
		},{
			field: "DELTAM5", label: "Delta "+labelArr.M5, type:"TextField", width:"150px"
		},{
			field: "DELTAM6", label: "Delta "+labelArr.M6, type:"TextField", width:"150px"
		},{
			field: "DELTAM7", label: "Delta "+labelArr.M7, type:"TextField", width:"150px"
		},{
			field: "DELTAM8", label: "Delta "+labelArr.M8, type:"TextField", width:"150px"
		},{
			field: "DELTAM9", label: "Delta "+labelArr.M9, type:"TextField", width:"150px"
		},{
			field: "DELTAM10", label: "Delta "+labelArr.M10, type:"TextField", width:"150px"
		},{
			field: "DELTAM11", label: "Delta "+labelArr.M11, type:"TextField", width:"150px"
		},{
			field: "DELTAM12", label: "Delta "+labelArr.M12, type:"TextField", width:"150px"
		},{
			field: "DELTAM13", label: "Delta "+labelArr.M13, type:"TextField", width:"150px"
		},{
			field: "DELTAM14", label: "Delta "+labelArr.M14, type:"TextField", width:"150px"
		},{
			field: "DELTAM15", label: "Delta "+labelArr.M15, type:"TextField", width:"150px"
		},{
			field: "DELTAM16", label: "Delta "+labelArr.M16, type:"TextField", width:"150px"
		},{
			field: "DELTAM17", label: "Delta "+labelArr.M17, type:"TextField", width:"150px"
		},{
			field: "DELTAM18", label: "Delta "+labelArr.M18, type:"TextField", width:"150px"
		},{
			field: "SYS_LAST_MODIFIED_BY", label: "Last Modified BY", type:"TextField", width:"150px"
		},{
			field: "SYS_LAST_MODIFIED_DATE", label: "Last Modified DATE", type:"TextField", width:"150px"
		}];
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(8);
		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight);
		//filter
		config.filtersRaw = [{
			field: "CYCLE", label: "Cycle", type: "DropdownBox", 
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Cycle is required!"
			}],
			dropdownbox : {
				//defaultFilterValue: "CURRENT",
				odata:{
					defaultSelectAll: false,
					bindTextField: "CYCLE",
					bindKeyField: "CYCLE",
					url: oServiceUrl +"/UI_RPT_MATERIAL_MARGIN_SEARCH_DDL?$select=CYCLE&$format=json"
				}				
			}
		},{
			field: "FAMILY", label: "Family", type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultSelectAll: true,
					bindTextField: "FAMILY",
					bindKeyField: "FAMILY",
					url: oServiceUrl +"/UI_RPT_MATERIAL_MARGIN_SEARCH_DDL?$select=FAMILY,MS&$format=json"
				}				
			}
		},{
			field: "STATUS", label: "Status", type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultSelectAll: true,
					bindTextField: "STATUS",
					bindKeyField: "STATUS",
					url: oServiceUrl +"/UI_RPT_MATERIAL_MARGIN_SEARCH_DDL?$select=STATUS,MS&$format=json"
				}				
			}
		},{
			field: "SUBGEO", label: "Subgeo", type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultSelectAll: true,
					bindTextField: "SUBGEO",
					bindKeyField: "SUBGEO",
					url: oServiceUrl +"/UI_RPT_MATERIAL_MARGIN_SEARCH_DDL?$select=SUBGEO,MS&$format=json"
				}				
			}
		},{
			field: "DELTACYCLE", label: "Delta to Cycle",type: "DropdownBox", 
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "DELTACYCLE is required!"
			}],
			dropdownbox : {
				odata: {
//					bindTextField: "ITEM_VALUE",
//					bindKeyField: "ITEM_VALUE",
//					url: oServiceUrl +"/UI_PRT_EXECUTE_DDL?$filter=ITEM_TYPE eq 'DELTACYCLE'&$format=json"
					defaultSelectAll: false,
					bindTextField: "DELTACYCLE",
					bindKeyField: "DELTACYCLE",
					url: oServiceUrl +"/UI_RPT_MATERIAL_MARGIN_SEARCH_DDL?$select=DELTACYCLE&$format=json"
				}
			}
		},{
			field: "CTO",
			label: "CTO",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: oServiceUrl,
				bindRowUrl: "/UI_RPT_MATERIAL_MARGIN_SEARCH_DDL?$select=CTO,MS",
//				selectionMode: sap.ui.table.SelectionMode.Single,
				field: "CTO",
				columns: [{
					label: "CTO",
					field: "CTO",
					type: "TextField"
				}],
				filters: [[{
					label: "CTO",
					field: "CTO",
					type: "TextField",
					textfield: {
						type: new lenovo.control.commontable.singleQuotes()
	  				}
				}]]
			}
		},{
			field: "PLANT", label: "Plant", type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultSelectAll: true,
					bindTextField: "PLANT",
					bindKeyField: "PLANT",
					url: oServiceUrl +"/UI_RPT_MATERIAL_MARGIN_SEARCH_DDL?$select=PLANT,MS&$format=json"
				}				
			}
		},{
			field: "COUNTRY", label: "Country", type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultSelectAll: true,
					bindTextField: "COUNTRY",
					bindKeyField: "COUNTRY",
					url: oServiceUrl +"/UI_RPT_MATERIAL_MARGIN_SEARCH_DDL?$select=COUNTRY,MS&$format=json"
				}				
			}
		},{
			field: "BRAND", label: "Brand", type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultSelectAll: true,
					bindTextField: "BRAND",
					bindKeyField: "BRAND",
					url: oServiceUrl +"/UI_RPT_MATERIAL_MARGIN_SEARCH_DDL?$select=BRAND,MS&$format=json"
				}				
			}
		},{
			field: "ASSEMBLY",
			label: "Assembly",
			type: "DropdownTable", 
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: oServiceUrl,
				bindRowUrl: "/UI_RPT_MATERIAL_MARGIN_DDL_ASSEMBLY",
//				selectionMode: sap.ui.table.SelectionMode.Single,
				field: "ASSEMBLY",
				columns: [{
					label: "Assembly",
					field: "ASSEMBLY",
					type: "TextField"
				}],
				filters: [[{
					label: "Assembly",
					field: "ASSEMBLY",
					type: "MultiTextField",
					multitextfield: {
//						defaultFilterOp: "EQ"
						// type: new lenovo.control.commontable.singleQuotes()
					}
				}]]
			}
		}];
		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);

		//download
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.rpt_material_margin/AT_RPT_MATERIAL_MARGIN"';
		config.download.columns=[
			"PRODUCT_GROUP","CYCLE","DELTACYCLE","BRAND","FAMILY","CTO","ASSEMBLY","STATUS","ASSEMBLY_DESC","QTY","COMPONENT","COMP_DESC","PLANT","SUBGEO","COUNTRY",
"CYCLEM1","CYCLEM2","CYCLEM3","CYCLEM4","CYCLEM5","CYCLEM6","CYCLEM7","CYCLEM8","CYCLEM10","CYCLEM11","CYCLEM12","CYCLEM13","CYCLEM14","CYCLEM15","CYCLEM17","CYCLEM18",
"TOCYCLEM1","TOCYCLEM2","TOCYCLEM3","TOCYCLEM4","TOCYCLEM6","TOCYCLEM7","TOCYCLEM8","TOCYCLEM9","TOCYCLEM10","TOCYCLEM11","TOCYCLEM12","TOCYCLEM13","TOCYCLEM14","TOCYCLEM15","TOCYCLEM16","TOCYCLEM17","TOCYCLEM18",
"DELTAM1","DELTAM2","DELTAM3","DELTAM4","DELTAM5","DELTAM6","DELTAM7","DELTAM8","DELTAM9","DELTAM10","DELTAM11","DELTAM12","DELTAM13","DELTAM14","DELTAM15","DELTAM16","DELTAM17","DELTAM18","SYS_LAST_MODIFIED_BY","SYS_LAST_MODIFIED_DATE"];
		config.download.filename= "RPT_MATERIALMARGIN";
		
		//toolbar , auth
		config.create.visible=false;
		config.deleteable.visible=false;
		config.edit.visible=false;
		config.upload.visible=false;
		config.download.visible = auth.exportable;
		config.download.roleName = auth.exportableRoleName;	
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
						"process_name": 'PRC_RPT_MaterialMargin'
				};
				var service = new lenovo.service.CFE();
				var logicServiceUrl = service.getEBGCfeLogic();
				executePanel.setBusy(true);
				$.ajax({
					url: logicServiceUrl+"/report.xsjs",
					data: data,
					type: "get",
					contentType: "text",
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
		}, 	"Confirm");	
	},
	relateFilter: function(oForm, oServiceUrl){		
		
		
	},
	setColumnName:function(oServiceUrl, cycleDropdownBox){
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
					var oStartIndex = 14;
					for(var i=oStartIndex; i<oStartIndex+6; i++){
						var oAttName = "Q"+(i-oStartIndex+1);
						oColumns[i].setLabel(new sap.ui.commons.Label({
							text: "Cycle "+labelArr[oAttName]
						}));
						oColumns[i+6].setLabel(new sap.ui.commons.Label({
							text: "Delta Cycle "+labelArr[oAttName]
						}));
					}
					
				}			
			}
		});
	},
	onTreeNavigation: function(sChannel, sEvent, oData){
		if(this.first){
			this.first = false;
			return;
		}
		if(oData.view === "Material Margin Report") {		
			this.initialPage();
		}
	},
	initialPage: function(){
		var preFilterPanel = this.filterPanel; 
		var preToolbar = this.oEditDeleteUploadDownload;
		var preTable = this.table;
		var page = this.page;
		var app = this.app;
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
		var auth = lenovo.control.commontable.Table.getViewAuth("materialMarginReport");
		
		this.setConfig(config, oServiceUrl,auth);
		config.bindRowUrl = "/UI_RPT_MATERIAL_MARGIN";
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
		
		var oFilterBtn = filterPanel.getButtons();
		var searchBtn = null;
		for(var i = 0; i < oFilterBtn.length; i++) {
			var oTooltip = oFilterBtn[i].getTooltip();
			if(oTooltip==="search"){
				searchBtn = oFilterBtn[i];
				break;	
			}	
		}
		var cycleDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Cycle")[0];
		var that = this;
		searchBtn.attachPress(function(){	
			that.setColumnName(oServiceUrl, cycleDropdownBox);					
		});

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
		var service = new lenovo.service.CFE();
		var oServiceUrl = service.getEBGCfe();
		this.oServiceUrl  = oServiceUrl;

		var header = lenovo.control.commontable.Table.createHeader("Report", "Material Margin Report");
//		var table = lenovo.control.commontable.Table.createTable(config);
//		table.setBusy(true);
//		table.setModel(oModel);
//		oModel.attachRequestCompleted(function(){
//			table.setBusy(false);
//		});		
//		this.table = table;
//		this.tableModel = oModel;
//		var filterPanel = lenovo.control.commontable.Table.createFilter(config, table);
//		var oForm = filterPanel.getContent()[0];
//		this.oForm = oForm;
//		//this.relateFilter(oForm, oServiceUrl);
//		
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
//		var that = this;
//		searchBtn.attachPress(function(){	
//			that.setColumnName(oServiceUrl, cycleDropdownBox);
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
//						var oStartIndex = 12;
//						for(var i=oStartIndex; i<oStartIndex+6; i++){
//							var oAttName = "Q"+(i-oStartIndex+1);
//							oColumns[i].setLabel(new sap.ui.commons.Label({
//								text: "Cycle "+labelArr[oAttName]
//							}));
//							oColumns[i+6].setLabel(new sap.ui.commons.Label({
//								text: "Delta Cycle "+labelArr[oAttName]
//							}));
//						}
//						
//					}			
//				}
//			});*/
//					
//		});
//
//		//toolbar		
//		var oEditDeleteUploadDownload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table,app);
					
		//app
	    var page = new sap.m.Page({
	      	  showHeader: false,
	          content :[header]//[header, filterPanel, oEditDeleteUploadDownload, table]//[layout]                
	    }); 
	    /***********************
		 * Batch Execute
		 * Chris Gao
		 ***********************/
	    var logicServiceUrl = service.getEBGCfeLogic();
	    var uServiceUrl = service.getEBGCfeUpload();
	    var auth = lenovo.control.commontable.Table.getViewAuth("materialMarginReport");
//	    if(auth.executable){
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
								url: oServiceUrl+"/UI_PRT_EXECUTE_DDL?$filter=ITEM_TYPE eq 'CYCLE'&$orderby=ITEM_VALUE desc&$format=json"
							}				
						}
				},
//				{
//					field: "FAMILY", label: "Family", type: "DropdownTable", 
//					labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
//					dropdowntable : {
//						layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
//						defaultFilterOp: "EQ",
//						url: oServiceUrl,
//						multiSelection: true,
//			//			selectionMode: sap.ui.table.SelectionMode.Single,
//						fields: [{
//							bindByField: "FAMILY",
//							field: "ITEM_VALUE"
//						}],
//						columns: [{
//							label: "Family",
//							field: "ITEM_VALUE",
//							type: "TextField"
//						}],
//						notRefreshTable: true,
//						filters: [[{
//							field: "ITEM_VALUE",
//							label: "Family",
//							type: "MultiTextField"
//						}]],
//						_search: {
//							func: this.reloadExecutedSearchFamilyDropdownTable,
//							context: this
//						},
//						reload: {
//							func: this.reloadExecutedFamilyDropdownTable,
//							context: this
//						}
//					}
//				}
				],[{
					field: "DELTACYCLE", label: "Delta to Cycle", type: "DropdownBox", 
					dropdownbox : {
						odata:{
							defaultSelectAll: false,
							bindTextField: "ITEM_VALUE",
							bindKeyField: "ITEM_VALUE",
							url: oServiceUrl+"/UI_PRT_EXECUTE_DDL?$filter=ITEM_TYPE eq 'DELTACYCLE'&$orderby=ITEM_VALUE desc&$format=json"
						}				
					}
			},
//			{
//				field: "CTO", label: "CTO/Assembly", type: "DropdownTable", 
//				labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
//				dropdowntable : {
//					layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
//					defaultFilterOp: "EQ",
//					url: oServiceUrl,
//					multiSelection: true,
//		//			selectionMode: sap.ui.table.SelectionMode.Single,
//					fields: [{
//						bindByField: "CTO",
//						field: "ITEM_VALUE"
//					}],
//					columns: [{
//						label: "CTO/Assembly",
//						field: "ITEM_VALUE",
//						type: "TextField"
//					}],
//					notRefreshTable: true,
//					filters: [[{
//						field: "ITEM_VALUE",
//						label: "CTO/Assembly",
//						type: "MultiTextField"
//					}]],
//					_search: {
//						func: this.reloadExecutedSearchCTODropdownTable,
//						context: this
//					},
//					reload: {
//						func: this.reloadExecutedCTODropdownTable,
//						context: this
//					}
//				}
//			}
			]],
				execute: {
					func: this.execute,
					context: this
				},
				
				batchexecute:{
					header:"Material Margin",
				    subheader:"Batch Execute",
					visible: auth.exportable,
					forBatchDownload: true,
					uploadHistoryConfig: {
						url: oServiceUrl,
						bindRowUrl: "/INPUT_RPT_MATERIAL_MARGIN_BATCH_ITEM(IN_REPORT_NAME='RPT_MATERIALMARGIN')/Results",
						defaultSort:[{
							field: "ITEM",
							bDescending: true
						},{
							field: "MT",
							bDescending: true
						},{
							field: "FAMILY",
							bDescending: true
						}],
						columns:[{
							label: "ITEM",
							field: "ITEM",
							type: "TextField"
						},{
							label: "MT",
							field: "MT",
							type: "TextField"
						},{
							label: "FAMILY",
							field: "FAMILY",
							type: "TextField"
						}]
						//selectionMode: sap.ui.table.SelectionMode.Single
					},
					mentionLabel: "Only one column need to be maintained per entry",
					deleteConfig:{
						url: logicServiceUrl + "/ui_materialmargin_delete.xsjs",
						fields:["ITEM","MT","FAMILY"]
					},
					deleteAllConfig:{
						url: logicServiceUrl + "/ui_delete_all_with_report_name.xsjs",
						reportname: "RPT_MATERIALMARGIN",
						tablename: "UI_RPT_MODELLIST"
					},
					upload: {
							url: uServiceUrl + "/rpt_materialmargin_batch_upload.xsjs",
							excelUrl: "cfe/report/ui_materialmargin_batch_template.xlsx"
					},
//					execute:{
//						url:logicServiceUrl + "/ui_materialmargin_batch_execute.xsjs",
//					}
				}
			};
			oPanel =  lenovo.control.commontable.Table.createExecutePanel(executeConfig);
			
			
			
			/***********************
			 * End Batch Execute
			 ***********************/
			
			//modified by Chris Gao 2015-09-02 change Execute Panel Color
			oPanel.addStyleClass("filter-panel ondemandRefresh-dslayout");
			
			page.insertContent(oPanel, 1);
			
			
			
			this.app = app;
			this.page = page;
			this.initialPage();	
	 //}
	    
        app.insertPage(page);
        app.setInitialPage(page);
        return app;	
	},
	// version 2.0
	reloadExecutedFamilyDropdownTable: function(dropdownTable){
		
		dropdownTable.getModel().setDefaultCountMode("None");
		var bindUrl = "/UI_RPT_MATERIAL_MARGIN_E_DDL?$filter=ITEM_TYPE eq 'FAMILY' &$format=json";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
	reloadExecutedSearchFamilyDropdownTable: function(filterModel, filterPanel, table){

		var filter = filterModel.getProperty("/ITEM_VALUE");
		var filterModel = null;
		if(filter.filterValue) {
			filterModel = [new sap.ui.model.Filter({
				path: "ITEM_VALUE",
				operator: filter.filterOperator,
				value1: filter.filterValue
			}),
			new sap.ui.model.Filter({
				path: "ITEM_TYPE",
                operator: "EQ",
                value1: "FAMILY"
			})
			];
		}
		var bindUrl = "/UI_RPT_MATERIAL_MARGIN_E_DDL";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	reloadExecutedCTODropdownTable: function(dropdownTable){
		
		dropdownTable.getModel().setDefaultCountMode("None");
		var bindUrl = "/UI_RPT_MATERIAL_MARGIN_E_DDL?$filter=ITEM_TYPE eq 'CTO' &$format=json";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
	reloadExecutedSearchCTODropdownTable: function(filterModel, filterPanel, table){

		var filter = filterModel.getProperty("/ITEM_VALUE");
		var filterModel = null;
		if(filter.filterValue) {
			filterModel = [new sap.ui.model.Filter({
				path: "ITEM_VALUE",
				operator: filter.filterOperator,
				value1: filter.filterValue
			}),
			new sap.ui.model.Filter({
				path: "ITEM_TYPE",
                operator: "EQ",
                value1: "CTO"
			})
			];
		}
		var bindUrl = "/UI_RPT_MATERIAL_MARGIN_E_DDL";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	
	/***********************
	 * Batch Execute
	 * Chris Gao
	 ***********************/
	
	/***********************
	 * End Batch Execute
	 ***********************/
});
