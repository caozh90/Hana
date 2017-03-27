--可以创建 非 read-only procedure
ALTER SYSTEM ALTER CONFIGURATION ('indexserver.ini', 'SYSTEM') SET ('repository','sqlscript_mode') = 'UNSECURE'
WITH RECONFIGURE; 

--打开XSENGINE debug
ALTER SYSTEM ALTER CONFIGURATION ('xsengine.ini', 'SYSTEM') SET ('httpserver','developer_mode') = 'true'
WITH RECONFIGURE; 

ALTER SYSTEM ALTER CONFIGURATION ('xsengine.ini', 'SYSTEM') SET ('debugger','enabled') = 'true'
WITH RECONFIGURE; 

--example : call "SYSTEM"."cdp.utility.procedures::createUser"('<UserName>','Password12345')
--建立新的用户，并且进行开发
--或者给自己现有的用户，分配角色

--call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::DevelopmentRole','<用户名称>')

--call "SYSTEM"."cdp.utility.procedures::createUser"('<UserName>','Password12345')

--按字母顺序
 
call "SYSTEM"."cdp.utility.procedures::createUser"('sap_ChengKuang','Password12345'); 
call "SYSTEM"."cdp.utility.procedures::createUser"('sap_FangYuan','Password12345'); 
call "SYSTEM"."cdp.utility.procedures::createUser"('sap_GaiGavin','Password12345');
call "SYSTEM"."cdp.utility.procedures::createUser"('sap_MiaoMaggie','Password12345');
call "SYSTEM"."cdp.utility.procedures::createUser"('sap_LiuCaiZhong','Password12345');
call "SYSTEM"."cdp.utility.procedures::createUser"('sap_LiuCarina','Password12345');
call "SYSTEM"."cdp.utility.procedures::createUser"('sap_LiuGang','Password12345');
call "SYSTEM"."cdp.utility.procedures::createUser"('sap_LingLeonard','Password12345');
call "SYSTEM"."cdp.utility.procedures::createUser"('sap_LinLeo','Password12345');
call "SYSTEM"."cdp.utility.procedures::createUser"('sap_SeanMa','Password12345');
call "SYSTEM"."cdp.utility.procedures::createUser"('sap_ShangQian','Password12345');
call "SYSTEM"."cdp.utility.procedures::createUser"('sap_YanRobin','Password12345');
call "SYSTEM"."cdp.utility.procedures::createUser"('sap_ZhangCoral','Password12345'); 
call "SYSTEM"."cdp.utility.procedures::createUser"('sap_ZhangRuiXue','Password12345');
call "SYSTEM"."cdp.utility.procedures::createUser"('sap_ZhouEric','Password12345');
call "SYSTEM"."cdp.utility.procedures::createUser"('sap_ZhouWenjun','Password12345');

--2014-12-1
call "SYSTEM"."cdp.utility.procedures::createUser"('sap_LongMichael','Password12345');



--按字母顺序
--log  Eric,FangYuan,ShangQian
--security FangYuan ,Leo 
--common : Eric
--srvcfe :sap_LingLeonard\sap_ShangQian\
--mxsvrvmi :Eric \FangYuan\sap_ShangQian\
--pcdw :sap_GaiGavin
--ui: \sap_MiaoMaggie\sap_LiuCarina\sap_YanRobin\sap_ZhangCoral\sap_ZhangRuiXue
--DevAdmin :Eric\FangYuan\sap_LiuGang\sap_LinLeo\sap_ZhouWenjun
--DevDS :ChengKuang
--DevlopmentRole :sap_SeanMa

 call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::DSDev','SAP_CHENGKUANG');
 call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::DSDev','SAP_LONGMICHAEL');
  
 call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::AdminDev','SAP_FANGYUAN');
 
 call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::pcdwDev','SAP_GAIGAVIN');
 call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::uiDev','SAP_MIAOMAGGIE');
 call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::uiDev','SAP_LIUCAIZHONG');
 call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::uiDev','SAP_LIUCARINA');
 call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::AdminDev','SAP_LIUGANG');
 call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::ebgcfeDev','SAP_LINGLEONARD');
 call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::AdminDev','SAP_LINLEO');
 call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::DevelopmentRole','SAP_SEANMA');
 call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::ebgcfeDev','SAP_SHANGQIAN');
 call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::mxebgvmiDev','SAP_SHANGQIAN');
  
 call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::uiDev','SAP_YANROBIN');
 call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::uiDev','SAP_ZHANGCORAL');
 call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::uiDev','SAP_ZHANGRUIXUE');
 call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::AdminDev','SAP_ZHOUERIC');
 call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::AdminDev','SAP_ZHOUWENJUN');

-- call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::DevelopmentRole','SAP')
--BK
--call "SYSTEM"."cdp.utility.procedures::createUser"('IT_ZHANGCHAO16','Password12345'); 
-- call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::DevelopmentRole','IT_ZHANGCHAO16');

--2014-12-2
 call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::ebgcfeDev','SAP_GAIGAVIN');
  call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::mxebgvmiDev','SAP_GAIGAVIN');
   call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::pcdwDev','SAP_LINGLEONARD');

--iT   
 --  call "SYSTEM"."cdp.utility.procedures::createUser"('WANGKAN1','Password12345'); 
 --     call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::Basis','WANGKAN1');


--2014-12-3
call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::commonDev','SAP_GAIGAVIN');

--2014-12-4
call "SYSTEM"."cdp.utility.procedures::createUser"('PI_TO_PCDW ','Password12345'); 
call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::pcdwPI','PI_TO_PCDW');

--2014-12-5
call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::mxebgvmiDev','SAP_LIUCAIZHONG');
call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::mxebgvmiDev','SAP_LINGLEONARD');


--2014-12-25
--call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::DevelopmentPCDW','ZHAISH1');
--call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::DevelopmentPCDW','QINYING4');
--call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::DevelopmentPCDW','ZHANGQW5');


call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::DSDev','SAP_LINGLEONARD');

--2015-1-6
call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::DSDev','SAP_GAIGAVIN');

call "SYSTEM"."cdp.utility.procedures::createUser"('sap_FANNAIRU','Password12345');
call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::ebgcfeDev','SAP_FANNAIRU');
call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::pcdwDev','SAP_FANNAIRU');
call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::mxebgvmiDev','SAP_FANNAIRU');
call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::DSDev','SAP_FANNAIRU');

--2015-1-7
call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::DSDev','SAP_LIUCAIZHONG');


--2015-1-12
--2014-12-25

call "SYSTEM"."cdp.utility.procedures::createUser"('ZHANGQW5','Password12345');
call "SYSTEM"."cdp.utility.procedures::createUser"('QINYING4','Password12345');
call "SYSTEM"."cdp.utility.procedures::createUser"('ZHANGCHAO16','Password12345'); 
call "SYSTEM"."cdp.utility.procedures::createUser"('LIUYG5','Password12345'); 
call "SYSTEM"."cdp.utility.procedures::createUser"('TIANYANG1','Password12345'); 
call "SYSTEM"."cdp.utility.procedures::createUser"('WEIBN1','Password12345'); 

call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::DevelopmentIT','ZHANGCHAO16');
call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::DevelopmentIT','ZHAISH1');
call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::DevelopmentIT','QINYING4');
call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::DevelopmentIT','ZHANGQW5');
call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::DevelopmentIT','LIUYG5');
call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::DevelopmentIT','TIANYANG1');

--2015-1-13
call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::DSDev','SAP_SHANGQIAN');


--2015-01-19
--Baiying,  wangzs2,  yangyue6,   zengjian3,   lidm1
call "SYSTEM"."cdp.utility.procedures::createUser"('BAIYING','Password12345');
call "SYSTEM"."cdp.utility.procedures::createUser"('WANGZS2','Password12345'); 
call "SYSTEM"."cdp.utility.procedures::createUser"('YANGYUE6','Password12345'); 
call "SYSTEM"."cdp.utility.procedures::createUser"('ZENGJIAN3','Password12345'); 
call "SYSTEM"."cdp.utility.procedures::createUser"('LIDM1','Password12345'); 

call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::mxebgvmiDev','BAIYING');
call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::mxebgvmiDev','WANGZS2');
call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::mxebgvmiDev','YANGYUE6');
call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::mxebgvmiDev','ZENGJIAN3');
call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::mxebgvmiDev','LIDM1');


call "SYSTEM"."cdp.utility.procedures::createUser"('GUOJL1','Password12345'); 
call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::ebgcfeFunc','GUOJL1');


--2015-1-20
call "SYSTEM"."cdp.utility.procedures::createUser"('WUQI2','Password12345'); 

call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::DevelopmentIT','WUQI2');

call "SYSTEM"."cdp.utility.procedures::createUser"('HVTREAD','Password12345'); 

call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::DevelopmentRead','HVTREAD');


 call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::AdminDev','SAP_SHANGQIAN');
 
 --2015-1-21
call "SYSTEM"."cdp.utility.procedures::createUser"('ZHENGYL6','Password12345'); 
call "SYSTEM"."cdp.utility.procedures::createUser"('LIUYG5','Password12345'); 
call "SYSTEM"."cdp.utility.procedures::createUser"('WEIBN1','Password12345'); 
call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::ebgcfeFunc','ZHENGYL6');
call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::ebgcfeFunc','LIUYG5');
call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::ebgcfeFunc','WEIBN1');
  
 --2015-1-22
 call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::ebgcfeFunc','BAIYING');
call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::ebgcfeFunc','WANGZS2');
call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::ebgcfeFunc','YANGYUE6');
call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::ebgcfeFunc','ZENGJIAN3');
call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::ebgcfeFunc','LIDM1');

call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::pcdwPI','BAIYING');
call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::pcdwPI','WANGZS2');
call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::pcdwPI','YANGYUE6');
call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::pcdwPI','ZENGJIAN3');
call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::pcdwPI','LIDM1');
  
 --2015-1-23
 call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::testDev','WANGLI5');
  call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::testDev','WEIBN1');

  --2015-1-26
  call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::pcdwPI','WEIBN1');
  call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::SAPIDEDebug','SAP_GAIGAVIN');

  
  --2015-2-6
  call "SYSTEM"."cdp.utility.procedures::createUser"('WUHXA','Sap12345');
  call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::mxebgvmiFunc','WUHXA');
  call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::pcdwPI','WUHXA');
  
  --2015-2-25
   call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::DevelopmentBaseMXEBGVMI','MENHP1');
     call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::DevelopmentBaseEBGCFE','MENHP1');
    call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::DevelopmentPCDW','MENHP1');
     call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::DevelopmentIT','MENHP1');

--2015-3-3
     call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.ds.roles::Base','ZHANGQW5');
     call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::DevelopmentPCDW','ZHANGQW5');
     call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::ebgcfeFunc','ZHANGQW5');
     call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.utility.roles::mxebgvmiFunc','ZHANGQW5');
