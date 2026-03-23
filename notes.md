# Project Context

## Overview
This project is a **Next.js App Router practice project** for building a **Medium-inspired AI-powered publishing platform** using **Next.js**, **Supabase**, and **Tiptap**.

The platform should work like a simplified **Medium clone**, where:

- **Guests** (unauthenticated users) can browse and read public articles
- **Members** (authenticated users) can both **read and write**
- **Admins** can moderate content and manage platform-level settings

---

## Core Product Idea
This is an **AI-assisted blogging/publishing platform** where members can:

- write articles manually
- save drafts
- edit and publish their own articles
- use AI tools to generate, improve, summarize, rewrite, or expand content directly in the writing workflow

The goal is to make the app feel like:

> **A Medium-like publishing platform with built-in AI writing assistance**

---

## Roles / Access Model

### Guest
Unauthenticated visitor.

Can:
- browse public posts
- read public articles
- view writer profiles

Cannot:
- create posts
- like posts (for now or future restriction)
- comment (for now or future restriction)

---

### Member
Authenticated user.

Can:
- read public content
- create, edit, and publish their own posts
- manage their own drafts
- use AI writing tools

Future features may include:
- likes
- comments
- bookmarks
- member-only content

---

### Admin
Platform moderator/manager.

Can:
- moderate or manage content
- manage tags/categories
- feature or hide posts
- handle reports or moderation tools later

---

## Core Features

- public homepage / article feed
- public article detail pages
- public writer profile pages
- member authentication
- member writing dashboard
- article CRUD for member-owned posts
- draft/publish workflow
- Tiptap-based rich text editor
- AI-assisted writing tools inside the editor workflow

---

## AI Writing Features
AI tools should be **member-only** and integrated into the writing experience.

Planned AI capabilities:
- generate article draft from prompt/topic
- generate outline
- improve grammar and clarity
- rewrite tone/style
- summarize content or selected sections
- expand sections/paragraphs
- suggest article titles
- suggest tags/categories
- generate SEO title and meta description

---

## Tech Stack

- **Next.js** (App Router)
- **Supabase** (Auth + Postgres + optional storage)
- **Tiptap** (headless rich text editor)

---

## Data / Architecture Guidance

- Use **Supabase Auth** for authentication
- Use a `profiles` table to extend auth users with app-specific data
- Keep **Guest** as an unauthenticated state, not a stored DB role
- Stored roles can be kept simple: `MEMBER` and `ADMIN`
- Store article content primarily as **Tiptap JSON** (`content_json`) as the source of truth
- Optionally derive HTML for rendering later (`content_html`)
- Keep the architecture **MVP-first**, **Supabase-friendly**, and **production-style**
- Prefer **Server Components by default**
- Use **client components only where needed** (Tiptap editor, interactive UI)
- Keep AI actions server-side and scoped to the current member’s own content

---

## Core Entities

Initial / future entities:

- `profiles`
- `posts`
- `tags`
- `post_tags`

Optional later:
- `comments`
- `likes`
- `bookmarks`
- `follows`
- `reports`

---

## Project Goal
Build a realistic, portfolio-quality **AI-powered Medium-like publishing platform** where members can write and publish articles manually or with AI assistance, while guests can browse public content and admins can moderate the platform.

---

# MVP Roadmap

## MVP 1 — Core Foundation (Must-Have)

### Auth / User System
- Sign up
- Sign in
- Sign out
- Guest vs Member distinction
- Basic profile creation via Supabase (`profiles` table)

### Public Pages
- Homepage / article feed
- Article detail page
- Basic writer profile page

### Member Writing
- Create new article
- Edit own article
- Save draft
- Publish article
- Delete own article

### Post States
- `DRAFT`
- `PUBLISHED`

### Editor
- Basic **Tiptap** editor integration

### Minimal Data Model
- `profiles`
- `posts`

---

## MVP 2 — Better Publishing Experience

### Article Management
- “My Articles” dashboard page
- Drafts list
- Published posts list
- Edit from dashboard
- Slug generation
- Excerpt support

### Public Blog Improvements
- Better article cards
- Author name/avatar on posts
- Published date
- Reading time (optional)

### Metadata
- Basic tags
- Optional categories (if needed later)

---

## MVP 3 — AI Writing Features (Core Differentiator)

### Minimum AI Features
1. Generate article draft from prompt
2. Improve selected text
3. Rewrite tone/style
4. Summarize content or selection
5. Generate title suggestions or SEO metadata

### Recommended AI UX
- Button to generate article from prompt
- Highlight text in editor → run AI transform
- Modal or toolbar actions for AI tools
- User reviews AI output before applying it

---

## MVP 4 — Profile + Discovery Improvements

### Profiles
- Editable member profile
- Public writer profile page
- Bio
- Avatar (later)

### Discovery
- Tag pages
- Browse posts by tag
- Search (optional later)

---

## MVP 5 — Admin / Moderation Basics

### Admin Essentials
- Admin-only route
- View all posts
- Hide/unpublish inappropriate posts
- Manage tags
- Basic role management (`MEMBER` ↔ `ADMIN` manually if needed)

---

## Recommended Strict MVP Scope
Ship this first:

- Supabase auth
- Guest vs Member access
- `profiles` table
- `posts` table
- Public homepage/feed
- Public article page
- Basic writer profile page
- Member dashboard
- Create/edit/delete own posts
- Draft/publish workflow
- Tiptap editor
- AI draft generation
- AI improve selected text
- AI summarize or rewrite tone

---

## Post-MVP / Nice-to-Have
Do **not** prioritize these immediately:

- Comments
- Likes
- Bookmarks
- Follows
- Member-only posts
- Notifications
- Full search engine
- Analytics dashboard
- Version history
- Collaborative editing
- Real-time editing
- Complex recommendation feeds

---

## Recommended Build Order

### Phase 1
- Auth
- Profiles
- Posts CRUD
- Public feed
- Single post page

### Phase 2
- Tiptap editor
- Draft/publish workflow
- Member dashboard

### Phase 3
- AI tools
- Draft generation
- Rewrite / improve tools

### Phase 4
- Tags + profile polish
- Better article cards
- Writer profile improvements

### Phase 5
- Admin moderation basics