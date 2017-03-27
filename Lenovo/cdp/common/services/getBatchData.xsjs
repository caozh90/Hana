$.import("cdp.common.services", "downloadBatchLib");
var xsLib = $.cdp.common.services.downloadBatchLib;

var json={};
if($.request.body !== undefined)
{
 json = JSON.parse($.request.body.asString());	
}

//string
var type = json.type;
var tableName = json.table;
var filterTableName = json.filterTable;
var roleName = json.roleName;
//array

var otherFilter = json.relatedFilter;
var filterColumns = json.filterColumns;

var tableColumns = json.columns;

var where = json.where;
var orderby = json.orderby;
var defaultCycle = json.defaultCycle;



var conn = $.hdb.getConnection();

//declare for sql exception
var body;
var error_message;

var responseArray = [];

var i,j,k,t;

var sql,results,cycleSql,cycleResults;
var cycleHeaderObject = {};

function processResult(para, type)
{
	
	//prepare for return
	$.response.status = $.net.http.OK;
	if(type === 'CTO' || type === 'SEO' || type === 'SBB')
	{
		body = para;
		$.response.setBody(JSON.stringify(body));
		$.response.contentType = "application/json; charset=UTF-8";
	}
	else
	{
		var fileName = $.request.parameters.get('filename');
		if (fileName === undefined) {
			fileName = 'Excel-Content';
		}
		var zip = new $.util.Zip();
		//zip[fileName + '.csv'] = info.data;
		var system = $.request.headers.get('User-Agent');
		if(system.indexOf('Windows')>0){
			zip[fileName + '.csv'] = '\ufeff'+para;      //For Windows System
		}else{
			zip[fileName + '.csv'] = para;               //For non-Windows System
		}
		$.response.setBody(zip);
		$.response.contentType = 'application/zip';
		$.response.headers.set('Content-Disposition', 'attachment; filename='
				+ fileName + '.zip');
	}
	
}

function getFatherChildrenArrayDataToDownload(results, cycleHObject, json){
	var temp = {};
	
	var sql = "";
	var relatedFilter = json.relatedFilter;
	var columns = json.columns;
	var filterColumns = json.filterColumns;
	var elements;
	var newFilterHeader;
	var item = {};
	
	var headerResults;
	
	var resultsArray = [];
	for(i=0; i<results.length; i++)
	{
		item = results[i];
		elements = [];
		newFilterHeader = [];
		//header filter columns
		if(item.TLVL === '1')
		{
			//header data -- cycle,model,plant,country
			for(j=0;j<filterColumns.length;j++)
			{
				elements.push(item[filterColumns[j]]);
				temp[filterColumns[j]] = item[filterColumns[j]];
			}
			//merge array
			newFilterHeader = newFilterHeader.concat(filterColumns);
			
			if(relatedFilter !== undefined && relatedFilter.length > 0)
			{
				for(k=0;k<relatedFilter.length;k++)
				{
					//append header
					newFilterHeader.push(relatedFilter[k].name);
					//append sql to get header data
					sql = 'SELECT '+ relatedFilter[k].select + ' FROM ' + relatedFilter[k].table;
					if(relatedFilter[k].inputParas !== undefined && relatedFilter[k].inputParas.length > 0)
					{
						sql = sql + '(';
						for(t=0; t<relatedFilter[k].inputParas.length; t++)
						{
							sql = sql + 'placeholder."$$' + relatedFilter[k].inputParas[t].label + '$$"=>\'' + temp[relatedFilter[k].inputParas[t].field] + '\',';
						}
						sql = sql.substring(0, sql.length -1);
						sql = sql + ')';
					}
					if(relatedFilter[k].where !== undefined && relatedFilter[k].where !== "")
					{
						sql = sql + " where " + relatedFilter[k].where;
					}
					headerResults = conn.executeQuery(sql);
					elements.push(headerResults[0][relatedFilter[k].select]);
				}
			}
			resultsArray.push([]);
			resultsArray.push(newFilterHeader);
			resultsArray.push(elements);
			resultsArray.push(cycleHObject[item.CYCLE]);
		}
		if(item.TLVL === '2')
		{
			for(j=0;j<columns.length;j++)
			{
				elements.push(item[columns[j]]);
			}
			resultsArray.push(elements);
		}
		if(json.type === 'SEO' && item.TLVL === '3')
		{
			for(j=0;j<columns.length;j++)
			{
				if(j === 4)
				{
					elements.push(null);
				}
				elements.push(item[columns[j]]);
			}
			elements.splice(0,1);
			resultsArray.push(elements);
		}
	}
	
	return resultsArray;
}

function getArrayDataToDownload(results, json){
	var columns = json.columns;

	var elements;
	var item = {};
	
	var resultsArray = [];
	try{
		//header
		if(defaultCycle !== undefined && defaultCycle !== "")
		{
			resultsArray.push(xsLib.getFileHeader(columns, defaultCycle));
		}
		else
		{
			resultsArray.push(columns);
		}
		
		//data
		for(i=0; i<results.length; i++)
		{
			item = results[i];
			elements = [];
			for(j=0;j<columns.length;j++)
			{
				elements.push(item[columns[j]]);
			}
			resultsArray.push(elements);
		}
	}
	catch(e){
		resultsArray = e;
	}
	
	
	return resultsArray;
}

var responseStr = "";
var limit = json.limit;
var offset = json.offset;

try{
	
	if(type === 'CTO' || type === 'SEO' || type === 'SBB')
	{
		//prepare for get dynamic header M1-LM18
		cycleSql = 'SELECT DISTINCT CYCLE FROM ' + filterTableName;
		cycleResults = conn.executeQuery(cycleSql);
		for(i=0;i<cycleResults.length;i++)
		{
			cycleHeaderObject[cycleResults[i].CYCLE] = xsLib.getFileHeader(tableColumns, cycleResults[i].CYCLE);
		}
		//get results
		sql = 'SELECT * FROM ' + tableName;
		results = conn.executeQuery(sql);
		responseArray = getFatherChildrenArrayDataToDownload(results, cycleHeaderObject, json);
		responseArray.splice(0,1);
		processResult(responseArray, type);
		
		
	}
	else
	{
		var defaultCycle = $.request.parameters.get('cycle');
		var tableName = $.request.parameters.get('table');
		var limit = $.request.parameters.get('limit');
		var offset = $.request.parameters.get('offset');
		
		var tableColumns = $.request.parameters.get("column");
		if(!(tableColumns instanceof Array)){
			tableColumns = [tableColumns];
		}
		//get results
		if(where === undefined)
		{
			where = "";
		}
		if(orderby === undefined)
		{
			orderby = "";
		}
		responseStr = responseStr + xsLib.getFileHeaderString(tableColumns, defaultCycle);
		
		sql = 'SELECT FIELDS FROM ' + tableName + " limit " + limit + " offset " + offset;
		results = conn.executeQuery(sql);
		for(i=0; i<results.length; i++)
		{
			responseStr = responseStr + results[i].FIELDS + '\n';
		}
		
		processResult(responseStr, type);
	}
	

}
//catch exception
catch(e){
	error_message = e.message;
	while(error_message.indexOf("'") >0 ) {
		error_message = error_message.replace('\'','"'); 
	}
	$.response.status = $.net.http.BAD_REQUEST;
	body = error_message;
	
}
//close connection
conn.close();


