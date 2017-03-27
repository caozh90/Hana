sap.ui.controller("ui.safestk.safestk", {
  
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf ui.safestk
*/   
	oDataModel: function(){
		return new sap.ui.model.odata.ODataModel('/aporeporting/odata/apo_reporting.xsodata');
	},
	
	onInit: function() {
		
		var oDataModel = this.oDataModel(),
		    oTb = sap.ui.getCore().byId('tb-safestk02');
		
		oTb.setModel(oDataModel);
		
		oDataModel.attachRequestCompleted(function(){
			  if(oTb.getBusy()){
				 oTb.setBusy(false);
			  }
			});		

	},
	
	confirmSelection: function(){
		
		var oTb  = sap.ui.getCore().byId('tb-safestk02'), 
		    //oInput = {LOCNO_FROM: 'vf-safestk-locno_from',
		//		  LOCNO_FROM2: 'vf-safestk-locno_from2',	
		//	          MATNR: 'vf-safestk-matnr',
		//	          MATNR2:'vf-safestk-matnr2',
		//	          LOCNO:'vf-safestk-locno'},
            aFilter = [];
        	//sBindingPath = sap.ui.controller("ui.safestk.safestk").getBindingContext();		
		//Object.keys(oInput).map(function(key){
		//	if(sap.ui.getCore().byId(oInput[key]).getValue()){
		//		aFilter.push(new sap.ui.model.Filter(key, sap.ui.model.FilterOperator.EQ, sap.ui.getCore().byId(oInput[key]).getValue()))
		//		if (sap.ui.getCore().byId(oInput[key] = 'LOCNO_FROM2' )) 
		//	}
		//});
		
		// to uppercase
		var arrInput = [sap.ui.getCore().byId("vf-safestk-locno_fr"),
		                sap.ui.getCore().byId("vf-safestk-locno_fr2"),
		                sap.ui.getCore().byId("vf-safestk-matnr"),
		                sap.ui.getCore().byId("vf-safestk-matnr2"),
		                sap.ui.getCore().byId("vf-safestk-locno_to"),
		                sap.ui.getCore().byId("vf-safestk-locno_to2"),
		                sap.ui.getCore().byId("vf-safestk-ekgrp"),
		                sap.ui.getCore().byId("vf-safestk-dispo"),
		                sap.ui.getCore().byId("vf-safestk-stawn")		                
		                ];
		
		arrInput.forEach(function(oInput){
			oInput.setValue(oInput.getValue().toUpperCase());
		});

		if (sap.ui.getCore().byId("vf-safestk-locno_fr").getValue())
			{
			if  (sap.ui.getCore().byId("vf-safestk-locno_fr2").getValue())
				{
					aFilter.push(new sap.ui.model.Filter("LOCNO_FROM", sap.ui.model.FilterOperator.BT, sap.ui.getCore().byId("vf-safestk-locno_fr").getValue(),sap.ui.getCore().byId("vf-safestk-locno_fr2").getValue()));
				}
			else
				{
					aFilter.push(new sap.ui.model.Filter("LOCNO_FROM", sap.ui.model.FilterOperator.EQ, sap.ui.getCore().byId("vf-safestk-locno_fr").getValue()));
				
				}
			} ;
		
			if (sap.ui.getCore().byId("vf-safestk-matnr").getValue())
			{
			if  (sap.ui.getCore().byId("vf-safestk-matnr2").getValue())
				{
					aFilter.push(new sap.ui.model.Filter("MATNR", sap.ui.model.FilterOperator.BT, sap.ui.getCore().byId("vf-safestk-matnr").getValue(),sap.ui.getCore().byId("vf-safestk-matnr2").getValue()));
				}
			else
				{
				aFilter.push(new sap.ui.model.Filter("MATNR", sap.ui.model.FilterOperator.EQ, sap.ui.getCore().byId("vf-safestk-matnr").getValue()));
				
				}
			} ;

			if (sap.ui.getCore().byId("vf-safestk-locno_to").getValue())
			{	if(sap.ui.getCore().byId("vf-safestk-locno_to2").getValue())
				{
				aFilter.push(new sap.ui.model.Filter("LOCNO_TO", sap.ui.model.FilterOperator.BT, sap.ui.getCore().byId("vf-safestk-locno_to").getValue(),sap.ui.getCore().byId("vf-safestk-locno_to2").getValue()))	;		
				}
			else	
				{
				aFilter.push(new sap.ui.model.Filter("LOCNO_TO", sap.ui.model.FilterOperator.EQ, sap.ui.getCore().byId("vf-safestk-locno_to").getValue()))	;		
				}
			}	;
			if(sap.ui.getCore().byId("vf-safestk-ekgrp").getValue())
				{
				aFilter.push(new sap.ui.model.Filter("EKGRP",sap.ui.model.FilterOperator.EQ,sap.ui.getCore().byId("vf-safestk-ekgrp").getValue()));
				};

			if(sap.ui.getCore().byId("vf-safestk-dispo").getValue())
			{
			aFilter.push(new sap.ui.model.Filter("DISPO",sap.ui.model.FilterOperator.EQ,sap.ui.getCore().byId("vf-safestk-dispo").getValue()));
			}			
			;
			if(sap.ui.getCore().byId("vf-safestk-stawn").getValue())
			{
			aFilter.push(new sap.ui.model.Filter("STAWN",sap.ui.model.FilterOperator.EQ,sap.ui.getCore().byId("vf-safestk-stawn").getValue()));
			};
			oTb.setBusy(true);
					setTimeout(function(){
						oTb.bindRows('/safestk02', null, null, aFilter);
						
						var iDataAmount = oTb.getBinding().getLength();
						oTb.getToolbar().getItems()[1].setText('Total Record: '+iDataAmount);
					}, 2000);
			
			
		//oTb.bindRows('/sup_comt02', null, null, aFilter);
	}

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf ui.safestk
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf ui.safestk
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf ui.safestk
*/
//	onExit: function() {
//
//	}

});