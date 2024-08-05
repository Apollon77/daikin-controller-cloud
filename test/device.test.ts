import { DaikinCloudDevice } from "../src/device";
import {stylish, perfera, altherma} from "./test-data";
import {OnectaClient} from "../src/onecta/oidc-client";
import {EventEmitter} from "events";

test('getData() from DaikinCloudDevice', async () => {
	const device = new DaikinCloudDevice(stylish, new OnectaClient({oidcClientId: 'ID', oidcClientSecret: 'SECRET', oidcAuthorizationTimeoutS: 2}, new EventEmitter()));

	expect(device.getData('climateControl', 'name', undefined).value).toEqual('Stylish');
	expect(device.getData('climateControl', 'onOffMode', undefined).value).toEqual('off');
	expect(device.getData('climateControl', 'operationMode', undefined).value).toEqual('auto');
	expect(device.getData('climateControl', 'temperatureControl', '/operationModes/auto/setpoints/roomTemperature').value).toEqual(22);
	expect(device.getData('climateControl', 'fanControl', `/operationModes/auto/fanSpeed/modes/fixed`).value).toEqual(1);
	expect(device.getData('climateControl', 'fanControl', `/operationModes/auto/fanDirection/horizontal/currentMode`).value).toEqual('stop');
	expect(device.getData('climateControl', 'fanControl', `/operationModes/auto/fanDirection/vertical/currentMode`).value).toEqual('swing');
	expect(device.getData('climateControl', 'sensoryData', '/roomTemperature').value).toEqual(24);
	expect(device.getData('climateControl', 'powerfulMode', undefined).value).toEqual('off');
	expect(device.getData('climateControl', 'streamerMode', undefined).value).toEqual('off');
});

test('Update DaikinCloudDevice data', async () => {
	const clientSpy = jest.spyOn(OnectaClient.prototype, 'requestResource').mockResolvedValue({});
	const device = new DaikinCloudDevice(stylish, new OnectaClient({oidcClientId: 'ID', oidcClientSecret: 'SECRET', oidcAuthorizationTimeoutS: 2}, new EventEmitter()));

	await device.setData('climateControl', 'onOffMode', 'on', undefined);
	expect(clientSpy).toHaveBeenCalledWith("/v1/gateway-devices/78001793-f434-45bf-8db1-8f606aa6f844/management-points/climateControl/characteristics/onOffMode", {"body": "{\"value\":\"on\"}", "headers": {"Content-Type": "application/json"}, "method": "PATCH"});
});

test('Update DaikinCloudDevice data, local only', async () => {
	const device = new DaikinCloudDevice(stylish, new OnectaClient({oidcClientId: 'ID', oidcClientSecret: 'SECRET', oidcAuthorizationTimeoutS: 2}, new EventEmitter()));
	expect(device.getData('climateControl', 'onOffMode', undefined).value).toEqual('off');
	device.setLocalData('climateControl', 'onOffMode', 'on', undefined);
	expect(device.getData('climateControl', 'onOffMode', undefined).value).toEqual('on');
});
