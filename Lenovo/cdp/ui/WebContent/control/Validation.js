jQuery.sap.declare("lenovo.control.Validation");

lenovo.control.Validation = {
	isCharacter: function(value){
		return /^[A-Za-z]*$/.test(value) || value== null;
	},
	isUppercase: function(value){
		return /^[A-Z]*$/.test(value) || value== null;
	},
	isLowercase: function(value){
		return /^[a-z]*$/.test(value) || value== null;
	},
	isNumber: function(value){
		return (/^[0-9]*$/.test(value)  || value== null) ;
	},
	isEmail: function(value){
		return /^[-._A-Za-z0-9]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/.test(value) || value == "" || value== null;
	},
	isPassword: function(value){
		var lengthReg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d_]{8,20}$/;
		return lengthReg.test(value);
	},
	isInteger: function(value){
		return /^[1-9][0-9]*$/.test(value)  || value == null;
	},
	require: function(value) {
		return !(value === "" || value === null || value === undefined);
	},
	isDate: function(value){
		return /^[0-9]{4}-[0-1]?[0-9]{1}-[0-3]?[0-9]{1}$/.test(value) || value == null;
	},
	isDateTime: function(value){
		return /^[0-9]{4}-[0-1]?[0-9]{1}-[0-3]?[0-9]{1}\s[0-6]?[0-9]?[:]?[0-6]?[0-9]?[:]?[0-6]?[0-9]?$/.test(value) || value == null;
	},
	endWithDollorPercentage: function(value){
		return /%|\$$/.test(value)  || value == null;
	},
	isNumberx: function(value){
		return (/^-?\d{0,11}(\.\d{0,0})?$/.test(value)  || value== null) ;
	}
}

