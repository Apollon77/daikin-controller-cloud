const DaikinCloudController = require('../index.js');
const DaikinCloudDevice = require('../lib/device.js');

const testData = require('./test-data.js');

test.each([
	['Stylish', testData.stylish, 'dx23'],
	['Perfera', testData.perfera, 'dx4'],
	['Altherma', testData.altherma, 'Altherma'],
])('Get deviceModel from device %s', async (name, json, model) => {
	const controller = new DaikinCloudController();
	const spy = jest.spyOn(controller, 'getCloudDeviceDetails').mockImplementation(() => {
		return Promise.resolve([json])
	});
	const devices = await controller.getCloudDevices();

	expect(devices[0].getDescription().deviceModel).toEqual(model);

});

test.each([
	['Stylish', testData.stylish, 'climateControl'],
	['Perfera', testData.perfera, 'climateControl'],
	['Altherma', testData.altherma, 'climateControlMainZone'],
])('Get name from device %s', async (name, json, climateControlEmbeddedId) => {
	const controller = new DaikinCloudController();
	const spy = jest.spyOn(controller, 'getCloudDeviceDetails').mockImplementation(() => {
		return Promise.resolve([json])
	});
	const devices = await controller.getCloudDevices();

	expect(devices[0]).toBeInstanceOf(DaikinCloudDevice);
	expect(devices[0].getData(climateControlEmbeddedId, 'name').value).toEqual(name);
});
