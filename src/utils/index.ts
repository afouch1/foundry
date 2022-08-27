export const isIPv4 = (addr: string): boolean => {
  let matches = addr.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);

  if (!matches) return false;

  return (+matches[1] < 255) && Number.isInteger(+matches[1])
    && (+matches[2] < 255) && Number.isInteger(+matches[2])
    && (+matches[3] < 255) && Number.isInteger(+matches[3])
    && (+matches[4] < 255) && Number.isInteger(+matches[4])
}