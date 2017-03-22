/*
	 by Robin @ 2014/1/14
*/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.control.Validation");
jQuery.sap.require("lenovo.service.VMI");

sap.ui.jsview("lenovo.view.vmi.DSworkflow.dsMonitor", {
	setConfig: function(config,sServiceUrl, userName, auth, moduleName) {
		var windowHeight = lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(3);
		//var headerHeight = 400;
		var rowHeight = 32;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight - headerHeight);

		config.columns = [{
			field: "JOBRUNID",
			label: "Run Id",
			type: "TextField",
			width: "120px"
		},{
			field: "SEQUENCEID",
			label: "Sequence Id",
			type: "TextField",
			width: "120px"
		},{
			field: "USERNAME",
			label: "User Name",
			type: "TextField",
			width: "120px"
		},{
			field: "STEPID",
			label: "Step Id",
			type: "TextField",
			width: "100px"
		},{
			field: "SUBSTEP_INFO",
			label: "Substep Info",
			type: "TextField",
			width: "150px"
		},{
			field: "JOBSTATUS",
			label: "Status",
			type: "TextField",
			width: "80px"
		},{
			field: "REPONAME",
			label: "Repo Name",
			type: "TextField",
			width: "150px"
		},{
			field: "JOBNAME",
			label: "Job Name",
			type: "TextField",
			width: "150px"
		},{
			field: "PROCESSNAME",
			label: "Process Name",
			type: "TextField",
			width: "150px"
		},{
			field: "LOADINGMODE",
			label: "Loading Mode",
			type: "TextField",
			width: "150px"
		},{
			field: "DSSERVER",
			label: "DS Server",
			type: "TextField",
			width: "150px"
		},{
			field: "STARTTIME",
			label: "Start Time",
			type: "TextField",
			width: "130px"
		},{
			field: "ENDTIME",
			label: "End Time",
			type: "TextField",
			width: "130px"
		}];
		config.bindRowUrl = "/DS_JOB_RUN_INFO";
		config.defaultSort = {
			field: "STARTTIME",
			bDescending: true
		};

		config.filtersRaw = [];

		if(auth.admin){
			config.filtersRaw.push({
				field: "USERNAME",
				label: "User Name",
				type: "DropdownBox",
				dropdownbox: {
					data: [
						{text: lenovo.control.Constants.allDropdownBoxListItem, key: lenovo.control.Constants.allDropdownBoxListItem},
						{text: "SYSTEM", key: "SYSTEM"},
						{text: userName, key: userName}
					]
				}
			});
		}else{
			config.filtersRaw.push({
				field: "USERNAME",
				label: "User Name",
				type: "DropdownBox",
				dropdownbox: {
					data: [
						{text: userName, key: userName},
						{text: "SYSTEM", key: "SYSTEM"}
						
					]
				}
			});
		}

		config.filtersRaw.push({
			field: "JOBRUNID",
			label: "Run Id",
			type: "TextField"
		},{
			field: "JOBSTATUS",
			label: "Job Status",
			type: "DropdownBox",
			dropdownbox: {
				odata: {
					defaultSelectAll: true,
					url: sServiceUrl + "/DS_JOB_RUN_INFO_STATUS?$format=json",
					bindKeyField:  "JOBSTATUS",
					bindTextField:  "JOBSTATUS"
					
				}
			}
		},{
			field: "JOBNAME",
			label: "Job Name",
			type: "DropdownBox",
			dropdownbox: {
				odata: {
					defaultSelectAll: true,
					url: sServiceUrl + "/JOB_NAME?$filter=TARGET eq '" + moduleName + "'&$format=json",
					bindKeyField:  "JOB_NAME",
					bindTextField:  "JOB_NAME"
					
				}
			}
		},{
			field: "PROCESSNAME",
			label: "Process Name",
			type: "DropdownBox",
			dropdownbox: {
				odata: {
					defaultSelectAll: true,
					url: sServiceUrl + "/PROCESS_NAME?$filter=TARGET eq '" + moduleName + "'&$format=json",
					bindKeyField:  "PROCESS_NAME",
					bindTextField:  "PROCESS_NAME"
					
				}
			}
		},{
			field: "TARGET",
			label: "Target",
			type: "TextField",
			textfield: {
				defaultFilterOp: "EQ",
				enabled: false,
				defaultFilterValue: [moduleName]
			}
		}, {
			field: "STARTTIME",
			label: "Start Time",
			labelLayout: new sap.ui.layout.GridData({
				span: "L3 M3 S3",
				linebreak: true
			}),
			type: "TimeRange",
			timerange: {
				fromLabelLayout: new sap.ui.layout.GridData({
					span: "L2 M2 S2"
				}),
				layout: new sap.ui.layout.GridData({
					span: "L9 M9 S9"
				})
			}
		}, {
			field: "ENDTIME",
			label: "End Time",
			labelLayout: new sap.ui.layout.GridData({
				span: "L3 M3 S3",
				linebreak: true
			}),
			type: "TimeRange",
			timerange: {
				fromLabelLayout: new sap.ui.layout.GridData({
					span: "L2 M2 S2"
				}),
				layout: new sap.ui.layout.GridData({
					span: "L9 M9 S9"
				})
			}
		});

		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);

		config.create.visible=false;
		config.edit.visible=false;
		config.deleteable.visible=false;
		config.upload.visible=false;
		config.download.visible = false;

	},
	onTreeNavigation: function(sChannel, sEvent, oData){
		console.log("oData", oData);
		if(oData.view === "DS Job Monitor & Resubmission") {
			if(this.table && this.oModel) {
				this.oModel.refresh(true);
				this.table.setBusy(true);
			}
		}
	},
	createContent: function(oController) {
		var that = this;
		var service = new lenovo.service.VMI;
		var auth =  lenovo.control.commontable.Table.getViewAuth("dsMonitor");
		console.log(auth);
		
		var sServiceUrl = "/cdp/ds/services/tableview.xsodata";
		var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
		var oModelModule = sap.ui.getCore().getModel("module");
		var modulename = oModelModule.getProperty("NAME");
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		this.setConfig(config, sServiceUrl, localStorage.USERNAME, auth, modulename);
		sap.ui.getCore().getEventBus().subscribe("TreeNavigation", "Ready", this.onTreeNavigation, this);
		var table = lenovo.control.commontable.Table.createTable(config);
		this.table = table;
		table.setBusy(true);
		table.setModel(oModel);
		this.oModel = oModel;
		oModel.attachRequestCompleted(function() {
			table.setBusy(false);
		});
		table.setSelectionBehavior(sap.ui.table.SelectionBehavior.Row);
		table.setSelectionMode(sap.ui.table.SelectionMode.Single);
		
		table.attachRowSelectionChange({that: that, sServiceUrl: sServiceUrl, auth: auth, modulename: modulename},that._showDetail);
		// table.sort(table.getColumns()[0],sap.ui.table.SortOrder.Descending);
		var columns = table.getColumns();
		columns[1].setVisible(false);
		columns[6].setVisible(false);
		columns[10].setVisible(false);

		var filterPanel = lenovo.control.commontable.Table.createFilter(config, table);

		var oInsertUpload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table);
		var header = lenovo.control.commontable.Table.createHeader("DS Management", "DS Job Monitor & Resubmission");

		return [header, filterPanel, oInsertUpload, table];
	},

	_showDetail: function(oEvent, odata, auth){
		var table = oEvent.getSource();
		var that = odata.that;
		var sServiceUrl = odata.sServiceUrl;
		var auth = odata.auth;
		var selectedIndex = table.getSelectedIndex();
		if(selectedIndex == -1){
			return;
		}
		var rowCount = table.getRows().length
		selectedIndex = selectedIndex % rowCount;
		var row = table.getRows()[selectedIndex];
		var object = table.getContextByIndex(table.getSelectedIndex()).getObject();
		var jobRunID = object.JOBRUNID;
		var reportName = object.REPONAME;
		var jobName = object.JOBNAME;
		var processName = object.PROCESSNAME;
		var innerTable = that._createInnerTable(sServiceUrl, jobRunID, reportName, auth.admin?auth.admin:false, jobName, processName, table, odata.modulename);
		// var toolPopup = that._createToolPopup(innerTable, row.getCells()[0]);
		var toolPopup = that._createDialog(innerTable,table);
		// if((rowCount - selectedIndex) < 6){
		// 	toolPopup.open(sap.ui.core.Popup.Dock.BeginBottom, sap.ui.core.Popup.Dock.EndBottom);
		// }else{
		// 	toolPopup.open(sap.ui.core.Popup.Dock.BeginCenter, sap.ui.core.Popup.Dock.EndCenter);
		// }
		that._showPopup(toolPopup, selectedIndex, table);
	},

	_showPopup: function(toolPopup, selectedIndex, table){
		toolPopup.open();

	},

	_createDialog: function(innerTable, table){
		var dialog = new Dialog({
			title: "Job Detail",
			contentWidth:"100%",
			resizable: false,
			keepInWindow: true,
			height: "470px",
			modal: true,
			content: innerTable,
			closed:function(){
				table.clearSelection();
				this.destroy();
			},
		});
		// dialog.open();
		dialog.ondragstart = false;
		// var oButton = new sap.ui.commons.Button("done",{
		// 	text : "Close", 
		// 	press: function(){
		// 		dialog.close();
		// 	}});
		// dialog.addButton(oButton);

		return dialog;
	},

	_createToolPopup: function(innerTable, cell){
		// var tp = cell.$().data("tp");
		// console.log(tp);

		var tp = new sap.ui.ux3.ToolPopup({
			autoClose: true,
			content : [innerTable],
			opener : cell
		});

		return tp;
	},

	_createInnerTable: function(sServiceUrl, jobRunID, reportName, adminFlag, jobName, processName, table, modulename){
		var that = this;
		// Create a TabStrip instance
		var oTabStrip1 = new sap.ui.commons.TabStrip();
		oTabStrip1.setWidth("1000px");
		oTabStrip1.setHeight("400px");
		oTabStrip1.attachClose( function (oEvent) {
			var oTabStrip = oEvent.oSource;
			oTabStrip.closeTab(oEvent.getParameter("index"));
		});

		var oStepTable = new sap.ui.table.Table({
			navigationMode: sap.ui.table.NavigationMode.Scrollbar,
			// width: "100%",
			visibleRowCount: 10
		});

		if(adminFlag){
			oStepTable.setVisibleRowCount(9);
		}

		oStepTable.addColumn(new sap.ui.table.Column({
			label: new sap.ui.commons.Label({text: "Step ID"}),
			template: new sap.ui.commons.TextView().bindProperty("text", "STEPID"),
			sortProperty: "STEPID",
			filterProperty: "STEPID",
			width: "70px"
		}));
		oStepTable.addColumn(new sap.ui.table.Column({
			label: new sap.ui.commons.Label({text: "Sub Step"}),
			template: new sap.ui.commons.TextView().bindProperty("text", "SUBSTEPID"),
			sortProperty: "SUBSTEPID",
			filterProperty: "SUBSTEPID",
			width: "90px"
		}));
		oStepTable.addColumn(new sap.ui.table.Column({
			label: new sap.ui.commons.Label({text: "Substep Info"}),
			template: new sap.ui.commons.TextView().bindProperty("text", "SUBSTEP_INFO"),
			sortProperty: "SUBSTEP_INFO",
			filterProperty: "SUBSTEP_INFO",
			width: "400px"
		}));
		oStepTable.addColumn(new sap.ui.table.Column({
			label: new sap.ui.commons.Label({text: "Status"}),
			template: new sap.ui.commons.TextView().bindProperty("text", "STATUS"),
			sortProperty: "STATUS",
			filterProperty: "STATUS",
			width: "80px"
		}));
		oStepTable.addColumn(new sap.ui.table.Column({
			label: new sap.ui.commons.Label({text: "Start Time"}),
			template: new sap.ui.commons.TextView().bindProperty("text", "STARTTIME", function(value){
							if(value instanceof Date) {
								return lenovo.control.commontable.Toolkit.timeDateFormat.format(value, true);
							}
							return value;
						}),
			sortProperty: "STARTTIME",
			filterProperty: "STARTTIME",
			width: "150px"
		}));
		oStepTable.addColumn(new sap.ui.table.Column({
			label: new sap.ui.commons.Label({text: "End Time"}),
			template: new sap.ui.commons.TextView().bindProperty("text", "ENDTIME", function(value){
							if(value instanceof Date) {
								return lenovo.control.commontable.Toolkit.timeDateFormat.format(value, true);
							}
							return value;
						}),
			sortProperty: "ENDTIME",
			filterProperty: "ENDTIME",
			width: "150px"
		}));
		var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
		oStepTable.setModel(oModel);
		oStepTable.getModel().setDefaultCountMode("None");
		var rowUrl = "/DS_JOB_STEP_INFO?$filter=(JOBRUNID eq '" + jobRunID 
			+ "')and(REPONAME eq '" + reportName + "')";
		var sort = [
			new sap.ui.model.Sorter("STEPID", false),
			new sap.ui.model.Sorter("SUBSTEPID", false),		
			new sap.ui.model.Sorter("STARTTIME", false),
			new sap.ui.model.Sorter("ENDTIME", false)
		];

		oStepTable.bindRows(rowUrl, null, sort);
		oStepTable.setSelectionBehavior(sap.ui.table.SelectionBehavior.Row);
		oStepTable.setSelectionMode(sap.ui.table.SelectionMode.Single);

		// oStepTable.sort(oStepTable.getColumns()[4]);
		var oHD = new sap.ui.commons.HorizontalDivider().addStyleClass("HDStyle");
		
		var oLayout = new sap.ui.layout.VerticalLayout({
			content: [oStepTable, oHD]
		});

		var visible_flag = true;
		if(modulename == 'EBGCFE') {
			visible_flag = false;
		}
		if(adminFlag){
			var reTrigger = new sap.ui.commons.Button({
				text: "Release",
				visible: visible_flag,
				press: function(){
					that._releaseLock(oStepTable, jobName, processName, table);
				}
			}).addStyleClass("DSBtn");
			oLayout.addContent(reTrigger);

			var reTrigger = new sap.ui.commons.Button({
				text: "Retrigger",
				visible: visible_flag,
				press: function(){
					that._reTrigger(oStepTable, jobName, processName, table);
				}
			}).addStyleClass("DSBtn");
			oLayout.addContent(reTrigger);
		}

		oTabStrip1.createTab("Step Info",oLayout);

		var oErrorTable = new sap.ui.table.Table({
			navigationMode: sap.ui.table.NavigationMode.Scrollbar,
			visibleRowCount: 8
		});
		oErrorTable.addColumn(new sap.ui.table.Column({
			label: new sap.ui.commons.Label({text: "Error Message"}),
			template: new sap.ui.commons.TextArea({
                            row:6,
                            width: "100%",
                        }).bindProperty("value", "ERROR_MSG").bindProperty("tooltip", "ERROR_MSG"),
			sortProperty: "ERROR_MSG",
			filterProperty: "ERROR_MSG",
			width: "500px"
		}));
		oErrorTable.addColumn(new sap.ui.table.Column({
			label: new sap.ui.commons.Label({text: "XML File Name"}),
			template: new sap.ui.commons.TextView().bindProperty("text", "XMLFILENAME"),
			sortProperty: "XMLFILENAME",
			filterProperty: "XMLFILENAME",
			width: "120px"
		}));
		oErrorTable.addColumn(new sap.ui.table.Column({
			label: new sap.ui.commons.Label({text: "Error Type"}),
			template: new sap.ui.commons.TextView().bindProperty("text", "ERROR_TYPE"),
			sortProperty: "ERROR_TYPE",
			filterProperty: "ERROR_TYPE",
			width: "120px"
		}));
		oErrorTable.addColumn(new sap.ui.table.Column({
			label: new sap.ui.commons.Label({text: "Result"}),
			template: new sap.ui.commons.TextView().bindProperty("text", "RESULT"),
			sortProperty: "RESULT",
			filterProperty: "RESULT",
			width: "70px"
		}));
		oErrorTable.addColumn(new sap.ui.table.Column({
			label: new sap.ui.commons.Label({text: "Process Time"}),
			template: new sap.ui.commons.TextView().bindProperty("text", "PROCESS_TIME", function(value){
							if(value instanceof Date) {
								return lenovo.control.commontable.Toolkit.timeDateFormat.format(value, true);
							}
							return value;
						}),
			sortProperty: "PROCESS_TIME",
			filterProperty: "PROCESS_TIME",
			width: "150px"
		}));
		var oErrorModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
		oErrorTable.setModel(oErrorModel);
		oErrorTable.getModel().setDefaultCountMode("None");
		var rowErrUrl = "/DS_JOB_PROCESS_INFO?$filter=(JOBRUNID eq '" + jobRunID 
			+ "')and(REPONAME eq '" + reportName + "')"
		oErrorTable.bindRows(rowErrUrl);
		oTabStrip1.createTab("Error Info",oErrorTable);

		var oRfcTable = new sap.ui.table.Table({
			navigationMode: sap.ui.table.NavigationMode.Scrollbar
		});
		oRfcTable.addColumn(new sap.ui.table.Column({
			label: new sap.ui.commons.Label({text: "RFC Name"}),
			template: new sap.ui.commons.TextView().bindProperty("text", "RFCNAME"),
			sortProperty: "RFCNAME",
			filterProperty: "RFCNAME",
			width: "150px"
		}));
		oRfcTable.addColumn(new sap.ui.table.Column({
			label: new sap.ui.commons.Label({text: "RFC Return"}),
			template: new sap.ui.commons.TextView().bindProperty("text", "RFCRETURN"),
			sortProperty: "RFCRETURN",
			filterProperty: "RFCRETURN",
			width: "200px"
		}));
		oRfcTable.addColumn(new sap.ui.table.Column({
			label: new sap.ui.commons.Label({text: "Return Type"}),
			template: new sap.ui.commons.TextView().bindProperty("text", "RFCINTERNAL_RETURNTYPE"),
			sortProperty: "RFCINTERNAL_RETURNTYPE",
			filterProperty: "RFCINTERNAL_RETURNTYPE",
			width: "200px"
		}));
		oRfcTable.addColumn(new sap.ui.table.Column({
			label: new sap.ui.commons.Label({text: "Return Message"}),
			template: new sap.ui.commons.TextView().bindProperty("text", "RFCINTERNAL_RETURNMESSAGE"),
			sortProperty: "RFCINTERNAL_RETURNMESSAGE",
			filterProperty: "RFCINTERNAL_RETURNMESSAGE",
			width: "200px"
		}));
		oRfcTable.addColumn(new sap.ui.table.Column({
			label: new sap.ui.commons.Label({text: "Timestamp"}),
			template: new sap.ui.commons.TextView().bindProperty("text", "CURTIMESTAMP", function(value){
							if(value instanceof Date) {
								return lenovo.control.commontable.Toolkit.timeDateFormat.format(value, true);
							}
							return value;
						}),
			sortProperty: "CURTIMESTAMP",
			filterProperty: "CURTIMESTAMP",
			width: "150px"
		}));
		var oRFCModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
		oRfcTable.setModel(oRFCModel);
		oRfcTable.getModel().setDefaultCountMode("None");
		var rowRFCUrl = "/DS_JOB_RFC_RETURN?$filter=(JOBRUNID eq '" + jobRunID 
			+ "')and(REPONAME eq '" + reportName + "')"
		oRfcTable.bindRows(rowRFCUrl);
		oTabStrip1.createTab("RFC Info",oRfcTable);

		oTabStrip1.addStyleClass("dsTabStyle");
		return oTabStrip1;
	},

	_releaseLock: function(oStepTable, jobName, processName, table){
		//alert("Release Lock");
		var that = this;
		var sendData = {};
		//var selectedIndex = oStepTable.getSelectedIndex();
		// if(selectedIndex == -1){
		// 	lenovo.control.commontable.Toolkit.showErrorMsg("Please select at least one record", "ERROR", "Error");
		// 	return;
		// }

		table.setBusy(true);

		sendData.JOB_TYPE = "REVOKE";
		sendData.PROCESS_NAME = processName;
		sendData.JOB_NAME = jobName;
 		//sendData.G_STARTFROMSTEP = oStepTable.getContextByIndex(oStepTable.getSelectedIndex()).getObject().STEPID;
 		//sendData.G_STARTFROMSUBSTEP = oStepTable.getContextByIndex(oStepTable.getSelectedIndex()).getObject().SUBSTEPID;


 		console.log(sendData);

		var oLabel = new sap.ui.commons.Label({
			text: "Do you want to release the lock?",
			width: "350px",
		});
		sap.ui.commons.MessageBox.confirm(oLabel, function(result){
			if(result) {
				that._releaseService(sendData, table);
			}
			else {
				table.setBusy(false);
			}
		}, 	"Confirm");
	},

	_releaseService: function(sendData, table){
		console.log(JSON.stringify(sendData));
		$.ajax({
			url: "/cdp/ds/services/unlock.xsjs",
			type:"post",
			dataType: "text",
			data: JSON.stringify(sendData),
			success: function(resp){
				table.setBusy(false);
				table.getModel().refresh(true);
				console.log(resp);				
				lenovo.control.commontable.Toolkit.refreshDropdownbox();
				lenovo.control.commontable.Toolkit.showErrorMsg(resp, "SUCCESS", "Successfully");
			},
			error: function(resp){
				table.setBusy(false);
				table.getModel().refresh(true);
				lenovo.control.commontable.Toolkit.showErrorMsg(resp.responseText, "ERROR", "Error");
			}
		});
	},

	_reTrigger: function(oStepTable, jobName, processName, table){
		var that = this;
		var sendData = {};
		var selectedIndex = oStepTable.getSelectedIndex();
		if(selectedIndex == -1){
			lenovo.control.commontable.Toolkit.showErrorMsg("Please select at least one record", "ERROR", "Error");
			return;
		}

		table.setBusy(true);

		sendData.JOB_TYPE = "REVOKE";
		sendData.PROCESS_NAME = processName;
		sendData.JOB_NAME = jobName;
 		sendData.G_STARTFROMSTEP = oStepTable.getContextByIndex(oStepTable.getSelectedIndex()).getObject().STEPID;
 		sendData.G_STARTFROMSUBSTEP = oStepTable.getContextByIndex(oStepTable.getSelectedIndex()).getObject().SUBSTEPID;

 		console.log(sendData);
 		var lock_flag = 0;
 		var checkLock = {
 			"JOB_NAME": jobName
 		}
 		$.ajax({
			url: "/cdp/ds/services/locked_check.xsjs",
			type:"post",
			dataType: "text",
			async: false,
			data: JSON.stringify(checkLock),
			success: function(resp){
				console.log(resp);
				lock_flag = resp;
			},
			error: function(resp){
				table.setBusy(false);
				table.getModel().refresh(true);
				lenovo.control.commontable.Toolkit.showErrorMsg(resp.responseText, "ERROR", "Error");
			}
		});

 		console.log("lock_flag",lock_flag);
 		var oLabel;
 		if(lock_flag == 1) {
			oLabel = new sap.ui.commons.Label({
				text: "Do you want to release the lock and retrigger it from this step?",
				width: "350px",
			});
		}
		else if(lock_flag == 0){
			oLabel = new sap.ui.commons.Label({
				text: "Do you want to retrigger it from this step?",
				width: "350px",
			});
		}else{
			lenovo.control.commontable.Toolkit.showErrorMsg(lock_flag, "ERROR", "Error");
		}
		if(oLabel){
			sap.ui.commons.MessageBox.confirm(oLabel, function(result){
				if(result) {
					that._retriggerService(sendData, table);
				}
				else {
					table.setBusy(false);
				}
			}, 	"Confirm");
		}		
	},

	_retriggerService: function(sendData, table){
		console.log(JSON.stringify(sendData));
		$.ajax({
			url: "/cdp/ds/services/revoke_ds.xsjs",
			type:"post",
			dataType: "text",
			data: JSON.stringify(sendData),
			success: function(resp){
				table.setBusy(false);
				table.getModel().refresh(true);
				console.log(resp);
				lenovo.control.commontable.Toolkit.refreshDropdownbox();
				lenovo.control.commontable.Toolkit.showErrorMsg(resp, "SUCCESS", "Successfully");
			},
			error: function(resp){
				table.setBusy(false);
				table.getModel().refresh(true);
				lenovo.control.commontable.Toolkit.showErrorMsg(resp.responseText, "ERROR", "Error");
			}
		});
	}

});


