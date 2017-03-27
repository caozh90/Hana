sap.ui.jsview("ui.pegging.pegging", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf ui.pegging.pegging
	*/ 
	getControllerName : function() {
		return "ui.pegging.pegging";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf ui.pegging.pegging
	*/ 
	createContent : function(oController) {

		var oForm = new sap.ui.layout.form.Form({
			layout: new sap.ui.layout.form.ResponsiveLayout(),
			formContainers: [  
			                 new sap.ui.layout.form.FormContainer({
			                	 formElements: [
			                	                new sap.ui.layout.form.FormElement({
			                	                	label: 'Planning Version',
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-pegging-version',{
			                	                		            value: '001', //default value
						                	                		valueHelpRequest: function(){
						                	                			sapui5.selectionDialog2.create({
							                	                			label: 'Planning Version',
							                	                			path: 'VRSIOEX',
							                	                			label1: 'Planning Version Description',
							                	                			path1: 'VRSIOTXT',
							                	                		    bindingContext: '/pegging_report_version',
							                	                		    controller: oController,
							                	                		    self: this
					                	                			    });
						                	                		 }
			                	                			})],
			                	                	layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({linebreak: true, margin: false})
			                	                }),
			                	                new sap.ui.layout.form.FormElement({
			                	                	label: 'GEO Level',
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-pegging-geo',{
						                	                		valueHelpRequest: function(){
						                	                			sapui5.selectionDialog.create({
							                	                			label: 'Geo Level',
							                	                			path: 'GEOLevel',
							                	                		    bindingContext: oController.getBindingContext(),
							                	                		    controller: oController,
							                	                		    self: this
					                	                			    })
						                	                		 }
			                	                			})],              	
			                	                	layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({linebreak: true, margin: false})
			                	                }),
			                	                new sap.ui.layout.form.FormElement({
			                	                	label: 'Item',
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-pegging-item',{
						                	                		valueHelpRequest: function(){
						                	                			sapui5.selectionDialog.create({
							                	                			label: 'Item',
							                	                			path: 'Item',
							                	                		    bindingContext: oController.getBindingContext(),
							                	                		    controller: oController,
							                	                		    self: this
					                	                			    })
						                	                		 }
			                	                			})],
			                	                	layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({linebreak: true, margin: false})
			                	                }),
			                	                new sap.ui.layout.form.FormElement({
			                	                	label: 'Description',
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-pegging-description',{
						                	                		valueHelpRequest: function(){
						                	                			sapui5.selectionDialog.create({
							                	                			label: 'Description',
							                	                			path: 'ItemDescription',
							                	                		    bindingContext: oController.getBindingContext(),
							                	                		    controller: oController,
							                	                		    self: this
					                	                			    })
						                	                		 }
			                	                			})],
			                	                	layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({linebreak: true, margin: false})
			                	                }),
			                	                new sap.ui.layout.form.FormElement({
			                	                	label: 'family',
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-pegging-family',{
						                	                		valueHelpRequest: function(){
						                	                			sapui5.selectionDialog.create({
							                	                			label: 'family',
							                	                			path: 'ZZ_FAMILY',
							                	                		    bindingContext: oController.getBindingContext(),
							                	                		    controller: oController,
							                	                		    self: this
					                	                			    })
						                	                		 }
			                	                			})],
			                	                	layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({linebreak: true, margin: false})
			                	                })]
			                 }),
			                 new sap.ui.layout.form.FormContainer({
			                	 formElements: [
			                	                
			                	                new sap.ui.layout.form.FormElement({
			                	                	label: 'Plant',
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-pegging-plant',{
						                	                		valueHelpRequest: function(){
						                	                			sapui5.selectionDialog.create({
							                	                			label: 'Plant',
							                	                			path: 'Plant',
							                	                		    bindingContext: oController.getBindingContext(),
							                	                		    controller: oController,
							                	                		    self: this
					                	                			    })
						                	                		 }
			                	                			})],
			                	                	layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({linebreak: true, margin: false})
			                	                }),
			                	                new sap.ui.layout.form.FormElement({
			                	                	label: 'To Item',
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-pegging-toitem',{
						                	                		valueHelpRequest: function(){
						                	                			sapui5.selectionDialog.create({
							                	                			label: 'To Item',
							                	                			path: 'ToItem',
							                	                		    bindingContext: oController.getBindingContext(),
							                	                		    controller: oController,
							                	                		    self: this
					                	                			    })
						                	                		 }
			                	                			})],
			                	                	layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({linebreak: true, margin: false})
			                	                }),
			                	                
			                	                new sap.ui.layout.form.FormElement({
			                	                	label: 'To Item Description',
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-pegging-toitem-description',{
						                	                		valueHelpRequest: function(){
						                	                			sapui5.selectionDialog.create({
							                	                			label: 'To Item Description',
							                	                			path: 'ToItemDescription',
							                	                		    bindingContext: oController.getBindingContext(),
							                	                		    controller: oController,
							                	                		    self: this
					                	                			    })
						                	                		 }
			                	                			})],
			                	                	layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({linebreak: true, margin: false})
			                	                }),
			                	                new sap.ui.layout.form.FormElement({
			                	                	label: 'CTO',
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-pegging-zcto',{
						                	                		valueHelpRequest: function(){
						                	                			sapui5.selectionDialog.create({
							                	                			label: 'CTO',
							                	                			path: 'ZCTO',
							                	                		    bindingContext: oController.getBindingContext(),
							                	                		    controller: oController,
							                	                		    self: this
					                	                			    })
						                	                		 }
			                	                			})],
			                	                	layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({linebreak: true, margin: false})
			                	                }),
			                	                new sap.ui.layout.form.FormElement({
			                	                	fields: [new sap.ui.commons.layout.MatrixLayout({	
			                	            			rows: [new sap.ui.commons.layout.MatrixLayoutRow({
			                	            				cells: [new sap.ui.commons.layout.MatrixLayoutCell({
			                	            					content: [new sap.ui.commons.Button({
			                	            								text: 'OK',
			                	            								width: '50px',
			                	            								style: sap.ui.commons.ButtonStyle.Accept,
			                	            								press: oController.confirmSelection
			                	            							 })],
			                	            					hAlign: sap.ui.commons.layout.HAlign.Right 
			                	            				})]
			                	            			})]
			                	            		})],
			                	                	layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({linebreak: true, margin: false})
			                	                })]
			                 })]
		});
		
		var oPanel = new sap.ui.commons.Panel({
			title: new sap.ui.core.Title({text: 'Selection Criteria'}),
			width: '80%',
			content: [oForm],
		});
		
		var aColumns =   [{label: 'Geo Level', path: 'GEOLevel'},
		                  {label: 'Material Group', path: 'MaterialGroup'},
		                  {label: 'Item', path: 'Item'},
		                  {label: 'Item Description', path: 'ItemDescription'},
		                  {label: 'Material Type', path: 'MaterialType'},
		                  {label: 'Commodity Code', path: 'CommodityCode'},
		                  {label: 'Technology', path: 'Technology'},
		                  {label: 'Location', path: 'Plant'},
//		                  {label: 'MRP Controller', path: 'MRPController'},
		                  {label: 'To Item', path: 'ToItem'},
		                  {label: 'Item Description', path: 'ToItemDescription'},
		                  {label: 'Category', path: 'KEY_TYPE'},
		                  {label: 'CTO', path: 'ZCTO'},
		                  {label: 'Family', path: 'ZZ_FAMILY'},
		                  {label: 'Available Stock', path: 'AvailableStock'}];
		
		for(var i = 0; i< 52; i++){
		  aColumns.push({label: 'WEEK'+i, path: 'DEMAND_WEEK_'+i});
		}
		
		aColumns.map(function(oColumn){
			oColumn.width = '135px';
		});
		
		var oTb = sapui5.table.createTable({id: 'tb-pegging', 
			                                title: 'Detail',
			                                reportName: 'Forecast Pegging Report with GEO Level',
			                                toolbar: true}, 
							                aColumns);		
		
		//modified by caozh4 20170310
		var oGrid = new sap.ui.layout.Grid({
			defaultSpan: "L12 M12 S12",
			content: [oPanel,oTb]
		});
		return oGrid;
//		
//		var oVertical = new sap.ui.layout.VerticalLayout({
//			content: [oPanel,oTb]
//		})
//		
//		return oVertical;
	}

});