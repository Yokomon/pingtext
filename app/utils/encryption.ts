import CryptoJS from "crypto-js";

const secretKey = CryptoJS.enc.Utf8.parse(
  process.env.NEXT_PUBLIC_ENCRYPTION_KEY as string
);

const iv = CryptoJS.enc.Utf8.parse(
  process.env.NEXT_PUBLIC_INITIALIZATION_VECTOR as string
);

export const encryptMessage = (message: string) => {
  const encryptedMessage = CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(message),
    secretKey,
    {
      keySize: 128 / 8,
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );

  return encryptedMessage.toString();
};

export const decryptMessage = (message: string) => {
  const decryptedMessage = CryptoJS.AES.decrypt(message, secretKey, {
    keySize: 128 / 8,
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return CryptoJS.enc.Utf8.stringify(decryptedMessage);
};
