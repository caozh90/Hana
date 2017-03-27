sap.ui.controller("ui.supcomt.supcomt", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf ui.supcomt
*/
	oDataModel: function(){
		return new sap.ui.model.odata.ODataModel('/aporeporting/odata/apo_reporting.xsodata');
	},
	
	onInit: function() {
		
		var oDataModel = this.oDataModel(),
		    oTb = sap.ui.getCore().byId('tb-supcomt02');
		
		oTb.setModel(oDataModel);
		
		oDataModel.attachRequestCompleted(function(){
			  if(oTb.getBusy()){
				 oTb.setBusy(false);
			  }
			});		

	},
	
	confirmSelection: function(){
		
		var oTb  = sap.ui.getCore().byId('tb-supcomt02'), 
		    //oInput = {LOCNO_FROM: 'vf-supcomt-locno_from',
		//		  LOCNO_FROM2: 'vf-supcomt-locno_from2',	
		//	          MATNR: 'vf-supcomt-matnr',
		//	          MATNR2:'vf-supcomt-matnr2',
		//	          LOCNO:'vf-supcomt-locno'},
            aFilter = [];
        	//sBindingPath = sap.ui.controller("ui.supcomt.supcomt").getBindingContext();		
		//Object.keys(oInput).map(function(key){
		//	if(sap.ui.getCore().byId(oInput[key]).getValue()){
		//		aFilter.push(new sap.ui.model.Filter(key, sap.ui.model.FilterOperator.EQ, sap.ui.getCore().byId(oInput[key]).getValue()))
		//		if (sap.ui.getCore().byId(oInput[key] = 'LOCNO_FROM2' )) 
		//	}
		//});
		
		// to uppercase
		var arrInput = [sap.ui.getCore().byId("vf-supcomt-locno_from"),
		                sap.ui.getCore().byId("vf-supcomt-locno_from2"),
		                sap.ui.getCore().byId("vf-supcomt-matnr"),
		                sap.ui.getCore().byId("vf-supcomt-matnr2"),
		                sap.ui.getCore().byId("vf-supcomt-locno")];
		
		arrInput.forEach(function(oInput){
			oInput.setValue(oInput.getValue().toUpperCase());
		});

		if (sap.ui.getCore().byId("vf-supcomt-locno_from").getValue())
			{
			if  (sap.ui.getCore().byId("vf-supcomt-locno_from2").getValue())
				{
					aFilter.push(new sap.ui.model.Filter("LOCNO_FROM", sap.ui.model.FilterOperator.BT, sap.ui.getCore().byId("vf-supcomt-locno_from").getValue(),sap.ui.getCore().byId("vf-supcomt-locno_from2").getValue()));
				}
			else
				{
					aFilter.push(new sap.ui.model.Filter("LOCNO_FROM", sap.ui.model.FilterOperator.EQ, sap.ui.getCore().byId("vf-supcomt-locno_from").getValue()));
				
				}
			} ;
		
			if (sap.ui.getCore().byId("vf-supcomt-matnr").getValue())
			{
			if  (sap.ui.getCore().byId("vf-supcomt-matnr2").getValue())
				{
					aFilter.push(new sap.ui.model.Filter("MATNR", sap.ui.model.FilterOperator.BT, sap.ui.getCore().byId("vf-supcomt-matnr").getValue(),sap.ui.getCore().byId("vf-supcomt-matnr2").getValue()));
				}
			else
				{
				aFilter.push(new sap.ui.model.Filter("MATNR", sap.ui.model.FilterOperator.EQ, sap.ui.getCore().byId("vf-supcomt-matnr").getValue()));
				
				}
			} ;

			if (sap.ui.getCore().byId("vf-supcomt-locno").getValue())
				{
				aFilter.push(new sap.ui.model.Filter("LOCNO", sap.ui.model.FilterOperator.EQ, sap.ui.getCore().byId("vf-supcomt-locno").getValue()))	;		
				};
				
			

					oTb.setBusy(true);
					setTimeout(function(){
						oTb.bindRows('/sup_comt02', null, null, aFilter);
						
						var iDataAmount = oTb.getBinding().getLength();
						oTb.getToolbar().getItems()[1].setText('Total Record: '+iDataAmount);
					}, 2000);
			
			
		//oTb.bindRows('/sup_comt02', null, null, aFilter);
	}

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf ui.supcomt
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf ui.supcomt
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf ui.supcomt
*/
//	onExit: function() {
//
//	}
	
	,
	getLastPersistSNC : function() {
	  var lastUpdate	
	  var oLabelModel = new sap.ui.model.odata.ODataModel('/aporeporting/odata/apo_reporting.xsodata');
	  oLabelModel.setDefaultCountMode('NONE');
	  	  
	  //var aFilter = new Array(); 
	  //aFilter.push(new sap.ui.model.Filter('NAME', sap.ui.model.FilterOperator.EQ, 'PLANNING_VERSION_001'));
	  
	  oLabelModel.read('/snc_last_sncsave', {async: false,  success: function(odata, response){
		  lastUpdate = odata.results[0];		
	  }});	
	  
	  if (lastUpdate['UPSTATUS'] == '00')
		  return 'Detail(Last Save in UTC ' + lastUpdate['CREATEDT'] + '):';
	  else
	  	  return 'Detail(Last Save in UTC ' + lastUpdate['CREATEDT'] + ', check save at'  + lastUpdate['UPDATEDT'] +  '):';
		//return "helloworldx.HelloWorld";
	}	
	

});