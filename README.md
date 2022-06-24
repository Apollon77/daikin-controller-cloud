# daikin-controller-cloud

[![NPM version](http://img.shields.io/npm/v/daikin-controller-cloud.svg)](https://www.npmjs.com/package/daikin-controller-cloud)
[![Downloads](https://img.shields.io/npm/dm/daikin-controller-cloud.svg)](https://www.npmjs.com/package/daikin-controller-cloud)
![Test and Release](https://github.com/Apollon77/daikin-controller-cloud/workflows/Test%20and%20Release/badge.svg)

Library to generate/retrieve tokens to communicate with the Daikin cloud and to control Daikin devices via the cloud adapters like (BRP069C4x).

## Disclaimer
**All product and company names or logos are trademarks™ or registered® trademarks of their respective holders. Use of them does not imply any affiliation with or endorsement by them or any associated subsidiaries! This personal project is maintained in spare time and has no business goal.**
**Daikin is a trademark of DAIKIN INDUSTRIES, LTD.**

## Description
The newer Daikin devices sold since 2020 contain a newer Wifi Adapter (e.g. BRP069C4x) which only connects to the Daikin Cloud and is no longer reachable locally. These devices are only controllable with the Daikin Onecta App.

This library allows to initially (hopefully once) retrieve tokens by using a proxy to login to the Daikin Cloud. After that these tokens can be used and refreshed to interact with teh devices.

Note: For devices with older WLAN-Adapters like **BRP069A4x** which can only be used by the Daikin Controller App please use the [Daikin-Controller](https://github.com/Apollon77/daikin-controller) lib instead.

### Login with E-Mail/Password
The easy mode is to use the `login`method of the `DaikinControllerCloud` class and provide the E-Mail and the Password.

An automatic login is tried in this case and the tokens are retrieved.

It can happen that this process do not work because the Daikin Website requires you to solve a captcha. In this can you can use the following trick:
* Start the proxy
* Call the proxy URL on port 8889
* You **do not** need to import the certificate!
* Just click on the `Login into the Daikin Cloud to retrieve the tokens` link at the end of the instructions page and login there once and solve the captcha.
* Close the browser window and try the automatic login again

### Login with Proxy
**For more information on the Proxy progress for end users - because you need to trust and whitelist them and such - can be found in [PROXY.md](PROXY.md)!**
Info: This project is not grabbing any username or password, just the created tokens after you logged in.

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

When getting or setting data you need to look at the complete data structure returned by the device. SO best go a "getData()" and check the structure. The getData/setData parameters mirror the structure. In fact you awlways eed to provide the first two levels, maybe a "path style third level".

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
