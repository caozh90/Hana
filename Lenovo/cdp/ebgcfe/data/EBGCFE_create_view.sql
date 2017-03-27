--------------------------------------------------------------------------------------------
--                                        VERSION 1 (Standard Hierarchy View)
--------------------------------------------------------------------------------------------
SET SCHEMA EBGCFE;
CREATE COLUMN VIEW "EBGCFE".h_view_pcdw_bom TYPE HIERARCHY
  AS SELECT name||'##'||werks as pred, idnrk||'##'||werks as succ FROM z_pcdw_bom 
        where product_group = '$$v_product_group$$' 
          and status = 'ACTIVE' and item_type_f not in ('SBB','OPTION','VISUAL')
  WITH PARAMETERS ( 'hierarchyDefinition' = '{ 
    "parameters":[ { "name":"v_product_group", "type":"VARCHAR(20)"}],
    "extendedViewAttributes":true
  }' );

CREATE COLUMN VIEW "EBGCFE".h_view_pcdw_bom_2 TYPE HIERARCHY
  AS SELECT name||'##'||werks||'##'||product_group as pred, idnrk||'##'||werks||'##'||product_group as succ FROM z_pcdw_bom
          where status = 'ACTIVE'WITH PARAMETERS ( 'hierarchyDefinition' = '{ 
    "extendedViewAttributes":true
  }' );


CREATE COLUMN VIEW "EBGCFE".h_view_mid_phantom_part TYPE HIERARCHY
  AS SELECT a.plant||'##'||a.model||'##'||a.bom_lvl||'##'||a.children||'##'||a.product_group||'##'||a.qtyper||'##'||a.altpercent||'##'||a.RID as pred, 
        a.plant||'##'||a.model||'##'||a.bom_lvl||'##'||a.father||'##'||a.product_group||'##'||b.qtyper||'##'||b.altpercent||'##'||b.RID as succ FROM mid_phantom_part a 
  left join mid_phantom_part b on a.father = b.children WITH PARAMETERS ( 'hierarchyDefinition' = '{ 
    "extendedViewAttributes":true
  }' );

--------------------------------------------------------------------------------------------
--                                        VERSION 2 (Custom Hierarchy View)
--------------------------------------------------------------------------------------------
SET SCHEMA EBGCFE;
CREATE TYPE pred_succ_bom_tt AS TABLE ( pred CHAR(24), succ CHAR(24) );

CREATE PROCEDURE "EBGCFE"."cdp.ebgcfe.procedures.pkg_bom_calculation::PRC_HV_PCDW_BOM" (
    IN  rootNode VARCHAR(24),
    IN  product_group VARCHAR(20),
    OUT pred_succ_out "EBGCFE"."PRED_SUCC_BOM_TT"
 )  
	LANGUAGE SQLSCRIPT
	SQL SECURITY INVOKER 
	DEFAULT SCHEMA "EBGCFE"
	READS SQL DATA 	WITH RESULT VIEW "EBGCFE"."PRC_HV_PCDW_BOMV" 
	AS
    num_nodes INTEGER := 0;	
BEGIN
    -- add root node to result set
    pred_succ_out = SELECT null AS pred, :rootNode AS succ FROM dummy;     

    -- get direct children of the root node
    level_data = SELECT name||'##'||werks AS pred, idnrk||'##'||werks AS succ FROM z_pcdw_bom 
                 WHERE name||'##'||werks = :rootNode AND product_group = :product_group 
                   AND status = 'ACTIVE' AND item_type_f NOT IN ('SBB', 'OPTION', 'VISUAL');

    SELECT count(succ) INTO num_nodes FROM :level_data; 
    -- recursive call to find all hierarchy nodes
    WHILE :num_nodes > 0 DO
        -- combine child nodes into result set
        pred_succ_out = SELECT * FROM :pred_succ_out UNION ALL SELECT * FROM :level_data; 

        -- get next level children
        level_data = SELECT name||'##'||werks AS pred, idnrk||'##'||werks AS succ FROM z_pcdw_bom
                     WHERE name||'##'||werks IN ( SELECT succ FROM :level_data)
                       AND product_group = :product_group 
                       AND status = 'ACTIVE' AND item_type_f NOT IN ('SBB', 'OPTION', 'VISUAL');                    

        SELECT count(*) INTO num_nodes FROM :level_data;

    END WHILE;

END;

CREATE COLUMN VIEW HV_PCDW_BOM TYPE hierarchy 
    AS SELECT pred,succ FROM PRC_HV_PCDW_BOMV( 
        placeholder."$$rootnode$$" => '$$ROOT$$',
        placeholder."$$product_group$$" => '$$PRODUCT_GROUP$$')
    WITH PARAMETERS ( 'hierarchyDefinition' = '{
        "parameters":[ { "name":"ROOT", "type":"VARCHAR(24)" }, { "name":"PRODUCT_GROUP", "type":"VARCHAR(20)" } ], "extendedViewAttributes":true
    }');

	
CREATE PROCEDURE "EBGCFE"."cdp.ebgcfe.procedures.pkg_bom_calculation::PRC_SEL_HV_PCDW_BOM" ( 
  IN  rootnode VARCHAR(24),
  IN  product_group VARCHAR(20),
  OUT pcdw_bom EBGCFE.HV_PCDW_BOM
 ) 
	LANGUAGE SQLSCRIPT
	SQL SECURITY INVOKER 
	DEFAULT SCHEMA "EBGCFE"
	READS SQL DATA 
	AS
BEGIN 
	pcdw_bom = select * from HV_PCDW_BOM(placeholder."ROOT"=>:rootnode,  placeholder."PRODUCT_GROUP"=>:product_group );                    
END;

--------------------------------------------------------------------------------------------
SET SCHEMA EBGCFE;
CREATE TYPE pred_succ_bom_2_tt AS TABLE ( pred CHAR(44), succ CHAR(44) );

CREATE PROCEDURE "EBGCFE"."cdp.ebgcfe.procedures.pkg_bom_calculation::PRC_HV_PCDW_BOM_2" (
    IN  rootNode VARCHAR(44),
    OUT pred_succ_out "EBGCFE"."PRED_SUCC_BOM_2_TT"
 )  
	LANGUAGE SQLSCRIPT
	SQL SECURITY INVOKER 
	DEFAULT SCHEMA "EBGCFE"
	READS SQL DATA 	WITH RESULT VIEW "EBGCFE"."PRC_HV_PCDW_BOM_2V" 
	AS
    num_nodes INTEGER := 0;	
BEGIN
    -- add root node to result set
    pred_succ_out = SELECT null AS pred, :rootNode AS succ FROM dummy;     

    -- get direct children of the root node
    level_data = SELECT name||'##'||werks||'##'||product_group AS pred, idnrk||'##'||werks||'##'||product_group AS succ FROM z_pcdw_bom 
                 WHERE name||'##'||werks||'##'||product_group = :rootNode AND status = 'ACTIVE';

    SELECT count(succ) INTO num_nodes FROM :level_data; 
    -- recursive call to find all hierarchy nodes
    WHILE :num_nodes > 0 DO
        -- combine child nodes into result set
        pred_succ_out = SELECT * FROM :pred_succ_out UNION ALL SELECT * FROM :level_data; 

        -- get next level children
        level_data = SELECT name||'##'||werks||'##'||product_group AS pred, idnrk||'##'||werks||'##'||product_group AS succ FROM z_pcdw_bom
                     WHERE name||'##'||werks||'##'||product_group IN ( SELECT succ FROM :level_data)
                       AND status = 'ACTIVE';                    

        SELECT count(*) INTO num_nodes FROM :level_data;

    END WHILE;

END;

CREATE COLUMN VIEW HV_PCDW_BOM_2 TYPE hierarchy 
    AS SELECT pred,succ FROM PRC_HV_PCDW_BOM_2V( 
        placeholder."$$rootnode$$" => '$$ROOT$$')
    WITH PARAMETERS ( 'hierarchyDefinition' = '{
        "parameters":[ { "name":"ROOT", "type":"VARCHAR(44)" } ], "extendedViewAttributes":true
    }');

	
CREATE PROCEDURE "EBGCFE"."cdp.ebgcfe.procedures.pkg_bom_calculation::PRC_SEL_HV_PCDW_BOM_2" ( 
  IN  rootnode VARCHAR(44),
  OUT pcdw_bom EBGCFE.HV_PCDW_BOM_2
 ) 
	LANGUAGE SQLSCRIPT
	SQL SECURITY INVOKER 
	DEFAULT SCHEMA "EBGCFE"
	READS SQL DATA 
	AS
BEGIN 
	pcdw_bom = select * from HV_PCDW_BOM_2(placeholder."ROOT"=>:rootnode );                    
END;

--------------------------------------------------------------------------------------------
SET SCHEMA EBGCFE;
CREATE TYPE pred_succ_phantom_tt AS TABLE ( pred CHAR(400), succ CHAR(400) );

CREATE PROCEDURE "EBGCFE"."cdp.ebgcfe.procedures.pkg_bom_calculation::PRC_HV_MID_PHANTOM_PART" (
    IN  rootNode VARCHAR(400),
    OUT pred_succ_out "EBGCFE"."PRED_SUCC_PHANTOM_TT"
 )  
	LANGUAGE SQLSCRIPT
	SQL SECURITY INVOKER 
	DEFAULT SCHEMA "EBGCFE"
	READS SQL DATA 	WITH RESULT VIEW "EBGCFE"."PRC_HV_MID_PHANTOM_PARTV" 
	AS
    num_nodes INTEGER := 0;	
BEGIN
    -- add root node to result set
    pred_succ_out = SELECT null AS pred, :rootNode AS succ FROM dummy;     

    -- get direct children of the root node
    level_data = SELECT a.plant||'##'||a.model||'##'||a.bom_lvl||'##'||a.children||'##'||a.product_group||'##'||a.qtyper||'##'||a.altpercent||'##'||a.RID AS pred, 
	            a.plant||'##'||a.model||'##'||a.bom_lvl||'##'||a.father||'##'||a.product_group||'##'||b.qtyper||'##'||b.altpercent||'##'||b.RID AS succ 
				FROM mid_phantom_part a left join mid_phantom_part b on a.father = b.children
				WHERE a.plant||'##'||a.model||'##'||a.bom_lvl||'##'||a.children||'##'||a.product_group||'##'||a.qtyper||'##'||a.altpercent||'##'||a.RID = :rootNode ; 

    SELECT count(succ) INTO num_nodes FROM :level_data; 
    -- recursive call to find all hierarchy nodes
    WHILE :num_nodes > 0 DO
        -- combine child nodes into result set
        pred_succ_out = SELECT * FROM :pred_succ_out UNION ALL SELECT * FROM :level_data;

        -- get next level children
        level_data = SELECT a.plant||'##'||a.model||'##'||a.bom_lvl||'##'||a.children||'##'||a.product_group||'##'||a.qtyper||'##'||a.altpercent||'##'||a.RID AS pred, 
	            a.plant||'##'||a.model||'##'||a.bom_lvl||'##'||a.father||'##'||a.product_group||'##'||b.qtyper||'##'||b.altpercent||'##'||b.RID AS succ 
				FROM mid_phantom_part a left join mid_phantom_part b on a.father = b.children
                WHERE a.plant||'##'||a.model||'##'||a.bom_lvl||'##'||a.children||'##'||a.product_group||'##'||a.qtyper||'##'||a.altpercent||'##'||a.RID 
				IN ( SELECT succ FROM :level_data);                 

        SELECT count(*) INTO num_nodes FROM :level_data;

    END WHILE;

END;

CREATE COLUMN VIEW HV_MID_PHANTOM_PART TYPE hierarchy 
    AS SELECT pred,succ FROM PRC_HV_MID_PHANTOM_PARTV( 
        placeholder."$$rootnode$$" => '$$ROOT$$')
    WITH PARAMETERS ( 'hierarchyDefinition' = '{
        "parameters":[ { "name":"ROOT", "type":"VARCHAR(400)" } ], "extendedViewAttributes":true
    }');

	
CREATE PROCEDURE "EBGCFE"."cdp.ebgcfe.procedures.pkg_bom_calculation::PRC_SEL_HV_MID_PHANTOM_PART" ( 
  IN  rootnode VARCHAR(400),
  OUT phantom_part EBGCFE.HV_MID_PHANTOM_PART
 ) 
	LANGUAGE SQLSCRIPT
	SQL SECURITY INVOKER 
	DEFAULT SCHEMA "EBGCFE"
	READS SQL DATA 
	AS
BEGIN 
	phantom_part = select * from HV_MID_PHANTOM_PART(placeholder."ROOT"=>:rootnode );                    
END;
	