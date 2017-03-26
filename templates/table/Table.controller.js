sap.ui.define(
		["sap/ui/core/mvc/Controller",
			"sap/m/MessageToast",
			"sap/ui/model/Filter"
		 ],
		function(Controller,MessageToast,Filter){
			"use strict";
			return Controller.extend("demo.controller.Table",{
				_sortedCloumns: [],
				onInit: function(){
					this._oGlobalFilter = null;
				},
				getSelectedIndices: function (evt) {
					var oTable = this.getView().byId("table1");	//获取Table控件
					var oModel = this.getView().getModel();	//获取table所绑定的model数据
					var aIndices = this.getView().byId("table1").getSelectedIndices();	//获取table所选择的行，多行
					var sMsg;
					if (aIndices.length < 1) {
						sMsg = "no item selected";
					} else {
						sMsg = aIndices;
					}
					//MessageToast.show(sMsg);
					//解析所选择的item
					var items = new Array();
					var item = new Array();
					var oContext;
					for(var i=0;i<aIndices.length;i++){
						var modelPath = oTable.getContextByIndex(aIndices[i]).sPath;
						//var tableItemObject = oModel.getProperty(modelPath);
						var tableItemObject = oModel.getObject(modelPath, oContext);
						for(var title in tableItemObject){
							if(title == "__metadata"){continue};
							item.push(tableItemObject[title]);
						}
						items.push(item);	
					}
					MessageToast.show(items);
				},
				//获取table的选择行
				getContextByIndex: function (evt) {
					var oTable = this.getView().byId("table1");
					var iIndex = oTable.getSelectedIndex();  //获取table所选择的行，单行
					var sMsg;
					if (iIndex < 0) {
						sMsg = "no item selected";
					} else {
						sMsg = oTable.getContextByIndex(iIndex);
					}
					MessageToast.show(sMsg);
				},
				eventcolumnSelect: function(oControlEvent){
//					this._sortedCloumns = [];
//					var oTable = this.getView().byId("table1");
//					var sortedColumns = oTable.getSortedColumns();
//					for(var i in sortedColumns){
//						this._sortedCloumns.push(sortedColumns[i]);
//					}
				},
				sortIdandTitle : function(oEvent) {
					var oView = this.getView();
					var oTable = this.getTableObject();
					oTable.sort(oView.byId("MeetupID"), "ascending", false);
					oTable.sort(oView.byId("Title"), "ascending", true);
				},
				clearAllSortings : function(oEvent) {
					var oTable = this.getTableObject();
					oTable.getBinding().sort(null);
					var sortedColumns = oTable.getSortedColumns();
					for(var i in sortedColumns){
						sortedColumns[i].setSorted(false);
					}
		
				},
				filterGlobally: function(oEvent){
					var sQuery = oEvent.getParameter("query");
					this._oGlobalFilter = null;
					var oFilter = null;
					if(sQuery){
						this._oGlobalFilter = new Filter([
							new Filter("MeetupID", "contains", sQuery),
							new Filter("Title", "contains", sQuery)
						], false);
					}
					if(this._oGlobalFilter){
						oFilter = this._oGlobalFilter;
					}
					this.getTableObject().getBinding().filter(oFilter,"Application")
				},
				clearAllFilters: function(oEvent){
					var oTable = this.getTableObject();
					var aColumns = oTable.getColumns();
					for (var i=0; i<aColumns.length; i++) {
						oTable.filter(aColumns[i], null);
					}
				},
				getTableObject: function(){
					var oTable = this.byId("table1");
					if(!oTable){
						MessageToast.show("No table element!");
					}
					return oTable;
				}
			})
		}
);
