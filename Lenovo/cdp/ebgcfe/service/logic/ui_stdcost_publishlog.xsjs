/************************************************************************
* Created by zhangzj6
* 2016-06-15
* to download CFE. std cost daily/monthly publish log
* for SR: WO0000000264082 (cuihx4)
*************************************************************************/

function timeStampTochar(char){
	var conn = $.db.getConnection(); 
	var query = 'select TO_varchar(?) from dummy';
	var stmt = conn.prepareStatement(query);
	stmt.setString(1,char);
	var rs = stmt.execute();
	var result;
	while(rs.next()){
		result = rs.getString(1);
	}
	stmt.close(); 
	return result;
}


function download_daily(){
	var query;
	var body = '';
	
	body += "ITEM" + "\t" + 
            "PLANT" + "\t" +
            "STATUS" + "\t" +
            "MESSAGE" + "\t" +
            "SYS_CREATED_BY" + "\t" +
            "SYS_CREATED_DATE" + "\n";
	
	try{
		query = "SELECT \"ITEM\", \"PLANT\", \"STATUS\", \"MESSAGE\", \"SYS_CREATED_BY\", to_varchar(\"SYS_CREATED_DATE\",'YYYY-MM-DD HH24:MI:SS') from" + 
		        "\"PCDW\".\"RSP_STDCOST_DAILY\" where \"STATUS\" = " + "'E'" + "and \"SYS_CREATED_DATE\" >= " +
		        "(SELECT add_days(max(\"SYS_CREATED_DATE\"),-1) FROM " + "\"PCDW\".\"RSP_STDCOST_DAILY\" )";
		var conn = $.db.getConnection();
		var stmt = conn.prepareStatement(query);
		var rs = stmt.executeQuery();
		while(rs.next()){
			
			body += rs.getNString(1) + "\t" + 
	                rs.getNString(2) + "\t" +
	                rs.getNString(3) + "\t" +
	                rs.getNString(4) + "\t" +
	                rs.getNString(5) + "\t" +
	                rs.getNString(6) + "\n";			
		}
		
	}catch(e){
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(e.message);
	}

	$.response.setBody(body);
	$.response.contentType = 'application/vnd.ms-excel; charset=utf-16le';
    $.response.headers.set('Content-Disposition','attachment; filename=RSP_STDCOST_DAILY.xls');
	$.response.status = $.net.http.OK;
	
}


function download_monthly(){
	var query;
	var body = '';
	
	body += "ITEM" + "\t" + 
            "PLANT" + "\t" +
            "STATUS" + "\t" +
            "MESSAGE" + "\t" +
            "SYS_CREATED_BY" + "\t" +
            "SYS_CREATED_DATE" + "\n";
	
	try{
		query = "SELECT \"ITEM\", \"PLANT\", \"STATUS\", \"MESSAGE\", \"SYS_CREATED_BY\", to_varchar(\"SYS_CREATED_DATE\",'YYYY-MM-DD HH24:MI:SS') from" + 
		        "\"PCDW\".\"RSP_STDCOST_MONTHLY\" where \"STATUS\" = " + "'E'" + "and \"SYS_CREATED_DATE\" >= " +
		        "(SELECT add_seconds(max(\"SYS_CREATED_DATE\"),-7200) FROM " + "\"PCDW\".\"RSP_STDCOST_MONTHLY\" )";
		var conn = $.db.getConnection();
		var stmt = conn.prepareStatement(query);
		var rs = stmt.executeQuery();
		while(rs.next()){
			
			body += rs.getNString(1) + "\t" + 
	                rs.getNString(2) + "\t" +
	                rs.getNString(3) + "\t" +
	                rs.getNString(4) + "\t" +
	                rs.getNString(5) + "\t" +
	                rs.getNString(6) + "\n";						
		}
		
	}catch(e){
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(e.message);
	}
	$.response.setBody(body);
	$.response.contentType = 'application/vnd.ms-excel; charset=utf-16le';
    $.response.headers.set('Content-Disposition','attachment; filename=RSP_STDCOST_MONTHLY.xls');
	$.response.status = $.net.http.OK;
}

var tablename = $.request.parameters.get("tablename");

switch (tablename){
case '"PCDW"."RSP_STDCOST_DAILY"':
	download_daily();
	break;
case '"PCDW"."RSP_STDCOST_MONTHLY"':
	download_monthly();
	break;
}
