declare module 'wallet-address-validator' {
    const WAValidator: {
      validate: (address: string, currency: string, networkType?: string) => boolean;
      getAddressType: (address: string, currency: string) => string | null;
    };
    export default WAValidator;
  }
  