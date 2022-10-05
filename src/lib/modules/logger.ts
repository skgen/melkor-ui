/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { isDebugMode } from '@src/plugin';

export function log(...props: any) {
  if (isDebugMode()) {
    console.log(...props);
  }
}

export function warn(...props: any) {
  if (isDebugMode()) {
    console.warn(...props);
  }
}
