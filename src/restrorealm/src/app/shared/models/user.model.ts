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

    street1?: string;

    street2?: string;

    city?: string;

    state?: string;

    postalCode?: number;
}
