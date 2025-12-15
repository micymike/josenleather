-- Add FCM token field to admin table for notifications
ALTER TABLE "Admin"
ADD COLUMN "fcm_token" VARCHAR(255);

-- Example: Update admin entity to include fcm_token
-- (This is a comment for reference, actual entity update is in code)
