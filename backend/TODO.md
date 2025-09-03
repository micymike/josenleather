# TODO: Fix Supabase Storage RLS Error for Product Image Upload

- [x] Analyze ProductService.create to determine affected table/bucket
- [x] Check for RLS policy definitions in codebase
- [x] Confirm storage bucket and table mapping
- [ ] Update Supabase Storage RLS policy for 'product' bucket
- [ ] Test image upload functionality
- [ ] Verify error is resolved

## Instructions for Updating Supabase Storage RLS Policy

1. Go to the Supabase dashboard.
2. Navigate to Storage > product bucket > Policies.
3. Add or update a policy to allow "insert" (upload) for the required role.

Example SQL for authenticated users:
```sql
alter table storage.objects enable row level security;

create policy "Allow authenticated upload to product bucket"
on storage.objects
for insert
using (
  bucket_id = 'product' AND auth.role() = 'authenticated'
);
```

Example SQL for service_role:
```sql
create policy "Allow service_role upload to product bucket"
on storage.objects
for insert
using (
  bucket_id = 'product'
);
```

After updating the policy, test the image upload again to confirm the error is resolved.
