INSERT INTO "AdSlot" ("id", "title", "slug", "description", "placement", "size", "isActive", "createdAt", "updatedAt")
VALUES
  (
    gen_random_uuid()::text,
    'Home top',
    'home-top',
    'Banner institucional discreto logo apos a abertura principal da home.',
    'HOME_TOP',
    '1200x320',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    gen_random_uuid()::text,
    'Home middle',
    'home-middle',
    'Espaco de apoio institucional no miolo da home publica.',
    'HOME_MIDDLE',
    '1200x240',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    gen_random_uuid()::text,
    'Portal sidebar',
    'portal-sidebar',
    'Espaco lateral para apoiadores e banners institucionais no portal.',
    'PORTAL_SIDEBAR',
    '420x320',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    gen_random_uuid()::text,
    'Portal bottom',
    'portal-bottom',
    'Espaco de rodape para parceiros do territorio na pagina do portal.',
    'PORTAL_BOTTOM',
    '1200x220',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    gen_random_uuid()::text,
    'Reports bottom',
    'reports-bottom',
    'Apoio comunitario no rodape da pagina de demandas.',
    'REPORTS_BOTTOM',
    '1200x220',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    gen_random_uuid()::text,
    'Footer supporters',
    'footer-supporters',
    'Lista de apoiadores ativos no rodape publico.',
    'FOOTER_SUPPORTERS',
    'fluid',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  )
ON CONFLICT ("slug") DO NOTHING;
