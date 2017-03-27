CALL "SECURITY"."cdp.security.procedures::createModule"(
		'CFE','cdp.cfe','CFE :Cost Forecast Estimation ');

/*
--添加module 之后，可以通过下面的sql ，查阅是否添加成功，
--同时		
select * from "EX_LOG"."cdp.log.data::Logs.TRANSACTION_LOG_FILE"
;--where logsid=251;

SELECT ROLE_ID  FROM "SYS"."ROLES" WHERE "ROLE_NAME" = 'cdp.cfe.roles::PUBLIC';

select * from "SECURITY"."cdp.security.data::userManagement.INFO_MODULE"
;
select * from "SECURITY"."cdp.security.data::userManagement.INFO_ROLE"
;
select * from "SECURITY"."cdp.security.data::userManagement.INFO_GROUP"
;
select * from "SECURITY"."cdp.security.data::userManagement.INFO_ROLEGROUP"
;
select * from "SECURITY"."cdp.security.data::userManagement.MAP_ROLEGROUP_ROLE"
;

*/		

call  "SECURITY"."cdp.security.procedures::createInfoUser"(
			'USERNAME', 
	         'Passwd1234567',
             'loginName',
             'firstName',
             'lastName',
             'emailAddress',
             'status' ,
             'LOCALE' ,
             'DESIGNATION'
             ,'VMI'
);

--添加module 之后，可以通过下面的sql ，查阅是否添加成功，
--同时		
select * from users where user_name = 'USERNAME'
;
select * from "EX_LOG"."cdp.log.data::Logs.TRANSACTION_LOG_FILE"
;--where logsid=251;

select * from "SECURITY"."cdp.security.data::userManagement.INFO_USER"
;
select * from "SECURITY"."cdp.security.data::userManagement.MAP_MODULE_USER"
;
select * from "SECURITY"."cdp.security.data::userManagement.MAP_GROUP_USER"
;

/*
彻底清除用户。
call "SECURITY"."cdp.security.procedures::dropUser"(3333userid);


select * from users where user_id =<userid>;
select * from "EX_LOG"."cdp.log.data::Logs.TRANSACTION_LOG_FILE"
;--where logsid=251;

select * from "SECURITY"."cdp.security.data::userManagement.INFO_USER"
;
select * from "SECURITY"."cdp.security.data::userManagement.MAP_MODULE_USER"
;
select * from "SECURITY"."cdp.security.data::userManagement.MAP_GROUP_USER"
;

		
*/
select * from "SECURITY"."cdp.security.data::userManagement.INFO_GROUP";
;
/*
call "SECURITY"."cdp.security.procedures::createInfoGroup" (
in	aGROUP_ID BIGINT, 
in  aMODULE_ID NVARCHAR(10),      
in	aGROUP_NAME NVARCHAR(200),
in  aCOMMENT NVARCHAR(200),     	
in  aMODULE_NAME NVARCHAR(200)
,OUT errorInfo "SECURITY"."cdp.security.data::userManagement.HttpError"
*/

call "SECURITY"."cdp.security.procedures::deleteInfoGroup" (
'aGROUP_NAME NVARCHAR(200)',
    'aMODULE_NAME NVARCHAR(200)'
,?            );

select * from "SECURITY"."cdp.security.data::userManagement.INFO_GROUP";
;

select * from "EX_LOG"."cdp.log.data::Logs.TRANSACTION_LOG_FILE";


/*
MAP GROUP USER

CALL "SECURITY"."cdp.security.procedures::createMapGroupUser" ( 
	IN	aMODULE_ID NVARCHAR(10)	
    ,IN	aGROUP_ID BIGINT	--//usergroup id
    ,IN	aUSER_ID BIGINT  	--//USER ID
	,OUT errorInfo "SECURITY"."cdp.security.data::userManagement.HttpError"
) 
*/

/*
删除用户组 
*/
select * from "SECURITY"."cdp.security.data::userManagement.MAP_GROUP_USER";
;
CALL "SECURITY"."cdp.security.procedures::deleteMapGroupUser" ( 
'1000000019'
,?);
--ID

select * from "SECURITY"."cdp.security.data::userManagement.MAP_GROUP_USER";
;
select * from "EX_LOG"."cdp.log.data::Logs.TRANSACTION_LOG_FILE";






/*

初始化role

call "SECURITY"."cdp.security.procedures::createInfoRole"(
 293721, '1000000001',      
 'control role005',
 'comment006','CFE',?);


*/


/*
添加新的role group 
CALL "SECURITY"."cdp.security.procedures::createInfoRoleGroup" (
'ROLEGROUP004',
'COMMENT ROLEGROUP004 ',     	
'CFE',?);
*/

/*
添加一个权限组合和一个权限的对应
call  "SECURITY"."cdp.security.procedures::createMapRoleGroup" ( 
'CFE'
,'1000000012'
,293721
,?
); 
*/


/*
测试使用数据 mapp_all

insert into "SECURITY"."cdp.security.data::userManagement.MAP_ALL"
	    ("ID" ,"MODULE_ID","GROUP_ID","USER_ID","ROLEGROUP_ID","ROLE_ID")
	    values("SECURITY"."cdp.security.data::mapAllSeqId".NEXTVAL
	    	,'1000000001' ,'1000000001',421774, '1000000009',293717);

insert into "SECURITY"."cdp.security.data::userManagement.MAP_ALL"
	    ("ID" ,"MODULE_ID","GROUP_ID","USER_ID","ROLEGROUP_ID","ROLE_ID")
	    values("SECURITY"."cdp.security.data::mapAllSeqId".NEXTVAL
	    	,'1000000001' ,'1000000001',421774, '1000000009',293718);
insert into "SECURITY"."cdp.security.data::userManagement.MAP_ALL"
	    ("ID" ,"MODULE_ID","GROUP_ID","USER_ID","ROLEGROUP_ID","ROLE_ID")
	    values("SECURITY"."cdp.security.data::mapAllSeqId".NEXTVAL
	    	,'1000000001' ,'1000000001',421774, '1000000010',293718);
insert into "SECURITY"."cdp.security.data::userManagement.MAP_ALL"
	    ("ID" ,"MODULE_ID","GROUP_ID","USER_ID","ROLEGROUP_ID","ROLE_ID")
	    values("SECURITY"."cdp.security.data::mapAllSeqId".NEXTVAL
	    	,'1000000001' ,'1000000001',421774, '1000000010',293719);
	    	
insert into "SECURITY"."cdp.security.data::userManagement.MAP_ALL"
	    ("ID" ,"MODULE_ID","GROUP_ID","USER_ID","ROLEGROUP_ID","ROLE_ID")
	    values("SECURITY"."cdp.security.data::mapAllSeqId".NEXTVAL
	    	,'1000000001' ,'1000000001',421776, '1000000009',293717);


insert into "SECURITY"."cdp.security.data::userManagement.MAP_ALL"
	    ("ID" ,"MODULE_ID","GROUP_ID","USER_ID","ROLEGROUP_ID","ROLE_ID")
	    values("SECURITY"."cdp.security.data::mapAllSeqId".NEXTVAL
	    	,'1000000001' ,'1000000001',421776, '1000000012',293720);
insert into "SECURITY"."cdp.security.data::userManagement.MAP_ALL"
	    ("ID" ,"MODULE_ID","GROUP_ID","USER_ID","ROLEGROUP_ID","ROLE_ID")
	    values("SECURITY"."cdp.security.data::mapAllSeqId".NEXTVAL
	    	,'1000000001' ,'1000000001',421776, '1000000012',293721);

*/

/*
--SELECT * FROM "SECURITY"."cdp.security.data::userManagement.INFO_ROLE";
SELECT * FROM "SECURITY"."cdp.security.data::userManagement.INFO_MODULE";

//添加  view role　的对应关系　信息

CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
	'CFE'
	,'ABC'
	,'control role'
	,?);
	
	*/

	
	/*
初始化 resource_type

	insert into "SECURITY"."cdp.security.data::userManagement.INFO_RESOURCE_TYPE"
("RESOURCE_TYPE_ID", "RESOURCE_TYPE", "COMMENT"  )
			values("SECURITY"."cdp.security.data::infoResourceTypeSeqId".NEXTVAL, 'Log Module','fill in Module Name :VMI/CFE etc.'  );
	*/
