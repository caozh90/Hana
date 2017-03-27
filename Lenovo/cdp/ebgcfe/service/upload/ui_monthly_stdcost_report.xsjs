/***
 * 6.4 x86 monthly stdcost report 
 * import executed item function
 * Leon Bian 2015-08-28
 * **/
$.import('cdp.ebgcfe.service.upload', 'uploadLib');
var lib = $.cdp.ebgcfe.service.upload.uploadLib;


var json=JSON.parse($.request.body.asString());

var data = json.data;
var body = "";
var result = "";
var whereparameters = "";
var error_message = "";
var i;
for(i=0;i<data.length;i++)
{ 
	if ( data[i].ITEM !== undefined )
	{
		whereparameters = whereparameters + "'" + lib.processData(data[i].ITEM) + "',";
	}
}
if(whereparameters !== "")
{
	
	whereparameters = whereparameters.substring(0,whereparameters.length-1);
	
	//filter import data
	var query = "";
	var tablename = "";
	var wherecondition1 = "";
	var wherecondition2 = "";
	var conn;
	var pstmt;
	var rs;
	
	try
	{  
		//0000090Y6719,00D8213,00JX858,40K2500
		//select distinct ITEM, ITEM_TYPE from "_SYS_BIC"."cdp.ebgcfe.models.ui_item/CV_UI_ITEM" 
		//where ITEM in('0000081Y9346','0000090Y6719','BPSB7US','00D8213','00JX858','40K2500') 
		//and ITEM_TYPE in ('OPTION','COMPONENT')
//		tablename = '"_SYS_BIC"."cdp.ebgcfe.models.ui_rpt_stdcost_monthly/CV_RPT_STDCOST_MONTHLY_ITEM_DDL"';
//		wherecondition1 = " ITEM in (" + whereparameters + ")";
//		//wherecondition2 = " and ITEM_TYPE in ('OPTION','COMPONENT')";
//		query = "select distinct ITEM from " + tablename + " where " + wherecondition1 ;//+ wherecondition2;
		
		tablename = '"_SYS_BIC"."cdp.ebgcfe.models.ui_item/CV_UI_ITEM"';
		wherecondition1 = " ITEM in (" + whereparameters + ")";
		wherecondition2 = " and ITEM_TYPE in ('OPTION','COMPONENT')";
		query = "select distinct ITEM from " + tablename + " where " + wherecondition1 + wherecondition2;
		conn = $.db.getConnection();
		pstmt = conn.prepareStatement(query);
		rs = pstmt.executeQuery();
		
		while (rs.next()) {
			
			result = result + rs.getNString(1) + ",";
		}
		
		result = result.substring(0,result.length-1);
		
		
	}
	catch(e)
	{	
		error_message = e.message;
		//替换单引号'
		while(error_message.indexOf("'") >0 ) {
			error_message = error_message.replace('\'','"'); 
		}
		$.response.status = $.net.http.BAD_REQUEST;
		body = error_message;
	}
	
	conn.close();
	
	if(result !== "")
	{
		$.response.status = $.net.http.OK;
		body = result;
	}
	else
	{
		$.response.status = $.net.http.BAD_REQUEST;
		body = "no items fit item_type in OPTION or COMPONENT.";
	}
}
else
{
	$.response.status = $.net.http.BAD_REQUEST;
	body = "column name should be ITEM";
}

$.response.contentType = "application/json; charset=UTF-8";
$.response.setBody(body);