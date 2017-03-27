sap.ui.controller("ui.forecast.forecast", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf ui.forecast.forecast
*/
	
	oDataModel: function(){
		return new sap.ui.model.odata.ODataModel('/aporeporting/odata/apo_reporting.xsodata');
	},
	
	onInit: function() {
		
		var oDataModel = this.oDataModel(),
		    oTb = sap.ui.getCore().byId('tb-forecast');

		oTb.setModel(oDataModel);
		
		oDataModel.attachRequestCompleted(function(){
			  if(oTb.getBusy()){
				  oTb.setBusy(false);
			  }
			});
	},
	
	confirmSelection: function(){
		
		var oTb  = sap.ui.getCore().byId('tb-forecast'), 
		    oInput = {
//			          VERSIOD: 'vf-forecast-version',
			          EXT_MATNR: 'vf-forecast-item',
//			          MAKTX:'vf-forecast-description',
			          LOCNO_SUPPLIER: 'vf-forecast-supplier',
			          DISPO: 'vf-forecast-mrp-controller',
			          RAUBE: 'vf-forecast-storage-conditions',
			          LOCNO_PLANT: 'vf-forecast-plant'},
            aFilter = [],
            sBindingPath = sap.ui.controller("ui.forecast.forecast").getBindingContext();
            
		
		Object.keys(oInput).map(function(key){
			
			var oIp = sap.ui.getCore().byId(oInput[key]);
			
			oIp.setValue(oIp.getValue().toUpperCase());
			
//			if(oIp.getValue()){
//				aFilter.push(new sap.ui.model.Filter(key, sap.ui.model.FilterOperator.EQ, oIp.getValue()));
//			}
			// multiple filter
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
		
		var aSort = [new sap.ui.model.Sorter('EXT_MATNR'), new sap.ui.model.Sorter('LOCNO_PLANT'), new sap.ui.model.Sorter('SORD_ID')];
		
		if(sBindingPath && sap.ui.getCore().byId('vf-forecast-plant').getValue()){
			oTb.setBusy(true);
			setTimeout(function(){
				oTb.bindRows(sBindingPath, null, aSort, aFilter);
				
				var iDataAmount = oTb.getBinding().getLength();
				oTb.getToolbar().getItems()[1].setText('Total Record: '+iDataAmount);
			}, 2000);
		}else{
			alert('Planning Version and Plant must not be empty!');
		}		
		
//		sBindingPath ? oTb.bindRows(sBindingPath, null, null, aFilter) : alert('Planning Version must not be empty!');
	},
	
	getBindingContext: function(){
		var sVersion = sap.ui.getCore().byId('vf-forecast-version').getValue();
		return sVersion ? '/snc_forecast_params(IV_PLAN_VER=\''+ sVersion + '\')/Results' : false;
	}

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf ui.forecast.forecast
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf ui.forecast.forecast
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf ui.forecast.forecast
*/
//	onExit: function() {
//
//	}

});