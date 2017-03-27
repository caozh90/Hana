sap.ui.jsview("ui.hubstock_proc.hubstock_proc", {

	  
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf ui.hubstock
	*/ 
	getControllerName : function() {
		return "ui.hubstock_proc.hubstock_proc";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf ui.hubstock
	*/ 
	createContent : function(oController) {
 		
		var oForm = new sap.ui.layout.form.Form({
			layout: new sap.ui.layout.form.ResponsiveLayout(),
			formContainers: [  
			                 new sap.ui.layout.form.FormContainer({
			                	 formElements: [
			                	                new sap.ui.layout.form.FormElement({
			                	                	label: 'Planning Version',
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-hubstock_proc-version',{
			                	                		            value: '001', //default value
						                	                		valueHelpRequest: function(){
					                	                			    sapui5.selectionDialog2.create({
							                	                			label: 'Planning Version',
							                	                			path: 'VRSIOEX',
							                	                			label1: 'Planning Version Description',
							                	                			path1: 'VRSIOTXT',
							                	                		    bindingContext: '/snc_forecast_planning_version',
							                	                		    controller: oController,
							                	                		    self: this
					                	                			    });
						                	                		 }
			                	                			})],
			                	                	layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({linebreak: true, margin: false})
			                	                }),
			                	                new sap.ui.layout.form.FormElement({
			                	                	label: 'Location',
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-hubstock_proc-location',{
						                	                		valueHelpRequest: function(){
						                	                			sapui5.selectionDialog.create({
							                	                			label: 'Location No',
							                	                			path: 'LOCNO',
							                	                		    bindingContext: '/loc_f4help',
							                	                		    controller: oController,
							                	                		    self: this
					                	                			    })
						                	                		 }
			                	                			})],              	
			                	                	layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({linebreak: true, margin: false})
			                	                }),
			                	     ]
			                 }),
			                 new sap.ui.layout.form.FormContainer({
			                	 formElements: [
			                	                new sap.ui.layout.form.FormElement({
			                	                	label: 'Item', //'Product Number',
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-hubstock_proc-product-number',{
						                	                		valueHelpRequest: function(){
						                	                			sapui5.selectionDialog.create({
							                	                			label: 'Material No',
							                	                			path: 'MATNR',
							                	                			bindingContext: '/mat_f4help',
							                	                		    controller: oController,
							                	                		    self: this
					                	                			    })
						                	                		 }
			                	                			})],
			                	                	layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({linebreak: true, margin: false})
			                	                }),
			                	                new sap.ui.layout.form.FormElement({
			                	                	label: 'MRP Controller',
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-hubstock_proc-dispo_1',{
						                	                		valueHelpRequest: function(){
						                	                			sapui5.selectionDialog.create({
							                	                			label: 'MRP Controller',
							                	                			path: 'DISPO_1',
							                	                		    bindingContext: oController.getBindingContext(),
							                	                		    controller: oController,
							                	                		    self: this
					                	                			    })
						                	                		 }
			                	                			})],
			                	                	layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({linebreak: true, margin: false})
			                	                }),

			                	                new sap.ui.layout.form.FormElement({
//			                	                	label: 'Group ID',
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-hubstock_proc-group-id',{

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
		
		
		var oTb = sapui5.table.createTable({id: 'tb-hubstock_proc', 
			                                title: 'Detail',
			                                reportName: 'Hub Stock Proc.',
			                                toolbar: true}, 
							                 [{label: 'Group number', path: 'GRPID', width: "100px"},
							                  {label: 'Plant', path: 'LOCNO', width: "50px"},
							                  {label: 'Item', path: 'MATNR', width: "250px"},  //Product Number
							                  {label: 'Item Description', path: 'MAKTX', width: "250px"},
							                  {label: 'MRP Controller', path: 'DISPO_1',width: "120px"},	
							                  {label: 'Vender Code', path: 'VENDER_LOCNO', width: "100px"},
							                  {label: 'Vendor Name', path: 'VENDER_DESCR40', width: "100px" },
							                  {label: 'Lenovo Inventory', type: 'amount', path: 'OWN_STOCK_QTY_01', width: "100px"},
							                  {label: 'VMI Inventory', type: 'amount',  path: 'SUP_STOCK_QTY_01', width: "100px"},
							                  {label: 'Version TimeStamp', path: 'PLN_VERSION_TIMESTAMP_01', width: "100px"}]);	
		
		//modified by caozh4 20170310
		var oGrid = new sap.ui.layout.Grid({
			defaultSpan: "L12 M12 S12",
			content: [oPanel,oTb]
		});
		return oGrid;
		
//		var oVertical = new sap.ui.layout.VerticalLayout({
//			content: [oPanel,oTb]
//		})
//		
//		return oVertical;

	}

});