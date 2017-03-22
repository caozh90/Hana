/*
develop by Alex Liu @ 2014/12/4
Tip:lack upload function;download filename hasn't be determined;
lack edit dropdowntable
*/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.control.Validation");
jQuery.sap.require("lenovo.service.SZVMI");

sap.ui.jsview("lenovo.view.szvmi.control.controlCycle", {
	getControllerName: function() {

	},

	setConfig: function(config, sServiceUrl, uServiceUrl, dSchema) {
		var windowHeight = lenovo.control.commontable.Toolkit.getWindowHeight();
		var auth =  lenovo.control.commontable.Table.getViewAuth("controlCycle");
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(3);
		//var headerHeight = 350;
		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight - headerHeight);

		config.columns = [{
			field: "ITEM",
			label: "Item Id",
			type: "TextField",
			width: "100px"
		}, {
			field: "LOGICAL_PLANT",
			label: "Logical Plant",
			type: "TextField",
			width: "150px"
		}, {
			field: "PHYSICAL_PLANT",
			label: "Physical Plant",
			type: "TextField",
			width: "150px"
		}, {
			field: "WAREHOUSE_NUMBER",
			label: "Warehouse No",
			type: "DropdownTable",
			width: "150px",
			dropdowntable: {
				// defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/UI_WAHREHOUSE?$select=WHS_NO,WERKS&$format=json",
				field: "WHS_NO",
				columns: [{
					label: "WareHouse Number",
					field: "WHS_NO",
					type: "TextField"
				}, {
					label: "Site Id",
					field: "WERKS",
					type: "TextField"
				}],
				filters: [
					[{
						label: "WareHouse Number",
						field: "WHS_NO",
						type: "TextField",
						labelLayout: new sap.ui.layout.GridData({
							span: "L6 M6 S6",
							linebreak: true
						}),
						textfield: {
							layout: new sap.ui.layout.GridData({
								span: "L6 M6 S6"
							}),
							// defaultFilterOp: "EQ"
							type: new lenovo.control.commontable.singleQuotes()
						}
					}],
					[{
						label: "Site Id",
						field: "WERKS",
						type: "TextField",
						textfield: {
							// defaultFilterOp: "EQ"
							type: new lenovo.control.commontable.singleQuotes()
						}
					}]
				],
				visibleRowCount: 10
			}
		}, {
			field: "STORAGE_LOCATION",
			label: "Storage Location",
			type: "DropdownTable",
			width: "150px",
			dropdowntable: {
				url: sServiceUrl,
				bindRowUrl: "/UI_WAHREHOUSE?$select=STORAGE_LOCATION",
				field: "STORAGE_LOCATION",
				columns: [{
					label: "Storage Location",
					field: "STORAGE_LOCATION",
					type: "TextField"
				}],
				filters: [
					[{
						label: "Storage Location",
						field: "STORAGE_LOCATION",
						type: "TextField",
						textfield: {
							defaultFilterOp: "EQ"
						}
					}]
				],
				visibleRowCount: 10
			}
		}, {
			field: "STORAGE_TYPE",
			label: "Storage Type",
			type: "DropdownTable",
			width: "150px",
			dropdowntable: {
				url: sServiceUrl,
				bindRowUrl: "/UI_WAHREHOUSE?$select=STORAGE_TYPE",
				field: "STORAGE_TYPE",
				columns: [{
					label: "Storage Type",
					field: "STORAGE_TYPE",
					type: "TextField"
				}],
				filters: [
					[{
						label: "Storage Type",
						field: "STORAGE_TYPE",
						type: "TextField",
						textfield: {
							defaultFilterOp: "EQ"
						}
					}]
				],
				visibleRowCount: 10
			}
		}, {
			field: "STORAGE_BIN",
			label: "Storage Bin",
			type: "DropdownTable",
			width: "150px",
			dropdowntable: {
				url: sServiceUrl,
				bindRowUrl: "/UI_WAHREHOUSE?$select=STORAGE_BIN",
				field: "STORAGE_BIN",
				columns: [{
					label: "Storage Bin",
					field: "STORAGE_BIN",
					type: "TextField"
				}],
				filters: [
					[{
						label: "Storage Bin",
						field: "STORAGE_BIN",
						type: "TextField",
						textfield: {
							defaultFilterOp: "EQ"
						}
					}]
				],
				visibleRowCount: 10
			}
		}];

		config.bindRowUrl = "/UI_CONTROL_CYCLE";
		config.defaultSort = [{
			field: "ITEM",
			bDescending: false
		}];

		config.filtersRaw = [{
			field: "ITEM",
			label: "Item Id",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/ITEMSITEMASTER001?$format=json",
				field: "ITEM",
				columns: [{
					label: "Item Id",
					field: "ITEM",
					type: "TextField"
				}, {
					label: "Item Desc",
					field: "ITEMDESC",
					type: "TextField"
				}],
				filters: [
					[{
						field: "ITEM",
						label: "Item Id",
						type: "TextField",
						textfield: {
							type: new lenovo.control.commontable.singleQuotes()
						}
					}],
					[{
						field: "ITEMDESC",
						label: "Item Desc",
						type: "TextField",
						textfield: {
							type: new lenovo.control.commontable.singleQuotes()
						}
					}]
				],
				visibleRowCount: 10
			}
		}, {
			field: "PHYSICAL_PLANT",
			label: "Physical Plant",
			type: "DropdownBox",
			dropdownbox: {
				odata: {
					url: sServiceUrl + "/CONF_SITEMASTER?$select=PHYSICALPLANT&$format=json",
					bindKeyField: "PHYSICALPLANT",
					bindTextField: "PHYSICALPLANT",
					defaultSelectAll: true
				}
			}
		}, {
			field: "STORAGE_LOCATION",
			label: "Storage Location",
			type: "DropdownTable",
			dropdowntable: {
				// defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/UI_WAHREHOUSE?$select=STORAGE_LOCATION",
				field: "STORAGE_LOCATION",
				columns: [{
					label: "Storage Location",
					field: "STORAGE_LOCATION",
					type: "TextField"
				}],
				filters: [
					[{
						label: "Storage Location",
						field: "STORAGE_LOCATION",
						type: "TextField",
						textfield: {
							type: new lenovo.control.commontable.singleQuotes()
						}
					}]
				],
				visibleRowCount: 10
			}
		}, {
			field: "STORAGE_BIN",
			label: "Storage Bin",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/UI_WAHREHOUSE?$select=STORAGE_BIN",
				field: "STORAGE_BIN",
				columns: [{
					label: "Storage Bin",
					field: "STORAGE_BIN",
					type: "TextField"
				}],
				filters: [
					[{
						label: "Storage Bin",
						field: "STORAGE_BIN",
						type: "TextField",
						textfield: {
							// defaultFilterOp: "EQ"
							type: new lenovo.control.commontable.singleQuotes()
						}
					}]
				],
				visibleRowCount: 10
			}
		}, {
			field: "STORAGE_TYPE",
			label: "Storage Type",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/UI_WAHREHOUSE?$select=STORAGE_TYPE",
				field: "STORAGE_TYPE",
				columns: [{
					label: "Storage Type",
					field: "STORAGE_TYPE",
					type: "TextField"
				}],
				filters: [
					[{
						label: "Storage Type",
						field: "STORAGE_TYPE",
						type: "TextField",
						textfield: {
							// defaultFilterOp: "EQ"
							type: new lenovo.control.commontable.singleQuotes()
						}
					}]
				],
				visibleRowCount: 10
			}
		}, {
			field: "LOGICAL_PLANT",
			label: "Logical Plant",
			type: "DropdownBox",
			dropdownbox: {
				odata: {
					url: sServiceUrl + "/CONF_SITEMASTER2?$select=SITEID,MS&$format=json",
					bindKeyField: "SITEID",
					bindTextField: "SITEID",
					defaultSelectAll: true
				}
			}
		}, {
			field: "WAREHOUSE_NUMBER",
			label: "Warehouse No",
			type: "DropdownTable",
			dropdowntable: {
				// defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/UI_WAHREHOUSE?$select=WHS_NO,WERKS&$format=json",
				field: "WHS_NO",
				columns: [{
					label: "WareHouse Number",
					field: "WHS_NO",
					type: "TextField"
				}, {
					label: "Site Id",
					field: "WERKS",
					type: "TextField"
				}],
				filters: [
					[{
						label: "WareHouse Number",
						field: "WHS_NO",
						type: "TextField",
						labelLayout: new sap.ui.layout.GridData({
							span: "L6 M6 S6",
							linebreak: true
						}),
						textfield: {
							layout: new sap.ui.layout.GridData({
								span: "L6 M6 S6"
							}),
							// defaultFilterOp: "EQ"
							type: new lenovo.control.commontable.singleQuotes()
						}
					}],
					[{
						label: "Site Id",
						field: "WERKS",
						type: "TextField",
						textfield: {
							// defaultFilterOp: "EQ"
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
		config.download.table = '"_SYS_BIC"."cdp.szebgvmi.models/AT_UI_CONTROL_CYCLE"';
		config.download.columns = ["ITEM", "LOGICAL_PLANT", "PHYSICAL_PLANT", "WAREHOUSE_NUMBER", "STORAGE_LOCATION", "STORAGE_TYPE", "STORAGE_BIN"];
		config.download.roleName = auth.exportableRoleName;
		//create
		config.create.url = "/UI_CONTROL_CYCLE";
		config.insertRaw = [{
			field: "ITEM",
			label: "Item Id",
			labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
			type: "DropdownTable",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
			dropdowntable: {
				layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				}),
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/ITEMSITEMASTER001",
				fields: [{
					bindByField: "ITEM",
					field: "ITEM"
				}],
				selectionMode: sap.ui.table.SelectionMode.Single,
				columns: [{
					label: "Item Id",
					field: "ITEM",
					type: "TextField"
				}, {
					label: "Item Desc",
					field: "ITEMDESC",
					type: "TextField"
				}],
				filters: [
					[{
						field: "ITEM",
						label: "Item Id",
						type: "TextField",
						textfield: {
							//defaultFilterOp: "EQ"
							defaultFilterOp: "Contains"
							
						}
					}],
					[{
						field: "ITEMDESC",
						label: "Item Desc",
						type: "TextField",
						textfield: {
							//defaultFilterOp: "EQ"
							defaultFilterOp: "Contains"
							
						}
					}]
				],
				visibleRowCount: 10
			}
		}, {
			field: "LOGICAL_PLANT",
			label: "Logical Plant",
			labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
			type: "DropdownBox",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
			dropdownbox: {
				layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				}),
				odata: {
					url: sServiceUrl + "/CONF_SITEMASTER2?$select=SITEID,MS&$format=json",
					bindKeyField: "SITEID",
					bindTextField: "SITEID"
				}
			}
		}, {
			field: "PHYSICAL_PLANT",
			label: "Physical Plant",
			labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
			type: "DropdownBox",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
			dropdownbox: {
				layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				}),
				odata: {
					url: sServiceUrl + "/CONF_SITEMASTER?$format=json",
					bindKeyField: "PHYSICALPLANT",
					bindTextField: "PHYSICALPLANT"
				}
			}
		}, {
			field: "WAREHOUSE_NUMBER",
			label: "Warehouse No",
			labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
			type: "DropdownTable",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
			dropdowntable: {
				layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				}),
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/UI_WAHREHOUSE?$select=WHS_NO,WERKS&$format=json",
				fields: [{
					bindByField: "WAREHOUSE_NUMBER",
					field: "WHS_NO"
				}],
				selectionMode: sap.ui.table.SelectionMode.Single,
				columns: [{
					label: "WareHouse No",
					field: "WHS_NO",
					type: "TextField"
				}, {
					label: "Site Id",
					field: "WERKS",
					type: "TextField"
				}],
				filters: [
					[{
						label: "WareHouse No",
						field: "WHS_NO",
						type: "TextField",
						layout: new sap.ui.layout.GridData({
							span: "L8 M8 S8"
						}),
						textfield: {
							//defaultFilterOp: "EQ"
							type: new lenovo.control.commontable.singleQuotes()
						}
					}],
					[{
						label: "Site Id",
						field: "WERKS",
						type: "TextField",
						layout: new sap.ui.layout.GridData({
							span: "L4 M4 S4"
						}),
						textfield: {
							//defaultFilterOp: "EQ"
							type: new lenovo.control.commontable.singleQuotes()
						}
					}]
				],
				visibleRowCount: 10
			}
		}, {
			field: "STORAGE_LOCATION",
			label: "Storage Location",
			type: "DropdownTable",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
			dropdowntable: {
				defaultFilterOp: "EQ",				
				url: sServiceUrl,
				bindRowUrl: "/UI_WAHREHOUSE?$select=STORAGE_LOCATION",
				fields: [{
					bindByField: "STORAGE_LOCATION",
					field: "STORAGE_LOCATION"
				}],
				selectionMode: sap.ui.table.SelectionMode.Single,
				columns: [{
					label: "Storage Location",
					field: "STORAGE_LOCATION",
					type: "TextField"
				}],
				filters: [
					[{
						label: "Storage Location",
						field: "STORAGE_LOCATION",
						type: "TextField",
						textfield: {
							//defaultFilterOp: "EQ"
							type: new lenovo.control.commontable.singleQuotes()
						}
					}]
				],
				visibleRowCount: 10
			}
		}, {
			field: "STORAGE_TYPE",
			label: "Storage Type",
			type: "DropdownTable",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/UI_WAHREHOUSE?$select=STORAGE_TYPE",
				fields: [{
					bindByField: "STORAGE_TYPE",
					field: "STORAGE_TYPE"
				}],
				selectionMode: sap.ui.table.SelectionMode.Single,
				columns: [{
					label: "Storage Type",
					field: "STORAGE_TYPE",
					type: "TextField"
				}],
				filters: [
					[{
						label: "Storage Type",
						field: "STORAGE_TYPE",
						type: "TextField",
						textfield: {
							//defaultFilterOp: "EQ"
							type: new lenovo.control.commontable.singleQuotes()
						}
					}]
				],
				visibleRowCount: 10
			}
		}, {
			field: "STORAGE_BIN",
			label: "Storage Bin",
			type: "DropdownTable",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/UI_WAHREHOUSE?$select=STORAGE_BIN",
				fields: [{
					bindByField: "STORAGE_BIN",
					field: "STORAGE_BIN"
				}],
				selectionMode: sap.ui.table.SelectionMode.Single,
				columns: [{
					label: "Storage Bin",
					field: "STORAGE_BIN",
					type: "TextField"
				}],
				filters: [
					[{
						label: "Storage Bin",
						field: "STORAGE_BIN",
						type: "TextField",
						textfield: {
							//defaultFilterOp: "EQ"
							type: new lenovo.control.commontable.singleQuotes()
						}
					}]
				],
				visibleRowCount: 10
			}
		}];
		config.create.columns = lenovo.control.commontable.Toolkit.splitChunck(2, config.insertRaw);
		//edit
		config.editRaw = [{
			field: "WAREHOUSE_NUMBER",
			label: "Warehouse Number",
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}]
		}, {
			field: "STORAGE_LOCATION",
			label: "Storage Location",
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}]
		}, {
			field: "STORAGE_TYPE",
			label: "Storage Type",
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}]
		}, {
			field: "STORAGE_BIN",
			label: "Storage Bin",
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}]
		}];
		//delete
		config.deleteable.url = "/UI_CONTROL_CYCLE";
		//upload
		config.upload = {
			visible: true,
			url: uServiceUrl + "/ui_control_cycle.xsjs",
			excelUrl: "szvmi/control/control_cycle.xlsx"
		};
		config.upload.roleName =  auth.uploadableRoleName;
		config.viewstatus = {
			visible: true,
			viewUploadHistory: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'UI_CONTROL_CYCLE'",
				selectionMode: sap.ui.table.SelectionMode.Single,
				visibleRowCount: 10
			},
			viewErrorInfo: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_ERR_INFO",
				visibleRowCount: 10
			},
			viewUploadErrorDetail: {
				url: uServiceUrl + "/upload.xsodata/UI_CONTROL_CYCLE_ERR_DETAIL?$format=json",
				//addSingleQuotes: true,
				columns: [[{
					label: "Item Id",
					field: "ITEM",
					type:  "TextField"
				},{
					label: "Logical Plant",
					field: "LOGICAL_PLANT",
					type:  "TextField"
				},{
					label: "Physical Plant",
					field: "PHYSICAL_PLANT",
					type:  "TextField"
				},{
					label: "Warehouse Number",
					field: "WAREHOUSE_NUMBER",
					type:  "TextField"
				},{
					label: "Storage Location",
					field: "STORAGE_LOCATION",
					type:  "TextField"
				},{
					label: "Storage Type",
					field: "STORAGE_TYPE",
					type:  "TextField"
				},{
					label: "Storage Bin",
					field: "STORAGE_BIN",
					type:  "TextField"
				}]],
				resubmit: {
					url: uServiceUrl + "/ui_control_cycle.xsjs" 
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
			}
		}
	},

	createContent: function(oController) {
		var app = new sap.m.App();
		var service = new lenovo.service.SZVMI;
		var sServiceUrl = service.getMXVmi();
		var uServiceUrl = service.getMXVmiUpload();
		var dSchema = service.getMXVmiSchema();
		var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);

		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		this.setConfig(config, sServiceUrl, uServiceUrl, dSchema);
		var header = lenovo.control.commontable.Table.createHeader("control", "control cycle");
		var table = lenovo.control.commontable.Table.createTable(config);
		table.setBusy(true);
		table.setModel(oModel);
		oModel.attachRequestCompleted(function() {
			table.setBusy(false);
		});

		var filterPanel = lenovo.control.commontable.Table.createFilter(config, table);

		var oInsertUpload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table, app);

		var page = new sap.m.Page({
			showHeader: false,
			content: [header, filterPanel, oInsertUpload, table]
		});
		app.insertPage(page);
		app.setInitialPage(page);
		return app;
	}
});