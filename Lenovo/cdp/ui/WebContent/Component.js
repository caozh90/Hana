jQuery.sap.require("lenovo.MyRouter");
jQuery.sap.require("lenovo.control.Route");
jQuery.sap.require("lenovo.service.Common");

sap.ui.core.UIComponent.extend("lenovo.Component", {
	metadata: {
		name: "Lenovo",
		version: "1.0.0",
		dependencies: {
			libs: [],
			components: []
		},
		config: {
			modules: [{
				name:"sap.ui.thirdparty.pace",
				path:"lib/pace/pace"
			},{
				name: "sap.ui.thirdparty.shim",
				path: "lib/xlsx/shim"
			},{
				name: "sap.ui.thirdparty.jszip",
				path: "lib/xlsx/jszip"
			},{
				name: "sap.ui.thirdparty.xlsx",
				path: "lib/xlsx/xlsx"
			},{
				name: "sap.ui.thirdparty.ods",
				path: "lib/xlsx/ods"	
			},{
				name: "sap.ui.thirdparty.papaparse",
				path: "lib/xlsx/papaparse"	
			},{
				name: "sap.ui.thirdparty.toxlsx.jszip",
				path: "lib/toxlsx/jszip"
			},{
				name: "sap.ui.thirdparty.toxlsx.xlsx",
				path: "lib/toxlsx/xlsx"
			},{
				name: "sap.ui.thirdparty.toxlsx.Blob",
				path: "lib/toxlsx/Blob"
			},{
				name: "sap.ui.thirdparty.toxlsx.FileSaver",
				path: "lib/toxlsx/FileSaver"
			}],
			moduleBundle: "./config/module/",
		},
		routing: {
			config : {
				routerClass: lenovo.MyRouter,
				targetControl: "oVmi",
				targetAggregation: "secondPaneContent",
				clearTarget: true
			},
			routes: []
		}
	},
	init: function() {
		var oConfig = this.getMetadata().getConfig();
		var modulePath = oConfig["moduleBundle"] + jQuery.sap.getUriParameters().get("m") + ".properties";
		var oModel_module = new sap.ui.model.resource.ResourceModel({
			bundleUrl:  modulePath,
			bundleLocale: "base"/*jQuery.sap.getUriParameters().get("local")*/
		});
		sap.ui.getCore().setModel(oModel_module, "module");
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);	
		this._configRoute();
		this.registerModule();	
		this.pace();
		// this.setCsrfToken();  
	},
	createContent: function() {
		/*$.ajaxSetup({
		    complete: function(xhr,textStatus) {
		    	console.log("component complete");
		         var loginPage = xhr.getResponseHeader("x-sap-login-page");
		         if (loginPage) {
		             location.href = loginPage + "?x-sap-origin-location=" + encodeURIComponent(window.location.pathname);
		         }
		     }
	  	});*/
		/*
	  	$(document).ajaxStop(function(xhr,textStatus) {
	  		console.log("component ajaxStop ");
		 	var loginPage = xhr.getResponseHeader("x-sap-login-page");
	        if (loginPage) {
	            location.href = loginPage + "?x-sap-origin-location=" + encodeURIComponent(window.location.pathname);
	        }
		});*/
		return sap.ui.view({
			viewName: "lenovo.view.common.app",
			type: sap.ui.core.mvc.ViewType.JS
		});
	},

	setCsrfToken: function(){
		var service = new lenovo.service.Common();
		service.getCsrfToken().done($.proxy(function(data, textStatus, request){      	
        	var oModel_token = new sap.ui.model.json.JSONModel();
			oModel_token.setData({
				token: request.getResponseHeader("x-csrf-token")
			});
			sap.ui.getCore().setModel(oModel_token, "token");
        }, this));
	},
	registerModule: function() {
		var config = this.getMetadata().getConfig();
		var modules = config["modules"];
		
		for (var i = 0; i < modules.length; i++) {
			var name = modules[i].name;
			var path = modules[i].path;
			jQuery.sap.registerModulePath(name, path);
		}
	},
	onAfterRendering: function() {
		Pace.start();	
		var checkSessionInterval = 1000*1200 + 10000;
		setInterval(function(){
			var service = new lenovo.service.Common();
			service.checkSessionRelogin()
		}, checkSessionInterval);
	},
	pace: function() {
		jQuery.sap.require("sap.ui.thirdparty.pace");
		jQuery.sap.includeStyleSheet("lib/pace/themes/pace-theme-minimal.css", "vmi-pace");
	},
	_configRoute: function() {
		var that = this;
		var viewArr = [];
		var module;
		var service = new lenovo.service.Common();
		service.mapModuleUser().done($.proxy(function(data){
			module = data["d"]["results"];					
		}, this));	
		$.getJSON(service.getUserInfo() + "/MAP_VIEWROLE?$filter=MAP_TYPE eq 'view'&$format=json", function(resp){
			
			console.log("viewArr" + viewArr);
			if (module.length === 0) {
				sap.ui.commons.MessageBox.show("You have no authorization of any module, please contact Admin", "ERROR", "Authorization Error");					
			}else{
				resp["d"]["results"].forEach(function(data){
					viewArr.push(data["VIEW_NAME"]);
				});
			}	
			service.getNavigation().done($.proxy(function(data) {
				that._filterViews(data.nodes, viewArr);
				that._filterViews(data.nodes, viewArr);
				lenovo.control.Route.getNodesRoute(data.nodes);
				new sap.ui.core.routing.Route(that.getRouter(), {
					pattern: "",
					clearTarget: true,
					name: "navigation",
					view: "navigation",
					viewPath: "lenovo.view.common",
					viewType: sap.ui.core.mvc.ViewType.JS,
					targetAggregation: "firstPaneContent",
					targetControl: "oVmi",
					subroutes: lenovo.control.Route.subRoutes
				});
				that.getRouter().initialize();
				var oEventBus = sap.ui.getCore().getEventBus();
	            oEventBus.publish("RouteData", "Ready", { data : data });         	
			}, that));
		});
	},
	_filterViews: function(nodes, arr){
		var l = nodes.length;
		while(l--){
			var node = nodes[l];
			if($.inArray(node.path, arr) == "-1" && (node.nodes==undefined?!node.nodes:!node.nodes.length)){
				nodes.splice(l, 1);				
				continue;
			}
			if(node.nodes){
				this._filterViews(node.nodes, arr);
			}
		}
	}
});

