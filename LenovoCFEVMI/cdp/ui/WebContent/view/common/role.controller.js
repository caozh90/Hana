jQuery.sap.require("lenovo.control.Controller");
jQuery.sap.require("lenovo.service.Common");
lenovo.control.Controller.extend("lenovo.view.common.role", {
	onInit: function() {
		var context = this;
		var oModel_user = sap.ui.getCore().getModel("user");
		oModel_user.bindProperty("/id").attachChange(function(oEvent) {
			this.updateTab();
		}, context);
		oModel_user.bindProperty("/admin").attachChange(function(oEvent) {
			this.updateTab();
		}, context);
		this.service = new lenovo.service.Common();
		this.userInfoUrl = this.service.getUserInfo();
		this.oModel = new sap.ui.model.odata.ODataModel(this.userInfoUrl, true);
		this.oModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);

		$.getJSON(this.userInfoUrl + "/MAP_VIEWROLE?$filter=VIEW_NAME eq 'user' and MAP_TYPE eq 'controllor' &$format=json", function(data){
			var roleSetupVisible = false,
				roleAdminVisible = false;
			data["d"]["results"].forEach(function(e){
				if(e["ROLE_NAME"] == "cdp.security.roles::roleSetup"){
					roleSetupVisible = true;
				}
				if(e["ROLE_NAME"] == "cdp.security.roles::roleAdmin"){
					roleAdminVisible = true;
				}
			});			
			sap.ui.getCore().byId("resource").setVisible(roleSetupVisible);
			sap.ui.getCore().byId("assignRole").setVisible(roleSetupVisible);
			sap.ui.getCore().byId("deleteRole").setVisible(roleSetupVisible);
			sap.ui.getCore().byId("maintainRole").setVisible(roleAdminVisible);			
        });
	},

	updateTab: function() {
		var oModel_user = sap.ui.getCore().getModel("user"),
			Id = oModel_user.getProperty("/id"),
			userId = oModel_user.getProperty("/userid"),
			groupId = oModel_user.getProperty("/groupid");
		var module_id = "1000000001";//cfe
		// if (Id == 1) {
		// 	sap.ui.commons.MessageBox.show("Please choose one user or user group.", "ERROR", "Read Role");
		// 	return;
		// }
		var filters = [];

		if(userId != 0){
			filters.push(new sap.ui.model.Filter("GROUP_ID",sap.ui.model.FilterOperator.EQ,0));
			filters.push(new sap.ui.model.Filter("USER_ID",sap.ui.model.FilterOperator.EQ,userId));
		}
		else{
			filters.push(new sap.ui.model.Filter("GROUP_ID",sap.ui.model.FilterOperator.EQ,groupId));
			filters.push(new sap.ui.model.Filter("USER_ID",sap.ui.model.FilterOperator.EQ,0));
		}

		var sPath = "MAP_ALL_ROLEGROUP/?$format=json&$expand=MAP_ALL_ROLEINFO&$select=ROLEGROUP_ID,DISPLAY_NAME,MAP_ALL_ROLEINFO/ROLE_ID,MAP_ALL_ROLEINFO/ROLE_NAME,MAP_ALL_ROLEINFO/ROLEGROUP_ID,MAP_ALL_ROLEINFO/DISPLAY_NAME";
		this.oModel.read(
			sPath, {
				async: true,
				success: $.proxy(function(oData, response) {
				var outputJson = {};
				var p = 0;
				var r = {};

		        if (oData.results){
		            r = oData.results;
		        }

				$.each(r, function(i, j) {
					outputJson[p] = {};
					outputJson[p]["Name"] = j.DISPLAY_NAME;
					outputJson[p]["Id"] = j.ROLEGROUP_ID;
					outputJson[p]["RolegroupId"] = 0;
					outputJson[p]["DisplayName"] = j.DISPLAY_NAME;
					if(0 == j.ROLEGROUP_ID){
						outputJson[p]["Default"] = true;
					}
					else{
						outputJson[p]["Default"] = false;
					}
					var m = 0;

					if (j.MAP_ALL_ROLEINFO.results.length > 0) {
						$.each(j.MAP_ALL_ROLEINFO.results, function(a, b) {
							outputJson[p][m] = {
								Name: b.ROLE_NAME,
								Id: b.ROLE_ID,
								RolegroupId: b.ROLEGROUP_ID,
								DisplayName: b.DISPLAY_NAME
							};
							if (outputJson[p]["Default"]) {
								outputJson[p][m]["Default"] = true;
							} else {
								outputJson[p][m]["Default"] = false;
							}
							m++;
						});
					}
					p++;
				});

				var oPM = new sap.ui.model.json.JSONModel();
				oPM.setData(outputJson);

				var oRoleTree = sap.ui.getCore().byId("role-tree");
				oRoleTree.setModel(oPM);
				oRoleTree.bindRows({
					path: "/"
				});
				oRoleTree.clearSelection();
				if(oRoleTree.isBusy()){
					oRoleTree.setBusy(false);
				}
				}, this),
				error: $.proxy(function(oError) {
					sap.ui.commons.MessageBox.show("Read Role&Role Group tree failed!", "ERROR", "Read Role");
				}, this),
				filters: filters
			}
		);

		var resourcelayout = sap.ui.getCore().byId("resource");
		resourcelayout.setVisible(true);
		var oRoleTable = sap.ui.getCore().byId("role-table");
		oRoleTable.setNoDataText(" ");

		if (userId != 0) {
			sPath = "/InputParamsMAPRESOURCE(P_GROUP_ID=" + 0 + ",P_USER_ID=" + userId + ")/Results";
		} else {
			sPath = "/InputParamsMAPRESOURCE(P_GROUP_ID=" + groupId + ",P_USER_ID=" + 0 + ")/Results";
		}

		oRoleTable.setModel(this.oModel);
		oRoleTable.bindRows({
			path: sPath
		});
		oRoleTable.clearSelection();
		if (oRoleTable.isBusy()) {
			oRoleTable.setBusy(false);
		}
	},

	onAssignR: function(oEvent) {
		var context = this;
		var oModel_user = sap.ui.getCore().getModel("user"),
			userId = oModel_user.getProperty("/id");
		if (userId == 1) {
			sap.ui.commons.MessageBox.show("Please choose one user or user group.", "ERROR", "Assign Role");
			return;
		}
		var oAssignRList = this.assignList(userId);
		var dialog = new Dialog("assignR", {
			title: "Assgin Role&Role Group",
			contentWidth: "500px",
			resizable: false,
			keepInWindow: true,
			modal: true,
			content: oAssignRList,
			closed: function() {
				this.destroy();
			},
		});
		dialog.addStyleClass("role-list");
		dialog.open();
		dialog.ondragstart = false;

		var oButton = new sap.ui.commons.Button({
			text: "Assign",
			press: $.proxy(context.assignR, context)
		});
		dialog.addButton(oButton);
	},

	assignList: function(oSelectUserId) {
		var context = this;
		var oAssignTree = new sap.ui.table.TreeTable("assigntree", {
			selectionMode: sap.ui.table.SelectionMode.MultiToggle,
			enableColumnReordering: true,
			//expandFirstLevel: true,
			width: "500px",
			height: "300px",
			columnHeaderVisible: false
		});
		var oTemplate = new sap.ui.commons.TextField({
			editable: false
		}).bindProperty("value", "display_role_name");
		oAssignTree.addColumn(new sap.ui.table.Column({
			template: oTemplate,
			filterProperty: "display_role_name",
			filterOperator: sap.ui.model.FilterOperator.EQ,
			sortProperty: "display_role_name",
			flexible: true,
			label: new sap.ui.commons.Label({
                    text: "Role&Role Group Name"
                }),
		}));
		var oModel_user = sap.ui.getCore().getModel("user"),
			//Id = oModel_user.getProperty("/id"),
			userId = oModel_user.getProperty("/userid"),
			groupId = oModel_user.getProperty("/groupid");
		var module_id = oModel_user.getProperty("/moduleid");//cfe

		if (userId != 0) {
			var oEntry = {
				module_id: module_id,
				group_id: 0,
				user_id: userId
			};
		}
		else{
			var oEntry = {
				module_id: module_id,
				group_id: groupId,
				user_id: 0
			};
		}

		this.service.getUserRoleTree(oEntry).done($.proxy(function(data) {
				var oPM = new sap.ui.model.json.JSONModel();
		 		oPM.setData(data);
				oAssignTree.setModel(oPM);
				oAssignTree.bindRows({
					path: "/root"
				});
			})
		);		
		return oAssignTree;
	},

	getParentObject: function(oTable,i) {
		var parentElement = [];
		parentElement = oTable.getContextByIndex(i).getPath().split("/");
		var parentPath = "/" + parentElement[1] + "/" +  parentElement[2];
		var parentObject = oTable.getModel().getContext(parentPath).getObject();
		return parentObject;
	},

	checkParentNode: function(oTable,i) {
		var r = true;
		var parentElement = [];
		parentElement = oTable.getContextByIndex(i).getPath().split("/");
		if(parentElement.length > 3)
			r = false;
		return r;
	},

	assignR: function(oEvent) {
		oEvent.getSource().getParent().close();
		var that = this;
		var oRoleTree = sap.ui.getCore().byId("role-tree");
		var oTable = sap.ui.getCore().byId("assigntree");
		//var oDialog = oEvent.getSource().getParent();
		var index = oTable.getSelectedIndices();
		if (index == undefined || index == []) {
			sap.ui.commons.MessageBox.show("Please select one role or role group at least!", "ERROR", "Assign Role");
			return;
		}
		if(!oRoleTree.isBusy()){
			oRoleTree.setBusy(true);
		}
		var oModel_user = sap.ui.getCore().getModel("user"),
			userId = oModel_user.getProperty("/userid"),
			groupId = oModel_user.getProperty("/groupid");
		var module_id = oModel_user.getProperty("/moduleid");//cfe

		var oEntry = [],
			oEntryObject = {};
		oEntryObject.MODULE_ID = module_id;
		oEntryObject.ROLE_NAME = " ";
		if(userId != 0){
			oEntryObject.GROUP_ID = "0";
			oEntryObject.USER_ID = userId;
		}
		else {
			oEntryObject.GROUP_ID = groupId;
			oEntryObject.USER_ID = "0";
		}

		for (var i = 0; i < index.length; i++) {
			oEntryObject = $.extend(true, {}, oEntryObject);
			if(that.checkParentNode(oTable,index[i])){
				oEntryObject.ROLEGROUP_ID = oTable.getContextByIndex(index[i]).getObject().id.toString();
				oEntryObject.ROLE_ID = "0";
			}
			else{
				oEntryObject.ROLEGROUP_ID = "0";
			 	oEntryObject.ROLE_ID = oTable.getContextByIndex(index[i]).getObject().id.toString();
			}
			
			oEntry.push(oEntryObject);
		}

		var batchChanges = [];
		for (var k = 0; k < oEntry.length; k++) {
		    batchChanges.push(that.oModel.createBatchOperation("/MAP_ALL_ROLE", "POST", oEntry[k]));
		}

		that.oModel.addBatchChangeOperations(batchChanges);

		that.oModel.submitBatch(function(oData, oResponse,oError) {
			if(oError && oError.length > 0){
				//var body = JSON.parse(oError[0].response.body);
				//var errorMsg = body.error.message.value;
				//lenovo.control.commontable.Toolkit.showErrorMsg(errorMsg, "ERROR", "Assign Role");
				sap.ui.commons.MessageBox.show("Assign failed.", "ERROR", "Assign Role");
				if(oRoleTree.isBusy()){
					oRoleTree.setBusy(false);
				}
			}
			else{
				that.updateTab();
				sap.ui.commons.MessageBox.show("Assign successfully.", "SUCCESS", "Assign Role");
			}
		}, function() {
			if(oRoleTree.isBusy()){
				oRoleTree.setBusy(false);
			}
			sap.ui.commons.MessageBox.show("Assign failed.", "ERROR", "Assign Role");
		});
	},

	onDeleteR: function(oEvent) {
		var oTable = sap.ui.getCore().byId("role-tree");
		var index = oTable.getSelectedIndex();
		if (index == "-1") {
			sap.ui.commons.MessageBox.show("Please choose one role or role group.", "ERROR", "Delete Role");
			return;
		} else {
			var oSelectedObject = oTable.getContextByIndex(index).getObject();
			if(oSelectedObject.Id != 0){
				if(oSelectedObject.RolegroupId != 0){
					sap.ui.commons.MessageBox.show("Please choose role group rather than role.", "ERROR", "Delete Role");
					return;
				}
				else{
					sap.ui.commons.MessageBox.confirm("Confirm deleting?", $.proxy(this.confirmDelete, this), "Delete Role");
				}
			}
			else{
				sap.ui.commons.MessageBox.confirm("Confirm deleting?", $.proxy(this.confirmDelete, this), "Delete Role");
			}
			if (!oTable.isBusy()) {
				oTable.setBusy(true);
			}
		}
	},

	confirmDelete: function(bConfirmed) {
		var that = this;
		var oTable = sap.ui.getCore().byId("role-tree");
		if (bConfirmed) {
			var oModel_user = sap.ui.getCore().getModel("user"),
				userId = oModel_user.getProperty("/userid"),
				groupId = oModel_user.getProperty("/groupid");
			var module_id = oModel_user.getProperty("/moduleid"); //cfe

			var index = oTable.getSelectedIndex();
			if (index == undefined || index == "-1") {
				sap.ui.commons.MessageBox.show("Please select one role or role group at least!", "ERROR", "Delete Role");
				return;
			}
			var oSelected = oTable.getContextByIndex(index);
			var oSelectedObject = oSelected.getObject();

			if(userId != 0){
				if(oSelectedObject.RolegroupId != 0){
					var context = "/MAP_ALL_ROLEGROUP(MODULE_ID='" + module_id + "',GROUP_ID=" + 0 + ",USER_ID=" + userId + ",ROLEGROUP_ID=" + oSelectedObject.RolegroupId + ",ROLE_ID=" + oSelectedObject.Id + ")"; 
				}
				else{
					if(oSelectedObject.Id != 0){
						if(!oSelectedObject.Default){
							var context = "/MAP_ALL_ROLEGROUP(MODULE_ID='" + module_id + "',GROUP_ID=" + 0 + ",USER_ID=" + userId + ",ROLEGROUP_ID=" + oSelectedObject.Id + ",ROLE_ID=" + 0 + ")";
						}
						else{
							var context = "/MAP_ALL_ROLE(MODULE_ID='" + module_id + "',GROUP_ID=" + 0 + ",USER_ID=" + userId + ",ROLEGROUP_ID=" + 0 + ",ROLE_ID=" + oSelectedObject.Id + ")";
						}
					}
					else{
						var context = "/MAP_ALL_ROLEGROUP(MODULE_ID='" + module_id + "',GROUP_ID=" + 0 + ",USER_ID=" + userId + ",ROLEGROUP_ID=" + oSelectedObject.Id + ",ROLE_ID=" + 0 + ")";
					}
				}
			}
			else{
				if(oSelectedObject.RolegroupId != 0){
					var context = "/MAP_ALL_ROLEGROUP(MODULE_ID='" + module_id + "',GROUP_ID=" + groupId + ",USER_ID=" + 0 + ",ROLEGROUP_ID=" + oSelectedObject.RolegroupId + ",ROLE_ID=" + oSelectedObject.Id + ")"; 
				}
				else{
					if(oSelectedObject.Id != 0){
						if(!oSelectedObject.Default){
							var context = "/MAP_ALL_ROLEGROUP(MODULE_ID='" + module_id + "',GROUP_ID=" + groupId + ",USER_ID=" + 0 + ",ROLEGROUP_ID=" + oSelectedObject.Id + ",ROLE_ID=" + 0 + ")";
						}
						else{
							var context = "/MAP_ALL_ROLE(MODULE_ID='" + module_id + "',GROUP_ID=" + groupId + ",USER_ID=" + 0 + ",ROLEGROUP_ID=" + 0 + ",ROLE_ID=" + oSelectedObject.Id + ")";
						}
					}
					else{
						var context = "/MAP_ALL_ROLEGROUP(MODULE_ID='" + module_id + "',GROUP_ID=" + groupId + ",USER_ID=" + 0 + ",ROLEGROUP_ID=" + oSelectedObject.Id + ",ROLE_ID=" + 0 + ")";
					}
				}
			}

			that.oModel.remove(context,
				null,
				$.proxy(function(oData, response) {
					that.updateTab();
					oTable.clearSelection();
					sap.ui.commons.MessageBox.show("Delete successfully.", "SUCCESS", "Delete Role");
				}, that),
				$.proxy(function(oError) {
					if(oTable.isBusy()){
						oTable.setBusy(false);
					}
					sap.ui.commons.MessageBox.show("Delete failed.", "ERROR", "Delete Role");
				}, that)
			);
		}
		else{
			if (oTable.isBusy()) {
				oTable.setBusy(false);
			}
		}
	},

	onAddResourceRole: function(oEvent){

		var oModel_user = sap.ui.getCore().getModel("user"),
			userId = oModel_user.getProperty("/userid");
		if (userId == 1) {
			sap.ui.commons.MessageBox.show("Please choose one user.", "ERROR", "Add Role");
			return;
		}

		var oTypelist = new sap.ui.commons.DropdownBox("typelist",{
			tooltip: "resource type",
			width: "200px"
		});
		
		var sPath = "/INFO_RESOURCE_TYPE";
		this.oModel.read(
			sPath, {
				async: true,
				success: $.proxy(function(oData, response) {
					var oPM = new sap.ui.model.json.JSONModel();
					//oPM.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
					oPM.setData(oData);
					oTypelist.setModel(oPM);

					var oTypeitem = new sap.ui.core.ListItem();
					oTypeitem.bindProperty("text", "RESOURCE_TYPE");
					oTypelist.bindItems("/results", oTypeitem);

				}, this),
				error: $.proxy(function(oError) {
					sap.ui.commons.MessageBox.show("Read Resource Type failed!", "ERROR", "Add Role");
				}, this)
			}
		);

		var oLayout = new sap.ui.layout.form.GridLayout({singleColumn: true});

		var oForm = new sap.ui.layout.form.Form({
			width: "500px",
			layout: oLayout,
			formContainers: [
				new sap.ui.layout.form.FormContainer({
					formElements: [
						new sap.ui.layout.form.FormElement({
							label: new sap.ui.commons.Label({text: "Resource Type", layoutData: new sap.ui.layout.form.GridElementData({hCells: "2"})}),
							fields: [oTypelist.setLayoutData(new sap.ui.layout.form.GridElementData({hCells: "auto"}))]
						}),
						new sap.ui.layout.form.FormElement({
							label: new sap.ui.commons.Label({text: "Resource Value", layoutData: new sap.ui.layout.form.GridElementData({hCells: "2"})}),
							fields: [new sap.ui.commons.TextField("resourcevalue",{
								editable: true
								}).setLayoutData(new sap.ui.layout.form.GridElementData({hCells: "auto"}))
							]
						})
					]
				})
			]
		});

		var dialog = new Dialog("addresource", {
			title: "Add Resource",
			contentWidth: "500px",
			resizable: false,
			keepInWindow: true,
			modal: true,
			content: [oForm],
			closed: function() {
				this.destroy();
			},
		});
		dialog.open();
		dialog.ondragstart = false;

		var oButton = new sap.ui.commons.Button({
			text: "Confirm",
			press: $.proxy(this.confirmadd, this)
		});
		dialog.addButton(oButton);
	},

	confirmadd: function(oEvent){

		oEvent.getSource().getParent().close();

		var oModel_user = sap.ui.getCore().getModel("user"),
			userId = oModel_user.getProperty("/userid"),
			groupId = oModel_user.getProperty("/groupid"),
			module_id = oModel_user.getProperty("/moduleid");
		var resourcetype = sap.ui.getCore().byId("typelist").getValue();
		var resourcevalue = sap.ui.getCore().byId("resourcevalue").getValue();

		if (userId != 0) {
			var oEntry = {
				P_GROUP_ID: "0",
				P_USER_ID: userId.toString(),
				MODULE_ID: module_id,
				RESOURCE_TYPE: resourcetype,
				VALUE: resourcevalue,
				GROUP_ID: "0",
				USER_ID: userId.toString(),
				//MODULE_NAME: module_name,
				RESOURCE_ID: "123"
			};
		}
		else{
			var oEntry = {
				P_GROUP_ID: groupId.toString(),
				P_USER_ID: "0",
				MODULE_ID: module_id,
				RESOURCE_TYPE: resourcetype,
				VALUE: resourcevalue,
				GROUP_ID: groupId.toString(),
				USER_ID: "0",
				//MODULE_NAME: module_name,
				RESOURCE_ID: "123"
			};
		}

		var oRoletable = sap.ui.getCore().byId("role-table");
		if (!oRoletable.isBusy()) {
			oRoletable.setBusy(true);
		}
		var oRoletableModel = oRoletable.getModel();
		var sPath = "/USER_RESOURCE";
		this.oModel.create(sPath,
			oEntry,{
			async : true,
			success : $.proxy(function(oData, response) {
				oRoletableModel.refresh();
				if (oRoletable.isBusy()) {
					oRoletable.setBusy(false);
				}
				sap.ui.commons.MessageBox.show("Create resource successfully!", "SUCCESS", "Add Role");
			},this),
			error : $.proxy(function(oError) {
					if (oRoletable.isBusy()) {
						oRoletable.setBusy(false);
					}
					sap.ui.commons.MessageBox.show("Create resource failed!", "ERROR", "Add Role");
			}, this)}
		);
	},

	onEditResourceRole: function(oEvent){
		var oTable = sap.ui.getCore().byId("role-table");
		var selectedIndex = oTable.getSelectedIndex();

		if(selectedIndex == "-1"){
			sap.ui.commons.MessageBox.show("Please choose a resource!", "ERROR", "Edit Role");
			return;
		}

		//sap.ui.getCore().byId("editRBtn").addStyleClass("hiddenStyle");
		sap.ui.getCore().byId("doneRBtn").removeStyleClass("hiddenStyle");
		sap.ui.getCore().byId("cancelRBtn").removeStyleClass("hiddenStyle");
	
        this.updateResource(selectedIndex);
	},

	updateResource: function(selectedIndex){
		var oTable = sap.ui.getCore().byId("role-table");
		var resourceTypeBox = oTable.getRows()[selectedIndex].getCells()[0];
		var resourceValueTxt = oTable.getRows()[selectedIndex].getCells()[1];

		resourceTypeBox.setEditable(true);
		resourceValueTxt.setEditable(true);
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

		//oTable.unbindRows();
		//sap.ui.getCore().byId("editRBtn").removeStyleClass("hiddenStyle");
		sap.ui.getCore().byId("doneRBtn").addStyleClass("hiddenStyle");
		sap.ui.getCore().byId("cancelRBtn").addStyleClass("hiddenStyle");
	},

	onCancelEditResource: function(oEvent){
		var oTable = sap.ui.getCore().byId("role-table");
		oTable.clearSelection();
		oTable.getModel().refresh();
		//oTable.getModel().resetChanges();
		//this.updateTab();
		this._resetEditable(oTable);
	},

	onConfirmEditResource: function(){
		var that = this;
		var oModel_user = sap.ui.getCore().getModel("user"),
			userId = oModel_user.getProperty("/userid"),
			groupId = oModel_user.getProperty("/groupid"),
			module_id = oModel_user.getProperty("/moduleid");
		var oTable = sap.ui.getCore().byId("role-table");
		if (!oTable.isBusy()) {
			oTable.setBusy(true);
		}
		var selectedIndex = oTable.getSelectedIndex();
		var selectedObject = oTable.getContextByIndex(selectedIndex).getObject();
		var oEntry = {
			//MODULE_ID: selectedObject.MODULE_ID,
			//RESOURCE_ID: selectedObject.RESOURCE_ID,
			RESOURCE_TYPE: selectedObject.RESOURCE_TYPE,
			VALUE: selectedObject.VALUE
		};
		var model = oTable.getModel();
		if(userId != 0){
			var sPath = "/USER_RESOURCE(P_GROUP_ID=0,P_USER_ID=" + userId + ",RESOURCE_ID='" + selectedObject.RESOURCE_ID + "')";
		}
		else{
			var sPath = "/USER_RESOURCE(P_GROUP_ID=" + groupId +",P_USER_ID=0" + ",RESOURCE_ID='" + selectedObject.RESOURCE_ID + "')";
		}

		that.oModel.update(sPath,
			oEntry,{
			async : true,
        	success : $.proxy(function(oData, response) {
        		sap.ui.commons.MessageBox.show("Edit successfully.", "SUCCESS", "Edit Role");
 				if (oTable.isBusy()) {
					oTable.setBusy(false);
				}
 				model.refresh();
 				that._resetEditable(oTable);
 			},that),
 			error : $.proxy(function(oError) {
				model.refresh();
				that._resetEditable(oTable);
				sap.ui.commons.MessageBox.show("Edit failed.", "ERROR", "Edit Role");
				 if (oTable.isBusy()) {
					oTable.setBusy(false);
				}
			},that)}
		);
	},

	onDeleteResourceRole: function(oEvent){
		var oTable = sap.ui.getCore().byId("role-table");
		if (oTable.getSelectedIndex() == "-1") {
			sap.ui.commons.MessageBox.show("Please choose one resource.", "ERROR", "Delete Role");
		} else {
			sap.ui.commons.MessageBox.confirm("Confirm deleting?", $.proxy(this.confirmDeleteR, this), "Delete Role");
		}
	},

	confirmDeleteR: function(bConfirmed) {
		if (bConfirmed) {
			var oModel_user = sap.ui.getCore().getModel("user"),
				userId = oModel_user.getProperty("/userid"),
				groupId = oModel_user.getProperty("/groupid"),
				module_id = oModel_user.getProperty("/moduleid");

			var oTable = sap.ui.getCore().byId("role-table");
			if (!oTable.isBusy()) {
				oTable.setBusy(true);
			}
			var resourcemodel = oTable.getModel();
			var index = oTable.getSelectedIndex();
			if (index == undefined || index == "-1") {
				sap.ui.commons.MessageBox.show("Please select one resource at least!", "ERROR", "Delete Role");
				return;
			}
			var oSelected = oTable.getContextByIndex(index);
			var oSelectedObject = oSelected.getObject();

			if(userId != 0){
				var context = "/USER_RESOURCE(P_GROUP_ID=0,P_USER_ID=" + userId + ",RESOURCE_ID='" + oSelectedObject.RESOURCE_ID + "')";
			}
			else{
				var context = "/USER_RESOURCE(P_GROUP_ID=" + groupId +",P_USER_ID=0" + ",RESOURCE_ID='" + oSelectedObject.RESOURCE_ID + "')";
			}

			this.oModel.remove(context,{
				async : true,
				success : $.proxy(function(oData, response) {
					sap.ui.commons.MessageBox.show("Delete successfully.", "SUCCESS", "Delete Role");
					if (oTable.isBusy()) {
						oTable.setBusy(false);
					}
					resourcemodel.refresh();
					oTable.clearSelection();
				}, this),
				error : $.proxy(function(oError) {
					sap.ui.commons.MessageBox.show("Delete failed.", "ERROR", "Delete Role");
					if (oTable.isBusy()) {
						oTable.setBusy(false);
					}
				}, this)}
			);
		}
	}

});