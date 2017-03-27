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
	var reg2 = /^\d+(,\d+)+$/;//匹配","隔开的数字 add by Gavin
	var reg3 = /^\d+((e|E)\d+)$/; ///^\d+[E,e]/; 
	var content = new StringBuilder();
	var i;
	var cell;
	for (i = 0; i < columnInfo.length; i++) {
		cell = getCellContent(rs, i + 1,columnInfo[i].type);
		if(cell !== null){
			if(!reg.test(cell)&&!reg2.test(cell)&&!reg3.test(cell)){
				if(cell.indexOf && cell.indexOf('"')>-1){
					cell = cell.replace(/\"/g,'""'); //modified by caozh4 20170315
					//cell = cell.replace(/^\"\"|\"\"$/g,'""""');	
					content.append('"'+cell+'"');  //modified by caozh4 20170315
				}else{
					content.append('"'+cell+'"');
				}
			}else{
				//如果字符串是0开头的纯数字，必须在前后加上双引号
				//如果字符串是以","连接的若干数字,也在前后加上双引号 add by Gavin
				//数字加大小写E就，前后加双引号
				content.append('"""'+cell+'"""');
			}
		}else{
			content.append('""');
		}
	}
	return content.toString(',');
}
function getTableContent(rs) {
	
//	var tableContent = new StringBuilder();
//	var meta = rs.getMetaData();
//	var columnCount = meta.getColumnCount();
//	var i = 1;
//	var tableHeader = new StringBuilder();
//	for(i = 1; i <=columnCount; i++ ){
//		tableHeader.append(meta.getColumnName(i));
//	}
//	var hMapping = $.request.parameters.get('headerMapping');
//	if(hMapping === undefined){
//		tableContent.append(tableHeader.toString(','));
//	}else{
//		tableContent.append(getFileHeader(tableHeader.data));
//	}
//	if (columnCount > 0) {
//		var columnInfo = getColumnInfo(meta, columnCount);				
//		while (rs.next()) {
//			tableContent.append(getRowContent(rs, columnInfo));
//		}
//	}
//	return tableContent.toString('\n');
	
	var tableContent = new StringBuilder();
	var meta = rs.getMetaData();
	var columnCount = meta.getColumnCount();
	var sTableHeader = $.request.parameters.get('header');
	var output = [];
	var rowCount = 0;
	var rowLimit = 250000;
	
	tableContent.append(sTableHeader);	
		
	if (columnCount > 0) {
		var columnInfo = getColumnInfo(meta, columnCount);				
		while (rs.next()) {
			if(rowCount > rowLimit){
				output.push(tableContent.toString('\n'));
				tableContent = new StringBuilder();
				tableContent.append(sTableHeader);
				tableContent.append(getRowContent(rs, columnInfo));
				rowCount = 0;
			}else{
				tableContent.append(getRowContent(rs, columnInfo));
			}
			rowCount++;
		}
		output.push(tableContent.toString('\n'));
	}

	return output;
}

function prepareQuery(){
	var view = $.request.parameters.get('view'),
	    param = $.request.parameters.get('p'),
	    paramvalue = $.request.parameters.get('pv'),
	    filter = $.request.parameters.get('filter'),
	    sColumn = $.request.parameters.get('column');
//	    header = $.request.parameters.get('header');
	
	var oViewMapping = {
			"hub_stock_params" : "aporeporting.model.SNP015/HubStockInventoryQuery",
			"snc_forecast_params" : "aporeporting.model.SNP009_V2.UNION_ALL/CA_SNP009_UNION_ALL_02",
			//"snc_forecast_params" : "aporeporting.model.SNP009_V3.SUMALL/CV_FORECAST_FINAL_V2_NONULL",			
			//"sup_comt02" : "aporeporting.model.SNC002/CV_COMTSTAT02N",
			"sup_comt02" : "aporeporting.model.SNC002.PERSIST/CV_SNC_SUPCOMT01V2", // snc 002 redesign 
			"VERSION_PARMAS" : "aporeporting.model.SNP012.SNP012_WEEKLY/CA_SNP012_WEEKLY_UNION_01",
			"VERSION_PARMAS1" : "aporeporting.model.SNP012.SNP012_MONTHLY/CA_SNP012_MONTHLY_UNION_01",
			"VERSION_PARMAS2" : "aporeporting.model.SNP012.SNP012_QUARTERLY/CA_SNP012_QUARTERLY_UNION_01",
			"pegging_params" : "aporeporting.model.SNP010/CV_SNP010_PEGGING_REPORT",
			"safestk02" : "aporeporting.model.SNC001/CV_SFSTOCK_LIST",
			"hubstock_proc_version" : "aporeporting.model.SNP002/CA_SNP002_STO_PROC_VEND_SPLIT_01",
			"demd_open_param" : "aporeporting.model.SNP003/CV_DEMD_OPENPO",
			"ondemand_version" : "aporeporting.model.SNP016/CA_SNP016_TOTAL"
	};
	
	var sView = "\"_SYS_BIC\".\""+oViewMapping[view] +"\"",
		sParam = param ? "('PLACEHOLDER' = ('$$"+param+"$$', "+paramvalue+"))" : '',
		sFilter = filter ? ' where '+ filter : '',
	    sQuery = 'SELECT '+ sColumn + " FROM "+ sView + ' ' + sParam + sFilter;
	
	// special logic for forecast report - to order the key figures
	if(view === 'snc_forecast_params'){
		sQuery = sQuery + ' order by "EXT_MATNR", "LOCNO_PLANT", "SORD_ID"';
	}
	
	if(view === 'ondemand_version'){
		sQuery = sQuery + ' order by "GRPID", "MATNR", "QTY_TYPE", "VENDER_LOCNO"';
	}
	
	return sQuery;
	
}
