# Parlmpact Admin & Subscription Guide

This guide explains how to access the Admin Portal and how to set up the Subscription system for local development.

---

## 1. Accessing the Admin Portal

The admin portal is located at `/admin`. However, it is protected by a strict role check.

### How to set yourself as Admin

1. **Update the Database**: Open your Supabase SQL Editor and run:
   ```sql
   UPDATE public.profiles 
   SET role = 'admin' 
   WHERE email = 'your-email@example.com';
   ```

2. **JWT Custom Claims (Required for Production)**:
   The current code uses a custom JWT claim `user_role` for maximum security and performance. To enable this, you must run the following SQL in Supabase:
   ```sql
   -- 1. Create the hook function
   create or replace function public.custom_access_token_hook(event jsonb)
   returns jsonb language plpgsql stable as $$
   declare
     claims jsonb;
     user_role text;
   begin
     select role into user_role from public.profiles where id = (event->>'user_id')::uuid;
     claims := event->'claims';
     claims := jsonb_set(claims, '{user_role}', to_jsonb(coalesce(user_role, 'subscriber')));
     return jsonb_set(event, '{claims}', claims);
   end;
   $$;

   -- 2. Grant permissions
   grant execute on function public.custom_access_token_hook to supabase_auth_admin;

   -- 3. IMPORTANT: Go to your Supabase Dashboard -> Auth -> Hooks 
   --    and set 'custom_access_token_hook' as the hook for 'Add custom claims to JWT'.
   ```

3. **Temporary Local Fix (Alternative)**:
   If you don't want to set up hooks yet, you can modify `src/lib/auth/requireAdmin.ts` to check the database directly:
   ```typescript
   // In requireAdmin.ts, replace the JWT check with:
   const { data: profile } = await supabase
     .from('profiles')
     .select('role')
     .eq('id', user.id)
     .single()

   if (profile?.role !== 'admin') {
     redirect('/dashboard')
   }
   ```

---

## 2. Setting Up Subscriptions (Razorpay)

To "proceed with subscription" locally, you need a valid Razorpay Test Key.

### Steps to Enable:

1. **Get Keys**: Sign up for [Razorpay Dashboard](https://dashboard.razorpay.com/) and go to **Settings -> API Keys**. Generate keys in **Test Mode**.
2. **Configure `.env.local`**: Add your keys:
   ```env
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXX
   RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX
   ```
3. **Restart Dev Server**: `npm run dev`
4. **Testing**:
   - Go to your Dashboard.
   - Click "Subscribe to Enter".
   - The Razorpay checkout window should appear.
   - Use the **Test Card** provided by Razorpay (usually 4111 1111 1111 1111).

### If the button does nothing:
- Check your browser console (F12) for errors.
- Ensure the Razorpay script is loading (it is included via `next/script` in `RazorpayCheckout.tsx`).
- Verify that your user is logged in.

---

## 3. Creating an Admin Profile

Once you are in `/admin`, you can use the **Users** section to view and manage all profiles. If you need to create a *new* admin:
1. Ask them to sign up normally.
2. Use the SQL command in Step 1 to elevate their role.
