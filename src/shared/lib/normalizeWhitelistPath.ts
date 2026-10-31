/** Единый вид пути для белого списка: без ведущих слэшей, `/` как разделитель, без хвоста `/`. */
export function normalizeWhitelistPath(path: string): string {
  return path
    .trim()
    .replace(/\\/g, '/')
    .replace(/^\/+/, '')
    .replace(/\/+$/, '');
}

/** Уникальные папки из списка файлов профиля (родительские каталоги). */
export function deriveFoldersFromFiles(directories: string[]): string[] {
  const set = new Set<string>();
  for (const raw of directories) {
    const dir = normalizeWhitelistPath(raw);
    if (!dir) continue;
    const parts = dir.split('/');
    // убираем имя файла
    if (parts.length < 2) continue;
    parts.pop();
    let acc = '';
    for (const part of parts) {
      acc = acc ? `${acc}/${part}` : part;
      set.add(acc);
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}
