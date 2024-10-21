export function truncateAddress(address: string, chars = 4): string {
  if (address.length <= chars * 2) return address;

  return `${address.substring(0, chars)}...${address.substring(
    address.length - chars
  )}`;
}
