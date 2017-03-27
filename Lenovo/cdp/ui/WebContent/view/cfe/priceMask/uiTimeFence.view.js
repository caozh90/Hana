/**
 * @author zhangchen8
 * @date 2016-3-4
 */
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
jQuery.sap.require("lenovo.control.Validation");
sap.ui
		.jsview(
				"lenovo.view.cfe.priceMask.uiTimeFence",
				{
					setConfig : function(config, oServiceUrl, uServiceUrl, auth) {
						// table
						config.columns = [ {
							field : "OEM_NAME",
							label : "OEM Name",
							type : "TextField"
						}, {
							field : "TIME_FENCE",
							label : "Time Fence",
							type : "TextField"
						}, {
							field : "FUNCTION_TYPE",
							label : "Function Type",
							type : "TextField"
						}, {
							field : "TIME_FENCE_TYPE",
							label : "Time Fence Type",
							type : "TextField"
						}, {
							field : "PROFIT_CENTER",
							label : "Profit Center",
							type : "TextField"
						}, {
							field : "START_DATE",
							label : "Start Date",
							type : "DatePicker",
							datepicker : {
								format : 'yyyy-MM-dd'
							},
							width : "140px"
						}, {
							field : "END_DATE",
							label : "End Date",
							type : "DatePicker",
							datepicker : {
								format : 'yyyy-MM-dd'
							},
							width : "140px"
						}, {
							field : "SYS_CREATED_BY",
							label : "Created By",
							type : "TextField"
						}, {
							field : "SYS_CREATED_DATE",
							label : "Created Date",
							type : "DatePicker",
							datepicker : {
								format : 'yyyy-MM-dd'
							},
							width : "150px"
						} ];
						var windowHeight = lenovo.control.commontable.Toolkit
								.getWindowHeight();
						var headerHeight = lenovo.control.commontable.Toolkit
								.getDefaultHeaderHeight(2);

						var rowHeight = 30;
						config.visibleRowCount = lenovo.control.commontable.Toolkit
								.getDefaultVisibleRowCount(rowHeight,
										windowHeight - headerHeight);

						// filter
						config.filtersRaw = [
								{
									field : "OEM_NAME",
									label : "OEM Name",
									type : "DropdownBox",
									dropdownbox : {
										odata : {
											defaultSelectAll : true,
											bindTextField : "ITEM_VALUE",
											bindKeyField : "ITEM_VALUE",
											url : oServiceUrl
													+ "/UI_TIME_FENCE_SEARCH_DDL?$filter=ITEM_TYPE eq 'OEM_NAME'&$format=json"
										}
									}
								},
								{
									field : "TIME_FENCE",
									label : "Time Fence",
									type : "DropdownBox",
									dropdownbox : {
										odata : {
											defaultSelectAll : true,
											url : oServiceUrl
													+ "/UI_TIME_FENCE_SEARCH_DDL?$filter=ITEM_TYPE eq 'TIME_FENCE'&$format=json",
											bindTextField : "ITEM_VALUE",
											bindKeyField : "ITEM_VALUE"
										}
									}
								},
								{
									field : "FUNCTION_TYPE",
									label : "Function Type",
									type : "DropdownBox",
									dropdownbox : {
										odata : {
											defaultSelectAll : true,
											url : oServiceUrl
													+ "/UI_TIME_FENCE_SEARCH_DDL?$filter=ITEM_TYPE eq 'FUNCTION_TYPE'&$format=json",
											bindTextField : 'ITEM_VALUE',
											bindKeyField : 'ITEM_VALUE'
										}
									}
								},
								{
									field : "TIME_FENCE_TYPE",
									label : "Time Fence Type",
									type : "DropdownBox",
									dropdownbox : {
										odata : {
											defaultSelectAll : true,
											url : oServiceUrl
													+ "/UI_TIME_FENCE_SEARCH_DDL?$filter=ITEM_TYPE eq 'TIME_FENCE_TYPE'&$format=json",
											bindTextField : 'ITEM_VALUE',
											bindKeyField : 'ITEM_VALUE'
										}
									}
								},
								{
									field : "PROFIT_CENTER",
									label : "Profit Center",
									type : "DropdownBox",
									dropdownbox : {
										odata : {
											defaultSelectAll : true,
											url : oServiceUrl
													+ "/UI_TIME_FENCE_SEARCH_DDL?$filter=ITEM_TYPE eq 'PROFIT_CENTER'&$format=json",
											bindTextField : 'ITEM_VALUE',
											bindKeyField : 'ITEM_VALUE'
										}
									}
								},
								{
									field : "SYS_CREATED_BY",
									label : "Created By",
									type : "DropdownBox",
									dropdownbox : {
										odata : {
											defaultSelectAll : true,
											url : oServiceUrl
													+ "/UI_TIME_FENCE_SEARCH_DDL?$filter=ITEM_TYPE eq 'SYS_CREATED_BY'&$format=json",
											bindTextField : 'ITEM_VALUE',
											bindKeyField : 'ITEM_VALUE'
										}
									}
								},
								{
									field : "START_DATE",
									label : "Start Date",
									width : "150px",
									type : "TimeRange",
									labelLayout : new sap.ui.layout.GridData({
										span : "L3 M3 S3",
										linebreak : true
									}),
									timerange : {
										fromLabelLayout : new sap.ui.layout.GridData(
												{
													span : "L2 M2 S2"
												}),
										layout : new sap.ui.layout.GridData({
											span : "L9 M9 S9"
										})
									}
								},
								{
									field : "END_DATE",
									label : "End Date",
									width : "150px",
									type : "TimeRange",
									labelLayout : new sap.ui.layout.GridData({
										span : "L3 M3 S3",
										linebreak : true
									}),
									timerange : {
										fromLabelLayout : new sap.ui.layout.GridData(
												{
													span : "L2 M2 S2"
												}),
										layout : new sap.ui.layout.GridData({
											span : "L9 M9 S9"
										})
									}
								} ];

						config.filters = lenovo.control.commontable.Toolkit
								.splitChunck(3, config.filtersRaw);

						// create
						config.insertRaw = [
								{
									field : "PROFIT_CENTER",
									label : "Profit Center",
									type : "DropdownBox",
									required : true,
									validation : [ {
										validType : lenovo.control.Validation.require,
										errMsg : "Required!"
									} ],
									dropdownbox : {
										odata : {
											url : oServiceUrl
													+ "/UI_TIME_FENCE_CREATE_DDL?$filter=PNAME eq 'PROFIT_CENTER'&$format=json",
											bindTextField : 'PVALUE',
											bindKeyField : 'PVALUE'
										}
									}
								},
								{
									field : "OEM_NAME",
									label : "OEM Name",
									type : "DropdownBox",
									required : true,
									validation : [ {
										validType : lenovo.control.Validation.require,
										errMsg : "Required!"
									} ],
									dropdownbox : {
										odata : {
											url : oServiceUrl
													+ "/UI_TIME_FENCE_CREATE_DDL?$filter=PNAME eq 'OEM_NAME'&$format=json",
											bindTextField : 'PVALUE',
											bindKeyField : 'PVALUE'
										}
									}
								},
								{
									field : "FUNCTION_TYPE",
									label : "Function Type",
									type : "DropdownBox",
									required : true,
									validation : [ {
										validType : lenovo.control.Validation.require,
										errMsg : "Required!"
									} ],
									dropdownbox : {
										odata : {
											url : oServiceUrl
													+ "/UI_TIME_FENCE_CREATE_DDL?$filter=PNAME eq 'FUNCTION_TYPE'&$format=json",
											bindTextField : "PVALUE",
											bindKeyField : "PVALUE"
										}
									}
								},
								{
									field : "TIME_FENCE_TYPE",
									label : "Time Fence Type",
									type : "DropdownBox",
									required : true,
									validation : [ {
										validType : lenovo.control.Validation.require,
										errMsg : "Required!"
									} ],
									dropdownbox : {
										odata : {
											url : oServiceUrl
													+ "/UI_TIME_FENCE_CREATE_DDL?$filter=PNAME eq 'TIME_FENCE_TYPE'&$format=json",
											bindTextField : "PVALUE",
											bindKeyField : "PVALUE"
										}
									}
								},
								{
									field : "START_DATE",
									label : "Start Date",
									type : "DatePicker",
									required : true,
									validation : [ {
										validType : lenovo.control.Validation.require,
										errMsg : "Required!"
									} ],
									width : "150px",
									datepicker : {
										format : 'yyyy-MM-dd'
									},
								},
								{
									field : "END_DATE",
									label : "End Date",
									type : "DatePicker",
									required : true,
									validation : [ {
										validType : lenovo.control.Validation.require,
										errMsg : "Required!"
									} ],
									width : "150px",
									datepicker : {
										format : 'yyyy-MM-dd'
									},
								} ];

						config.create.columns = lenovo.control.commontable.Toolkit
								.splitChunck(1, config.insertRaw);
						config.create.url = "/UI_TIME_FENCE_INFO";
						config.create.relatedfakeDateField = {
							targetFakeField : "TIME_FENCE",
							targetFakeValue : [ "START_DATE", "END_DATE" ],
							opStringMerge : "-"
						};

						// toolbar , auth
						config.create.visible = auth.createable;
						config.edit.visible = false;
						config.deleteable.visible = auth.deleteable;
						config.upload.visible = false;
						config.download.visible = false;
						config.download.roleName = auth.exportableRoleName;
						config.upload.roleName = auth.uploadableRoleName;

					},

					onSyncBomButtonPress : function(oEvent) {
						var sProcessName = "PRC_PM_GET_BOM";
						var executePanel = this.getParent().getParent()
								.getParent();

						var oLabel = new sap.ui.commons.Label({
							text : "Do you want to execute Sync B/S Bom ?",
							width : "350px",
						});

						var data = {
							"process_name" : sProcessName

						};
						sap.ui.commons.MessageBox.confirm(oLabel, function(
								result) {
							if (result) {
								var service = new lenovo.service.CFE();
								var logicServiceUrl = service.getEBGCfeLogic();
								executePanel.setBusy(true);
								$.ajax({
									url : logicServiceUrl
											+ "/ui_time_fence_syncbom.xsjs",
									data : data,
									type : "GET",
									contentType : "text",
									success : function(data) {
										executePanel.setBusy(false);
										lenovo.control.commontable.Toolkit
												.showErrorMsg(
														"Successfully execute",
														"SUCCESS", "Execute");
									},
									error : function(err) {
										err = err && err.responseText;
										executePanel.setBusy(false);
										if (!(typeof err === "string"))
											err = JSON.stringify(err);
										lenovo.control.commontable.Toolkit
												.showErrorMsg(err, "ERROR",
														"Execute");
									}
								});
							}
						}, "Confirm");
					},

					onActualCalculateButtonPress : function(oTable) {
//						var oTable = sap.ui.getCore().byId("__table0");
						if (oTable.getSelectedIndex() < 0
								|| oTable.getSelectedIndices().length != 1) {
							alert("Please just select only one row for Actual Calculation.");
							return;
						} else {
							var oData = oTable.getModel().getProperty(
									oTable.getContextByIndex(oTable
											.getSelectedIndex()).sPath);
							var sTimeFence = oData.TIME_FENCE;
							var sOemName = oData.OEM_NAME;
							var sProfitCenter = oData.PROFIT_CENTER;
						}
						var sProcessName = "PRC_PM_RPT_ACTUAL";
						var executePanel = this.getParent().getParent()
								.getParent();

						var oLabel = new sap.ui.commons.Label({
							text : "Do you want to execute Cal.Actural PM ?",
							width : "350px",
						});

						var data = {
							"process_name" : sProcessName,
							"time_fence" : sTimeFence,
							"oem_name" : sOemName,
							"profit_center" : sProfitCenter

						};
						sap.ui.commons.MessageBox.confirm(oLabel, function(
								result) {
							if (result) {
								var service = new lenovo.service.CFE();
								var logicServiceUrl = service.getEBGCfeLogic();
								executePanel.setBusy(true);
								$.ajax({
									url : logicServiceUrl
											+ "/ui_time_fence_actual.xsjs",
									data : data,
									type : "GET",
									contentType : "text",
									success : function(data) {
										executePanel.setBusy(false);
										lenovo.control.commontable.Toolkit
												.showErrorMsg(
														"Successfully execute",
														"SUCCESS", "Execute");
									},
									error : function(err) {
										err = err && err.responseText;
										executePanel.setBusy(false);
										if (!(typeof err === "string"))
											err = JSON.stringify(err);
										lenovo.control.commontable.Toolkit
												.showErrorMsg(err, "ERROR",
														"Execute");
									}
								});
							}
						}, "Confirm");
					},
					onForecastCalculateButtonPress : function(oEvent) {
						var sProcessName = "PRC_PM_RPT_FORECAST";
						var executePanel = this.getParent().getParent()
								.getParent();

						var oLabel = new sap.ui.commons.Label({
							text : "Do you want to execute Cal.Forecast PM ?",
							width : "350px",
						});

						var data = {
							"process_name" : sProcessName

						};
						sap.ui.commons.MessageBox.confirm(oLabel, function(
								result) {
							if (result) {
								var service = new lenovo.service.CFE();
								var logicServiceUrl = service.getEBGCfeLogic();
								executePanel.setBusy(true);
								$.ajax({
									url : logicServiceUrl
											+ "/ui_time_fence_forecast.xsjs",
									data : data,
									type : "GET",
									contentType : "text",
									success : function(data) {
										executePanel.setBusy(false);
										lenovo.control.commontable.Toolkit
												.showErrorMsg(
														"Successfully execute",
														"SUCCESS", "Execute");
									},
									error : function(err) {
										err = err && err.responseText;
										executePanel.setBusy(false);
										if (!(typeof err === "string"))
											err = JSON.stringify(err);
										lenovo.control.commontable.Toolkit
												.showErrorMsg(err, "ERROR",
														"Execute");
									}
								});
							}
						}, "Confirm");
					},

					createContent : function() {
						var that = this;
						var app = new sap.m.App();
						var service = new lenovo.service.CFE();
						var oServiceUrl = service.getEBGCfe();
						var uServiceUrl = service.getEBGCfeUpload();

						var oModel = new sap.ui.model.odata.ODataModel(
								oServiceUrl, true);
						var config = lenovo.control.commontable.Table
								.getDefaultTableConfig(oModel);
						var auth = lenovo.control.commontable.Table
								.getViewAuth("uiTimeFence");

						this.setConfig(config, oServiceUrl, uServiceUrl, auth);
						var header = lenovo.control.commontable.Table
								.createHeader("Price Mask", "Time Fence");

						config.bindRowUrl = "/UI_TIME_FENCE_INFO";
						var table = lenovo.control.commontable.Table
								.createTable(config);
						table.setBusy(true);
						table.setModel(oModel);
						oModel.attachRequestCompleted(function() {
							table.setBusy(false);
						});

						// filter
						var filterPanel = lenovo.control.commontable.Table
								.createFilter(config, table);

						// toolbar
						var oEditDeleteUploadDownload = lenovo.control.commontable.Table
								.createInsertEditDeleteUploadDownload(config,
										table, app);

						var oForm = filterPanel.getContent()[0];
						var buttons = oEditDeleteUploadDownload.getContent()[0]
								.getContent();
						var oSyncBomButton = new sap.ui.commons.Button({
							id : "syncBomButton",
							text : "Sync B/S Bom",
							press : this.onSyncBomButtonPress
						});
						var oActualButton = new sap.ui.commons.Button({
							id : "actualButton",
							text : "Cal.Actual PM",
							press : function(){
								that.onActualCalculateButtonPress(table);
							}//this.onActualCalculateButtonPress
						});
						var oForecastButton = new sap.ui.commons.Button({
							id : "forecastButton",
							text : "Cal.Forecast PM",
							press : this.onForecastCalculateButtonPress
						});
						var oToolbarSpacer1 = new sap.m.ToolbarSpacer({
							width : "5px"
						});
						var oToolbarSpacer2 = new sap.m.ToolbarSpacer({
							width : "5px"
						});
						var oToolbarSpacer3 = new sap.m.ToolbarSpacer({
							width : "5px"
						});
						buttons.unshift(oSyncBomButton, oToolbarSpacer1,
								oActualButton, oToolbarSpacer2,
								oForecastButton, oToolbarSpacer3);
						var oTableToolbarLayout = oEditDeleteUploadDownload
								.getContent()[0];
						oTableToolbarLayout.removeAllContent();
						for (i in buttons) {
							oTableToolbarLayout.addContent(buttons[i]);
						}

						// create, compare startDate, endDate
						if (auth.createable) {
							var insertDialog = oEditDeleteUploadDownload
									.data("insertDialog");
							var insertForm = insertDialog.getContent()[0];
							var oStartDateTimeRange = lenovo.control.commontable.Toolkit
									.getFormElementByLabel(insertForm,
											"Start Date")[0];
							var oEndDateTimeRange = lenovo.control.commontable.Toolkit
									.getFormElementByLabel(insertForm,
											"End Date")[0];
							lenovo.control.commontable.Toolkit
									.validateDatePickerCompare(
											oStartDateTimeRange,
											oEndDateTimeRange);
						}

						// app
						var page = new sap.m.Page({
							showHeader : false,
							content : [ header, filterPanel,
									oEditDeleteUploadDownload, table ]
						// [layout]
						});
						app.insertPage(page);
						app.setInitialPage(page);
						return app;
					}
				});