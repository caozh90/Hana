/*
	develop by Coral Zhang @ 2015/1/6
*/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.control.Validation");
jQuery.sap.require("lenovo.service.SZVMI");
 
sap.ui.jsview("lenovo.view.szvmi.pmReports.saForVMI", {
	setConfig: function(config,sServiceUrl) {
		var windowHeight = lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(3);
		var auth =  lenovo.control.commontable.Table.getViewAuth("saForVMI");
		//var headerHeight = 400;
		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight - headerHeight);

		config.columns = [{
			field: "SA_NUMBER",
			label: "SA Number",
			type: "TextField",
			width: "100px"
		},{
			field: "SA_LINE_ID",
			label: "SA Line ID",
			type: "TextField",
			width: "100px"
		},{
			field: "ORDER_TYPE",
			label: "Order Type",
			type: "TextField",
			width: "10px"
		},{
			field: "LIFNR",
			label: "Vendor Code",
			type: "TextField",
			width: "120px"
		},{
			field: "WERKS",
			label: "Plant",
			type: "TextField",
			width: "80px"
		},{
			field: "STATUS",
			label: "Status",
			type: "TextField",
			width: "80px"
		},{
			field: "PURCHASE_GROUP",
			label: "Purchase Group",
			type: "TextField",
			width: "140px"
		},{
			field: "OPEN_QTY",
			label: "Open Qty",
			type: "TextField",
			width: "100px"
		},{
			field: "START_DATE",
			label: "Start Date",
			type: "TextField",
			width: "100px"
		},{
			field: "END_DATE",
			label: "End Date",
			type: "TextField",
			width: "100px"
		},{
			field: "CREATE_DATE",
			label: "Create Date",
			type: "TextField",
			width: "100px"
		},{
			field: "LINE_CHANGE_DATE",
			label: "SA Change Date",
			type: "TextField",
			width: "120px"
		}];
		
		config.bindRowUrl = "/SA_FOR_VMI";
		
		config.filtersRaw = [{
			field: "SA_NUMBER",
			label: "SA Number",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/SA_FOR_VMI_DDL?$format=json&$select=SA_NUMBER,MS",
				field: "SA_NUMBER",
				columns: [{
					field: "SA_NUMBER",
					label: "SA Number",
					type: "TextField"
				}],
				filters: [
					[{
						field: "SA_NUMBER",
						label: "SA Number",
						type: "TextField",
						textfield: {
							type: new lenovo.control.commontable.singleQuotes()
						}
					}]
				],
				visibleRowCount: 10
			}
		},{
			field: "ORDER_TYPE",
			label: "Order Type",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/SA_FOR_VMI_DDL?$format=json&$select=ORDER_TYPE,MS",
				field: "ORDER_TYPE",
				columns: [{
					field: "ORDER_TYPE",
					label: "Order Type",
					type: "TextField"
				}],
				filters: [
					[{
						field: "ORDER_TYPE",
						label: "Order Type",
						type: "TextField",
						textfield: {
							type: new lenovo.control.commontable.singleQuotes()
						}
					}]
				],
				visibleRowCount: 10
			}
		},{
			field: "LIFNR",
			label: "Vendor Code",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/SA_FOR_VMI_DDL?$format=json&$select=LIFNR,MS",
				field: "LIFNR",
				columns: [{
					field: "LIFNR",
					label: "Vendor Code",
					type: "TextField"
				}],
				filters: [
					[{
						field: "LIFNR",
						label: "Vendor Code",
						type: "TextField",
						textfield: {
							type: new lenovo.control.commontable.singleQuotes()
						}
					}]
				],
				visibleRowCount: 10
			}
		},{
			field: "START_DATE",
			label: "Start Date",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/SA_FOR_VMI_DDL?$format=json&$select=START_DATE,MS",
				field: "START_DATE",
				columns: [{
					field: "START_DATE",
					label: "Start Date",
					type: "TextField"
				}],
				filters: [
					[{
						field: "START_DATE",
						label: "Start Date",
						type: "TextField",
						textfield: {
							type: new lenovo.control.commontable.singleQuotes()
						}
					}]
				],
				visibleRowCount: 10
			}
		},{
			field: "CREATE_DATE",
			label: "Create Date",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/SA_FOR_VMI_DDL?$format=json&$select=CREATE_DATE,MS",
				field: "CREATE_DATE",
				columns: [{
					field: "CREATE_DATE",
					label: "Create Date",
					type: "TextField"
				}],
				filters: [
					[{
						field: "CREATE_DATE",
						label: "Create Date",
						type: "TextField",
						textfield: {
							type: new lenovo.control.commontable.singleQuotes()
						}
					}]
				],
				visibleRowCount: 10
			}
		},{
			field: "STATUS",
			label: "Status",
			type: "DropdownBox",
			dropdownbox : {
				defaultFilterValue: "",
				odata:{
					defaultSelectAll:true,
					url: sServiceUrl +"/SA_FOR_VMI_DDL?$format=json&$select=STATUS,MS",
					bindTextField:"STATUS",
					bindKeyField:"STATUS"
				}
			}
			/*dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/SA_FOR_VMI_DDL?$format=json&$select=STATUS,MS",
				field: "STATUS",
				columns: [{
					field: "STATUS",
					label: "Status",
					type: "TextField"
				}],
				filters: [
					[{
						field: "STATUS",
						label: "Status",
						type: "TextField",
						textfield: {
							type: new lenovo.control.commontable.singleQuotes()
						}
					}]
				],
				visibleRowCount: 10
			}*/
		},{
			field: "PURCHASE_GROUP",
			label: "Purchase Group",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/SA_FOR_VMI_DDL?$format=json&$select=PURCHASE_GROUP,MS",
				field: "PURCHASE_GROUP",
				columns: [{
					field: "PURCHASE_GROUP",
					label: "Purchase Group",
					type: "TextField"
				}],
				filters: [
					[{
						field: "PURCHASE_GROUP",
						label: "Purchase Group",
						type: "TextField",
						textfield: {
							type: new lenovo.control.commontable.singleQuotes()
						}
					}]
				],
				visibleRowCount: 10
			}
		}];
		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);
		//download
		config.download.filename = "data_export";
		config.download.table = '"_SYS_BIC"."cdp.szebgvmi.models.pmreport/AN_SA_FOR_VMI"';
		config.download.columns = ["SA_NUMBER","SA_LINE_ID","ORDER_TYPE","LIFNR","WERKS","STATUS","PURCHASE_GROUP","OPEN_QTY","START_DATE","END_DATE","CREATE_DATE","LINE_CHANGE_DATE"];
		config.download.roleName = auth.exportableRoleName;
		//auth
		config.create.visible=false;
		config.edit.visible=false;
		config.deleteable.visible=false;
		config.upload.visible=false;
		config.download.visible = false;
		
		for (i in auth) {
			switch(i) {
				case "exportable":
					config.download.visible = auth[i];
					break;
				case "createable":
					config.create.visible = auth[i];
					break;
				case "deleteable":
					config.deleteable.visible = auth[i];
					break;
				case "editable":
					config.edit.visible = auth[i];
					break;
				case "uploadable":
					config.upload.visible = auth[i];
					break;
			}
		}
		
	},

	createContent: function(oController) {
		var service = new lenovo.service.SZVMI;

		var sServiceUrl = service.getMXVmiReport();
		var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);

		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		this.setConfig(config, sServiceUrl);

		var table = lenovo.control.commontable.Table.createTable(config);
		table.setBusy(true);
		table.setModel(oModel);
		oModel.attachRequestCompleted(function() {
			table.setBusy(false);
		});
		var filterPanel = lenovo.control.commontable.Table.createFilter(config, table);
		
		this.table = table;
		this.oModel = oModel;
		this.config = config;
		this.oForm = filterPanel.getContent()[0];
		sap.ui.getCore().getEventBus().subscribe("TreeNavigation", "Ready", this.onTreeNavigation, this);

		var oInsertUpload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table);
		var header = lenovo.control.commontable.Table.createHeader("PM Reports", "SA for SZVMI");
		return [header, filterPanel, oInsertUpload, table];
	},

	onTreeNavigation: function(sChannel, sEvent, oData){
		if(oData.view === "SA for Mexico SZVMI") {
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