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

function getColumnType(view, column){
	var conn = $.hdb.getConnection();
	var query = 'select DATA_TYPE_NAME from "SYS"."VIEW_COLUMNS" where ?||schema_name||?||view_name||? = ? and column_name = ?';
	var rs = conn.executeQuery(query,'"','"."','"',view,column.toUpperCase());
	return rs[0].DATA_TYPE_NAME;
}

function timeStampToDate(data){
	var conn = $.db.getConnection();
	var query = 'select to_varchar(to_date(?)) from dummy';
	var stmt = conn.prepareStatement(query);
	stmt.setString(1,data);
	var rs = stmt.execute();
	var result;
	while(rs.next()){
		result = rs.getString(1);
	}	
	stmt.close();
	return result;
}

function getFileHeader(headers){
	var v_cycle = $.request.parameters.get('cycle');
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
	return resultArry.join(',');
}

function getCellContent(rs, i, type) {
	var content = null;
	switch (type) {
	case "TINYINT":
		content = rs.getInteger(i);
		break;
	case "SMALLINT":
		content = rs.getInteger(i);
		break;
	case "INT":
		content = rs.getInteger(i);
		break;
	case "INTEGER":
		content = rs.getInteger(i);
		break;
	case "BIGINT":
		content = rs.getInteger(i);
		break;
	case "DECIMAL":
		content = rs.getDecimal(i);
		break;
	case "REAL":
		content = rs.getReal(i);
		break;
	case "DOUBLE":
		content = rs.getDouble(i);
		break;
	case "CHAR":
		content = rs.getNString(i);
		break;
	case "VARCHAR":
		content = rs.getNString(i);
		break;
	case "NCHAR":
		content = rs.getNString(i);
		break;
	case "NVARCHAR":
		content = rs.getNString(i);
		break;
	case "BINARY":
		content = rs.getBString(i);
		break;
	case "VARBINARY":
		content = rs.getBString(i);
		break;
	case "DATE":
		content = rs.getDate(i);
		break;
	case "TIME":
		content = rs.getTime(i);
		break;
	case "TIMESTAMP":
		content = rs.getTimestamp(i);
		break;
	case "CLOB":
		content = rs.getClob(i);
		break;
	case "NCLOB":
		content = rs.getNClob(i);
		break;
	case "BLOB":
		content = rs.getBlob(i);
		break;
	case "SMALLDECIMAL":
		content = rs.getDecimal(i);
		break;
	case "TEXT":
		content = rs.getNClob(i);
		break;
	case "SHORTTEXT":
		content = rs.getNString(i);
		break;
	case "ALPHANUM":
		content = rs.getNString(i);
		break;
	case "SECONDDATE":
		content = rs.getSeconddate(i);
		break;
	case "FLOAT":
		content = rs.getFloat(i);
		break;
	}
	if(content !== null)
	{
		if(content.indexOf(",") > -1)
		{
			content.replace(/,/g, "，");
		}
	}
	
	return content;
}
function getColumnInfo(meta, columnCount) {
	var columnInfo = [], i;
	for (i = 1; i < columnCount + 1; i++) {
		columnInfo.push({
			"name" : meta.getColumnName(i),
			"type" : meta.getColumnTypeName(i)
		});
	}
	return columnInfo;
}
function getRowContent(rs, columnInfo) {
	var reg = /^0+\d+$/;
	var reg2 = /^\d+(,\d+)+$/;		//匹配","隔开的数字 add by Gavin
	var reg3 = /^\d+((e|E)\d+)$/;   //匹配 以e或者E隔开的两个数字，excel会按照科学计数法处理
	var content = new StringBuilder();
	var i;
	var cell;
	for (i = 0; i < columnInfo.length; i++) {
		cell = getCellContent(rs, i + 1,columnInfo[i].type);
		if(cell !== null){
			if(!reg.test(cell)&&!reg2.test(cell)&&!reg3.test(cell)){
				if(cell.indexOf('"')>-1){
					cell = cell.replace(/\"/g,'""');
					cell = cell.replace(/^\"\"|\"\"$/g,'"""');
					content.append(cell);
				}else{
					content.append('"'+cell+'"');
				}
			}else{
				//如果字符串是0开头的纯数字，必须在前后加上双引号
				//如果字符串是以","连接的若干数字,也在前后加上双引号 add by Gavin
				//如果字符串是以“e”或者“E”隔开的两个数字，加引号处理 add by Gavin
				content.append('"""'+cell+'"""');
			}
		}else{
			content.append('""');
		}
	}
	return content.toString(',');
}
function getTableContent(rs) {
	var tableContent = new StringBuilder();
	var meta = rs.getMetaData();
	var columnCount = meta.getColumnCount();
	var i = 1;
	var tableHeader = new StringBuilder();
	for(i = 1; i <=columnCount; i++ ){
		tableHeader.append(meta.getColumnName(i));
	}
	var hMapping = $.request.parameters.get('headerMapping');
	if(hMapping === undefined){
		tableContent.append(tableHeader.toString(','));
	}else{
		tableContent.append(getFileHeader(tableHeader.data));
	}
	if (columnCount > 0) {
		var columnInfo = getColumnInfo(meta, columnCount);				
		while (rs.next()) {
			tableContent.append(getRowContent(rs, columnInfo));
		}
	}
	return tableContent.toString('\n');
}

function getQuery(){
	var table = $.request.parameters.get("table");
	var filter = $.request.parameters.get("filter");
	var column = $.request.parameters.get("column");
	if(!(column instanceof Array)){
		column = [column];
	}
	var offset = $.request.parameters.get("skip");
	var limit = $.request.parameters.get("top");
	var modelIn = $.request.parameters.get("modelIn");
	var sortColumn = $.request.parameters.get("sortColumn");
	var sortOrder = $.request.parameters.get("sortOrder");
	//added by Chris Gao 2015-10-30
	var type = $.request.parameters.get("downloadType");
	var fatherFilter = $.request.parameters.get("father_filter");
	
	var sort;
	var i = 0;
	var columnType,columnName;
	if(sortColumn === undefined || sortColumn === ''){
		sort = '';
	}else{
		sort = ' order by '+sortColumn+' ';
		if(sortOrder !== undefined && sortOrder !== ''){
			sort = sort + sortOrder+' ';
		}
	}
	var limitOffset = '';
	if(offset!==undefined&&offset!==null&&limit!==undefined&&limit!==null){
		limitOffset = ' limit ' + limit + ' offset ' + offset;
	}
	if(column!==undefined&&column!==null){
		for(i = 0; i < column.length; i++){
			columnName = column[i];
			columnType = getColumnType(table,columnName);
			if(columnType === 'TIMESTAMP' && table.indexOf('ebgcfe') > 0){
				column[i] = 'to_date('+column[i]+')';
			}
			if(columnType === 'TIMESTAMP' && (( table.indexOf('mxebgvmi') > 0) || 
					                         ( table.indexOf('szebgvmi') > 0 ))//add szebgvmi zhaodan1
			   ){ 
				column[i] = "to_varchar("+column[i]+",'YYYY-MM-DD HH24:MI:SS')";
			}
			/******************************
			 * Modified by Chris Gao
			 * 2015-10-19
			 * to process download date format for EBGDF
			 ********************************/
			if(columnType === 'TIMESTAMP' && (( table.indexOf('ebgdf') > 0)) )
			{ 
				column[i] = "to_varchar("+column[i]+",'MM/DD/YYYY HH24:MI:SS')";
			}
			/********************************
			 * End by Chris Gao
			 ******************************/
			column[i] = 'to_varchar('+column[i]+') as '+columnName;
		}
		if(column instanceof Array){
			column = column.join(',');
		}
	}else{
		column = '*';
	}
	
	if(filter!==undefined&&filter!==null){
		if(filter.indexOf('eq') !== -1)
			{filter = filter.replace(/(\s+)eq(\s+)/g,'=');}
		if(filter.indexOf('ge') !== -1)
			{filter = filter.replace(/(\s+)ge(\s+)/g,'>=');}
		if(filter.indexOf('gt') !== -1)
			{filter = filter.replace(/(\s+)gt(\s+)/g,'>');}
		if(filter.indexOf('le') !== -1)
			{filter = filter.replace(/(\s+)le(\s+)/g,'<=');}
		if(filter.indexOf('lt') !== -1)
			{filter = filter.replace(/(\s+)lt(\s+)/g,'<');}
		if(filter.indexOf('ne') !== -1)
			{filter = filter.replace(/(\s+)ne(\s+)/g,'!=');}
		if(filter.indexOf('datetime') !== -1)
			{filter = filter.replace(/datetime/g,'');}
		if(filter.indexOf('substringof') !== -1)
			{filter = filter.replace(/substringof\('(.*?)',(.*?)\)/g," $2 like '%$1%' ");}
		if(filter.indexOf('startswith') !== -1)
			{filter = filter.replace(/startswith\((.*?),'(.*?)'\)/g," $1 like '$2%' ");}
		if(filter.indexOf('endswith') !== -1)
			{filter = filter.replace(/endswith\((.*?),'(.*?)'\)/g," $1 like '%$2' ");}
		filter = ' where ' + filter;
	}else{
		filter = '';
	}
	
	//added by Chris Gao 2015-10-30 -- to process FatherFilter without same filter paras as children
	if(fatherFilter!==undefined&&fatherFilter!==null){
		if(fatherFilter.indexOf('eq') !== -1)
			{fatherFilter = fatherFilter.replace(/(\s+)eq(\s+)/g,'=');}
		fatherFilter = ' where ' + fatherFilter;
		
	}else{
		fatherFilter = '';
	}

	if(modelIn !== undefined && modelIn !== null){
		//modelIn =  modelIn.replace(/\s+/g,'').split('and');
		modelIn =  modelIn.replace(/^\s*|\s*$/g,'').split('and');	//modified by caozh4 201702 for PBI000000051855 
		for(i = 0; i < modelIn.length; i++){
			modelIn[i] = 'placeholder.' + modelIn[i];
		}
		modelIn = '(' + modelIn.join(',') + ')';
	}else{
		modelIn = '';
	}
	//added by Chris Gao 2015-10-30
	var query;
	if(type !== undefined && (type === 'cto'||type === 'seo' || type === 'sbb' )){
		query = 'select * from (select ' + column + ' from (select * from ' + table + modelIn + fatherFilter + sort + limitOffset + '))';
	}else{
		query = 'select * from (select ' + column + ' from (select * from ' + table + modelIn + filter + sort + limitOffset + '))';
	}
//	var query = 'select * from (select ' + column + ' from (select * from ' + table + modelIn + filter + sort + limitOffset + '))';
//	var query = 'select * from ' + table + modelIn + filter + sort + limitOffset;
	return query;
}
//added by Chris Gao 2015-10-31 seo Bottom Query
function getSeoBottomQuery(){
	var table = $.request.parameters.get("table");
	var filter = $.request.parameters.get("seoFilterBottom");
	var column = $.request.parameters.get("bottomColumn");
	if(!(column instanceof Array)){
		column = [column];
	}
	
	var offset = $.request.parameters.get("skip");
	var limit = $.request.parameters.get("top");
//	var sortColumn = $.request.parameters.get("sortColumn");
//	var sortOrder = $.request.parameters.get("sortOrder");
	
	var sort;
	var i = 0;
	var columnName;
//	if(sortColumn === undefined || sortColumn === ''){
//		sort = '';
//	}else{
//		sort = ' order by '+sortColumn+' ';
//		if(sortOrder !== undefined && sortOrder !== ''){
//			sort = sort + sortOrder+' ';
//		}
//	}
	sort = 'order by COST_LVL, length(COST_NAME) asc ';
	var limitOffset = '';
	if(offset!==undefined&&offset!==null&&limit!==undefined&&limit!==null){
		limitOffset = ' limit ' + limit + ' offset ' + offset;
	}
	var num = 0, lnum=0;
	if(column!==undefined&&column!==null){
		for(i = 0; i < column.length; i++){
			columnName = column[i];
			column[i] = 'to_varchar('+column[i]+') as '+columnName;
		}
		
		column[2]= "''";column[3]= "''";column[4]= "''";column[5]= "''";column[6]= "''";column[7] = "''";
		
		for(num = 0; num < 18; num++)
		{
			column[8 + num] = 'to_varchar(M'+(num+1).toString()+') as M'+ (num+1).toString();
		}
		
		for(num = 0; num < 18; num++)
		{
			lnum = 8 + 18;
			column[lnum] = 'to_varchar(LM'+(num+1).toString()+') as LM'+ (num+1).toString();
		}
		
		if(column instanceof Array){
			column = column.join(',');
		}
	}else{
		column = '*';
	}
	//add column m1-m18, lm1-lm18
	
	
	if(filter!==undefined&&filter!==null){
		if(filter.indexOf('eq') !== -1)
			{filter = filter.replace(/(\s+)eq(\s+)/g,'=');}
		if(filter.indexOf('ge') !== -1)
			{filter = filter.replace(/(\s+)ge(\s+)/g,'>=');}
		if(filter.indexOf('gt') !== -1)
			{filter = filter.replace(/(\s+)gt(\s+)/g,'>');}
		if(filter.indexOf('le') !== -1)
			{filter = filter.replace(/(\s+)le(\s+)/g,'<=');}
		if(filter.indexOf('lt') !== -1)
			{filter = filter.replace(/(\s+)lt(\s+)/g,'<');}
		if(filter.indexOf('ne') !== -1)
			{filter = filter.replace(/(\s+)ne(\s+)/g,'!=');}
		if(filter.indexOf('datetime') !== -1)
			{filter = filter.replace(/datetime/g,'');}
		if(filter.indexOf('substringof') !== -1)
			{filter = filter.replace(/substringof\('(.*?)',(.*?)\)/g," $2 like '%$1%' ");}
		if(filter.indexOf('startswith') !== -1)
			{filter = filter.replace(/startswith\((.*?),'(.*?)'\)/g," $1 like '$2%' ");}
		if(filter.indexOf('endswith') !== -1)
			{filter = filter.replace(/endswith\((.*?),'(.*?)'\)/g," $1 like '%$2' ");}
		filter = ' where ' + filter;
	}else{
		filter = '';
	}

	//added by Chris Gao 2015-10-30
	var query = 'select * from (select ' + column + ' from (select * from ' + table + filter + sort + limitOffset + '))';
	return query;
//	$.response.setBody(query);
//	return column;
}
