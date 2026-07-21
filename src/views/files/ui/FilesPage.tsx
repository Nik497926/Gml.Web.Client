'use client';

import { FileManager } from '@/widgets/file-manager';
import { Section } from '@/entities/Section';
import { DASHBOARD_PAGES } from '@/shared/routes';
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs';
import { hasPermission, PERMISSIONS } from '@/shared/lib/permissions';

export function FilesPage() {
  const canManage = hasPermission(PERMISSIONS.FILES_GLOBAL_MANAGE);

  return (
    <>
      <Breadcrumbs
        current="Файлы"
        breadcrumbs={[{ value: 'Главная', path: DASHBOARD_PAGES.HOME }]}
      />
      <Section
        title="Файловый менеджер"
        subtitle="Просмотр и управление файлами инстанса Gml"
      >
        {canManage ? (
          <FileManager scope="global" />
        ) : (
          <div className="rounded-md border p-6 text-sm text-muted-foreground">
            Недостаточно прав. Требуется разрешение <code>files.global.manage</code>.
          </div>
        )}
      </Section>
    </>
  );
}
