/*
	develop by Coral Zhang @ 2014/12/18
	update by alex liu @2014/12/26
*/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.control.Validation");
jQuery.sap.require("lenovo.service.SZVMI");

sap.ui.jsview("lenovo.view.szvmi.control.updateASNStatus", {
	setConfig: function(config,sServiceUrl,auth) {
		var windowHeight = lenovo.control.commontable.Toolkit.getWindowHeight();
		//var auth =  lenovo.control.commontable.Table.getViewAuth("confirmDispatches");
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(3);
		//var headerHeight = 400;
		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight - headerHeight );
		
		config.columns = [{
			field: "PRODUCTIONORDID",
			label: "Product Order ID",
			type: "TextField",
			width: "100px"
		},{
			field: "SITEID",
			label: "Logical Plant",
			type: "TextField",
			width: "100px"
		},{
			field: "LINENUM",
			label: "Line Number",
			type: "TextField",
			width: "100px"
		},{
			field: "ITEM",
			label: "Item",
			type: "TextField",
			width: "150px"
		},{
			field: "ITEMDESC",
			label: "Item Desc",
			type: "TextField",
			width: "150px"
		},{
			field: "QTYPER",
			label: "Qtyper",
			type: "TextField",
			width: "150px"
		},{
			field: "LGORT",
			label: "Lgort",
			type: "TextField",
			width: "100px"
		},{
			field: "STATUS",
			label: "Status",
			type: "DropdownBox",
			dropdownbox: {
				odata: {
					url: sServiceUrl + "/InputParams(P_PTYPE='ASN_STATUS')/Results?$format=json",
					bindKeyField: "PVALUE",
					bindTextField: "PVALUE",
					defaultSelectAll: true
				}
			},
		   width: "150px"
		},{
			field: "SYS_CREATION_DATE",
			label: "Create Date",
			type: "TextField",
			width: "150px"
		}];

		config.bindRowUrl = "/MODIFY_ASN_STATUS";
/*		config.defaultSort = [{
					field: "SYS_CREATED_DATE",
					bDescending: true
				}];*/
		config.bindRowUrl = "/MODIFY_ASN_STATUS";
		config.defaultSort = [{
					field: "SYS_CREATION_DATE",
					bDescending: true
				}];

		config.filtersRaw = [{
			field: "PRODUCTIONORDID",
			label: "Production Order ID",
			type: "TextField"
		},{
			field: "SITEID",
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
		},{
			field: "SYS_CREATION_DATE", label: "Create Date", type: "TimeRange",
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true})
		}, {
			field: "ITEM",
			label: "Part Number",
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
							// defaultFilterOp: "EQ"
						}
					}],
					[{
						field: "ITEMDESC",
						label: "Item Desc",
						type: "TextField",
						textfield: {
							// defaultFilterOp: "EQ"
						}
					}]
				],
				visibleRowCount: 10
			}
		},{
			field: "STATUS",
			label: "Status",
			type: "DropdownBox",
			dropdownbox: {
				odata: {
					url: sServiceUrl + "/InputParams(P_PTYPE='ASN_STATUS')/Results?$format=json",
					bindKeyField: "PVALUE",
					bindTextField: "PVALUE",
					defaultSelectAll: true
				}
			}
		}];

		config.filters = lenovo.control.commontable.Toolkit.splitChunck(2, config.filtersRaw);
		config.editRaw = [ 
		                   {field: "STATUS", label: "Status", type: "DropdownBox",
		           			dropdownbox: {
		        				odata: {
		        					url: sServiceUrl + "/InputParams(P_PTYPE='ASN_PULL_STATUS')/Results?$format=json",
		        					bindKeyField: "PVALUE",
		        					bindTextField: "PVALUE",
		        					defaultSelectAll: true
		        				}
		        			}, 
		        			referTo: "Notes"}
		                  ];
		//auth
		config.create.visible=false;
		config.edit.visible=false;
		config.deleteable.visible=false;
		config.upload.visible=false;
		config.download.visible = true;
		//download
		config.download.filename = "data_export";
		config.download.table = '"_SYS_BIC"."cdp.szebgvmi.models/AT_ASN_STATUS"';
		config.download.columns = ["PRODUCTIONORDID","SITEID","LINENUM","ITEM","ITEMDESC","QTYPER","LGORT","STATUS","SYS_CREATION_DATE"];//
		config.download.roleName = auth.exportableRoleName;
	},

	createContent: function(oController) {
		var service = new lenovo.service.SZVMI;
		
		var sServiceUrl = service.getMXVmi();
		//var dSchema = service.getMXVmiSchema();
		var iServiceUrl = service.getMXVmiInvoke();
		var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
		var auth =  lenovo.control.commontable.Table.getViewAuth("updateASNStatus");
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		this.setConfig(config, sServiceUrl,auth);

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
		//add delete and delete all button.
		var oToolbarCtn = oInsertUpload.getContent()[0];
		var oReadyBtn = new sap.ui.commons.Button({
			lite: true,
			icon: "sap-icon://delete",
			tooltip: "Delete",
			visible: false,
			press: function(oEvent){
				var selectedIndices = table.getSelectedIndices();
				if(0 == selectedIndices.length){
					lenovo.control.commontable.Toolkit.showErrorMsg("Please select a row at least!", "ERROR", "Error");
					return;
				}
				
				var oUpdateData = {};
			    var oASNPull = {};
			    oASNPull.data = [];
				for(var i = 0;i < selectedIndices.length; i++){
					var selectedObject = table.getContextByIndex(selectedIndices[i]).getObject();
					if(selectedObject.STATUS == "IN_PROCESS"){
						oUpdateData=$.extend( true,  {},oUpdateData);  
					//	oUpdateData = oUpdateData + selectedObject.MO_ID + ",";
						oUpdateData.SCENARIO_ID = selectedObject.SCENARIO_ID;
						oUpdateData.PRODUCTIONORDID = selectedObject.PRODUCTIONORDID;
						oUpdateData.LINENUM = selectedObject.LINENUM;
						oASNPull.data.push(oUpdateData);
					}
				}//
				if(oASNPull.data == undefined || oASNPull.data.length == 0){
					lenovo.control.commontable.Toolkit.showErrorMsg("Only status 'IN_PROCESS' can be set status 'ASN_DELETED'!", "ERROR", "Error");
					return;
				}
//				oASNPull.JOB_TYPE = "ASN_COMPLETED";
//				console.log(JSON.stringify(oASNPull));
				var oEntry = {
					"job_type": "ASN_DELETED",
					"data": oASNPull.data
				};
				$.ajax({
					url: iServiceUrl + "/ui_modify_ASN_delete.xsjs",
					type: "POST",
					data: JSON.stringify(oEntry),
					dataType: "text",
					contentType: "application/json",
					success: function(msg) {
						table.getModel().refresh();
						lenovo.control.commontable.Toolkit.showErrorMsg("Delete successfully!", "SUCCESS", "Information");
					},
					error: function(e,b) {
						lenovo.control.commontable.Toolkit.showErrorMsg("Delete:" && e.responseText, "ERROR", "Information");
					}
				});
			}
		});

		var oReadyAllBtn = new sap.ui.commons.Button({
			lite: true,
			icon: "resource/img/Delete_All.png",
			tooltip: "Delete all",
			visible: false,
			press: function(oEvent){
				$.ajax({
					url:"/cdp/szebgvmi/service/invoke/uiModifyASNInprocessCount.xsjs",
					type:"get",
					async: false,
					contentType: "application/json",
					success: function(inprocessCount){
						if(inprocessCount<=0){
							lenovo.control.commontable.Toolkit.showErrorMsg("There is no Inprocess records will be deleted!", "SUCCESS", "Information");
						}else{
							var oDialog1 = new sap.ui.commons.Dialog();
							oDialog1.setTitle("Information");
							var oText = new sap.ui.commons.TextView({text: "Total: "+inprocessCount+" records will be deleted.Continue?"});
							oDialog1.addContent(oText);
							oDialog1.addButton(new sap.ui.commons.Button({text: "YES", 
								press:function(){
									var selectedIndices = table.getSelectedIndices();
									var oEntry = {
										"job_type": "DELETE_ALL"
									};
									$.ajax({
										url: iServiceUrl + "/ui_modify_ASN_delete.xsjs",
										type: "POST",
										data: JSON.stringify(oEntry),
										dataType: "text",
										contentType: "application/json",
										success: function(msg) {
											table.getModel().refresh();
											lenovo.control.commontable.Toolkit.showErrorMsg("Delete All successfully!", "SUCCESS", "Information");
										  },
										error: function(e,b) {
											lenovo.control.commontable.Toolkit.showErrorMsg("Delete All:" && e.responseText, "ERROR", "Information");
										}
									})
									oDialog1.close();;
								}}));
							oDialog1.addButton(new sap.ui.commons.Button({text: "NO", press:function(){oDialog1.close();}}));
							oDialog1.open();
						}
					}
				});
		
			}
		});
		//auth
		var auth =  lenovo.control.commontable.Table.getViewAuth("updateASNStatus");
		for (i in auth) {
			switch(i) {
				case "editable":
					oReadyBtn.setVisible(auth[i]);
					oReadyAllBtn.setVisible(auth[i]);
					break;
			}
		}
		
		oToolbarCtn.insertContent(oReadyBtn,0);
		oToolbarCtn.insertContent(oReadyAllBtn,1);
		
	
		var header = lenovo.control.commontable.Table.createHeader("Control", "ASN Modify");

		return [header, filterPanel, oInsertUpload, table];
	},

	onTreeNavigation: function(sChannel, sEvent, oData){
		if(oData.view === "Confirm Dispatches") {
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