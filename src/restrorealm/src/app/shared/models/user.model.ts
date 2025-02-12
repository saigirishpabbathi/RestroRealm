import { Permission } from "./permission.model";

export interface User {

    id?: number;

    name: string;

    email: string;

    dateOfBirth: any;

    password?: string;

    role?: string;

    profilePicture?: string;

    permissionDtoSet?: Permission[];
}
