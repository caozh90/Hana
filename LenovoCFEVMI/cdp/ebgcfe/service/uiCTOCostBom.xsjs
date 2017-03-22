var output ={};
/*var json=JSON.parse(decodeURI($.request.body.asString()));

//var tableName = json.tablename;

//var tableName = 'ui_manual_pull';

//var columns = json.columns;

var data = json.data;

var fileName = json.filename;*/



var cycle;
//var product_group;
var model;
var plant;
var subgeo;
var country;

cycle = String($.request.parameters.get("cycle"));
//product_group = $.request.parameters.get("product_group");
model = String($.request.parameters.get("model"));
plant = String($.request.parameters.get("plant"));
subgeo = String($.request.parameters.get("subgeo"));
country = String($.request.parameters.get("country"));

var whereSql="WHERE cycle="+cycle+" AND model="+model;

if(plant!=="'ALL'"){
	whereSql=whereSql+" AND plant="+plant;
}
if(subgeo!=="'ALL'"){
	whereSql=whereSql+" AND subgeo="+subgeo;
}
if(country!=="'ALL'"){
	whereSql=whereSql+" AND country="+country;
}


var sql=
	"SELECT * FROM"+
	"(SELECT CYCLE  AS F_CYCLE, PRODUCT_GROUP  AS F_PRODUCT_GROUP, MODEL  AS F_MODEL, MODEL_TYPE  AS F_MODEL_TYPE, FATHER  AS F_FATHER,"+
	      "PLANT  AS F_PLANT, MODEL_BRAND  AS F_MODEL_BRAND, MODEL_FAMILY  AS F_MODEL_FAMILY, CHILDREN  AS F_CHILDREN, SUBGEO  AS F_SUBGEO,"+
	      "COUNTRY  AS F_COUNTRY, ALTGRUP  AS F_ALTGRUP, LVL  AS F_LVL, COST_LVL  AS F_COST_LVL,  COST_GEO_LVL  AS F_COST_GEO_LVL,"+
	      "COST_TYPE  AS F_COST_TYPE, COST_NAME  AS F_COST_NAME, ALTPRI  AS F_ALTPRI, PATH  AS F_PATH,"+
	     "sum( QTYPER ) AS F_QTYPER, sum( ALTPERCENT ) AS F_ALTPERCENT,sum( M1 ) AS F_M1,sum( M2 ) AS F_M2,sum( M3 ) AS F_M3,sum( M4 ) AS F_M4,"+
	     "sum( M5 ) AS F_M5, sum( M6 ) AS F_M6, sum( M7 ) AS F_M7, sum( M8 ) AS F_M8, sum( M9 ) AS F_M9, sum( M10 ) AS F_M10, sum( M11 ) AS F_M11,"+
	     "sum( M12 ) AS F_M12, sum( LM1 ) AS F_LM1, sum( LM2 ) AS F_LM2, sum( LM3 ) AS F_LM3, sum( LM4 ) AS F_LM4, sum( LM5 ) AS F_LM5, sum( LM6 ) AS F_LM6,"+
	     "sum( LM7 ) AS F_LM7, sum( LM8 ) AS F_LM8, sum( LM9 ) AS F_LM9, sum( LM10 ) AS F_LM10, sum( LM11 ) AS F_LM11, sum( LM12 ) AS F_LM12,"+
	     "sum( WEIGHTED_AVERAGE ) AS F_WEIGHTED_AVERAGE, sum( LATTEST_PROCUR ) AS F_LATTEST_PROCUR, min( ITEM_DESC ) AS F_ITEM_DESC "+
	"FROM \"_SYS_BIC\".\"cdp.ebgcfe.models.ui_cto_costbom/CV_UI_CTO_COSTBOM\" "+whereSql+
	//"where cycle="+String(cycle)+" and product_group="+String(product_group)+" AND model="+String(model)+" and PLANT="+String(plant)+
	" GROUP BY  CYCLE , PRODUCT_GROUP , MODEL , MODEL_TYPE , FATHER , PLANT , MODEL_BRAND , MODEL_FAMILY ,"+
	      "CHILDREN , SUBGEO , COUNTRY , ALTGRUP , LVL , COST_LVL , COST_GEO_LVL , COST_TYPE , COST_NAME , ALTPRI , PATH ) AS F LEFT JOIN"+
	"(SELECT CYCLE ,  PRODUCT_GROUP ,  MODEL ,  MODEL_TYPE ,  FATHER ,  PLANT ,  MODEL_BRAND ,  MODEL_FAMILY , CHILDREN , SUBGEO ,"+
	      "COUNTRY , ALTGRUP , LVL , COST_LVL ,  COST_GEO_LVL ,  COST_TYPE ,  COST_NAME ,  ALTPRI ,  PATH ,"+
	     "sum( QTYPER ) AS QTYPER, sum( ALTPERCENT ) AS ALTPERCENT,sum( M1 ) AS M1,sum( M2 ) AS M2,sum( M3 ) AS M3,sum( M4 ) AS M4,"+
	     "sum( M5 ) AS M5, sum( M6 ) AS M6, sum( M7 ) AS M7, sum( M8 ) AS M8, sum( M9 ) AS M9, sum( M10 ) AS M10, sum( M11 ) AS M11,"+
	     "sum( M12 ) AS M12, sum( LM1 ) AS LM1, sum( LM2 ) AS LM2, sum( LM3 ) AS LM3, sum( LM4 ) AS LM4, sum( LM5 ) AS LM5, sum( LM6 ) AS LM6,"+
	     "sum( LM7 ) AS LM7, sum( LM8 ) AS LM8, sum( LM9 ) AS LM9, sum( LM10 ) AS LM10, sum( LM11 ) AS LM11, sum( LM12 ) AS LM12,"+
	     "sum( WEIGHTED_AVERAGE ) AS WEIGHTED_AVERAGE, sum( LATTEST_PROCUR ) AS LATTEST_PROCUR, min( ITEM_DESC ) AS ITEM_DESC "+
	"FROM \"_SYS_BIC\".\"cdp.ebgcfe.models.ui_cto_costbom/CV_UI_CTO_COSTBOM_CHILDREN\" "+whereSql+
	//"where cycle="+String(cycle)+" and product_group="+String(product_group)+" AND model="+String(model)+" and PLANT="+String(plant)+
	" GROUP BY  CYCLE , PRODUCT_GROUP , MODEL , MODEL_TYPE , FATHER , PLANT , MODEL_BRAND , MODEL_FAMILY ,"+
	      "CHILDREN , SUBGEO , COUNTRY , ALTGRUP , LVL , COST_LVL , COST_GEO_LVL , COST_TYPE , COST_NAME , ALTPRI , PATH ) AS C "+
	"ON F.F_CHILDREN=C.FATHER ORDER BY F_FATHER,F_CHILDREN";

var conn = $.db.getConnection();
var psmt = conn.prepareStatement(sql); 

/*
psmt.setString(1,String(cycle));
psmt.setString(2,String(product_group));
psmt.setString(3,String(model));
psmt.setString(4,String(plant));
psmt.setString(5,String(cycle));
psmt.setString(6,String(product_group));
psmt.setString(7,String(model));
psmt.setString(8,String(plant));*/


psmt.execute();

var rs = psmt.getResultSet();

var v_node,v_plant,v_subgeo,v_country,c_plant,c_subgeo,c_country,c_father;
var v_tree='{';
var v_root='{"name": "root","description": "root description"';
var i,j,k;

i=0; //index for leaves
j=0; //index for trees
k=0; //for all leaves;


//initialization
if(rs.next()){

v_subgeo=String(rs.getString(10));
v_country=String(rs.getString(11));
v_plant=String(rs.getString(6));
c_father=String(rs.getString(53));

v_tree=v_tree.concat('"CYCLE":"').concat(rs.getString(1)).concat('","PRODUCT_GORUP":"').concat(rs.getString(2)).concat('","MODEL":"').concat(rs.getString(3)).concat('","MODEL_TYPE":"').concat(rs.getString(4)).concat('","FATHER":"').concat(rs.getString(5))
		.concat('","PLANT":"').concat(rs.getString(6)).concat('","MODEL_BRAND":"').concat(rs.getString(7)).concat('","MODEL_FAMILY":"').concat(rs.getString(8)).concat('","CHILDREN":"').concat(rs.getString(9)).concat('","SUBGEO":"').concat(rs.getString(10)).concat('","COUNTRY":"').concat(rs.getString(11))
		.concat('","ALTGRUP":"').concat(rs.getString(12)).concat('","LVL":').concat(rs.getInteger(13)).concat(',"COST_LVL":"').concat(rs.getString(14)).concat('","COST_GEO_LVL":"').concat(rs.getString(15)).concat('","COST_TYPE":"').concat(rs.getString(16)).concat('","COST_NAME":"').concat(rs.getString(17))
		.concat('","ALTPRI":"').concat(rs.getString(18)).concat('","PATH":"').concat(rs.getString(19)).concat('","QTYPER":').concat(rs.getDecimal(20)).concat(',"ALTPERCENT":').concat(rs.getDecimal(21)).concat(',"M1":').concat(rs.getDecimal(22)).concat(',"M2":').concat(rs.getDecimal(23))
		.concat(',"M3":').concat(rs.getDecimal(24)).concat(',"M4":').concat(rs.getDecimal(25)).concat(',"M5":').concat(rs.getDecimal(26)).concat(',"M6":').concat(rs.getDecimal(27)).concat(',"M7":').concat(rs.getDecimal(28)).concat(',"M8":').concat(rs.getDecimal(29))
		.concat(',"M9":').concat(rs.getDecimal(30)).concat(',"M10":').concat(rs.getDecimal(31)).concat(',"M11":').concat(rs.getDecimal(32)).concat(',"M12":').concat(rs.getDecimal(33)).concat(',"LM1":').concat(rs.getDecimal(34)).concat(',"LM2":').concat(rs.getDecimal(35))
		.concat(',"LM3":').concat(rs.getDecimal(36)).concat(',"LM4":').concat(rs.getDecimal(37)).concat(',"LM5":').concat(rs.getDecimal(38)).concat(',"LM6":').concat(rs.getDecimal(39)).concat(',"LM7":').concat(rs.getDecimal(40)).concat(',"LM8":').concat(rs.getDecimal(41))
		.concat(',"LM9":').concat(rs.getDecimal(42)).concat(',"lM10":').concat(rs.getDecimal(43)).concat(',"LM11":').concat(rs.getDecimal(44)).concat(',"LM12":').concat(rs.getDecimal(45)).concat(',"WEIGHTED_AVERAGE":').concat(rs.getDecimal(46)).concat(',"LATTEST_PROCUR":').concat(rs.getDecimal(47))
		.concat(',"ITEM_DESC":"').concat(rs.getString(48)).concat('"');

if(c_father !== "null"){
	k=k+1;
	v_node='{'.concat('"CYCLE":"').concat(rs.getString(49)).concat('","PRODUCT_GORUP":"').concat(rs.getString(50)).concat('","MODEL":"').concat(rs.getString(51)).concat('","MODEL_TYPE":"').concat(rs.getString(52)).concat('","FATHER":"').concat(rs.getString(53))
		.concat('","PLANT":"').concat(rs.getString(54)).concat('","MODEL_BRAND":"').concat(rs.getString(55)).concat('","MODEL_FAMILY":"').concat(rs.getString(56)).concat('","CHILDREN":"').concat(rs.getString(57)).concat('","SUBGEO":"').concat(rs.getString(58)).concat('","COUNTRY":"').concat(rs.getString(59))
		.concat('","ALTGRUP":"').concat(rs.getString(60)).concat('","LVL":').concat(rs.getInteger(61)).concat(',"COST_LVL":"').concat(rs.getString(62)).concat('","COST_GEO_LVL":"').concat(rs.getString(63)).concat('","COST_TYPE":"').concat(rs.getString(64)).concat('","COST_NAME":"').concat(rs.getString(65))
		.concat('","ALTPRI":"').concat(rs.getString(66)).concat('","PATH":"').concat(rs.getString(67)).concat('","QTYPER":').concat(rs.getDecimal(68)).concat(',"ALTPERCENT":').concat(rs.getDecimal(69)).concat(',"M1":').concat(rs.getDecimal(70)).concat(',"M2":').concat(rs.getDecimal(71))
		.concat(',"M3":').concat(rs.getDecimal(72)).concat(',"M4":').concat(rs.getDecimal(73)).concat(',"M5":').concat(rs.getDecimal(74)).concat(',"M6":').concat(rs.getDecimal(75)).concat(',"M7":').concat(rs.getDecimal(76)).concat(',"M8":').concat(rs.getDecimal(77))
		.concat(',"M9":').concat(rs.getDecimal(78)).concat(',"M10":').concat(rs.getDecimal(79)).concat(',"M11":').concat(rs.getDecimal(80)).concat(',"M12":').concat(rs.getDecimal(81)).concat(',"LM1":').concat(rs.getDecimal(82)).concat(',"LM2":').concat(rs.getDecimal(83))
		.concat(',"LM3":').concat(rs.getDecimal(84)).concat(',"LM4":').concat(rs.getDecimal(85)).concat(',"LM5":').concat(rs.getDecimal(86)).concat(',"LM6":').concat(rs.getDecimal(87)).concat(',"LM7":').concat(rs.getDecimal(88)).concat(',"LM8":').concat(rs.getDecimal(89))
		.concat(',"LM9":').concat(rs.getDecimal(90)).concat(',"lM10":').concat(rs.getDecimal(91)).concat(',"LM11":').concat(rs.getDecimal(92)).concat(',"LM12":').concat(rs.getDecimal(93)).concat(',"WEIGHTED_AVERAGE":').concat(rs.getDecimal(94)).concat(',"LATTEST_PROCUR":').concat(rs.getDecimal(95))
		.concat(',"ITEM_DESC":"').concat(rs.getString(96)).concat('"}');

	v_tree=v_tree.concat(',"').concat(i).concat('":').concat(v_node);
}

while (rs.next()){
		
	c_father=String(rs.getString(53));	
	c_subgeo=String(rs.getString(10));
	c_country=String(rs.getString(11));
	c_plant=String(rs.getString(6));
	
	if(c_subgeo===v_subgeo & c_country=== v_country & c_plant===v_plant){
		i=i+1;
		
	}else{

		v_tree=v_tree.concat('}');
		v_root=v_root.concat(',"').concat(j).concat('":').concat(v_tree);
		j=j+1;
				
		v_tree='{';
		v_subgeo=String(rs.getString(10));
		v_country=String(rs.getString(11));
		v_plant=String(rs.getString(6));
		
		v_tree=v_tree.concat('"CYCLE":"').concat(rs.getString(1)).concat('","PRODUCT_GORUP":"').concat(rs.getString(2)).concat('","MODEL":"').concat(rs.getString(3)).concat('","MODEL_TYPE":"').concat(rs.getString(4)).concat('","FATHER":"').concat(rs.getString(5))
		.concat('","PLANT":"').concat(rs.getString(6)).concat('","MODEL_BRAND":"').concat(rs.getString(7)).concat('","MODEL_FAMILY":"').concat(rs.getString(8)).concat('","CHILDREN":"').concat(rs.getString(9)).concat('","SUBGEO":"').concat(rs.getString(10)).concat('","COUNTRY":"').concat(rs.getString(11))
		.concat('","ALTGRUP":"').concat(rs.getString(12)).concat('","LVL":').concat(rs.getInteger(13)).concat(',"COST_LVL":').concat(rs.getDecimal(14)).concat(',"COST_GEO_LVL":"').concat(rs.getString(15)).concat('","COST_TYPE":"').concat(rs.getString(16)).concat('","COST_NAME":"').concat(rs.getString(17))
		.concat('","ALTPRI":"').concat(rs.getString(18)).concat('","PATH":"').concat(rs.getString(19)).concat('","QTYPER":').concat(rs.getDecimal(20)).concat(',"ALTPERCENT":').concat(rs.getDecimal(21)).concat(',"M1":').concat(rs.getDecimal(22)).concat(',"M2":').concat(rs.getDecimal(23))
		.concat(',"M3":').concat(rs.getDecimal(24)).concat(',"M4":').concat(rs.getDecimal(25)).concat(',"M5":').concat(rs.getDecimal(26)).concat(',"M6":').concat(rs.getDecimal(27)).concat(',"M7":').concat(rs.getDecimal(28)).concat(',"M8":').concat(rs.getDecimal(29))
		.concat(',"M9":').concat(rs.getDecimal(30)).concat(',"M10":').concat(rs.getDecimal(31)).concat(',"M11":').concat(rs.getDecimal(32)).concat(',"M12":').concat(rs.getDecimal(33)).concat(',"LM1":').concat(rs.getDecimal(34)).concat(',"LM2":').concat(rs.getDecimal(35))
		.concat(',"LM3":').concat(rs.getDecimal(36)).concat(',"LM4":').concat(rs.getDecimal(37)).concat(',"LM5":').concat(rs.getDecimal(38)).concat(',"LM6":').concat(rs.getDecimal(39)).concat(',"LM7":').concat(rs.getDecimal(40)).concat(',"LM8":').concat(rs.getDecimal(41))
		.concat(',"LM9":').concat(rs.getDecimal(42)).concat(',"lM10":').concat(rs.getDecimal(43)).concat(',"LM11":').concat(rs.getDecimal(44)).concat(',"LM12":').concat(rs.getDecimal(45)).concat(',"WEIGHTED_AVERAGE":').concat(rs.getDecimal(46)).concat(',"LATTEST_PROCUR":').concat(rs.getDecimal(47))
		.concat(',"ITEM_DESC":"').concat(rs.getString(48)).concat('"');
		i=0;
		
	}
	
	if(c_father !== "null"){
	k=k+1;
	v_node='{'.concat('"CYCLE":"').concat(rs.getString(49)).concat('","PRODUCT_GORUP":"').concat(rs.getString(50)).concat('","MODEL":"').concat(rs.getString(51)).concat('","MODEL_TYPE":"').concat(rs.getString(52)).concat('","FATHER":"').concat(rs.getString(53))
			.concat('","PLANT":"').concat(rs.getString(54)).concat('","MODEL_BRAND":"').concat(rs.getString(55)).concat('","MODEL_FAMILY":"').concat(rs.getString(56)).concat('","CHILDREN":"').concat(rs.getString(57)).concat('","SUBGEO":"').concat(rs.getString(58)).concat('","COUNTRY":"').concat(rs.getString(59))
			.concat('","ALTGRUP":"').concat(rs.getString(60)).concat('","LVL":').concat(rs.getInteger(61)).concat(',"COST_LVL":').concat(rs.getDecimal(62)).concat(',"COST_GEO_LVL":"').concat(rs.getString(63)).concat('","COST_TYPE":"').concat(rs.getString(64)).concat('","COST_NAME":"').concat(rs.getString(65))
			.concat('","ALTPRI":"').concat(rs.getString(66)).concat('","PATH":"').concat(rs.getString(67)).concat('","QTYPER":').concat(rs.getDecimal(68)).concat(',"ALTPERCENT":').concat(rs.getDecimal(69)).concat(',"M1":').concat(rs.getDecimal(70)).concat(',"M2":').concat(rs.getDecimal(71))
			.concat(',"M3":').concat(rs.getDecimal(72)).concat(',"M4":').concat(rs.getDecimal(73)).concat(',"M5":').concat(rs.getDecimal(74)).concat(',"M6":').concat(rs.getDecimal(75)).concat(',"M7":').concat(rs.getDecimal(76)).concat(',"M8":').concat(rs.getDecimal(77))
			.concat(',"M9":').concat(rs.getDecimal(78)).concat(',"M10":').concat(rs.getDecimal(79)).concat(',"M11":').concat(rs.getDecimal(80)).concat(',"M12":').concat(rs.getDecimal(81)).concat(',"LM1":').concat(rs.getDecimal(82)).concat(',"LM2":').concat(rs.getDecimal(83))
			.concat(',"LM3":').concat(rs.getDecimal(84)).concat(',"LM4":').concat(rs.getDecimal(85)).concat(',"LM5":').concat(rs.getDecimal(86)).concat(',"LM6":').concat(rs.getDecimal(87)).concat(',"LM7":').concat(rs.getDecimal(88)).concat(',"LM8":').concat(rs.getDecimal(89))
			.concat(',"LM9":').concat(rs.getDecimal(90)).concat(',"lM10":').concat(rs.getDecimal(91)).concat(',"LM11":').concat(rs.getDecimal(92)).concat(',"LM12":').concat(rs.getDecimal(93)).concat(',"WEIGHTED_AVERAGE":').concat(rs.getDecimal(94)).concat(',"LATTEST_PROCUR":').concat(rs.getDecimal(95))
			.concat(',"ITEM_DESC":"').concat(rs.getString(96)).concat('"}');
		
	v_tree=v_tree.concat(',"').concat(i).concat('":').concat(v_node);
	
	}
	
}

v_tree=v_tree.concat('}');
v_root=v_root.concat(',"').concat(j).concat('":').concat(v_tree).concat(',"count":').concat(k+j+1).concat('}');

}else{
	v_root=v_root.concat(',"count":').concat(k+j).concat('}');
}

rs.close();
psmt.close();
conn.commit();
conn.close();

//output.root=JSON.parse(v_root);
//output.root=eval('(' + v_root + ')');
v_root='{"root":'+v_root+'}';

$.response.contentType = "application/json; charset=UTF-8";
//$.response.setBody(JSON.stringify(output));
$.response.setBody( v_root );
$.response.status = $.net.http.OK;