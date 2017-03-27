var json=JSON.parse(decodeURI($.request.body.asString()));

//var tableName = json.tablename;
//var job_type = json.JOB_TYPE;
//var columns = json.columns;
var query = '';
var conn = $.db.getConnection();
var pcall ;
var body;
var data = json.data;
/*
 * 调用UI_URGENT_MO_PULL页面的DS
 */

//获取任务类型和流程名
var process_name = json.PROCESS_NAME;
var TABLE_NAME = 'SZEBGVMI.UI_URGENT_MO_PULL';
var SEGMENT_NAME = 'STATUS'; //需要更新的字段

var status = 'RUNNING';
//DS info
var host;
var webserver_port;
var url_path_postfix;
var url; // host + webserver_port + url_path_postfix
var cms_port;
var cms_authentication;
var cms_system;
var repo_name;
var job_server;
var server_group;
var userName;
var passwd;

//DS job info
var job_name;
var G_JOB_INIT_FLAG;
var G_DEBUG;
var G_STARTFROMSTEP;
var G_IVID;
var G_WFNAME;

var client;
var req;

var log_on_body;
var log_on_response;
var run_body;
var run_response;
//used to odata record.
var DEST_STORAGE_TYPE;
var DEST_STORAGE_BIN ;
var DEST_STORAGE_LOC;
var WERKS;
var PHYSICAL_PLANT;
var PRODUCTION_LINE;
var DELIVERY_DATE;
var MATNR;
var NOTES;
var job_type;
var SRC_STORAGE_LOC;
var datain = {};


var sessionID='';
var current_user;
//获取session的user
var user_sql = 'select session_user from dummy';
var pcall_user = conn.prepareStatement(user_sql);
var rs_user = pcall_user.executeQuery();
if(rs_user.next())
{
	current_user = rs_user.getNString(1);
}
rs_user.close();
pcall_user.close();
var i;
//验证权限
var privilegeExists;
var result;
query ='call "SECURITY"."cdp.security.procedures::checkPrivilege" ('
	+'\'changeasnpull::editable\',?)';

var pcall1 = conn.prepareCall(query);
pcall1.execute();

privilegeExists = pcall1.getNString(1);

if(privilegeExists!== 'OK')
{
	$.response.setBody("Insufficient privilege!");
	$.response.status = $.net.http.BAD_REQUEST;
}
else
{
	try
	{
		var rs_status,pcall_status;
		var status_count=0;
			for(i=0;i<data.length;i++)
			{
				DEST_STORAGE_TYPE = data[i].DEST_STORAGE_TYPE;
				DEST_STORAGE_BIN = data[i].DEST_STORAGE_BIN;
				DEST_STORAGE_LOC = data[i].DEST_STORAGE_LOC;
				WERKS = data[i].WERKS;
				PHYSICAL_PLANT = data[i].PHYSICAL_PLANT;
				PRODUCTION_LINE = data[i].PRODUCTION_LINE;
				DELIVERY_DATE = data[i].DELIVERY_DATE;
				MATNR = data[i].MATNR;
				NOTES = data[i].NOTES;
				job_type =  data[i].JOB_TYPE;
				SRC_STORAGE_LOC = data[i].SRC_STORAGE_LOC;
				query = 'CALL "SZEBGVMI"."cdp.szebgvmi.procedures.pkg_ui.ui_asn_pull::updateASNPullStatus_new"(?,?,?,?,?,?,?,?,?,?,?,?)';
				try{
				
					pcall = conn.prepareCall(query);
					pcall.setString(1,DEST_STORAGE_TYPE);
					pcall.setString(2,DEST_STORAGE_BIN);
					pcall.setString(3,DEST_STORAGE_LOC);
					pcall.setString(4,WERKS);
					pcall.setString(5,PHYSICAL_PLANT);
					pcall.setString(6,PRODUCTION_LINE);
					//pcall.setTimestamp(7,DELIVERY_DATE);
					pcall.setString(7,DELIVERY_DATE);
					pcall.setString(8,MATNR);
					pcall.setString(9,NOTES);
					pcall.setString(10,SRC_STORAGE_LOC);
					pcall.setString(11,job_type);
					pcall.execute();
					//pcall.close();
					conn.commit();
					
					body = 'Finished! You can check the result on HANA';
					$.response.status = $.net.http.OK;
					$.response.setBody(JSON.stringify(body));
					
				    }
				catch(e){
					$.response.status = $.net.http.BAD_REQUEST;
					body = e.message;
					$.response.setBody(JSON.stringify(body));
					}
				
			}
			
			conn.close();
	}
	catch(e)
	{
		body = e.message;
		$.response.setBody(JSON.stringify(body));
		$.response.status = $.net.http.BAD_REQUEST;
	}
}

