jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
sap.ui.jsview("lenovo.view.lcpe.report.whereUseReport", {
	setConfig: function(config, oServiceUrl, auth){
		//table
		config.notRefreshTable=true;

		config.columns = [{
			field: "PART_NUMBER", label: "Part Number", type: "TextField"
		},{
			field: "DESCRIPTION", label: "Description", type:"TextField"
		},{
			field: "TOP_LEVEL", label: "Top Level", type:"TextField"
		},{
			field: "TOP_LEVEL_TYPE", label: "Top Level Type", type:"TextField"
		},{
			field: "BRAND", label: "Brand", type:"TextField"
		},{
			field: "PROD_FAMILY", label: "Family", type:"TextField"
		},{
			field: "SYS_LAST_MODIFIED_BY", label: "Last Modified BY", type:"TextField"
		},{
			field: "SYS_LAST_MODIFIED_DATE", label: "Last Modified DATE", type:"TextField"
		}];
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(3);
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
					url: oServiceUrl+"/UI_PRT_EXECUTE_DDL?$filter=ITEM_TYPE%20eq%20%27CYCLE%27&$format=json"
				}				
			}
		},{
			field: "PART_NUMBER", label: "Part Number", type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: oServiceUrl,
				bindRowUrl: "/UI_PRT_WHERE_USED_PART_NUMBER",
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
//						defaultFilterOp: "EQ"
					}
				}]]
			}
		}];
		config.filters = lenovo.control.commontable.Toolkit.splitChunck(2, config.filtersRaw);
		config.filterLayout = {
			0: new sap.ui.layout.GridData({span: "L4 M4 S4"}),
			1: new sap.ui.layout.GridData({span: "L4 M4 S4"})	
		};
		//download
		config.download.table = '"_SYS_BIC"."cdp.lcpe.models.rpt_where_used/CV_PRT_WHERE_USED"';
		config.download.columns=[
			"CYCLE", "PART_NUMBER","DESCRIPTION","TOP_LEVEL","TOP_LEVEL_TYPE",
			"BRAND", "PROD_FAMILY", "SYS_LAST_MODIFIED_BY", "SYS_LAST_MODIFIED_DATE"];
		config.download.filename= "RPT_WHERE_USED";
		
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
				var oForm = executePanel.getContent()[0];
				var partNumfield = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Part Number")[0];
				var cycle = executeModel.getProperty("/CYCLE/value");
				var part_number = partNumfield.getValue();//coral 4/23/2015
				// var part_number = executeModel.getProperty("/ITEM/filterValue"); 
				// part_number = part_number.join(",");
				var data = {
						"cycle": cycle,
						"part_number": part_number,
						"delta_cycle": '',
						"process_name": 'PRC_RPT_WHERE_USED'
				};
				var service = new lenovo.service.CFE();
				var logicServiceUrl = service.getlcpeLogic();
				executePanel.setBusy(true);
				$.ajax({
					url: logicServiceUrl+"/report.xsjs",
					data: data,
					type: "get",
					contentType: "application/json",
					dataType: "text",
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
	onTreeNavigation: function(sChannel, sEvent, oData){
		if(this.first){
			this.first = false;
			return;
		}
		if(oData.view === "Where Use Report") {		
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
		var auth = lenovo.control.commontable.Table.getViewAuth("whereUseReport");
		
		this.setConfig(config, oServiceUrl,auth);
		config.bindRowUrl = "/UI_PRT_WHERE_USED";
		var table = lenovo.control.commontable.Table.createTable(config);
/*		table.setBusy(true);
*/		table.setModel(oModel);
		oModel.attachRequestCompleted(function(){
			table.setBusy(false);
		});	
		this.table = table;
		var filterPanel = lenovo.control.commontable.Table.createFilter(config, table);
		this.filterPanel = filterPanel;
		//toolbar		
		var oEditDeleteUploadDownload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table,app);
		this.oEditDeleteUploadDownload = oEditDeleteUploadDownload;
		
		this.page.insertContent(filterPanel,2);
		this.page.insertContent(oEditDeleteUploadDownload,3);
		this.page.insertContent(table,4);
	},
	reloadItemDropdownTable: function(dropdownTable){
		var cycle = this.cycleDropdownBox.getValue();
		var bindUrl = "/INPUT_CYCLE1(input_cycle='"+ cycle +"')/Results";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
	reloadSearchItemDropdownTable: function(filterModel, filterPanel, table){
		var cycle = this.cycleDropdownBox.getValue();
		var filter = filterModel.getProperty("/ITEM");
		var filterModel = null;
		if(filter.filterValue) {
			filterModel = new sap.ui.model.Filter({
				path: "ITEM",
				operator: filter.filterOperator,
				value1: filter.filterValue
			});
		}
		var bindUrl = "/INPUT_CYCLE1(input_cycle='"+ cycle +"')/Results";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	createExecutePartNumber: function(oForm, partNumberOpts){
		var filterModel = oForm.getModel();
		var obj= JSON.parse(filterModel.getJSON());

		obj[partNumberOpts.field]={
				filterValue: [],
				filterOperator: (partNumberOpts.dropdowntable && partNumberOpts.dropdowntable.defaultFilterOperator) || "Contains",
				type: partNumberOpts.type
		};

		filterModel.setData(obj);
		
		var dropDownTableConfig = partNumberOpts.dropdowntable;

		var oValueHelpField = new sap.ui.commons.ValueHelpField({
			value: {
				path: "/" + partNumberOpts.field + "/filterValue",
				mode: sap.ui.model.BindingMode.TwoWay,
			},
			valueHelpRequest: function(){
				var returnDropdownTable= lenovo.control.commontable.Toolkit.popupDropdownTable(partNumberOpts, filterModel, oValueHelpField);
				var oDialog = returnDropdownTable.dialog;
				var table = returnDropdownTable.table;
				oDialog.open();
				if(dropDownTableConfig.reload) {
					var args = [table];
					if(dropDownTableConfig.reload.args) {
						for(var i = 0; i < dropDownTableConfig.reload.args.length; i++) {
							args.push(dropDownTableConfig.reload.args[i]);
						}
					}
					dropDownTableConfig.reload.func.apply(dropDownTableConfig.reload.context ||window,  args);
				}
			},
			layoutData:  (dropDownTableConfig && dropDownTableConfig.layout) ||  new sap.ui.layout.GridData({span: "L8 M8 S8"})
		});
		lenovo.control.commontable.Toolkit._required(partNumberOpts, oValueHelpField);
		lenovo.control.commontable.Toolkit._validateInsert(partNumberOpts, oValueHelpField);
		var oControl = new sap.ui.layout.form.FormElement({
			label: partNumberOpts.label,
			fields:[oValueHelpField]
		});

		oControl.getLabelControl().setTooltip(partNumberOpts.label);
		oControl.getLabelControl().setLayoutData(new sap.ui.layout.GridData({
			span: "L4 M4 S4",
			linebreak: true
		}));

		if(partNumberOpts.labelLayout) {
			oControl.getLabelControl().setLayoutData(partNumberOpts.labelLayout);
		}
		return oControl;
		
	},
	createContent: function(){
		this.first = true;
		sap.ui.getCore().getEventBus().subscribe("TreeNavigation", "Ready", this.onTreeNavigation, this);

		var app = new sap.m.App(); 
		var service = new lenovo.service.CFE();
		var oServiceUrl = service.getlcpe();
		this.oServiceUrl = oServiceUrl;
//		var oModel = new sap.ui.model.odata.ODataModel(oServiceUrl, true);
//		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
//		var auth = lenovo.control.commontable.Table.getViewAuth("whereUseReport");
//		
//		this.setConfig(config, oServiceUrl,auth);
//		config.bindRowUrl = "/UI_PRT_WHERE_USED";
		var header = lenovo.control.commontable.Table.createHeader("Report", "Where Use Report");
//		var table = lenovo.control.commontable.Table.createTable(config);
///*		table.setBusy(true);
//*/		table.setModel(oModel);
//		oModel.attachRequestCompleted(function(){
//			table.setBusy(false);
//		});	
//		this.table = table;
//		this.tableModel = oModel;
//		var filterPanel = lenovo.control.commontable.Table.createFilter(config, table);
//		this.oForm  = filterPanel.getContent()[0];
//		//toolbar		
//		var oEditDeleteUploadDownload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table,app);
					
		//app
	    var page = new sap.m.Page({
	      	  showHeader: false,
	          content : [header]//[header, filterPanel, oEditDeleteUploadDownload, table]//[layout]                
	    }); 
		var executeConfig = {
			formWidth: "66%",
			columns: [[{
					field: "CYCLE", label: "Cycle", type: "DropdownBox", 
					dropdownbox : {
						defaultValue: "CURRENT",
						odata:{
							defaultSelectAll: false,
							bindTextField: "ITEM_VALUE",
							bindKeyField: "ITEM_VALUE",
							url: oServiceUrl+"/UI_PRT_EXECUTE_DDL?$filter=ITEM_TYPE eq 'CYCLE'&$format=json"
						}				
					}
			}],[]],
			execute: {
				func: this.execute,
				context: this
			}
		};
		oPanel =  lenovo.control.commontable.Table.createExecutePanel(executeConfig);
		var oForm = oPanel.getContent()[0];
		var oFormContainers = oForm.getFormContainers();
		var lastFormContainer = oFormContainers[oFormContainers.length-1];
		
		var cycleDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Cycle")[0];
		this.cycleDropdownBox = cycleDropdownBox;
		var partNumberOpts = {
				field: "ITEM", label: "Part Number", type: "DropdownTable",
				dropdowntable : {
					defaultFilterOp: "EQ",
					url: oServiceUrl,
		//			selectionMode: sap.ui.table.SelectionMode.Single,
					field: "ITEM",	
					columns: [{
						label: "Part Number",
						field: "ITEM",
						type: "TextField"
					}],
					notRefreshTable: true,
					filters: [[{
						field: "ITEM",
						label: "Part Number",
						type: "MultiTextField"
					}]],
					_search: {
						func: this.reloadSearchItemDropdownTable,
						context: this
					},
					reload: {
						func: this.reloadItemDropdownTable,
						context: this
					}
				}
			};
		
		var oControl = this.createExecutePartNumber(oForm, partNumberOpts);
		lastFormContainer.addFormElement(oControl);

		page.insertContent(oPanel, 1);
		this.app = app;
		this.page = page;
		this.initialPage();	
		
        app.insertPage(page);
        app.setInitialPage(page);
        return app;	
	}
});
