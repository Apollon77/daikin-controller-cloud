# daikin-controller-cloud

[![NPM version](http://img.shields.io/npm/v/daikin-controller-cloud.svg)](https://www.npmjs.com/package/daikin-controller-cloud)
[![Downloads](https://img.shields.io/npm/dm/daikin-controller-cloud.svg)](https://www.npmjs.com/package/daikin-controller-cloud)
![Test and Release](https://github.com/Apollon77/daikin-controller-cloud/workflows/Test%20and%20Release/badge.svg)

Library to generate/retrieve tokens to communicate with the Daikin cloud and to control Daikin devices via the cloud adapters like (BRP069C4x). The Library uses the new Daikin Europe Developer cloud API since v2.0.0.

## Disclaimer
**All product and company names or logos are trademarks™ or registered® trademarks of their respective holders. Use of them does not imply any affiliation with or endorsement by them or any associated subsidiaries! This personal project is maintained in spare time and has no business goal.**
**Daikin is a trademark of DAIKIN INDUSTRIES, LTD.**

## Description
The newer Daikin devices sold since 2020 contain a newer Wifi Adapter
(e.g. BRP069C4x) which only connects to the Daikin Cloud and is no longer
reachable locally. These devices are only controllable through the Daikin
Onecta API, which uses the OpenID Connect (OIDC) protocol for client
authentication and authorization purposes.

This library facilitates interacting with the Onecta API by providing an
abstraction over OIDC flows and token management.

Note: For devices with older WLAN-Adapters like **BRP069A4x** which can only be
used by the Daikin Controller App please use the
[Daikin-Controller](https://github.com/Apollon77/daikin-controller) lib instead.

## IMPORTANT information and best practices

The Onecta API limits each client application to 200 requests per day. Please make sure to not exceed this limit, as the API will block further requests for the day.

Because of this we propose the following usage limits to be implemented by the applications using this library:
* Better always read the full device details rather than single devices to make best use of the rate limit
* A default polling interval of 15 minutes should be sufficient for most use cases while leaving some space for controlling the devices too.
* Consider using a (longer) slow polling interval for timeframes where updated data are not that important - with this the normal polling interval could be faster.
* After you have "set" a value, wait at least 1-2 minutes before you read the updated values again because executing commands and updating the cloud data can take some time
* Ideally have at least 10 minutes time between switching the device power status because else thats bad for the moving parts of the devices

## Pre-requisites

This library acts as an OIDC client towards the Onecta API and uses OIDC's
`Authorization` grant to obtain the initial pair of OIDC tokens.  As such, 
you'll have to provide the following:

1. The `Client ID` and `Client Secret` of a registered application tied to your
   Daiking Developer account. If you do not have such an account, yet, you can
   create one in the [Daikin Developer Portal][p1]
2. The ability for the process that uses this library to listen on a local TCP
   port (configurable) in order to start an HTTP server that your browser will
   be redirected to at the end of the `Authorization` grant flow
3. A domain name or an IP that resolves to the machine that hosts the process using this
   library (if running locally you will not be able to use `localhost` or `127.0.0.1`
   as it is rejected by the Onecta API)

You will have to combine the port (point 2.) and domain name (point 3.) to
create the URL to be set as the application's `Redirect URI` in the
[Daikin Developer portal][p1]. Note that the same URL **must** also be passed
as a configuration parameter of the `DaikinCloudController` class or is build 
automatically from the provided values. Also note  that the `Redirect URI` must 
use the secure `https:` protocol and that this library ships with its own self-signed 
SSL/TLS certificate, which will cause your browser to present you with a security warning.

[p1]: https://developer.cloud.daikineurope.com

## Install

`npm i daikin-controller-cloud`

## Code-Usage example
See [`src/example.ts`](./src/example.ts).

## DaikinControllerCloud options overview

| Option                              | Required?       | Description                                                                                                                                                                                                                       | Default                           |
|-------------------------------------|-----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------|
| `oidcClientId`                      | Yes             | The client ID of the registered Daikin Developer Account application                                                                                                                                                              |                                   |
| `oidcClientSecret`                  | Yes             | The client secret of the registered Daikin Developer Account application                                                                                                                                                          |                                   |
| `oidcCallbackServerExternalAddress` | Maybe, see desc | The external address (domainname/IP) of the machine running the library, ot external Docker IP or such when using docker. Mandatory if `oidcCallbackServerBaseUrl` or `customOidcCodeReceiver` is not provided.                   |                                   |
| `oidcCallbackServerBaseUrl`         | Maybe, see desc | The full externally reachable callback URl including protocol, domain/ip/basepath. If not provided will be build internally using `oidcCallbackServerExternalAddress`or `oidcCallbackServerBindAddr` and `oidcCallbackServerPort` |                                   |
| `oidcCallbackServerPort`            | Maybe, see desc | The port the callback server listens on, required when `customOidcCodeReceiver` is not used.                                                                                                                                      |                                   |
| `oidcCallbackServerBindAddr`        | No              | The address the callback server listens on, required when `customOidcCodeReceiver` is not used.                                                                                                                                   | `                                 |
| `oidcAuthorizationTimeoutS`         | Yes             | The timeout in seconds for the OIDC authorization flow                                                                                                                                                                            |                                   |
| `oidcTokenSetFilePath`              | No              | The path to a file where the token set is stored. When not set the tokens are _not_ persisted and application need to listen to "token_updated" event and store and restore itself!                                               |                                   |
| `certificatePathCert`               | No              | The path to the SSL certificate                                                                                                                                                                                                   | `./cert/cert.key` in library root |
| `certificatePathKey`                | No              | The path to the SSL key                                                                                                                                                                                                           | `./cert/cert.pem` in library root |
| `onectaOidcAuthThankYouHtml`        | No              | The HTML content to be displayed after successful OIDC authorization, requiored when `customOidcCodeReceiver` is not used                                                                                                         |                                   |
| `customOidcCodeReceiver`            | No              | A custom function to receive the OIDC code. WHen this is used the library donot start any Webservcer and application needs to handle this.                                                                                        |                                   |
| `tokenSet`                          | No              | A token set to be used initially when no token file is stored                                                                                                                                                                     |                                   |

## Issue reporting and enhancements
* Create Issues here in Github
* Provide PRs for actual changes and enhancements to code or documentation!

## Todos
* Generate SSL Certs automatically
* Mooooaaar documentation
* Add Tests

## Changelog:
### 2.1.1 (2024-07-05)
* Expose the Rate limit error retryAfter time in the error object

### 2.0.0 (2024-07-05)
* BREAKING: Username/Passwort and Proxy Authentications are removed and replaced by the new Daikin Portal Authentication! You need to re-authenticate!
* BREAKING: DaikinCloudController class constructor changed and has new options structure!
* Minimum Node.js version is 18.2
* (jacoscaz) Ports to Typescript
* (jacoscaz) Switches to Daikin's OIDC-based Onecta API
* (Apollon77) Enhancements to restore some make sure former functionality is still possible to use
* (Apollon77) Enhances DaikinCloudController class to update data for all devices with one call to save requests
* (Apollon77) Enhances DaikinDevice classes to emit an "updated" event when data is updated, so it's easier to listen for changes
* (jacoscaz/Apollon77) Expose rate limit information and own error class for rate limit handling

### 1.2.4 (2023-09-09)
* (Apollon77) Make sure to store only existing refresh tokens

### 1.2.3 (2023-09-06)
* (ptz0n) Making sure to really store Refresh tokens on update

### 1.2.2 (2023-09-03)
* (Apollon77) make sure isCloudConnectionUp is always a boolean

### 1.2.1 (2023-08-29)
* (Apollon77) Use field timestamp to report the last update time of the data

### 1.2.0 (2023-08-29)
* (Apollon77) Add parsing support for Altherma electrical device data, missing "unit" is added to the data

### 1.1.0 (2023-08-23)
* (Apollon77) Fix crash cases
* (Apollon77) Path certificate creation to be only 1 year

### 1.0.4 (2022-08-13)
* (Apollon77) Fix potential crash case with Proxy stop

### 1.0.3 (2022-06-03)
* (Apollon77) Fix potential crash case

### 1.0.2 (2022-05-27)
* (Apollon77) Fix potential crash case

### 1.0.1 (2022-05-23)
* (Apollon77) Optimize login handling

### 1.0.0 (2022-05-22)
* BREAKING: Drop Node.js 10.x; support for LTS versions of Node.js
* (Apollon77) Update dependencies to latest versions and make library compatible again to them
* (Apollon77) Split the options initialization for Proxy and it's defaults to the proxy class

### 0.2.1 (2022-02-20)
* (uKL) Expose isCloudConnectionUp as own method on device
* (uKL) prevent crash when some data from devices are still null after new addition to cloud
* (DrHauss ) Added timeout and retry to got requests

### 0.2.0 (2021-07-30)
* (csu333) Add direct login method using email/password as second option beside proxy
* (csu333) Add direct login also to tokensaver.js

### 0.1.3 (2021-07-16)
* (gigatexel ) Added tokensaver.js
* (gigatexel/Apollon77) Added script to auto-generate binaries based on tokensaver.js

### 0.1.1 (2021-03-29)
* (Apollon77) Initial release version

### 0.0.x
* (Apollon77) Initial version
