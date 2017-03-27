function StringBuilder()
{
   this.data = [];
}
StringBuilder.prototype.append=function(str)
{
   this.data.push(str);
   return this;
};
StringBuilder.prototype.toString=function(sep)
{
   return this.data.join(sep);
};

function getFileHeader(headers, v_cycle){
	
	var rawArryE = ['M1','M2','M3','M4','M5','M6','M7','M8','M9','M10','M11','M12','M13','M14','M15','M16','M17','M18'];
	var rawArryL = ['LM1','LM2','LM3','LM4','LM5','LM6','LM7','LM8','LM9','LM10','LM11','LM12','LM13','LM14','LM15','LM16','LM17','LM18'];
	var rawStrE = rawArryE.join(',');
	var rawStrL = rawArryL.join(',');
	var resultArry = [];
	var i = 0;
	var query = "select M1,M2,M3,M4,M5,M6,M7,M8,M9,M10,M11,M12,M13,M14,M15,M16,M17,M18 from  " +
					"\"_SYS_BIC\".\"cdp.ebgcfe.models.common/CV_COLUMNNAME\"(placeholder.\"$$INPUT_CYCLE$$\"=>?)";
	var conn = $.hdb.getConnection();
	var rs = conn.executeQuery(query,v_cycle);
	for(i = 0; i < headers.length; i++){
		if(rawStrE.indexOf(headers[i]) < 0 && rawStrL.indexOf(headers[i]) < 0){
			resultArry.push(headers[i]);
		}else{
			if(rawStrE.indexOf(headers[i]) > -1){
				resultArry.push(rs[0][headers[i]]+'E');
			}else if(rawStrL.indexOf(headers[i]) > -1){
				resultArry.push(rs[0][headers[i].substring(1)]+'L');
			}
		}
	}
	return resultArry;
}

function getFileHeaderString(headers, v_cycle){
	var resultStr = "";
	
	var rawArryE = ['M1','M2','M3','M4','M5','M6','M7','M8','M9','M10','M11','M12','M13','M14','M15','M16','M17','M18'];
	var rawArryL = ['LM1','LM2','LM3','LM4','LM5','LM6','LM7','LM8','LM9','LM10','LM11','LM12','LM13','LM14','LM15','LM16','LM17','LM18'];
	var rawStrE = rawArryE.join(',');
	var rawStrL = rawArryL.join(',');
	var resultArry = [];
	var i = 0;
	var j=0;
	var query = "select M1,M2,M3,M4,M5,M6,M7,M8,M9,M10,M11,M12,M13,M14,M15,M16,M17,M18 from  " +
					"\"_SYS_BIC\".\"cdp.ebgcfe.models.common/CV_COLUMNNAME\"(placeholder.\"$$INPUT_CYCLE$$\"=>?)";
	var conn = $.hdb.getConnection();
	var rs = conn.executeQuery(query,v_cycle);
	for(i = 0; i < headers.length; i++){
		if(rawStrE.indexOf(headers[i]) < 0 && rawStrL.indexOf(headers[i]) < 0){
			resultArry.push(headers[i]);
		}else{
			if(rawStrE.indexOf(headers[i]) > -1){
				resultArry.push(rs[0][headers[i]]+'E');
			}else if(rawStrL.indexOf(headers[i]) > -1){
				resultArry.push(rs[0][headers[i].substring(1)]+'L');
			}
		}
	}
	for(j = 0; j<resultArry.length; j++)
	{
		resultStr = resultStr + resultArry[j] + ',';
	}
	resultStr = resultStr.substring(0, resultStr.length-1);
	resultStr = resultStr + '\n';
	return resultStr;
}

function addXsjsResultsToArray(resultsArray, columns, objects){
	var i,j;
	var item;
	for(i=0;i<objects.length;i++)
	{
		item = [];
		for(j=0;j<columns.length;j++)
		{
			item.push(objects[i][columns[j]]);
		}
		resultsArray.push(item);
	}
	return resultsArray;
}

function getChildrenData(json, headerData, resultsArray, conn, tableName, sbbObject, otherFilter){

	var inputParas = json.inputParas;
	var tableColumns = json.columns;
	var whereFilter = json.whereFilter;
	var sortBy = json.sortBy;
	var sortOrder = json.sortOrder;
	
	var results = [];
	var columnStr = "";
	var sql = "";
	var i,j,k;
	
	//prepare for father data
	for(i=0;i<tableColumns.length;i++)
	{
		columnStr = columnStr + tableColumns[i] + ",";
	}
	columnStr = columnStr.substring(0, columnStr.length-1);
	sql = 'SELECT '+ columnStr + ' FROM ' + tableName;
	if(inputParas !== undefined && inputParas.length > 0)
	{
		sql = sql + '(';
		for(j=0; j<inputParas.length; j++)
		{
			sql = sql + 'placeholder."$$' + inputParas[j].label + '$$"=>\'' + headerData[inputParas[j].field] + '\',';
		}
		if(sbbObject !== undefined)
		{
			sql = sql + 'placeholder."$$' + sbbObject.label + '$$"=>\'' + sbbObject.value + '\',';
		}
		sql = sql.substring(0, sql.length -1);
		sql = sql + ')';
	}
	if(whereFilter !== undefined && whereFilter.length > 0)
	{
		sql = sql + " where ";
		for(k=0; k<whereFilter.length; k++)
		{
			sql = sql + whereFilter[k] + "='" + headerData[whereFilter[k]] + "' AND ";
		}
		if(otherFilter !== undefined)
		{
			for(k=0; k<otherFilter.length; k++)
			{
				sql = sql + otherFilter[k].label + "='" + headerData[otherFilter[k].field] + "' AND ";
			}
		}
		sql = sql.substring(0, sql.length -4);
	}
	if(sortBy !== undefined && sortOrder !== undefined)
	{
		sql = sql + " order by " + sortBy + " " + sortOrder;
	}
	
	results = conn.executeQuery(sql);
	resultsArray = addXsjsResultsToArray(resultsArray, tableColumns, results);
	
	return resultsArray;
	
}



function getDataByFatherChildren(json, headerData){
	
	var type = json.type;
	var tableName = json.table;
	var inputParas = json.inputParas;
	var tableColumns = json.columns;
	var whereFilter = json.whereFilter;
	var sortBy = json.sortBy;
	var sortOrder = json.sortOrder;
	
	var cycle = headerData.CYCLE;
	
	var resultsArray = [];
	var results = [];
	var columnStr = "";
	var sql = "";
	var i,j,k;
	var item;
	
	var conn = $.hdb.getConnection();
	//append header
	resultsArray.push(getFileHeader(tableColumns, cycle));
	if(type === 'CTO')
	{
		//prepare for children data parameters
		var sbbObject = {};
		var otherFilter = [{label:"MODEL",field:"ITEM"}];
		var childTableName = '"_SYS_BIC"."cdp.ebgcfe.models.ui_cto_costbom/CV_UI_CTO_COSTBOM_CHILDREN_LAST"';
		//prepare for father data
		for(i=0;i<tableColumns.length;i++)
		{
			columnStr = columnStr + tableColumns[i] + ",";
		}
		columnStr = columnStr.substring(0, columnStr.length-1);
		sql = 'SELECT '+ columnStr + ' FROM ' + tableName;
		if(inputParas !== undefined && inputParas.length > 0)
		{
			sql = sql + '(';
			for(j=0; j<inputParas.length; j++)
			{
				sql = sql + 'placeholder."$$' + inputParas[j].label + '$$"=>\'' + headerData[inputParas[j].field] + '\',';
			}
			sql = sql.substring(0, sql.length -1);
			sql = sql + ')';
		}
		if(whereFilter !== undefined && whereFilter.length > 0)
		{
			sql = sql + " where ";
			for(k=0; k<whereFilter.length; k++)
			{
				sql = sql + whereFilter[k] + "='" + headerData[whereFilter[k]] + "' AND ";
			}
			sql = sql.substring(0, sql.length -4);
		}
		if(sortBy !== undefined && sortOrder !== undefined)
		{
			sql = sql + " order by " + sortBy + " " + sortOrder;
		}
		
		results = conn.executeQuery(sql);
		
		//process father data
		for(i=0;i<results.length;i++)
		{
			//process each father data
			item = [];
			for(j=0;j<tableColumns.length;j++)
			{
				item.push(results[i][tableColumns[j]]);
			}
			resultsArray.push(item);
			sbbObject = {label:"v_sbb",value:results[i].CHILDREN};
			resultsArray = getChildrenData(json, headerData, resultsArray, conn, childTableName, sbbObject, otherFilter);
		}
		
		
	}
	return resultsArray;
}