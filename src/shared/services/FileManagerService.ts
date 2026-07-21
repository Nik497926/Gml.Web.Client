import { AxiosResponse } from 'axios';

import { $api } from '@/services/api.service';
import {
  TGetFileManagerContentParams,
  TGetFileManagerContentResponse,
  TGetFileManagerDownloadParams,
  TGetFileManagerEntriesParams,
  TGetFileManagerEntriesResponse,
  TPostFileManagerArchiveRequest,
  TPostFileManagerArchiveResponse,
  TPostFileManagerDeleteRequest,
  TPostFileManagerDeleteResponse,
  TPostFileManagerExtractRequest,
  TPostFileManagerExtractResponse,
  TPutFileManagerContentRequest,
  TPutFileManagerContentResponse,
} from '@/shared/api/contracts/file-manager/schemas';

class FileManagerService {
  private BASE_URL = '/file-manager';

  async listEntries(
    params: TGetFileManagerEntriesParams,
  ): Promise<AxiosResponse<TGetFileManagerEntriesResponse>> {
    return await $api.get<TGetFileManagerEntriesResponse>(`${this.BASE_URL}/entries`, { params });
  }

  async readContent(
    params: TGetFileManagerContentParams,
  ): Promise<AxiosResponse<TGetFileManagerContentResponse>> {
    return await $api.get<TGetFileManagerContentResponse>(`${this.BASE_URL}/content`, { params });
  }

  async writeContent(
    body: TPutFileManagerContentRequest,
  ): Promise<AxiosResponse<TPutFileManagerContentResponse>> {
    return await $api.put<TPutFileManagerContentResponse>(`${this.BASE_URL}/content`, body);
  }

  async deleteEntries(
    body: TPostFileManagerDeleteRequest,
  ): Promise<AxiosResponse<TPostFileManagerDeleteResponse>> {
    return await $api.post<TPostFileManagerDeleteResponse>(`${this.BASE_URL}/delete`, body);
  }

  async archive(
    body: TPostFileManagerArchiveRequest,
  ): Promise<AxiosResponse<TPostFileManagerArchiveResponse>> {
    return await $api.post<TPostFileManagerArchiveResponse>(`${this.BASE_URL}/archive`, body);
  }

  async extract(
    body: TPostFileManagerExtractRequest,
  ): Promise<AxiosResponse<TPostFileManagerExtractResponse>> {
    return await $api.post<TPostFileManagerExtractResponse>(`${this.BASE_URL}/extract`, body);
  }

  async download(params: TGetFileManagerDownloadParams): Promise<void> {
    const response = await $api.get(`${this.BASE_URL}/download`, {
      params,
      responseType: 'blob',
    });

    const disposition = response.headers['content-disposition'] as string | undefined;
    let fileName = params.path.split('/').pop() || 'download';
    if (disposition) {
      const match = /filename\*?=(?:UTF-8'')?["']?([^;"']+)/i.exec(disposition);
      if (match?.[1]) {
        fileName = decodeURIComponent(match[1]);
      }
    }

    const blobUrl = window.URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
  }
}

export const fileManagerService = new FileManagerService();
