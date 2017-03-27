//Created by Zhang Ruixue at 2014-11-26
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
sap.ui.jsview("lenovo.view.cfe.controlPoint.costBake", {
	loadInitialData: function(){
		var obj = {};
		$.ajax({	
			url: this.oServiceUrl + "/CFE_COST_BAKE_DDL?$filter=ITEM_TYPE eq 'CYCLE_NAME'&$format=json",
			type: "GET",
			async: false,
			success: function(data){
				obj.cycleName = data && data.d && data.d.results && data.d.results[0] && data.d.results[0].ITEM_VALUE || "";
			}
		});
		$.ajax({	
			url: this.oServiceUrl + "/CFE_COST_BAKE_DDL?$filter=ITEM_TYPE eq 'CYCLE_TYPE'&$format=json",
			type: "GET",
			async: false,
			success: function(data){
				obj.cycleType = data && data.d && data.d.results && data.d.results[0] && data.d.results[0].ITEM_VALUE || "";
			}
		});
		$.ajax({	
			url: this.oServiceUrl + "/CFE_COST_BAKE_DDL?$filter=ITEM_TYPE eq 'CONTROL_POINT_STATUS'&$format=json",
			type: "GET",
			async: false,
			success: function(data){
				obj.costBakeBakeStatus = data && data.d && data.d.results && data.d.results[0] && data.d.results[0].ITEM_VALUE || "";
			}
		});
		return obj;
	},
	execute: function(){ 
		var oBakeStatus = sap.ui.getCore().byId("costBakeBakeStatus");
		var bakeStatus = oBakeStatus.getValue();
		var that = this;	
		this.oForm.setBusy(true);
		$.ajax({
			url:"/cdp/ebgcfe/service/logic/ui_cost_bake.xsjs",
			type: "GET",
			datatype: "text",
			success: function(status){
				that.oForm.setBusy(false);
				lenovo.control.commontable.Toolkit.showErrorMsg("Successfully run PKG_BAKE", "SUCCESS", "Execute");
				oBakeStatus.setValue(status);
			},
			error: function(err){
				that.oForm.setBusy(false);
				if(!(typeof err === "string"))
					err = JSON.stringify(err);
				lenovo.control.commontable.Toolkit.showErrorMsg(err, "ERROR", "Execute");
			}
		});		
	},
	createForm: function(){
		var oLayout = new sap.ui.layout.form.ResponsiveGridLayout({
				labelSpanL: 3,
				labelSpanM: 3,
				labelSpanS: 3,
				emptySpanL: 1,
				columnsL: 2,
				columnsM: 2,
				columnsS: 2
			});
		var oForm = new sap.ui.layout.form.Form({
			layout: oLayout,
		});	
		var data = this.loadInitialData();
		var oFormContainer = this.createFormContainer("Cycle", "CURRENT", "Cycle");
		oForm.addFormContainer(oFormContainer);
		oFormContainer = this.createFormContainer("Cycle Name", data.cycleName, "CycleName");
		oForm.addFormContainer(oFormContainer);
		oFormContainer = this.createFormContainer("Cycle Type", data.cycleType, "CycleType");
		oForm.addFormContainer(oFormContainer);
		oFormContainer = this.createFormContainer("Bake Status", data.costBakeBakeStatus, "BakeStatus");
		oForm.addFormContainer(oFormContainer);
		this.oForm = oForm;
		return oForm;
	},
	createFormContainer: function(label, value, id){
		var oTextField = new sap.ui.commons.TextField({
			id: "costBake" + id,
			value: value,
			enabled: false
		}).addStyleClass("costbake-textfield");
		var oFormElement = new sap.ui.layout.form.FormElement({
			label: label,
			fields: [oTextField]
		});
		var oFormContainer = new sap.ui.layout.form.FormContainer();
		oFormContainer.addFormElement(oFormElement);
		return oFormContainer;
	}, 
	onTreeNavigation: function(sChannel, sEvent, oData){
		if(oData.view === "Cost Bake") {
			if(this.oForm) {
				this.oForm.setBusy(true);
				var data = this.loadInitialData();
				var cycleNameFormElment = lenovo.control.commontable.Toolkit.getFormElementByLabel(this.oForm, "Cycle Name")[0];
				var cycleTypeFormElement = lenovo.control.commontable.Toolkit.getFormElementByLabel(this.oForm, "Cycle Type")[0];
				var bakeStatusFormElement = lenovo.control.commontable.Toolkit.getFormElementByLabel(this.oForm, "Bake Status")[0];
				cycleNameFormElment.setValue(data.cycleName);
				cycleTypeFormElement.setValue(data.cycleType);
				bakeStatusFormElement.setValue(data.costBakeBakeStatus);
				this.oForm.setBusy(false);
			}
		}
	},
	createContent: function(){
		sap.ui.getCore().getEventBus().subscribe("TreeNavigation", "Ready", this.onTreeNavigation, this);
		var app = new sap.m.App(); 
		var service = new lenovo.service.CFE();
		var oServiceUrl = service.getEBGCfe();
		this.oServiceUrl = oServiceUrl;
		var header = lenovo.control.commontable.Table.createHeader("Control Point", "Cost Bake");	
		var that = this;	
		var oForm = this.createForm();
		this.oForm = oForm;
		var layout = new sap.ui.layout.HorizontalLayout().addStyleClass("lenovotable-toolbar");
		var oExecuteBtn = new sap.ui.commons.Button({
			lite: true,
			icon: "sap-icon://begin",
			tooltip: "execute",
			press: function(oEvent) {
				that.execute(oForm);
			}
		}).addStyleClass("commontable-toolbar-btn");
		layout.addContent(oExecuteBtn);
		//app
	    var page = new sap.m.Page({
	      	  showHeader: false,
	          content :[header, layout, oForm]                
	    });
        app.insertPage(page);
        app.setInitialPage(page); 
        return app;	
	}
});