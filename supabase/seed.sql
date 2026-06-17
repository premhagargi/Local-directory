SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Ubuntu 15.1-1.pgdg20.04+1)
-- Dumped by pg_dump version 15.6 (Ubuntu 15.6-1.pgdg20.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = on;

--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") VALUES
	('avatars', 'avatars', NULL, '2024-05-15 17:15:33.949923+00', '2024-05-15 17:15:33.949923+00', true, false, NULL, NULL, NULL),
	('listing_images', 'listing_images', NULL, '2024-05-16 09:08:39.524497+00', '2024-05-16 09:08:39.524497+00', true, false, NULL, NULL, NULL),
	('sublisting_images', 'sublisting_images', NULL, '2024-05-16 09:08:39.524497+00', '2024-05-16 09:08:39.524497+00', true, false, NULL, NULL, NULL),
	('blog_images', 'blog_images', NULL, '2024-05-30 07:45:38.436556+00', '2024-05-30 07:45:38.436556+00', true, false, NULL, NULL, NULL),
	('ad_images', 'ad_images', NULL, '2024-06-13 14:28:01.183241+00', '2024-06-13 14:28:01.183241+00', true, false, NULL, NULL, NULL), ('cattag_images', 'cattag_images', NULL, '2024-06-13 14:28:01.183241+00', '2024-06-13 14:28:01.183241+00', true, false, NULL, NULL, NULL);
