import type { FileModel } from '@src/definition';

export enum FileType {
  image,
  document,
}

export function resolveFileType(mimeType: string) {
  if (['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/gif'].includes(mimeType)) {
    return FileType.image;
  }
  return FileType.document;
}

export function isFileModel(file: File | FileModel): file is FileModel {
  return (<FileModel>file).url !== undefined;
}

export function fileToFileModel(file: File): FileModel {
  return {
    url: window.URL.createObjectURL(file),
    name: file.name,
    size: file.size,
    type: resolveFileType(file.type),
    rawFile: file,
  };
}
