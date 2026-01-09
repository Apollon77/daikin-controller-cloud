import {DAIKIN_MANAGEMENT_POINT_TYPES} from "./values";

type ValueOf<ObjectType, ValueType extends keyof ObjectType = keyof ObjectType> = ObjectType[ValueType];

export type ManagementPointType = ValueOf<typeof DAIKIN_MANAGEMENT_POINT_TYPES>;

export type ManagementPoint = {
	embeddedId: string;
	managementPointType: ManagementPointType;
} & { [index: string]: any };
