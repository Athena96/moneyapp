import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Amplify, {Auth} from 'aws-amplify';
import {BrowserRouter} from 'react-router-dom';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {moneyGreen, moneyGreenLight} from './utilities/constants';
// Amplify.configure(awsExports);

Amplify.configure({
  Auth: {
    // (required) only for Federated Authentication - Amazon Cognito Identity Pool ID
    // identityPoolId: 'XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab',

    // (required)- Amazon Cognito Region
    region: 'us-east-1',

    // (optional) - Amazon Cognito Federated Identity Pool Region
    // Required only if it's different from Amazon Cognito Region
    identityPoolRegion: 'us-east-1',

    // (optional) - Amazon Cognito User Pool ID
    userPoolId: 'us-east-1_1vph21DjX',

    // (optional) - Amazon Cognito Web Client ID
    // (26-char alphanumeric string, App client secret needs to be disabled)
    userPoolWebClientId: '4frfkri1535dldem3bh3bgfvue',

    // (optional) - Enforce user authentication prior to accessing AWS resources or not
    mandatorySignIn: false,

    // (optional) - Configuration for cookie storage
    // Note: if the secure flag is set to true, then the cookie transmission requires a secure protocol
    // cookieStorage: {
    //   // - Cookie domain (only required if cookieStorage is provided)
    //   domain: '.yourdomain.com',
    //   // (optional) - Cookie path
    //   path: '/',
    //   // (optional) - Cookie expiration in days
    //   expires: 365,
    //   // (optional) - See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
    //   sameSite: 'strict' | 'lax',
    //   // (optional) - Cookie secure flag
    //   // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
    //   secure: true
    // },

    // (optional) - customized storage object
    // storage: MyStorage,

    // (optional) - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
    // authenticationFlowType: 'USER_PASSWORD_AUTH',

    // (optional) - Manually set key value pairs that can be passed to Cognito Lambda Triggers
    // clientMetadata: { myCustomKey: 'myCustomValue' },

    // (optional) - Hosted UI configuration
    // oauth: {
    //   domain: 'your_cognito_domain',
    //   scope: [
    //     'phone',
    //     'email',
    //     'profile',
    //     'openid',
    //     'aws.cognito.signin.user.admin'
    //   ],
    //   redirectSignIn: 'http://localhost:3000/',
    //   redirectSignOut: 'http://localhost:3000/',
    //   clientId: '1g0nnr4h99a3sd0vfs9',
    //   responseType: 'code' // or 'token', note that REFRESH
    // token will only be generated when the responseType is code
    // }
  },
  API: {
    endpoints: [
      {
        name: 'Endpoint',
        endpoint: 'https://i1x4l94mh0.execute-api.us-east-1.amazonaws.com/prod',
        custom_header: async () => {
          return {
            Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`,
            IdToken: `${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
          };
        },

      },
    ],
  },
});

const theme = createTheme({
  palette: {
    secondary: {
      main: moneyGreenLight,
    },
    primary: {
      main: moneyGreen,
    },
  },
});
ReactDOM.render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </BrowserRouter>,
    document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
