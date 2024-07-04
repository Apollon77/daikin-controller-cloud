# daikin-controller-cloud

[![NPM version](http://img.shields.io/npm/v/daikin-controller-cloud.svg)](https://www.npmjs.com/package/daikin-controller-cloud)
[![Downloads](https://img.shields.io/npm/dm/daikin-controller-cloud.svg)](https://www.npmjs.com/package/daikin-controller-cloud)
![Test and Release](https://github.com/Apollon77/daikin-controller-cloud/workflows/Test%20and%20Release/badge.svg)

Library to generate/retrieve tokens to communicate with the Daikin cloud and to control Daikin devices via the cloud adapters like (BRP069C4x).

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

## IMPORTANT

The Onecta API limits each client application to 200 requests per day.

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
3. A domain name that resolves to the machine that hosts the process using this
   library (if running locally you will not be able to use `localhost` as it is 
   rejected by the Onecta API)

You will have to combine the port (point 2.) and domain name (point 3.) to
create the URL to be set as the application's `Redirect URI` in the
[Daikin Developer portal][p1]. Note that the same URL **must** also be passed
as a configuration parameter of the `DaikinCloudController` class. Also note
that the `Redirect URI` must use the secure `https:` protocol and that this
library ships with its own self-signed SSL/TLS certificate, which will cause
your browser to present you with a security warning.

[p1]: https://developer.cloud.daikineurope.com

## Install
For now while being in basic development install from Github:

`npm i Apollon77/daikin-controller-cloud`

## Code-Usage example
See [`src/example.ts`](./src/example.ts).

## Issue reporting and enhancements
* Create Issues here in Github
* Provide PRs for actual changes and enhancements to code or documentation!

## Todos
* Mooooaaar documentation
* Add Tests
* 
## Changelog:
### 2.0.0-alpha.8 (2024-07-04)
* BREAKING: Username/Passwort and Proxy Authentications are removed and replaced by the new Daikin Portal Authentication! You need to re-authenticate!
* BREAKING: DaikinCloudController class constructor changed and has new options structure!
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
