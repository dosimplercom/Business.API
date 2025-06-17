// EmailToken DTO
export interface EmailTokenDTO {
    id: number; // Primary key
    entity_id: number; // Foreign key to User table, required
    token: string; // Required, 6-character token
    expires_at: Date; // Expiration timestamp
    created_at: Date; // Defaults to now()
    used: boolean; // Defaults to false
}
export interface EmailTokenCreateDTO {
    entity_id: number;
    token: string;
    expires_at: Date;
    created_at: Date;
    used: boolean;
}