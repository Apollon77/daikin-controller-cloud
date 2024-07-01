
import { Issuer } from 'openid-client';

export enum OnectaOIDCScope {
  basic='openid onecta:basic.integration',
};

export enum OnectaAPIBaseUrl {
  prod='https://api.onecta.daikineurope.com',
  mock='https://api.onecta.daikineurope.com/mock',
};

export enum OnectaOIDCEndpoint {
  authorization='https://idp.onecta.daikineurope.com/v1/oidc/authorize',
  token='https://idp.onecta.daikineurope.com/v1/oidc/token',
  revocation='https://idp.onecta.daikineurope.com/v1/oidc/revoke',
  introspection='https://idp.onecta.daikineurope.com/v1/oidc/introspect',
};

export const onecta_oidc_issuer = new Issuer({
  issuer: 'Daikin',
  authorization_endpoint: OnectaOIDCEndpoint.authorization,
  token_endpoint: OnectaOIDCEndpoint.token,
  revocation_endpoint: OnectaOIDCEndpoint.revocation,
  introspection_endpoint: OnectaOIDCEndpoint.introspection,
});

export const onecta_oidc_auth_thank_you_html = `
<html>
<head>
<title>Thank you!</title>
</head>
<body>
  <h1>Authorization complete</h1>
  <p>Thank you for authorizing <code>daikin-onecta2mqtt</code> to access your devices.</p>
</body>
</html>
`;

export interface OnectaClientConfig {
  oidc_client_id: string;
  oidc_client_secret: string;
  oidc_callback_server_baseurl: string;
  oidc_callback_server_port: number;
  oidc_callback_server_addr: string;
  oidc_authorization_timeout: number;
  oidc_tokenset_file_path: string;
}
