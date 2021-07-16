# daikin-controller-cloud

[![NPM version](http://img.shields.io/npm/v/daikin-controller-cloud.svg)](https://www.npmjs.com/package/daikin-controller-cloud)
[![Downloads](https://img.shields.io/npm/dm/daikin-controller-cloud.svg)](https://www.npmjs.com/package/daikin-controller-cloud)
![Test and Release](https://github.com/Apollon77/daikin-controller-cloud/workflows/Test%20and%20Release/badge.svg)

Library to generate/retrieve tokens to communicate with the Daikin cloud and to control Daikin devices via the cloud adapters like (BRP069C4x).

## Description
The newer Daikin devices sold since 2020 contain a newer Wifi Adapter (e.g. BRP069C4x) which only connects to the Daikin Cloud and is no longer reachable locally.

This library allows to initially (hopefully once) retrieve tokens by using a proxy to login to the Daikin Cloud. After that these tokens can be used and refreshed to interact with teh devices.

**For more information on the Proxy progress for end users - because you need to trust and whitelist them and such - can be found in [PROXY.md](PROXY.md)!**
Info: This project is not grabbing any username or password, just the created tokens after you logged in.

## IMPORTANT
When you integrate this library please make sure users do not refresh data out of the cloud too fast. Please still think about the needed resources and costs on Daikin side to operate the cloud services and only allow meaningful poll intervals!

## Install
For now while being in basic development install from Github:

`npm i Apollon77/daikin-controller-cloud`

## Example:
See example folder, check the settings (add your own IP at minimum!) and start it with `node example.js`.

## Using tokensaver.js

If your only interest is to save the tokens exchanged by Daikin Cloud and yourself (for instance, when you want to use them with your own code or home automation), use the tokensaver.js in the `example` folder

From within the main directory, run:

`node example/tokensaver.js`

Or, more conveniently, use one of the binaries supplied in this repository.
TODO: add auto-binaries


TODO, for now: see example

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

### 0.1.3 (2021-07-16)
* Added tokensaver.js
* Added script to auto-generate binaries based on tokensaver.js

### 0.1.1 (2021-03-29)
* Initial release version

### 0.0.x
* Initial version
