sap.ui.jsview("ui.forecast.forecast", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf ui.forecast
	*/ 
	getControllerName : function() {
		return "ui.forecast.forecast";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf ui.forecast
	*/ 
	createContent : function(oController) {
 		
		var oForm = new sap.ui.layout.form.Form({
			layout: new sap.ui.layout.form.ResponsiveLayout(),
			formContainers: [  
			                 new sap.ui.layout.form.FormContainer({
			                	 formElements: [
			                	                new sap.ui.layout.form.FormElement({
			                	                	label: 'Planning Version',
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-forecast-version',{
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
			                	                	label: 'Item',
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-forecast-item',{
						                	                		valueHelpRequest: function(){
						                	                			sapui5.selectionDialog.create({
							                	                			label: 'Item',
							                	                			path: 'EXT_MATNR',
							                	                		    bindingContext: oController.getBindingContext(),
							                	                		    controller: oController,
							                	                		    self: this
					                	                			    })
						                	                		 }
			                	                			})],              	
			                	                	layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({linebreak: true, margin: false})
			                	                }),
			                	                
/*			                	                new sap.ui.layout.form.FormElement({
			                	                	label: 'Description',
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-forecast-description',{
						                	                		valueHelpRequest: function(){
						                	                			sapui5.selectionDialog.create({
							                	                			label: 'Description',
							                	                			path: 'MAKTX',
							                	                		    bindingContext: oController.getBindingContext(),
							                	                		    controller: oController,
							                	                		    self: this
					                	                			    })
						                	                		 }
			                	                			})],
			                	                	layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({linebreak: true, margin: false})
			                	                	
    	                	                })
*/    	                	                

			                	                new sap.ui.layout.form.FormElement({
			                	                	label: 'Plant',
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-forecast-plant',{
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
			                	                })			                	                
			                	                ]
			                 }),
			                 
			                 new sap.ui.layout.form.FormContainer({
			                	 formElements: [
			                	                new sap.ui.layout.form.FormElement({
			                	                	label: 'Supplier',
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-forecast-supplier',{
						                	                		valueHelpRequest: function(){
						                	                			sapui5.selectionDialog.create({
							                	                			label: 'Supplier Location',
							                	                			path: 'LOCNO',
							                	                		    bindingContext: '/locfrom_f4help',
							                	                		    controller: oController,
							                	                		    self: this
					                	                			    })
						                	                		 }
			                	                			})],
			                	                	layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({linebreak: true, margin: false})
			                	                }),
			                	                new sap.ui.layout.form.FormElement({
			                	                	label: 'MRP Controller',
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-forecast-mrp-controller',{
						                	                		valueHelpRequest: function(){
						                	                			sapui5.selectionDialog.create({
							                	                			label: 'MRP Controller',
							                	                			path: 'DISPO',
							                	                		    bindingContext: oController.getBindingContext(),
							                	                		    controller: oController,
							                	                		    self: this
					                	                			    })
						                	                		 }
			                	                			})],
			                	                	layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({linebreak: true, margin: false})
			                	                }),
			                	                new sap.ui.layout.form.FormElement({
			                	                	label: 'Storage Conditions',
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-forecast-storage-conditions',{
						                	                		valueHelpRequest: function(){
						                	                			sapui5.selectionDialog.create({
							                	                			label: 'Storage Conditions',
							                	                			path: 'RAUBE',
							                	                		    bindingContext: oController.getBindingContext(),
							                	                		    controller: oController,
							                	                		    self: this
					                	                			    })
						                	                		 }
			                	                			})],
			                	                	layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({linebreak: true, margin: false})
			                	                }),
			                	                

/*			                	                new sap.ui.layout.form.FormElement({
			                	                	label: 'Palnt',
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-forecast-plant',{
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
*/		                	                		                	                
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
			content: [oForm]
		});
		
		var oTb = sapui5.table.createTable({id: 'tb-forecast', 
			                                title: 'Detail',
			                                reportName: 'Forecast Report',
			                                toolbar: true}, 
							                 [/**{label: 'Version', path: 'VERSIOD',width: "120px"}, */
							                  {label: 'Item', path: 'EXT_MATNR',width: "300px"},
							                  {label: 'Description', path: 'MAKTX',width: "250px"},
							                  {label: 'Supplier', path: 'LOCNO_SUPPLIER',width: "100px"},
							                  {label: 'Commodity Code', path: 'ZZ_MFRGR',width: "120px"},
							                  {label: 'MRP Controller', path: 'DISPO',width: "105px"},
							                  {label: 'Storage Conditions', path: 'RAUBE',width: "125px"},
							                  {label: 'Plant', path: 'LOCNO_PLANT',width: "55px"},
							                  {label: 'Key Figure', path: 'QTY_TYPE',width: "135px"},
							                  {label: 'DAY0', path: 'DAY_00_QTY_00',width: "100px"},
							                  {label: 'DAY1', path: 'DAY_00_QTY_01',width: "100px"},
							                  {label: 'DAY2', path: 'DAY_00_QTY_02',width: "100px"},
							                  {label: 'DAY3', path: 'DAY_00_QTY_03',width: "100px"},
							                  {label: 'DAY4', path: 'DAY_00_QTY_04',width: "100px"},
							                  {label: 'DAY5', path: 'DAY_00_QTY_05',width: "100px"},
							                  {label: 'DAY6', path: 'DAY_00_QTY_06',width: "100px"},
							                  {label: 'DAY7', path: 'DAY_00_QTY_07',width: "100px"},
							                  {label: 'DAY8', path: 'DAY_00_QTY_08',width: "100px"},
							                  {label: 'DAY9', path: 'DAY_00_QTY_09',width: "100px"},
							                  {label: 'DAY10', path: 'DAY_00_QTY_10',width: "100px"},
							                  {label: 'DAY11', path: 'DAY_00_QTY_11',width: "100px"},
							                  {label: 'DAY12', path: 'DAY_00_QTY_12',width: "100px"},
							                  {label: 'DAY13', path: 'DAY_00_QTY_13',width: "100px"},
							                  {label: 'DAY14', path: 'DAY_00_QTY_14',width: "100px"},
							                  {label: 'DAY15', path: 'DAY_00_QTY_15',width: "100px"},
							                  {label: 'DAY16', path: 'DAY_00_QTY_16',width: "100px"},
							                  {label: 'DAY17', path: 'DAY_00_QTY_17',width: "100px"},
							                  {label: 'DAY18', path: 'DAY_00_QTY_18',width: "100px"},
							                  {label: 'DAY19', path: 'DAY_00_QTY_19',width: "100px"},
							                  {label: 'DAY20', path: 'DAY_00_QTY_20',width: "100px"},
							                  
							                 // {label: 'WEEK0', path: 'WEEK_00_QTY_01',width: "100px"},
							                 // {label: 'WEEK1', path: 'WEEK_01_QTY_01',width: "100px"},
							                 // {label: 'WEEK2', path: 'WEEK_02_QTY_01',width: "100px"},
							                  {label: 'WEEK3', path: 'WEEK_03_QTY_01',width: "100px"},
							                  {label: 'WEEK4', path: 'WEEK_04_QTY_01',width: "100px"},
							                  {label: 'WEEK5', path: 'WEEK_05_QTY_01',width: "100px"},
							                  {label: 'WEEK6', path: 'WEEK_06_QTY_01',width: "100px"},
							                  {label: 'WEEK7', path: 'WEEK_07_QTY_01',width: "100px"},
							                  {label: 'WEEK8', path: 'WEEK_08_QTY_01',width: "100px"},
							                  {label: 'WEEK9', path: 'WEEK_09_QTY_01',width: "100px"},
							                  {label: 'WEEK10', path: 'WEEK_10_QTY_01',width: "100px"},
							                  {label: 'WEEK11', path: 'WEEK_11_QTY_01',width: "100px"},
							                  {label: 'WEEK12', path: 'WEEK_12_QTY_01',width: "100px"},
							                  {label: 'WEEK13', path: 'WEEK_13_QTY_01',width: "100px"},
							                  {label: 'WEEK14', path: 'WEEK_14_QTY_01',width: "100px"},
							                  {label: 'WEEK15', path: 'WEEK_15_QTY_01',width: "100px"},
							                  {label: 'WEEK16', path: 'WEEK_16_QTY_01',width: "100px"},
							                  {label: 'WEEK17', path: 'WEEK_17_QTY_01',width: "100px"},
							                  {label: 'WEEK18', path: 'WEEK_18_QTY_01',width: "100px"},
							                  {label: 'WEEK19', path: 'WEEK_19_QTY_01',width: "100px"},
							                  {label: 'WEEK20', path: 'WEEK_20_QTY_01',width: "100px"},
							                  {label: 'WEEK21', path: 'WEEK_21_QTY_01',width: "100px"},
							                  {label: 'WEEK22', path: 'WEEK_22_QTY_01',width: "100px"},
							                  {label: 'WEEK23', path: 'WEEK_23_QTY_01',width: "100px"},
							                  {label: 'WEEK24', path: 'WEEK_24_QTY_01',width: "100px"},
							                  {label: 'WEEK25', path: 'WEEK_25_QTY_01',width: "100px"},
							                  {label: 'WEEK26', path: 'WEEK_26_QTY_01',width: "100px"},
							                  {label: 'WEEK27', path: 'WEEK_27_QTY_01',width: "100px"},
							                  {label: 'WEEK28', path: 'WEEK_28_QTY_01',width: "100px"},
							                  {label: 'WEEK29', path: 'WEEK_29_QTY_01',width: "100px"},
							                  {label: 'WEEK30', path: 'WEEK_30_QTY_01',width: "100px"},
							                  {label: 'WEEK31', path: 'WEEK_31_QTY_01',width: "100px"},
							                  {label: 'WEEK32', path: 'WEEK_32_QTY_01',width: "100px"},
							                  {label: 'WEEK33', path: 'WEEK_33_QTY_01',width: "100px"},
							                  {label: 'WEEK34', path: 'WEEK_34_QTY_01',width: "100px"},
							                  {label: 'WEEK35', path: 'WEEK_35_QTY_01',width: "100px"},
							                  {label: 'WEEK36', path: 'WEEK_36_QTY_01',width: "100px"},
							                  {label: 'WEEK37', path: 'WEEK_37_QTY_01',width: "100px"},
							                  {label: 'WEEK38', path: 'WEEK_38_QTY_01',width: "100px"},
							                  {label: 'WEEK39', path: 'WEEK_39_QTY_01',width: "100px"},
							                  {label: 'WEEK40', path: 'WEEK_40_QTY_01',width: "100px"},
							                  {label: 'WEEK41', path: 'WEEK_41_QTY_01',width: "100px"},
							                  {label: 'WEEK42', path: 'WEEK_42_QTY_01',width: "100px"},
							                  {label: 'WEEK43', path: 'WEEK_43_QTY_01',width: "100px"},
							                  {label: 'WEEK44', path: 'WEEK_44_QTY_01',width: "100px"},
							                  {label: 'WEEK45', path: 'WEEK_45_QTY_01',width: "100px"},
							                  {label: 'WEEK46', path: 'WEEK_46_QTY_01',width: "100px"},
							                  {label: 'WEEK47', path: 'WEEK_47_QTY_01',width: "100px"},
							                  {label: 'WEEK48', path: 'WEEK_48_QTY_01',width: "100px"},
							                  {label: 'WEEK49', path: 'WEEK_49_QTY_01',width: "100px"},
							                  {label: 'WEEK50', path: 'WEEK_50_QTY_01',width: "100px"},
							                  {label: 'WEEK51', path: 'WEEK_51_QTY_01',width: "100px"},
							                  {label: 'WEEK52', path: 'WEEK_52_QTY_01',width: "100px"}]);
		
//modified by caozh4 20170310
		var oGrid = new sap.ui.layout.Grid({
			defaultSpan: "L12 M12 S12",
			content: [oPanel, oTb]
		});
		return oGrid;
		
//		var oVertical = new sap.ui.layout.VerticalLayout({
//			content: [oPanel, oTb]
//		})
//		
//		return oVertical; 

	}

});