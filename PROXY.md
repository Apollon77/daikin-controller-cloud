# Proxy instructions

**Important: This page is hard "Work in progress", and I explicitly request support in form of images that describe the process from an end user perspective and all infos. Please support!**

## General process

* start the Proxy. It opens two ports. One port to be set as the Network/Browser proxy on the device where you want to access it. The second provides an simple webpage to start.
* Open the provided webpage (http://<ip>:8889 by default)
* click on First link to get and install the certificate and enable it and such (see below)
* When done click on the second Link to login to the Daikin Cloud
* After a successful login the browser should currently (to be optimized) show an error message (or simply stay on a Daikin page or show a blank page) because the last page is not possible to be opened by any browser. BUT if the console shows success that tokens were able to be catched we are already done!

Info: The adapter is not grabbing any username or password, just the created tokens after you logged in.

TODO: (Support wanted) Describe that whole cert stuff for all sorts of browsers and OS and such


## For PCs

In general like https://www.charlesproxy.com/documentation/using-charles/ssl-certificates/ but not with the charles certificate, but the one provided by our Webserver

### Windows

#### Firefox

#### Chrome

### macOS

#### Firefox

#### Chrome

### Safari

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
