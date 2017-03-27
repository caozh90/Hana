sap.ui.controller("ui.hubstock_proc.hubstock_proc", {

  
	
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf ui.hubstock
*/
	oDataModel: function(){
		return new sap.ui.model.odata.ODataModel('/aporeporting/odata/apo_reporting.xsodata');
	},
	
	onInit: function() {
		
		sap.ui.getCore().getControl('vf-hubstock_proc-group-id').setVisible(false);		
		 
		var oDataModel = this.oDataModel(),
		    oTb = sap.ui.getCore().byId('tb-hubstock_proc');
		
		oTb.setModel(oDataModel);
		
		oDataModel.attachRequestCompleted(function(){
		  if(oTb.getBusy()){
			 oTb.setBusy(false);
		  }
		});
		
		
		  //==== To fill default planning version ========
/*		  var oLabelModel = new sap.ui.model.odata.ODataModel('/aporeporting/odata/apo_reporting.xsodata');
		      oLabelModel.setDefaultCountMode('NONE');
		  var version;
		  
		  var aFilter = new Array(); 
		  aFilter.push(new sap.ui.model.Filter('NAME', sap.ui.model.FilterOperator.EQ, 'PLANNING_VERSION_001'));
		  
		  oLabelModel.read('/cust_plan_ver', {async: false, filters: aFilter, success: function(odata, response){
			  version = odata.results[0];
		  }});	*/	
	},
	
	confirmSelection: function(){
		
//------------------get procurment ID by product number --------------
		var smtm = sap.ui.getCore().byId('vf-hubstock_proc-product-number').getValue().split(',') ;
		aFilter_grp = [] ;
		
		var aIpFilter_grp = smtm.map(function(oIpValue){
			return new sap.ui.model.Filter('MATNR', sap.ui.model.FilterOperator.EQ, oIpValue);});
			
		aFilter_grp.push(new sap.ui.model.Filter(aIpFilter_grp, false));
		
		var oDataModel_group = new sap.ui.model.odata.ODataModel('/aporeporting/odata/apo_reporting.xsodata');
		    oDataModel_group.setDefaultCountMode('NONE');
		    oDataModel_group.read('/proc_hub_stock_group', {async: false, filters: aFilter_grp , success: function(odata, response){
				  group = odata.results;
			  }});				
		
		    var group_id 
		    group.forEach(function(e){  
		      if (group_id !=  undefined )
		    	{ group_id = e.GRPID + ',' + group_id ;  }
		      else 
		    	 { group_id = e.GRPID ; }
		    })  
		    
		    sap.ui.getCore().byId('vf-hubstock_proc-group-id').setValue(group_id);
		 
		    if (group_id == undefined && smtm[0] != '' )
		    	{
		    	sap.ui.getCore().byId('vf-hubstock_proc-group-id').setValue('000');
		    	} ;
		    	
		  
//--------------------------------------------------------------------		
		
		var oTb  = sap.ui.getCore().byId('tb-hubstock_proc'), 
		    oInput = {
			          GRPID: 'vf-hubstock_proc-group-id' , 
			          DISPO_1: 'vf-hubstock_proc-dispo_1',
			          LOCNO: 'vf-hubstock_proc-location' 
			        	  },
            aFilter = [],
            sBindingPath = sap.ui.controller("ui.hubstock_proc.hubstock_proc").getBindingContext();
		
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
		
		if(sBindingPath && sap.ui.getCore().byId('vf-hubstock_proc-location').getValue()){
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
		var sVersion = sap.ui.getCore().byId('vf-hubstock_proc-version').getValue();
		return sVersion ? '/hubstock_proc_version(IV_VERSION=\''+ sVersion + '\')/Results' : false;
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