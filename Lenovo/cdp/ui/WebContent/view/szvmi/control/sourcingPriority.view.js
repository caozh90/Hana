/*
	develop by Coral Zhang @ 2014/12/15
*/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.control.Validation");
jQuery.sap.require("lenovo.service.SZVMI");

sap.ui.jsview("lenovo.view.szvmi.control.sourcingPriority", {
	setConfig: function(config,sServiceUrl,uServiceUrl,dSchema) {
		var windowHeight = lenovo.control.commontable.Toolkit.getWindowHeight();
		var auth =  lenovo.control.commontable.Table.getViewAuth("sourcingPriority");
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(3);
		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight - headerHeight);

		config.columns = [{
			field: "LOGICAL_PLANT",
			label: "Logical Plant",
			type: "TextField",
			width: "120px"
		}, {
			field: "MO_TYPE",
			label: "MO Type",
			type: "TextField",
			width: "120px"
		}, {
			field: "WAREHOUSE_NUMBER",
			label: "Warehouse Number",
			type: "TextField",
			width: "150px"
		}, {
			field: "STORAGE_LOCATION",
			label: "Storage Location",
			type: "TextField",
			width: "150px"
		}, {
			field: "STORAGE_TYPE",
			label: "Storage Type",
			type: "TextField",
			width: "150px"
		}, {
			field: "PRIORITY",
			label: "Priority",
			type: "TextField",
			width: "120px"
		}, {
			field: "OWNER",
			label: "Owner",
			width: "120px",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/InputParams('TPL_ID')/Results",
				field: "PVALUE",
				columns: [{
					label: "Owner",
					field: "PVALUE",
					type: "TextField"
				}],
				filters: [
					[{
						field: "PVALUE",
						label: "Owner",
						type: "TextField",
						textfield: {
							defaultFilterOp: "EQ"
						}
					}]
				],
				visibleRowCount: 10
			}
		}, {
			field: "INVENTORY_TYPE",
			label: "LOI/SOI",
			width: "120px",
			type: "DropdownBox",
			dropdownbox: {
				odata: {
					url: sServiceUrl + "/InputParams('INVENTORY_TYPE')/Results?$format=json",
					bindKeyField: "PVALUE",
					bindTextField: "PVALUE",
					defaultSelectAll: true
				}
			}
		}];

		config.bindRowUrl = "/UI_SOURCING_PRIORITY";
		config.defaultSort = [{
			field: "LOGICAL_PLANT",
			bDescending: false
		}];

		config.filtersRaw = [{
			field: "LOGICAL_PLANT",
			label: "Logical Plant",
			labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
			type: "DropdownBox",
			dropdownbox: {
				layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				}),
				odata: {
					url: sServiceUrl + "/CONF_SITEMASTER2?$format=json&$select=SITEID,MS",
					bindKeyField: "SITEID",
					bindTextField: "SITEID",
					defaultSelectAll: true
				}
			}
		}, {
			field: "WAREHOUSE_NUMBER",
			label: "Warehouse Number",
			labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
			type: "DropdownTable",
			dropdowntable: {
				layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				}),
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/UI_WAHREHOUSE?$select=WHS_NO",
				field: "WHS_NO",
				columns: [{
					label: "Warehouse Number",
					field: "WHS_NO",
					type: "TextField"
				}],
				filters: [
					[{
						field: "WHS_NO",
						label: "Warehouse Number",
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
			labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
			type: "DropdownTable",
			dropdowntable: {
				layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				}),
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
						field: "STORAGE_TYPE",
						label: "Storage Type",
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
			field: "OWNER",
			label: "Owner",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/InputParams('TPL_ID')/Results",
				field: "PVALUE",
				columns: [{
					label: "Owner",
					field: "PVALUE",
					type: "TextField"
				}],
				filters: [
					[{
						field: "PVALUE",
						label: "Owner",
						type: "TextField",
						textfield: {
							// defaultFilterOp: "EQ"
							// type: new lenovo.control.commontable.singleQuotes()
						}
					}]
				],
				visibleRowCount: 10
			}
		}, {
			field: "MO_TYPE",
			label: "MO Type",
			type: "DropdownBox",
			dropdownbox: {
				odata: {
					url: sServiceUrl + "/InputParams('MO_TYPE')/Results?$format=json",
					bindKeyField: "PVALUE",
					bindTextField: "PVALUE",
					defaultSelectAll: true
				}
			}
		}, {
			field: "STORAGE_LOCATION",
			label: "Storage Location",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
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
							// defaultFilterOp: "EQ"
							type: new lenovo.control.commontable.singleQuotes()
						}
					}]
				],
				visibleRowCount: 10
			}
		}, {
			field: "PRIORITY",
			label: "Priority",
			type: "MultiEQ",
			multieq: {
				defaultFilterOp: "GE"
			}
		}, {
			field: "INVENTORY_TYPE",
			label: "LOI/SOI",
			type: "DropdownBox",
			dropdownbox: {
				odata: {
					url: sServiceUrl + "/InputParams('INVENTORY_TYPE')/Results?$format=json",
					bindKeyField: "PVALUE",
					bindTextField: "PVALUE",
					defaultSelectAll: true
				}
			}
		}];

		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);

		//create
		config.create.url = "/UI_SOURCING_PRIORITY";
		config.insertRaw = [{
			field: "LOGICAL_PLANT",
			label: "Logical Plant",
			type: "DropdownBox",
			required: true,
            validation: [{
                    validType: lenovo.control.Validation.require,
                    errMsg: "LOGICAL_PLANT is required!"
            }],
			dropdownbox: {
				odata: {
					url: sServiceUrl + "/CONF_SITEMASTER2?$format=json&$select=SITEID,MS",
					bindKeyField: "SITEID",
					bindTextField: "SITEID",
					defaultSelectAll: true
				}
			}
		}, {
			field: "MO_TYPE",
			label: "MO Type",
			required: true,
            validation: [{
                    validType: lenovo.control.Validation.require,
                    errMsg: "MO_TYPE is required!"
            }],
			type: "DropdownBox",
			dropdownbox: {
				odata: {
					url: sServiceUrl + "/InputParams('MO_TYPE')/Results?$format=json",
					bindKeyField: "PVALUE",
					bindTextField: "PVALUE",
					defaultSelectAll: true
				}
			}
		}, {
			field: "WAREHOUSE_NUMBER",
			label: "Warehouse Number",
			required: true,
            validation: [{
                    validType: lenovo.control.Validation.require,
                    errMsg: "WAREHOUSE_NUMBER is required!"
            }],
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/UI_WAHREHOUSE?$select=WHS_NO",
				fields:[{
					bindByField:"WAREHOUSE_NUMBER",
					field: "WHS_NO"
				}],
				columns: [{
					label: "Warehouse Number",
					field: "WHS_NO",
					type: "TextField"
				}],
				filters: [
					[{
						field: "WHS_NO",
						label: "Warehouse Number",
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
			field: "STORAGE_LOCATION",
			label: "Storage Location",
			required: true,
            validation: [{
                    validType: lenovo.control.Validation.require,
                    errMsg: "STORAGE_LOCATION is required!"
            }],
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/UI_WAHREHOUSE?$select=STORAGE_LOCATION",
				fields:[{
					bindByField:"STORAGE_LOCATION",
					field: "STORAGE_LOCATION"
				}],
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
			required: true,
            validation: [{
                    validType: lenovo.control.Validation.require,
                    errMsg: "STORAGE_TYPE is required!"
            }],
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/UI_WAHREHOUSE?$select=STORAGE_TYPE",
				fields:[{
					bindByField:"STORAGE_TYPE",
					field: "STORAGE_TYPE"
				}],
				columns: [{
					label: "Storage Type",
					field: "STORAGE_TYPE",
					type: "TextField"
				}],
				filters: [
					[{
						field: "STORAGE_TYPE",
						label: "Storage Type",
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
			field: "PRIORITY",
			label: "Priority",
			required: true,
            validation: [{
                    validType: lenovo.control.Validation.isInteger,
                    errMsg: "PRIORITY should be integer!"
            }],
			type: "TextField"
		}, {
			field: "OWNER",
			label: "Owner",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/InputParams('TPL_ID')/Results",
				fields:[{
					bindByField:"OWNER",
					field: "PVALUE"
				}],
				columns: [{
					label: "Owner",
					field: "PVALUE",
					type: "TextField"
				}],
				filters: [
					[{
						field: "PVALUE",
						label: "Owner",
						type: "TextField",
						textfield: {
							//defaultFilterOp: "EQ"
						}
					}]
				],
				visibleRowCount: 10
			}
		}, {
			field: "INVENTORY_TYPE",
			label: "LOI/SOI",
			type: "DropdownBox",
			dropdownbox: {
				odata: {
					url: sServiceUrl + "/InputParams('INVENTORY_TYPE')/Results?$format=json",
					bindKeyField: "PVALUE",
					bindTextField: "PVALUE",
					defaultSelectAll: true
				}
			}
		}];
		config.create.columns = lenovo.control.commontable.Toolkit.splitChunck(1, config.insertRaw);
		//edit
		config.editRaw = [{
			field: "PRIORITY",
			label: "Priority",
            validation: [{
                    validType: lenovo.control.Validation.isInteger,
                    errMsg: "PRIORITY should be integer!"
            }]
		}, {
			field: "OWNER",
			label: "Owner"
		}, {
			field: "INVENTORY_TYPE",
			label: "LOI/SOI"
		}];
		//delete
		config.deleteable.url = "/UI_SOURCING_PRIORITY";
		//upload
		config.upload = {
			visible: true,
			url: uServiceUrl + "/ui_sourcing_priority.xsjs",
			excelUrl: "szvmi/control/sourcing_priority.xlsx"
		};
		config.upload.roleName =  auth.uploadableRoleName;
		config.viewstatus = {
			visible: true,
			viewUploadHistory: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'UI_SOURCING_PRIORITY'",
				selectionMode: sap.ui.table.SelectionMode.Single,
				visibleRowCount: 10
			},
			viewErrorInfo: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_ERR_INFO",
				visibleRowCount: 10
			},
			viewUploadErrorDetail: {
				url: uServiceUrl + "/upload.xsodata/UI_SOURCING_PRIORITY_ERR_DETAIL?$format=json",
				// addSingleQuotes: true,
				columns: [[{
					field: "LOGICAL_PLANT",
					label: "Logical Plant",
					type: "TextField"
				}, {
					field: "MO_TYPE",
					label: "MO Type",
					type: "TextField"
				}, {
					field: "WAREHOUSE_NUMBER",
					label: "Warehouse Number",
					type: "TextField"
				}, {
					field: "STORAGE_LOCATION",
					label: "Storage Location",
					type: "TextField"
				}, {
					field: "STORAGE_TYPE",
					label: "Storage Type",
					type: "TextField"
				}, {
					field: "PRIORITY",
					label: "Priority",
					type: "TextField"
				}, {
					field: "OWNER",
					label: "Owner",
					type: "TextField"
				}, {
					field: "INVENTORY_TYPE",
					label: "LOI/SOI",
					type: "TextField"
				}]],
				resubmit: {
					url: uServiceUrl + "/ui_sourcing_priority.xsjs" 
				}
			}
		}
		//download
		config.download.filename = "data_export";
		config.download.table = '"_SYS_BIC"."cdp.szebgvmi.models/AT_SOURCE_PRIORITY"';
		config.download.columns = ["LOGICAL_PLANT","MO_TYPE","WAREHOUSE_NUMBER","STORAGE_LOCATION","STORAGE_TYPE","PRIORITY","OWNER","INVENTORY_TYPE"];
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
		var app = new sap.m.App(); 
		var service = new lenovo.service.SZVMI;
		var sServiceUrl = service.getMXVmi();
		var uServiceUrl = service.getMXVmiUpload();
		var dSchema = service.getMXVmiSchema();
		var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
		var header = lenovo.control.commontable.Table.createHeader("Control", "Sourcing Priority");
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		this.setConfig(config,sServiceUrl,uServiceUrl,dSchema);

		var table = lenovo.control.commontable.Table.createTable(config);
		table.setBusy(true);
		table.setModel(oModel);
		oModel.attachRequestCompleted(function() {
			table.setBusy(false);
		});

		var filterPanel = lenovo.control.commontable.Table.createFilter(config, table);
		
		var oInsertUpload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table,app);

		var page = new sap.m.Page({
	      	  showHeader: false,
	          content: [header, filterPanel, oInsertUpload, table]             
	    });
        app.insertPage(page);
        app.setInitialPage(page);
		return app;
	}
});