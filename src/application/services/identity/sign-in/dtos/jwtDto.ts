export interface JwtDto {
    sub: string;
    roles: string[];
    permissions: JwtPermissionsClaim[];
}

export interface JwtPermissionsClaim {
    code: string;
    name: string;
}