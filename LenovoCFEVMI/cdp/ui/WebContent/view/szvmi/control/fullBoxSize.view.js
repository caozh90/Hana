/*
develop by Alex Liu @ 2014/12/1
Tip:lack upload function;download filename hasn't be determined
*/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.control.Validation");
jQuery.sap.require("lenovo.service.SZVMI");

sap.ui.jsview("lenovo.view.szvmi.control.fullBoxSize", {
	getControllerName: function() {

	},

	setConfig: function(config,sServiceUrl,uServiceUrl,dSchema) {
		var windowHeight = lenovo.control.commontable.Toolkit.getWindowHeight();
		var auth =  lenovo.control.commontable.Table.getViewAuth("fullBoxSize");
		//var headerHeight = 350;
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(2);
		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight - headerHeight);

		config.columns = [{
			field: "ITEM",
			label: "Item Id",
			type: "TextField",
			width: "100px"
		}, {
			field: "ITEMDESC",
			label: "Item Desc",
			type: "TextField",
			width: "200px"
		}, {
			field: "VENDORID",
			label: "Vendor Id",
			type: "TextField",
			width: "100px"
		}, {
			field: "VENDORNAME",
			label: "Vendor Name",
			type: "TextField",
			width: "200px"
		}, {
			field: "BOX_SIZE",
			label: "Box Size",
			type: "TextField",
			width: "50px"
		}];

		config.bindRowUrl = "/UI_ITEM_FULL_BOX";
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
				bindRowUrl: "/ITEMSITEMASTER001",
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
							//defaultFilterOp: "EQ"
						}
					}],
					[{
						field: "ITEMDESC",
						label: "Item Desc",
						type: "TextField",
						textfield: {
							//defaultFilterOp: "EQ"
						}
					}]
				],
				visibleRowCount: 10
			}
		},{
			field: "VENDORID",
			label: "Vendor Id",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/SUPITEM",
				field: "SUPPLIERID",
				columns: [{
					label: "Vendor Id",
					field: "SUPPLIERID",
					type: "TextField"
				}, {
					label: "Vendor Name",
					field: "SUPPLIERDESC",
					type: "TextField"
				}],
				filters: [
					[{
						field: "SUPPLIERID",
						label: "Vendor Id",
						type: "TextField",
						textfield: {
							//defaultFilterOp: "EQ"
						}
					}],
					[{
						field: "SUPPLIERDESC",
						label: "Vendor Name",
						labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
						type: "TextField",
						textfield: {
							layout: new sap.ui.layout.GridData({
							span: "L7 M7 S7"
						})
							//defaultFilterOp: "EQ"
						}
					}]
				],
				visibleRowCount: 10
			}
		}, {
			field: "BOX_SIZE",
			label: "Box Size",
			type: "MultiEQ",
			multieq: {
				defaultFilterOp: "EQ"
			}
		}, {
			field: "ITEMDESC",
			label: "Item Desc",
			type: "TextField"
		}, {
			field: "VENDORNAME",
			label: "Vendor Name",
			type: "TextField"
		}];

		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);
		/*var auth =  lenovo.control.commontable.Table.getViewAuth("costModelList");
		console.log("auth", auth);*/
		//download
		config.download.filename = "data_export";
		config.download.table = '"_SYS_BIC"."cdp.szebgvmi.models/AT_UI_ITEM_FULL_BOX"';
		config.download.columns = ["ITEM", "VENDORID", "BOX_SIZE", "ITEMDESC", "VENDORNAME"];
		config.download.roleName = auth.exportableRoleName;
		//create
		config.create.url = "/UI_ITEM_FULL_BOX";
		config.insertRaw = [{
			field: "ITEM",
			label: "Item Id",
			type: "DropdownTable",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/ITEMSITEMASTER001",
				fields: [{bindByField: "ITEM", field: "ITEM"},{bindByField: "ITEMDESC", field: "ITEMDESC"}],
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
						}
					}],
					[{
						field: "ITEMDESC",
						label: "Item Desc",
						type: "TextField",
						textfield: {
							//defaultFilterOp: "EQ"
						}
					}]
				],
				visibleRowCount: 10
			}
		}, {
			field: "ITEMDESC",
			label: "Item Desc",
			type: "TextField",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
		}, {
			field: "BOX_SIZE",
			label: "Box Size",
			type: "TextField",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.isInteger,
				errMsg: "Input content must be integer!"
			}]
		}, {
			field: "VENDORID",
			label: "Vendor Id",
			type: "DropdownTable",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/SUPITEM",
				fields: [{bindByField: "VENDORID", field: "SUPPLIERID"},{bindByField: "VENDORNAME", field: "SUPPLIERDESC"}],
				selectionMode: sap.ui.table.SelectionMode.Single,
				columns: [{
					label: "Vendor Id",
					field: "SUPPLIERID",
					type: "TextField"
				}, {
					label: "Vendor Name",
					field: "SUPPLIERDESC",
					type: "TextField"
				}],
				filters: [
					[{
						field: "SUPPLIERID",
						label: "Vendor Id",
						type: "TextField",
						textfield: {
							//defaultFilterOp: "EQ"
						}
					}],
					[{
						field: "SUPPLIERDESC",
						label: "Vendor Name",
						labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
						type: "TextField",
						textfield: {
							layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				})
							//defaultFilterOp: "EQ"
						}
					}]
				],
				visibleRowCount: 10
			}
		}, {
			field: "VENDORNAME",
			label: "Vendor Name",
			type: "TextField",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
		}];
		config.create.columns = lenovo.control.commontable.Toolkit.splitChunck(2, config.insertRaw);
		//edit
		config.editRaw = [{
			field: "BOX_SIZE",
			label: "Box Size",
			validation: [{
				validType: lenovo.control.Validation.isInteger,
				errMsg: "Input content must be integer!"
			}]
		}];
		//delete
		config.deleteable.url = "/UI_ITEM_FULL_BOX";
		//upload
		config.upload = {
			visible: true,
			url: uServiceUrl + "/ui_item_full_box.xsjs",
			excelUrl: "szvmi/control/full_box_size.xlsx"
		};
		config.upload.roleName =  auth.uploadableRoleName;
		config.viewstatus = {
			visible: true,
			viewUploadHistory: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'UI_ITEM_FULL_BOX'",
				selectionMode: sap.ui.table.SelectionMode.Single,
				visibleRowCount: 10
			},
			viewErrorInfo: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_ERR_INFO",
				visibleRowCount: 10
			},
			viewUploadErrorDetail: {
				url: uServiceUrl + "/upload.xsodata/UI_ITEM_FULL_BOX_ERR_DETAIL?$format=json",
				//addSingleQuotes: true,
				columns: [[{
					label: "Item Id",
					field: "ITEM",
					type:  "TextField"
				},{
					label: "Vendor Id",
					field: "VENDORID",
					type:  "TextField"
				},{
					label: "Box Size",
					field: "BOX_SIZE",
					type:  "TextField"
					
				}]],
				resubmit: {
					url: uServiceUrl + "/ui_item_full_box.xsjs" 
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
		this.setConfig(config,sServiceUrl,uServiceUrl,dSchema);
		var header = lenovo.control.commontable.Table.createHeader("control", "full box size");
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