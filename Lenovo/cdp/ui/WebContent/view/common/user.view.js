sap.ui.jsview("lenovo.view.common.user", {
	getControllerName : function() {
		return "lenovo.view.common.user";
	}, 

	createContent : function(oController) {
		var oModel_user = new sap.ui.model.json.JSONModel();
		oModel_user.setData({
			id: 1,
			userid: 1,
			groupid: 1,
			type: "",
            admin: false,
			selectedIndex: "-1"
		});
		sap.ui.getCore().setModel(oModel_user, "user");
		
		var windowHeight = document.documentElement.clientHeight || window.innerHeight;		   
		var oTable = new sap.ui.table.TreeTable("userTb", {
			title: "User List",
			width: "auto",
			editable: false,
            visibleRowCount: parseInt((windowHeight-150)/30),
            columnHeaderHeight: 30,
            enableColumnReordering: true,
            expandFirstLevel: false,
            setShowSortMenuEntry: false,
            navigationMode: sap.ui.table.NavigationMode.Scrollbar,
            selectionMode: sap.ui.table.SelectionMode.Single,          
            toolbar: new sap.ui.commons.Toolbar({
            	items: [
                        new sap.ui.commons.Button("downloadRelationship",{
                           lite: true,
                            icon: "sap-icon://download",
                            tooltip: "Maintain Admin Role",
                            press: function(oEvent) {
                                oController.onDownloadRelationship(oEvent);
                            } 
                        }).addStyleClass("maintainRole"),
                        new sap.ui.commons.Button("setAdmin",{
                            lite: true,
                            icon: "sap-icon://manager",
                            tooltip: "Maintain Admin Role",
                            press: function(oEvent) {
                                oController.onSetAdmin(oEvent);
                            }
                        }).addStyleClass("maintainRole"), 
            			new sap.ui.commons.Button("maintainRole",{
           	        		lite: true,
            	        	icon: "sap-icon://role",
							tooltip: "Maintain role group",
							press: function(oEvent) {
								oController.onMaintainRG(oEvent);
							}
            	        }).addStyleClass("maintainRole"), 
            			new sap.ui.commons.Button("doneBtn",{
           	        		lite: true,
            	        	icon: "sap-icon://accept",
							tooltip: "Edit",
							style: sap.ui.commons.ButtonStyle.Accept,
							press: function(oEvent) {
								oController.onConfirmEditGroup(oEvent);
							}
            	        }).addStyleClass("hiddenStyle"),
            			new sap.ui.commons.Button("cancelBtn",{
           	        		lite: true,
            	        	icon: "sap-icon://decline",
							tooltip: "Edit",
							style: sap.ui.commons.ButtonStyle.Accept,
							press: function(oEvent) {
								oController.onCancelEdit(oEvent);
							}
            	        }).addStyleClass("hiddenStyle"),
            			new sap.ui.commons.Button("editBtn",{
           	        		lite: true,
            	        	icon: "sap-icon://edit",
							tooltip: "Edit",
							press: function(oEvent) {
								oController.onEdit(oEvent);
							}
            	        }).addStyleClass("editUser"),
            	        /***************************
            	         * Chris Gao
            	         * reset password
            	         ***************************/
            	        new sap.ui.commons.Button({
            	        	lite: true,
            	        	icon: "sap-icon://unlocked",
							tooltip: "Reset Password",
							press: function(oEvent) {
								oController.onResetPassword(oEvent);
							}
            	        }),
            	        /***************************
            	         * End by Chris Gao
            	         ***************************/
            	        new sap.ui.commons.Button({
           	        		lite: true,
            	        	// icon: "resource/img/add_user.png",
							tooltip: "Create user",
							press: function(oEvent) {
								oController.onAddUser(oEvent);
							}
            	        }).addStyleClass("addUser"),
            	        new sap.ui.commons.Button({
           	        		lite: true,
            	        	icon: "sap-icon://group",
							tooltip: "Maintain user group",
							press: function(oEvent) {
								oController.onAddGroup();
							}
            	        }).addStyleClass("addGroup"),
            	        new sap.ui.commons.Button({
           	        		lite: true,
            	        	icon: "sap-icon://delete",
							tooltip: "Delete",
							press: function(oEvent) {
								oController.onDelete(oEvent);
							}
            	        }).addStyleClass("deleteUser")
            	        ]}),
        });
		var service = new lenovo.service.Common();
		this.oModel = new sap.ui.model.odata.ODataModel(service.getUserInfo(), true);
        this.oModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);		
        
        oTable.setBusy(true);
		oTable.setModel(this.oModel);
		this.oModel.attachRequestCompleted(function() {
			oTable.setBusy(false);
		});
        oTable.addColumn(new sap.ui.table.Column({
            label: new sap.ui.commons.Label({text: "ID"}),
            template: new sap.ui.commons.TextField({editable: false}).bindProperty("value", "ID"),
            width:"100px"
        }));
        oTable.addColumn(new sap.ui.table.Column({
            label: new sap.ui.commons.Label({text: "Name"}),
            template: new sap.ui.commons.TextField({editable: false}).bindProperty("value", "NAME"),
            width:"150px",
            flexible: true
        }));
        oTable.addColumn(new sap.ui.table.Column({
            label: new sap.ui.commons.Label({text: "Comment"}),
            template: new sap.ui.commons.TextField({editable: false}).bindProperty("value", "COMMENT"),
            width:"150px",
            flexible: true
        }));
        oTable.addColumn(new sap.ui.table.Column({
            label: new sap.ui.commons.Label({text: "Login Name"}),
            template: new sap.ui.commons.TextField({editable: false}).bindProperty("value", "LOGINNAME"),
            width:"100px",
            flexible: true
        }));
        oTable.addColumn(new sap.ui.table.Column({
            label: new sap.ui.commons.Label({text: "First Name"}),
            template: new sap.ui.commons.TextField({editable: false}).bindProperty("value", "FIRSTNAME"),
            width:"100px",
            flexible: true
        }));
        oTable.addColumn(new sap.ui.table.Column({
            label: new sap.ui.commons.Label({text: "Last Name"}),
            template: new sap.ui.commons.TextField({editable: false}).bindProperty("value", "LASTNAME"),
            width:"100px",
            flexible: true
        }));
        oTable.addColumn(new sap.ui.table.Column({
            label: new sap.ui.commons.Label({text: "Email Address"}),
            template: new sap.ui.commons.TextField({editable: false}).bindProperty("value", "EMAILADDRESS"),
            width:"150px",
            flexible: true
        }));
        oTable.addColumn(new sap.ui.table.Column({
            label: new sap.ui.commons.Label({text: "Status"}),
            template: new sap.ui.commons.DropdownBox({editable: false,items: [new sap.ui.core.ListItem(), new sap.ui.core.ListItem({text:"ACTIVATE"}), new sap.ui.core.ListItem({text:"DEACTIVATE"})]}).bindProperty("value", "STATUS"),
            width:"120px",
            flexible: true
        }));
        oTable.addColumn(new sap.ui.table.Column({
            label: new sap.ui.commons.Label({text: "Company"}),
            template: new sap.ui.commons.TextField({editable: false}).bindProperty("value", "COMPANY"),
            width:"100px",
            flexible: true
        }));
        oTable.addColumn(new sap.ui.table.Column({
            label: new sap.ui.commons.Label({text: "Department"}),
            template: new sap.ui.commons.TextField({editable: false}).bindProperty("value", "DEPARTMENT"),
            width:"100px",
            flexible: true
        }));
        oTable.addColumn(new sap.ui.table.Column({
            label: new sap.ui.commons.Label({text: "Phone Number"}),
            template: new sap.ui.commons.TextField({editable: false}).bindProperty("value", "PHONENUMBER"),
            width:"100px",
            flexible: true
        }));
        
		oTable.bindRows({
		    path: "/INFO_GROUP",
		    parameters: {
		    	expand: "UsersInfo",
		        navigation: {
		            "INFO_GROUP": "UsersInfo"
		        }
		    }
		});
       
		oTable.attachRowSelectionChange(function(oEvent){
			oController.setSelection(oEvent);
		});

		oTable.addStyleClass("userTb");
		var oTab = sap.ui.jsview("lenovo.view.common.role", "lenovo.view.common.role");				
		var oLayout = new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : true,
			width : '100%',
			columns : 2,
			widths : ['80%', '20%']
		});
		oLayout.createRow(oTable, oTab);
		oLayout.addStyleClass("user-manage");
		var oTitle = new sap.ui.commons.TextView({
			id: "userTitle",
			text : 'User Management'});
		var oLayout1 = new sap.ui.commons.layout.VerticalLayout({
			content: [oTitle, oLayout]
		});
		oLayout1.addStyleClass("userLayout");
		return oLayout1;
	},

});