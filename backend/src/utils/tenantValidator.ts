export function validateTenantId(tenantId: string): boolean {
    return /^[a-zA-Z0-9_-]+$/.test(tenantId);
}