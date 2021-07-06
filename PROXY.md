# Proxy instructions

**Important: This page is hard "Work in progress", and I explicitly request support in form of images that describe the process from an end user perspective and all infos. Please support!**

## General process

This library performs 2 functions:
* Running a proxy-server to perform a MITM attack (https://en.wikipedia.org/wiki/Man-in-the-middle_attack) to capture a tokenset
* Using the captured (or saved) tokens to communicate with Daikin Cloud

This file describes the first step.

## MITM-attack
### Starting the Proxy 
Prerequisites: the necessary options in `example.js` are configured according to your situation

* Start the `example.js` file. It opens two ports. 
1. One port for the proxy-server. This is the port you will configure on the client device's proxy settings (default: 8888).
1. The second provides an simple webpage to guide you through the process (default: 8889).
* Open the  webpage (http://<ip>:8889 by default)
  ![Initial Webpage](img/initial_webpage.png)
* Click on first link to get and install the certificate and enable it (see below for client device specific flow)
* When done click on the second Link to login to the Daikin Cloud
* After a successful login the browser should currently (to be optimized) show an error message (or simply stay on a Daikin page or show a blank page) because the last page is not possible to be opened by any browser. BUT if the console shows success that tokens were able to be catched we are already done!

Info: The adapter is not grabbing any username or password, just the created tokens after you logged in.

## Setting up client device

### Windows

#### Firefox

#### Chrome

### macOS

#### Firefox

#### Chrome

#### Safari

### Linux

#### Firefox

#### Chrome

## For mobile Phones

### iOS

**Important: The Proxy is called "NodeMITMProxyCA" and no longer "Anyproxy" since 3.0.0!**

https://youtu.be/bHaL9ftU2zc

#### Install Certificate
![Certificate 1](img/ios_Zertifikat_1.jpg)

![Certificate 2](img/ios_Zertifikat_2.jpg)

![Certificate 3](img/ios_Zertifikat_3.jpg)

![Certificate 4](img/ios_Zertifikat_4.jpg)

**Not done yet!** Make sure iOS fully trusts the certificate. 
You can check and configure this setting at Settings > General > About > Certificate Trust Settings.

![Certificate 5](img/ios_Zertifikat_5.jpg)


#### Enable Proxy
![Proxy 1](img/ios_Proxy_1.jpg)

![Proxy 2](img/ios_Proxy_2.jpg)

![Proxy 3](img/ios_Proxy_3.jpg)

![Proxy 4](img/ios_Proxy_4.jpg)

### Android

https://youtu.be/bHaL9ftU2zc?t=275

**Important: The Proxy is called "NodeMITMProxyCA" ... Screens needs to be updated**

**Important: Some newer Android versions might NOT allow the self signed certificates anymore at all! So if you are sure you did anything correctly, and it is still not working or only SSL errors are in the logs then please try an Android Emulator (see below)!**

#### Install certificate

![Zertifikat](img/Android-Zertifikat.jpg)

Depending on your Android version an installation of the Certificate for "VPN and Apps" OR "Wifi" is needed. AN easy way is to just install it twice (once for both modes) :-)

#### Enable PROXY

![Proxy](img/Android-Proxy.jpg)
