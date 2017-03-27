jQuery.sap.require("lenovo.control.Util");
sap.ui.core.Component.extend("lenovo.service.Common",{	
	init: function(){
		var oModelModule = sap.ui.getCore().getModel("module");
		this.sServiceUrl = oModelModule.getProperty("SERVICE");
		this.module = oModelModule.getProperty("MODULE");
	},
	
	getNavigation: function(){
		switch (this.module){
			case "VMI":
				return $.getJSON("config/route/vmi.json");
				break;
			case "CFE":
				return $.getJSON("config/route/cfe.json");
				break;
			case "PCDW":
				return $.getJSON("config/route/pcdw.json");
				break;
			case "SZEBGVMI"://ADDED BY CHENWH3 20150731
				return $.getJSON("config/route/szvmi.json");
				break;
			case "LCPE"://ADDED BY CHENWH3 20150731
				return $.getJSON("config/route/lcpe.json");
				break;
			case "EBGDF"://ADDED BY BIANZH1 20150812
				return $.getJSON("config/route/ebgdf.json");
				break;
		}
	},

	getCsrfToken: function(){
		return $.ajax({
			url: "/sap/hana/xs/ide/editor/server/csrf.xsjs",
			type: "get",
			headers: {
				"X-CSRF-Token": "Fetch"
			}
		});
		/*return $.get("/sap/hana/xs/ide/editor/server/csrf.xsjs", {headers: {
			"X-CSRF-Token": "Fetch"
		}});*/
	},

	getSession: function(){
		return 	$.ajax({
			url: "/cdp/security/services/userInfo.xsodata/DATA_SESSIONCONTEXT?$format=json",
			type:"get",
			async: false,
			cache :true,
			dataType: "JSON",
			traditional: true,	
		});
	},

	mapModuleUser: function(){
		var name = localStorage.USERNAME;
		return 	$.ajax({
			url: "/cdp/security/services/userInfo.xsodata/MAP_MODULEUSER?$format=json&$filter=(NAME eq '" + name + "')",
			type:"get",
			async: false,
			cache :true,
			dataType: "JSON",
			traditional: true,	
		});
	},

	removeUserFromGroup: function(data){
		/*
		* group_id
		*user_id
		*/
		return 	$.ajax({
			url:  this.sServiceUrl+"/remove_usergroup.xsjs",
			type:"post",
			data: JSON.stringify(data),
			cache :true,
			dataType: "JSON",
			traditional: true,
			/*headers: {
				"X-CSRF-Token": this.token
			}*/
		});
	},

	getUserRoleTree: function(data){
		return 	$.ajax({
			url:  this.sServiceUrl+"/getMapallRoleNotin.xsjs",
			type:"get",
			data: data,
			cache :true,
			dataType: "JSON",
			traditional: true,
			/*headers: {
				"X-CSRF-Token": this.token
			}*/
		});
	},

	getUserInfo: function(){
		return this.sServiceUrl + "/userInfo.xsodata";
	},
	
	getAdminRole: function(){
		return this.sServiceUrl + "/setUserAdministrator.xsjs";
	},

	checkSession: function(){
		var a;
		$.ajax({
			url: "/sap/hana/xs/formLogin/checkSession.xsjs",
			type:"get",
			async: false,
			dataType: "JSON",
			success: function(resp){
				a = resp.login;
			}
		});
		return a;
	},
	checkSessionRelogin: function(){
		var isSessionNotExpired = this.checkSession();
		if(!isSessionNotExpired) {
			lenovo.control.Util.sessionTimeout();
		}
		
	}
});