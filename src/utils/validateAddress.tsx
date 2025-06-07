import WAValidator from 'wallet-address-validator';

export function isValidCryptoAddress(address: string, coin: string): boolean {
  return WAValidator.validate(address, coin);
}
