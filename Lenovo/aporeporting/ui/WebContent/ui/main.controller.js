sap.ui.controller("ui.main", {
	   
//	NAMING RULE:
//	1. Navigation item key and sub item ID should not contain '-'
//	2. Navigation item key should be the same as corresponding view name
	oNavItems: {
		snp: {
			text: 'SNP',
			subItems : [
			            {id: 'hubstock',
			             text: 'HUB Stock And Inventory Report',
			             privilege: 'aporeporting::snphubstock'},
			           
				        {id: 'forecast',
				         text: 'Forecast Report',
				         privilege: 'aporeporting::snpforecast'},
				         
				        {id: 'waterfall',
			             text: 'Waterfall Report',
			             privilege: 'aporeporting::snpwaterfall'},
			             
			            {id: 'pegging',
				         text: 'Forecast Pegging Report', // with GEO Level
				         privilege: 'aporeporting::snppegging'} ,
			             

				         {id: 'hubstock_proc',
						         text: 'HUB Stock with Alternates ',
						         privilege: 'aporeporting::snphubstock_proc'}			             
			             ,
				        {id: 'demd_open',
					         text: 'Stock Demand/Open Order',
					         privilege: 'aporeporting::snpdemd_open'
					    },
					    //add by cuiyue 20160908 rq-mp-04 begin
					    {id: 'ondemand',
					         text: 'On Demand',
					         privilege: 'aporeporting::snpondemand'
					    }
					  //add by cuiyue 20160908 rq-mp-04 end
		            ] 
			            
			            


		},
		
		snc: {
			text: 'SNC',
			subItems: [
			           {id: 'supcomt',
				             text: 'Supplier commitment status',
				             privilege: 'aporeporting::sncsupcomt'},

					    {id: 'safestk',
					     text: 'Safety Stock List',
					     privilege: 'aporeporting::sncsafestk'
					    } 
				             
				             
			           ]
		}
	},
	
	oViewBuffer: {},

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf xs_ui5.main
*/
	onInit: function() {

//		Navigation items
		
		var oShell = sap.ui.getCore().byId('root-shell'),
		    navItems = sapui5.checkUserPrivilege(this.oNavItems), //this.oNavItems,
		    self = this;
		
		Object.keys(navItems).forEach(function(strNavItemKey){
			oShell.addWorksetItem(
				new sap.ui.ux3.NavigationItem('nav-'+strNavItemKey, {
					text: navItems[strNavItemKey].text,
					subItems: navItems[strNavItemKey].subItems.map(function(subItem){
						return new sap.ui.ux3.NavigationItem('nav-'+strNavItemKey+'-'+ subItem.id, {
							text : subItem.text
						});
					})	
				}));
		});
		
		// by default
		oShell.setContent(this.getView(navItems[Object.keys(navItems)[0]].subItems[0].id));     // default shell content: first nav item -> first nav sub item
		
		// by url change
		if(!location.hash){
			location.hash = 'nav-'+ Object.keys(navItems)[0] + '-' + navItems[Object.keys(navItems)[0]].subItems[0].id;  //if no hash, initialize hash for first view
		}else{
			oShell.setSelectedWorksetItem(location.hash.replace('#', ''));    		//otherwise, set selected workset item according to hash
			oShell.setContent(self.getView(location.hash.split('-')[2]));	//set shell content according to hash
		}
		
		// by click
		oShell.attachWorksetItemSelected(function(evt){
			oShell.setContent(self.getView(evt.getParameter('id').split('-')[2]));
			window.location.hash = evt.getParameter('id');
		});
	},
	
	getView: function(viewId){
		
		var oView;
		
		viewId = viewId || 'undefined';
		
		if(this.oViewBuffer[viewId]){
			oView = this.oViewBuffer[viewId];
		}else{
			oView = sap.ui.view(viewId, {
				viewName: 'ui.'+viewId+'.'+viewId,
				type: sap.ui.core.mvc.ViewType.JS
			});
			this.oViewBuffer[viewId] = oView;
		}

		return oView;
	},
	
	logout: function(){
		var sUrl = "/sap/hana/xs/formLogin/token.xsjs";
		$.ajax({
			url: sUrl,
			type: 'GET',
			beforeSend : function(jqXHR) {
				jqXHR.setRequestHeader('X-CSRF-Token', 'Fetch');
			},
			success: function(arg1, arg2, jqXHR){
				var sUrl = "/sap/hana/xs/formLogin/logout.xscfunc";
				$.ajax({
					url: sUrl,
					type: 'POST',
					beforeSend : function(jqXHR1, settings) {
						jqXHR1.setRequestHeader('X-CSRF-Token', jqXHR.getResponseHeader('X-CSRF-Token'));
					},
					success: function(){
						location.hash = '';
						location.reload();
					},
					error: function(){
						Alert('Log out error!');
					} 
				});
				
			},
			error: function(){

			} 
		});
	}
	
//	pwchange: function(){
//		var sUrl = "/sap/hana/xs/formLogin/token.xsjs",
//		    self = this;
//		$.ajax({
//			url: sUrl,
//			type: 'GET',
//			beforeSend : function(jqXHR) {
//				jqXHR.setRequestHeader('X-CSRF-Token', 'Fetch');
//			},
//			success: function(arg1, arg2, jqXHR){
//				
//				window.location.href = '/sap/hana/xs/selfService/user/setPassword.html?token='+jqXHR.getResponseHeader('X-CSRF-Token');
//
//			},
//			error: function(){
//
//			} 
//		});
//	}

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf xs_ui5.main
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf xs_ui5.main
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf xs_ui5.main
*/
//	onExit: function() {
//
//	}

});