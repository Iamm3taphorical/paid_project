-- Clear all mock data (TRUNCATE all tables) and reset auto-increment counters
-- Run this in the Supabase SQL Editor

TRUNCATE TABLE 
  "Review",
  "Involves",
  "Requires",
  "Provides",
  "Writes",
  "Requests",
  "Payment",
  "JobLocation",
  "Job",
  "Service",
  "Customer",
  "ServiceProvider",
  "User"
RESTART IDENTITY CASCADE;

-- Note: The first time you visit the Profile page, a new default user will be created automatically.
