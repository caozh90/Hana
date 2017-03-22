jQuery.sap.require("lenovo.control.commontable.Table");
sap.ui.jsview("lenovo.view.common.log", {
	getControllerName: function() {
		return "lenovo.view.common.log";
	},
	setConfig: function(config){
		for(var i = 0; i < config.columns.length; i++) {
			if(config.columns[i].field === "LOGSID") {
				config.columns.splice(i, 1);
				break;
			}
		}
		var startTimeField = lenovo.control.commontable.Toolkit.getMatchedElementFromArray("field", "START_TIME", config.columns)[0];
		startTimeField.width = "150px";
		var logDateField = lenovo.control.commontable.Toolkit.getMatchedElementFromArray("field", "LOG_DATE", config.columns)[0];
		logDateField.width = "150px";
		var createDateField = lenovo.control.commontable.Toolkit.getMatchedElementFromArray("field", "CREATE_DATE", config.columns)[0];
		createDateField.width = "150px";
		var endTimeDateField = lenovo.control.commontable.Toolkit.getMatchedElementFromArray("field", "END_TIME", config.columns)[0];
		endTimeDateField.width = "155px";


		var dateFields = lenovo.control.commontable.Toolkit.getMatchedElementFromArray("type","DatePicker", config.columns);
		for(var i = 0; i < dateFields.length; i++) {
			dateFields[i].type = "TextField";
			dateFields[i].width = "155px";
		}

	},
	getTransactionLogConfig: function(){
		var config = {};
		config.columns = [{
			label: "Event Name", 
			field: "EVENT_NAME",
			type: "TextField",
			width: "300px"
		}, {
			label: "Event Type",
			field: "EVENT_TYPE",
			type: "TextField",
			width: "120px"
		},{
			label: "Status",
			field: "STATUS",
			type: "TextField",
			width: "100px"
		}, {
			label: "Start Time",
			field: "START_TIME",
			type: "TextField",
			width: "155px"
		}, {
			label: "End Time",
			field: "END_TIME",
			type: "TextField",
			width: "155px"
		}, {
			label: "Message",
			field: "MESSAGE",
			type: "TextField",
			width: "150px"
		}, {
			label: "Details",
			field: "DETAILS",
			type: "TextField",
			width: "300px"
		}, {
			label: "Log Date",
			field: "LOG_DATE",
			type: "TextField",
			width: "155px"
		}, {
			label: "Create Date",
			field: "CREATE_DATE",
			type: "TextField",
			width: "155px"
		}, {
			label: "Module",
			field: "MODULE",
			type: "TextField",
			width: "130px"
		}, {
			label: "Step Count",
			field: "STEP_COUNT",
			type: "TextField",
			width: "100px"
		}, {
			label: "Current Step",
			field: "CURRENT_STEP",
			type: "TextField",
			width: "100px"
		}, {
			label: "User Name",
			field: "USER_NAME",
			type: "TextField",
			width: "150px"
		}];
		config.bindRowUrl = "/transLogs";
		config.filtersRaw =  [{
			field: "EVENT_NAME",
			label: "Event Name ",
			type: "TextField"
		}, {
			field: "MESSAGE",
			label: "Message",
			type: "TextField"
		}, {
			field: "DETAILS",
			label: "Details",
			type: "TextField"
		}, {
			field: "MODULE",
			label: "Module",
			type: "DropdownBox",
			dropdownbox: {
				odata: {
					defaultSelectAll: true,
					url: "/cdp/log/service/transactionLog.xsodata/transLogs_DDL?$filter=ITEM_TYPE eq 'MODULE'&$select=ITEM_VALUE&$format=json",
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE"
				}
			}
		},{
			field: "USER_NAME",
			label: "User Name",
			type: "DropdownBox",
			dropdownbox: {
				odata: {
					defaultSelectAll: true,
					url: "/cdp/log/service/transactionLog.xsodata/transLogs_DDL?$filter=ITEM_TYPE%20eq%20%27USER_NAME%27&$select=ITEM_VALUE&$format=json",
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE"
				}
			}
		}, {
			field: "CREATE_DATE",
			label: "Create Date",
			type: "TimeRange"
		}];
		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);
		config.filterLayout = {
			0: new sap.ui.layout.GridData({span: "L3 M3 S3"}),
			1: new sap.ui.layout.GridData({span: "L3 M3 S3"}),
			2: new sap.ui.layout.GridData({span: "L6 M6 S6"}),
		}
		return config;
	},
	getMonitorLogConfig: function(){
		var config = {};
		config.columns = [{
			field: "ACCESS_TIME",
			label: "Access Time",
			type: "TextField",
			width: "155px"
		}, {
			field: "REMOTE_HOST",
			label: "Remote Host",
			type: "TextField"
		},/* {
			field: "USER_NAME",
			label: "User Name",
			type: "TextField"
		}, */{
			field: "HTTP_REQUEST_METHOD",
			label: "Http Request Method",
			type: "TextField"
		}, {
			field: "HTTP_REQUEST_PATH",
			label: "Http Request Path",
			type: "TextField",
			width: "200px"
		}, {
			field: "HTTP_REQUEST_VERSION",
			label: "Http Request Version",
			type: "TextField"
		}, {
			field: "HTTP_RESPONSE_CODE",
			label: "Http Response Code",
			type: "TextField"
		}, {
			field: "HTTP_RESPONSE_LENGTH",
			label: "Http Response Length",
			type: "TextField"
		}, {
			field: "HTTP_REQUEST_DURATION",
			label: "Http Request Duration",
			type: "TextField"
		}, {
			field: "MODULE",
			label: "Module",
			type: "TextField"
		}];
		config.bindRowUrl = "/httpLogs";
		config.filtersRaw = [/*{
				field: "USER_NAME",
				label: "User Name",
				type: "DropdownBox",
				dropdownbox: {
					odata: {
						defaultSelectAll: true,
						url: "/cdp/log/service/httpLog.xsodata/httpLogs_DDL?$filter=ITEM_TYPE%20eq%20%27USER_NAME%27&$select=ITEM_VALUE&$format=json",
						bindTextField: "ITEM_VALUE",
						bindKeyField: "ITEM_VALUE"
					}
				}
			}, */{
				field: "HTTP_REQUEST_PATH",
				label: "Http Request Path",
				type: "TextField"
			}, {
				field: "MODULE",
				label: "Module",
				type: "DropdownBox",
				dropdownbox: {
					odata: {
						defaultSelectAll: true,
						url: "/cdp/log/service/httpLog.xsodata/httpLogs_DDL?$filter=ITEM_TYPE%20eq%20%27MODULE%27&$select=ITEM_VALUE&$format=json",
						bindTextField: "ITEM_VALUE",
						bindKeyField: "ITEM_VALUE"
					}
				}
			}, {
				field: "ACCESS_TIME",
				label: "Access Time",
				type: "TimeRange"
			}];
		config.filters = lenovo.control.commontable.Toolkit.splitChunck(2, config.filtersRaw);
		return config;
	},
	createContent: function(oController) {
		var sServiceUrl = "/cdp/log/service/transactionLog.xsodata";
		var bindRowUrl = "/transLogs";
		var auth = lenovo.control.commontable.Table.getViewAuth("log");
		var oTabStrip1 =  new sap.ui.commons.TabStrip("log");
		var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
		var today = new Date();
		var	threeMonthDate = new Date();
		var headerHeight = 325;
		var rowHeight = 30;
		threeMonthDate.setMonth(today.getMonth()-1);
		var deleteModel = new sap.ui.model.json.JSONModel({
			transactionStartTime:  threeMonthDate,
			transactionEndTime: today,
			monitorStartTime: threeMonthDate,
			monitorEndTime: today
		});
		oController.oModel = oModel;
		oController.deleteModel = deleteModel;
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		var config = this.getTransactionLogConfig();
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, lenovo.control.commontable.Toolkit.getWindowHeight() - headerHeight);
		var tansactionTable = lenovo.control.commontable.Table.createTable(config);
		tansactionTable.setBusy(true);
		tansactionTable.setModel(oModel);
		oModel.attachRequestCompleted(function(){
			tansactionTable.setBusy(false);
		});
		oController.tansactionTable = tansactionTable;
		var tansactionFilterPanel = lenovo.control.commontable.Table.createFilter(config, tansactionTable);
		var tstartLabel = new sap.ui.commons.Label({
			text: 'From ',
			labelFor: tstartTime
		}).addStyleClass("log-label");
		var tstartTime = new sap.ui.commons.DatePicker("startTime", {
			value: {
				path: "/transactionStartTime",
				type: new sap.ui.model.type.Date({pattern: "yyyy-MM-dd"})
			}
		}).addStyleClass("log-datepicker");
		var tendLabel = new sap.ui.commons.Label({
			text: 'End ',
			labelFor: tendTime
		}).addStyleClass("log-label");
		var tendTime = new sap.ui.commons.DatePicker("endTime", {
			value: {
				path: "/transactionEndTime",
				type: new sap.ui.model.type.Date({pattern: "yyyy-MM-dd"})
			}
		}).addStyleClass("log-datepicker");
		var tdeleteButton = new sap.ui.commons.Button({
			text: "Delete",
			icon: "sap-icon://delete",
			press: jQuery.proxy(oController.deleteTranscationLog, oController)
		}).addStyleClass("log-button");
		var oHLayout3 = new sap.ui.layout.HorizontalLayout("transaction-delete-layout", {
			content: [tstartLabel, tstartTime, tendLabel, tendTime, tdeleteButton]
		}).addStyleClass("log-hlayout");
		oHLayout3.setModel(deleteModel);
		var oVLayout1 = new sap.ui.layout.VerticalLayout({
			width: "100%"
		});
		if(auth && auth.logAdmin) {
			oVLayout1.addContent(oHLayout3);
		}
		oVLayout1.addContent(tansactionFilterPanel);
		oVLayout1.addContent(tansactionTable);
		oTabStrip1.createTab("Transaction Log", oVLayout1);

		// 2. tab: address data (use separate tab element)
		oTab2 = new sap.ui.commons.Tab();
		oTab2.setTooltip("Monitor Log");
		oTab2.setTitle(new sap.ui.core.Title("Title2", {
			text: "Monitor Log"
		}));
		var sMonitorServiceUrl = "/cdp/log/service/httpLog.xsodata";
		var monitorbindRowUrl = "/httpLogs";
		var mstartLabel = new sap.ui.commons.Label({
			text: 'From ',
			labelFor: mstartTime
		}).addStyleClass("log-label");

		var mstartTime = new sap.ui.commons.DatePicker("mstartTime", {
			value: {
				path: "/monitorStartTime",
				type: new sap.ui.model.type.Date({pattern: "yyyy-MM-dd"})
			}
		}).addStyleClass("log-datepicker");
		var mendLabel = new sap.ui.commons.Label({
			text: 'End ',
			labelFor: mendTime
		}).addStyleClass("log-label");
		var mendTime = new sap.ui.commons.DatePicker("mendTime", {
			value: {
				path: "/monitorEndTime",
				type: new sap.ui.model.type.Date({pattern: "yyyy-MM-dd"})
			}
		}).addStyleClass("log-datepicker");
		var tMdeleteButton = new sap.ui.commons.Button({
			text: "Delete",
			icon: "sap-icon://delete",
			press: jQuery.proxy(oController.deleteMonitorLog, oController)
		}).addStyleClass("log-button");
		var oHLayout1 = new sap.ui.layout.HorizontalLayout("monitor-delete-layout", {
			content: [mstartLabel,mstartTime, mendLabel,  mendTime, tMdeleteButton]
		}).addStyleClass("log-hlayout");
		var oMonitorModel = new sap.ui.model.odata.ODataModel(sMonitorServiceUrl, true);
		oController.oMonitorModel = oMonitorModel;
		//var monitorConfig = lenovo.control.commontable.Table.getDefaultTableConfig(oMonitorModel);
		var monitorConfig = this.getMonitorLogConfig();
		headerHeight = 310;
		monitorConfig.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, lenovo.control.commontable.Toolkit.getWindowHeight() - headerHeight);
		var monitorTable = lenovo.control.commontable.Table.createTable(monitorConfig);
		monitorTable.setBusy(true);
		monitorTable.setModel(oMonitorModel);
		oMonitorModel.attachRequestCompleted(function(){
			monitorTable.setBusy(false);
		});
		oController.monitorTable = monitorTable;
		var monitorFilterPanel = lenovo.control.commontable.Table.createFilter(monitorConfig, monitorTable);
		var oVLayout2 = new sap.ui.layout.VerticalLayout();
		if(auth && auth.logAdmin) {
			oVLayout2.addContent(oHLayout1);
		}
		oVLayout2.addContent(monitorFilterPanel);
		oVLayout2.addContent(monitorTable);
		oVLayout2.setModel(deleteModel);
		oTab2.addContent(oVLayout2);
		oTabStrip1.addTab(oTab2);			
		return oTabStrip1;
	}
});