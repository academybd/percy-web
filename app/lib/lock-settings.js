export default {
  auth: {
    redirect: true,
    redirectUrl: `${window.location.origin}/api/auth/auth0/callback`,
    responseType: 'code',
    params: {},
  },
  languageDictionary: {
    title: 'Percy',
    emailInputPlaceholder: 'Email',
    passwordInputPlaceholder: 'Password',
  },
  theme: {
    logo: 'https://percy.io/static/images/percy.svg',
    primaryColor: '#5c007b',
  },
  socialButtonStyle: 'big',
  autoclose: true,
  autofocus: true,
  closable: true,
};
