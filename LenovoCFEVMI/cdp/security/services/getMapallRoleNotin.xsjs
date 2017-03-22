var output ={};

//var module_id;
var group_id;
var user_id;
//module_id = $.request.parameters.get("module_id");
group_id = $.request.parameters.get("group_id");
user_id = $.request.parameters.get("user_id");
   
var conn = $.db.getConnection();
//var pcall = conn.prepareCall("CALL \"SECURITY\".\"cdp.security.procedures::getRolegroupAndRoleNotIn\"(?,?,?,?)");
var pcall = conn.prepareStatement("SELECT ROLEGROUP_ID, ROLEGROUP_NAME, ROLEGROUP_COMMENT, ROLE_ID, ROLE_NAME, ROLE_COMMENT,DISPLAY_ROLE_NAME FROM " +
		"_SYS_BIC.\"cdp.security.models/CV_GETROLEGROUPROLENOTIN\" ('PLACEHOLDER' = ('$$IN_GROUP_ID$$', '"+String(group_id)+"'), 'PLACEHOLDER' = ('$$IN_USER_ID$$', '"+String(user_id)+"')) order by rolegroup_id,role_id");

//pcall.setString(1,String(module_id));
//pcall.setBigInt(1,Number(group_id));
//pcall.setBigInt(2,Number(user_id));

pcall.execute();

var rs = pcall.getResultSet();


var v_rolegroup_id,v_node,c_rolegroup_id;
var v_tree='{';
var v_root='{"name": "root","description": "root description","checked": false';
var i,j;

i=0; //index for leaves
j=0; //index for trees


//initialization
rs.next();
v_rolegroup_id=Number(rs.getBigInt(1));
v_node='{'.concat('"id":').concat(rs.getBigInt(4)).concat(',"name":"').concat(rs.getString(5)).concat('","comment":"').concat(rs.getString(6)).concat('","display_role_name":"').concat(rs.getString(7)).concat('","checked":true}');
v_tree=v_tree.concat('"id":').concat(v_rolegroup_id).concat(',"name":"').concat(rs.getString(2)).concat('","comment":"').concat(rs.getString(3)).concat('","display_role_name":"').concat(rs.getString(2)).concat('","checked":true').concat(',"').concat(i).concat('":').concat(v_node);


while (rs.next()){
	v_node='{'.concat('"id":').concat(rs.getBigInt(4)).concat(',"name":"').concat(rs.getString(5)).concat('","comment":"').concat(rs.getString(6)).concat('","display_role_name":"').concat(rs.getString(7)).concat('","checked":true}');
	c_rolegroup_id=Number(rs.getBigInt(1));
	if(c_rolegroup_id===v_rolegroup_id){
		i=i+1;
		
	}else{
		v_rolegroup_id=Number(rs.getBigInt(1));
		v_tree=v_tree.concat('}');
		v_root=v_root.concat(',"').concat(j).concat('":').concat(v_tree);
		j=j+1;
				
		v_tree='{';
		v_rolegroup_id=Number(rs.getBigInt(1));
		v_tree=v_tree.concat('"id":').concat(v_rolegroup_id).concat(',"name":"').concat(rs.getString(2)).concat('","comment":"').concat(rs.getString(3)).concat('","display_role_name":"').concat(rs.getString(2)).concat('","checked":true');
		i=0;
		
	}
		
	v_tree=v_tree.concat(',"').concat(i).concat('":').concat(v_node);
	
}
v_tree=v_tree.concat('}');
v_root=v_root.concat(',"').concat(j).concat('":').concat(v_tree).concat('}');


rs.close();
pcall.close();
conn.commit();
conn.close();


output.root=JSON.parse(v_root);

$.response.contentType = "application/json; charset=UTF-8";
$.response.setBody(JSON.stringify(output));
$.response.status = $.net.http.OK;