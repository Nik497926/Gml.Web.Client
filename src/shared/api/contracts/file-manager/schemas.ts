import { ResponseBaseEntity } from '@/shared/api/schemas';

export type FileManagerScope = 'global' | 'profile';

export type FileManagerEntryEntity = {
  name: string;
  relativePath: string;
  isDirectory: boolean;
  size: number;
  modifiedAt: string;
  extension?: string | null;
};

export type FileManagerContentEntity = {
  relativePath: string;
  content?: string | null;
  encoding: string;
  isBinary: boolean;
};

export type TGetFileManagerEntriesParams = {
  scope: FileManagerScope;
  path?: string;
  profileName?: string;
};

export type TGetFileManagerEntriesResponse = ResponseBaseEntity & {
  data: FileManagerEntryEntity[];
};

export type TGetFileManagerContentParams = {
  scope: FileManagerScope;
  path: string;
  profileName?: string;
};

export type TGetFileManagerContentResponse = ResponseBaseEntity & {
  data: FileManagerContentEntity;
};

export type TPutFileManagerContentRequest = {
  scope: FileManagerScope;
  path: string;
  profileName?: string;
  content: string;
};

export type TPutFileManagerContentResponse = ResponseBaseEntity;

export type TPostFileManagerDeleteRequest = {
  scope: FileManagerScope;
  profileName?: string;
  paths: string[];
};

export type TPostFileManagerDeleteResponse = ResponseBaseEntity;

export type TPostFileManagerArchiveRequest = {
  scope: FileManagerScope;
  profileName?: string;
  paths: string[];
  archiveName: string;
};

export type TPostFileManagerArchiveResponse = ResponseBaseEntity & {
  data: { relativePath: string };
};

export type TPostFileManagerExtractRequest = {
  scope: FileManagerScope;
  profileName?: string;
  path: string;
  destination?: string;
};

export type TPostFileManagerExtractResponse = ResponseBaseEntity;

export type TGetFileManagerDownloadParams = {
  scope: FileManagerScope;
  path: string;
  profileName?: string;
};
