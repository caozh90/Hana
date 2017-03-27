var json=JSON.parse(decodeURI($.request.body.asString()));

//var tableName = json.tablename;
var job_type = json.job_type;
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
var TABLE_NAME = 'SZEBGVMI.PRODUCTIONORDERS_BOM_ASN';
var STATUS = 'ASN_DELETED'; //需要更新的字段
var SCENARIO_ID ;
var PRODUCTIONORDID;
var LINENUM;
//var status = 'RUNNING';
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
var datain = {};

var i;
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

//验证权限
var privilegeExists;
query ='call "SECURITY"."cdp.security.procedures::checkPrivilege" ('
	+'\'modifyasnstatus::editable\',?)';
var pcall1 = conn.prepareCall(query);
pcall1.execute();
privilegeExists = pcall1.getNString(1);
if(privilegeExists !== 'OK')
{
	$.response.setBody("Insufficient privilege!");
	$.response.status = $.net.http.BAD_REQUEST;
}
else
{
	
		var rs_status,pcall_status;
		var status_count=0;
		if(job_type === "ASN_DELETED")
		{
			for(i=0;i<data.length;i++)
			{
				SCENARIO_ID = data[i].SCENARIO_ID;
				PRODUCTIONORDID = data[i].PRODUCTIONORDID;
				LINENUM = data[i].LINENUM;
				query = 'call "SZEBGVMI"."cdp.szebgvmi.procedures.pkg_ui.ui_asn_status::modifyASNStatus_new"(?,?,?,?,?)';
				try{
				
					pcall = conn.prepareCall(query);
					pcall.setString(1,SCENARIO_ID);
					pcall.setString(2,PRODUCTIONORDID);
					pcall.setString(3,LINENUM);
					pcall.setString(4,STATUS);
					pcall.execute();
					pcall.close();
					body = 'Finished! You can check the result on HANA';					
					$.response.status = $.net.http.OK;
					$.response.setBody(JSON.stringify(body));
					
				    }
				catch(e){
					body = e.message;
					$.response.status = $.net.http.BAD_REQUEST;
					$.response.setBody(JSON.stringify(body));
					}
			}
		}
		else if(job_type === "DELETE_ALL")
		{
		query = 'select count(1) from "_SYS_BIC"."cdp.szebgvmi.models/AT_ASN_STATUS" where STATUS=\'IN_PROCESS\'';
			pcall_status = conn.prepareStatement(query);
			rs_status = pcall_status.executeQuery();
			if(rs_status.next())
			{
				status_count = rs_status.getInteger(1);
			}
			pcall_status.close();
			if(status_count >0)
			{
				query = 'call "SZEBGVMI"."cdp.szebgvmi.procedures.pkg_ui.ui_asn_status::modifyASNStatusDeleteAll"()';
				pcall = conn.prepareCall(query);
				pcall.execute();
				pcall.close();
				body = "Finished! You can check the result.";
				$.response.status = $.net.http.OK;
				$.response.setBody(JSON.stringify(body));
			}
			else
			{
				body = 'There is no \'IN_PROCESS\' record to be set as \'ASN_DELETED\'!';
				$.response.status = $.net.http.BAD_REQUEST;
				$.response.setBody(JSON.stringify(body));
			}
		
		}
		conn.commit();
		conn.close();
		
	}

	/*
	$.response.contentType = "application/json; charset=UTF-8";
	$.response.setBody(body);*/



