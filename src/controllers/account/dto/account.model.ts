import { DropdownItemExDTO } from "src/shared/models/dropdown.model";

export enum sys_entity_types {
    staff = 1,
    customer = 2,
}
export interface StaffEntityDTO {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    sys_entity_type_id: sys_entity_types;
    is_guest: boolean;
    role_id: number;
}
export interface CustomerDTO {
    id: number;
    first_name: string;
    last_name: string;
    full_name: string;
    is_guest: boolean;
}

export interface StaffEntityCreationResponseCT {
    id: number;
    first_name: string;
    last_name: string;
    url: string;
    user_email: string;
    role_id: number;
    role_name: string;
    role_description: string;
    is_guest: boolean;
    contact_detail: {
        contact_email: string | null,
        contact_phone: string | null
    }
}
export interface AccountListDTO {
    id?: number | null;
    full_name?: string | null;
    first_name: string;
    last_name: string;
    email: string;
    email_verified: boolean;
    url: string;
    role_id: number;
    role: DropdownItemExDTO | null;
}
/////////////////////////



// Account DTO
export interface AccountDTO {
    id: number; // Primary key
    business_id?: number | null; // Foreign key to Business table, optional
    full_name?: string | null; // Optional field
    email: string; // Unique and required
    email_verified: boolean; // Defaults to false
    password: string; // Required
    role_id: number;
    url: string;
    created_at: Date; // Required
    updated_at?: Date | null; // Optional field
}
export interface AccountCreateDTO {
    //  business_id?: number | null; // Foreign key to Business table, optional
    full_name: string;
    email: string;
    //email_verified: boolean;
    password: string;
    role_id: number;
}

export interface AccountInternalDTO {
    business_id?: number | null;
    full_name?: string | null;
    email: string;
    email_verified: boolean;
    password: string;
    role_id: number;
}