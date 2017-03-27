sap.ui.jsview("lenovo.view.common.app", {
	
	init: function() {
		jQuery.sap.includeStyleSheet("resource/main.css","vmi-style");
		jQuery.sap.includeStyleSheet("resource/table.css", "vmi-style2");
		jQuery.sap.includeStyleSheet("resource/view.css","vmi-style1");
	},
	getControllerName : function() {
		return "lenovo.view.common.app";
	},
	createContent : function(oController) {
		var _this = this;
		var service = new lenovo.service.Common();
		service.getSession().done($.proxy(function(data){
			if(data["d"]["results"].length !== 0){
				/*localStorage.NAME = data["d"]["results"][0]["LOGINNAME"];
				localStorage.USERNAME = data["d"]["results"][0]["USER_NAME"];
				localStorage.MODULE_NAME = data["d"]["results"][0]["MODULE_NAME"];*/
				localStorage.MODULE_NAME = jQuery.sap.getUriParameters().get("m");//change by bianzh1 20150825
				if(jQuery.sap.getUriParameters().get("m") == null){
					location.href = location.href.split("index")[0] + "index.html?m=" + data["d"]["results"][0]["MODULE_NAME"];
				}
			}else{
				oController.onOpenDialog();
			}
		}, _this));
		var oModelModule = sap.ui.getCore().getModel("module");
		var oShell = new sap.ui.ux3.Shell("oShell", {
			appIcon: "resource/img/Lenovo_Logo.png",
			showLogoutButton: false,
			showTools: false,
			showSearchTool: false,
			headerType:sap.ui.ux3.ShellHeaderType.SlimNavigation , 
			showFeederTool: false,
			showPane: false,			
			headerItems: [new sap.ui.core.HTML({content: "<span style='color: #a7a7a7'>Welcome to </span>"}),
						new sap.ui.commons.Link({
							text: oModelModule.getProperty("NAME"),
							press: $.proxy(oController.onOpenDialog, oController)
						}),
						new sap.ui.commons.MenuButton({
							text: localStorage.USERNAME,
							// text: "sap_test",
							icon: "sap-icon://person-placeholder",
							menu: new sap.ui.commons.Menu("logoutMenu",{
								expended:true,
								items: [new sap.ui.commons.MenuItem({
									text:"Logout", 
									icon: "sap-icon://log",
									select: function(){				
						    			$.ajax({
									        type: "HEAD",
									        url: "/cdp/security/services/csrf.xsjs",
									        headers: {
									            "X-CSRF-Token": "Fetch"
									        },
									        success: function(data, textStatus, jqXHR) {
									            var securityToken = jqXHR.getResponseHeader("X-CSRF-Token");
									            $.ajax({
									                url: "/cdp/security/services/logout.xscfunc",
									                type: "POST",
									                headers: {
									                    "X-CSRF-Token": securityToken
									                },
									                
									                success: function(ret) {
									                	localStorage.NAME = "";
									                	localStorage.MODULE_NAME = "";
									                	localStorage.USERNAME = "";
									                    // var s = encodeURIComponent(location.pathname+location.search+location.hash);
									                    location.replace(location.origin + "/sap/hana/xs/formLogin/login.html?" + "x-sap-origin-location=" + location.pathname);
									                }
									            });
									        },
									        error: function(XMLHttpRequest, textStatus, errorThrown) {
									        	console.log(XMLHttpRequest.responseText);
									        }
						    			});

								}}),
								new sap.ui.commons.MenuItem({
									text:"Change Password", 
									icon: "sap-icon://initiative",
									select: function(){
										location.replace(location.origin + "/sap/hana/xs/formLogin/login.html?"+ "m=pwd&" + "x-sap-origin-location=" + location.pathname);
								}})
								]
							})
						}),
						new sap.ui.commons.Button({
							icon: "sap-icon://menu2",
							press: oController.toggleMenu
						}).addStyleClass("toggleMenu")],
			fullHeightContent: true,
			applyContentPadding: false,
			content:[
						new sap.ui.commons.Splitter("oVmi", {
							width:"100%",
							height:"100%",
							splitterPosition:"16%",
							splitterBarVisible:false,
							showScrollBars:false
						})
					]
		});	
		return oShell;
	}	
});