sap.ui.controller("ui.demd_open.demd_open", {
  
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf ui.demd_open
*/
	oDataModel: function(){
		return new sap.ui.model.odata.ODataModel('/aporeporting/odata/apo_reporting.xsodata');
	},
	
	onInit: function() {
		
		var oDataModel = this.oDataModel(),
		    oTb = sap.ui.getCore().byId('tb-demd_open02');
		
		oTb.setModel(oDataModel);
		
		oDataModel.attachRequestCompleted(function(){
			  if(oTb.getBusy()){
				 oTb.setBusy(false);
			  }
			});		

	},
	
	confirmSelection: function(){
		
		var oTb  = sap.ui.getCore().byId('tb-demd_open02'), 
		    //oInput = {LOCNO_FROM: 'vf-demd_open-locno_from',
		//		  LOCNO_FROM2: 'vf-demd_open-locno_from2',	
		//	          MATNR: 'vf-demd_open-matnr',
		//	          MATNR2:'vf-demd_open-matnr2',
		//	          LOCNO:'vf-demd_open-locno'},
            aFilter = [];
		    
        	sBindingPath = sap.ui.controller("ui.demd_open.demd_open").getBindingContext();		
        	sHubType = sap.ui.getCore().byId("db-demd_open-stocktype1").getValue();
		//Object.keys(oInput).map(function(key){
		//	if(sap.ui.getCore().byId(oInput[key]).getValue()){
		//		aFilter.push(new sap.ui.model.Filter(key, sap.ui.model.FilterOperator.EQ, sap.ui.getCore().byId(oInput[key]).getValue()))
		//		if (sap.ui.getCore().byId(oInput[key] = 'LOCNO_FROM2' )) 
		//	}
		//});
		
		// to uppercase
		var oInput = {	                
		                MATNR:'vf-demd_open-matnr',
		                DISPO: 'vf-demd_open-dispo',
		                LOCNO_PLT:'vf-demd_open-locno'};




		
			//var sStype = sap.ui.getCore().byId("db-demd_open-stocktype1").getValue();
			
			if (sHubType == 'Hub Part')
				{aFilter.push(new sap.ui.model.Filter("KZKRI", sap.ui.model.FilterOperator.EQ, 'X'));}
			else if (sHubType == 'None Hub Part')
				{aFilter.push(new sap.ui.model.Filter("KZKRI", sap.ui.model.FilterOperator.EQ, ''));}
			;

			
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
								
			
				if(sBindingPath && sap.ui.getCore().byId('vf-demd_open-locno').getValue())
				{   oTb.setBusy(true);
					setTimeout(function(){
						oTb.bindRows(sBindingPath, null, null, aFilter);
						
						var iDataAmount = oTb.getBinding().getLength();
						oTb.getToolbar().getItems()[1].setText('Total Record: '+iDataAmount);
					}, 2000);
				}
				else
					{alert('Planning Version and Plant must not be empty!');}
			
			
		//oTb.bindRows('/demd_open02', null, null, aFilter);
	}
	,
	
	getBindingContext: function(){
		var sVersion = sap.ui.getCore().byId('vf-demd_open-plan_ver').getValue();
		
		return sVersion ? '/demd_open_param(IP_VER=\''+ sVersion + '\')/Results' : false;
	}	

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf ui.demd_open
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf ui.demd_open
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf ui.demd_open
*/
//	onExit: function() {
//
//	}

});