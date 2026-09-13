import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import type { RoleFilter } from "@lib/roleFilter";

/** Role dropdown for the admin user list. */
export function RoleFilterSelect({ value, onChange }: { value: RoleFilter; onChange: (r: RoleFilter) => void }) {
  return (
    <FormControl size="small" sx={{ mb: 2, minWidth: 160 }} data-testid="role-filter-wrap">
      <InputLabel id="role-filter-label">Role</InputLabel>
      <Select data-testid="role-filter" labelId="role-filter-label" label="Role" value={value} onChange={(e) => onChange(e.target.value as RoleFilter)}>
        <MenuItem value="all">All roles</MenuItem>
        <MenuItem value="admin">Admins</MenuItem>
        <MenuItem value="seller">Sellers</MenuItem>
        <MenuItem value="customer">Customers</MenuItem>
      </Select>
    </FormControl>
  );
}
