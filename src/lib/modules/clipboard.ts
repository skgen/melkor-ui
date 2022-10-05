// eslint-disable-next-line import/prefer-default-export
export async function copyToClipboard(str: string) {
  await navigator.clipboard.writeText(str);
}
