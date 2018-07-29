import md5 from 'md5';

export const server = {
  host: 'http://localhost:8082',
  agoraChannelName: 'angelHack-makermaker'
};

export const style = {
  page: {
    height: 'calc(100vh - 48px)'
  }
}

const agoraCred = {
  appId: 'a027e0f0bcee4af5a8dce9110aeab094',
  appCertificate: '30e2b8a6fcd84192a8e0db7826812f33',
  expiredTime: '1546271999'
}

export class Agora {
  static generateToken(account) {
    const cred = { ...agoraCred, account }
    const orderedKeys = ['account', 'appId', 'appCertificate', 'expiredTime'];
    const md5Source = orderedKeys.reduce((fullSignature, orderedKey) => `${fullSignature}${cred[orderedKey]}`, '');
    const md5Signature = md5(md5Source);
    const appVersion = 1;
    return {
      ...cred,
      token: `${appVersion}:${cred.appId}:${cred.expiredTime}:${md5Signature}`
    };
  }
}
