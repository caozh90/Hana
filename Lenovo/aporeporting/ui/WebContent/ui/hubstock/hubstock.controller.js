sap.ui.controller("ui.hubstock.hubstock", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf ui.hubstock
*/
	oDataModel: function(){
		return new sap.ui.model.odata.ODataModel('/aporeporting/odata/apo_reporting.xsodata');
	},
	
	onInit: function() {
		
		var oDataModel = this.oDataModel(),
		    oTb = sap.ui.getCore().byId('tb-hubstock');
		
		oTb.setModel(oDataModel);
		
		oDataModel.attachRequestCompleted(function(){
		  if(oTb.getBusy()){
			 oTb.setBusy(false);
		  }
		});
	},
	
	confirmSelection: function(){
		
		var oTb  = sap.ui.getCore().byId('tb-hubstock'), 
		    oInput = {
			          Location: 'vf-hubstock-location',
			          ProductFamily:'vf-hubstock-family',
			          ProductNumber: 'vf-hubstock-product-number',
			          DISPO: 'vf-hubstock-dispo',
			          MaterialType: 'vf-hubstock-material-type',
			          MaterialGroup: 'vf-hubstock-material-group'},
            aFilter = [],
            sBindingPath = sap.ui.controller("ui.hubstock.hubstock").getBindingContext();
		
		Object.keys(oInput).map(function(key){
			
			var oIp = sap.ui.getCore().byId(oInput[key]);
			
			oIp.setValue(oIp.getValue().toUpperCase());

			if(oIp.getValue()){
				if(oIp.getValue().indexOf(',') === -1){
					aFilter.push(new sap.ui.model.Filter(key, sap.ui.model.FilterOperator.EQ, oIp.getValue()));
				}else{
					// multiple filters, logical relation OR
					var aIp = oIp.getValue().split(',');
					var aIpFilter = aIp.map(function(oIpValue){
						return new sap.ui.model.Filter(key, sap.ui.model.FilterOperator.EQ, oIpValue);
					});
					aFilter.push(new sap.ui.model.Filter(aIpFilter, false));
				}
			}
		});
		
		aFilter = new sap.ui.model.Filter(aFilter, true);
		
		if(sBindingPath && sap.ui.getCore().byId('vf-hubstock-location').getValue()){
			oTb.setBusy(true);
			setTimeout(function(){
				oTb.bindRows(sBindingPath, null, null, aFilter);
				
				var iDataAmount = oTb.getBinding().getLength();
				oTb.getToolbar().getItems()[1].setText('Total Record: '+iDataAmount);
			}, 2000);
		}else{
			alert('Planning Version and Location must not be empty!');
		}
	},
	
	getBindingContext: function(){
		var sVersion = sap.ui.getCore().byId('vf-hubstock-version').getValue();
		return sVersion ? '/hub_stock_params(IP_PlanningVersion=\''+ sVersion + '\')/Results' : false;
	}

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf ui.hubstock
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf ui.hubstock
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf ui.hubstock
*/
//	onExit: function() {
//
//	}

});