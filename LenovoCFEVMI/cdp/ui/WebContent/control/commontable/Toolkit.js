jQuery.sap.require("sap.ui.core.format.DateFormat");
jQuery.sap.require("lenovo.control.Constants");
jQuery.sap.require("lenovo.control.Util");
jQuery.sap.require("lenovo.control.MessageBox");
jQuery.sap.declare("lenovo.control.commontable.Toolkit"); 
jQuery.sap.require("lenovo.service.Common");
jQuery.sap.require("lenovo.control.LenovoValueHelpField");

sap.ui.model.SimpleType.extend("lenovo.control.commontable.dropdownTable", {
    formatValue: function(oValue) {
    	return oValue.join(",");
    },
    parseValue: function(oValue) {
    	if(oValue === null || $.trim(oValue) === ""){
    		return [];
    	} else {
    		return oValue.split(",");
    	}
    },
    validateValue: function(oValue) {
      
    }
});
sap.ui.model.SimpleType.extend("lenovo.control.commontable.yyyymmddDate", {
    formatValue: function(oValue) {
    	return oValue;
    },
    parseValue: function(oValue) {
    	return oValue;
    },
    validateValue: function(oValue) {
    }
});
/*sap.ui.model.type.Date.extend("lenovo.control.commontable.utcDate", {
	formatValue: function(oValue, sInternalType) {
    	switch(sInternalType) {
			case "string":
				if (oValue == null) {
					return "";
				}
				if (this.oInputFormat) {
					if (this.oFormatOptions.source.pattern == "timestamp") {
						if(typeof(oValue) != "number"){
							if (isNaN(oValue)) {
								throw new sap.ui.model.FormatException("Cannot format date: " + oValue + " is not a valid Timestamp");
							}else{
								oValue = parseInt(oValue, 10);
							}
						}
						oValue= new Date(oValue);
					}else{
						if (oValue == "") {
							return "";
						}
						oValue = this.oInputFormat.parse(oValue);
						if (oValue == null) {
							throw new sap.ui.model.FormatException("Cannot format date: " + oValue + " has the wrong format");
						}
					}
				}
				return this.oOutputFormat.format(oValue, true);
			default:
				throw new sap.ui.model.FormatException("Don't know how to format Date to " + sInternalType);
		}
    	return oValue;
    },
    parseValue: function(oValue, sInternalType) {
    	var oResult;
		switch(sInternalType) {
			case "string":
				if (oValue === "") {
					return null;
				}
				var oResult = this.oOutputFormat.parse(oValue);
				if (!oResult) {
					throw new sap.ui.model.ParseException(oValue + " is not a valid Date value");
				}
				if (this.oInputFormat) {
					if (this.oFormatOptions.source.pattern == "timestamp") {
						oResult = oResult.getTime();
					}else{
						oResult = this.oInputFormat.format(oResult, true);
					}
				}
				return oResult;
			default:
				throw new sap.ui.model.ParseException("Don't know how to parse Date from " + sInternalType);
		}
    }
});
sap.ui.model.type.Date.extend("lenovo.control.commontable.utcPlus8Date", {
	formatValue: function(oValue, sInternalType) {
    	switch(sInternalType) {
			case "string":
				if (oValue == null) {
					return "";
				}
				if (this.oInputFormat) {
					if (this.oFormatOptions.source.pattern == "timestamp") {
						if(typeof(oValue) != "number"){
							if (isNaN(oValue)) {
								throw new sap.ui.model.FormatException("Cannot format date: " + oValue + " is not a valid Timestamp");
							}else{
								oValue = parseInt(oValue, 10);
							}
						}
						oValue= new Date(oValue);
					}else{
						if (oValue == "") {
							return "";
						}
						oValue = this.oInputFormat.parse(oValue);
						if (oValue == null) {
							throw new sap.ui.model.FormatException("Cannot format date: " + oValue + " has the wrong format");
						}
					}
				}
				return this.oOutputFormat.format(oValue, true);
			default:
				throw new sap.ui.model.FormatException("Don't know how to format Date to " + sInternalType);
		}
    	return oValue;
    },
	parseValue: function(oValue, sInternalType){
		var oResult;
		switch(sInternalType) {
			case "string":
				if (oValue === "") {
					return null;
				}
				var oResult = this.oOutputFormat.parse(oValue);
				if (!oResult) {
					throw new sap.ui.model.ParseException(oValue + " is not a valid Date value");
				}
				if (this.oInputFormat) {
					if (this.oFormatOptions.source.pattern == "timestamp") {
						oResult = oResult.getTime();
					}else{
						oResult = this.oInputFormat.format(oResult, true);
					}
				}
				oResult.setTime(oResult.getTime() + 8 * 60 * 60 * 1000);
				return oResult;
			default:
				throw new sap.ui.model.ParseException("Don't know how to parse Date from " + sInternalType);
		}
	}
});*/
sap.ui.model.SimpleType.extend("lenovo.control.commontable.singleQuotes", {
    formatValue: function(oValue) {
    	var regx = /^'.*'$/;
    /*	if(oValue && regx.test(oValue)) {
    		return oValue.substring(1, oValue.length-1);
    	} else {
    		return oValue;
    	}*/
    	var array = [];
    	if(oValue === null) {
    		return "";
    	} 
    	for(var i = 0; i < oValue.length; i++) {
    		if( oValue[i] && regx.test(oValue[i])) {
    			array.push(oValue[i].substring(1, oValue[i].length-1))
    		} else {
    			array.push(oValue[i]);
    		}
    	}
    	return array.join(",");
    },
    parseValue: function(oValue) {
    	//return "'" + oValue + "'";
    	var array = [];
    	if(oValue === null || $.trim(oValue) === ""){
    		return array;
    	} else {
    		array = oValue.split(",");
    		for(var i = 0; i < array.length; i++) {
    			array[i] = "'" + array[i] + "'";
    		}
    		return array;
    	}
    },
    validateValue: function(oValue) {
      
    }
});
lenovo.control.commontable.Toolkit = {
	service: new lenovo.service.Common(),
	splitChunck: function(number, array) {
		var len = array.length,
			chunckArray = [];
		number = number || 3;
		var chunk = Math.ceil(len / number);
		var j, temparray;
		for (j = 0; j < len; j += chunk) {
			temparray = array.slice(j, j + chunk);
			chunckArray.push(temparray);
		}
		return chunckArray;
	},
	getMatchedElementFromArray: function(key, value, array){
		var arr = [];
		for(var i =0; i < array.length; i++) {
			if(array[i][key] === value) {
				arr.push(array[i]);
			}
		}
		return arr;
	},
	getWindowHeight: function(){
		var viewHeight = document.documentElement.clientHeight || window.innerHeight;
		//console.log("viewHeight", viewHeight);
		return viewHeight;
	},
	getDefaultHeaderHeight: function(row){
		row = row || 1;
		var headerHeight = 50;
		var viewHeaderHeight = 30;
		var filterPanelHeight = 30 + row * 25 + 20;
		var toolBarHeight = 12 + 30 + 1;
		var tableHeader = 32;
		var notSure = 50;
		return headerHeight + viewHeaderHeight + filterPanelHeight + toolBarHeight + tableHeader + notSure;
	},
	getDefaultVisibleRowCount: function(rowHeight, totalHeight){
		var totalHeight = totalHeight ||  this.getWindowHeight();
		var visibleCount = parseInt(totalHeight/rowHeight);
		visibleCount = visibleCount > 0 ? visibleCount : 1;
		//console.log("visibleCount",  visibleCount);
		return visibleCount;
	},
	timeDateFormat: sap.ui.core.format.DateFormat.getDateTimeInstance({
		pattern: "yyyy-MM-dd T HH:mm:ss"
		
	}),
	dateDateFormat: sap.ui.core.format.DateFormat.getDateTimeInstance({
		pattern: "yyyyMMdd"
	}),
	yyyy_mm_ddDateFormat: sap.ui.core.format.DateFormat.getDateTimeInstance({
		pattern: "yyyy-MM-dd"
	}),
	yyyy_mm_dd_hh_mm_ssDateFormat:  sap.ui.core.format.DateFormat.getDateTimeInstance({
		pattern: "yyyy-MM-dd HH:mm:ss"
	}),
	timeDateFormatUsa: sap.ui.core.format.DateFormat.getDateTimeInstance({
		pattern: "MM-dd-yyyy T HH:mm:ss"
		
	}),
	getColumnByField: function(field, table) {
		var columns = table.getColumns();
		for (var i = 0; i < columns.length; i++) {
			if (columns[i].getFilterProperty() === field)
				return columns[i];
		}
	},
	getColumnIndexByField: function(field, table) {
		var columns = table.getColumns();
		// for(var key in columns) {
		for(var key = columns.length-1; key >= 0; key-- ){
			if(!columns[key].getVisible()) {
				columns.splice(key, 1);
				// key -= 1;
			}
		}
		for (var i = 0; i < columns.length; i++) {
			if (columns[i].getLabel().getText() === field)
				return i;
		}
		return -1;
	},
	getColumnIndByField: function(field, table) {
		var columns = table.getColumns();
		for (var i = 0; i < columns.length; i++) {
			if (columns[i].getLabel().getText() === field)
				return i;
		}
	},

	/*
		config filter 
		{
			type: "TextField",
			textfield: {
				defaultFilterOp: "EQ"
			}
		}
		{
			type: "DropdownTable",
			dropdowntable: {
				url: 
				bindRowUrl: 
				columns:[],
			}
		}

		{
			type: "DropdownBox",
			dropdownbox: {
				data: [{text: "", key: ""}],
				odata: {
					url: 
					bindTextField:
					bindKeyField:
					bindItemUrl:
				},
				xsjs: {
	
				}
			}
		}

		{
			type: "ListBox",
			listbox: {
				odata: {
					url:
					bindTextField:
					bindKeyField:
					bindItemUrl:
				},
				xsjs: {
					url: 
				},
				data: [{
					text: "",
					key: ""
				}]
			}
		}

		{
			type: "MultiEQ",
			multieq: {
				defaultFilterOp: "EQ"
			}
		}

		{
			type: "MultiTextField",
			multitextfield: {
				defaultFilterOp: "EQ"
			}
		}
	*/
	getDefaultLayout: function(number){
		var layout = {};
		var defaultSpan = Math.floor(12 / number);
		defaultSpan = "L" + defaultSpan + " M" + defaultSpan + " S" + defaultSpan;
		for(var i = 0; i < number; i++) {
			if(number == 1) {
				layout[i] = new sap.ui.layout.GridData({span: "L4 M4 S4"});
			}else {
				layout[i] = new sap.ui.layout.GridData({span: defaultSpan});
			}
			
		}
		return layout;
	},
	_createDropdownbox: function(oDropDownBox){
		var config = oDropDownBox.data("config");
		var url, bindKeyField, bindTextField, defaultSelectAll;
		url = config.odata.url;
		bindKeyField = config.odata.bindKeyField;
		bindTextField = config.odata.bindTextField;
		defaultSelectAll = config.odata.defaultSelectAll;
		$.ajax({
			url: url,
			type: "get",
			async: true,     //coral 4/23/2015 loading too slow
			datatype: "json",
			success: function(data){			
				var oItem;
				if(defaultSelectAll) {
					var allOItem =  new sap.ui.core.ListItem({
						text: lenovo.control.Constants.allDropdownBoxListItem,
						key: lenovo.control.Constants.allDropdownBoxListItem
					});
					oDropDownBox.addItem(allOItem);
				}
				data = data.d.results;
				if(config.defaultFilterValue) {
					for(var i = 0; i < data.length; i++) {
						if(data[i][bindKeyField] === config.defaultFilterValue) {
							data.unshift(data.splice(i, 1)[0]);
							break;
						}
					}
				}
				var results = [];
				$.each(data, function(index, value) {
					if(value && value[bindKeyField] && value[bindKeyField].length) {
						oItem = new sap.ui.core.ListItem({
							text: value[bindTextField],
							key: value[bindKeyField]
						});
						//oDropDownBox.ComboBox(oItem);
						oDropDownBox.addItem(oItem);
					}
				});
				if(config.defaultFilterValue) {
					oDropDownBox.setSelectedKey(config.defaultFilterValue);
				}

			}
		});
	},
	_createFilterControl: function(filter, filterModel){
		var oControl;
		if(filter instanceof Array){
			filter = filter[0];
		}
		var type = filter.type || "TextField";
		var dropdownBoxModel;
		var that = this;
		switch (type) {
			case "DropdownBox" || "ComboBox": //dropdownbox already be instead by sap.m.ComboBox zhaodan1 2017/1/4
				var dropdownBoxConfig = filter.dropdownbox;
				var oItem, url, bindTextField, bindKeyField, bindItemUrl, defaultSelectAll;
				var oDropDownBox = new sap.m.ComboBox({ // sap.ui.commons.DropdownBox({
					layoutData: (dropdownBoxConfig && dropdownBoxConfig.layout) || new sap.ui.layout.GridData({
						span: "L8 M8 S8"
					})
				});
				if(dropdownBoxConfig.data && dropdownBoxConfig.data.length > 0) {
					$.each(dropdownBoxConfig.data, function(index, value) {
						oItem = new sap.ui.core.ListItem({
							text: value.text, 
							key: value.key
						});
						oDropDownBox.addItem(oItem);
					});
					if(filter.dropdownbox.defaultFilterValue) {
						oDropDownBox.setSelectedKey(filter.dropdownbox.defaultFilterValue);
					}
				} else if(dropdownBoxConfig.odata) {
					//coral 4/24/2015
					oDropDownBox.data("config", dropdownBoxConfig);
					that._createDropdownbox(oDropDownBox);
				}
				oDropDownBox.attachChange(function(){
					var selectKey = this.getSelectedKey();
					filterModel.setProperty("/" + filter.field + "/filterValue", selectKey);
					//console.log("filterModel dropdown box", filterModel.getProperty("/" + filter.field + "/filterValue"));
				});
				
				this._required(filter, oDropDownBox);
				this._validateInsert(filter, oDropDownBox);
				
				oControl = new sap.ui.layout.form.FormElement({
					label: filter.label,
					fields: [oDropDownBox]
				});
				break;
			case "TextField":
				var textFieldConfig = filter.textfield;
				var oTextField = new sap.ui.commons.TextField({
					value: {
						path: "/" + filter.field + "/filterValue",
						type: (textFieldConfig && textFieldConfig.type) || new lenovo.control.commontable.dropdownTable()
					},
					layoutData: (textFieldConfig && textFieldConfig.layout) || new sap.ui.layout.GridData({span: "L8 M8 S8"}) 
				});
				if(textFieldConfig && textFieldConfig.enabled === false) {
					oTextField.setEnabled(false);
				};
				this._required(filter, oTextField);
				this._validateInsert(filter, oTextField);
				oControl = new sap.ui.layout.form.FormElement({
					label: filter.label,
					fields: [oTextField]
				});
				break;
			case "AutoComplete":
				var autoCompleteConfig = filter.autocomplete;
				var oAutoCpmplete =  new sap.ui.commons.AutoComplete({
					value: {
						path: "/" + filter.field + "/filterValue"
					},
					layoutData: (autoCompleteConfig && autoCompleteConfig.layout) || new sap.ui.layout.GridData({span: "L8 M8 S8"}),
					suggest: function(oEvent){
						oAutoCpmplete.destroyItems();
						var sValue = oEvent.getParameter("suggestValue");
						if(sValue && sValue.length > 0) {
							$.ajax({
								url: autoCompleteConfig.url(sValue, filterModel),
								type: "GET",
								dataType: "json",
								success: function(data){
									data = data.d.results;
									oAutoCpmplete.destroyItems();
									for(var i = 0, len = data.length; i < len; i++) {
										oAutoCpmplete.addItem(new sap.ui.core.ListItem({
											text: data[i][autoCompleteConfig.bindTextField],
											key:  data[i][autoCompleteConfig.bindKeyField]
										}));
									}
								}
							});
						}
					}
				});
				this._required(filter, oAutoCpmplete);
				this._validateInsert(filter, oAutoCpmplete);
				oControl = new sap.ui.layout.form.FormElement({
					label: filter.label,
					fields: [oAutoCpmplete]
				});
			break;
			case "TimeRange":
				var timeRangeConfig = filter.timerange;
				var oFromLabel = new sap.ui.commons.Label({
					text: "From",
					layoutData: (timeRangeConfig && timeRangeConfig.fromLabelLayout) || new sap.ui.layout.GridData({span: "L1 M1 S1"}) 
				});
				var oFromDatePicker = new sap.ui.commons.DatePicker({
					value: {
						path: "/" + filter.field + "/filterValue/start",
						type: new sap.ui.model.type.Date({
							//chris gao
							pattern: (timeRangeConfig && timeRangeConfig.datepicker && timeRangeConfig.datepicker.format) || "yyyy-MM-dd HH:mm"//"yyyy-MM-dd HH:mm"
						})
					},
					change: function(){
						console.log("filterModel timerange start", filterModel.getProperty("/" + filter.field + "/filterValue/start"));
					},
					layoutData:  (timeRangeConfig && timeRangeConfig.fromDatePickerLayout) || new sap.ui.layout.GridData({span: "L3 M3 S3"}) 
				});
				var oEndLabel = new sap.ui.commons.Label({
					text: "To",
					layoutData:  (timeRangeConfig && timeRangeConfig.endLabelLayout) || new sap.ui.layout.GridData({span: "L1 M1 S1"}) 
				});
				var oEndDatePicker = new sap.ui.commons.DatePicker({
					value: {
						path: "/" + filter.field + "/filterValue/end",
						type: new sap.ui.model.type.Date({
							//chris gao
							pattern: (timeRangeConfig && timeRangeConfig.datepicker && timeRangeConfig.datepicker.format) || "yyyy-MM-dd HH:mm"//"yyyy-MM-dd HH:mm"
						})
					},
					layoutData:  (timeRangeConfig && timeRangeConfig.endDatePickerLayout) ||  new sap.ui.layout.GridData({span: "L3 M3 S3"}) 
				});
				this.validateDatePickerCompare(oFromDatePicker, oEndDatePicker);
				oControl = new  sap.ui.layout.form.FormElement({
					label: filter.label,
					fields: [
						oFromLabel,
						oFromDatePicker,
						oEndLabel,
						oEndDatePicker
					]
				});
				break;
			case "DropdownTable":	
				var dropDownTableConfig = filter.dropdowntable;
				var oValueHelpField = new sap.ui.commons.ValueHelpField({
					value: {
						path: "/" + filter.field + "/filterValue",
						type: new lenovo.control.commontable.dropdownTable(),
						mode: sap.ui.model.BindingMode.TwoWay,
					},
					//enabled:false,//Chris Gao
					valueHelpRequest: function(){
						var returnDropdownTable= that.popupDropdownTable(filter, filterModel, oValueHelpField);
						var oDialog = returnDropdownTable.dialog;
						var table = returnDropdownTable.table;
						oDialog.open();
						if(dropDownTableConfig.reload) {
							var args = [table];
							if(dropDownTableConfig.reload.args) {
								for(var i = 0; i < dropDownTableConfig.reload.args.length; i++) {
									args.push(dropDownTableConfig.reload.args[i]);
								}
							}
							dropDownTableConfig.reload.func.apply(dropDownTableConfig.reload.context ||window,  args)
						}
					},
					layoutData:  (dropDownTableConfig && dropDownTableConfig.layout) ||  new sap.ui.layout.GridData({span: "L8 M8 S8"}) 
				});
				/*var returnDropdownTable= this.popupDropdownTable(filter, filterModel, oValueHelpField);
				var oDialog = returnDropdownTable.dialog;
				var table = returnDropdownTable.table;*/
				this._required(filter, oValueHelpField);
				this._validateInsert(filter, oValueHelpField);
				oControl = new sap.ui.layout.form.FormElement({
					label: filter.label,
					fields: [oValueHelpField]
				});
			break;
			case "ListBox":
				var listBoxConfig = filter.listbox;
				var oItem, url, bindTextField, bindKeyField, bindItemUrl;
				var oListBox = new sap.ui.commons.ListBox({
					visibleItems : 4,
					allowMultiSelect: true,
					layoutData:  (listBoxConfig && listBoxConfig.layout) ||  new sap.ui.layout.GridData({span: "L8 M8 S8"})
				});
				if(listBoxConfig.data && listBoxConfig.data.length > 0) {
					$.each(listBoxConfig.data, function(index, value) {
						oItem = new sap.ui.core.ListItem({
							text: value.text, 
							key: value.key
						});
						oListBox.addItem(oItem);
					});
				} 
				else if(listBoxConfig.odata) {
					oItem = new sap.ui.core.ListItem();
					url = listBoxConfig.odata.url;
					bindTextField =  listBoxConfig.odata.bindTextField;
					bindKeyField = listBoxConfig.odata.bindKeyField;
					bindItemUrl = listBoxConfig.odata.bindItemUrl;
					$.ajax({
						url: url,
						type: "get",
						datatype: "json",
						success: function(data){			
							var oItem;
							data = data.d.results;
							$.each(data, function(index, value) {
								oItem = new sap.ui.core.ListItem({
									text: value[bindTextField],
									key: value[bindKeyField]
								});
								oListBox.addItem(oItem);
							});
						}
					});
				} else if(listBoxConfig.xsjs) {
					var url = listBoxConfig.xsjs.url;
					$.getJSON(url, function(data){
						$.each(data, function(index, value){
							oItem = new sap.ui.core.ListItem();
							oItem.setText({
								text: value.text,
								key: value.key
							});
							oListBox.addItem(oItem);
						});
					});
				}
				//oListBox.bindProperty("value", "/" + filter.field + "/filterValue");
				oListBox.attachSelect(function() {
					var filterValue = []; 
					var selectItems = this.getSelectedItems();
					$.each(selectItems, function(idx,item){
						filterValue.push(item.getText());
					});
					//console.log("filterValue", filterValue);
					filterModel.setProperty("/" + filter.field + "/filterValue", filterValue);
					console.log("filterModel listBox", filterModel.getProperty("/" + filter.field + "/filterValue"));
				});
				oControl = new sap.ui.layout.form.FormElement({
					label: filter.label,
					fields: [oListBox]
				});
			break;
			case "MultiEQ":
				var multiEQConfig = filter.multieq;

				var oDropDownBox = new sap.ui.commons.DropdownBox({
					items: [
						new sap.ui.core.ListItem({
							key: "EQ",
							text: "="
						}),
						new sap.ui.core.ListItem({
							key: "LT",
							text: "<"
						}), new sap.ui.core.ListItem({
							key: "LE",
							text: "<="
						}), new sap.ui.core.ListItem({
							key: "GT",
							text: ">"
						}), new sap.ui.core.ListItem({
							key: "GE",
							text: ">="
						}), new sap.ui.core.ListItem({
							key: "NE",
							text: "!="
						})
					],
					layoutData: (multiEQConfig && multiEQConfig.opLayout)||new sap.ui.layout.GridData({span: "L3 M3 S3"}) 
				});
				if(filter.multieq && filter.multieq.defaultFilterOp) {
					oDropDownBox.setSelectedKey(filter.multieq.defaultFilterOp);
				} 
				oDropDownBox.onselect = function(){
					var selectKey = this.getSelectedKey();
					filterModel.setProperty("/" + filter.field + "/filterOperator", selectKey);
					//console.log("multieq filtermodel filterOperator", filterModel.getProperty("/" + filter.field + "/filterOperator"));
					//console.log("multieq filtermodel filterValue", filterModel.getProperty("/" + filter.field + "/filterValue"));
				}
				var oTextField = new sap.ui.commons.TextField({
					value: {
						path: "/" + filter.field + "/filterValue"
					},
					layoutData: (multiEQConfig && multiEQConfig.valueLayout)||new sap.ui.layout.GridData({span: "L5 M5 S5"}) 
				});
				this._required(filter, oTextField);
				this._validateInsert(filter, oTextField);
				oControl = new sap.ui.layout.form.FormElement({
					label: filter.label,
					fields: [oDropDownBox, oTextField]
				});
			break;
			case "MultiDatePicker":
				var multiDatePickerConfig = filter.multidatepicker;
				var oDropDownBox = new sap.ui.commons.DropdownBox({
					items: [
						new sap.ui.core.ListItem({
							key: "EQ",
							text: "="
						}),
						new sap.ui.core.ListItem({
							key: "LT",
							text: "<"
						}), new sap.ui.core.ListItem({
							key: "LE",
							text: "<="
						}), new sap.ui.core.ListItem({
							key: "GT",
							text: ">"
						}), new sap.ui.core.ListItem({
							key: "GE",
							text: ">="
						}), new sap.ui.core.ListItem({
							key: "NE",
							text: "!="
						})
					],
					layoutData: (multiDatePickerConfig && multiDatePickerConfig.opLayout)||new sap.ui.layout.GridData({span: "L3 M3 S3"}) 
				});
				if(filter.multidatepicker && filter.multidatepicker.defaultFilterOp) {
					oDropDownBox.setSelectedKey(filter.multidatepicker.defaultFilterOp);
				} 
				oDropDownBox.onselect = function(){
					var selectKey = this.getSelectedKey();
					filterModel.setProperty("/" + filter.field + "/filterOperator", selectKey);
					console.log("multieq filtermodel filterOperator", filterModel.getProperty("/" + filter.field + "/filterOperator"));
					console.log("multieq filtermodel filterValue", filterModel.getProperty("/" + filter.field + "/filterValue"));
				}
				var oDatePicker = new sap.ui.commons.DatePicker({
					value: {
						path: "/" + filter.field + "/filterValue",
						type: new sap.ui.model.type.Date({
							pattern: "yyyy-MM-dd"
						})
					},
					layoutData: (multiDatePickerConfig && multiDatePickerConfig.valueLayout)||new sap.ui.layout.GridData({span: "L5 M5 S5"})
				});
				this._required(filter, oDatePicker);
				this._validateInsert(filter, oDatePicker);
				oControl = new sap.ui.layout.form.FormElement({
					label: filter.label,
					fields: [oDropDownBox, oDatePicker]
				});
			break;
			case "MultiTextField":
				var multiTextfieldConfig = filter.multitextfield;
				var oDropDownBox = new sap.ui.commons.DropdownBox({
					items: [
						new sap.ui.core.ListItem({
							key: "Contains",
							text: "%="
						}),
						new sap.ui.core.ListItem({
							key: "EQ",
							text: "="
						}), new sap.ui.core.ListItem({
							key: "StartsWith",
							text: "StartsWith"
						}),new sap.ui.core.ListItem({
							key: "EndsWith",
							text: "EndsWith"
						}),new sap.ui.core.ListItem({
							key: "NE",
							text: "!="
						})
					],
					layoutData: (multiTextfieldConfig && multiTextfieldConfig.opLayout)||new sap.ui.layout.GridData({span: "L3 M3 S3"}) 
				});
				if(filter.multitextfield && filter.multitextfield.defaultFilterOp) {
					oDropDownBox.setSelectedKey(filter.multitextfield.defaultFilterOp);
				} 
				oDropDownBox.onselect = function(){
					var selectKey = this.getSelectedKey();
					filterModel.setProperty("/" + filter.field + "/filterOperator", selectKey);
					console.log("multieq filtermodel filterOperator", filterModel.getProperty("/" + filter.field + "/filterOperator"));
					console.log("multieq filtermodel filterValue", filterModel.getProperty("/" + filter.field + "/filterValue"));
				}
				var oTextField = new sap.ui.commons.TextField({
					value: {
						path: "/" + filter.field + "/filterValue",
						type: (multiTextfieldConfig && multiTextfieldConfig.type) || new lenovo.control.commontable.dropdownTable()
					},
					layoutData: (multiTextfieldConfig && multiTextfieldConfig.valueLayout)||new sap.ui.layout.GridData({span: "L5 M5 S5"})
				});
				this._required(filter, oTextField);
				this._validateInsert(filter, oTextField);
				oControl = new sap.ui.layout.form.FormElement({
					label: filter.label,
					fields: [oDropDownBox, oTextField]
				});
			break;
			case "CheckBox": 
				var checkboxConfig = filter.checkbox;
				var oCheckBox = new sap.ui.commons.CheckBox({
					checked: {
						path: "/" + filter.field + "/filterValue"
					},
					layoutData: (filter && filter.layout) || new sap.ui.layout.GridData({span: "L6 M6 S6"})
				});
				oControl = new sap.ui.layout.form.FormElement({
					label: filter.label,
					fields: [oCheckBox]
				});
			break;
		}
		oControl.getLabelControl().setTooltip(filter.label);
		oControl.getLabelControl().setLayoutData(new sap.ui.layout.GridData({
			span: "L4 M4 S4",
			linebreak: true
		}));
		if(filter && filter.hidden === true) {
			oControl.setVisible(false);
		}	
		if(filter.labelLayout) {
			oControl.getLabelControl().setLayoutData(filter.labelLayout);
		}
		return oControl;
	},
	popupDropdownTable: function(filter, filterModel, oValueHelpField){
		var that = this;
		var dropdownTableConfig = filter.dropdowntable;
		var url = dropdownTableConfig.url;
		var oModel = new sap.ui.model.odata.ODataModel(url, true);
		var table =  lenovo.control.commontable.Table.createTable(dropdownTableConfig);
		var filterPanel =  lenovo.control.commontable.Table.createFilter(dropdownTableConfig, table);
		table.setBusy(true);
		table.setModel(oModel);
		oModel.attachRequestCompleted(function(){
			table.setBusy(false);
		});
		var dialog = new sap.ui.commons.Dialog({
			width: '600px',
			title: 'Select',
			modal: true,
			content: [filterPanel, table],
			buttons: [new sap.ui.commons.Button({
				text: "Save and Return",
				press: function(){
					that._saveAndReturn(filter, table, filterModel, dialog);
					oValueHelpField.fireChange();
				}
			}), new sap.ui.commons.Button({
				text: "Cancel and Return",
				press: function(){
					table.clearSelection();
					that._cancelAndReturn(filter, table, filterModel, dialog);
					oValueHelpField.fireChange();
				}
			})]
		});
		return {
			dialog: dialog,
			table: table
		};
	},
	_saveAndReturn: function(filter, table, filterModel, dialog){
		var selectedIndices = table.getSelectedIndices();
		var field = filter.dropdowntable.field;
		var oModel = table.getModel();
		var context, rowData=[];
		for(var i = 0; i < selectedIndices.length; i++) {
			context = table.getContextByIndex(selectedIndices[i]);
			rowData.push(oModel.getProperty(field, context));
		}
		filterModel.setProperty("/" + filter.field + "/filterValue", rowData);
		dialog.close();
		//console.log("filterModel dropdown table" , filterModel.getProperty("/" + filter.field + "/filterValue"));
	},
	_cancelAndReturn: function(filter, table, filterModel, dialog){
		//filterModel.setProperty("/" + filter.field + "/filterValue", []);
		dialog.close();
		//console.log("filterModel dropdown table" , filterModel.getProperty("/" + filter.field + "/filterValue"));
	},
	_createCreateControl: function(column, insertModel){
		var oControl, oElement;
		var type = column.type || "TextField";
		var dropdownBoxModel;
		var that = this;
		switch (type) {
			case "DatePicker":
				var datePickerConfig = column.datepicker;
				oElement = new sap.ui.commons.DatePicker({
					value: {
						path: "/" + column.field + "/value",
						type: new sap.ui.model.type.Date({
							pattern: (datePickerConfig && datePickerConfig.format) || "yyyy-MM-dd"
						})
					},
					layoutData: (datePickerConfig && datePickerConfig.layout) || new sap.ui.layout.GridData({span: "L8 M8 S8"})
				});
				oControl = new sap.ui.layout.form.FormElement({
					label: column.label,
					fields: [oElement]
				});
				this._required(column, oElement);
				this._validateInsert(column, oElement);
				break;
			case "DropdownBox":
				var dropdownBoxConfig = column.dropdownbox;
				var oItem, url, bindTextField, bindKeyField, bindItemUrl, defaultSelectAll;
				var oElement = new sap.m.ComboBox({ // sap.ui.commons.DropdownBox({
					layoutData: (dropdownBoxConfig && dropdownBoxConfig.layout) || new sap.ui.layout.GridData({span: "L8 M8 S8"})
				});
				if(dropdownBoxConfig.data && dropdownBoxConfig.data.length > 0) {
					$.each(dropdownBoxConfig.data, function(index, value) {
						oItem = new sap.ui.core.ListItem({
							text: value.text, 
							key: value.key
						});
						oElement.addItem(oItem);
					});
					if(dropdownBoxConfig.defaultValue) {
						insertModel.setProperty("/" + column.field + "/value" , dropdownBoxConfig.defaultValue);
						oElement.setSelectedKey(dropdownBoxConfig.defaultValue);
					}
					else {
						insertModel.setProperty("/" + column.field , {
							value: dropdownBoxConfig.data[0].key
						});
					}
				} 
				else if(dropdownBoxConfig.odata) {
					url = dropdownBoxConfig.odata.url;
					bindKeyField = dropdownBoxConfig.odata.bindKeyField;
					bindTextField = dropdownBoxConfig.odata.bindTextField;
					$.ajax({
						url: url,
						type: "get",
						datatype: "json",
						async: false,
						success: function(data){			
							var oItem;
							data = data.d.results;
							if(dropdownBoxConfig.defaultValue) {
								
								for(var i = 0; i < data.length; i++) {
									if(data[i][bindKeyField] === dropdownBoxConfig.defaultValue) {
										data.unshift(data.splice(i, 1)[0]);
										break;
									}
								}
								
							}
							/**********************************
							 * Modified by Chris Gao
							 * 2015-09-22
							 * to add null row to drop down box
							 ***********************************/
							if(dropdownBoxConfig.defaultNullValue)
							{
								var allOItem =  new sap.ui.core.ListItem({
									text: lenovo.control.Constants.allDropdownBoxListItem,
									key: "N/A"
								});
								oElement.addItem(allOItem);
							}
							/*************************
							 * End by Chris Gao
							 ************************/
							$.each(data, function(index, value) {
								oItem = new sap.ui.core.ListItem({
									text: value[bindTextField],
									key: value[bindKeyField]
								});
								oElement.addItem(oItem);
							});
							if(dropdownBoxConfig.defaultValue) {
								insertModel.setProperty("/" + column.field + "/value" , dropdownBoxConfig.defaultValue);
								oElement.setSelectedKey(dropdownBoxConfig.defaultValue);
							}
							/**********************************
							 * Modified by Chris Gao
							 * 2015-09-22
							 * to add null row to drop down box
							 ***********************************/
							else if(dropdownBoxConfig.defaultNullValue)
							{
								
								insertModel.setProperty("/" + column.field + "/value" , "N/A");
								oElement.setSelectedKey("N/A");
							}
							/*************************
							 * End by Chris Gao
							 ************************/
							else {
								insertModel.setProperty("/" + column.field , {
									value: (data && data[0] && data[0][bindKeyField]) || ""
								});
							}
						}
					});
				}
				
				oElement.attachChange(function(){
					var selectKey = this.getSelectedKey();
					insertModel.setProperty("/" + column.field + "/value" , selectKey);
				});
				this._required(column, oElement);
				this._validateInsert(column, oElement);
				oControl = new sap.ui.layout.form.FormElement({
					label: column.label,
					fields: [oElement]
				});
			break;
			case "TextField":
				var textFieldConfig = column.textfield;
				var oElement = new sap.ui.commons.TextField({
					value: {
						path:  "/" + column.field + "/value"
					},
					layoutData: (textFieldConfig && textFieldConfig.layout) || new sap.ui.layout.GridData({span: "L8 M8 S8"})
				});
				if(textFieldConfig && textFieldConfig.enabled === false) {
					oElement.setEnabled(false);
				}
				this._required(column, oElement);
				this._validateInsert(column, oElement);
				oControl = new sap.ui.layout.form.FormElement({
					label: column.label,
					fields: [oElement]
				});
				break;
			case "PasswordField":
				var passwordFieldConfig = column.passwordfield;
				var oElement = new sap.ui.commons.PasswordField({
					value: {
						path:  "/" + column.field + "/value"
					},
					layoutData: (passwordFieldConfig && passwordFieldConfig.layout) || new sap.ui.layout.GridData({span: "L8 M8 S8"})
				});
				if(passwordFieldConfig && passwordFieldConfig.enabled === false) {
					oElement.setEnabled(false);
				}
				this._required(column, oElement);
				this._validateInsert(column, oElement);
				oControl = new sap.ui.layout.form.FormElement({
					label: column.label,
					fields: [oElement]
				});
				break;
			case "DropdownTable":
				var dropDownTableConfig = column.dropdowntable;
				/*****************************************
				 * Modified by Chris Gao
				 * 2015-09-24
				 * to add custom value help field in create box
				 *******************************************/
				if(column.uninput !== undefined && column.uninput == true)
				{
					var oValueHelpField = new lenovo.control.LenovoValueHelpField({
						value: {
							path: "/" + column.field + "/value"
						},
						placeholder:"-- only select --",
						valueHelpRequest: function(){
							var returnDropdownTable = that.popupInsertDropdownTable(column, insertModel, oValueHelpField);
							var oDialog = returnDropdownTable.dialog;
							var table = returnDropdownTable.table;
							oDialog.open();
							if(dropDownTableConfig.reload) {
								var args = [table];
								if(dropDownTableConfig.reload.args) {
									for(var i = 0; i < dropDownTableConfig.reload.args.length; i++) {
										args.push(dropDownTableConfig.reload.args[i]);
									}
								}
								dropDownTableConfig.reload.func.apply(dropDownTableConfig.reload.context ||window,  args)
							}
						},
						layoutData: (dropDownTableConfig && dropDownTableConfig.layout) || new sap.ui.layout.GridData({span: "L8 M8 S8"})
					});
				}
				else
				{
					var oValueHelpField = new sap.ui.commons.ValueHelpField({
						value: {
							path: "/" + column.field + "/value"
						},
						valueHelpRequest: function(){
							var returnDropdownTable = that.popupInsertDropdownTable(column, insertModel, oValueHelpField);
							var oDialog = returnDropdownTable.dialog;
							var table = returnDropdownTable.table;
							oDialog.open();
							if(dropDownTableConfig.reload) {
								var args = [table];
								if(dropDownTableConfig.reload.args) {
									for(var i = 0; i < dropDownTableConfig.reload.args.length; i++) {
										args.push(dropDownTableConfig.reload.args[i]);
									}
								}
								dropDownTableConfig.reload.func.apply(dropDownTableConfig.reload.context ||window,  args)
							}
						},
						layoutData: (dropDownTableConfig && dropDownTableConfig.layout) || new sap.ui.layout.GridData({span: "L8 M8 S8"})
					});
				}
				/****************************************
				 * End by Chris Gao
				 ****************************************/
				/*var returnDropdownTable = this.popupInsertDropdownTable(column, insertModel, oValueHelpField);
				var oDialog = returnDropdownTable.dialog;
				var table = returnDropdownTable.table;*/
				this._required(column, oValueHelpField);
				this._validateInsert(column, oValueHelpField);
				oControl = new sap.ui.layout.form.FormElement({
					label: column.label,
					fields: [oValueHelpField]
				});
			break;
		}
		oControl.getLabelControl().setLayoutData(new sap.ui.layout.GridData({
			span: "L4 M4 S4",
			linebreak: true
		}));
		if(column.labelLayout) {
			oControl.getLabelControl().setLayoutData(column.labelLayout);
		}
		return oControl;
	},
	_required: function(insertConfig, oElement){
		if(insertConfig.required) {
			oElement.addStyleClass("required");
		}
	},
	_validateInsert: function(insertConfig, oElement){
		if(insertConfig.validation && insertConfig.validation.length > 0) {
			oElement.attachChange(function(newValue){
				lenovo.control.commontable.Table._clearErrorPopup(this);
				var errors = lenovo.control.commontable.Table._getValidResult(insertConfig.validation, this);
				lenovo.control.commontable.Table._clearErrorPopup(this);
				lenovo.control.commontable.Table._showEditError(errors, this);
			});
		}
	},
	popupInsertDropdownTable: function(column, insertModel, oElement){
		var that = this;
		var dropdownTableConfig = column.dropdowntable;
		var url = dropdownTableConfig.url;
		var oModel = new sap.ui.model.odata.ODataModel(url, true);
		var table =  lenovo.control.commontable.Table.createTable(dropdownTableConfig);
		var filterPanel =  lenovo.control.commontable.Table.createFilter(dropdownTableConfig, table);
		table.setBusy(true);
		table.setModel(oModel);
		oModel.attachRequestCompleted(function(){
			table.setBusy(false);
		});
		var dialog = new sap.ui.commons.Dialog({
			width: '600px',
			title: 'Select',
			modal: true,
			content: [filterPanel, table],
			buttons: [new sap.ui.commons.Button({
				text: "Save and Return",
				press: function(){
					that._saveAndReturnInsert(column.dropdowntable, table, insertModel, dialog);
					oElement.fireChange();
				}
			}), new sap.ui.commons.Button({
				text: "Cancel and Return",
				press: function(){
					table.clearSelection();
					that._cancelAndReturnInsert(column.dropdowntable, table, insertModel, dialog);
					oElement.fireChange();
				}
			})]
		});
		return {
			dialog: dialog,
			table: table
		};
	},
	_saveAndReturnInsert: function(dropdownTableConfig, table, insertModel, dialog){
		
		/*******************************************************
		*custom execute panel drop down table multiple selection
		*Because execute config use toolkit._saveAndReturnInsert
		*Chris Gao 
		*2015-08-26
		********************************************************/
		var selectedIndices = table.getSelectedIndices();
		var fields = dropdownTableConfig.fields;
		var oModel = table.getModel();
		var context, rowData=[], field, value;
		
		if(dropdownTableConfig.multiSelection == true && fields.length == 1)// to process first field of multi select model
		{
			for(var i = 0; i < selectedIndices.length; i++) {
				context = table.getContextByIndex(selectedIndices[i]);
				field = fields[0].field;
				rowData.push(oModel.getProperty(field, context));
			}
			insertModel.setProperty("/" +  fields[0].bindByField + "/value", rowData); 
		}
		/*******************************************************
		*End by Chris Gao 
		*2015-08-26
		********************************************************/
		else
		{
			for(var i = 0; i < selectedIndices.length; i++) {
				context = table.getContextByIndex(selectedIndices[i]);
				for(var j = 0; j < fields.length; j++) {
					field = fields[j].field;
					value = oModel.getProperty(field, context);
					insertModel.setProperty("/" +  fields[j].bindByField + "/value", value);
				}
			}
		}

		dialog.close();
	},
	_cancelAndReturnInsert: function(dropdownTableConfig, table, insertModel, dialog){
		//var fields = dropdownTableConfig.fields;
		/*for(var j = 0; j < fields.length; j++) {
			insertModel.setProperty("/" +  fields[j].bindByField + "/value", null);
		}*/
		dialog.close();
	},
	_getInsertAllValidted: function(config, insertDialog){
		var oForm = insertDialog.getContent()[0];
		var insertConfig, oControl;
		var isValid = true;
		for(var i = 0; i < config.create.columns.length; i++)
			for(var j =0; j < config.create.columns[i].length; j++) {
				insertConfig = config.create.columns[i][j];
				if(insertConfig.validation && insertConfig.validation.length > 0) {
					oControl = this.getFormElementByLabel(oForm, insertConfig.label)[0];
					var errors = lenovo.control.commontable.Table._getValidResult(insertConfig.validation, oControl);
					if(errors.length > 0) {
						lenovo.control.commontable.Table._clearErrorPopup(oControl);
						lenovo.control.commontable.Table._showEditError(errors, oControl);
						isValid = false;
					}
				}
			}
		return isValid;
	},
	_getFilterAllValidted: function(config, filterPanel){
		var oForm = filterPanel.getContent()[0];
		var filterConfig, oControl;
		var isValid = true;
		for(var i = 0; i < config.filters.length; i++)
			for(var j =0; j < config.filters[i].length; j++) {
				filterConfig = config.filters[i][j];
				if(filterConfig.validation && filterConfig.validation.length > 0) {
					oControl = this.getFormElementByLabel(oForm, filterConfig.label)[0];
					var errors = lenovo.control.commontable.Table._getValidResult(filterConfig.validation, oControl);
					if(errors.length > 0) {
						lenovo.control.commontable.Table._clearErrorPopup(oControl);
						lenovo.control.commontable.Table._showEditError(errors, oControl);
						isValid = false;
					}
				}
			}
		return isValid;
	}, 
	readCSV: function(file, fn){
		jQuery.sap.require("sap.ui.thirdparty.papaparse");
		var that = this;
		Papa.parse(file, {
			header: true,
			complete: function(results){
				var data = results.data;
				var removeArrayInt = new Array();
				for(var i = 0; i < data.length; i++) {
					/******************************
					 * Modified by Chris Gao 2016-01-12
					 * to avoid processing data from illegal column
					 ******************************/
					$.each(data[i], function(key, value){
						if(value === "" || key == undefined || key == null || key.replace(/(\s*$)/g,"") == "") {
							delete data[i][key];
						}
					});
					if(JSON.stringify(data[i]) === "{}")
					{
						removeArrayInt.push(i);
					}	
					/****************************
					 * End by Chris Gao
					 ***************************/
				}
				//remove illegal rows - chris gao
				for(var j=0; j<removeArrayInt.length; j++)
				{
					data.splice(removeArrayInt[j],1);
				}
				if(JSON.stringify(data[data.length - 1]) === "{}" ) {
					data.length = data.length -1 ;
				}
				fn(data);
			}	
		});
	},
	readExcel: function(file, fn, params){
		jQuery.sap.require("sap.ui.thirdparty.shim");
//		jQuery.sap.require("sap.ui.thirdparty.jszip");
		jQuery.sap.require("sap.ui.thirdparty.toxlsx.jszip"); // update by chris gao -- third party -- need validate
		jQuery.sap.require("sap.ui.thirdparty.xlsx");
		jQuery.sap.require("sap.ui.thirdparty.ods");
		var that = this;
		var reader = new FileReader();
		reader.onload = function(e){
			var excelData = {};
			var data = e.target.result;
			var wb;
			var arr = that._fixdata(data);
			wb = XLSX.read(btoa(arr), {type: 'base64'});
			var sheetName = wb.SheetNames[0];
			//console.log("wb.Sheets[sheetName]", wb.Sheets[sheetName]);
			excelData = XLSX.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);
			fn(excelData);
		}
		reader.readAsArrayBuffer(file);
	},
	_fixdata: function(data) {
		var o = "", l = 0, w = 10240;
		for(; l<data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w,l*w+w)));
		o+=String.fromCharCode.apply(null, new Uint8Array(data.slice(l*w)));
		return o;
	},
	getFormElementByLabel: function(oForm, matchedLabel){
		var formContainer, formElements, formElement, label;
		var formContainers = oForm.getFormContainers();
		for(var i = 0; i < formContainers.length; i++) {
			formContainer = formContainers[i];
			formElements = formContainer.getFormElements();
			for(var j = 0; j < formElements.length; j++) {
				formElement = formElements[j];
				label = formElement.getLabel();
				if(label === matchedLabel) {
					return formElement.getFields();
				}

			}
		}
	},
	relateDropDwonBox: function(firstDropdownBox, secondDropdownBox, config){
		var that = this;
		firstDropdownBox.attachChange(function(){
			var selectedKey = this.getSelectedKey();
			config.selectedKey = selectedKey;
			that.reReloadDropdownBox(secondDropdownBox, config);
		});
	},
	reReloadDropdownBox: function(oDropDownBox, opts){
		var oFirstListItem, firstListItemKey;
		oDropDownBox.removeAllItems();
		/***********************************************************************
		 * add by Chris Gao 
		 * 2015-08-25 
		 * for CFE changed request 7.1,7.2,7.3 default dropdownbox value of "ALL"
		 ************************************************************************/
		if(opts.emptyFirstListItem) {
			firstListItemKey = lenovo.control.Constants.emptyDropdownBoxListItem;
		}
		else if(opts.firstItemDefaultValue){
			firstListItemKey = lenovo.control.Constants.defaultValueofAllDropdownBoxListItem; //default dropdownbox value of "ALL"
		}
		else {
			firstListItemKey = lenovo.control.Constants.allDropdownBoxListItem;
		}
		oFirstListItem = new sap.ui.core.ListItem({
			text: firstListItemKey,
			key: firstListItemKey
		});
		if(! opts.notAddFirstListItem) {
			oDropDownBox.addItem(oFirstListItem);
		}
		var selectedKey = opts.selectedKey;
		if(selectedKey !== firstListItemKey) {
			var args =  [selectedKey];
			if(opts.args && opts.args.length > 0) {
				for(var j = 0; j < opts.args.length; j++) {
					args.push(opts.args[j]);
				}
			}
			$.ajax({
					url: opts.url.apply(window, args),
					type: "get",
					dataType: "JSON",
					async: false,
					success: function(data){
						data = opts.transform(data);
						$.each(data, function(index, value) {
							if(value && value[opts.bindKeyField] && value[opts.bindKeyField].length) {
									oItem = new sap.ui.core.ListItem({
									text: value[opts.bindTextField],
									key: value[opts.bindKeyField]
								});
								oDropDownBox.addItem(oItem);
							}
						});
					}
			});
			var firstListItem = oDropDownBox.getItems()[0];
			if(firstListItem) {
				var key = firstListItem.getKey();
				oDropDownBox.setSelectedKey(key);
				oDropDownBox.fireChange({
					newValue: key,
					selectedItem: firstListItem
				});
			}
		}
		/***********************************************************************
		 * end by Chris Gao 
		 * 2015-08-25 
		 ************************************************************************/
	},
	setKeyDropdownBox: function(){

	},
	_createUploadDiaglog: function(config, table){//updated by Chris Gao 2015-11-06 uploadConfig->config
		var that = this;

		var oFileUploader = new sap.ui.unified.FileUploader({
			fileType: "xlsx,csv",
			typeMissmatch: function(){
				that.showErrorMsg("Only xlsx and csv are allowed","ERROR", "Uplaod");
			}	
		});
		var oSubmitUploadErrorBtn = new sap.ui.commons.Button({
			text: "upload",
			press: function(){
				that._upload(oFileUploader, config, table, dialog, oProgressIndicator);//updated by Chris Gao 2015-11-06 uploadConfig->config
			}
		});
		var oProgressIndicator = new sap.ui.commons.ProgressIndicator({
			width: "100%", 
			percentValue: 0, 
			displayValue: ""
		});
		var verticalLayout = new sap.ui.layout.VerticalLayout({
			content: [oFileUploader, oProgressIndicator]
		});
		var dialog = new sap.ui.commons.Dialog({
			title: 'Upload',
			modal: true,
			content: [verticalLayout],
			width: "400px",
			buttons: [oSubmitUploadErrorBtn]
		}).addStyleClass("upload-dialog");
		return dialog;

	},
	_upload: function(oFileUploader, config, table, dialog, oProgressIndicator){//updated by Chris Gao 2015-11-06 uploadConfig->config
		var that = this;
		var file = oFileUploader.oFileUpload.files[0];
		var filename = file.name;
		dialog.setBusyIndicatorDelay(0);
		dialog.setBusy(true);
		if(/csv$/.test(filename)) {
			this.readCSV(file, function(data){
				that._uploadAction(data, filename, config, table, dialog, oProgressIndicator);//updated by Chris Gao 2015-11-06 uploadConfig->config
			});
		} else {
			this.readExcel(file, function(data){
				that._uploadAction(data, filename, config, table, dialog, oProgressIndicator);//updated by Chris Gao 2015-11-06 uploadConfig->config
			});
		}	
	},
	_uploadAction: function(data, filename, config, table, dialog, oProgressIndicator){//updated by Chris Gao 2015-11-06 uploadConfig->config
		//console.log("data", data);
		var uploadConfig = config.upload;// added by Chris Gao 2015-11-06 
		
		this.service.checkSessionRelogin();
		var that = this;
		var obj = {
			data: data,
			filename: filename
		};
		var allTime = parseInt(data.length * 0.05) || 1;
		var runTime = 0;
		var timer;
		function updateUpdateProgress(){
			runTime = runTime + 0.1;
			var percentValue = parseInt(runTime / allTime * 100);
			percentValue = percentValue >= 99 ? 99: percentValue;
			//console.log("percentValue", percentValue);
			oProgressIndicator.setPercentValue(percentValue);
			oProgressIndicator.setDisplayValue(percentValue+"%");
			timer = setTimeout(function(){
				updateUpdateProgress();
			}, 100);
		
		}
		updateUpdateProgress();	
		$.ajax({
			url: uploadConfig.url, 
			type: "POST",
			data: JSON.stringify(obj),
			dataType: "text",
			contentType: "application/json",
			timeout: 30 * 60 * 1000,
			success: function(msg){
				if(config.forBatchDownload != undefined && config.forBatchDownload == true)
				{
					table.getModel().refresh(true);
					that.showErrorMsg(msg , "SUCCESS", "Upload");
				}
				else
				{
//					table.getModel().refresh(true);
					/********************************************
					 * Added by Chris Gao 2015-10-17
					 * to clear filter data 
					 * when finished upload
					 *******************************************/
					//1 clear table filter params
					var config_Refresh = config;
	        		var defaultFilters = lenovo.control.commontable.Table._getDefaultFilter(config_Refresh);
					var sourcePath = table.getBinding().sPath;
					var sourceSort = table.getBinding().aSorters;
					if(sourcePath != undefined && sourcePath != "" )
					{
						if(sourceSort != undefined)
						{
							table.bindRows(sourcePath, null, sourceSort, defaultFilters);
						}
						else
						{
							table.bindRows(sourcePath, null, null, defaultFilters);
						}
						
					}
					//2 clear filter Search Model
					var oPanel = $("#content").find(".filter-panel").control();
					if(oPanel.length > 0)
					{
						var oForm = oPanel[0].getContent()[0];
					}
					else
					{
						var oForm = oPanel[0].getContent();
					}
					var _dfilterModel = oForm.getModel();
					var _dfilterModelData = JSON.stringify(oForm.getModel().getData());
					lenovo.control.commontable.Table._clearAllFilterCondition(_dfilterModel, oForm, _dfilterModelData);
					/******************************************
					 * End by Chris Gao 2015-10-17
					 ******************************************/
					//3 refresh dropdown list to refresh data
					lenovo.control.commontable.Toolkit.refreshDropdownbox();
					
					dialog.setBusy(false);
					if(timer) {
						//console.log("clear");
						clearTimeout(timer);
						timer = null;
					}
					/******************************************
					 * Added by Chris Gao
					 * 2015-10-07
					 * as 2.8 requirements changed 
					 * SALES OFFICE PCT Special Check when upload and delete
					 ******************************************/
					if(uploadConfig.uploadCheckRule !== undefined && uploadConfig.uploadCheckRule.checkUrl !== undefined)
					{
						$.ajax({
							url: uploadConfig.uploadCheckRule.checkUrl,
							type: "get",
							async: true,
							dataType: "JSON",
							success: function(resData){
								
								var dataResults = resData.d.results;
								if(dataResults.length == 0)
								{
									that.showErrorMsg("Finished, You can click 'view status' button to check result " , "SUCCESS", "Upload");
								}
								else
								{
									var dataResultsString = "";
									for(var rI = 0; rI < dataResults.length; rI++)
									{
										dataResultsString = dataResultsString + dataResults[rI].SALES_ORG + " , ";
									}
									dataResultsString = dataResultsString.substring(0, dataResultsString.length - 2);
									
									that.showErrorMsg("Finished, You can click 'view status' button to check result,\n But the sum of Sales Office PCT from such Sales Office: \n" + dataResultsString + "is not 100%", "INFORMATION", "Upload");
								}
								
								
							}
						});
					}
					else
					{
						that.showErrorMsg("Finished, You can click 'view status' button to check result " , "SUCCESS", "Upload");
					}
					/*****************************************
					 * End by Chris Gao
					 ****************************************/
				}

				//that.showErrorMsg("Finished, You can click 'view status' button to check result " , "SUCCESS", "Upload");
				dialog.close();	
			},
			error: function(e){
				dialog.setBusy(false);
				if(timer) {
					//console.log("clear");
					clearTimeout(timer);
					timber = null;
				}		
				var msg = e && e.responseText || JSON.stringify(e);
				msg = msg || "Upload failed";
				that.showErrorMsg(msg, "ERROR", "Upload");
			}
		});
	},
	
	/****************************
	 * Added by Chris Gao
	 * 2015-08-18
	 * to Add Import Button
	 * partElement: the value of this element would be updated
	 ***************************/
	_createImportDiaglog: function(partElement, uploadConfig, table){
		var that = this;

		var oFileUploader = new sap.ui.unified.FileUploader({
			fileType: "xlsx,csv",
			typeMissmatch: function(){
				that.showErrorMsg("Only xlsx and csv are allowed","ERROR", "Uplaod");
			}	
		});
		var oSubmitUploadErrorBtn = new sap.ui.commons.Button({
			text: "upload",
			press: function(){
				that._import(partElement, oFileUploader, uploadConfig, table, dialog, oProgressIndicator);
			}
		});
		var oProgressIndicator = new sap.ui.commons.ProgressIndicator({
			width: "100%", 
			percentValue: 0, 
			displayValue: ""
		});
		var verticalLayout = new sap.ui.layout.VerticalLayout({
			content: [oFileUploader, oProgressIndicator]
		});
		var dialog = new sap.ui.commons.Dialog({
			title: 'Upload',
			modal: true,
			content: [verticalLayout],
			width: "400px",
			buttons: [oSubmitUploadErrorBtn]
		}).addStyleClass("upload-dialog");
		return dialog;

	},
	_import: function(partElement, oFileUploader, uploadConfig, table, dialog, oProgressIndicator){
		var that = this;
		var file = oFileUploader.oFileUpload.files[0];
		var filename = file.name;
		dialog.setBusyIndicatorDelay(0);
		dialog.setBusy(true);
		if(/csv$/.test(filename)) {
			this.readCSV(file, function(data){
				that._importAction(partElement, data, filename, uploadConfig, table, dialog, oProgressIndicator);
			});
		} else {
			this.readExcel(file, function(data){
				that._importAction(partElement, data, filename, uploadConfig, table, dialog, oProgressIndicator);
			});
		}	
	},
	_importAction: function(partElement, data, filename, uploadConfig, table, dialog, oProgressIndicator){
		//console.log("data", data);
		this.service.checkSessionRelogin();
		var that = this;
		var obj = {
			data: data,
			filename: filename
		};
		var allTime = parseInt(data.length * 0.05) || 1;
		var runTime = 0;
		var timer;
		function updateUpdateProgress(){
			runTime = runTime + 0.1;
			var percentValue = parseInt(runTime / allTime * 100);
			percentValue = percentValue >= 99 ? 99: percentValue;
			//console.log("percentValue", percentValue);
			oProgressIndicator.setPercentValue(percentValue);
			oProgressIndicator.setDisplayValue(percentValue+"%");
			timer = setTimeout(function(){
				updateUpdateProgress();
			}, 100);
		
		}
		updateUpdateProgress();	
		$.ajax({
			url: uploadConfig.url, 
			type: "POST",
			data: JSON.stringify(obj),
			dataType: "text",
			contentType: "application/json",
			timeout: 30 * 60 * 1000,
			success: function(msg){
				table.getModel().refresh(true);
				lenovo.control.commontable.Toolkit.refreshDropdownbox();
				dialog.setBusy(false);
				if(timer) {
					//console.log("clear");
					clearTimeout(timer);
					timer = null;
				}
				
				//set the value of this element
				var partTextFiled = partElement;
				partTextFiled.setValue(msg);
				
				that.showErrorMsg("Finished, You can click 'search' button to check result " , "SUCCESS", "Import");
				dialog.close();	
			},
			error: function(e){
				dialog.setBusy(false);
				if(timer) {
					//console.log("clear");
					clearTimeout(timer);
					timber = null;
				}		
				var msg = e && e.responseText || JSON.stringify(e);
				msg = msg || "Upload failed";
				that.showErrorMsg(msg, "ERROR", "Upload");
			}
		});
	},
	
	/**************
	 * to process the batch upload page
	 * Added by Chris Gao
	 * 2016-05-10
	***************/
	_createBatchUploadContent: function(batchConfig, app, table){
		var that = this;
		var windowHeight = this.getWindowHeight();
		var headerHeight = 200;	
		var rowHeight = 30;
		var visibleRowCount = this.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight);
		
		var uploadHistoryConfig = batchConfig.uploadHistoryConfig;
		
		var url = uploadHistoryConfig.url;
		uploadHistoryConfig.visibleRowCount = visibleRowCount;
		
		//table
		var uploadHistoryoModel = new sap.ui.model.odata.ODataModel(url, true);
		var uploadHistoryTable =  lenovo.control.commontable.Table.createTable(uploadHistoryConfig);
		
		//panel button
		var oBackButton = new sap.ui.commons.Button({
			tooltip: "back",
			icon: "sap-icon://nav-back",
			lite: true,
			press: function(){
				that.service.checkSessionRelogin();
				
				app.backToTop("slide");
			}
		});
		var oDownloadTemplateButton = new sap.ui.commons.Button({
			lite: true,
			icon: "sap-icon://sys-next-page",
			tooltip: "download upload template",
			press: function() {
				window.open(lenovo.control.Constants.uploadTemplatesBaseUrl + batchConfig.upload.excelUrl);
			}
		}).addStyleClass("commontable-toolbar-btn");
		var oImportBtn = new sap.ui.commons.Button({
			tooltip: "upload, only xlsx and csv files are allowed",
			icon: "sap-icon://upload",
			lite: true,
			press: function(oEvent) {
				var uploadDialog = that._createUploadDiaglog(batchConfig, uploadHistoryTable); 
				uploadDialog.open();
			}
		});
		var oDeleteBtn = new sap.ui.commons.Button({
			tooltip: "delete selected items",
			icon: "sap-icon://delete",
			lite: true,
			press: function(oEvent) {
				that._deleteSeletedItems(batchConfig, uploadHistoryTable);
			}
		});
		var oDeleteAllBtn = new sap.ui.commons.Button({
			tooltip: "delete all",
			icon: "resource/img/Delete_All.png",
			lite: true,
			press: function(oEvent) {
				that._deleteAllItems(batchConfig, uploadHistoryTable);
			}
		});
		var exportDialog = new sap.ui.commons.Dialog({
			width: "400px",
			height: '400px',
			title: "Download",
			content: [],
			modal: true,
			buttons: [new sap.ui.commons.Button({
				text: "cancel",
				press: function(){
					exportDialog.close();
				}
			})]
		});
		var oBatchDownloadBtn = new sap.ui.commons.Button({
			tooltip: "batch download",
			icon: "sap-icon://download",
			lite: true,
			press: function(oEvent) {
				that._batchDownloadStart(batchConfig, uploadHistoryTable, exportDialog);
			}
		});
		var header = lenovo.control.commontable.Table.createHeader(batchConfig.header || "", batchConfig.subheader || "");
		var oToolbar = new sap.ui.commons.Toolbar({}).addStyleClass("lenovo-batch-toolbar");//new sap.ui.layout.HorizontalLayout().addStyleClass("lenovotable-toolbar");
//		oToolbar.addContent(oShowUploadDetailButton);
		
		oToolbar.addItem(oBackButton);

		oToolbar.addRightItem(oDownloadTemplateButton);
		oToolbar.addRightItem(oImportBtn);
		
		if(batchConfig.deleteConfig != undefined)
		{
			
			oToolbar.addRightItem(oDeleteBtn);
		}
		if(batchConfig.deleteAllConfig != undefined)
		{
			oToolbar.addRightItem(oDeleteAllBtn);
		}
		if(batchConfig.download != undefined)
		{
			oToolbar.addRightItem(oBatchDownloadBtn);
		}
		if(batchConfig.execute != undefined)
		{
			var executeButton = new sap.ui.commons.Button({
				icon: "sap-icon://begin",
				lite: true,
				tooltip: "execute",
				press: function() {
					console.log("batch execute");
					that._batchExecuteStart(batchConfig, uploadHistoryTable);
				}
			});
			oToolbar.addRightItem(executeButton);
		}
		
		if(batchConfig.mentionLabel != undefined && batchConfig.mentionLabel !="")
		{
			var oMentionIcon = new sap.ui.core.Icon({src:"sap-icon://message-warning", color:'#fe4701', size:'16px'}).addStyleClass('batch-mention-icon');
			var oMentionLabel = new sap.ui.commons.Label({text: batchConfig.mentionLabel}).addStyleClass('batch-mention-lb');
			oToolbar.addItem(oMentionIcon);
			oToolbar.addItem(oMentionLabel);
		}
		
		
		
		uploadHistoryTable.setBusy(true);
		uploadHistoryTable.setModel(uploadHistoryoModel);
		uploadHistoryoModel.attachRequestCompleted(function(){
			uploadHistoryTable.setBusy(false);
		});
		
		var viewBatchUploadPage = new sap.m.Page({
			showHeader: false,
			showNavButton: true,
	        content: [header, oToolbar, uploadHistoryTable]
		}).addStyleClass("upload-page");;
		app.addPage(viewBatchUploadPage);
		return viewBatchUploadPage;
	},
	
	_batchExecuteStart: function(batchConfig,uploadHistoryTable){
		var that = this;
		var oLabel = new sap.ui.commons.Label({
			text: "Do you want to execute?",
			width: "350px",
		});
		sap.ui.commons.MessageBox.confirm(oLabel, function(result){
			
			if(result) {
				
				var data = {
						"process_name": 'PRC_RPT_MaterialMargin'
				};
				uploadHistoryTable.setBusy(true);
				$.ajax({
					url: batchConfig.execute.url,
					data: data,
					type: "get",
					contentType: "text",
					success: function(data){
						uploadHistoryTable.setBusy(false);
						that.showErrorMsg("Successfully execute", "SUCCESS", "Execute");		
					},
					error: function(err){
						err = err && err.responseText ;
						uploadHistoryTable.setBusy(false);
						if(!(typeof err === "string"))
							err = JSON.stringify(err);
						that.showErrorMsg(err, "ERROR", "Execute");			
					}
				});
			}
		}, 	"Confirm");	
	},
	
	_deleteSeletedItems: function(batchConfig, uploadHistoryTable){
		var that = this;
		
		var selectedIndices = uploadHistoryTable.getSelectedIndices();
		if(selectedIndices.length == 0) {
			that.showErrorMsg("Please select at least one item", "ERROR", "Delete");
			return;
		}
		var oLabel = new sap.ui.commons.Label({
			text: "Do you want to delete?",
			width: "350px",
		});
		sap.ui.commons.MessageBox.confirm(oLabel, function(result){
			if(result) {
				that.service.checkSessionRelogin();
				that._deleteSeletedItemsAction(batchConfig, uploadHistoryTable);
			}
		}, 	"Confirm");
	},
	
	_deleteSeletedItemsAction: function(config, table){
		
		table.setBusy(true);
		
		var that = this;
		var selectedIndices = table.getSelectedIndices();
		var oModel = table.getModel();
		var context, object;
		var objects = [];
		for(var i = 0; i < selectedIndices.length; i++) {
			context = table.getContextByIndex(selectedIndices[i]);
			if(context){
				object = context.getObject();
				if(config.deleteConfig.fields != undefined)
				{
					var obj = new Object();
					for(var j=0; j<config.deleteConfig.fields.length; j++)
					{
						obj[config.deleteConfig.fields[j]] = object[config.deleteConfig.fields[j]];
					}
				}
				objects.push(obj);
			}
		}
		
		var accessData = {
				data: objects
			};
		
		$.ajax({
			url: config.deleteConfig.url, 
			type: "POST",
			data: JSON.stringify(accessData),
			dataType: "text",
			contentType: "application/json",
			success: function(msg){
				table.getModel().refresh(true);
				that.showErrorMsg(msg , "SUCCESS", "Delete");
				table.setBusy(false);
				table.clearSelection();
			}
		});
	},
	
	_deleteAllItems: function(config, table){
		var that = this;
		sap.ui.commons.MessageBox.confirm("Do you want to delete all items?", function(result){
			if(result){
				var obj = {
					"table_name": config.deleteAllConfig.tablename
				};
				if(config.deleteAllConfig.reportname !== undefined)
				{
					obj.report_name = config.deleteAllConfig.reportname;
				}
				table.setBusy(true);
				$.ajax({
					url: config.deleteAllConfig.url,
					type: "POST",
					data: JSON.stringify(obj),
					dataType: "text",
					contentType: "application/json",
					success: function(data){
						that.showErrorMsg(data, "SUCCESS", "Delete");
						var oModel = table.getModel();
						table.setBusy(false);
						oModel.refresh(true);
						table.clearSelection();
					},
					error: function(err){
						err = err && err.responseText ;
						table.setBusy(false);
						if(!(typeof err === "string"))
							err = JSON.stringify(err);
						that.showErrorMsg(err, "ERROR", "Delete");	
					}
				});
			}
		}, "Confirm");
	},
	
	_batchDownloadStart: function(batchConfig, uploadHistoryTable, exportDialog){
		var that = this;
		that.service.checkSessionRelogin();
		var filename = batchConfig.download.filename;
		
		function openExportDialog(){
			exportDialog.removeAllContent();	
			var verticalLayout = new sap.ui.layout.VerticalLayout({width:"100%"}).addStyleClass("export-verical-layout");	
			var horizontalLayout = new sap.ui.layout.HorizontalLayout({}).addStyleClass("export-horizontal-layout");
			var oLabel = new sap.ui.commons.Label({text:"Not Started",width:"80px"}).addStyleClass("batchdownload-status");
			var oLink = new sap.ui.commons.Link({
				text:  "download "  + filename,
				width: "270px",
//				href: new_url,
//				target: "_blank",
				press: function(){
					oLabel.addStyleClass("status-in-progress");
					oLabel.setText("In-Progress");
					that._batchDownload(batchConfig, uploadHistoryTable, oLabel);
				}
			});
			horizontalLayout.addContent(oLink);
			horizontalLayout.addContent(oLabel);
			verticalLayout.addContent(horizontalLayout);
			exportDialog.addContent(verticalLayout);
			exportDialog.open();
		}
		
		openExportDialog();
		
	},
	
	_batchDownload: function(config, table, oLabel){
		//require class library
//		jQuery.sap.require("sap.ui.thirdparty.shim");
//		jQuery.sap.require("sap.ui.thirdparty.jszip");
//		jQuery.sap.require("sap.ui.thirdparty.xlsx");
//		jQuery.sap.require("sap.ui.thirdparty.ods");
		jQuery.sap.require("sap.ui.thirdparty.toxlsx.jszip");
		jQuery.sap.require("sap.ui.thirdparty.xlsx");
		jQuery.sap.require("sap.ui.thirdparty.toxlsx.Blob");
		jQuery.sap.require("sap.ui.thirdparty.toxlsx.FileSaver");
		
		table.setBusy(true);
		
		var that = this;
		//prepare for posting
		var accessData = {
				type: config.download.type,
				table: config.download.table,
				filterTable: config.download.filterTable,
				filterColumns: config.download.filterColumns,
				columns: config.download.columns,
//				detailcolumns: config.download.detailcolumns,
				roleName: config.download.roleName,
				relatedFilter : config.download.relatedFilter
			};
		
		function Workbook() {
			if(!(this instanceof Workbook)) 
			{
				return new Workbook();
			}
				
			this.SheetNames = [];
			this.Sheets = {};
		}
		
		function s2ab(s) {
			var buf = new ArrayBuffer(s.length);
			var view = new Uint8Array(buf);
			for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
			return buf;
		}
		
		$.ajax({
			url: config.download.url, 
			type: "POST",
			data: JSON.stringify(accessData),
			dataType: "text",
			contentType: "application/json",
			success: function(result){
				oLabel.setText("Completed");
				oLabel.removeStyleClass("status-in-progress");
				oLabel.addStyleClass("status-finished");
				
				var data = $.parseJSON(result);
				table.getModel().refresh(true);
				table.setBusy(false);
				
				//download
				var ranges = [];
				var ws_name = "SheetJS";
				var wb = new Workbook(), ws = that.sheet_from_array_of_arrays(data);
				 
				/* add ranges to worksheet */
				ws['!merges'] = ranges;

				/* add worksheet to workbook */
				wb.SheetNames.push(ws_name);
				wb.Sheets[ws_name] = ws;

				var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:false, type: 'binary'});

				//saveAs(new Blob([that.s2ab(wbout)],{type:"application/octet-stream"}), config.download.filename+".xlsx");
				saveAs(new Blob([s2ab(wbout)],{type:""}), config.download.filename+".xlsx");
				
			}
		});
	},
	
	 
//	s2ab: function(s) {
//		var buf = new ArrayBuffer(s.length);
//		var view = new Uint8Array(buf);
//		for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
//		return buf;
//	},
	
	sheet_from_array_of_arrays: function(data, opts) {
		var ws = {};
		var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
		for(var R = 0; R != data.length; ++R) {
			for(var C = 0; C != data[R].length; ++C) {
				if(range.s.r > R) range.s.r = R;
				if(range.s.c > C) range.s.c = C;
				if(range.e.r < R) range.e.r = R;
				if(range.e.c < C) range.e.c = C;
				var cell = {v: data[R][C] };
				if(cell.v == null) continue;
				var cell_ref = XLSX.utils.encode_cell({c:C,r:R});
				
				if(typeof cell.v === 'number') cell.t = 'n';
				else if(typeof cell.v === 'boolean') cell.t = 'b';
				else if(cell.v instanceof Date) {
					cell.t = 'n'; cell.z = XLSX.SSF._table[14];
					cell.v = datenum(cell.v);
				}
				else cell.t = 's';
				
				ws[cell_ref] = cell;
			}
		}
		if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
		return ws;
	},
	
	/**************
	 * End by Chris
	***************/
	
	
	/****************************
	 * Modified by Chris Gao
	 * 2015-08-13
	 * to Add View Status Download Button
	 ***************************/
	_createViewStatusContent: function(viewStatusConfig, app, table){
		var that = this;
		var windowHeight = this.getWindowHeight();
		var headerHeight = 140;	
		var rowHeight = 30;
		var visibleRowCount = this.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight);
		var viewUploadHistoryConfig = viewStatusConfig.viewUploadHistory;
		var viewUploadErrorDetailConfig = viewStatusConfig.viewUploadErrorDetail;
		/*****************************
	     * Add New Function -- View State download Btn
	     * Chris Gao
	     * 2015.08.13
	     ****************************/
		if(viewUploadHistoryConfig.columns == null)
		{
			viewUploadHistoryConfig.columns = [{
				label: "CODE",
				field: "CODE",
				type: "TextField"
			},{
				label: "BUSINESS NAME",
				field: "BUSINESS_NAME",
				type: "TextField"
			},{
				label: "BUSINESS_TIME",
				field: "BUSINESS_TIME",
				type: "TextField"
			},{
				label: "SUCCESS",
				field: "SUCCESS",
				type: "TextField"
			},{
				label: "ERROR",
				field: "ERROR",
				type: "TextField"
			},{
				label: "OPERATED_BY",
				field: "SYS_OPERATED_BY",
				type: "TextField"
			}];
		}
		else
		{
			viewUploadHistoryConfig.columns = viewStatusConfig.viewUploadHistory.columns;
		}
		
		viewUploadHistoryConfig.visibleRowCount = visibleRowCount;
		viewUploadHistoryConfig.defaultSort = {
			field: "BUSINESS_TIME",
			bDescending: true
		};
		var url = viewUploadHistoryConfig.url;

		var uploadHistoryoModel = new sap.ui.model.odata.ODataModel(url, true);
		var uploadHistoryTable =  lenovo.control.commontable.Table.createTable(viewUploadHistoryConfig);//(viewStatusConfig.viewUploadHistory);
		var oShowUploadDetailButton = new sap.ui.commons.Button({
			tooltip: "detail",
			icon: "sap-icon://hint",
			lite: true,
			press: function(){
				that.service.checkSessionRelogin();
				that._showUploadDetail(viewStatusConfig, app, viewUploadDetailPage, uploadHistoryTable);
			}
		});
		
		/*********************************************************
		 * Added by Chris Gao - 2015-09-09
		 * to close the default count url called by table model
		 * default count model = "Both"
		 * because of the wrong count url with filter 
		 *******************************************************/
		uploadHistoryoModel.setDefaultCountMode("None");
		/********************************************************
		 * End by Chris Gao
		 *******************************************************/
		
		var oBackButton = new sap.ui.commons.Button({
			tooltip: "back",
			icon: "sap-icon://nav-back",
			lite: true,
			press: function(){
				that.service.checkSessionRelogin();
				table.setBusy(true);
				table.getModel().refresh(true);
				app.backToTop("slide");
			}
		});
		var oToolbar = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload({});
		oToolbar.removeAllContent();
		oToolbar.addContent(oShowUploadDetailButton);
		oToolbar.addContent(oBackButton);
		uploadHistoryTable.setBusy(true);
		uploadHistoryTable.setModel(uploadHistoryoModel);
		uploadHistoryoModel.attachRequestCompleted(function(){
			uploadHistoryTable.setBusy(false);
		});
		var viewAllUploadPage = new sap.m.Page({
			showHeader: false,
			navButtonPress: function(){ 
	            app.backToTop("slide");          
	        },
			content: [oToolbar, uploadHistoryTable]
		}).addStyleClass("upload-page");
		app.addPage(viewAllUploadPage);

		//todo uplaod table filter
		var viewErrorInfoConfig = viewStatusConfig.viewErrorInfo;
		var detailUploadModel = new sap.ui.model.odata.ODataModel(viewErrorInfoConfig.url, true);
		var config = {
			url: viewErrorInfoConfig.url,
			bindRowUrl: viewErrorInfoConfig.bindRowUrl,
			selectionMode: sap.ui.table.SelectionMode.Single,
			columns: [{
				label: "POSITION",
				field: "POSITION",
				type: "TextField"
			}, {
				label: "ERROR MESSAGE",
				field: "ERROR_MESSAGE",
				type: "TextField"
			}],
			visibleRowCount:  visibleRowCount
		}
		var detailUploadTable =  lenovo.control.commontable.Table.createTable(config);
		detailUploadTable.setModel(detailUploadModel);
		detailUploadModel.attachRequestCompleted(function(){
			detailUploadTable.setBusy(false);
		});
		var errorDetatilModel =  new sap.ui.model.json.JSONModel();
		var errorDialog = this._getErrorDetailDialog(viewStatusConfig.viewUploadErrorDetail, errorDetatilModel);
		errorDialog.setModel(errorDetatilModel);

		var oUploadDetailToolbar = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload({});
		oUploadDetailToolbar.removeAllContent();

		var oEditErrorRecordButton = new sap.ui.commons.Button({
			tooltip: "edit error record",
			lite: true,
			icon: "sap-icon://hint",
			press: function(){
				that.service.checkSessionRelogin();
				var selectedIndices = detailUploadTable.getSelectedIndices();
				if(selectedIndices.length == 0) {
					that.showErrorMsg("Please select an item", "ERROR", "Uplaod Detail");
					return;
				}
				var context = detailUploadTable.getContextByIndex(selectedIndices[0]);
				var position = detailUploadModel.getProperty("POSITION", context);
				var code = detailUploadTable.data("code");
				var excelName = detailUploadTable.data("excelName");
				if(viewStatusConfig.viewUploadErrorDetail._errorDetail) {
					var args = [code, context];
					if(viewStatusConfig.viewUploadErrorDetail._errorDetail.args) {
						for(var ii = 0; ii < viewStatusConfig.viewUploadErrorDetail._errorDetail.args.length; ii++) {
							args.push(viewStatusConfig.viewUploadErrorDetail._errorDetail.args[ii]);
						}
					}
					viewStatusConfig.viewUploadErrorDetail._errorDetail.func.apply(viewStatusConfig.viewUploadErrorDetail._errorDetail.context || window, args)
				} else {
					that._showErrorRecord(code, position, excelName, errorDetatilModel, viewStatusConfig.viewUploadErrorDetail, errorDialog, viewUploadErrorDetailConfig);
				}	
			}
		});
		var oUploadDetailBackBtn = new sap.ui.commons.Button({
			tooltip: "back",
			lite: true,
			icon: "sap-icon://nav-back",
			press: function(){
				that.service.checkSessionRelogin();
				uploadHistoryTable.setBusy(true);
			 	uploadHistoryTable.clearSelection();
			 	uploadHistoryTable.setFirstVisibleRow(0);
			 	uploadHistoryoModel.refresh(true);
	            app.backToPage(viewAllUploadPage);  
			}
		});
		oUploadDetailToolbar.addContent(oEditErrorRecordButton);
		oUploadDetailToolbar.addContent(oUploadDetailBackBtn);
		var viewUploadDetailPage = new sap.m.Page({
			showHeader: false,
			showNavButton: true,
	        content: [oUploadDetailToolbar, detailUploadTable]
		}).addStyleClass("upload-page");;
		app.addPage(viewUploadDetailPage);
		return viewAllUploadPage;
	},
	_getErrorDetailDialog: function(viewUploadErrorDetail, errorDetatilModel){
		var that = this;
		var columns = viewUploadErrorDetail.columns;
		var oLayout = new sap.ui.layout.form.ResponsiveGridLayout({
			labelSpanL: 4,
			labelSpanM: 4,
			emptySpanL: 1,
			columnsL: columns.length,
			columnsM: columns.length
		});
		var oForm = new sap.ui.layout.form.Form({
			layout: oLayout,
			formContainers: []
		});
		var oFormContainer, oControl, uploadErrorDetailConfig;
		for(var i = 0; i < columns.length; i++) {
			oFormContainer =  new sap.ui.layout.form.FormContainer();
			for(var j = 0; j < columns[i].length; j++) {
				uploadErrorDetailConfig = columns[i][j];
				oControl = lenovo.control.commontable.Toolkit._createUploadControl(uploadErrorDetailConfig);
				oFormContainer.addFormElement(oControl);
			}
			oForm.addFormContainer(oFormContainer);
		}
		var oSubmitUploadErrorBtn = new sap.ui.commons.Button({
			text: "submit",
			press: function(){
				that.service.checkSessionRelogin();
				that._reSubmitUplaod(viewUploadErrorDetail, errorDetatilModel, dialog);
			}
		});
		/*********************************************
		 * Modified by Chris Gao
		 * 2015-10-20
		 * to solve when error detail close,it cannot roll back the list window to top
		 *********************************************/
		if(viewUploadErrorDetail.columns != undefined && viewUploadErrorDetail.columns.length > 0 && viewUploadErrorDetail.columns[0] != undefined && viewUploadErrorDetail.columns[0].length > 13)
		{
			var dialog = new sap.ui.commons.Dialog({
				title: 'Upload Error Record',
				modal: true,
				content: [oForm],
				height:viewUploadErrorDetail.fixHeight,//added by Chris Gao at 2015-10-20, 
				width: "800px",
				buttons: [oSubmitUploadErrorBtn, new sap.ui.commons.Button({
					text: "cancel",
					press: function(){
						dialog.close();
					}
				})]
			});
		}
		else
		{
			var dialog = new sap.ui.commons.Dialog({
				title: 'Upload Error Record',
				modal: true,
				content: [oForm],
				width: "800px",
				buttons: [oSubmitUploadErrorBtn, new sap.ui.commons.Button({
					text: "cancel",
					press: function(){
						dialog.close();
					}
				})]
			});
		}
		/******************************************
		 * End by Chris Gao
		 *****************************************/
		
		return dialog;
	},
	_reSubmitUplaod: function(viewUploadErrorDetail, errorDetatilModel, errorDialog) {
		var that = this;
		var data = JSON.parse(errorDetatilModel.getJSON());
		var oData = {};
		$.each(data, function(key, value){
			oData[key] = value.value;
		});
		var excelName = errorDialog.data("excelName");
		oData = {data: [oData], filename: excelName};
		$.ajax({
			url: viewUploadErrorDetail.resubmit.url,
			type: "POST", 
			data: JSON.stringify(oData),
			dataType: "text",
			contentType: "application/json",
			success: function(){
				that.showErrorMsg("Fininshed, please check the result", "SUCCESS", "Uplaod");
				//sap.ui.commons.MessageBox.show("Fininshed, please check the result", "SUCCESS", "Uplaod");
				errorDialog.close();
			}, 
			error: function(){

			}
		});
	},
	_createUploadControl: function(uploadErrorDetailConfig){
		var oControl;
		switch(uploadErrorDetailConfig.type){
			case "TextField":
				oControl = new sap.ui.layout.form.FormElement({
					label: uploadErrorDetailConfig.label,
					fields: [new sap.ui.commons.TextField({
						value: {
							path: "/" + uploadErrorDetailConfig.field + "/value",
							type: new lenovo.control.commontable.yyyymmddDate(),
							mode: sap.ui.model.BindingMode.TwoWay
						}
					})]
				});
			break;
			case "DatePicker":
				oControl = new sap.ui.layout.form.FormElement({
					label: uploadErrorDetailConfig.label,
					fields: [new sap.ui.commons.TextField({
						value: {
							path: "/" + uploadErrorDetailConfig.field + "/value"
						}
					})]
				});
			break;
		}
		return oControl;
	},
	_showUploadDetail: function(viewStatusConfig, app, viewUploadDetailPage, uploadHistoryTable){
		var that = this;
		var selectedIndices = uploadHistoryTable.getSelectedIndices();
		var bindRowUrl = viewStatusConfig.viewErrorInfo.bindRowUrl;
		var oModel = uploadHistoryTable.getModel();
		var context, code, field, detailUploadTable, filterModel, excelName;
		if(selectedIndices.length == 0) {
			that.showErrorMsg("Please select an item", "ERROR", "Uplaod Detail");
			//sap.ui.commons.MessageBox.show("Please select an item", "ERROR", "uplaod detail");
			return;
		}
		context = uploadHistoryTable.getContextByIndex(selectedIndices[0]);
		code = oModel.getProperty("CODE", context);
		excelName = oModel.getProperty("BUSINESS_NAME", context);
		detailUploadTable = viewUploadDetailPage.getContent()[1];
		filterModel = new sap.ui.model.Filter({
			path: "CODE",
			operator: "EQ",
			value1: code
		});
		detailUploadTable.setBusy(true);
		detailUploadTable.clearSelection();
		detailUploadTable.data("code", code);
		detailUploadTable.data("excelName", excelName);
		detailUploadTable.bindRows(bindRowUrl, null, null, filterModel);
		app.to(viewUploadDetailPage, "slide");
	},
	_showErrorRecord: function(code, position, excelName, errorDetatilModel, viewUploadErrorDetail, errorDialog, viewUploadErrorDetailConfig){
		var search = "&$filter=(" + "CODE eq '" + code + "' and POSITION eq " + position + ")";
		if(viewUploadErrorDetailConfig.addSingleQuotes) {
			search = "&$filter=(" + "CODE eq '" + code + "' and POSITION eq '" + position + "')";
		}
		var columns = viewUploadErrorDetail.columns;
		var url = viewUploadErrorDetailConfig.url;
		$.ajax({
			url: url + search,
			type: "get",
			dataType: "JSON",
			success: function(data){
				data = data.d.results[0];
				var filed;
				var obj = {};
				if(data) {
					for(var i = 0; i < columns.length; i++) {
						for(var j = 0; j < columns[i].length; j++) {
							filed = columns[i][j].field;
							obj[filed] = {
								value:  data[filed] || null
							}
						}		
					}	
				}		
				errorDetatilModel.setData(obj);
				errorDialog.data("excelName", excelName);
				errorDialog.open();
			}
		});
	},
	isContainInArray: function(arr, val, fieldName){
		for(var i=0; i<arr.length; i++){
			if(arr[i][fieldName] == val)
				return true;
		}
		return false;
	},
	validateDatePickerCompare: function(startDatepicker, endDatepicer){
		var that = this;
		var startValue, endValue, startDate, endDate
		startDatepicker.attachChange(function(){
			startValue = startDatepicker.getValue();
			endValue = endDatepicer.getValue();
			startDate = new Date(startValue);
			endDate =  new Date(endValue);
			if(startDate.getTime() && endDate.getTime()) {
				if(that.dateCompare(startDate, endDate) > 0) {
					that.showErrorMsg("start time later than end time", "ERROR", "Date Error");
					endDatepicer.setValue(startValue);
				}
			}
		});
		endDatepicer.attachChange(function(){
			startValue = startDatepicker.getValue();
			endValue = endDatepicer.getValue();
			startDate = new Date(startValue);
			endDate =  new Date(endValue);
			if(startDate.getTime() && endDate.getTime()) {
				if(that.dateCompare(startDate, endDate) > 0) {
					that.showErrorMsg("start time later than end time", "ERROR", "Date Error");
					endDatepicer.setValue(startValue);
				}
			}
		});
	},
	dateCompare: function(date1, date2){
		return date1.getTime() - date2.getTime();
	},
	openOverlayTable: function(context, config){
		var that = this;
		var bindRowUrl = config.bindRowUrl;
		var _config = $.extend(true, {}, config);
		var configheader = config.headerInfo;
		var oLayout = new sap.ui.layout.form.ResponsiveGridLayout({
			labelSpanL: 4,
			labelSpanM: 4,
			emptySpanL: 1,
			columnsL: 2,
			columnsM: 2
		});
		var oForm = new sap.ui.layout.form.Form({
			layout: oLayout,
			formContainers: []
		});
		var oFormContainer = new sap.ui.layout.form.FormContainer();
		var filters = [];
		configheader.filters.forEach(function(e) {
			filters.push(e.field);
		});
		var url = configheader.url + configheader.path + "?$filter=" + configheader.key + " eq '" + context + "'&$select=" + filters.join(",") + "&$format=json";
		$.getJSON(url, function(data) {
			data = data["d"]["results"][0];
			for (var i = 0; i <  Math.round(configheader.filters.length / 2); i++) {
				oFormContainer.addFormElement(new sap.ui.layout.form.FormElement({
					label: configheader.filters[i]["label"],
					fields: [new sap.ui.commons.TextField({
						value: that.formatResult(data[configheader.filters[i]["field"]])
					}).setEditable(false)]
				}));
			}
			oForm.addFormContainer(oFormContainer);
			var oFormContainer1 = new sap.ui.layout.form.FormContainer();
			for (var i = Math.round(configheader.filters.length / 2); i <  configheader.filters.length; i++) {
				oFormContainer1.addFormElement(new sap.ui.layout.form.FormElement({
					label: configheader.filters[i]["label"],
					fields: [new sap.ui.commons.TextField({
						value: that.formatResult(data[configheader.filters[i]["field"]])
					}).setEditable(false)]
				}));
			}
			oForm.addFormContainer(oFormContainer1);

			// config.bindRowUrl = config.bindRowUrl + "?$filter=" + configheader.key + " eq '" + context + "'";
			_config.bindRowUrl = bindRowUrl + "?$filter=" + configheader.key + " eq '" + context + "'";
			var oModel = new sap.ui.model.odata.ODataModel(_config.url, true);
			var oTable = lenovo.control.commontable.Table.createTable(_config);
			oTable.setBusy(true);
			oTable.setModel(oModel);
			oModel.attachRequestCompleted(function() {
				oTable.setBusy(false);
			});
			var oLayout = new sap.ui.layout.VerticalLayout({
				content: [oForm, oTable]
			});
			var oOverlayContainer = new sap.ui.ux3.OverlayContainer({
				content: [oLayout]
			});
			oOverlayContainer.open();
		});
	},

	formatResult: function(value){
		console.log("value",value);
		//console.log("valuetostring",value.toString())
		if(value != null && value.toString().search("Date") == 1){
			var str = value.toString();
			return eval('new ' + str.replace(/\//g, '')).Format("yyyy-MM-dd hh:mm:ss");

		}else{
			return value;
		}
	},
	showErrorMsg: function(vMessage, oIcon, sTitle, vActions, fnCallback, oDefaultAction, sDialogId) {
		sap.ui.commons.MessageBox.show(vMessage, oIcon, sTitle, vActions, fnCallback, oDefaultAction, sDialogId);
	},
	refreshDropdownbox: function(){
		// var oForm = sap.ui.getCore().byId("searchPanel").getContent()[0];
		var oPanel = $("#content").find(".filter-panel").control();//$(".filter-panel").control(); //$("#content").find(".filter-panel")
		if(oPanel.length > 0)
		{
			var oForm = oPanel[0].getContent()[0];
		}
		else
		{
			var oForm = oPanel[0].getContent();
		}
		
		var formContainer, formElements, formElement, label;
		var formContainers = oForm.getFormContainers();
		for(var i = 0; i < formContainers.length; i++) {
			formContainer = formContainers[i];
			formElements = formContainer.getFormElements();
			for(var j = 0; j < formElements.length; j++) {
				formElement = formElements[j];
				/*********************************************
				 * Start
				 * Modified by Chris Gao 
				 * 2015-08-12
				 ********************************************/
				if(formElement.getFields().length > 1)
				{
					var ele = formElement.getFields()[1];
				}
				else
				{
					var ele = formElement.getFields()[0];
				}
				//var ele = formElement.getFields()[0];
				/********************End*********************/
				
				if(ele.getMetadata()._sClassName == "sap.ui.commons.DropdownBox"){
					var config = ele.data("config");
					ele.destroyItems();
					if(config && config.odata){
						this._createDropdownbox(ele);
					}
				}
					
			}
		}

		
	}
	
};
