select DISTINCT(father)
from "EBGCFE"."UI_MANUAL_BOM" where father not in (
select father from "EBGCFE"."UI_MANUAL_BOM" where father LIKE_REGEXPR '^[A-Za-z0-9]+$'
) order by father

