/** Единый вид пути для белого списка: без ведущих слэшей, `/` как разделитель, без хвоста `/`. */
export function normalizeWhitelistPath(path: string): string {
  return path
    .trim()
    .replace(/\\/g, '/')
    .replace(/^\/+/, '')
    .replace(/\/+$/, '');
}

/** Корень клиентских файлов профиля: `game data/{profileName}`. */
export function getProfileGameDataRoot(profileName: string): string {
  return normalizeWhitelistPath(`game data/${profileName}`);
}

function isUnderProfileRoot(path: string, profileRoot: string): boolean {
  const p = path.toLowerCase();
  const root = profileRoot.toLowerCase();
  return p === root || p.startsWith(`${root}/`);
}

/**
 * Уникальные папки из списка файлов профиля (родительские каталоги).
 * Если передан profileName — только папки внутри `game data/{profileName}`
 * (без библиотек, assets и чужих профилей).
 */
export function deriveFoldersFromFiles(
  directories: string[],
  profileName?: string,
): string[] {
  const profileRoot = profileName ? getProfileGameDataRoot(profileName) : '';
  const set = new Set<string>();

  for (const raw of directories) {
    const dir = normalizeWhitelistPath(raw);
    if (!dir) continue;
    if (profileRoot && !isUnderProfileRoot(dir, profileRoot)) continue;

    const parts = dir.split('/');
    // убираем имя файла
    if (parts.length < 2) continue;
    parts.pop();

    let acc = '';
    for (const part of parts) {
      acc = acc ? `${acc}/${part}` : part;
      // сам корень профиля в список не кладём — только вложенные папки
      if (profileRoot && acc.toLowerCase() === profileRoot.toLowerCase()) continue;
      if (profileRoot && !isUnderProfileRoot(acc, profileRoot)) continue;
      set.add(acc);
    }
  }

  return Array.from(set).sort((a, b) => a.localeCompare(b));
}
