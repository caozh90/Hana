sap.ui.jsview("lenovo.view.common.role", {
	getControllerName: function() {
		return "lenovo.view.common.role";
	},

	createContent: function(oController) {
		var oTab = new sap.ui.commons.TabStrip("userTab", {
			height: "100%",
			width: "100%"
		});
		oTab.addStyleClass("userTab");
		var oBtLayout = new sap.ui.layout.HorizontalLayout("frButtons", {
			content: [
				/*new sap.ui.commons.Button("maintainRole", {
					lite: true,
					icon: "sap-icon://edit",
					tooltip: "Maintain Role Group",
					press: function(oEvent) {
						oController.onMaintainRG(oEvent);
					}
				}),*/
				new sap.ui.commons.Button("assignRole", {
					lite: true,
					icon: "sap-icon://add",
					tooltip: "Assign Role&Role Group",
					press: function(oEvent) {
						oController.onAssignR(oEvent);
					}
				}),
				new sap.ui.commons.Button("deleteRole", {
					lite: true,
					icon: "sap-icon://delete",
					tooltip: "Delete",
					press: function(oEvent) {
						oController.onDeleteR(oEvent);
					}
				})
			]
		});
		var windowHeight = document.documentElement.clientHeight || window.innerHeight;	
		var oRoleTree = new sap.ui.table.TreeTable("role-tree", {
			//title: "Owned Roles",
			width: "auto",
			editable: false,
			visibleRowCount: parseInt((windowHeight-150)/30),
			//columnHeaderHeight: 30,
			enableColumnReordering: true,
			expandFirstLevel: false,
			setShowSortMenuEntry: false,
			selectionMode: sap.ui.table.SelectionMode.Single,
			navigationMode: sap.ui.table.NavigationMode.Scrollbar,
			columnHeaderVisible: false,
			noDataText: " "
		});

		var oTemplate = new sap.ui.commons.TextField({
			editable: false
		}).bindProperty("value", "DisplayName");
		oRoleTree.addColumn(new sap.ui.table.Column({
			template: oTemplate,
			filterProperty: "Name",
			filterOperator: sap.ui.model.FilterOperator.EQ,
			flexible: true
		}));
		oTemplate = new sap.ui.commons.TextField({
			editable: false
		}).bindProperty("value", "Id");
		oRoleTree.addColumn(new sap.ui.table.Column({
			template: oTemplate,
			visible: false
		}));
		oTemplate = new sap.ui.commons.TextField({
			editable: false
		}).bindProperty("value", "RolegroupId");
		oRoleTree.addColumn(new sap.ui.table.Column({
			template: oTemplate,
			visible: false
		}));
		oTemplate = new sap.ui.commons.TextField({
			editable: false
		}).bindProperty("value", "Default");
		oRoleTree.addColumn(new sap.ui.table.Column({
			template: oTemplate,
			visible: false
		}));
		oTemplate = new sap.ui.commons.TextField({
			editable: false
		}).bindProperty("value", "Name");
		oRoleTree.addColumn(new sap.ui.table.Column({
			template: oTemplate,
			visible: false
		}));

		//create resource role layout
		var oRtLayout = new sap.ui.layout.HorizontalLayout("resource", {
			content: [
				new sap.ui.commons.Button("doneRBtn", {
					lite: true,
					icon: "sap-icon://accept",
					tooltip: "Edit",
					style: sap.ui.commons.ButtonStyle.Accept,
					press: function(oEvent) {
						oController.onConfirmEditResource(oEvent);
					}
				}).addStyleClass("hiddenStyle"),
				new sap.ui.commons.Button("cancelRBtn", {
					lite: true,
					icon: "sap-icon://decline",
					tooltip: "Edit",
					style: sap.ui.commons.ButtonStyle.Accept,
					press: function(oEvent) {
						oController.onCancelEditResource(oEvent);
					}
				}).addStyleClass("hiddenStyle"),
				new sap.ui.commons.Button("editRBtn", {
					lite: true,
					icon: "sap-icon://edit",
					tooltip: "Edit",
					press: function(oEvent) {
						oController.onEditResourceRole(oEvent);
					}
				}),
				new sap.ui.commons.Button({
					lite: true,
					icon: "sap-icon://add",
					tooltip: "Add",
					press: function(oEvent) {
						oController.onAddResourceRole(oEvent);
					}
				}),
				new sap.ui.commons.Button({
					lite: true,
					icon: "sap-icon://delete",
					tooltip: "Delete",
					press: function(oEvent) {
						oController.onDeleteResourceRole(oEvent);
					}
				})
			]
		});

		var oRoleTable = new sap.ui.table.Table("role-table", {
			//title: "Owned Roles",
			width: "auto",
			editable: false,
			visibleRowCount: parseInt((windowHeight-150)/30),
			enableColumnReordering: true,
			selectionMode: sap.ui.table.SelectionMode.Single,
			columnHeaderVisible: false,
			navigationMode: sap.ui.table.NavigationMode.Scrollbar,
			noDataText: " "
		});

		var oTemplateBox = new sap.ui.commons.DropdownBox({
			editable: false
		}).bindProperty("value", "RESOURCE_TYPE");
		var service = new lenovo.service.Common();
		var sUrl = service.getUserInfo();
		$.ajax({
			url: sUrl + "/INFO_RESOURCE_TYPE?$format=json",
			type: "get",
			datatype: "json",
			success: function(data) {
				var oItem;
				var resource = data.d.results;
				//console.log("after oTemplate", oTemplate1 instanceof  sap.ui.commons.DropdownBox);
				$.each(resource, function(index, value) {
					oItem = new sap.ui.core.ListItem({
						text: value.RESOURCE_TYPE,
						key: value.RESOURCE_TYPE
					});
					oTemplateBox.addItem(oItem);
				});
			}
		});
		oRoleTable.addColumn(new sap.ui.table.Column({
			template: oTemplateBox,
			filterProperty: "RESOURCE_TYPE",
			filterOperator: sap.ui.model.FilterOperator.EQ,
			flexible: true
		}));
		var oTemplate = new sap.ui.commons.TextField({
			editable: false
		}).bindProperty("value", "VALUE");
		oRoleTable.addColumn(new sap.ui.table.Column({
			template: oTemplate,
			filterProperty: "VALUE",
			filterOperator: sap.ui.model.FilterOperator.EQ,
			flexible: true
		}));
		oTemplate = new sap.ui.commons.TextField({
			editable: false
		}).bindProperty("value", "RESOURCE_ID");
		oRoleTable.addColumn(new sap.ui.table.Column({
			template: oTemplate,
			visible: false
		}));

		var oTab1Layout = new sap.ui.commons.layout.VerticalLayout({
			content: [oBtLayout, oRoleTree]
		});
		oTab.createTab("Function Role", oTab1Layout);
		var oTab2Layout = new sap.ui.commons.layout.VerticalLayout({
			content: [oRtLayout, oRoleTable]
		});
		oTab.createTab("Resource Role", oTab2Layout);
		return oTab;
	},

});