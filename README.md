# Jottar API Reference

This README documents the API routes implemented for the React Native app integration.

All new routes return JSON and use a consistent envelope:

- Success: `{ "ok": true, ... }`
- Error: `{ "ok": false, "error": "message" }`

Most protected routes require an authenticated Better Auth session (cookie/header).

## 1) API Routes and Methods

### Me
- `GET /api/me`

### Folders
- `GET /api/folders`
- `GET /api/folders?mode=overview`
- `GET /api/folders?mode=dropdown`
- `GET /api/folders?folderId=<uuid>&take=<n>&skip=<n>`
- `GET /api/folders?folderSlug=<slug>&take=<n>&skip=<n>`
- `POST /api/folders`

### Notes
- `GET /api/notes`
- `GET /api/notes?mode=overview`
- `GET /api/notes?mode=one&id=<uuid>`
- `POST /api/notes`
- `GET /api/notes/:id`
- `PATCH /api/notes/:id`
- `POST /api/notes/:id/duplicate`
- `POST /api/notes/:id/toggle-pin`
- `POST /api/notes/:id/toggle-favorite`
- `POST /api/notes/:id/toggle-archive`
- `PATCH /api/notes/:id/folder`
- `POST /api/notes/:id/trash`
- `POST /api/notes/:id/restore`

### Tags
- `GET /api/tags`
- `POST /api/tags`

## 2) How to Use Them

## Authentication
These routes are protected and rely on Better Auth session resolution.

- On web: cookies are automatically sent.
- On React Native: send the same auth cookie/token headers your Better Auth flow uses.
- Unauthenticated response: `401` + `{ "ok": false, "error": "Not authenticated" }`.

## Core Response Pattern
- `ok: true` includes a `data` object/array for most endpoints.
- Mutations may include `message` or `success` fields.
- Validation failures usually return `400`.
- Not-found/ownership failures return `404` on specific endpoints.

## Endpoint Details

### `GET /api/me`
Returns the authenticated user object.

Example success:
```json
{ "ok": true, "data": { "id": "...", "email": "..." } }
```

### Folders

### `GET /api/folders`
Returns full folder list for user (ordered by `updatedAt desc`).

### `GET /api/folders?mode=overview`
Returns top 3 recent folders (overview cards use case).

### `GET /api/folders?mode=dropdown`
Returns minimal folder list (`id`, `name`) sorted by name.

### `GET /api/folders?folderId=<uuid>&take=<n>&skip=<n>`
### `GET /api/folders?folderSlug=<slug>&take=<n>&skip=<n>`
Returns one folder with notes included.

- `folderId` or `folderSlug` can be used.
- `take`/`skip` are optional for note pagination.
- Notes are filtered to `archived=false` and `trashedAt=null` and sorted by `updatedAt desc`.

### `POST /api/folders`
Creates a folder.

Request body:
```json
{
  "name": "Work",
  "slug": "work",
  "description": "Work notes",
  "userId": "optional-user-uuid"
}
```

Notes:
- `name` and `slug` are required.
- `userId` is optional; if omitted, authenticated user id is used.

### Notes

### `GET /api/notes`
Returns all notes for authenticated user.

### `GET /api/notes?mode=overview`
Returns up to 3 notes:
- up to 2 pinned (`isPinned=true`), then
- fill the rest from unpinned,
- both filtered by `archived=false` and `trashedAt=null`, ordered by `updatedAt desc`.

### `GET /api/notes?mode=one&id=<uuid>`
Returns one note by id.

### `POST /api/notes`
Creates note with content.

Request body:
```json
{ "content": "My note body" }
```

### `GET /api/notes/:id`
Returns one note by path param id.

### `PATCH /api/notes/:id`
Supports two update modes (do not mix in one request):

1. Content update (maps to `updateNote`)
```json
{ "content": "Updated content" }
```

2. Details update (maps to `updateNoteDetails`)
```json
{ "title": "New title", "folderId": "uuid-or-null" }
```

Rules:
- At least one valid field is required.
- Sending both `content` and (`title`/`folderId`) together returns a validation error.

### `POST /api/notes/:id/duplicate`
Duplicates a note with copied tags and title suffix ` (Copy)`.

### `POST /api/notes/:id/toggle-pin`
Toggles `isPinned` using SQL `NOT` update.

### `POST /api/notes/:id/toggle-favorite`
Toggles `favorite` using SQL `NOT` update.

### `POST /api/notes/:id/toggle-archive`
Toggles `archived` using SQL `NOT` update.

### `PATCH /api/notes/:id/folder`
Updates folder assignment.

Request body:
```json
{ "folderId": "uuid-or-null" }
```

- Set `folderId: null` to remove note from folder.
- Enforces ownership on both note and folder.
- Returns `{ "ok": true, "success": true }` on success.

### `POST /api/notes/:id/trash`
Soft-delete note by setting `trashedAt` timestamp.

### `POST /api/notes/:id/restore`
Restores note by setting `trashedAt` to `null`.

### Tags

### `GET /api/tags`
Returns all tags for user with `noteTags` relation.

### `POST /api/tags`
Creates a tag.

Request body:
```json
{ "name": "urgent" }
```

## Origin Mapping (API Route -> Original Function)

## From `src/lib/fetch`
- `getAuthedUser` -> `GET /api/me`
- `getFoldersList` -> `GET /api/folders`
- `getFoldersOverview` -> `GET /api/folders?mode=overview`
- `getFoldersForDropdown` -> `GET /api/folders?mode=dropdown`
- `getFolderWithNotes` -> `GET /api/folders?folderId=...` or `folderSlug=...`
- `getNotes` -> `GET /api/notes`
- `getNote` -> `GET /api/notes?mode=one&id=...` and `GET /api/notes/:id`
- `overviewNotes` -> `GET /api/notes?mode=overview`
- `getTags` -> `GET /api/tags`

## From `src/lib/actions/folder-actions.ts`
- `createFolder` -> `POST /api/folders`
- `updateNoteFolder` -> `PATCH /api/notes/:id/folder`

## From `src/lib/actions/note-actions.ts`
- `createNote` -> `POST /api/notes`
- `duplicateNote` -> `POST /api/notes/:id/duplicate`
- `createTag` -> `POST /api/tags`
- `togglePin` -> `POST /api/notes/:id/toggle-pin`
- `toggleFavorite` -> `POST /api/notes/:id/toggle-favorite`
- `toggleArchive` -> `POST /api/notes/:id/toggle-archive`
- `updateNote` -> `PATCH /api/notes/:id` with `{ "content": ... }`
- `updateNoteDetails` -> `PATCH /api/notes/:id` with `{ "title": ..., "folderId": ... }`
- `trashNote` -> `POST /api/notes/:id/trash`
- `restoreNote` -> `POST /api/notes/:id/restore`

## Existing Auth Route
Auth endpoints are served by Better Auth catch-all route:
- `GET|POST /api/auth/[...all]`

This is already wired in `src/app/api/auth/[...all]/route.ts`.

## Practical React Native Notes
- Always send `Content-Type: application/json` for POST/PATCH with body.
- Keep credentials/cookies attached based on your RN networking setup.
- Prefer path-based single note endpoint (`/api/notes/:id`) over query-based one for cleaner mobile code.

## React Native Quickstart

Use one small request helper and call the endpoints below.

```ts
const API_BASE = "https://jottar.vercel.com";

type ApiOk<T> = { ok: true } & T;
type ApiErr = { ok: false; error: string };
type ApiResponse<T> = ApiOk<T> | ApiErr;

async function api<T>(
  path: string,
  init?: RequestInit,
): Promise<ApiResponse<T>> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    // Keep/forward auth material here (cookie header, bearer token, etc.)
    // credentials: "include" is browser-only; RN usually uses explicit headers.
  });

  return res.json();
}
```

### Identity

```ts
const me = await api<{ data: { id: string; email?: string } }>("/api/me");
```

### Folders

```ts
const folders = await api<{ data: unknown[] }>("/api/folders");
const folderOverview = await api<{ data: unknown[] }>("/api/folders?mode=overview");
const folderDropdown = await api<{ data: unknown[] }>("/api/folders?mode=dropdown");
const oneFolderBySlug = await api<{ data: unknown }>(
  "/api/folders?folderSlug=work&take=20&skip=0",
);

const createFolder = await api<{ data: unknown }>("/api/folders", {
  method: "POST",
  body: JSON.stringify({
    name: "Work",
    slug: "work",
    description: "Work notes",
  }),
});
```

### Notes

```ts
const notes = await api<{ data: unknown[] }>("/api/notes");
const notesOverview = await api<{ data: unknown[] }>("/api/notes?mode=overview");
const noteByQuery = await api<{ data: unknown }>("/api/notes?mode=one&id=<note-id>");
const noteByPath = await api<{ data: unknown }>("/api/notes/<note-id>");

const createNote = await api<{ data: unknown }>("/api/notes", {
  method: "POST",
  body: JSON.stringify({ content: "My note body" }),
});

// update content
const updateContent = await api<{ data: unknown }>("/api/notes/<note-id>", {
  method: "PATCH",
  body: JSON.stringify({ content: "Updated content" }),
});

// update title/folder
const updateDetails = await api<{ data: unknown; message?: string }>(
  "/api/notes/<note-id>",
  {
    method: "PATCH",
    body: JSON.stringify({ title: "New title", folderId: null }),
  },
);

const duplicate = await api<{ data: unknown }>("/api/notes/<note-id>/duplicate", {
  method: "POST",
});
const togglePin = await api<{ data: unknown; message: string }>(
  "/api/notes/<note-id>/toggle-pin",
  { method: "POST" },
);
const toggleFavorite = await api<{ data: unknown; message: string }>(
  "/api/notes/<note-id>/toggle-favorite",
  { method: "POST" },
);
const toggleArchive = await api<{ data: unknown; message: string }>(
  "/api/notes/<note-id>/toggle-archive",
  { method: "POST" },
);
const moveFolder = await api<{ success: true }>("/api/notes/<note-id>/folder", {
  method: "PATCH",
  body: JSON.stringify({ folderId: "<folder-id-or-null>" }),
});
const trash = await api<{ data: unknown }>("/api/notes/<note-id>/trash", {
  method: "POST",
});
const restore = await api<{ data: unknown }>("/api/notes/<note-id>/restore", {
  method: "POST",
});
```

### Tags

```ts
const tags = await api<{ data: unknown[] }>("/api/tags");
const createTag = await api<{ data: unknown }>("/api/tags", {
  method: "POST",
  body: JSON.stringify({ name: "urgent" }),
});
```

### Basic Error Handling Pattern

```ts
const res = await api<{ data: unknown[] }>("/api/notes");
if (!res.ok) {
  console.log("API error:", res.error);
} else {
  console.log("Notes:", res.data);
}
```
