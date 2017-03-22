jQuery.sap.require("lenovo.control.Controller");
jQuery.sap.require("lenovo.service.Common");
jQuery.sap.require("lenovo.control.Dialog");
jQuery.sap.require("lenovo.control.Validation");
lenovo.control.Controller.extend("lenovo.view.common.user", {
	onInit: function() {
		var service = new lenovo.service.Common();
		this.userInfoUrl = service.getUserInfo();
		this.adminUrl = service.getAdminRole();
		$.getJSON(this.userInfoUrl + "/MAP_VIEWROLE?$filter=VIEW_NAME eq 'user' and MAP_TYPE eq 'controllor' &$format=json", function(data){
			var visible = false;
			data["d"]["results"].forEach(function(e){
				if(e["ROLE_NAME"] == "cdp.security.roles::userAdmin"){
				visible = true;
				}	
			});
			var oTable = sap.ui.getCore().byId("userTb");
			var toolbar = oTable.getToolbar();
			toolbar.setVisible(visible);
        });

        this.flag = 0;
		this.selectRoleGroupId = "";
		this.oldInput = "";
	},
	
	updateTable: function(){
		var context = this;
		this.service.getUserList({
			module: "'VMI'"
		}).done($.proxy(function(data) {		
		}, context));
	},

	createColumn: function(data){		
		var oColumn;
		for(var key in data){
			oColumn = new sap.ui.table.Column({label: key, template: key});
			this.oTable.addColumn(oColumn);
		}
	},

	setSelection: function(oEvent){
		var oTable = sap.ui.getCore().byId("userTb");
        var model = oTable.getModel();
        if(oTable.getSelectedIndex() != "-1"){
        	var oSelected = oTable.getContextByIndex(oTable.getSelectedIndex());
	        var oSelectedObject = oSelected.getObject();
	        var id = model.getProperty("ID", oSelected);
	        var oModel_user = sap.ui.getCore().getModel("user");
	        if(id){
	        	oModel_user.setProperty("/selectedIndex", oTable.getSelectedIndex());
	        	if(oSelectedObject["UsersInfo"] == undefined) {
		        	oModel_user.setProperty("/type", "user");    
		            oModel_user.setProperty("/groupid", oSelectedObject["GROUP_ID"]);
		            oModel_user.setProperty("/userid", oSelectedObject["ID"]);
		            oModel_user.setProperty("/id", id);
		            oModel_user.setProperty("/moduleid", oSelectedObject["MODULE_ID"]); 	
		        } else{
		        	oModel_user.setProperty("/type", "usergroup");
		        	oModel_user.setProperty("/groupid", oSelectedObject["ID"]);
		        	oModel_user.setProperty("/userid", 0);
		            oModel_user.setProperty("/id", id); 
		            oModel_user.setProperty("/moduleid", oSelectedObject["MODULE_ID"]); 		
		        }
	        }   
        }           	
	},

	onAddUser: function(oEvent){
		var oForm = this.createUserForm();
		var dialog = new Dialog("create-user",{
			title: "Create User",
			contentWidth:"500px",
			resizable: false,
			keepInWindow: true,
			modal: true,
			content: oForm,
			closed:function(){
				this.destroy();
			},
		});
		dialog.open();
		dialog.ondragstart = false;

		var oButton = new sap.ui.commons.Button("createU",{text : "Create", press: this.createUserService});
		dialog.addButton(oButton);
	},
	
	/*******************
	 * Chris Gao
	 * Reset Password
	 ******************/
	onResetPassword: function(oEvent){
		var table = sap.ui.getCore().byId("userTb");
		var selectedRowIndex = table.getSelectedIndex();
		var oModel_user = sap.ui.getCore().getModel("user"),
		userId = oModel_user.getProperty("/userid"),
		type = oModel_user.getProperty("/type");
		if(selectedRowIndex != undefined && selectedRowIndex >= 0 && type != "usergroup")
		{
			var oForm = this.resetPasswordForm(table, selectedRowIndex);
			var dialog = new Dialog("reset-password",{
				title: "Reset Password",
				contentWidth:"500px",
				resizable: false,
				keepInWindow: true,
				modal: true,
				content: oForm,
				closed:function(){
					this.destroy();
				},
			});
			dialog.open();
			dialog.ondragstart = false;

			var oButton = new sap.ui.commons.Button("resetU",{text : "Reset", press: this.resetPasswordService});
			dialog.addButton(oButton);
		}
		else
		{
			sap.ui.commons.MessageBox.show("Please select a valid user first.", "ERROR", "ERROR");
		}
		
	},
	
	resetPasswordForm: function(table, selectedRowIndex){
		//get -- User Name
		var context = table.getContextByIndex(selectedRowIndex);
		var selectedUserName = table.getModel().getProperty("NAME",context);
		//password control declaration
		var passwordControl = new sap.ui.commons.PasswordField("passwd", {
			layoutData: new sap.ui.layout.form.GridElementData({hCells: "8"}),
//			value: "Initial0",
//			enabled:false,
			enabled:true
		}).attachChange(function(){							
			var str = this.getValue();
			var tp = new sap.ui.ux3.ToolPopup({
								autoClose: true,
								content : [ new sap.ui.commons.Label({
									text : "Password must contain a-z, A-Z, 0-9, and no less than 8"
								}) ],
								opener : this
							});
			if (lenovo.control.Validation.isPassword(str) === false){
				this.setValueState(sap.ui.core.ValueState.Error)/*.setTooltip("Password must be alphanumeric characters A-Z and 0-9")*/;													
				tp.open(sap.ui.core.Popup.Dock.BeginBottom, sap.ui.core.Popup.Dock.BeginTop);							
				
			}else{
				tp.close();
				this.setValueState(sap.ui.core.ValueState.None).setTooltip("");									
			}
			
		});
		
		//added by Chris Gao 2016-02-15 change request
		passwordControl.addStyleClass("required");
		
		var oLayout = new sap.ui.layout.form.GridLayout();
		var oForm = new sap.ui.layout.form.Form({
			width: "460px",
			layout: oLayout,
			formContainers: [
				new sap.ui.layout.form.FormContainer({
					formElements: [
						new sap.ui.layout.form.FormElement({
							label: new sap.ui.commons.Label({text: "User name",
									layoutData: new sap.ui.layout.form.GridElementData({hCells: "5"})
							}),
							fields: [new sap.ui.commons.TextField("uName", {
									width: "100%",
									editable: false,
									value: selectedUserName,
									layoutData: new sap.ui.layout.form.GridElementData({hCells: "8"})
								})]
						}),
//						new sap.ui.layout.form.FormElement({
//							label: new sap.ui.commons.Label({text: "Default Password",
//									layoutData: new sap.ui.layout.form.GridElementData({hCells: "5"})
//							}),
//							fields: [new sap.ui.commons.RadioButtonGroup({
//								columns : 2,
//								selectedIndex : 0,
//								items:[
//										new sap.ui.core.Item({
//											text : "YES",
//											key : "YES"}),
//										new sap.ui.core.Item({
//											text : "NO",
//											key : "NO"})
//								      ],
//								select : function() {
//										if(this.getSelectedItem().getKey() == 'YES')
//										{
//											passwordControl.removeStyleClass("required");
//											passwordControl.setEnabled(false);
//											passwordControl.setValue("Initial0");
//										}
//										else
//										{
//											passwordControl.addStyleClass("required");
//											passwordControl.setEnabled(true);
//											passwordControl.setValue("");
//										}
//										
//									}
//								})]
//						}),
						
						new sap.ui.layout.form.FormElement({
							label: new sap.ui.commons.Label({text: "Password",
									layoutData: new sap.ui.layout.form.GridElementData({hCells: "5"})
							}),
							fields: [passwordControl]
						})
					]
		})]}).addStyleClass("userForm");
		
		
		return oForm;
	},
	
	resetPasswordService: function(){
		var context = this;
		
		//validate user password
		var passwordControl = sap.ui.getCore().byId("passwd");
		var passwordValue = passwordControl.getValue();
		
		var tp = new sap.ui.ux3.ToolPopup({
							autoClose: true,
							content : [ new sap.ui.commons.Label({
								text : "Password must contain a-z, A-Z, 0-9, and no less than 8"
							}) ],
							opener : passwordControl
						});
		if (lenovo.control.Validation.isPassword(passwordValue) === false){
			passwordControl.setValueState(sap.ui.core.ValueState.Error)/*.setTooltip("Password must be alphanumeric characters A-Z and 0-9")*/;													
			tp.open(sap.ui.core.Popup.Dock.BeginBottom, sap.ui.core.Popup.Dock.BeginTop);							
			
		}else{
			tp.close();
			passwordControl.setValueState(sap.ui.core.ValueState.None).setTooltip("");	
			
			//set model
			var oModel_user = sap.ui.getCore().getModel("user"),
			userId = oModel_user.getProperty("/userid"),
			groudId = oModel_user.getProperty("/groupid");
			var userName = sap.ui.getCore().byId("uName").getValue();
			
	        var oUser = {};
	        oUser["NAME"] = userName;
	        oUser["PASSWORD"] = passwordValue;
	        var oTable = sap.ui.getCore().byId("userTb");       
	        var serviceUrl = oTable.getModel().sServiceUrl;
	        var batchModel = new sap.ui.model.odata.ODataModel(serviceUrl, true);
	        var batchChanges = [];
	       
	       
	        var modelIndexPath = "/INFO_USER_PASSWD(ID=" + userId + ",GROUP_ID=" + groudId + ")";
	        batchChanges.push(batchModel.createBatchOperation(modelIndexPath, "PUT", oUser));
	       
	        var oDia = sap.ui.getCore().byId("reset-password");
	        
	        batchModel.addBatchChangeOperations(batchChanges);
	        batchModel.submitBatch(function(data, response, errorResponse) {
	        	if (errorResponse && errorResponse.length > 0) {
	        		//added by Chris Gao 2016-2-15 -- change request
	        		var errorObject = JSON.parse(errorResponse[0].response.body);
	        		var errorMessage = errorObject.error.message.value;
	        		sap.ui.commons.MessageBox.show(errorMessage, "ERROR", "ERROR");
	            } else {
	            	sap.ui.commons.MessageBox.show("Password resets successfully.", "SUCCESS", "SUCCESS");
	            }
	        }, function(data) {
	        	sap.ui.commons.MessageBox.show("Could not reset password.", "ERROR", "ERROR");
	        });
	        
	        oDia.close();
		}
	},
	
	/*********************
	 * End by Chris Gao
	 *********************/

	createUserService: function(){
		var context = this;
        var oUser = {
        	"NAME": sap.ui.getCore().byId("uName").getValue(),
        	"PASSWORD": sap.ui.getCore().byId("passwd").getValue(),
        	"LOGINNAME": sap.ui.getCore().byId("loginName").getValue() || sap.ui.getCore().byId("uName").getValue(),
        	"FIRSTNAME": sap.ui.getCore().byId("fName").getValue(),
        	"LASTNAME": sap.ui.getCore().byId("lName").getValue(),
        	"EMAILADDRESS": sap.ui.getCore().byId("email").getValue(),
        	"STATUS": sap.ui.getCore().byId("STATUS").getValue(),
        	// "MODULE_NAME": module,
        	"LOCALE": "",
        	"DESIGNATION": "",
        	"ID": "1",
        	"COMMENT": sap.ui.getCore().byId("COMMENT").getValue(),
  			"GROUP_NAME": "",
  			"GROUP_ID": "1",
  			"PHONENUMBER": sap.ui.getCore().byId("PHONENUMBER").getValue(),
  			"DEPARTMENT": sap.ui.getCore().byId("DEPARTMENT").getValue(),
  			"COMPANY": sap.ui.getCore().byId("COMPANY").getValue(),
  			"USER_GROUP": sap.ui.getCore().byId("USER_GROUP").getValue(),
  			"INTERNAL_SIGN": "",
  			"EXTERNAL_SIGN": ""
        };
        /*oUser["VALID_FROM"] = sap.ui.getCore().byId("VALIDTO").getValue() == ""?undefined:"/Date(".concat(new Date().getTime()).concat(")/");
        oUser["VALID_UNTIL"] = sap.ui.getCore().byId("VALIDTO").getValue() == ""?undefined:"/Date(".concat(new Date(sap.ui.getCore().byId("VALIDTO").getValue()).getTime()).concat(")/")
       */ 
       oUser["VALID_FROM"] = undefined;
       oUser["VALID_UNTIL"] = undefined;
       var oTable = sap.ui.getCore().byId("userTb");       
       oTable.setBusy(true);      
       var oModel = sap.ui.getCore().byId("userTb").getModel();
       oModel.attachRequestCompleted(function() {
			oTable.setBusy(false);
		});
        oModel.setHeaders({
            "content-type": "application/json;charset=utf-8"
        });
       
        oModel.create('/INFO_USER', oUser,{
        	async : true, 
        	success: function() {
	            var oDia = sap.ui.getCore().byId("create-user");
	            oDia.close();
	            sap.ui.commons.MessageBox.show("User created successfully.", "SUCCESS", "SUCCESS");
	            oModel.refresh();           
	        }, 
	        error : function() {
	            sap.ui.commons.MessageBox.show("Could not create the user.", "ERROR", "ERROR");
	        }
        });     
	},

	onDelete: function(oEvent){
		var context = this;
		var oTable = sap.ui.getCore().byId("userTb");
		var selectedIndex = oTable.getSelectedIndex();
		var oModel = oTable.getModel();
		if(selectedIndex == "-1"){
			alert("Please choose an item!");
			return;
		}
        var oSelectedObject = oTable.getContextByIndex(selectedIndex).getObject();
        if(oSelectedObject["UsersInfo"] == undefined) {
        	function _fnCallbackConfirm(bResult) {
				if(bResult){
					context.deleteUser(oModel, oTable.getContextByIndex(selectedIndex)); 
				}
			}
        	sap.ui.commons.MessageBox.confirm("Execution can not be revoked,\n are you sure to delete the user?", _fnCallbackConfirm, "Delete");     	    	
        } else{
        	function _fnConfirm(bResult) {
				if(bResult){
					context._deleteGroup(oTable.getContextByIndex(selectedIndex));
				}
			}
        	sap.ui.commons.MessageBox.confirm("Execution can not be revoked,\n are you sure to delete the group?", _fnConfirm, "Delete");
        }	
	},

	deleteUser: function(oModel, oSelectedObject){
		var oTable = sap.ui.getCore().byId("userTb");
        var oModel = oTable.getModel();
        console.log(oSelectedObject);
        oTable.setBusy(true);
        oModel.attachRequestCompleted(function() {
			oTable.setBusy(false);
		});
        oModel.remove(oSelectedObject.getPath(), {
        		async : true,
                fnSuccess: function(oData, oResponse) {           	
                    sap.ui.commons.MessageBox.show("User deleted successfully.", "SUCCESS", "SUCCESS");
                   
                    oModel.refresh();
                },
                fnError: function(oData, oResponse) {
                    sap.ui.commons.MessageBox.show("Could not delete the user.", "ERROR", "ERROR");
                }
            });
        var oModel_user = sap.ui.getCore().getModel("user");
        oModel_user.setProperty("/type", "");    
        oModel_user.setProperty("/groupid", 1);
        oModel_user.setProperty("/userid", 1);
        oModel_user.setProperty("/id", 1);         
	},

	onEdit: function(oEvent){
		var oTable = sap.ui.getCore().byId("userTb");
		var selectedIndex = oTable.getSelectedIndex();

		if(selectedIndex == "-1"){
			alert("Please choose an item!");
			return;
		}

		sap.ui.getCore().byId("editBtn").addStyleClass("hiddenStyle");
		sap.ui.getCore().byId("doneBtn").removeStyleClass("hiddenStyle");
		sap.ui.getCore().byId("cancelBtn").removeStyleClass("hiddenStyle");

		var oSelectedObject = oTable.getContextByIndex(selectedIndex).getObject();
        if(oSelectedObject["UsersInfo"] == undefined) {
        	this.updateUser(selectedIndex);
        } else{      	
        	this.updateGroup(selectedIndex);
        }		
	},
	
	

	createUserForm: function(){
		var oLayout = new sap.ui.layout.form.GridLayout();
		var oForm = new sap.ui.layout.form.Form({
			width: "460px",
			layout: oLayout,
			formContainers: [
				new sap.ui.layout.form.FormContainer({
					formElements: [
						new sap.ui.layout.form.FormElement({
							label: new sap.ui.commons.Label({text: "User name",
									layoutData: new sap.ui.layout.form.GridElementData({hCells: "5"})
							}),
							fields: [new sap.ui.commons.TextField("uName", {
									width: "100%",
									layoutData: new sap.ui.layout.form.GridElementData({hCells: "8"})
								}).addStyleClass("required")]
						}),
						new sap.ui.layout.form.FormElement({
							label: new sap.ui.commons.Label({text: "Password",
									layoutData: new sap.ui.layout.form.GridElementData({hCells: "5"})
							}),
							fields: [new sap.ui.commons.PasswordField("passwd", {
									layoutData: new sap.ui.layout.form.GridElementData({hCells: "8"})
							}).attachChange(function(){							
								var str = this.getValue();
								var tp = new sap.ui.ux3.ToolPopup({
													autoClose: true,
													content : [ new sap.ui.commons.Label({
														text : "Password must contain a-z, A-Z, 0-9, and no less than 8"
													}) ],
													opener : this
												});
								if (lenovo.control.Validation.isPassword(str) === false){
									this.setValueState(sap.ui.core.ValueState.Error)/*.setTooltip("Password must be alphanumeric characters A-Z and 0-9")*/;													
									tp.open(sap.ui.core.Popup.Dock.BeginBottom, sap.ui.core.Popup.Dock.BeginTop);							
									
								}else{
									tp.close();
									this.setValueState(sap.ui.core.ValueState.None).setTooltip("");									
								}
								
							}).addStyleClass("required")]
						}),
						new sap.ui.layout.form.FormElement({
							label: new sap.ui.commons.Label({text: "Login name",
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "5"})
							}),
							fields: [new sap.ui.commons.TextField("loginName", {
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "8"})
							})]
						}),
						new sap.ui.layout.form.FormElement({
							label: new sap.ui.commons.Label({text: "Name",
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "5"})
							}),
							fields: [new sap.ui.commons.TextField("fName", {placeholder: "First name", 
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "4"})
							}),
									new sap.ui.commons.TextField("lName", {placeholder: "Last name", 
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "4"})		
								})]
						}),
						new sap.ui.layout.form.FormElement({
							label: new sap.ui.commons.Label({text: "Email",
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "5"})
							}),
							fields: [new sap.ui.commons.TextField("email", {type: "email",
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "8"})
							}).attachChange(function(){	
									var tp = new sap.ui.ux3.ToolPopup({
													autoClose: true,
													content : [ new sap.ui.commons.Label({
														text : "Illegal email address. "
													}) ],
													opener : this
												});							
									var str = this.getValue();
									if(lenovo.control.Validation.isEmail(str) === false){
										this.setValueState(sap.ui.core.ValueState.Error);													
										tp.open(sap.ui.core.Popup.Dock.BeginBottom, sap.ui.core.Popup.Dock.BeginTop);															
									}else{
										tp.close();
										this.setValueState(sap.ui.core.ValueState.None).setTooltip("");
									}
							})
							],
						}),						
						new sap.ui.layout.form.FormElement({
							label: new sap.ui.commons.Label({text: "Status",
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "5"})
							}),
							fields: [new sap.ui.commons.DropdownBox("STATUS", {
								items: [new sap.ui.core.ListItem({text:"ACTIVATE"}), new sap.ui.core.ListItem({text:"DEACTIVATE"})],
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "8"})
							})]
						}),
						new sap.ui.layout.form.FormElement({
							label: new sap.ui.commons.Label({text: "Group",
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "5"})
							}),
							fields: [this.getGroupName()]
						}),
						new sap.ui.layout.form.FormElement({
							label: new sap.ui.commons.Label({text: "Company",
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "5"})
							}),
							fields: [new sap.ui.commons.TextField("COMPANY", {
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "8"})
							})]
						}),
						new sap.ui.layout.form.FormElement({
							label: new sap.ui.commons.Label({text: "Department",
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "5"})
							}),
							fields: [new sap.ui.commons.TextField("DEPARTMENT", {
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "8"})
							})]
						}),
						new sap.ui.layout.form.FormElement({
							label: new sap.ui.commons.Label({text: "Phone Number",
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "5"})
							}),
							fields: [new sap.ui.commons.TextField("PHONENUMBER", {
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "8"})
							})]
						}),
						new sap.ui.layout.form.FormElement({
							label: new sap.ui.commons.Label({text: "Comment",
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "5"})
							}),
							fields: [new sap.ui.commons.TextField("COMMENT", {
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "8"})
							})]
						})
				]
		})]}).addStyleClass("userForm");
		return oForm;
	},

	getGroupName: function(){
		var oControl = new sap.ui.commons.DropdownBox("USER_GROUP", {
			layoutData: new sap.ui.layout.form.GridElementData({hCells: "8"})
		});
		$.ajax({
			url: this.userInfoUrl + "/INFO_GROUP?$format=json",
			type: "get",
			datatype: "json",
			async: false,
			success: function(data){			
				var oItem;
				data = data.d.results;
				$.each(data, function(index, value) {
					oItem = new sap.ui.core.ListItem({
						text: value["NAME"]
					});
					oControl.addItem(oItem);
				});
				
			}
		});
		return oControl;
	},

	updateUser: function(selectedIndex){
		var oTable = sap.ui.getCore().byId("userTb");
		var rows = oTable.getRows();
		var selectedRowNo = this._getRowNumofIndex(rows, selectedIndex);
		var oSelectedRow = oTable.getRows()[selectedRowNo];
		//var oSelectedRow = oTable.getRows()[selectedIndex];
		oSelectedRow.getCells()[3].setEditable(true).focus();
		oSelectedRow.getCells()[4].setEditable(true);
		oSelectedRow.getCells()[5].setEditable(true);
		oSelectedRow.getCells()[6].setEditable(true);
		oSelectedRow.getCells()[7].setEditable(true);
		oSelectedRow.getCells()[8].setEditable(true);
		oSelectedRow.getCells()[9].setEditable(true);
		oSelectedRow.getCells()[10].setEditable(true);
//		oSelectedRow.getCells()[11].setEditable(true); //comment by chris gao 2016-01-28
//		oSelectedRow.getCells()[12].setEditable(true);
		
	},
	
	/*********************
	 * Added by Chris Gao 2016-01-28
	 * to get the selected Row num of this page
	 * to solve scrolling problem
	 *********************/
	_getRowNumofIndex: function(rows, index){
		var rowNum = -1;
		for(var i=0; i<rows.length; i++)
		{
			if(rows[i].getIndex() == index)
			{
				rowNum = i;
			}
		}
		return rowNum;
	},
	/*********************
	 * End by Chris Gao
	 ********************/

	onAddGroup : function(oEvent){
		var context = this;
		//Load user list data
		context.oUserModel = new sap.ui.model.odata.ODataModel(this.userInfoUrl, true);
		context.oUserNotInModel = new sap.ui.model.odata.ODataModel(this.userInfoUrl, true);
		context.oDropModel = new sap.ui.model.odata.ODataModel(this.userInfoUrl, true);
		context.oDropModel.attachRequestCompleted($.proxy(context._addDropDownDefault,context));

		var oCont = $.proxy(context._createGroupView,context)();

		var dialog = new Dialog("maintain-user-group",{
			title: "Maintain User Group",
			contentWidth:"600px",
			resizable: false,
			keepInWindow: true,
			height: "400px",
			modal: true,
			content: oCont,
			closed:function(){
				sap.ui.getCore().byId("userTb").getModel().refresh();
				this.destroy();
			},
		});
		dialog.open();
		dialog.ondragstart = false;

		var oButton = new sap.ui.commons.Button("ugDone",{
			text : "Close", 
			press: function(){
				dialog.close();
			}});
		dialog.addButton(oButton);
	},

	//show the view of Maintain user group
	_createGroupView: function(){
		//Init the splitter
		var oSplitterV = new sap.ui.commons.Splitter("splitterV1"); 
		oSplitterV.setShowScrollBars(false);
		oSplitterV.setSplitterOrientation(sap.ui.commons.Orientation.vertical);
		oSplitterV.setSplitterPosition("50%");
		oSplitterV.setMinSizeFirstPane("50%");
		oSplitterV.setMinSizeSecondPane("50%");
		oSplitterV.setSplitterBarVisible(false);
		oSplitterV.setWidth("600px");
		oSplitterV.setHeight("300px");
		oSplitterV.addStyleClass("userGroup");

		//bind group into dropdown item
		var oItemTemplate1 = new sap.ui.core.ListItem();
		oItemTemplate1.bindProperty("text", "NAME");
		oItemTemplate1.bindProperty("key", "ID");

		//add group information into the left panel
		var oSelectForm = new sap.ui.layout.Grid("selectGroup",{
				hSpacing: 0,
				vSpacing: 1, 	
				content: [
					new sap.ui.commons.Label({
						text: 'Group Name:',
						layoutData : new sap.ui.layout.GridData({
							span: "L4"
						})
					}),
					new sap.ui.commons.DropdownBox("groupDropdown",{				
						width: "100%",
						searchHelpEnabled: false,
						change: $.proxy(this._changeGroup,this),
						layoutData : new sap.ui.layout.GridData({
							span: "L6"
						})
					}).setModel(this.oDropModel).bindItems("/INFO_GROUP",oItemTemplate1),
					new sap.ui.commons.Button({
						toolTip: "Create Group",
						width: "100%",
						icon: "resource/img/add_user.png",
						lite: true,
						layoutData : new sap.ui.layout.GridData({
							span: "L2"
					}),
						press:  $.proxy(this._handleNewGroup,this)
					})
					
				]
			});

		//add new group input box as hidden
		oSplitterV.addFirstPaneContent(oSelectForm);
		var oNewForm = new sap.ui.layout.Grid("newGroup",{
				hSpacing: 0,
				vSpacing: 1, 	
				content: [
					new sap.ui.commons.Label({
						text: 'Group Name:',
						layoutData : new sap.ui.layout.GridData({
							span: "L4"
						})
					}),
					new sap.ui.commons.TextField("newGroupInput",{
						width: "100%",
						layoutData : new sap.ui.layout.GridData({
							span: "L6"
						})
					}),
					new sap.ui.commons.Button({
						toolTip: "Done",
						width: "100%",
						layoutData : new sap.ui.layout.GridData({
							span: "L1"
						}),
						lite: true,
						icon: "sap-icon://accept",
						press: $.proxy(this._handleDone,this)
					}),
					new sap.ui.commons.Button({
						toolTip: "Cancel",
						width: "100%",
						layoutData : new sap.ui.layout.GridData({
							span: "L1"
						}),
						lite: true,
						icon: "sap-icon://undo",
						press: $.proxy(this._handleCancel,this)
					})
					
				]
			});
		oNewForm.addStyleClass("hiddenStyle");
		oSplitterV.addFirstPaneContent(oNewForm);

		//add new group Confirm box as hidden
		oSplitterV.addFirstPaneContent(oSelectForm);
		var oNewForm = new sap.ui.layout.Grid("newConfirm",{
				hSpacing: 0,
				vSpacing: 1, 	
				content: [
					new sap.ui.commons.Label({
						text: 'Group Name:',
						layoutData : new sap.ui.layout.GridData({
							span: "L4"
						})
					}),
					new sap.ui.commons.TextField("confirmGroup",{
						enabled: false,
						width: "100%",
						layoutData : new sap.ui.layout.GridData({
							span: "L6"
						})
					})
				]
			});
		oNewForm.addStyleClass("hiddenStyle");
		oSplitterV.addFirstPaneContent(oNewForm);

		//add user assignment into left bottom panel
		var oUserAssignTable = new sap.ui.table.Table("userAssignTb",{
			width : "240px",
			visibleRowCount: 9,
			noDataText : "No user assigned into this group",
			columnHeaderVisible: false
		});
		oUserAssignTable.setSelectionMode(sap.ui.table.SelectionMode.MultiToggle);
		oUserAssignTable.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "ID"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "ID"),
        	sortProperty: "ID",
        	filterProperty: "ID",
        	width: "70px",
        }));
        oUserAssignTable.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "Login Name"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "NAME"),
        	sortProperty: "NAME",
        	filterProperty: "NAME",
        	width: "140px",
        }));
        oUserAssignTable.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: ""}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "ID_GROUP_USER"),
        	visible: false,
        	width: "140px",
        }));
        oUserAssignTable.setModel(this.oUserModel);

        // add assign button
        var oUnassignBtn = new sap.ui.commons.Button({
			toolTip: "Unassign",
			width: "100%",
			lite: true,
			icon: "sap-icon://open-command-field",
			press: $.proxy(this.unAssignUserToGroup,this)
		});
        var oAssignBtn = new sap.ui.commons.Button({
			toolTip: "Assign",
			width: "100%",
			lite: true,
			icon: "sap-icon://close-command-field",
			press: $.proxy(this.assignUserToGroup,this)
		});
        var oVLayout = new sap.ui.layout.VerticalLayout("vLayout", {
			content: [oUnassignBtn, oAssignBtn]
		});
		oVLayout.addStyleClass("assignUser");
		var oHLayout = new sap.ui.layout.HorizontalLayout("hLayout", {
			content: [oUserAssignTable, oVLayout]
		});
        
		oSplitterV.addFirstPaneContent(oHLayout);

		//add user list into the right panel
		var oUserTable = new sap.ui.table.Table("userListTbl",{
			width : "300px",
			visibleRowCount: 9
		});
		oUserTable.setSelectionMode(sap.ui.table.SelectionMode.MultiToggle);
		oUserTable.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "USER_ID"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "USER_ID"),
        	sortProperty: "USER_ID",
        	filterProperty: "USER_ID",
        	width: "100px",
        }));
        oUserTable.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "Login Name"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "LOGINNAME"),
        	sortProperty: "LOGINNAME",
        	filterProperty: "LOGINNAME",
        	width: "150px",
        }));
		oSplitterV.addSecondPaneContent(oUserTable);	

		return oSplitterV;
	},

	_handleCancel: function(){
		sap.ui.getCore().byId("selectGroup").removeStyleClass("hiddenStyle");
		sap.ui.getCore().byId("newGroup").addStyleClass("hiddenStyle");
		sap.ui.getCore().byId("newGroupInput").setValue("");
	},

	_handleDone: function(){
		var groupName = this._getGroupNameAfterCreate(sap.ui.getCore().byId("newGroupInput").getValue());
	},

	_handleNewGroup: function(){
		sap.ui.getCore().byId("newGroup").removeStyleClass("hiddenStyle");
		sap.ui.getCore().byId("selectGroup").addStyleClass("hiddenStyle");
		sap.ui.getCore().byId("groupDropdown").setSelectedItemId("default");
		sap.ui.getCore().byId("userAssignTb").unbindRows();
	},

	_handleCreateUserSuccess: function(data){
		sap.ui.getCore().byId("newGroup").addStyleClass("hiddenStyle");
		sap.ui.getCore().byId("selectGroup").removeStyleClass("hiddenStyle");
		sap.ui.commons.MessageBox.show("Create Successful.", "SUCCESS", "Maintain User Group");
		var oContent = sap.ui.getCore().byId("splitterV1");
		if(oContent.isBusy()){
			oContent.setBusy(false);
		}
	},

	_handleFailed: function(data){
		sap.ui.commons.MessageBox.show("Failed.", "ERROR", "Maintain User Group");
		var oContent = sap.ui.getCore().byId("splitterV1");
		if(oContent.isBusy()){
			oContent.setBusy(false);
		}
	},

	_addDropDownDefault: function(){
		//add default option into dropdown
		var dropDown = sap.ui.getCore().byId("groupDropdown");
		var firstKey = "";
		if(dropDown.getItems().length > 0){
			dropDown.insertItem(new sap.ui.core.ListItem("default", {text:"-Select-", additionalText:""}),0);
		}
	},

	_changeGroup: function(){
		var dropdown = sap.ui.getCore().byId("groupDropdown");
		var selectedIndex = dropdown.getSelectedKey();
		var oTable = sap.ui.getCore().byId("userListTbl");
		var oAssignTable = sap.ui.getCore().byId("userAssignTb");

		if(dropdown.getSelectedItemId()=="default"){
			oAssignTable.unbindRows();
			oTable.unbindRows();
			return;
		}

		//update the list of users who assign into this group
		oAssignTable.bindRows("/INFO_GROUP("+ selectedIndex +")/UsersInfo");

		// //update the list of users who are not in this group
		var path = "/cdp/security/services/userInfo.xsodata/InputParams(P_GROUP_ID=" + selectedIndex + ")/Results";
		var oJsonModel = new sap.ui.model.json.JSONModel();
		oJsonModel.loadData(path,[],false);
		oTable.setModel(oJsonModel);
        oTable.bindRows("/d/results");

        oTable.clearSelection();
        oAssignTable.clearSelection();
        var oContent = sap.ui.getCore().byId("splitterV1");
		if(oContent.isBusy()){
			oContent.setBusy(false);
		}
	},

	_getGroupNameAfterCreate: function(groupName){
		if(groupName == ""){
			sap.ui.commons.MessageBox.show("Please enter Group name.", "ERROR", "Group Create");
			return;
		}
		this._createGroupService(groupName);
	},

	_createGroupService: function(groupName){
		var oContent = sap.ui.getCore().byId("splitterV1");
		if(!oContent.isBusy()){
			oContent.setBusy(true);
		}
		var that = this;
		var oModel = sap.ui.getCore().byId("groupDropdown").getModel();
		var oEntry = {};
		oEntry.NAME = groupName;
		oEntry.COMMENT = groupName;
		oEntry.ID = "1";
		oModel.setHeaders({
            "content-type": "application/json;charset=utf-8"
        });
        oModel.create('/INFO_GROUP', oEntry, {
        	async : true, 
        	success : $.proxy(that._handleCreateUserSuccess,that), 
        	error : that._handleFailed}
        );
	},

	//delete group service
	_deleteGroup: function(index){
		var oTable = sap.ui.getCore().byId("userTb");
        var oModel = oTable.getModel();
        oTable.setBusy(true);
        oModel.attachRequestCompleted(function() {
			oTable.setBusy(false);
		});
        oModel.remove(index.getPath(), {
        		async : true,
                fnSuccess: function(oData, oResponse) {
                    sap.ui.commons.MessageBox.show("Group deleted successfully.", "SUCCESS", "Group Delete");
                    oModel.refresh();
                },
                fnError: function() {
                    sap.ui.commons.MessageBox.show("Could not delete the Group.", "ERROR", "Group Delete");                   
                }
            });
	},

	//update group service
	updateGroup: function(selectedIndex){
		var oTable = sap.ui.getCore().byId("userTb");
		var groupNameTxt = oTable.getRows()[selectedIndex].getCells()[1];
		var groupCommentTxt = oTable.getRows()[selectedIndex].getCells()[2];
		groupNameTxt.setEditable(true);
		groupCommentTxt.setEditable(true);
		groupNameTxt.focus();
	},

	_resetEditable: function(oTable){
		var rows = oTable.getRows();
		for(var i = 0; i < rows.length; i++){
			var cells = oTable.getRows()[i].getCells();
			for(var j = 0; j < cells.length; j++){
				if(cells[j].getEditable()){
					cells[j].setEditable(false);
				}
			}
		}
		sap.ui.getCore().byId("editBtn").removeStyleClass("hiddenStyle");
		sap.ui.getCore().byId("doneBtn").addStyleClass("hiddenStyle");
		sap.ui.getCore().byId("cancelBtn").addStyleClass("hiddenStyle");
	},

	onCancelEdit: function(oEvent){
		var oTable = sap.ui.getCore().byId("userTb");
		this._resetEditable(oTable);
		oTable.getModel().resetChanges();
	},

	onConfirmEditGroup: function(){
		var that = this;
		var oTable = sap.ui.getCore().byId("userTb");
		var selectedIndex = oTable.getSelectedIndex();
		var selectedObject = oTable.getContextByIndex(selectedIndex);
		var oModel = oTable.getModel();
        oModel.submitChanges(
        	function(){
 				that._resetEditable(oTable);
				sap.ui.commons.MessageBox.show("Edit successfully.", "SUCCESS", "SUCCESS");
 			},
 			function(){
				that._resetEditable(oTable);
				sap.ui.commons.MessageBox.show("Edit failed.", "ERROR", "ERROR");
			}
		);
	},

	assignUserToGroup: function(oEvent){
		var that = this;
		var oTable = sap.ui.getCore().byId("userListTbl");
		var selectedArray = oTable.getSelectedIndices();
		var selectedGroupId = sap.ui.getCore().byId("groupDropdown").getSelectedKey();
		var newMap = [];
		var oEntry = {};

		if(selectedGroupId == ""){
			alert("please select a group");
			return;
		}
		if(selectedArray.length == 0){
			alert("please select users");
			return;
		}

		var oContent = oEvent.getSource().getParent().getParent().getParent();
		if(!oContent.isBusy()){
			oContent.setBusy(true);
		}

		oEntry.ID = "123"; //fake
		oEntry.GROUP_ID = selectedGroupId;

		for(var i = 0; i < selectedArray.length; i++){
			var selectedObject = oTable.getContextByIndex(selectedArray[i]).getObject();
			//console.log(selectedArray[i]);
			oEntry = $.extend(true, {}, oEntry);
			oEntry.USER_ID = selectedObject.USER_ID;
			oEntry.MODULE_ID = selectedObject.MODULE_ID;
			newMap.push(oEntry);
		}
		var service = new lenovo.service.Common();
		var batchModel = new sap.ui.model.odata.ODataModel(service.getUserInfo(), true);
		var batchChanges = [];
        for (var k = 0; k < newMap.length; k++) {
            batchChanges.push(batchModel.createBatchOperation("/MAP_GROUPUSER", "POST", newMap[k]));
        }

        batchModel.addBatchChangeOperations(batchChanges);
        batchModel.submitBatch(function(data, response, errorResponse) {
        	if (errorResponse && errorResponse.length > 0) {
                that._handleFailed();
            } else {
                that._changeGroup();
            }
        }, function(data) {
            that._handleFailed();
        });
	},

	unAssignUserToGroup: function(oEvent){
		var that = this;
		var oTable = sap.ui.getCore().byId("userAssignTb");
		var selectedArray = oTable.getSelectedIndices();
		var selectedGroupId = sap.ui.getCore().byId("groupDropdown").getSelectedKey();

		if(selectedGroupId == ""){
			alert("please select a group");
			return;
		}
		if(selectedArray.length == 0){
			alert("please select users");
			return;
		}

		var oContent = oEvent.getSource().getParent().getParent().getParent();
		if(!oContent.isBusy()){
			oContent.setBusy(true);
		}
		var batchModel = new sap.ui.model.odata.ODataModel(this.userInfoUrl, true);
		var batchChanges = [];
       
		for(var i = 0; i < selectedArray.length; i++){
			var selectedObject = oTable.getContextByIndex(selectedArray[i]).getObject();
			batchChanges.push(batchModel.createBatchOperation("/MAP_GROUPUSER('" + selectedObject.ID_GROUP_USER + "')", "delete"));
		}

        batchModel.addBatchChangeOperations(batchChanges);
        batchModel.submitBatch(function(data, response, errorResponse) {
        	if (errorResponse && errorResponse.length > 0) {
                that._handleFailed();
            } else {
                that._changeGroup();
            }
        }, function(data) {
            that._handleFailed();
        });
	},

	onMaintainRG : function(oEvent){
		var context = this;
		context.oRoleModel = new sap.ui.model.odata.ODataModel(this.userInfoUrl, true);
		context.oRoleNotInModel = new sap.ui.model.odata.ODataModel(this.userInfoUrl, true);
		context.oDropModel = new sap.ui.model.odata.ODataModel(this.userInfoUrl, true);
		context.oDropModel.attachRequestCompleted($.proxy(context._addRoleDropDownDefault,context));

		var oCont = $.proxy(context._createRoleGroupView,context)();

		var dialog = new Dialog("maintain-role-group",{
			title: "Maintain Role Group",
			contentWidth:"800px",
			resizable: true,
			keepInWindow: true,
			height: "400px",
			modal: true,
			content: oCont,
			closed:function(){
				this.destroy();
			},
		});
		dialog.open();
		dialog.ondragstart = false;

		var oButton = new sap.ui.commons.Button("ugDone",{
			text : "Close", 
			press: function(){
				dialog.close();
			}});
		dialog.addButton(oButton);
	},

	//show the view of Maintain Role Group
	_createRoleGroupView: function(){
		//Init the splitter
		var oSplitterV = new sap.ui.commons.Splitter("splitterV"); 
		oSplitterV.setShowScrollBars(false);
		oSplitterV.setSplitterOrientation(sap.ui.commons.Orientation.vertical);
		oSplitterV.setSplitterPosition("50%");
		oSplitterV.setMinSizeFirstPane("50%");
		oSplitterV.setMinSizeSecondPane("50%");
		oSplitterV.setSplitterBarVisible(false);
		oSplitterV.setWidth("600px");
		oSplitterV.setHeight("300px");
		oSplitterV.addStyleClass("userGroup");

		//bind group into dropdown item
		var oItemTemplate1 = new sap.ui.core.ListItem();
		oItemTemplate1.bindProperty("text", "NAME");
		oItemTemplate1.bindProperty("key", "ID");

		//add group information into the left panel
		var oSelectForm = new sap.ui.layout.Grid("selectGroup",{
				hSpacing: 0,
				vSpacing: 1, 	
				content: [
					new sap.ui.commons.Label({
						text: 'Group Name:',
						layoutData : new sap.ui.layout.GridData({
							span: "L4"
						})
					}),
					new sap.ui.commons.DropdownBox("groupDropdown",{				
						width: "100%",
						searchHelpEnabled: false,
						change: $.proxy(this._changeRoleGroup,this),
						layoutData : new sap.ui.layout.GridData({
							span: "L5"
						})
					}).setModel(this.oDropModel).bindItems("/INFO_ROLEGROUP",oItemTemplate1),
					new sap.ui.commons.Button("creategroup",{
						toolTip: "Create Group",
						width: "100%",
						icon: "sap-icon://add",
						lite: true,
						layoutData : new sap.ui.layout.GridData({
							span: "L1"
					}),
						press:  $.proxy(this._handleNewRoleGroup,this)
					}),
					new sap.ui.commons.Button("editgroup",{
						toolTip: "Edit Group",
						width: "100%",
						icon: "sap-icon://edit",
						lite: true,
						layoutData : new sap.ui.layout.GridData({
							span: "L1"
					}),
						press:  $.proxy(this._handleNewRoleGroup,this)
					}),
					new sap.ui.commons.Button({
						toolTip: "Delete Group",
						width: "100%",
						icon: "sap-icon://delete",
						lite: true,
						layoutData : new sap.ui.layout.GridData({
							span: "L1"
					}),
						press:  $.proxy(this._deleteRoleGroup,this)
					}),
					
				]
			});

		//add new group input box as hidden
		oSplitterV.addFirstPaneContent(oSelectForm);
		var oNewForm = new sap.ui.layout.Grid("newGroup",{
				hSpacing: 0,
				vSpacing: 1, 	
				content: [
					new sap.ui.commons.Label({
						text: 'Group Name:',
						layoutData : new sap.ui.layout.GridData({
							span: "L4"
						})
					}),
					new sap.ui.commons.TextField("newGroupInput",{
						width: "100%",
						layoutData : new sap.ui.layout.GridData({
							span: "L6"
						})
					}),
					new sap.ui.commons.Button({
						toolTip: "Done",
						width: "100%",
						layoutData : new sap.ui.layout.GridData({
							span: "L1"
						}),
						lite: true,
						icon: "sap-icon://accept",
						press: $.proxy(this._handleRoleDone,this)
					}),
					new sap.ui.commons.Button({
						toolTip: "Cancel",
						width: "100%",
						layoutData : new sap.ui.layout.GridData({
							span: "L1"
						}),
						lite: true,
						icon: "sap-icon://undo",
						press: $.proxy(this._handleRoleCancel,this)
					})
					
				]
			});
		oNewForm.addStyleClass("hiddenStyle");
		oSplitterV.addFirstPaneContent(oNewForm);

		//add new group Confirm box as hidden
		oSplitterV.addFirstPaneContent(oSelectForm);
		var oNewForm = new sap.ui.layout.Grid("newConfirm",{
				hSpacing: 0,
				vSpacing: 1, 	
				content: [
					new sap.ui.commons.Label({
						text: 'Group Name:',
						layoutData : new sap.ui.layout.GridData({
							span: "L4"
						})
					}),
					new sap.ui.commons.TextField("confirmGroup",{
						enabled: false,
						width: "100%",
						layoutData : new sap.ui.layout.GridData({
							span: "L6"
						})
					})
				]
			});
		oNewForm.addStyleClass("hiddenStyle");
		oSplitterV.addFirstPaneContent(oNewForm);

		//add user assignment into left bottom panel
		var oRoleAssignTable = new sap.ui.table.Table("roleAssignTb",{
			width : "240px",
			visibleRowCount: 9,
			noDataText : "No role assigned into this group",
			columnHeaderVisible: false
		});
		oRoleAssignTable.setSelectionMode(sap.ui.table.SelectionMode.MultiToggle);
		oRoleAssignTable.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "ID"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "ROLE_ID"),
        	sortProperty: "ID",
        	filterProperty: "ID",
        	width: "70px",
        }));
        oRoleAssignTable.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "Role Name"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "DISPLAY_ROLE_NAME"),
        	sortProperty: "DISPLAY_ROLE_NAME",
        	filterProperty: "DISPLAY_ROLE_NAME",
        	width: "140px",
        }));
         oRoleAssignTable.addColumn(new sap.ui.table.Column({
         	label: new sap.ui.commons.Label({text: ""}),
         	template: new sap.ui.commons.TextView().bindProperty("text", "ID"),
         	visible: false,
         	width: "140px",
         }));
         oRoleAssignTable.setModel(this.oRoleModel);

        // add assign button
        var oUnassignBtn = new sap.ui.commons.Button({
			toolTip: "Unassign",
			width: "100%",
			lite: true,
			icon: "sap-icon://open-command-field",
			press: $.proxy(this.unAssignRoleToGroup,this)
		});
        var oAssignBtn = new sap.ui.commons.Button({
			toolTip: "Assign",
			width: "100%",
			lite: true,
			icon: "sap-icon://close-command-field",
			press: $.proxy(this.assignRoleToGroup,this)
		});
        var oVLayout = new sap.ui.layout.VerticalLayout("vLayout", {
			content: [oUnassignBtn, oAssignBtn]
		});
		oVLayout.addStyleClass("assignUser");
		var oHLayout = new sap.ui.layout.HorizontalLayout("hLayout", {
			content: [oRoleAssignTable, oVLayout]
		});
        
		oSplitterV.addFirstPaneContent(oHLayout);

		//add user list into the right panel
		var oRoleTable = new sap.ui.table.Table("roleListTbl",{
			width : "300px",
			visibleRowCount: 9
		});
		oRoleTable.setSelectionMode(sap.ui.table.SelectionMode.MultiToggle);
		oRoleTable.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "ID"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "ROLE_ID"),
        	sortProperty: "ROLE_ID",
        	filterProperty: "ROLE_ID",
        	width: "100px",
        }));
        oRoleTable.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "Role Name"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "DISPLAY_ROLE_NAME"),
        	sortProperty: "DISPLAY_ROLE_NAME",
        	filterProperty: "DISPLAY_ROLE_NAME",
        	width: "150px",
        }));
		oSplitterV.addSecondPaneContent(oRoleTable);	

		return oSplitterV;
	},

	_handleRoleCancel: function(){
		sap.ui.getCore().byId("selectGroup").removeStyleClass("hiddenStyle");
		sap.ui.getCore().byId("newGroup").addStyleClass("hiddenStyle");
		sap.ui.getCore().byId("newGroupInput").setValue("");
	},

	_handleRoleDone: function(){
		if(this.flag == 1){
			this._getRoleGroupNameAfterCreate(sap.ui.getCore().byId("newGroupInput").getValue());
		}
		else if(this.flag == 2){
			this._getRoleGroupNameAfterCreate(this.selectRoleGroupId);
		}
	},

	_handleNewRoleGroup: function(oEvent){
		sap.ui.getCore().byId("newGroup").removeStyleClass("hiddenStyle");
		sap.ui.getCore().byId("selectGroup").addStyleClass("hiddenStyle");
		//sap.ui.getCore().byId("groupDropdown").setSelectedItemId("default");
		sap.ui.getCore().byId("roleAssignTb").unbindRows();
		sap.ui.getCore().byId("roleListTbl").unbindRows();
		if(oEvent.getSource().sId == "creategroup"){
			this.flag = 1;
			sap.ui.getCore().byId("newGroupInput").setValue("");
		}
		else if(oEvent.getSource().sId == "editgroup"){
			var dropdown = sap.ui.getCore().byId("groupDropdown");
		    var oModel = dropdown.getModel();
		    var index = dropdown.getSelectedKey();
		    if(index == undefined || index == "-1"){
				sap.ui.commons.MessageBox.show("Please select a role group.", "ERROR", "Maintain Role Group");
				this._handleCancel();
			}
			this.flag = 2;
			this.selectRoleGroupId = index;
			var input = sap.ui.getCore().byId(dropdown.getSelectedItemId()).getBindingContext().getObject().NAME;
			this.oldInput = input;
			sap.ui.getCore().byId("newGroupInput").setValue(input);
		}
		sap.ui.getCore().byId("groupDropdown").setSelectedItemId("default");
	},

	_handleCreateRoleSuccess: function(data){
		sap.ui.getCore().byId("newGroup").addStyleClass("hiddenStyle");
		sap.ui.getCore().byId("selectGroup").removeStyleClass("hiddenStyle");
		if(this.flag == 1){
			sap.ui.commons.MessageBox.show("Create Successful.", "SUCCESS", "Maintain Role Group");
		}
		else if(this.flag == 2){
			sap.ui.commons.MessageBox.show("Update Successful.", "SUCCESS", "Maintain Role Group");
		}
		var oContent = sap.ui.getCore().byId("splitterV");
		if(oContent.isBusy()){
			oContent.setBusy(false);
		}
	},

	_handleRoleFailed: function(data){
		sap.ui.commons.MessageBox.show("Failed.", "ERROR", "Maintain Role Group");
		var oContent = sap.ui.getCore().byId("splitterV");
		if(oContent.isBusy()){
			oContent.setBusy(false);
		}
	},

	_addRoleDropDownDefault: function(){
		//add default option into dropdown
		var dropDown = sap.ui.getCore().byId("groupDropdown");
		var firstKey = "";
		if(dropDown.getItems().length > 0){
			dropDown.insertItem(new sap.ui.core.ListItem("default", {text:"-Select-", additionalText:""}),0);
		}
	},

	_changeRoleGroup: function(){
		var dropdown = sap.ui.getCore().byId("groupDropdown");
		var selectedIndex = dropdown.getSelectedKey();
		var oTable = sap.ui.getCore().byId("roleListTbl");
		var oAssignTable = sap.ui.getCore().byId("roleAssignTb");

		if(dropdown.getSelectedItemId()=="default"){
			oAssignTable.unbindRows();
			oTable.unbindRows();
			return;
		}

		//update the list of users who assign into this group
		oAssignTable.bindRows("/INFO_ROLEGROUP("+ selectedIndex +")/MAP_ROLEGROUP");

		// //update the list of users who are not in this group
		var path = this.userInfoUrl + "/InputParamsMAPROLEGROUP(P_ROLEGROUP_ID=" + selectedIndex + ")/Results";
		var oJsonModel = new sap.ui.model.json.JSONModel();
		oJsonModel.loadData(path,[],false);
		oTable.setModel(oJsonModel);
        oTable.bindRows("/d/results");

        oTable.clearSelection();
        oAssignTable.clearSelection();
	},

	_getRoleGroupNameAfterCreate: function(groupName){
		if(groupName == ""){
			sap.ui.commons.MessageBox.show("Please enter Group name.", "ERROR", "Create Role Group");
			return;
		}
		if(this.flag == 1){
			this._createRoleGroupService(groupName);
		}
		else if(this.flag == 2){
			this.updateRoleGroup(groupName);
		}
	},

	_createRoleGroupService: function(groupName){
		var oContent = sap.ui.getCore().byId("splitterV");
		if(!oContent.isBusy()){
			oContent.setBusy(true);
		}
		var that = this;
		var oModel = sap.ui.getCore().byId("groupDropdown").getModel();
		var oModel_user = sap.ui.getCore().getModel("user"),
			module_id = oModel_user.getProperty("/moduleid");
		var oEntry = {};
		oEntry.NAME = groupName;
		oEntry.ID = "123";
		oEntry.COMMENT = groupName;
		oEntry.MODULE_ID = module_id;
		// oEntry.MODULE_NAME = "CFE";
		oModel.setHeaders({
            "content-type": "application/json;charset=utf-8"
        });
        oModel.create('/INFO_ROLEGROUP', oEntry,{
        	async : true,
        	success: $.proxy(that._handleCreateRoleSuccess,that), 
        	error : that._handleRoleFailed}
        );
	},

	//delete group service
	_deleteRoleGroup: function(){
		var oContent = sap.ui.getCore().byId("splitterV");
		if(!oContent.isBusy()){
			oContent.setBusy(true);
		}
		var dropdown = sap.ui.getCore().byId("groupDropdown");
		var oModel = dropdown.getModel();
		var index = dropdown.getSelectedKey();
		if(index == undefined || index == "-1"){
			sap.ui.commons.MessageBox.show("Please select a role group.", "ERROR", "Maintain Role Group");
			return;
		}
		var oAssignTable = sap.ui.getCore().byId("roleAssignTb");
        var oAssignModel = oAssignTable.getModel();
        var oRoleList = sap.ui.getCore().byId("roleListTbl");
        var oListModel = oRoleList.getModel();
        //console.log(index);
        oModel.remove("/INFO_ROLEGROUP("+ index + ")", {
        		async : true,
                fnSuccess: function(oData, oResponse) {
                    sap.ui.commons.MessageBox.show("Group deleted successfully.", "SUCCESS", "Delete Role Group");
                    oAssignModel.refresh();
                    oListModel.refresh();
                    if(oContent.isBusy()){
						oContent.setBusy(false);
					}
                },
                fnError: function() {
                    sap.ui.commons.MessageBox.show("Could not delete the Group.", "ERROR", "Delete Role Group");
                    if(oContent.isBusy()){
						oContent.setBusy(false);
					}
                }
            });
	},

	//update group service
	updateRoleGroup: function(selectRoleGroupId){
		var oContent = sap.ui.getCore().byId("splitterV");
		if(!oContent.isBusy()){
			oContent.setBusy(true);
		}
		var dropdown = sap.ui.getCore().byId("groupDropdown");
		var oModel = dropdown.getModel();
		var index = selectRoleGroupId;
		if(index == undefined || index == "-1"){
			return;
		}

		var oTable = sap.ui.getCore().byId("newGroupInput");
		var oldInput = this.oldInput;
		var newInput = oTable.getLiveValue();
		if(oldInput == newInput){
			sap.ui.commons.MessageBox.show("New name is same as the old.", "WARNING", "Role Group Update");
			return;
		}
		var oEntry = {
			ID : index,
			NAME : newInput,
			COMMENT : newInput
		}
		oModel.update("/INFO_ROLEGROUP("+ index + ")", oEntry,{ 
        	async : true,
        	success : $.proxy(this._handleCreateRoleSuccess,this), 
        	error : this._handleRoleFailed}
        );
	},

	assignRoleToGroup: function(oEvent){
		var that = this;
		var oTable = sap.ui.getCore().byId("roleListTbl");
		var selectedArray = oTable.getSelectedIndices();
		var selectedGroupId = sap.ui.getCore().byId("groupDropdown").getSelectedKey();
		var newMap = [];
		var oEntry = {};
		var oModel_user = sap.ui.getCore().getModel("user"),
			module_id = oModel_user.getProperty("/moduleid");
		if(selectedGroupId == ""){
			alert("please select a group");
			return;
		}
		if(selectedArray.length == 0){
			alert("please select roles");
			return;
		}

		var oContent = oEvent.getSource().getParent().getParent().getParent();
		if(!oContent.isBusy()){
			oContent.setBusy(true);
		}

		oEntry.ID = "123" //fake
		oEntry.MODULE_ID = module_id;
		oEntry.ROLEGROUP_ID = selectedGroupId;

		for(var i = 0; i < selectedArray.length; i++){
			var selectedObject = oTable.getContextByIndex(selectedArray[i]).getObject();
			//console.log(selectedArray[i]);
			oEntry = $.extend(true, {}, oEntry);
			oEntry.ROLE_ID = selectedObject.ROLE_ID;
			newMap.push(oEntry);
		}
		var service = new lenovo.service.Common();
		var batchModel = new sap.ui.model.odata.ODataModel(this.userInfoUrl, true);
		var batchChanges = [];
        for (var k = 0; k < newMap.length; k++) {
            batchChanges.push(batchModel.createBatchOperation("/INFO_ROLE", "POST", newMap[k]));
        }

        batchModel.addBatchChangeOperations(batchChanges);
        batchModel.submitBatch(function(data, response, errorResponse) {
        	if (errorResponse && errorResponse.length > 0) {
                that._handleRoleFailed();
            } else {
                that._changeRoleGroup();
            }
            if(oContent.isBusy()){
				oContent.setBusy(false);
			}
        }, function(data) {
            that._handleRoleFailed();
        });
	},

	unAssignRoleToGroup: function(oEvent){
		var that = this;
		var oTable = sap.ui.getCore().byId("roleAssignTb");
		var selectedArray = oTable.getSelectedIndices();
		var selectedGroupId = sap.ui.getCore().byId("groupDropdown").getSelectedKey();

		if(selectedGroupId == ""){
			alert("please select a group");
			return;
		}
		if(selectedArray.length == 0){
			alert("please select roles");
			return;
		}

		var oContent = oEvent.getSource().getParent().getParent().getParent();
		if(!oContent.isBusy()){
			oContent.setBusy(true);
		}

		var batchModel = new sap.ui.model.odata.ODataModel(this.userInfoUrl, true);
		var batchChanges = [];
       

		for(var i = 0; i < selectedArray.length; i++){
			var selectedObject = oTable.getContextByIndex(selectedArray[i]).getObject();
			batchChanges.push(batchModel.createBatchOperation("/INFO_ROLE('" + selectedObject.ID + "')", "delete"));
		}

        batchModel.addBatchChangeOperations(batchChanges);
        batchModel.submitBatch(function(data, response, errorResponse) {
        	if (errorResponse && errorResponse.length > 0) {
                that._handleRoleFailed();
            } else {
                that._changeRoleGroup();
            }
            if(oContent.isBusy()){
				oContent.setBusy(false);
			}
        }, function(data) {
            that._handleRoleFailed();
        });
	},

	onSetAdmin: function(oEvent){
		var oModel_user = sap.ui.getCore().getModel("user"),
			userId = oModel_user.getProperty("/userid"),
			type = oModel_user.getProperty("/type"),
			f_admin = oModel_user.getProperty("/admin");
		if ((type == "usergroup") || (userId == 1)) {
			sap.ui.commons.MessageBox.show("Please choose one user.", "ERROR", "Maintain Admin Role");
			return;
		}

		$.ajax({
					url: this.adminUrl + "?user_id=" + userId,
					type: "POST",
					dataType: "text",
					contentType: "application/json",
					success: function(msg) {
						oModel_user.setProperty("/admin", !f_admin); 
						sap.ui.commons.MessageBox.show("Maintain Admin Role successfully!", "SUCCESS", "Maintain Admin Role");
					},
					error: function(e) {
						sap.ui.commons.MessageBox.show("Maintain Admin Role failed!", "ERROR", "Maintain Admin Role");
					} 
				});
	},

	onDownloadRelationship: function(oEvent){
		var oButton1 = new sap.ui.commons.Link({
			text: "User map",
			press: function(){
				var url = location.origin + '/cdp/common/services/getFile.xsjs?table="_SYS_BIC"."cdp.security.models/CV_GET_ALL_USER"&column=GROUP_NAME&column=USER_NAME&column=MODULE_NAME&rolename=securityAccess&filename=users';
				window.open(url);
			}
		});
		var oButton2 = new sap.ui.commons.Link({
			text: "Function role map",
			press: function(){
				var url = location.origin + '/cdp/common/services/getFile.xsjs?table="_SYS_BIC"."cdp.security.models/CV_GET_ALL_FUNCTION_ROLE"&column=ROLEGROUP_NAME&column=ROLE_NAME&column=MODULE_NAME&rolename=securityAccess&filename=functionrole';
				window.open(url);
			}
		});
		var oButton3 = new sap.ui.commons.Link({
			text: "User and function role map",
			press: function(){
				var url = location.origin + '/cdp/common/services/getFile.xsjs?table="_SYS_BIC"."cdp.security.models/CV_GROUP_USER_FUNCTION_ROLE"&column=GROUP_NAME&column=USER_NAME&column=ROLEGROUP_NAME&column=ROLE_NAME&column=DISPLAY_ROLE_NAME&column=MODULE_NAME&rolename=securityAccess&filename=map_user_functionrole';
				window.open(url);
			}
		});
		var oButton4 = new sap.ui.commons.Link({
			text: "User and resource role map",
			press: function(){
				var url = location.origin + '/cdp/common/services/getFile.xsjs?table="_SYS_BIC"."cdp.security.models/CV_GET_USER_RESOURCE"&column=GROUP_NAME&column=USER_NAME&column=RESOURCE_TYPE&column=VALUE&column=MODULE_NAME&rolename=securityAccess&filename=map_user_resourcerole';
				window.open(url);
			}
		});
		var oCont = new sap.ui.commons.layout.VerticalLayout({
			content: [oButton1, oButton2, oButton3, oButton4]
		});
		var dialog = new Dialog({
			title: "Download Relationship",
			contentWidth:"800px",
			resizable: true,
			keepInWindow: true,
			height: "400px",
			modal: true,
			content: [oCont],
			closed:function(){
				this.destroy();
			},
		}).addStyleClass("download-relationship");
		dialog.open();
		dialog.ondragstart = false;

		var oButton = new sap.ui.commons.Button({
			text : "Close", 
			press: function(){
				dialog.close();
			}});
		dialog.addButton(oButton);
	}
});