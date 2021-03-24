# daikin-controller-cloud

Library to generate/retrieve tokens to communicate with the Daikin cloud and to control Daikin devices via the cloud adapters like (BRP069C4x).

[![NPM version](http://img.shields.io/npm/v/daikin-controller-cloud.svg)](https://www.npmjs.com/package/daikin-controller-cloud)

[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://github.com/soef/alexa-remote/blob/master/LICENSE)

## Description
The newer Daikin devices sold since 2020 contain a newer Wifi Adapter (e.g. BRP069C4x) which only connects to the Daikin Cloud and is no longer reachable locally.

This library allows to initially (hopefully once) retrieve tokens by using a proxy to login to the Daikin Cloud. After that these tokens can be used and refreshed to interact with teh devices.

**For more information on the Proxy progress for end users - because you need to trust and whitelist them and such - can be found in PROXY.md!**

## IMPORTANT
When you integrate this library please make sure users do not refresh data out of the cloud too fast. Please still think about the needed resources and costs on Daikin side to operate the cloud services and only allow meaningful poll intervals!

## Install
For now while being in basic development install from Github:

`npm i Apollon77/daikin-controller-cloud``

## Example:
See example folder, check the settings (add your own IP at minimum!) and start it with `node example.js`.

## Usage 
TODO, for now: see example

## Issue reporting and enhancements
* Create Issues here in Github
* Provide PRs for actual changes and enhancements to code or documentation!

## Todos
* Moar documentation, especially for proxy use for endusers and development
* Add Tests
* Implement internal update of values when a new value is set? Or reload data after a set action automatically?
* Implement interval data update in library or only from outside?


## Changelog:

### 0.0.x
* Initial version
