sap.ui.controller("ui.waterfall.waterfall", {

	oDataModel: function(){
		return new sap.ui.model.odata.ODataModel('/aporeporting/odata/apo_reporting.xsodata');
	},
	
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf ui.waterfall
*/
	onInit: function() {
		
		var oDataModel = this.oDataModel();
		
		var sel_time = sap.ui.getCore().byId('time_sel').getValue();
		
		var ww = sap.ui.getCore().getControl('tb-warterfall_weekly');		
		var mm = sap.ui.getCore().getControl('tb-warterfall_monthly');		
		var qq = sap.ui.getCore().getControl('tb-warterfall_quarterly');	
		
		
		if ( sel_time == 'Weekly') 
			{   
			ww.setVisible(true);
			mm.setVisible(false);
			qq.setVisible(false);				
			
			}
		
		if ( sel_time == 'Monthly') 
		{   
			ww.setVisible(false);
			mm.setVisible(true);
			qq.setVisible(false);			
		
		}
		
		if ( sel_time == 'Quarterly') 
		{   
		
			ww.setVisible(false);
			mm.setVisible(false);	
			qq.setVisible(true);
		}
			
		
		
		
	    var oTb1 = sap.ui.getCore().byId('tb-warterfall_weekly');
	    var oTb2 = sap.ui.getCore().byId('tb-warterfall_monthly');
	    var oTb3 = sap.ui.getCore().byId('tb-warterfall_quarterly');
	
	    oTb1.setModel(oDataModel);
	    oTb2.setModel(oDataModel);
	    oTb3.setModel(oDataModel);

		oDataModel.attachRequestCompleted(function(){
			  if(oTb1.getBusy()){
				 oTb1.setBusy(false);
			  }
			  if(oTb2.getBusy()){
					 oTb2.setBusy(false);
				  }
			  if(oTb3.getBusy()){
					 oTb3.setBusy(false);
				  }
			});
		
	},

	
	confirmSelection: function(){
		var sel_time = sap.ui.getCore().byId('time_sel').getValue();
		
		if ( sel_time == 'Weekly') 
			{
			 sap.ui.controller("ui.waterfall.waterfall").getWeekly();
//			 getWeekly();
			}
		
		if ( sel_time == 'Monthly') 
		{
			sap.ui.controller("ui.waterfall.waterfall").getMonthly();	
//			getMonthly();
		}
		
		if ( sel_time == 'Quarterly') 
		{
		 sap.ui.controller("ui.waterfall.waterfall").getQuarterly();
//		 getQuarterly();
		}
		
		
		
	},
	
	getBindingContext: function(){

		var sVersion = sap.ui.getCore().byId('vf-warterfall-version').getValue();
		
		var sel_time = sap.ui.getCore().byId('time_sel').getValue();
		
		if ( sel_time == 'Weekly') 
			{
			return sVersion ? '/VERSION_PARMAS(IV_VERSION=\''+ sVersion + '\')/Results' : false;
			}
	
		if ( sel_time == 'Monthly') 
		{
		return sVersion ? '/VERSION_PARMAS1(IV_VERSION=\''+ sVersion + '\')/Results' : false;
		}
		
		if ( sel_time == 'Quarterly') 
		{
		return sVersion ? '/VERSION_PARMAS2(IV_VERSION=\''+ sVersion + '\')/Results' : false;
		}
		
	},
	
	
	selectTimeDimension: function(oEvent){
		var sel_time = oEvent.oSource.getSelectedItemId();
		var ww = sap.ui.getCore().getControl('tb-warterfall_weekly');		
		var mm = sap.ui.getCore().getControl('tb-warterfall_monthly');		
		var qq = sap.ui.getCore().getControl('tb-warterfall_quarterly');	
		
		
		if ( sel_time == 'Weekly') 
			{   
			ww.setVisible(true);
			mm.setVisible(false);
			qq.setVisible(false);				
			
			}
		
		if ( sel_time == 'Monthly') 
		{   
			ww.setVisible(false);
			mm.setVisible(true);
			qq.setVisible(false);			
		
		}
		
		if ( sel_time == 'Quarterly') 
		{   
		
			ww.setVisible(false);
			mm.setVisible(false);	
			qq.setVisible(true);
		}
		
			
	},
	
    getWeekly: function(){
		var oTb1  = sap.ui.getCore().byId('tb-warterfall_weekly'), 
	    oInput = {
//		          VERSIOEX: 'vf-warterfall-version',
		          EXT_MATNR: 'vf-warterfall-material',
                  LOCNO: 'vf-waterfall-location'},
        aFilter = [],
        sBindingPath = sap.ui.controller("ui.waterfall.waterfall").getBindingContext();
		
		Object.keys(oInput).map(function(key){
			
			var oIp = sap.ui.getCore().byId(oInput[key]);
			
			oIp.setValue(oIp.getValue().toUpperCase());
			
//			if(oIp.getValue()){
//				aFilter.push(new sap.ui.model.Filter(key, sap.ui.model.FilterOperator.EQ, oIp.getValue()))
//			}
			// multiple filters
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

		if(sBindingPath && sap.ui.getCore().byId('vf-waterfall-location').getValue()){
			oTb1.setBusy(true);
			setTimeout(function(){
				oTb1.bindRows(sBindingPath, null, null, aFilter);
				
				var iDataAmount = oTb1.getBinding().getLength();
				oTb1.getToolbar().getItems()[1].setText('Total Record: '+iDataAmount);
			}, 2000);
		}else{
			alert('Planning Version and Location must not be empty!');
		}
		
//		sBindingPath ? oTb1.bindRows(sBindingPath, null, null, aFilter) : alert('Planning Version must not be empty!');
		
    }	,
	
    getMonthly:function()
    {
		var oTb2  = sap.ui.getCore().byId('tb-warterfall_monthly'), 
	    oInput = {
//		          VERSIOEX: 'vf-warterfall-version',
		          EXT_MATNR: 'vf-warterfall-material',
                  LOCNO: 'vf-waterfall-location'},
        aFilter = [],
        sBindingPath = sap.ui.controller("ui.waterfall.waterfall").getBindingContext();
		
		Object.keys(oInput).map(function(key){
			
			var oIp = sap.ui.getCore().byId(oInput[key]);
			
			oIp.setValue(oIp.getValue().toUpperCase());
			
//			if(oIp.getValue()){
//				aFilter.push(new sap.ui.model.Filter(key, sap.ui.model.FilterOperator.EQ, oIp.getValue()))
//			}
			
			// multiple filters
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
	
		if(sBindingPath && sap.ui.getCore().byId('vf-waterfall-location').getValue()){
			oTb2.setBusy(true);
			setTimeout(function(){
				oTb2.bindRows(sBindingPath, null, null, aFilter);
				
				var iDataAmount = oTb2.getBinding().getLength();
				oTb2.getToolbar().getItems()[1].setText('Total Record: '+iDataAmount);
			}, 2000);
		}else{
			alert('Planning Version and Location must not be empty!');
		}		
		
//		sBindingPath ? oTb2.bindRows(sBindingPath, null, null, aFilter) : alert('Planning Version must not be empty!');
     	
    },
    
    getQuarterly:function()
    {
    	
		var oTb3  = sap.ui.getCore().byId('tb-warterfall_quarterly'), 
	    oInput = {
//		          VERSIOEX: 'vf-warterfall-version',
		          EXT_MATNR: 'vf-warterfall-material',
                  LOCNO: 'vf-waterfall-location'},
        aFilter = [],
        sBindingPath = sap.ui.controller("ui.waterfall.waterfall").getBindingContext();
		
		Object.keys(oInput).map(function(key){
			
			var oIp = sap.ui.getCore().byId(oInput[key]);
			
			oIp.setValue(oIp.getValue().toUpperCase());
			
//			if(oIp.getValue()){
//				aFilter.push(new sap.ui.model.Filter(key, sap.ui.model.FilterOperator.EQ, oIp.getValue()))
//			}
			
			// multiple filters
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
		
		if(sBindingPath && sap.ui.getCore().byId('vf-waterfall-location').getValue()){
			oTb3.setBusy(true);
			setTimeout(function(){
				oTb3.bindRows(sBindingPath, null, null, aFilter);
				
				var iDataAmount = oTb3.getBinding().getLength();
				oTb3.getToolbar().getItems()[1].setText('Total Record: '+iDataAmount);
			}, 2000);
		}else{
			alert('Planning Version and Location must not be empty!');
		}	
		
//		sBindingPath ? oTb3.bindRows(sBindingPath, null, null, aFilter) : alert('Planning Version must not be empty!');
	 	
    	
    }
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf ui.waterfall
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf ui.waterfall 
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf ui.waterfall 
*/
//	onExit: function() {
//
//	}

});