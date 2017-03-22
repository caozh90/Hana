//Created by Zhang Ruixue at 2014-11-26
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
sap.ui.jsview("lenovo.view.cfe.controlPoint.managementCenter", {
	getOndemandType: function(oServiceUrl){
		var defaultOndemandType = null;
		$.ajax({
			url: oServiceUrl + "/CFE_UI_ONDEMAND_DDL?$filter=ITEM_TYPE eq 'ONDEMAND_TYPE'&$format=json",
			type: "GET",
			dataType: "json", 
			async: false,
			success: function(data){
				if(data.d.results.length > 0)
					defaultOndemandType = data.d.results[0].ITEM_VALUE;
			}		
		});

		return defaultOndemandType;
	},
	setConfig: function(config, oServiceUrl, auth){
		//table
		config.columns = [{
			field: "ONDEMAND_TYPE", label: "Ondemand Type", type: "TextField"
		},{
			field: "PROD_FAMILY", label: "Prod Family", type:"TextField", width: "290px"
		},{
			field: "ITEM", label: "Item", type:"TextField"
		},{
			field: "MESSAGE", label: "Message", type:"TextField"
		},{
			field: "SYS_CREATED_DATE", label: "Created Date", type:"TextField"
		},{
			field: "SYS_CREATED_BY", label: "Created By", type:"TextField"
		}];
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
//		var headerHeight = 290;
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(3);

		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight);

		//filter
		var defaultOndemandType = this.getOndemandType(oServiceUrl);
		config.filtersRaw = [ {
			field: "ONDEMAND_TYPE", label: "Ondemand Type", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L5 M5 S5", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L7 M7 S7"}),
				defaultFilterValue: defaultOndemandType,
				odata:{
					defaultSelectAll:false,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl+"/CFE_UI_ONDEMAND_DDL?$filter=ITEM_TYPE eq 'ONDEMAND_TYPE'&$format=json"
				}				
			}
		},{
			field: "ITEM", label: "Model", type: "DropdownTable",
//			labelLayout: new sap.ui.layout.GridData({span: "L2 M2 S2", linebreak: true}),
			dropdowntable: {
//				layout: new sap.ui.layout.GridData({span: "L10 M10 S10"}),
				defaultFilterOp: "EQ",
				url: oServiceUrl,
				bindRowUrl: "/UI_ONDEMAND_ITEM",
//				selectionMode: sap.ui.table.SelectionMode.Single,
				field: "ITEM",
				columns: [{
					label: "Model",
					field: "ITEM",
					type: "TextField"
				}],
				filters: [[{
					field: "ITEM",
					label: "Model",
					type: "MultiTextField",
					multitextfield: {
//						defaultFilterOp: "EQ"
					}
				}]]
			}
		},{
			field: "PROD_FAMILY", label: "Family", type: "DropdownBox",
//			labelLayout: new sap.ui.layout.GridData({span: "L2 M2 S2", linebreak: true}),
			dropdownbox : {
//				layout: new sap.ui.layout.GridData({span: "L10 M10 S10"}),
				odata:{
					defaultSelectAll:true,
					url: oServiceUrl+"/CFE_UI_ONDEMAND_DDL?$filter=ITEM_TYPE eq 'PROD_FAMILY'&$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		}];
		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);

		//download
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.ui_ondemand_refresh/CV_UI_ONDEMAND_REFRESH"';
		config.download.columns=[
			"ONDEMAND_TYPE","PROD_FAMILY","ITEM","MESSAGE","SYS_CREATED_DATE", "SYS_CREATED_BY"];
		config.download.filename= "UI_ONDEMAND_REFRESH";
		
		//toolbar , auth
		config.create.visible=false;
		config.deleteable.visible=false;
		config.edit.visible=false;
		config.upload.visible=false;
		config.download.visible = auth.exportable;
		config.download.roleName = auth.exportableRoleName;
		
	},
	confirm: function(){

	},
	execute: function(filterPanel){
		var that = this;
		var oLabel = new sap.ui.commons.Label({
			text: "Do you want to execute?",
			width: "350px",
		});
		sap.ui.commons.MessageBox.confirm(oLabel, function(result){
			if(result) {
				var ondemand_type = that.ondemandDropdownBox.getSelectedKey();
				var model = that.modelTextfield.getValue();
				var family = that.familyTextfield.getSelectedKey();
				var timestamp = new Date().Format('yyyyMMddhhmmssS');
				var process_name;
				if(ondemand_type === "MODEL_LIST") {
					process_name = "ONDEMAND_MODELIST";
				} else if(ondemand_type === "COST_BOM") {
					process_name = "ONDEMAND_CALCULATION";
				}//added by chenwh3 20150831 start
				else if(ondemand_type === "BOM_REFRESH"){
					process_name = "ONDEMAND_BOMREFRESH";
				}//added by chenwh3 20150831 end
				else {
					return;
				}
				that.table.setBusy(true);
				var obj = {
					"EVENT_NAME" : "ONDEMAND#"+ondemand_type+"#"+timestamp,
					"PROCESS_NAME": process_name,
					"model": model,
					"family": family
				};
				//console.log("obj", obj);
				$.ajax({
					url: that.logicServiceUrl + "/ui_ondemand_refresh_new.xsjs",
					type:"GET",
					data: obj,
					datatype: "text",
					success: function(data){
						that.oModel.refresh(true);
						lenovo.control.commontable.Toolkit.showErrorMsg("Executed successfully!", "SUCCESS", "Execute");
					},
					error: function(data){
						that.table.setBusy(false);
						console.log(data);
						data = data && data.responseText;
						if(!(typeof data === "string")) {
							data = JSON.stringify(data);
						}
						lenovo.control.commontable.Toolkit.showErrorMsg(data, "ERROR", "Execute");
					}
				});				
			}
		}, 	"Confirm");
	},
	dataRefresh: function(){
		var that = this;
		var ondemand_type = this.ondemandDropdownBox.getSelectedKey();	
		var timestamp = new Date().Format('yyyyMMddhhmmssS');
		var process_name = "NETCHANGE_MASTER_DATA";
		var obj = {
			"EVENT_NAME": "ONDEMAND#"+ondemand_type+"#"+timestamp,
			"PROCESS_NAME": process_name
		};
		this.table.setBusy(true);
		$.ajax({
			url: this.logicServiceUrl + "/ui_ondemand_refresh_new.xsjs",
			type:"GET",
			data: obj,
			datatype: "text",
			success: function(data){
				that.table.setBusy(false);
				lenovo.control.commontable.Toolkit.showErrorMsg("Executed successfully!", "SUCCESS", "Execute");
			},
			error: function(data){
				that.table.setBusy(false);
				console.log(data);
				data = data && data.responseText;
				if(!(typeof data === "string")) {
					data = JSON.stringify(data);
				}
				lenovo.control.commontable.Toolkit.showErrorMsg(data, "ERROR", "Execute");
			}
		});
	},
	//added by chenwh3 20150831 start
	statusrefresh: function(){
		var that = this;
		var _statusBtn = that.oStatusBtn;
		$.ajax({
			url: this.logicServiceUrl + "/ui_ondemand_refresh_bom_refresh.xsjs",
			type:"GET",
			datatype: "text",
			success: function(data){
				/*************************
				 * Modified by Chris Gao
				 * 2015-08-31
				 * updated by Chris Gao -- 2015-09-09
				 * to process dynamic button text
				 *************************/
				_statusBtn.setText(data);
				/*$.ajax({
					url: oServiceUrl+"/UI_ONDEMAND_STATUS?$filter=ITEM_TYPE eq 'STATUS'&$format=json",
					type: "GET",
					dataType: "json", 
					async: false,
					success: function(data){
						if(data.d.results.length > 0)							
							_statusBtn.setText(data.d.results[0].ITEM_VALUE);
					}		
				});
				/*************************
				 * End by Chris Gao
				 *************************/
				//lenovo.control.commontable.Toolkit.showErrorMsg("Executed successfully!", "SUCCESS", "Execute");
			},
			error: function(data){
				console.log(data);
				data = data && data.responseText;
				if(!(typeof data === "string")) {
					data = JSON.stringify(data);
				}
				lenovo.control.commontable.Toolkit.showErrorMsg(data, "ERROR", "Execute");
			}
		});
	},//added by chenwh3 20150831  end
	fullCalculation: function(){
		var that = this;
//		var ondemand_type = this.ondemandDropdownBox.getSelectedKey();	
		var timestamp = new Date().Format('yyyyMMddhhmmssS');
		var process_name = "FULL_CALCULATION";
		var obj = {
			"EVENT_NAME": "FULL_CALCULATION#"+timestamp,
			"PROCESS_NAME": process_name
		};
		this.table.setBusy(true);
		$.ajax({
			url: this.logicServiceUrl + "/ui_ondemand_refresh_new.xsjs",
			type:"GET",
			data: obj,
			datatype: "text",
			success: function(data){
				that.table.setBusy(false);
				lenovo.control.commontable.Toolkit.showErrorMsg("Executed successfully!", "SUCCESS", "Execute");
			},
			error: function(data){
				that.table.setBusy(false);
				console.log(data);
				data = data && data.responseText;
				if(!(typeof data === "string")) {
					data = JSON.stringify(data);
				}
				lenovo.control.commontable.Toolkit.showErrorMsg(data, "ERROR", "Execute");
			}
		});
	},
	createContent: function(){
		var app = new sap.m.App(); 

		var service = new lenovo.service.CFE();
		var oServiceUrl = service.getEBGCfe();
		var logicServiceUrl = service.getEBGCfeLogic();
		this.logicServiceUrl = logicServiceUrl;
		var that = this;	

		var oModel = new sap.ui.model.odata.ODataModel(oServiceUrl, true);
		this.oModel = oModel;
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		var auth = lenovo.control.commontable.Table.getViewAuth("managementCenter");
		
		this.setConfig(config, oServiceUrl,auth);
		config.bindRowUrl = "/CFE_UI_ONDEMAND_REFRESH";
		var header = lenovo.control.commontable.Table.createHeader("Control Point", "Management Center");
		var table = lenovo.control.commontable.Table.createTable(config);
		
		table.setBusy(true);
		table.setModel(oModel);
		oModel.attachRequestCompleted(function(){
			table.setBusy(false);
		});		
		var filterPanel = lenovo.control.commontable.Table.createFilter(config, table);
		this.table = table;
		this.oModel = oModel;
		this.config = config;
		this.oForm = filterPanel.getContent()[0];
		sap.ui.getCore().getEventBus().subscribe("TreeNavigation", "Ready", this.onTreeNavigation, this);

		
		var oRefreshBtn = new sap.ui.commons.Button({
			lite: true,
			icon: "sap-icon://refresh",
			tooltip: "data refresh",
			press : function(){
				var oLabel = new sap.ui.commons.Label({
					text: "Do you want to data refresh?",
					width: "350px",
				});
				sap.ui.commons.MessageBox.confirm(oLabel, function(result){
					if(result) {
						that.dataRefresh();
					}
				}, 	"Confirm");
			}
		});
		
		var oCalBtn = new sap.ui.commons.Button({
			lite: true,
			icon: "sap-icon://simulate",
			tooltip: "full calculation",
			press : function(){
				var oLabel = new sap.ui.commons.Label({
					text: "Do you want to full calculation?",
					width: "350px",
				});
				sap.ui.commons.MessageBox.confirm(oLabel, function(result){
					if(result) {
						that.fullCalculation();
					}
				}, 	"Confirm");
			} 
		});



		/******************************
		 * modified by Chris Gao
		 * 2015-08-31
		 * Dynamic Status Button Text
		 *******************************/
		var oPanelHeaderlabel = new sap.ui.commons.Label({text: 'Execute', design:sap.ui.commons.LabelDesign.Bold}).addStyleClass("ondemandRefresh-lbHeader");
		var ostatuslabel = new sap.ui.commons.Label({text: 'BOM Refresh Status:'});
		
		//added by chenwh3 20150831 start
		
		var ostatus = new sap.ui.commons.Button({
//			lite: true,
			style: sap.ui.commons.ButtonStyle.Emph,
			//icon: "sap-icon://play",
			width: "40px",
			tooltip: "status refresh",
			text:"",
			press : function(){
					
				that.statusrefresh();
								
			} 
		}).addStyleClass("ondemandRefresh-dslayout-flatcolor-button");
		
		this.oStatusBtn = ostatus;
		
		var oStatusModel = new sap.ui.model.json.JSONModel(oServiceUrl+"/UI_ONDEMAND_STATUS?$filter=ITEM_TYPE eq 'STATUS'&$format=json");
		oStatusModel.attachRequestCompleted(function(){
			if(oStatusModel.getData().d.results != undefined && oStatusModel.getData().d.results.length > 0)
			
			{
				ostatus.setText(oStatusModel.getData().d.results[0].ITEM_VALUE);
			}
		});

		var dsPanel = new sap.ui.commons.Toolbar({
			design: sap.ui.commons.ToolbarDesign.Transparent
		}).addStyleClass("ondemandRefresh-dslayout-flatcolor");
		
//		var dsPanel = new sap.ui.commons.Panel({
//			title: {
//				text: "Execute"
//			},
//			showCollapseIcon: false 
//		}).addStyleClass("filter-panel ondemandRefresh-dslayout");
		dsPanel.addItem(oPanelHeaderlabel);
		dsPanel.addRightItem(ostatuslabel);//added by chenwh3 20150831
		dsPanel.addRightItem(ostatus);//added by chenwh3 20150831
		dsPanel.addRightItem(oCalBtn);
		dsPanel.addRightItem(oRefreshBtn);
		if(auth.refreshable)
			{
				var items = dsPanel.getRightItems();
				
					items[0].setVisible(true);
						items[1].setVisible(true);
			}
		else{
			var items = dsPanel.getRightItems();

				items[0].setVisible(false);
				items[1].setVisible(false);
		};
		if(auth.fullcalculationable)
		{
			var items = dsPanel.getRightItems();
				items[2].setVisible(true);
		}
		else{
			var items = dsPanel.getRightItems();
				items[2].setVisible(false);
		};
		if(auth.datarefreshable)
		{
			var items = dsPanel.getRightItems();
			
				items[3].setVisible(true);
		}
		else{
			var items = dsPanel.getRightItems();
		
				items[3].setVisible(false);
		};
		/******************************
		 * end by Chris Gao
		 *******************************/

		var oForm = filterPanel.getContent()[0];
		var ondemandDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Ondemand Type")[0];
		this.ondemandDropdownBox = ondemandDropdownBox;
		var modelTextfield = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Model")[0];
		this.modelTextfield = modelTextfield;
		var familyTextfield = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Family")[0];
		this.familyTextfield = familyTextfield;
		//toolbar		
		var oEditDeleteUploadDownload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table,app);
		
		if(auth.executable){
			var oToolbarCtn = oEditDeleteUploadDownload.getContent()[0];	
			var oExecuteBtn = new sap.ui.commons.Button({
				lite: true,
				icon: "sap-icon://begin",
				tooltip: "execute",
				press: function(oEvent) {
					that.execute(filterPanel);
				}
			}).addStyleClass("commontable-toolbar-btn");
			oToolbarCtn.insertContent(oExecuteBtn,0);
		}	

		//app
	    var page = new sap.m.Page({
	      	  showHeader: false,
	          content :[header,dsPanel, filterPanel, oEditDeleteUploadDownload, table]//[layout]                
	    });
        app.insertPage(page);
        app.setInitialPage(page);
        return app;	

	},

	onTreeNavigation: function(sChannel, sEvent, oData){
		if(oData.view === "Management Center") {
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
