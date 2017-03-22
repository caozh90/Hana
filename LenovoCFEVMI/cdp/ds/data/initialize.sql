/*

 SET schema "DS_INFO";
1."DS_JOB_INFO";
2."DS_JOB_RUN_INFO";
3."DS_3PL_CONF";
4."DS_FTP_INFO";
5."DS_INFO"."DS_XML_PROCESS_INFO";
6."DS_INFO"."DS_JOB_STEP_INFO";

*/
 
 SET schema "DS_INFO";
Drop TABLE "DS_JOB_INFO";
create column table "DS_JOB_INFO"( "JOBNAME" VARCHAR (25) null,
                "JOBRUNID" VARCHAR (10) not null,
                "DSSERVER" VARCHAR (25) null,
                "BUSINESSMODULE" VARCHAR (25) null,
                "JOBSTATUS" VARCHAR (10) null,
                "LASTTIMESTAMP" TIMESTAMP null,
                "CURTIMESTAMP" TIMESTAMP null,
                "STARTTIME" TIMESTAMP null,
                "ENDTIME" TIMESTAMP null,
                primary key ("JOBRUNID") ) 
;
comment on column "DS_JOB_INFO"."JOBNAME" is 'Data Services 作业名' 
;
comment on column "DS_JOB_INFO"."JOBRUNID" is '最近一次作业的运行ID' 
;
comment on column "DS_JOB_INFO"."DSSERVER" is '最近运行作业的Data Services 服务器名 ' 
;
comment on column "DS_JOB_INFO"."BUSINESSMODULE" is '最近运行作业的业务模块' 
;
comment on column "DS_JOB_INFO"."JOBSTATUS" is '最近作业的状态（RUNNING, ERROR, FINISHED)' 
;
comment on column "DS_JOB_INFO"."LASTTIMESTAMP" is '上一次同步的时间' 
;
comment on column "DS_JOB_INFO"."CURTIMESTAMP" is '本次同步的最大时间' 
;
comment on column "DS_JOB_INFO"."STARTTIME" is '最近作业启动时间' 
;
comment on column "DS_JOB_INFO"."ENDTIME" is '最近作业结束时间'
;
set schema DS_INFO;
Drop TABLE "DS_JOB_RUN_INFO";
create column table "DS_JOB_RUN_INFO"( "SEQUENCEID" INTEGER not null default -1,
                "USERNAME" VARCHAR(50) not null default 'SYSTEM',
                "CURRENTSTEP" VARCHAR (100) null,
                "JOBSTATUS" VARCHAR (10) null,
                "JOBRUNID" VARCHAR (20) not null,
                "JOBNAME" VARCHAR (50) null,
                "LOADINGMODE" VARCHAR (10) null,
                "DSSERVER" VARCHAR (25) null,
                "BUSINESSMODULE" VARCHAR (25) null,
                "STARTTIME" TIMESTAMP null,
                "ENDTIME" TIMESTAMP null,
                "ERRORINFO" VARCHAR (1000) null,
                primary key ("JOBRUNID") ) 
;
comment on column "DS_JOB_RUN_INFO"."SEQUENCEID" is '能唯一标示某次运行的ID （来自HANA端）' 
;
comment on column "DS_JOB_RUN_INFO"."USERNAME" is '运行作业的用户名 （来自HANA端）' 
;
comment on column "DS_JOB_RUN_INFO"."CURRENTSTEP" is '当前运行步骤的描述' 
;
comment on column "DS_JOB_RUN_INFO"."JOBSTATUS" is '当前作业的状态（RUNNING, ERROR, FINISHED)' 
;
comment on column "DS_JOB_RUN_INFO"."JOBRUNID" is 'Data Services 唯一标示一个Job运行的ID' 
;
comment on column "DS_JOB_RUN_INFO"."JOBNAME" is 'Data Services 作业名' 
;
comment on column "DS_JOB_RUN_INFO"."LOADINGMODE" is '增量装载或者初始化装载'
;
comment on column "DS_JOB_RUN_INFO"."DSSERVER" is '运行作业的Data Services 服务器名 ' 
;
comment on column "DS_JOB_RUN_INFO"."BUSINESSMODULE" is '业务模块' 
;
comment on column "DS_JOB_RUN_INFO"."STARTTIME" is '作业启动时间' 
;
comment on column "DS_JOB_RUN_INFO"."ENDTIME" is '作业结束时间' 
;
comment on column "DS_JOB_RUN_INFO"."ERRORINFO" is '出错信息，正常情况为空：“异常种类 异常编号 异常时间 异常上下文 异常消息”' 
;
DROP TABLE "DS_3PL_CONF";
CREATE COLUMN TABLE "DS_3PL_CONF" (
"PROCESS_NAME" VARCHAR(100),
"3PLID" VARCHAR(50),
     "XML_LOCALPATH" VARCHAR(100),
                "XML_DOWNLOADPATH" VARCHAR(100),
                "XML_ARCHIVEPATH" VARCHAR(100),
                "XML_ERRARCHIVEPATH" VARCHAR(100),
                "XML_FN_WITHWILDCARD" VARCHAR(25),        
                 PRIMARY KEY ("PROCESS_NAME", "3PLID")) UNLOAD PRIORITY 5 AUTO MERGE;

COMMENT ON COLUMN "DS_3PL_CONF"."PROCESS_NAME" is '流程名'
;
COMMENT ON COLUMN "DS_3PL_CONF"."3PLID" is '3PL ID'
;
COMMENT ON COLUMN "DS_3PL_CONF"."XML_LOCALPATH" is '本地存放从FTP上下载的XML文件的路径'
;
COMMENT ON COLUMN "DS_3PL_CONF"."XML_DOWNLOADPATH" is 'XML文件下载的路径'
;
COMMENT ON COLUMN "DS_3PL_CONF"."XML_ARCHIVEPATH" is 'XML文件归档路径'
;
COMMENT ON COLUMN "DS_3PL_CONF"."XML_ERRARCHIVEPATH" is 'XML文件出错归档路径'
;
COMMENT ON COLUMN "DS_3PL_CONF"."XML_FN_WITHWILDCARD" is 'XML文件名通配符'
;

DROP TABLE "DS_FTP_INFO";
create column table "DS_FTP_INFO"( "FTP_SERVER" VARCHAR (25) not null,
                "FTP_USER" VARCHAR (25) null,
                "FTP_PASSWORD" VARCHAR (25) null,
                primary key ("FTP_SERVER") );
                
insert into "DS_FTP_INFO" values('10.101.6.134','ck','Sap12345');
DROP TABLE "DS_INFO"."DS_XML_PROCESS_INFO";
CREATE COLUMN TABLE "DS_INFO"."DS_XML_PROCESS_INFO" (
     "JOB_RUN_ID" VARCHAR(10) NOT NULL ,
                "SRC_XML_FILENAME" VARCHAR(100) NOT NULL ,
                "ERROR_CONTEXT" VARCHAR(500),
                "ERROR_MSG" VARCHAR(500),
                "ERROR_TYPE" VARCHAR(50),
                "RESULT" VARCHAR(10),
                "PROCESS_TIME" LONGDATE CS_LONGDATE) UNLOAD PRIORITY 5 AUTO MERGE 
                
DROP TABLE "DS_INFO"."DS_JOB_STEP_INFO";
create column table "DS_INFO"."DS_JOB_STEP_INFO"( "JOBRUNID" VARCHAR (10) null,
                "STEP" VARCHAR (100) null,
                "STATUS" VARCHAR (25) null,
                "STARTTIME" TIMESTAMP null,
                "ENDTIME" TIMESTAMP null) 
;
comment on column "DS_INFO"."DS_JOB_STEP_INFO"."JOBRUNID" is 'JOB Run ID' 
;
comment on column "DS_INFO"."DS_JOB_STEP_INFO"."STATUS" is 'Step status' 
;
comment on column "DS_INFO"."DS_JOB_STEP_INFO"."STEP" is 'Step Description' 
;
comment on column "DS_INFO"."DS_JOB_STEP_INFO"."STARTTIME" is 'Step Start Time' 
;
comment on column "DS_INFO"."DS_JOB_STEP_INFO"."ENDTIME" is 'Step End Time'

