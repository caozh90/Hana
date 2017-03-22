/*
develop by Alex Liu @ 2014/12/15
Tip:lack upload function;download filename hasn't be determined;
lack edit dropdowntable
*/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.control.Validation");
jQuery.sap.require("lenovo.service.VMI");

sap.ui.jsview("lenovo.view.vmi.control.urgentMOMaintaince", {
	getControllerName: function() {

	},

	setConfig: function(config, sServiceUrl, uServiceUrl,dSchema) {
		var windowHeight = lenovo.control.commontable.Toolkit.getWindowHeight();
		var auth =  lenovo.control.commontable.Table.getViewAuth("urgentMOMaintaince");
		//var headerHeight = 350;
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(5); 
		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight - headerHeight);

		config.columns = [{
			field: "MO_ID",
			label: "MO Id",
			type: "TextField",
			width: "150px"
		}, {
			field: "BOM_NAME",
			label: "BOM Name",
			type: "TextField",
			width: "100px"
		}, {
			field: "LOGICAL_PLANT",
			label: "Logical Plant",
			type: "DropdownBox",
			width: "150px",
			dropdownbox: {
				odata: {
					url: sServiceUrl + "/CONF_SITEMASTER2?$format=json&$select=SITEID,MS",					
					bindKeyField: "SITEID",
					bindTextField: "SITEID",
					defaultSelectAll: true
				}
			}
		}, {
			field: "DS_LINE",
			label: "Production Line",
			type: "DropdownTable",
			width: "150px",
			dropdowntable: {
				url: sServiceUrl,
				bindRowUrl: "/UI_LINE_FLOOR_MAPPING",
				field: "DS_LINE",
				columns: [{
					label: "Production Line",
					field: "DS_LINE",
					type: "TextField"
				}, {
					label: "Physical Plant",
					field: "PHYSICAL_PLANT",
					type: "TextField"
				}],
				filters: [
					[{
						label: "Production Line",
						field: "DS_LINE",
						type: "TextField",
						labelLayout: new sap.ui.layout.GridData({
							span: "L5 M5 S5",
							linebreak: true
						}),
						textfield: {
							layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				}),
							defaultFilterOp: "EQ"
						}
					}],
					[{
						label: "Physical Plant",
						field: "PHYSICAL_PLANT",
						type: "TextField",
						labelLayout: new sap.ui.layout.GridData({
							span: "L5 M5 S5",
							linebreak: true
						}),
						textfield: {
							layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				}),
							defaultFilterOp: "EQ"
						}
					}]
				],
				visibleRowCount: 10
			}
		}, {
			field: "QUANTITY",
			label: "Quantity",
			type: "TextField",
			width: "100px"
		}, {
			field: "STATUS",
			label: "Status",
			type: "TextField",
			width: "100px"
		}, {
			field: "PLANNED_START_TIME",
			label: "Planned Start Time",
			type: "DatePicker",
			width: "200px",
			datepicker: {
				format: "yyyy-MM-dd HH:mm:ss"
			}
		}, {
			field: "PLANNED_END_TIME",
			label: "Planned End time",
			type: "DatePicker",
			width: "200px",
			datepicker: {
				format: "yyyy-MM-dd HH:mm:ss"
			}
		}, {
			field: "START_TIME",
			label: "Start Time",
			type: "DatePicker",
			width: "200px",
			datepicker: {
				format: "yyyy-MM-dd HH:mm:ss"
			}
		}, {
			field: "END_TIME",
			label: "End Time",
			type: "DatePicker",
			width: "200px",
			datepicker: {
				format: "yyyy-MM-dd HH:mm:ss"
			}
		}];

		config.bindRowUrl = "/UI_URGENT_MO_PULL";
		config.defaultSort = [{
			field: "LOGICAL_PLANT",
			bDescending: false
		}];

		config.filtersRaw = [{
			field: "MO_ID",
			label: "MO Id",
			type: "TextField"
		}, {
			field: "LOGICAL_PLANT",
			label: "Logical Plant",
			type: "DropdownBox",
			dropdownbox: {
				odata: {
					url: sServiceUrl + "/CONF_SITEMASTER2?$format=json&$select=SITEID,MS",
					bindKeyField: "SITEID",
					bindTextField: "SITEID",
					defaultSelectAll: true
				}
			}
		}, {
			field: "QUANTITY",
			label: "Quantity",
			type: "MultiEQ",
			multieq: {
				defaultFilterOp: "EQ"
			}
		}, {
			field: "STATUS",
			label: "Status",
			type: "DropdownBox",
			dropdownbox: {
				odata: {
					url: sServiceUrl + "/InputParams('UI_MO_STATUS_TYPE')/Results?$format=json",
					bindKeyField: "PVALUE",
					bindTextField: "PVALUE",
					defaultSelectAll: true
				}
			}
		}, {
			field: "START_TIME",
			label: "Start Time",
			type: "MultiDatePicker",
			multidatepicker: {
				defaultFilterOp: "GE"
			}
		}, {
			field: "END_TIME",
			label: "End Time",
			type: "MultiDatePicker",
			multidatepicker: {
				defaultFilterOp: "LE"
			}
		}, {
			field: "BOM_NAME",
			label: "BOM Name",
			type: "TextField"
		}, {
			field: "DS_LINE",
			label: "Production Line",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/UI_LINE_FLOOR_MAPPING",
				field: "DS_LINE",
				columns: [{
					label: "Production Line",
					field: "DS_LINE",
					type: "TextField"
				}, {
					label: "Physical Plant",
					field: "PHYSICAL_PLANT",
					type: "TextField"
				}],
				filters: [
					[{
						label: "Production Line",
						field: "DS_LINE",
						type: "TextField",
						labelLayout: new sap.ui.layout.GridData({
							span: "L5 M5 S5",
							linebreak: true
						}),
						textfield: {
							layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				}),
							// defaultFilterOp: "EQ"
							// type: new lenovo.control.commontable.singleQuotes()
						}
					}],
					[{
						label: "Physical Plant",
						field: "PHYSICAL_PLANT",
						type: "TextField",
						labelLayout: new sap.ui.layout.GridData({
							span: "L5 M5 S5",
							linebreak: true
						}),
						textfield: {
							layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				}),
							// defaultFilterOp: "EQ"
							// type: new lenovo.control.commontable.singleQuotes()
						}
					}]
				],
				visibleRowCount: 10
			}
		}, {
			field: "PLANNED_START_TIME",
			label: "Planned Start Time",
			type: "MultiDatePicker",
			multidatepicker: {
				defaultFilterOp: "GE"
			}
		}, {
			field: "PLANNED_END_TIME",
			label: "Planned End Time",
			type: "MultiDatePicker",
			multidatepicker: {
				defaultFilterOp: "LE"
			}
		}];

		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);
		config.filterLayout = {
			0: new sap.ui.layout.GridData({
				span: "L3 M3 S3"
			}),
			1: new sap.ui.layout.GridData({
				span: "L4 M4 S4"
			}),
			2: new sap.ui.layout.GridData({
				span: "L5 M5 S5"
			}),

		};

		//download
		config.download.filename = "data_export";
		config.download.table = '"_SYS_BIC"."cdp.mxebgvmi.models/AT_URGENT_MO_MAINTENCE"';
		config.download.columns = ["MO_ID", "BOM_NAME", "LOGICAL_PLANT", "DS_LINE", "QUANTITY", "STATUS", "PLANNED_START_TIME",
			"PLANNED_END_TIME", "START_TIME", "END_TIME"
		];
		config.download.roleName = auth.exportableRoleName;
		//create
		config.create.url = "/UI_URGENT_MO_PULL";
		config.insertRaw = [{
			field: "MO_ID",
			label: "MO Id",
			type: "TextField",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}]
		}, {
			field: "BOM_NAME",
			label: "BOM Name",
			type: "TextField",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}]
		}, {
			field: "LOGICAL_PLANT",
			label: "Logical Plant",
			type: "DropdownBox",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
			dropdownbox: {
				odata: {
					url: sServiceUrl + "/CONF_SITEMASTER2?$format=json&$SITEID,MS",
					bindKeyField: "SITEID",
					bindTextField: "SITEID"
				}
			}
		}, {
			field: "DS_LINE",
			label: "Production Line",
			type: "DropdownTable",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/UI_LINE_FLOOR_MAPPING",
				fields: [{
					bindByField: "DS_LINE",
					field: "DS_LINE"
				}],
				selectionMode: sap.ui.table.SelectionMode.Single,
				columns: [{
					label: "Production Line",
					field: "DS_LINE",
					type: "TextField"
				}, {
					label: "Physical Plant",
					field: "PHYSICAL_PLANT",
					type: "TextField"
				}],
				filters: [
					[{
						label: "Production Line",
						field: "DS_LINE",
						type: "TextField",
						labelLayout: new sap.ui.layout.GridData({
							span: "L5 M5 S5",
							linebreak: true
						}),
						textfield: {
							layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				}),
							defaultFilterOp: "EQ"
						}
					}],
					[{
						label: "Physical Plant",
						field: "PHYSICAL_PLANT",
						type: "TextField",
						labelLayout: new sap.ui.layout.GridData({
							span: "L5 M5 S5",
							linebreak: true
						}),
						textfield: {
							layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				}),
							defaultFilterOp: "EQ"
						}
					}]
				],
				visibleRowCount: 10
			}
		}, {
			field: "QUANTITY",
			label: "Quantity",
			type: "TextField",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.isInteger,
				errMsg: "Input content must be integer!"
			}]
		}, {
			field: "PLANNED_START_TIME",
			label: "Planned Start Time",
			labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
			type: "DatePicker",
			required: true,
			datepicker: {
				format: "yyyy-MM-dd HH:mm:ss",
				layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				})
			},
			validation: [{
				validType: lenovo.control.Validation.isDateTime,
				errMsg: "DateTime's format wrong!"
			}]
		}, {
			field: "PLANNED_END_TIME",
			label: "Planned End Time",
			labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
			type: "DatePicker",
			required: true,
			datepicker: {
				format: "yyyy-MM-dd HH:mm:ss",
				layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				})
			},
			validation: [{
				validType: lenovo.control.Validation.isDateTime,
				errMsg: "DateTime's format wrong!"
			}]
		}, {
			field: "START_TIME",
			label: "Start Time",
			labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
			type: "DatePicker",
			required: true,
			datepicker: {
				format: "yyyy-MM-dd HH:mm:ss",
				layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				})
			},
			validation: [{
				validType: lenovo.control.Validation.isDateTime,
				errMsg: "DateTime's format wrong!"
			}]
		}, {
			field: "END_TIME",
			label: "End Time",
			labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
			type: "DatePicker",
			required: true,
			datepicker: {
				format: "yyyy-MM-dd HH:mm:ss",
				layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				})
			},
			validation: [{
				validType: lenovo.control.Validation.isDateTime,
				errMsg: "DateTime's format wrong!"
			}]
		}];
		config.create.columns = lenovo.control.commontable.Toolkit.splitChunck(2, config.insertRaw);
		config.create.fakeData = {
			"STATUS" : "DRAFT"
		};
		//edit
		config.editRaw = [{
			field: "BOM_NAME",
			label: "BOM Name",
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}]
		}, {
			field: "LOGICAL_PLANT",
			label: "Logical Plant",
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}]
		}, {
			field: "DS_LINE",
			label: "Production Line",
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}]
		}, {
			field: "QUANTITY",
			label: "Quantity",
			validation: [{
				validType: lenovo.control.Validation.isInteger,
				errMsg: "Input content must be integer!"
			}]
		}, {
			field: "PLANNED_START_TIME",
			label: "Planned Start Time",
			type: "DatePicker",
			validation: [{
				validType: lenovo.control.Validation.isDateTime,
				errMsg: "DateTime's format wrong!"
			}]
		}, {
			field: "PLANNED_END_TIME",
			label: "Planned End time",
			type: "DatePicker",
			validation: [{
				validType: lenovo.control.Validation.isDateTime,
				errMsg: "DateTime's format wrong!"
			}]
		}, {
			field: "START_TIME",
			label: "Start Time",
			type: "DatePicker",
			validation: [{
				validType: lenovo.control.Validation.isDateTime,
				errMsg: "DateTime's format wrong!"
			}]
		}, {
			field: "END_TIME",
			label: "End Time",
			type: "DatePicker",
			validation: [{
				validType: lenovo.control.Validation.isDateTime,
				errMsg: "DateTime's format wrong!"
			}]
		}];
		//delete
		config.deleteable.url = "/UI_URGENT_MO_PULL";
		//upload
		config.upload = {
			visible: true,
			url: uServiceUrl + "/ui_urgent_mo_pull.xsjs",
			excelUrl: "vmi/control/urgent_mo_maintaince.xlsx"
		};
		config.upload.roleName =  auth.uploadableRoleName;
		config.viewstatus = {
			visible: true,
			viewUploadHistory: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'UI_URGENT_MO_PULL'",
				selectionMode: sap.ui.table.SelectionMode.Single,
				visibleRowCount: 10
			},
			viewErrorInfo: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_ERR_INFO",
				visibleRowCount: 10
			},
			viewUploadErrorDetail: {
				url: uServiceUrl + "/upload.xsodata/UI_URGENT_MO_PULL_ERR_DETAIL?$format=json",
				//addSingleQuotes: true,
				columns: [[{
					label: "Logical Plant",
					field: "LOGICAL_PLANT",
					type:  "TextField"
				},{
					label: "Production Line",
					field: "DS_LINE",
					type:  "TextField"
				},{
					label: "MO Id",
					field: "MO_ID",
					type:  "TextField"
					
				},{
					label: "BOM Name",
					field: "BOM_NAME",
					type:  "TextField"
					
				},{
					label: "Quantity",
					field: "QUANTITY",
					type:  "TextField"
					
				},{
					label: "Planned Start Time",
					field: "PLANNED_START_TIME",
					type:  "TextField"
					
				},{
					label: "Planned End Time",
					field: "PLANNED_END_TIME",
					type:  "TextField"
					
				},{
					label: "Start Time",
					field: "START_TIME",
					type:  "TextField"
					
				},{
					label: "End Time",
					field: "END_TIME",
					type:  "TextField"
					
				}]],
				resubmit: {
					url: uServiceUrl + "/ui_urgent_mo_pull.xsjs" 
				}
			}
		}

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
				case "confirm":
					config.viewjob = auth[i];
					break;
			}
		}
	},

	createContent: function(oController) {
		var app = new sap.m.App();
		var service = new lenovo.service.VMI;
		var sServiceUrl = service.getMXVmi();
		var uServiceUrl = service.getMXVmiUpload();
		var iServiceUrl = service.getMXVmiInvoke();
		var dSchema = service.getMXVmiSchema();
		var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);

		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		this.setConfig(config, sServiceUrl, uServiceUrl,dSchema);
		var header = lenovo.control.commontable.Table.createHeader("control", "urgent mo maintaince");
		var table = lenovo.control.commontable.Table.createTable(config);
		table.setBusy(true);
		table.setModel(oModel);
		oModel.attachRequestCompleted(function() {
			table.setBusy(false);
		});

		var filterPanel = lenovo.control.commontable.Table.createFilter(config, table);

		var oInsertUpload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table, app);

		//add buttons:ready&Invoke TS Workflow
		var oToolbarCtn = oInsertUpload.getContent()[0];
		var oReadyBtn = new sap.ui.commons.Button({
			lite: true,
			icon: "sap-icon://flag",
			tooltip: "Ready",
			visible: false,
			press: function(oEvent){
				var selectedIndices = table.getSelectedIndices();
				if(0 == selectedIndices.length){
					lenovo.control.commontable.Toolkit.showErrorMsg("Please select a row at least!", "ERROR", "Error");
					return;
				}
				
				var oUpdateData = [];
				for(var i = 0;i < selectedIndices.length; i++){
					var selectedObject = table.getContextByIndex(selectedIndices[i]).getObject();
					if(selectedObject.STATUS == "DRAFT"){
						oUpdateData = oUpdateData + selectedObject.MO_ID + ",";
					}
				}
				if(oUpdateData.length == 0){
					lenovo.control.commontable.Toolkit.showErrorMsg("Only status 'DRAFT' can be set status 'READY'!", "ERROR", "Error");
					return;
				}
				var oEntry = {
					"JOB_TYPE": "ready",
					"MO_ID": oUpdateData 
				};
				$.ajax({
					url: iServiceUrl + "/ui_urgent_mo_pull.xsjs",
					type: "POST",
					data: JSON.stringify(oEntry),
					dataType: "text",
					contentType: "application/json",
					success: function(msg) {
						table.getModel().refresh();
						lenovo.control.commontable.Toolkit.showErrorMsg("Ready successfully!", "SUCCESS", "Ready");
					},
					error: function(e,b) {
						lenovo.control.commontable.Toolkit.showErrorMsg(e.responseText, "ERROR", "Ready");
					}
				});
			}
		});

		var oReadyAllBtn = new sap.ui.commons.Button({
			lite: true,
			icon: "resource/img/Flag_All.png",
			tooltip: "Ready All",
			visible: false,
			press: function(oEvent){
				var oEntry = {
					"JOB_TYPE": "ready_all"
				};
				$.ajax({
					url: iServiceUrl + "/ui_urgent_mo_pull.xsjs",
					type: "POST",
					dataType: "text",
					data: JSON.stringify(oEntry),
					contentType: "application/json",
					success: function(msg) {
						table.getModel().refresh();
						lenovo.control.commontable.Toolkit.showErrorMsg("Ready all successfully!", "SUCCESS", "Ready");
					},
					error: function(e,b) {
						lenovo.control.commontable.Toolkit.showErrorMsg(e.responseText, "ERROR", "Ready");
					}
				});
			}
		});

		var oInvokeBtn = new sap.ui.commons.Button({
			lite: true,
			icon: "sap-icon://begin",
			tooltip: "Invoke Workflow",
			visible: false,
			press: function(oEvent){
				var oEntry = {
					"JOB_TYPE": "running",
					"PROCESS_NAME": "URGENT_MO_PULL"
				};
				$.ajax({
					url: iServiceUrl + "/ui_urgent_mo_pull.xsjs",
					type: "POST",
					data: JSON.stringify(oEntry),
					dataType: "text",
					contentType: "application/json",
					success: function(msg) {
						table.getModel().refresh();
						table.clearSelection();
						lenovo.control.commontable.Toolkit.showErrorMsg(msg, "SUCCESS", "Invoke");
					},
					error: function(e) {
						lenovo.control.commontable.Toolkit.showErrorMsg(e.responseText, "ERROR", "Invoke");
					} 
				});
			}
		});

		//auth
		var auth =  lenovo.control.commontable.Table.getViewAuth("urgentMOMaintaince");
		for (i in auth) {
			switch(i) {
				case "trigger":
					oReadyBtn.setVisible(auth[i]);
					oReadyAllBtn.setVisible(auth[i]);
					break;
				case "confirm":
					oInvokeBtn.setVisible(auth[i]);
					break;
			}
		}
		
		oToolbarCtn.insertContent(oReadyBtn,6);
		oToolbarCtn.insertContent(oReadyAllBtn,7);
		oToolbarCtn.insertContent(oInvokeBtn,8);

		var page = new sap.m.Page({
			showHeader: false,
			content: [header,filterPanel, oInsertUpload, table]
		});
		app.insertPage(page);
		app.setInitialPage(page);
		return app;
		//return [filterPanel, oInsertUpload, table];
	}
});