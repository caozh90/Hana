sap.ui.define(
		["sap/ui/core/mvc/Controller",
		 "sap/ui/model/odata/ODataModel",
		 "sap/m/MessageToast",
		 "sap/ui/model/Filter",
		 "sap/ui/model/json/JSONModel",
		 "sap/ui/model/FilterOperator",
		 'jquery.sap.global'
		 ],
		function(Controller,ODataModel,MessageToast,Filter,JSONModel){
			"use strict";
			return Controller.extend("demo.controller.Table",{
//				oDataModel : null,
				onInit: function(){
//					 var oDataModel = new ODataModel("/sap/opu/odata/sap/ZFIORI_ZPSR004_SRV/",{defaultBindingMode:"TwoWay", refreshAfterChange:false});
//					 this.getView().setModel(oDataModel);
				},
				onSearch: function(){
					var filters = [];
//					Filter的用法
					var oFilterPspid = new Filter('Pspid');
					oFilterPspid.fnTest = function(value){
						return (value > 1);
					};
					filters.push(oFilterPspid);
//					var iFilterPspid = new Filter({
//					path : "Pspid",
//					operator : FilterOperator.EQ,
//					value1 : view.byId("p_pspid").getValue()
//				});
					
//					JSON 用于本地测试
					var data = [{Pspid: '1',Vbukr: 'a'},{Pspid: '2',Vbukr: 'b'}];	
					var jsonModel = new JSONModel();
					jsonModel.setData({data: data});
//					jsonModel.loadData('data.json');
					this.getView().setModel(jsonModel);
					this.getView().byId("table1").bindRows({
						path: "/data",
						filters: filters,
					});
					

//					Sorter的用法
					var oSorter = new sap.ui.model.Sorter('Vburk');
					oSorter.fnCompare = function(value1, value2){
						if (value1 < value2) return -1;
						if (value1 == value2) return 0;
						if(value1 > value2) return 1;
					};
					
//					OdataModel
//					var oModel = new ODataModel("/sap/opu/odata/sap/ZFIORI_ZPSR004_SRV/");
//					var oModel = new ODataModel({serviceUrl: "/sap/opu/odata/sap/ZFIORI_ZPSR004_SRV"});
//					var oMetaData = oModel.getServiceMetadata();
//					oModel.getData();
//					oModel.getProperty();
//					var oContext = oModel.createEntry("");
//					oForm.setBindingContext(oContext);
//					oModel.submitChanges({success: mySuccessHandle, error: myErrorHandler});
//					oModel.deleteCreatedEntry(oContext);
//					1 Creating entities
//					oModel.create();
//					2 reading entities
//					oModel.read();
//					3 Updating entities
//					oModel.update();
//					4 Deleting entities
//					oModel.delete();
//					refresh after change
//					oModel.setRefreshAfterChange(false);
//					data bingding
//					oControl.bindElement("/Category", {expend: "products"});
//					oTable.bindRows({path: "/Products", parameters: {expand: "Category"}});
//					oTable.bindRows({path: "/Products", parameters: {select: "Name,Category"}});
//					Customer query options
//					oTable.bindRows({
//						path: "/Products", 
//						parameters: {
//							select: "Name,Category",
//							custom:{
//								param1: value1,
//								param2: value2,
//							}
//						},
//						template: rowTemplage
//					});
					
//					sap.ui.getCore().setModel(oModel);
//					sap.ui.getCore().byId("table").setModel(oModel);
					
					
					//查询按钮相应事件
//					var view = this.getView();
//					var inputs = [
//						view.byId("p_pspid"),
//						view.byId("p_gjahr"),
//						view.byId("p_monat")
//					];
//					jQuery.each(inputs, function (i, input) {
//						if (!input.getValue()) {
//							input.setValueState("Error");
//						}
//					});
					
//					获取筛选数据
//					var i_pspid = view.byId("p_pspid").getValue();
//					var i_gjahr = view.byId("p_gjahr").getValue();
//					var i_monat = view.byId("p_monat").getValue();
//					
////					创建filter
//					var filters = [];
//					var iFilterPspid = new Filter({
//						path : "Pspid",
//						operator : FilterOperator.EQ,
//						value1 : view.byId("p_pspid").getValue()
//					});
//					filters.push(iFilterPspid)
//					var iFilterGjahr = new Filter({
//						path : "Gjahr",
//						operator : FilterOperator.EQ,
//						value1 : view.byId("p_gjahr").getValue()
//					});
//					filters.push(iFilterGjahr);
//					var iFilterMonat = new Filter({
//						path : "Monat",
//						operator : FilterOperator.EQ,
//						value1 : view.byId("p_monat").getValue()
//					});
//					filters.push();
//					
//					var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFIORI_ZPSR004_SRV/");
//					
//					var jsonModel = new sap.ui.model.json.JSONModel({data: []});
//					this.getView().setModel(jsonModel);
					
					
					
//					创建odatamodel
//					var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
//					var oDataModel = sap.ui.getCore().getComponent(sComponentId).getModel();
//					oDataModel.read("/ZPSS004ALVSet",{
//						filters : filters,
//						async : false,
//						success: function(oData, response){
//							var modelData = jsonModel.getData();
//							var Entries = SearchData.data;
//							var child = {};
//							for(var i = 0;i< oData.results.length;i++){
//								child = {							    
//										Pspid: oData.results[i].Pspid,
//										Gjahr: oData.results[i].Gjahr,
//									};
//								Entries.push(child);
//							}
//							jsonModel.setData(modelData);
//						},
//						error : function(error) {
//							MessageToast.show(oConfig.msgs[6].text);
//							return;
//						}
//					});
//					rows="{
//						path: '/ZPSS004ALVSet',
//						parameters: {operationMode: 'Server'}
//						}" 
//					view.byId("table1").bindRows("/ZPSS004ALVSet");
				}
			})
		}
);
