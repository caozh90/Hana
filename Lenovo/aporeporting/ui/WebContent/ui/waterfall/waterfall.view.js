sap.ui.jsview("ui.waterfall.waterfall", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf ui.waterfall.waterfall
	*/ 
	getControllerName : function() {
		return "ui.waterfall.waterfall";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	*/ 
	createContent : function(oController) {
		var oForm = new sap.ui.layout.form.Form({
			layout: new sap.ui.layout.form.ResponsiveLayout(),
			formContainers: [ 
			                 new sap.ui.layout.form.FormContainer({
			                	 formElements: [
			                	                new sap.ui.layout.form.FormElement({
			                	                	label: 'Planning Version',
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-warterfall-version',{
			                	                		            value: '001', //default value
						                	                		valueHelpRequest: function(){
						                	                			sapui5.selectionDialog.create({
							                	                			label: 'Planning Version',
							                	                			path: 'VRSIOEX',
							                	                			label1: 'Planning Version Description',
							                	                			path1: 'VRSIOTXT',							                	                			
							                	                			bindingContext: '/snc_forecast_planning_version',
							                	                		    controller: oController,
							                	                		    self: this
					                	                			    })
						                	                		 }
			                	                			})],
			                	                	layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({linebreak: true, margin: false})
			                	                }),


			                	                new sap.ui.layout.form.FormElement({
			                	                	label: 'Location',
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-waterfall-location',{
						                	                		valueHelpRequest: function(){
						                	                			sapui5.selectionDialog.create({
							                	                			label: 'Location',
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
						                	                	label: 'Item', //'Material No',
						                	                	fields: [new sap.ui.commons.ValueHelpField('vf-warterfall-material',{
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
						                	                	label: 'Time Dimension',
						                	                	fields: [ new sap.ui.commons.DropdownBox( 
						                	                			"time_sel",{
						                	                				tooltip: "Time Dimenstion",
						                	                				value: 'weekly',
						                	                				items: [new sap.ui.core.ListItem("Weekly",{text: "Weekly", key: "weekly"}),
						                	                				        new sap.ui.core.ListItem("Monthly",{text: "Monthly", key: "monthly"}),
						                	                				        new sap.ui.core.ListItem("Quarterly",{text: "Quarterly", key: "quarterly"})
						                	                				]  ,    
						                	    	                	  change: function(oEvent){
						                	                		          oController.selectTimeDimension(oEvent)
						                	                	    		},   
						                	                			       } ) 
						                	                	         ],
						         	         
						                	                	layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({linebreak: true, margin: false})
						                	                	
						                	                })	,				       			                	               
			       			                	              
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
						                	                }) 
			   			                	                
			       			                	               ]
			    			                	 
			       			                 }),
						                	 
			          ]  
		});
		
		
			
		var oPanel = new sap.ui.commons.Panel({
			title: new sap.ui.core.Title({text: 'Selection Criteria'}),
			width: "80%",
			content: [oForm],
		});
		
		
		var oTb1 = sapui5.table.createTable({id: 'tb-warterfall_weekly', 
			                                title: 'Detail',
			                                reportName: 'Waterfall Weekly Report',
			                                navigationMode: sap.ui.table.NavigationMode.Scrollbar,
			                                fixedColumnCount: 10, 
			                                toolbar: true}, 
							                  [
							                  {label: 'Item', path: 'EXT_MATNR',width: "120px"}, //Material No.
							                  {label: 'Item Desc.', path: 'MAKTX',width: "120px"},
							                  {label: 'Location', path: 'LOCNO',width: "120px"},							                  
//							                  {label: 'SnapShot Week',  path: 'CALWEEK_SNPT',width: "120px"},
							                  {label: 'SnapShot Day',  path: 'SNAP_DAY',width: "120px"},
							                  {label: 'QTY Type',  path: 'QTY_TYPE',width: "100px"},
							                  
							                  {label: 'WEEK_5',  type: 'amount', path: 'WEEK_05_P_QTY_01',width: "100px"},
							                  {label: 'WEEK_4',  type: 'amount', path: 'WEEK_04_P_QTY_01',width: "100px"},
							                  {label: 'WEEK_3',  type: 'amount', path: 'WEEK_03_P_QTY_01',width: "100px"},
							                  {label: 'WEEK_2',  type: 'amount', path: 'WEEK_02_P_QTY_01',width: "100px"},
							                  {label: 'WEEK_1',  type: 'amount', path: 'WEEK_01_P_QTY_01',width: "100px"},
							                  
							                  {label: 'WEEK0',  type: 'amount', path: 'WEEK_00_QTY_01',width: "100px"},
							                  {label: 'WEEK1',  type: 'amount', path: 'WEEK_01_QTY_01',width: "100px"},
							                  {label: 'WEEK2',  type: 'amount', path: 'WEEK_02_QTY_01',width: "100px"},
							                  {label: 'WEEK3',  type: 'amount', path: 'WEEK_03_QTY_01',width: "100px"},
							                  {label: 'WEEK4',  type: 'amount', path: 'WEEK_04_QTY_01',width: "100px"},
							                  {label: 'WEEK5',  type: 'amount', path: 'WEEK_05_QTY_01',width: "100px"},
							                  {label: 'WEEK6',  type: 'amount', path: 'WEEK_06_QTY_01',width: "100px"},
							                  {label: 'WEEK7',  type: 'amount', path: 'WEEK_07_QTY_01',width: "100px"},
							                  {label: 'WEEK8',  type: 'amount', path: 'WEEK_08_QTY_01',width: "100px"},
							                  {label: 'WEEK9',  type: 'amount', path: 'WEEK_09_QTY_01',width: "70px"},
							                  {label: 'WEEK10',  type: 'amount', path: 'WEEK_10_QTY_01',width: "100px"},
							                  
							                  {label: 'WEEK11',  type: 'amount', path: 'WEEK_11_QTY_01',width: "100px"},
							                  {label: 'WEEK12',  type: 'amount', path: 'WEEK_12_QTY_01',width: "100px"},
							                  {label: 'WEEK13',  type: 'amount', path: 'WEEK_13_QTY_01',width: "100px"},
							                  {label: 'WEEK14',  type: 'amount', path: 'WEEK_14_QTY_01',width: "100px"},
							                  {label: 'WEEK15',  type: 'amount', path: 'WEEK_15_QTY_01',width: "100px"},
							                  {label: 'WEEK16', type: 'amount',  path: 'WEEK_16_QTY_01',width: "100px"},
							                  {label: 'WEEK17',  type: 'amount', path: 'WEEK_17_QTY_01',width: "100px"},
							                  {label: 'WEEK18', type: 'amount',  path: 'WEEK_18_QTY_01',width: "100px"},
							                  {label: 'WEEK19',  type: 'amount', path: 'WEEK_19_QTY_01',width: "100px"},
							                  {label: 'WEEK20',  type: 'amount', path: 'WEEK_20_QTY_01',width: "100px"},
							                  
							                  {label: 'WEEK21',  type: 'amount', path: 'WEEK_21_QTY_01',width: "100px"},
							                  {label: 'WEEK22',  type: 'amount', path: 'WEEK_22_QTY_01',width: "100px"},
							                  {label: 'WEEK23',  type: 'amount', path: 'WEEK_23_QTY_01',width: "100px"},
							                  {label: 'WEEK24',  type: 'amount', path: 'WEEK_24_QTY_01',width: "100px"},
							                  {label: 'WEEK25',  type: 'amount', path: 'WEEK_25_QTY_01',width: "100px"},
							                  {label: 'WEEK26',  type: 'amount', path: 'WEEK_26_QTY_01',width: "100px"},
							                  {label: 'WEEK27',  type: 'amount', path: 'WEEK_27_QTY_01',width: "100px"},
							                  {label: 'WEEK28',  type: 'amount', path: 'WEEK_28_QTY_01',width: "100px"},
							                  {label: 'WEEK29', type: 'amount',  path: 'WEEK_29_QTY_01',width: "100px"},
							                  {label: 'WEEK30',  type: 'amount', path: 'WEEK_30_QTY_01',width: "100px"},
							                  
							                  {label: 'WEEK31',  type: 'amount', path: 'WEEK_31_QTY_01',width: "100px"},   
							                  {label: 'WEEK32',  type: 'amount', path: 'WEEK_32_QTY_01',width: "100px"},
							                  {label: 'WEEK33',  type: 'amount', path: 'WEEK_33_QTY_01',width: "100px"},
							                  {label: 'WEEK34', type: 'amount',  path: 'WEEK_34_QTY_01',width: "100px"},
							                  {label: 'WEEK35',  type: 'amount', path: 'WEEK_35_QTY_01',width: "100px"},
							                  {label: 'WEEK36', type: 'amount',  path: 'WEEK_36_QTY_01',width: "100px"},
							                  {label: 'WEEK37', type: 'amount',  path: 'WEEK_37_QTY_01',width: "100px"},
							                  {label: 'WEEK38',  type: 'amount', path: 'WEEK_38_QTY_01',width: "100px"},
							                  {label: 'WEEK39', type: 'amount',  path: 'WEEK_39_QTY_01',width: "100px"},
							                  {label: 'WEEK40',  type: 'amount', path: 'WEEK_40_QTY_01',width: "100px"},
							                  
							                  {label: 'WEEK41',  type: 'amount', path: 'WEEK_41_QTY_01',width: "100px"},
							                  {label: 'WEEK42', type: 'amount',  path: 'WEEK_42_QTY_01',width: "100px"},
							                  {label: 'WEEK43',  type: 'amount', path: 'WEEK_43_QTY_01',width: "100px"},
							                  {label: 'WEEK44',  type: 'amount', path: 'WEEK_44_QTY_01',width: "100px"},
							                  {label: 'WEEK45',  type: 'amount', path: 'WEEK_45_QTY_01',width: "100px"},
							                  {label: 'WEEK46',  type: 'amount', path: 'WEEK_46_QTY_01',width: "100px"},
							                  {label: 'WEEK47', type: 'amount',  path: 'WEEK_47_QTY_01',width: "100px"},
							                  {label: 'WEEK48',  type: 'amount', path: 'WEEK_48_QTY_01',width: "100px"},
							                  {label: 'WEEK49', type: 'amount',  path: 'WEEK_49_QTY_01',width: "100px"},
							                  {label: 'WEEK50', type: 'amount',  path: 'WEEK_50_QTY_01',width: "100px"},
							                  
							                  {label: 'WEEK51', type: 'amount',  path: 'WEEK_51_QTY_01',width: "100px"},
							                  {label: 'WEEK52',  type: 'amount', path: 'WEEK_52_QTY_01',width: "100px"},
							                  
                                              ]);
		
	
		
		var oTb2 = sapui5.table.createTable({id: 'tb-warterfall_monthly', 
            title: 'Detail',
            reportName: 'Waterfall Monthly Report',
            navigationMode: sap.ui.table.NavigationMode.Scrollbar,
            fixedColumnCount: 10, 
            toolbar: true}, 
              [
               {label: 'Item', path: 'EXT_MATNR',width: "120px"},
               {label: 'Item Desc.', path: 'MAKTX',width: "120px"},
               {label: 'Location', path: 'LOCNO',width: "120px"},							                  
//               {label: 'SnapShot Month',  path: 'CALMONTH_SNPT',width: "120px"},
               {label: 'SnapShot Day',  path: 'SNAP_DAY',width: "120px"},
               {label: 'QTY Type',  path: 'QTY_TYPE',width: "100px"},
              
//              {label: 'MONTH_5', type: 'amount',  path: 'MONTH_05_P_QTY',width: "100px"},
//              {label: 'MONTH_4', type: 'amount',  path: 'MONTH_04_P_QTY',width: "100px"},
//              {label: 'MONTH_3', type: 'amount',  path: 'MONTH_03_P_QTY',width: "100px"},
              {label: 'MONTH_2', type: 'amount',  path: 'MONTH_02_P_QTY_01',width: "100px"},
              {label: 'MONTH_1', type: 'amount',  path: 'MONTH_01_P_QTY_01',width: "100px"},
              {label: 'MONTH0', type: 'amount',  path: 'MONTH_00_QTY_01',width: "100px"},
              {label: 'MONTH1',  type: 'amount', path: 'MONTH_01_QTY_01',width: "100px"},
              {label: 'MONTH2',  type: 'amount', path: 'MONTH_02_QTY_01',width: "100px"},
              {label: 'MONTH3', type: 'amount',  path: 'MONTH_03_QTY_01',width: "100px"},
              {label: 'MONTH4',  type: 'amount', path: 'MONTH_04_QTY_01',width: "100px"},
              {label: 'MONTH5',  type: 'amount', path: 'MONTH_05_QTY_01',width: "100px"},
              {label: 'MONTH6', type: 'amount',  path: 'MONTH_06_QTY_01',width: "100px"},
              {label: 'MONTH7', type: 'amount',  path: 'MONTH_07_QTY_01',width: "100px"},
              {label: 'MONTH8',  type: 'amount', path: 'MONTH_08_QTY_01',width: "100px"},
              {label: 'MONTH9',  type: 'amount', path: 'MONTH_09_QTY_01',width: "100px"},
              {label: 'MONTH10', type: 'amount',  path: 'MONTH_10_QTY_01',width: "100px"},
              {label: 'MONTH11', type: 'amount',  path: 'MONTH_11_QTY_01',width: "100px"},
              {label: 'MONTH12', type: 'amount',  path: 'MONTH_12_QTY_01',width: "100px"},
      
              ]);		

		
		var oTb3 = sapui5.table.createTable({id: 'tb-warterfall_quarterly', 
            title: 'Detail',
            reportName: 'Waterfall Quarterly Report',
            navigationMode: sap.ui.table.NavigationMode.Scrollbar,
            fixedColumnCount: 10, 
            toolbar: true}, 
              [
               {label: 'Item', path: 'EXT_MATNR',width: "120px"},
               {label: 'Item Desc.', path: 'MAKTX',width: "120px"},
               {label: 'Location', path: 'LOCNO',width: "120px"},							                  
//               {label: 'SnapShot Quarter',  path: 'CALQUARTER_SNPT',width: "120px"},
               {label: 'SnapShot Day',  path: 'SNAP_DAY',width: "120px"},
               {label: 'QTY Type',  path: 'QTY_TYPE',width: "100px"},
              
              {label: 'Q_1',  type: 'amount', path: 'QUARTER_1_P_QTY_01',width: "100px"},
              {label: 'Q0', type: 'amount',  path: 'QUARTER_0_QTY_01',width: "100px"},
              {label: 'Q1',  type: 'amount', path: 'QUARTER_1_QTY_01',width: "100px"},
              {label: 'Q2',  type: 'amount', path: 'QUARTER_2_QTY_01',width: "100px"},
              {label: 'Q3',  type: 'amount', path: 'QUARTER_3_QTY_01',width: "100px"},
              {label: 'Q4', type: 'amount',  path: 'QUARTER_4_QTY_01',width: "100px"},
     
              ]);	
		

		var oHSB1 = new sap.ui.core.ScrollBar("horiSB1");
		oHSB1.setVertical(false);
		oHSB1.setSize("1024px");
		//oHSB.setContentSize("500px");
		// Initial scroll position in px
		oHSB1.setScrollPosition(0);

		// attach it to some other element in the page
		oHSB1.placeAt(oTb1);
		
		//modified by caozh4 20170310
		var oGrid = new sap.ui.layout.Grid({
			defaultSpan: "L12 M12 S12",
			content: [oPanel, oTb1,oTb2,oTb3]
		});
		return oGrid;
		
//		var oVertical = new sap.ui.layout.VerticalLayout({
//			content: [oPanel, oTb1,oTb2,oTb3]
//		})
//
//		return oVertical;
		
	}
});