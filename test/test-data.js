const stylish = {
	"_id": "78001793-f434-45bf-8db1-8f606aa6f844",
	"id": "78001793-f434-45bf-8db1-8f606aa6f844",
	"type": "dx23",
	"deviceModel": "dx23",
	"isCloudConnectionUp": {
		"settable": false,
		"value": true
	},
	"managementPoints": [
		{
			"embeddedId": "gateway",
			"managementPointType": "gateway",
			"managementPointCategory": "secondary",
			"name": {
				"settable": false,
				"maxLength": 32,
				"value": "Gateway"
			},
			"iconId": {
				"settable": false,
				"value": 3
			},
			"timeZone": {
				"settable": false,
				"value": "Europe/Brussels"
			},
			"modelInfo": {
				"settable": false,
				"value": "BRP069B4x"
			},
			"ipAddress": {
				"settable": false,
				"value": "192.168.1.11"
			},
			"macAddress": {
				"settable": false,
				"value": "48:e7:da:02:1f:78"
			},
			"regionCode": {
				"settable": false,
				"value": "eu"
			},
			"ledEnabled": {
				"settable": true,
				"value": false
			},
			"firmwareVersion": {
				"settable": false,
				"value": "1_14_78"
			},
			"isFirmwareUpdateSupported": {
				"settable": false,
				"value": false
			},
			"daylightSavingTimeEnabled": {
				"settable": false,
				"value": true
			},
			"ssid": {
				"settable": false,
				"value": "DaikinAP88985"
			},
			"wifiConnectionSSID": {
				"settable": false,
				"value": "Proximus-Home-B7B0"
			},
			"wifiConnectionStrength": {
				"settable": false,
				"value": -48,
				"maxValue": 0,
				"minValue": -90,
				"stepValue": 1
			}
		},
		{
			"embeddedId": "climateControl",
			"managementPointType": "climateControl",
			"managementPointSubType": "mainZone",
			"managementPointCategory": "primary",
			"onOffMode": {
				"settable": true,
				"values": [
					"on",
					"off"
				],
				"value": "off"
			},
			"name": {
				"settable": true,
				"maxLength": 32,
				"value": "Stylish"
			},
			"iconId": {
				"settable": true,
				"value": 15
			},
			"isHolidayModeActive": {
				"settable": false,
				"value": false
			},
			"isInErrorState": {
				"settable": false,
				"value": false
			},
			"isInModeConflict": {
				"settable": false,
				"value": false
			},
			"errorCode": {
				"settable": false,
				"value": "00"
			},
			"operationMode": {
				"settable": true,
				"values": [
					"auto",
					"dry",
					"cooling",
					"heating",
					"fanOnly"
				],
				"value": "auto"
			},
			"temperatureControl": {
				"ref": "#temperatureControl",
				"settable": true,
				"value": {
					"operationModes": {
						"auto": {
							"setpoints": {
								"roomTemperature": {
									"settable": true,
									"value": 22,
									"minValue": 18,
									"maxValue": 30,
									"stepValue": 0.5
								}
							}
						},
						"cooling": {
							"setpoints": {
								"roomTemperature": {
									"settable": true,
									"value": 25,
									"minValue": 18,
									"maxValue": 32,
									"stepValue": 0.5
								}
							}
						},
						"heating": {
							"setpoints": {
								"roomTemperature": {
									"settable": true,
									"value": 25,
									"minValue": 10,
									"maxValue": 30,
									"stepValue": 0.5
								}
							}
						}
					}
				}
			},
			"sensoryData": {
				"ref": "#sensoryData",
				"settable": false,
				"value": {
					"roomTemperature": {
						"settable": false,
						"value": 24
					},
					"outdoorTemperature": {
						"settable": false,
						"value": 1
					}
				}
			},
			"fanControl": {
				"ref": "#fanControl",
				"settable": true,
				"value": {
					"operationModes": {
						"auto": {
							"fanDirection": {
								"horizontal": {
									"currentMode": {
										"settable": true,
										"value": "stop",
										"values": [
											"stop",
											"swing"
										]
									}
								},
								"vertical": {
									"currentMode": {
										"settable": true,
										"value": "swing",
										"values": [
											"stop",
											"swing"
										]
									}
								}
							},
							"fanSpeed": {
								"currentMode": {
									"settable": true,
									"value": "auto",
									"values": [
										"quiet",
										"auto",
										"fixed"
									]
								},
								"modes": {
									"fixed": {
										"value": 1,
										"settable": true,
										"maxValue": 5,
										"minValue": 1,
										"stepValue": 1
									}
								}
							}
						},
						"dry": {
							"fanDirection": {
								"horizontal": {
									"currentMode": {
										"settable": true,
										"value": "stop",
										"values": [
											"stop",
											"swing"
										]
									}
								},
								"vertical": {
									"currentMode": {
										"settable": true,
										"value": "stop",
										"values": [
											"stop",
											"swing"
										]
									}
								}
							},
							"fanSpeed": {
								"currentMode": {
									"settable": true,
									"value": "auto",
									"values": [
										"auto"
									]
								}
							}
						},
						"cooling": {
							"fanDirection": {
								"horizontal": {
									"currentMode": {
										"settable": true,
										"value": "stop",
										"values": [
											"stop",
											"swing"
										]
									}
								},
								"vertical": {
									"currentMode": {
										"settable": true,
										"value": "stop",
										"values": [
											"stop",
											"swing"
										]
									}
								}
							},
							"fanSpeed": {
								"currentMode": {
									"settable": true,
									"value": "fixed",
									"values": [
										"quiet",
										"auto",
										"fixed"
									]
								},
								"modes": {
									"fixed": {
										"value": 3,
										"settable": true,
										"maxValue": 5,
										"minValue": 1,
										"stepValue": 1
									}
								}
							}
						},
						"heating": {
							"fanDirection": {
								"horizontal": {
									"currentMode": {
										"settable": true,
										"value": "stop",
										"values": [
											"stop",
											"swing"
										]
									}
								},
								"vertical": {
									"currentMode": {
										"settable": true,
										"value": "stop",
										"values": [
											"stop",
											"swing"
										]
									}
								}
							},
							"fanSpeed": {
								"currentMode": {
									"settable": true,
									"value": "fixed",
									"values": [
										"quiet",
										"auto",
										"fixed"
									]
								},
								"modes": {
									"fixed": {
										"value": 3,
										"settable": true,
										"maxValue": 5,
										"minValue": 1,
										"stepValue": 1
									}
								}
							}
						},
						"fanOnly": {
							"fanDirection": {
								"horizontal": {
									"currentMode": {
										"settable": true,
										"value": "stop",
										"values": [
											"stop",
											"swing"
										]
									}
								},
								"vertical": {
									"currentMode": {
										"settable": true,
										"value": "swing",
										"values": [
											"stop",
											"swing"
										]
									}
								}
							},
							"fanSpeed": {
								"currentMode": {
									"settable": true,
									"value": "auto",
									"values": [
										"quiet",
										"auto",
										"fixed"
									]
								},
								"modes": {
									"fixed": {
										"value": 1,
										"settable": true,
										"maxValue": 5,
										"minValue": 1,
										"stepValue": 1
									}
								}
							}
						}
					}
				}
			},
			"schedule": {
				"ref": "#schedule",
				"settable": true,
				"value": {
					"currentMode": {
						"value": "any",
						"settable": true,
						"values": [
							"any"
						]
					},
					"nextAction": {},
					"modes": {
						"any": {
							"currentSchedule": {
								"value": "0",
								"settable": true,
								"values": [
									"0",
									"1",
									"2"
								]
							},
							"enabled": {
								"value": false,
								"settable": true
							},
							"meta": {
								"minIntervalBetweenActions": "00:01:00",
								"maxSchedules": 1,
								"maxActionsPerActionPeriod": 6,
								"consecutiveActionsAllowed": true,
								"actionTypes": {
									"operationMode": {
										"settable": false,
										"values": [
											"auto",
											"dry",
											"cooling",
											"heating",
											"fanOnly",
											"off"
										]
									},
									"roomTemperature": {
										"auto": {
											"settable": false,
											"stepValue": 0.5,
											"minValue": 18,
											"maxValue": 30
										},
										"cooling": {
											"settable": false,
											"stepValue": 0.5,
											"minValue": 18,
											"maxValue": 32
										},
										"heating": {
											"settable": false,
											"stepValue": 0.5,
											"minValue": 10,
											"maxValue": 30
										}
									},
									"fanSpeed": {
										"auto": {
											"currentMode": {
												"values": [
													"quiet",
													"auto",
													"fixed"
												],
												"settable": false
											},
											"modes": {
												"fixed": {
													"settable": false,
													"maxValue": 5,
													"minValue": 1,
													"stepValue": 1
												}
											}
										},
										"dry": {
											"currentMode": {
												"values": [
													"auto"
												],
												"settable": false
											}
										},
										"cooling": {
											"currentMode": {
												"values": [
													"quiet",
													"auto",
													"fixed"
												],
												"settable": false
											},
											"modes": {
												"fixed": {
													"settable": false,
													"maxValue": 5,
													"minValue": 1,
													"stepValue": 1
												}
											}
										},
										"heating": {
											"currentMode": {
												"values": [
													"quiet",
													"auto",
													"fixed"
												],
												"settable": false
											},
											"modes": {
												"fixed": {
													"settable": false,
													"maxValue": 5,
													"minValue": 1,
													"stepValue": 1
												}
											}
										},
										"fanOnly": {
											"currentMode": {
												"values": [
													"quiet",
													"auto",
													"fixed"
												],
												"settable": false
											},
											"modes": {
												"fixed": {
													"settable": false,
													"maxValue": 5,
													"minValue": 1,
													"stepValue": 1
												}
											}
										}
									}
								}
							},
							"schedules": {
								"0": {
									"name": {
										"settable": true,
										"value": "",
										"maxLength": 32
									},
									"meta": {
										"isReadOnly": false,
										"actionPeriods": [
											"monday",
											"tuesday",
											"wednesday",
											"thursday",
											"friday",
											"saturday",
											"sunday"
										]
									},
									"actions": {},
									"settable": true
								},
								"1": {
									"name": {
										"settable": true,
										"value": "",
										"maxLength": 32
									},
									"meta": {
										"isReadOnly": false,
										"actionPeriods": [
											"monday",
											"tuesday",
											"wednesday",
											"thursday",
											"friday",
											"saturday",
											"sunday"
										]
									},
									"actions": {},
									"settable": true
								},
								"2": {
									"name": {
										"settable": true,
										"value": "",
										"maxLength": 32
									},
									"meta": {
										"isReadOnly": false,
										"actionPeriods": [
											"monday",
											"tuesday",
											"wednesday",
											"thursday",
											"friday",
											"saturday",
											"sunday"
										]
									},
									"actions": {},
									"settable": true
								}
							}
						}
					}
				}
			},
			"isPowerfulModeActive": {
				"settable": false,
				"value": false
			},
			"powerfulMode": {
				"settable": true,
				"values": [
					"on",
					"off"
				],
				"value": "off"
			},
			"streamerMode": {
				"settable": true,
				"values": [
					"off",
					"on"
				],
				"value": "off"
			},
			"consumptionData": {
				"ref": "#consumptionData",
				"settable": false,
				"value": {
					"electrical": {
						"unit": "kWh",
						"heating": {
							"d": [
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0
							],
							"w": [
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								null,
								null,
								null,
								null,
								null
							],
							"m": [
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0.3,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0
							]
						},
						"cooling": {
							"d": [
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0.1,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0.1,
								0,
								0,
								0,
								0
							],
							"w": [
								0.1,
								0.2,
								0.1,
								0.1,
								0.1,
								0.1,
								0.2,
								0.1,
								0.1,
								null,
								null,
								null,
								null,
								null
							],
							"m": [
								0,
								0,
								0,
								0,
								0,
								0,
								1.5,
								8.7,
								3.5,
								3.8,
								3.6,
								3.8,
								3.7,
								3.4,
								0.8,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0
							]
						}
					}
				}
			},
			"holidayMode": {
				"ref": "#holidayMode",
				"settable": true,
				"value": {
					"enabled": false
				}
			},
			"demandControl": {
				"ref": "#demandControl",
				"settable": true,
				"value": {
					"currentMode": {
						"value": "off",
						"settable": true,
						"values": [
							"off",
							"auto",
							"fixed",
							"scheduled"
						]
					},
					"modes": {
						"fixed": {
							"stepValue": 5,
							"value": 100,
							"minValue": 40,
							"maxValue": 100,
							"settable": true
						},
						"scheduled": {
							"settable": true,
							"meta": {
								"minIntervalBetweenActions": "00:01:00",
								"maxActionsPerActionPeriod": 4,
								"consecutiveActionsAllowed": true,
								"actionPeriods": [
									"monday",
									"tuesday",
									"wednesday",
									"thursday",
									"friday",
									"saturday",
									"sunday"
								],
								"actionTypes": {
									"currentMode": {
										"settable": true,
										"values": [
											"off",
											"fixed"
										]
									},
									"modes": {
										"fixed": {
											"stepValue": 5,
											"minValue": 40,
											"maxValue": 100,
											"settable": true
										}
									}
								}
							},
							"value": {
								"actions": {}
							}
						}
					}
				}
			}
		},
		{
			"embeddedId": "indoorUnit",
			"managementPointType": "indoorUnit",
			"managementPointCategory": "secondary",
			"name": {
				"settable": false,
				"maxLength": 32,
				"value": "Indoor Unit"
			},
			"iconId": {
				"settable": false,
				"value": 4
			},
			"softwareVersion": {
				"settable": false,
				"value": "3.30"
			}
		}
	],
	"embeddedId": "2eb41416-9559-4e0e-9bfa-b63630a172d1",
	"timestamp": "2023-03-07T18:57:22.238Z",
	"lastUpdateReceived": "2023-03-07T18:57:22.238Z"
};
const perfera = {
	"_id": "fa8397fe-b23f-465b-b8b9-90bf15f565fa",
	"type": "dx4",
	"deviceModel": "dx4",
	"isCloudConnectionUp": {
		"settable": false,
		"value": true
	},
	"managementPoints": [
		{
			"embeddedId": "gateway",
			"managementPointType": "gateway",
			"managementPointCategory": "secondary",
			"daylightSavingTimeEnabled": {
				"settable": true,
				"value": true
			},
			"errorCode": {
				"settable": false,
				"value": ""
			},
			"firmwareVersion": {
				"settable": false,
				"value": "1_23_0"
			},
			"isFirmwareUpdateSupported": {
				"settable": false,
				"value": false
			},
			"isInErrorState": {
				"settable": false,
				"value": false
			},
			"ledEnabled": {
				"settable": true,
				"value": false
			},
			"macAddress": {
				"settable": false,
				"value": "04:c4:61:c0:e0:8c"
			},
			"modelInfo": {
				"settable": false,
				"value": "BRP069C4x"
			},
			"regionCode": {
				"settable": false,
				"value": "eu"
			},
			"serialNumber": {
				"settable": false,
				"value": "0000000004779266"
			},
			"ssid": {
				"settable": false,
				"value": "DaikinAP55656"
			},
			"timeZone": {
				"settable": true,
				"value": "Europe/Brussels"
			},
			"wifiConnectionSSID": {
				"settable": false,
				"value": "TP-Link_7C88"
			},
			"wifiConnectionStrength": {
				"settable": false,
				"value": -44,
				"maxValue": 0,
				"minValue": -90,
				"stepValue": 1
			}
		},
		{
			"embeddedId": "climateControl",
			"managementPointType": "climateControl",
			"managementPointSubType": "mainZone",
			"managementPointCategory": "primary",
			"consumptionData": {
				"ref": "#consumptionData",
				"settable": false,
				"value": {
					"electrical": {
						"unit": "kWh",
						"heating": {
							"d": [
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0
							],
							"w": [
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								null,
								null,
								null,
								null,
								null
							],
							"m": [
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0.5,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0
							]
						},
						"cooling": {
							"d": [
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0.1,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0.1,
								0,
								0,
								0,
								0,
								0
							],
							"w": [
								0.1,
								0.2,
								0.1,
								0.1,
								0.1,
								0.1,
								0.2,
								0.1,
								0.1,
								null,
								null,
								null,
								null,
								null
							],
							"m": [
								0,
								0,
								0,
								0,
								0,
								0,
								1.4,
								5.7,
								3.5,
								3.8,
								3.6,
								3.8,
								3.7,
								3.4,
								0.8,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0
							]
						}
					}
				}
			},
			"demandControl": {
				"ref": "#demandControl",
				"settable": true,
				"value": {
					"currentMode": {
						"value": "off",
						"settable": true,
						"values": [
							"off",
							"auto",
							"fixed",
							"scheduled"
						]
					},
					"modes": {
						"fixed": {
							"stepValue": 5,
							"value": 100,
							"minValue": 40,
							"maxValue": 100,
							"settable": true
						},
						"scheduled": {
							"settable": true,
							"meta": {
								"minIntervalBetweenActions": "00:01:00",
								"maxActionsPerActionPeriod": 4,
								"consecutiveActionsAllowed": true,
								"actionPeriods": [
									"monday",
									"tuesday",
									"wednesday",
									"thursday",
									"friday",
									"saturday",
									"sunday"
								],
								"actionTypes": {
									"currentMode": {
										"settable": true,
										"values": [
											"off",
											"fixed"
										]
									},
									"modes": {
										"fixed": {
											"stepValue": 5,
											"minValue": 40,
											"maxValue": 100,
											"settable": true
										}
									}
								}
							},
							"value": {
								"actions": {}
							}
						}
					}
				}
			},
			"econoMode": {
				"settable": true,
				"values": [
					"on",
					"off"
				],
				"value": "off"
			},
			"errorCode": {
				"settable": false,
				"value": "A5-"
			},
			"fanControl": {
				"ref": "#fanControl",
				"settable": true,
				"value": {
					"operationModes": {
						"heating": {
							"fanSpeed": {
								"currentMode": {
									"value": "fixed",
									"settable": true,
									"values": [
										"auto",
										"quiet",
										"fixed"
									]
								},
								"modes": {
									"fixed": {
										"value": 1,
										"stepValue": 1,
										"minValue": 1,
										"maxValue": 5,
										"settable": true
									}
								}
							},
							"fanDirection": {
								"horizontal": {
									"currentMode": {
										"value": "swing",
										"settable": true,
										"values": [
											"stop",
											"swing"
										]
									}
								},
								"vertical": {
									"currentMode": {
										"value": "stop",
										"settable": true,
										"values": [
											"stop",
											"swing",
											"windNice"
										]
									}
								}
							}
						},
						"cooling": {
							"fanSpeed": {
								"currentMode": {
									"value": "auto",
									"settable": true,
									"values": [
										"auto",
										"quiet",
										"fixed"
									]
								},
								"modes": {
									"fixed": {
										"value": 1,
										"stepValue": 1,
										"minValue": 1,
										"maxValue": 5,
										"settable": true
									}
								}
							},
							"fanDirection": {
								"horizontal": {
									"currentMode": {
										"value": "stop",
										"settable": true,
										"values": [
											"stop",
											"swing"
										]
									}
								},
								"vertical": {
									"currentMode": {
										"value": "stop",
										"settable": true,
										"values": [
											"stop",
											"swing",
											"windNice"
										]
									}
								}
							}
						},
						"auto": {
							"fanSpeed": {
								"currentMode": {
									"value": "fixed",
									"settable": true,
									"values": [
										"auto",
										"quiet",
										"fixed"
									]
								},
								"modes": {
									"fixed": {
										"value": 1,
										"stepValue": 1,
										"minValue": 1,
										"maxValue": 5,
										"settable": true
									}
								}
							},
							"fanDirection": {
								"horizontal": {
									"currentMode": {
										"value": "swing",
										"settable": true,
										"values": [
											"stop",
											"swing"
										]
									}
								},
								"vertical": {
									"currentMode": {
										"value": "stop",
										"settable": true,
										"values": [
											"stop",
											"swing",
											"windNice"
										]
									}
								}
							}
						},
						"dry": {
							"fanSpeed": {
								"currentMode": {
									"value": "auto",
									"settable": true,
									"values": [
										"auto"
									]
								}
							},
							"fanDirection": {
								"horizontal": {
									"currentMode": {
										"value": "stop",
										"settable": true,
										"values": [
											"stop",
											"swing"
										]
									}
								},
								"vertical": {
									"currentMode": {
										"value": "stop",
										"settable": true,
										"values": [
											"stop",
											"swing",
											"windNice"
										]
									}
								}
							}
						},
						"fanOnly": {
							"fanSpeed": {
								"currentMode": {
									"value": "fixed",
									"settable": true,
									"values": [
										"auto",
										"quiet",
										"fixed"
									]
								},
								"modes": {
									"fixed": {
										"value": 1,
										"stepValue": 1,
										"minValue": 1,
										"maxValue": 5,
										"settable": true
									}
								}
							},
							"fanDirection": {
								"horizontal": {
									"currentMode": {
										"value": "swing",
										"settable": true,
										"values": [
											"stop",
											"swing"
										]
									}
								},
								"vertical": {
									"currentMode": {
										"value": "stop",
										"settable": true,
										"values": [
											"stop",
											"swing"
										]
									}
								}
							}
						}
					}
				}
			},
			"holidayMode": {
				"ref": "#holidayMode",
				"settable": true,
				"value": {
					"enabled": false
				}
			},
			"iconId": {
				"settable": true,
				"maxValue": 255,
				"minValue": 0,
				"value": 15
			},
			"isCoolHeatMaster": {
				"settable": false,
				"value": true
			},
			"isHolidayModeActive": {
				"settable": false,
				"value": false
			},
			"isInCautionState": {
				"settable": false,
				"value": false
			},
			"isInErrorState": {
				"settable": false,
				"value": false
			},
			"isInModeConflict": {
				"settable": false,
				"value": false
			},
			"isInWarningState": {
				"settable": false,
				"value": false
			},
			"isLockFunctionEnabled": {
				"settable": false,
				"value": false
			},
			"name": {
				"settable": true,
				"maxLength": 20,
				"value": "Perfera"
			},
			"onOffMode": {
				"settable": true,
				"values": [
					"on",
					"off"
				],
				"value": "off"
			},
			"operationMode": {
				"settable": true,
				"value": "auto",
				"values": [
					"fanOnly",
					"heating",
					"cooling",
					"auto",
					"dry"
				]
			},
			"outdoorSilentMode": {
				"settable": false,
				"values": [
					"on",
					"off"
				],
				"value": "off"
			},
			"powerfulMode": {
				"settable": true,
				"values": [
					"on",
					"off"
				],
				"value": "off"
			},
			"isPowerfulModeActive": {
				"settable": false,
				"value": false
			},
			"schedule": {
				"ref": "#schedule",
				"settable": true,
				"value": {
					"currentMode": {
						"value": "any",
						"settable": true,
						"values": [
							"any"
						]
					},
					"nextAction": {},
					"modes": {
						"any": {
							"currentSchedule": {
								"value": "0",
								"settable": true,
								"values": [
									"0"
								]
							},
							"enabled": {
								"value": false,
								"settable": true
							},
							"meta": {
								"minIntervalBetweenActions": "00:01:00",
								"maxSchedules": 1,
								"maxActionsPerActionPeriod": 6,
								"consecutiveActionsAllowed": true,
								"actionTypes": {
									"operationMode": {
										"settable": false,
										"values": [
											"fanOnly",
											"heating",
											"cooling",
											"auto",
											"dry",
											"off"
										]
									},
									"roomTemperature": {
										"heating": {
											"settable": false,
											"stepValue": 0.5,
											"minValue": 10,
											"maxValue": 31
										},
										"cooling": {
											"settable": false,
											"stepValue": 0.5,
											"minValue": 18,
											"maxValue": 33
										},
										"auto": {
											"settable": false,
											"stepValue": 0.5,
											"minValue": 18,
											"maxValue": 30
										}
									},
									"fanSpeed": {
										"heating": {
											"currentMode": {
												"settable": false,
												"values": [
													"auto",
													"quiet",
													"fixed"
												]
											},
											"modes": {
												"fixed": {
													"stepValue": 1,
													"minValue": 1,
													"maxValue": 5,
													"settable": false
												}
											}
										},
										"cooling": {
											"currentMode": {
												"settable": false,
												"values": [
													"auto",
													"quiet",
													"fixed"
												]
											},
											"modes": {
												"fixed": {
													"stepValue": 1,
													"minValue": 1,
													"maxValue": 5,
													"settable": false
												}
											}
										},
										"auto": {
											"currentMode": {
												"settable": false,
												"values": [
													"auto",
													"quiet",
													"fixed"
												]
											},
											"modes": {
												"fixed": {
													"stepValue": 1,
													"minValue": 1,
													"maxValue": 5,
													"settable": false
												}
											}
										},
										"dry": {
											"currentMode": {
												"settable": false,
												"values": [
													"auto"
												]
											}
										},
										"fanOnly": {
											"currentMode": {
												"settable": false,
												"values": [
													"auto",
													"quiet",
													"fixed"
												]
											},
											"modes": {
												"fixed": {
													"stepValue": 1,
													"minValue": 1,
													"maxValue": 5,
													"settable": false
												}
											}
										}
									},
									"econoMode": {
										"settable": false,
										"values": [
											"on",
											"off"
										]
									}
								}
							},
							"schedules": {
								"0": {
									"name": {
										"maxLength": 32,
										"settable": true,
										"value": ""
									},
									"meta": {
										"actionPeriods": [
											"monday",
											"tuesday",
											"wednesday",
											"thursday",
											"friday",
											"saturday",
											"sunday"
										],
										"isReadOnly": false
									},
									"actions": {},
									"settable": true
								}
							}
						}
					}
				}
			},
			"sensoryData": {
				"ref": "#sensoryData",
				"settable": false,
				"value": {
					"roomTemperature": {
						"settable": false,
						"unit": "°C",
						"value": 20,
						"stepValue": 1,
						"minValue": -25,
						"maxValue": 50
					},
					"outdoorTemperature": {
						"settable": false,
						"unit": "°C",
						"value": 1.5,
						"stepValue": 0.5,
						"minValue": -25,
						"maxValue": 50
					}
				}
			},
			"streamerMode": {
				"settable": true,
				"values": [
					"on",
					"off"
				],
				"value": "off"
			},
			"temperatureControl": {
				"ref": "#temperatureControl",
				"settable": true,
				"value": {
					"operationModes": {
						"heating": {
							"setpoints": {
								"roomTemperature": {
									"settable": true,
									"value": 22,
									"unit": "°C",
									"stepValue": 0.5,
									"minValue": 10,
									"maxValue": 31
								}
							}
						},
						"cooling": {
							"setpoints": {
								"roomTemperature": {
									"settable": true,
									"value": 25,
									"unit": "°C",
									"stepValue": 0.5,
									"minValue": 18,
									"maxValue": 33
								}
							}
						},
						"auto": {
							"setpoints": {
								"roomTemperature": {
									"settable": true,
									"value": 18,
									"unit": "°C",
									"stepValue": 0.5,
									"minValue": 18,
									"maxValue": 30
								}
							}
						}
					}
				}
			}
		},
		{
			"embeddedId": "indoorUnit",
			"managementPointType": "indoorUnit",
			"managementPointCategory": "secondary",
			"softwareVersion": {
				"settable": false,
				"value": "20003002"
			},
			"eepromVersion": {
				"settable": false,
				"value": "12FD"
			},
			"dryKeepSetting": {
				"settable": false,
				"values": [
					"on",
					"off"
				],
				"value": "on"
			}
		},
		{
			"embeddedId": "outdoorUnit",
			"managementPointType": "outdoorUnit",
			"managementPointCategory": "secondary",
			"errorCode": {
				"settable": false,
				"value": "00-"
			},
			"isInErrorState": {
				"settable": false,
				"value": false
			},
			"isInWarningState": {
				"settable": false,
				"value": false
			},
			"isInCautionState": {
				"settable": false,
				"value": false
			}
		}
	],
	"embeddedId": "564116",
	"timestamp": "2023-03-07T19:14:40.746Z",
	"id": "fa8397fe-b23f-465b-b8b9-90bf15f565fa",
	"lastUpdateReceived": "2023-03-07T19:14:40.746Z"
};
const altherma = {
	"_id": "10b029e7-484c-4519-b22e-c14be4b7a71c",
	"deviceModel": "Altherma",
	"type": "heating-wlan",
	"isCloudConnectionUp": {
		"settable": false,
		"value": true
	},
	"managementPoints": [
		{
			"embeddedId": "gateway",
			"managementPointType": "gateway",
			"managementPointCategory": "secondary",
			"firmwareVersion": {
				"settable": false,
				"value": "3.2.4",
				"maxLength": 8
			},
			"ipAddress": {
				"settable": false,
				"value": "192.168.1.10",
				"maxLength": 15
			},
			"iconId": {
				"settable": true,
				"requiresReboot": false,
				"value": 3
			},
			"isFirmwareUpdateSupported": {
				"settable": false,
				"requiresReboot": false,
				"value": true
			},
			"macAddress": {
				"settable": false,
				"value": "48:e7:da:01:c6:08",
				"maxLength": 17
			},
			"modelInfo": {
				"settable": false,
				"value": "BRP069A78",
				"maxLength": 9
			},
			"name": {
				"settable": true,
				"requiresReboot": false,
				"value": "Gateway",
				"maxLength": 63
			},
			"ssid": {
				"settable": false,
				"requiresReboot": false,
				"value": "daikin-ap",
				"maxLength": 9
			},
			"serialNumber": {
				"settable": false,
				"value": "0060691",
				"maxLength": 16
			},
			"wifiConnectionSSID": {
				"settable": false,
				"requiresReboot": false,
				"value": "Proximus-Home-B7B0",
				"maxLength": 32
			},
			"wifiConnectionStrength": {
				"settable": false,
				"requiresReboot": false,
				"value": -29,
				"maxValue": 0,
				"minValue": -90,
				"stepValue": 1
			}
		},
		{
			"embeddedId": "climateControlMainZone",
			"managementPointType": "climateControl",
			"managementPointCategory": "primary",
			"managementPointSubType": "mainZone",
			"consumptionData": {
				"settable": false,
				"requiresReboot": false,
				"ref": "#consumptionData",
				"value": {
					"electrical": {
						"heating": {
							"d": [
								2,
								0,
								0,
								1,
								4,
								2,
								0,
								0,
								0,
								0,
								4,
								2,
								0,
								0,
								0,
								4,
								2,
								1,
								0,
								0,
								1,
								null,
								null,
								null
							],
							"w": [
								14,
								11,
								19,
								13,
								25,
								15,
								12,
								15,
								8,
								null,
								null,
								null,
								null,
								null
							],
							"m": [
								null,
								null,
								228,
								273,
								28,
								21,
								0,
								0,
								48,
								96,
								220,
								565,
								437,
								320,
								107,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null
							]
						}
					}
				}
			},
			"controlMode": {
				"settable": false,
				"requiresReboot": false,
				"value": "roomTemperature",
				"values": [
					"leavingWaterTemperature",
					"externalRoomTemperature",
					"roomTemperature"
				]
			},
			"errorCode": {
				"settable": false,
				"requiresReboot": false,
				"value": "",
				"maxLength": 16
			},
			"holidayMode": {
				"settable": true,
				"requiresReboot": false,
				"ref": "#holidayMode",
				"value": {
					"enabled": false,
					"startDate": "2017-01-01",
					"endDate": "2017-01-01"
				}
			},
			"iconId": {
				"settable": true,
				"requiresReboot": false,
				"value": 8
			},
			"isHolidayModeActive": {
				"settable": false,
				"requiresReboot": false,
				"value": false
			},
			"isInEmergencyState": {
				"settable": false,
				"requiresReboot": false,
				"value": false
			},
			"isInErrorState": {
				"settable": false,
				"requiresReboot": false,
				"value": false
			},
			"isInInstallerState": {
				"settable": false,
				"requiresReboot": false,
				"value": false
			},
			"isInWarningState": {
				"settable": false,
				"requiresReboot": false,
				"value": false
			},
			"name": {
				"settable": true,
				"requiresReboot": false,
				"value": "Altherma",
				"maxLength": 63
			},
			"onOffMode": {
				"settable": true,
				"requiresReboot": false,
				"value": "on",
				"values": [
					"off",
					"on"
				]
			},
			"operationMode": {
				"settable": false,
				"requiresReboot": false,
				"value": "heating",
				"values": [
					"heating"
				]
			},
			"schedule": {
				"settable": true,
				"ref": "#schedule",
				"value": {
					"currentMode": {
						"settable": false,
						"value": "heating",
						"values": [
							"heating"
						]
					},
					"modes": {
						"heating": {
							"enabled": {
								"settable": true,
								"requiresReboot": false,
								"value": true
							},
							"currentSchedule": {
								"settable": true,
								"requiresReboot": false,
								"value": "scheduleHeatingRT1",
								"values": [
									"scheduleHeatingRT1",
									"scheduleHeatingRT2",
									"scheduleHeatingRT3"
								]
							},
							"meta": {
								"minIntervalBetweenActions": "00:10:00",
								"maxSchedules": 3,
								"maxActionsPerActionPeriod": 6,
								"consecutiveActionsAllowed": true,
								"actionTypes": {
									"roomTemperature": {
										"settable": false,
										"maxValue": 30,
										"minValue": 12,
										"stepValue": 1
									}
								}
							},
							"schedules": {
								"scheduleHeatingRT1": {
									"settable": true,
									"name": {
										"settable": true,
										"requiresReboot": false,
										"value": "User defined 1"
									},
									"meta": {
										"isReadOnly": false,
										"actionPeriods": [
											"monday",
											"tuesday",
											"wednesday",
											"thursday",
											"friday",
											"saturday",
											"sunday"
										]
									},
									"actions": {}
								},
								"scheduleHeatingRT2": {
									"settable": true,
									"name": {
										"settable": true,
										"requiresReboot": false,
										"value": "User defined 2"
									},
									"meta": {
										"isReadOnly": false,
										"actionPeriods": [
											"monday",
											"tuesday",
											"wednesday",
											"thursday",
											"friday",
											"saturday",
											"sunday"
										]
									},
									"actions": {}
								},
								"scheduleHeatingRT3": {
									"settable": true,
									"name": {
										"settable": true,
										"requiresReboot": false,
										"value": "User defined 3"
									},
									"meta": {
										"isReadOnly": false,
										"actionPeriods": [
											"monday",
											"tuesday",
											"wednesday",
											"thursday",
											"friday",
											"saturday",
											"sunday"
										]
									},
									"actions": {}
								}
							}
						}
					}
				}
			},
			"sensoryData": {
				"settable": false,
				"ref": "#sensoryData",
				"value": {
					"roomTemperature": {
						"settable": false,
						"requiresReboot": false,
						"value": 22.4,
						"maxValue": 127,
						"minValue": -127,
						"stepValue": 0.1
					},
					"outdoorTemperature": {
						"settable": false,
						"requiresReboot": false,
						"value": 4,
						"maxValue": 127,
						"minValue": -127,
						"stepValue": 1
					},
					"leavingWaterTemperature": {
						"settable": false,
						"requiresReboot": false,
						"value": 35,
						"maxValue": 127,
						"minValue": -127,
						"stepValue": 1
					}
				}
			},
			"setpointMode": {
				"settable": false,
				"requiresReboot": true,
				"value": "weatherDependent",
				"values": [
					"fixed",
					"weatherDependent"
				]
			},
			"temperatureControl": {
				"settable": true,
				"ref": "#temperatureControl",
				"value": {
					"operationModes": {
						"auto": {
							"setpoints": {
								"roomTemperature": {
									"settable": true,
									"requiresReboot": false,
									"value": 22,
									"maxValue": 30,
									"minValue": 12,
									"stepValue": 0.5
								},
								"leavingWaterOffset": {
									"settable": true,
									"requiresReboot": false,
									"value": 0,
									"maxValue": 10,
									"minValue": -10,
									"stepValue": 1
								}
							}
						},
						"heating": {
							"setpoints": {
								"roomTemperature": {
									"settable": true,
									"requiresReboot": false,
									"value": 22,
									"maxValue": 30,
									"minValue": 12,
									"stepValue": 0.5
								},
								"leavingWaterOffset": {
									"settable": true,
									"requiresReboot": false,
									"value": 0,
									"maxValue": 10,
									"minValue": -10,
									"stepValue": 1
								}
							}
						},
						"cooling": {
							"setpoints": {}
						}
					}
				}
			}
		},
		{
			"embeddedId": "domesticHotWaterTank",
			"managementPointType": "domesticHotWaterTank",
			"managementPointCategory": "primary",
			"consumptionData": {
				"settable": false,
				"requiresReboot": false,
				"ref": "#consumptionData",
				"value": {
					"electrical": {
						"heating": {
							"d": [
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								1,
								1,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								1,
								null,
								null,
								null
							],
							"w": [
								2,
								2,
								2,
								1,
								0,
								1,
								2,
								2,
								1,
								null,
								null,
								null,
								null,
								null
							],
							"m": [
								null,
								null,
								15,
								23,
								22,
								23,
								22,
								17,
								20,
								23,
								25,
								36,
								38,
								36,
								9,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null
							]
						}
					}
				}
			},
			"errorCode": {
				"settable": false,
				"requiresReboot": false,
				"value": "",
				"maxLength": 16
			},
			"heatupMode": {
				"settable": false,
				"requiresReboot": true,
				"value": "reheatOnly",
				"values": [
					"reheatOnly",
					"reheatSchedule",
					"scheduleOnly"
				]
			},
			"iconId": {
				"settable": true,
				"requiresReboot": false,
				"value": 9
			},
			"isHolidayModeActive": {
				"settable": false,
				"requiresReboot": false,
				"value": false
			},
			"isInEmergencyState": {
				"settable": false,
				"requiresReboot": false,
				"value": false
			},
			"isInErrorState": {
				"settable": false,
				"requiresReboot": false,
				"value": false
			},
			"isInInstallerState": {
				"settable": false,
				"requiresReboot": false,
				"value": false
			},
			"isInWarningState": {
				"settable": false,
				"requiresReboot": false,
				"value": false
			},
			"isPowerfulModeActive": {
				"settable": false,
				"requiresReboot": false,
				"value": false
			},
			"name": {
				"settable": true,
				"requiresReboot": false,
				"value": "",
				"maxLength": 63
			},
			"onOffMode": {
				"settable": true,
				"requiresReboot": false,
				"value": "on",
				"values": [
					"off",
					"on"
				]
			},
			"operationMode": {
				"settable": false,
				"value": "heating",
				"values": [
					"heating"
				]
			},
			"powerfulMode": {
				"settable": true,
				"requiresReboot": false,
				"value": "off",
				"values": [
					"off",
					"on"
				]
			},
			"sensoryData": {
				"settable": false,
				"ref": "#sensoryData",
				"value": {
					"tankTemperature": {
						"settable": false,
						"requiresReboot": false,
						"value": 48,
						"maxValue": 127,
						"minValue": -127,
						"stepValue": 1
					}
				}
			},
			"setpointMode": {
				"settable": false,
				"requiresReboot": false,
				"value": "fixed",
				"values": [
					"fixed",
					"weatherDependent"
				]
			},
			"temperatureControl": {
				"settable": true,
				"ref": "#temperatureControl",
				"value": {
					"operationModes": {
						"heating": {
							"setpoints": {
								"domesticHotWaterTemperature": {
									"settable": true,
									"requiresReboot": false,
									"value": 48,
									"maxValue": 60,
									"minValue": 30,
									"stepValue": 1
								}
							}
						}
					}
				}
			}
		},
		{
			"embeddedId": "indoorUnitHydro",
			"managementPointType": "indoorUnitHydro",
			"managementPointCategory": "secondary",
			"eepromVersion": {
				"settable": false,
				"requiresReboot": false,
				"value": "3608726-66C",
				"maxLength": 16
			},
			"iconId": {
				"settable": true,
				"requiresReboot": false,
				"value": 4
			},
			"modelInfo": {
				"settable": false,
				"requiresReboot": false,
				"value": "EHVH08S23EJ9W",
				"maxLength": 16
			},
			"name": {
				"settable": true,
				"requiresReboot": false,
				"value": "Indoor Hydro Unit",
				"maxLength": 63
			},
			"softwareVersion": {
				"settable": false,
				"requiresReboot": false,
				"value": "0222",
				"maxLength": 16
			}
		},
		{
			"embeddedId": "outdoorUnit",
			"managementPointType": "outdoorUnit",
			"managementPointCategory": "secondary",
			"iconId": {
				"settable": true,
				"requiresReboot": false,
				"value": 5
			},
			"name": {
				"settable": true,
				"requiresReboot": false,
				"value": "Outdoor Unit",
				"maxLength": 63
			},
			"softwareVersion": {
				"settable": false,
				"requiresReboot": false,
				"value": "FFFF",
				"maxLength": 16
			}
		},
		{
			"embeddedId": "userInterface",
			"managementPointType": "userInterface",
			"managementPointCategory": "secondary",
			"dateTime": {
				"settable": false,
				"requiresReboot": false,
				"value": "2023-03-07T18:17:27"
			},
			"firmwareVersion": {
				"settable": false,
				"requiresReboot": false,
				"deprecated": "DEPRECATED",
				"value": "6.9.0",
				"maxLength": 16
			},
			"iconId": {
				"settable": true,
				"requiresReboot": false,
				"value": 6
			},
			"miconId": {
				"settable": false,
				"requiresReboot": false,
				"value": "20010E05",
				"maxLength": 16
			},
			"modelInfo": {
				"settable": false,
				"requiresReboot": false,
				"value": "EHVH08S23EJ9W",
				"maxLength": 16
			},
			"name": {
				"settable": true,
				"requiresReboot": false,
				"value": "User Interface",
				"maxLength": 63
			},
			"softwareVersion": {
				"settable": false,
				"requiresReboot": false,
				"value": "6.9.0",
				"maxLength": 16
			}
		}
	],
	"embeddedId": "e1bac939-1495-4803-a6a3-ca2f9388c8ad",
	"timestamp": "2023-03-07T19:01:39.983Z",
	"id": "10b029e7-484c-4519-b22e-c14be4b7a71c",
	"lastUpdateReceived": "2023-03-07T19:01:39.983Z"
};

module.exports = {
	stylish, perfera, altherma
}
