import { EntityState } from '@/shared/enums';
import { PlayerBaseEntity } from '@/shared/api/contracts';

export type ProfileBaseEntity = {
  name: string;
  displayName: string;
  loader: number;
  priority: number;
  createDate: string;
  description: string;
  gameVersion: string;
  launchVersion: string;
  jvmArguments: string;
  iconBase64: string;
  state: number;
};

export type ProfileExtendedBaseEntity = {
  recommendedRam: number;
  javaPath: string;
  profileName: string;
  displayName: string;
  minecraftVersion: string;
  clientVersion: string;
  launchVersion: string;
  iconBase64: string;
  priority: number;
  background: string;
  description: string;
  arguments: string;
  jvmArguments: string;
  gameArguments: string;
  hasUpdate: boolean;
  isEnabled: boolean;
  state: EntityState;
  loader: number;
  files: ProfileFileBaseEntity[];
  whiteListFiles: ProfileFileBaseEntity[];
  whiteListFolders: ProfileFolderBaseEntity[];
  usersWhiteList: PlayerBaseEntity[];
};

export type ProfileFileBaseEntity = {
  name: string;
  directory: string;
  size: number;
  hash: string;
};

export type JavaRuntimeSource = 'default' | 'azul' | 'upload';

export type JavaVersionBaseEntity = {
  name: string;
  version: string;
  majorVersion: number;
  source?: JavaRuntimeSource | string;
  downloadUrl?: string | null;
  packageUuid?: string | null;
  os?: string | null;
  arch?: string | null;
  recommended?: boolean;
};

export type JavaRecommendEntity = {
  majorVersion: number;
  label: string;
  minecraftVersion: string;
};

export type ProfileJavaMetaEntity = {
  source: JavaRuntimeSource | string;
  javaMajor: number;
  runtimeId?: string | null;
  javaPath?: string | null;
  name?: string | null;
  version?: string | null;
  packageUuid?: string | null;
};

export type ProfileFolderBaseEntity = {
  path: string;
};
