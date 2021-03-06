/*
	develop by Coral Zhang @ 2014/12/19
	modified by alex liu @ 2014/12/24
	lack invoke TS,dropdowntable storage location
*/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.control.Validation");
jQuery.sap.require("lenovo.service.VMI");

sap.ui.jsview("lenovo.view.vmi.manage.soiFailedGR", {
	setConfig: function(config,sServiceUrl) {
		var windowHeight = lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(5);
		var auth =  lenovo.control.commontable.Table.getViewAuth("soiFailedGR");
		//var headerHeight = 400;
		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight - headerHeight);
		config.columns = [{
			field: "RECEIPT_ID",
			label: "Receipt Id",
			type: "TextField",
			width: "100px"
		},{
			field: "TPL_RECEIPT_ID",
			label: "3PL Receipt Id",
			type: "TextField",
			width: "200px"
		},{
			field: "TPL_RECEIPT_LINE_ID",
			label: "3PL Receipt Line Id",
			type: "TextField",
			width: "200px"
		},{
			field: "HAWB",
			label: "Hawb",
			type: "TextField",
			width: "100px"
		},{
			field: "TPL_ID",
			label: "3PL ID",
			type: "TextField",
			width: "100px"
		},{
			field: "MATNR",
			label: "Part Number",
			type: "DropdownTable",
			width: "200px",
			dropdowntable: {
				url: sServiceUrl,
				bindRowUrl: "/ITEMSITEMASTER001",
				field: "ITEM",
				dependentFileds: [{field:"ITEMDESC", target:"Part Description"}],
				columns: [{
					label: "Part Number",
					field: "ITEM",
					type: "TextField"
				}, {
					label: "Part Description",
					field: "ITEMDESC",
					type: "TextField"
				}],
				filters: [
					[{
						field: "ITEM",
						label: "Part Number",
						type: "TextField",
						textfield: {
							//defaultFilterOp: "EQ"
						}
					}],
					[{
						field: "ITEMDESC",
						label: "Part Description",
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
		},{
			field: "MATNR_DESCR",
			label: "Part Description",
			type: "TextField",
			width: "200px"
		// },{
		// 	field: "PO_LINE_ID",
		// 	label: "PO Line Id",
		// 	type: "TextField",
		// 	width: "100px"
		},{
			field: "REASON_CODE",
			label: "Error Reason",
			type: "TextField",
			width: "150px"
		},{
			field: "STATUS",
			label: "Status",
			type: "TextField",
			width: "100px"
		},{
			field: "HOLD_TYPE",
			label: "Hold Type",
			type: "DropdownBox",
			width: "100px",
			dropdownbox: {
				odata: {
					url: sServiceUrl + "/InputParams('HOLD_TYPE')/Results?$format=json",
					bindKeyField: "PVALUE",
					bindTextField: "PVALUE",
					defaultSelectAll: true
				}
			}
		},{
			field: "HOLD_QTY",
			label: "Hold Qty",
			type: "TextField",
			width: "100px"
		},{
			field: "WHS_NO",
			label: "WareHouse No.",
			type: "TextField",
			width: "150px"
		},{
			field: "DEST_STORAGE_LOCATION",
			label: "Destination Location",
			type: "DropdownTable",
			width: "200px",
			dropdowntable: {
				url: sServiceUrl,
				bindRowUrl: "/UI_WAHREHOUSE",
				field: "STORAGE_LOCATION",
				dependentFileds: [{field:"STORAGE_TYPE", target:"Destination Type"},{field:"STORAGE_BIN", target:"Destination Bin"}],
				columns: [{
					label: "Des Type",
					field: "STORAGE_TYPE",
					type: "TextField"
				}, {
					label: "Des Stor Loc",
					field: "STORAGE_LOCATION",
					type: "TextField"
				}, {
					label: "Des Bin",
					field: "STORAGE_BIN",
					type: "TextField"
				}],
				filters: [
					[{
						field: "STORAGE_TYPE",
						label: "Des Type",
						labelLayout: new sap.ui.layout.GridData({
				span: "L6 M6 S6",
				linebreak: true
			}),
						type: "TextField",
						textfield: {
							layout: new sap.ui.layout.GridData({
					span: "L6 M6 S6"
				})
							//defaultFilterOp: "EQ"
						}
					}],
					[{
						field: "STORAGE_LOCATION",
						label: "Des Stor Loc",
						labelLayout: new sap.ui.layout.GridData({
				span: "L6 M6 S6",
				linebreak: true
			}),
						type: "TextField",
						textfield: {
							layout: new sap.ui.layout.GridData({
					span: "L6 M6 S6"
				})
							//defaultFilterOp: "EQ"
						}
					}],
					[{
						field: "STORAGE_BIN",
						label: "Des Bin",
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
		},{
			field: "DEST_TYPE",
			label: "Destination Type",
			type: "TextField",
			width: "150px"
		},{
			field: "DEST_BIN",
			label: "Destination Bin",
			type: "TextField",
			width: "150px"
		// },{
		// 	field: "INVOICE_NUMBER",
		// 	label: "Invoice No.",
		// 	type: "TextField",
		// 	width: "150px"
		},{
			field: "WERKS",
			label: "Logical Plant",
			type: "TextField",
			width: "150px"
		},{
			field: "LIFNR",
			label: "Vendor",
			type: "TextField",
			width: "100px"
		},{
			field: "QTY",
			label: "Received Qty",
			type: "TextField",
			width: "150px"
		},{
			field: "RECEIPT_DATE",
			label: "Receipt Date",
			type: "TextField",
			width: "150px"
		},{
			field: "SYS_TIMESTAMP",
			label: "Sys Timestamp",
			type: "TextField",
			width: "150px"
		},{
			field: "ECC_STEP",
			label: "Ecc Step",
			type: "TextField",
			width: "100px"
		},{
			field: "TR_NUMBER",
			label: "TR Number",
			type: "TextField",
			width: "100px"
		},{
			field: "TR_ITEM_NUMBER",
			label: "TR Item Number",
			type: "TextField",
			width: "150px"
		},{
			field: "MATERIAL_DOCUMENT_YEAR",
			label: "Mtr Document Year",
			type: "TextField",
			width: "200px"
		},{
			field: "MATERIAL_DOCUMENT",
			label: "Mtr Document",
			type: "TextField",
			width: "150px"
		},{
			field: "SYS_LAST_MODIFIED_BY",
			label: "Modified By User",
			type: "TextField",
			width: "150px"
		},{
			field: "SYS_LAST_MODIFIED_DATE",
			label: "Last Modified Date",
			type: "TextField",
			width: "150px"
		},{
			field: "SYS_CREATED_BY",
			label: "Created By",
			type: "TextField",
			width: "100px"
		},{
			field: "SYS_CREATED_DATE",
			label: "Creation Date (GMT+8)",
			type: "TextField",
			width: "200px"
		}];

		config.bindRowUrl = "/SOI_GR";
		config.defaultSort = [{
					field: "RECEIPT_ID",
					bDescending: true
				}];
		config.filtersRaw = [{
			field: "RECEIPT_ID",
			label: "Receipt Id",
			labelLayout: new sap.ui.layout.GridData({
				span: "L3 M3 S3",
				linebreak: true
			}),
			type: "TextField",
			textfield: {
				layout: new sap.ui.layout.GridData({
					span: "L9 M9 S9"
				}),
				// defaultFilterOp: "EQ"
			}
		}, {
			field: "TPL_RECEIPT_ID",
			label: "3PL Receipt Id",
			labelLayout: new sap.ui.layout.GridData({
				span: "L3 M3 S3",
				linebreak: true
			}),
			type: "TextField",
			textfield: {
				layout: new sap.ui.layout.GridData({
					span: "L9 M9 S9"
				}),
				// defaultFilterOp: "EQ"
			}
		}, {
			field: "TPL_RECEIPT_LINE_ID",
			label: "3PL Receipt Line Id",
			labelLayout: new sap.ui.layout.GridData({
				span: "L3 M3 S3",
				linebreak: true
			}),
			type: "TextField",
			textfield: {
				layout: new sap.ui.layout.GridData({
					span: "L9 M9 S9"
				}),
				// defaultFilterOp: "EQ"
			}
		}, {
			field: "LIFNR",
			label: "Vendor",
			labelLayout: new sap.ui.layout.GridData({
				span: "L3 M3 S3",
				linebreak: true
			}),
			type: "DropdownTable",
			dropdowntable: {
				layout: new sap.ui.layout.GridData({
					span: "L9 M9 S9"
				}),
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/SUPITEM",
				field: "SUPPLIERID",
				columns: [{
					label: "Supplier",
					field: "SUPPLIERID",
					type: "TextField"
				}, {
					label: "Supplier Name",
					field: "SUPPLIERDESC",
					type: "TextField"
				}],
				filters: [
					[{
						field: "SUPPLIERID",
						label: "Supplier",
						type: "TextField",
						textfield: {
							// defaultFilterOp: "EQ"
						}
					}],
					[{
						field: "SUPPLIERDESC",
						label: "Supplier Name",
						type: "TextField",
						textfield: {
							// defaultFilterOp: "EQ"
						}
					}]
				],
				visibleRowCount: 10
			}
		}, {
			field: "TPL_ID",
			label: "3PL ID",
			labelLayout: new sap.ui.layout.GridData({
				span: "L3 M3 S3",
				linebreak: true
			}),
			type: "DropdownBox",
			dropdownbox: {
				layout: new sap.ui.layout.GridData({
					span: "L9 M9 S9"
				}),
				odata: {
					url: sServiceUrl + "/InputParams(P_PTYPE='TPL_ID')/Results?$format=json",
					bindKeyField: "PVALUE",
					bindTextField: "PVALUE",
					defaultSelectAll: true
				}
			}
		}, {
			field: "WERKS",
			label: "Logical Plant",
			labelLayout: new sap.ui.layout.GridData({
				span: "L3 M3 S3",
				linebreak: true
			}),
			type: "DropdownBox",
			dropdownbox: {
				layout: new sap.ui.layout.GridData({
					span: "L9 M9 S9"
				}),
				odata: {
					url: sServiceUrl + "/CONF_SITEMASTER2?$format=json&$select=SITEID,MS",
					bindKeyField: "SITEID",
					bindTextField: "SITEID",
					defaultSelectAll: true
				}
			}
		// }, {
		// 	field: "PO_NUMBER",
		// 	label: "PO Id",
		// 	labelLayout: new sap.ui.layout.GridData({
		// 		span: "L5 M5 S5",
		// 		linebreak: true
		// 	}),
		// 	type: "TextField",
		// 	textfield:{
		// 		layout: new sap.ui.layout.GridData({
		// 			span: "L7 M7 S7"
		// 		})
		// 	}
		// }, {
		// 	field: "PO_LINE_ID",
		// 	label: "PO Line Id",
		// 	labelLayout: new sap.ui.layout.GridData({
		// 		span: "L3 M3 S3",
		// 		linebreak: true
		// 	}),
		// 	type: "TextField",
		// 	textfield:{
		// 		layout: new sap.ui.layout.GridData({
		// 			span: "L9 M9 S9"
		// 		})
		// 	}
		}, {
			field: "MATNR",
			label: "Part Number",
			labelLayout: new sap.ui.layout.GridData({
				span: "L3 M3 S3",
				linebreak: true
			}),
			type: "DropdownTable",
			dropdowntable: {
				layout: new sap.ui.layout.GridData({
					span: "L9 M9 S9"
				}),
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/ITEMSITEMASTER001",
				field: "ITEM",
				columns: [{
					label: "Part Number",
					field: "ITEM",
					type: "TextField"
				}, {
					label: "Part Description",
					field: "ITEMDESC",
					type: "TextField"
				}],
				filters: [
					[{
						field: "ITEM",
						label: "Part Number",
						type: "TextField",
						textfield: {
							// defaultFilterOp: "EQ"
						}
					}],
					[{
						label: "Part Description",
						field: "ITEMDESC",
						type: "TextField",
						textfield: {
							// defaultFilterOp: "EQ"
						}
					}]
				],
				visibleRowCount: 10
			}
		}, {
			field: "RECEIPT_DATE",
			label: "Receipt Date",
			labelLayout: new sap.ui.layout.GridData({
				span: "L3 M3 S3",
				linebreak: true
			}),
			type: "TimeRange",
			timerange: {
				layout: new sap.ui.layout.GridData({
					span: "L9 M9 S9"
				}),
				fromLabelLayout: new sap.ui.layout.GridData({
					span: "L2 M2 S2"
				})
			}
		}, {
			field: "SYS_CREATED_DATE",
			label: "Creation Date",
			labelLayout: new sap.ui.layout.GridData({
				span: "L3 M3 S3",
				linebreak: true
			}),
			type: "TimeRange",
			timerange: {
				layout: new sap.ui.layout.GridData({
					span: "L9 M9 S9"
				}),
				fromLabelLayout: new sap.ui.layout.GridData({
					span: "L2 M2 S2"
				})
			}
		}, {
			field: "HAWB",
			label: "Hawb",
			labelLayout: new sap.ui.layout.GridData({
				span: "L3 M3 S3",
				linebreak: true
			}),
			type: "TextField",
			textfield:{
				layout: new sap.ui.layout.GridData({
					span: "L9 M9 S9"
				})
			}
		// }, {
		// 	field: "INVOICE_NUMBER",
		// 	label: "Invoice",
		// 	labelLayout: new sap.ui.layout.GridData({
		// 		span: "L3 M3 S3",
		// 		linebreak: true
		// 	}),
		// 	type: "TextField",
		// 	textfield:{
		// 		layout: new sap.ui.layout.GridData({
		// 			span: "L9 M9 S9"
		// 		})
		// 	}
		}];

		config.filters = lenovo.control.commontable.Toolkit.splitChunck(2, config.filtersRaw);
		//edit
		config.editRaw = [{
			field: "MATNR",
			label: "Part Number",
			// validation: [{
			// 	validType: lenovo.control.Validation.require,
			// 	errMsg: "Required!"
			// }]
		// }, {
		// 	field: "PO_LINE_ID",
		// 	label: "PO Line Id",
			// validation: [{
			// 	validType: lenovo.control.Validation.require,
			// 	errMsg: "Required!"
			// }]
		}, {
			field: "HOLD_TYPE",
			label: "Hold Type"
		}, {
			field: "HOLD_QTY",
			label: "Hold Qty",
			// validation: [{
			// 	validType: lenovo.control.Validation.require,
			// 	errMsg: "Required!"
			// }]
		}, {
			field: "WHS_NO",
			label: "WareHouse No.",
			// validation: [{
			// 	validType: lenovo.control.Validation.require,
			// 	errMsg: "Required!"
			// }]
		}, {
			field: "DEST_STORAGE_LOCATION",
			label: "Destination Location",
			// validation: [{
			// 	validType: lenovo.control.Validation.require,
			// 	errMsg: "Required!"
			// }]
		// }, {
		// 	field: "INVOICE_NUMBER",
		// 	label: "Invoice No.",
			// validation: [{
			// 	validType: lenovo.control.Validation.require,
			// 	errMsg: "Required!"
			// }]
		}, {
			field: "WERKS",
			label: "Logical Plant",
			// validation: [{
			// 	validType: lenovo.control.Validation.require,
			// 	errMsg: "Required!"
			// }]
		}, {
			field: "LIFNR",
			label: "Vendor",
			// validation: [{
			// 	validType: lenovo.control.Validation.require,
			// 	errMsg: "Required!"
			// }]
		}, {
			field: "QTY",
			label: "Received Qty",
			// validation: [{
			// 	validType: lenovo.control.Validation.require,
			// 	errMsg: "Required!"
			// }]
		}];
		//download
		config.download.filename = "data_export";
		config.download.table = '"_SYS_BIC"."cdp.mxebgvmi.models/AT_SOI_GR"';
		config.download.columns = ["RECEIPT_ID","TPL_RECEIPT_ID","TPL_RECEIPT_LINE_ID","HAWB","TPL_ID","MATNR","MATNR_DESCR","REASON_CODE","STATUS","HOLD_TYPE","HOLD_QTY",
"DEST_STORAGE_LOCATION","WHS_NO","DEST_TYPE","DEST_BIN","WERKS","LIFNR","QTY","RECEIPT_DATE","SYS_TIMESTAMP","ECC_STEP","TR_NUMBER","TR_ITEM_NUMBER",
"MATERIAL_DOCUMENT_YEAR","MATERIAL_DOCUMENT","SYS_LAST_MODIFIED_BY","SYS_LAST_MODIFIED_DATE","SYS_CREATED_BY","SYS_CREATED_DATE"];
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
		var service = new lenovo.service.VMI;
		
		var sServiceUrl = service.getMXVmi();
		var iServiceUrl = service.getMXVmiDSGeneral();
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
		var header = lenovo.control.commontable.Table.createHeader("Manage", "SOI Failed GR");

		var oToolbarCtn = oInsertUpload.getContent()[0];
		var oConfirmBtn = new sap.ui.commons.Button({
			lite: true,
			icon: "sap-icon://begin",
			tooltip: "Confirm",
			visible: true,
			press: function(oEvent){
				var selectedIndices = table.getSelectedIndices();
				if(0 == selectedIndices.length){
					lenovo.control.commontable.Toolkit.showErrorMsg("Please select a row at least!", "ERROR", "Error");
					return;
				}
				
				var oUpdateData = [];
				for(var i = 0;i < selectedIndices.length; i++){
					var selectedObject = table.getContextByIndex(selectedIndices[i]).getObject();
					if(selectedObject.STATUS == "ERROR"){
						var oTemp = {
							TPL_RECEIPT_ID: selectedObject.TPL_RECEIPT_ID,
							TPL_RECEIPT_LINE_ID: selectedObject.TPL_RECEIPT_LINE_ID,
							TPL_ID: selectedObject.TPL_ID
						};
						oUpdateData.push(oTemp);
					}
				}
				if(oUpdateData.length == 0){
					lenovo.control.commontable.Toolkit.showErrorMsg("Status isn't matched!", "ERROR", "Error");
					return;
				}
				var oEntry = {
					"JOB_TYPE": "TS",
					"VIEW_NAME": "loiFailedGR",
					"PROCESS_NAME": "SOI_GR_RESUBMIT",
					"TABLE_NAME": "MXEBGVMI.SOI_GR",
					"SEGMENT_NAME": "STATUS",
					"P_KEY": oUpdateData
				};
				$.ajax({
					url: iServiceUrl,
					type: "POST",
					data: JSON.stringify(oEntry),
					dataType: "text",
					contentType: "application/json",
					success: function(msg) {
						table.getModel().refresh();
						table.clearSelection();
						lenovo.control.commontable.Toolkit.showErrorMsg(msg, "SUCCESS", "Invoke");
					},
					error: function(e,b) {
						lenovo.control.commontable.Toolkit.showErrorMsg(e.responseText, "ERROR", "Invoke");
					}
				});
			}
		});
		//auth
		var auth =  lenovo.control.commontable.Table.getViewAuth("soiFailedGR");
		for (i in auth) {
			switch(i) {
				case "confirm":
					oConfirmBtn.setVisible(auth[i]);
					break;
			}
		}
		oToolbarCtn.insertContent(oConfirmBtn,1);

		return [header, filterPanel, oInsertUpload, table];
	},

	onTreeNavigation: function(sChannel, sEvent, oData){
		if(oData.view === "SOI Failed GR") {
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