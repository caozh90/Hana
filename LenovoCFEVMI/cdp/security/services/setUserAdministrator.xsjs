

var user_id = $.request.parameters.get("user_id");

var query = 'call "SECURITY"."cdp.security.procedures::setUserAdministrator" (?,?)';
var conn = $.db.getConnection();
var pcall = conn.prepareCall(query);
var rtn = '';

pcall.setBigInt(1,user_id); 
pcall.execute();

rtn =pcall.getNString(2); 
pcall.close();

conn.commit();
conn.close();
//rs.close();


$.response.contentType = "application/json; charset=UTF-8";
$.response.setBody(JSON.stringify(rtn));

$.response.status = $.net.http.OK;

