# daikin-controller-cloud

[![NPM version](http://img.shields.io/npm/v/daikin-controller-cloud.svg)](https://www.npmjs.com/package/daikin-controller-cloud)
[![Downloads](https://img.shields.io/npm/dm/daikin-controller-cloud.svg)](https://www.npmjs.com/package/daikin-controller-cloud)
![Test and Release](https://github.com/Apollon77/daikin-controller-cloud/workflows/Test%20and%20Release/badge.svg)

Library to generate/retrieve tokens to communicate with the Daikin cloud and to control Daikin devices via the cloud adapters like (BRP069C4x).

## Description
The newer Daikin devices sold since 2020 contain a newer Wifi Adapter (e.g. BRP069C4x) which only connects to the Daikin Cloud and is no longer reachable locally. These devices are only controllable with the Daikin Onecta App.

This library allows to initially (hopefully once) retrieve tokens by using a proxy to login to the Daikin Cloud. After that these tokens can be used and refreshed to interact with teh devices.

**For more information on the Proxy progress for end users - because you need to trust and whitelist them and such - can be found in [PROXY.md](PROXY.md)!**
Info: This project is not grabbing any username or password, just the created tokens after you logged in.

Note: For devices with older WLAN-Adapters like **BRP069A4x** which can only be used by the Daikin Controller App please use the [Daikin-Controller](https://github.com/Apollon77/daikin-controller) lib instead.

## IMPORTANT
When you integrate this library please make sure users do not refresh data out of the cloud too fast. Please still think about the needed resources and costs on Daikin side to operate the cloud services and only allow meaningful poll intervals!

## Install
For now while being in basic development install from Github:

`npm i Apollon77/daikin-controller-cloud`

## Using tokensaver.js

If your only interest is to save the tokens exchanged by Daikin Cloud and yourself (for instance, when you want to use them with your own code or home automation), use the tokensaver.js in the `example` folder

From within the main directory, run:

`node example/tokensaver.js`

Or, more conveniently, use one of the binaries (Linux, macOS and Windows) supplied with the [Releases](https://github.com/Apollon77/daikin-controller-cloud/releases).
Alternatively you can execute `npx daikin-controller-cloud` which will also execute the tokensaver.js without the need to install the library (Node.js is required to be installed).

Calling tokensaver.js without any parameters will open a proxy where you can login to the Daikin Cloud and the tokens will be fetched.

Alternatively execute

`node tokensaver.js "mydaikin@email.com" "my-daikin-password"`

(replace data with your daikin cloud login credentials) and we try to fetch the tokens without the proxy.


## Code-Usage example
See example folder, check the settings (add your own IP at minimum!) and start it with `node example.js`.

## Issue reporting and enhancements
* Create Issues here in Github
* Provide PRs for actual changes and enhancements to code or documentation!

## Todos
* Mooooaaar documentation, especially for proxy use for endusers and development
* Add Tests
* Implement internal update of values when a new value is set? Or reload data after a set action automatically?
* Implement interval data update in library or only from outside?
* The mitm proxy library is not closing the proxy correct, so the promise never gets resolved ... need to check on that.


## Changelog:

### __WORK IN PROGRESS__
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

## Disclaimer
**Daikin is a trademark of DAIKIN INDUSTRIES, LTD. I am in no way endorsed by or affiliated with DAIKIN INDUSTRIES, LTD., or any associated subsidiaries, logos or trademarks. This personal project is maintained in spare time.**
