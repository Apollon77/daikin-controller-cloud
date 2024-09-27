import { Issuer, TokenSet } from 'openid-client';

export enum OnectaOIDCScope {
    basic = 'openid onecta:basic.integration',
}

export enum OnectaAPIBaseUrl {
    prod = 'https://api.onecta.daikineurope.com',
    mock = 'https://api.onecta.daikineurope.com/mock',
}

export enum OnectaOIDCEndpoint {
    authorization = 'https://idp.onecta.daikineurope.com/v1/oidc/authorize',
    token = 'https://idp.onecta.daikineurope.com/v1/oidc/token',
    revocation = 'https://idp.onecta.daikineurope.com/v1/oidc/revoke',
    introspection = 'https://idp.onecta.daikineurope.com/v1/oidc/introspect',
}

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
  <p>Thank you for authorizing <code>daikin-controller-cloud</code> to access your devices.</p>
</body>
</html>
`;

export interface OnectaClientConfig {
    oidcClientId: string;
    oidcClientSecret: string;
    oidcCallbackServerExternalAddress?: string;
    oidcCallbackServerBaseUrl?: string;
    oidcCallbackServerPort?: number;
    oidcCallbackServerBindAddr?: string;
    oidcAuthorizationTimeoutS?: number;
    oidcTokenSetFilePath?: string;
    certificatePathCert?: string;
    certificatePathKey?: string;
    onectaOidcAuthThankYouHtml?: string;
    customOidcCodeReceiver?: (auth_url: string, state: string) => Promise<string>;
    tokenSet?: TokenSet;
}

export interface OnectaRateLimitStatus {
    limitMinute?: number;
    remainingMinute?: number;
    limitDay?: number;
    remainingDay?: number;
}

export const maybeParseInt = (v: any) => {
    return typeof v === 'string' ? parseInt(v) : undefined;
};

export const RESOLVED = Promise.resolve();
