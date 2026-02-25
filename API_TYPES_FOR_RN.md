# Jottar API Types (Copy-Paste for React Native)

Use these types in your RN app for all routes added under `/api/folders`, `/api/notes`, `/api/tags`, and `/api/me`.

```ts
// -----------------------------
// Common API envelope
// -----------------------------
export type ApiError = { ok: false; error: string };
export type ApiSuccess<T extends object> = { ok: true } & T;
export type ApiResponse<T extends object> = ApiSuccess<T> | ApiError;

// -----------------------------
// Core entities returned by API
// -----------------------------
export type ApiUser = {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
  emailVerified?: boolean | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export type ApiNoteTag = {
  id?: string;
  noteId: string;
  tagId: string;
  createdAt?: string | Date;
};

export type ApiNote = {
  id: string;
  title: string | null;
  content: string;
  folderId: string | null;
  userId: string;
  isPinned: boolean;
  favorite: boolean;
  archived: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  noteTags: ApiNoteTag[];
  trashedAt: string | Date | null;
  allowCopy: boolean;
  copiedFromNoteId: string | null;
  copiedFromUserId: string | null;
  shareLinkType: "USERNAME" | "TOKEN";
  shareable: boolean;
};

export type ApiFolder = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  _count: { notes: number };
};

export type ApiFolderDropdownItem = {
  id: string;
  name: string;
};

export type ApiFolderOverview = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  updatedAt: string | Date;
  _count: { notes: number };
};

export type ApiFolderWithNotes = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  _count: { notes: number };
  notes: ApiNote[];
};

export type ApiTag = {
  id: string;
  name: string;
  userId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  noteTags: Array<{ noteId: string; tagId: string }>;
};

// -----------------------------
// Request body types
// -----------------------------
export type CreateFolderBody = {
  name: string;
  slug: string;
  description?: string;
  userId?: string;
};

export type CreateNoteBody = {
  content: string;
};

export type UpdateNoteContentBody = {
  content: string;
};

export type UpdateNoteDetailsBody = {
  title?: string;
  folderId?: string | null;
};

export type UpdateNoteFolderBody = {
  folderId: string | null;
};

export type CreateTagBody = {
  name: string;
};

// -----------------------------
// Endpoint response types
// -----------------------------
export type GetMeResponse = ApiResponse<{ data: ApiUser }>;

// Folders
export type GetFoldersResponse = ApiResponse<{ data: ApiFolder[] }>;
export type GetFoldersOverviewResponse = ApiResponse<{ data: ApiFolderOverview[] }>;
export type GetFoldersDropdownResponse = ApiResponse<{ data: ApiFolderDropdownItem[] }>;
export type GetFolderWithNotesResponse = ApiResponse<{ data: ApiFolderWithNotes | null }>;
export type CreateFolderResponse = ApiResponse<{ data: ApiFolder }>;

// Notes
export type GetNotesResponse = ApiResponse<{ data: ApiNote[] }>;
export type GetNotesOverviewResponse = ApiResponse<{ data: ApiNote[] }>;
export type GetNoteResponse = ApiResponse<{ data: ApiNote | null }>;
export type CreateNoteResponse = ApiResponse<{ data: ApiNote }>;
export type UpdateNoteContentResponse = ApiResponse<{ data: ApiNote }>;
export type UpdateNoteDetailsResponse = ApiResponse<{ data: ApiNote; message?: string }>;
export type DuplicateNoteResponse = ApiResponse<{ data: ApiNote }>;
export type TogglePinResponse = ApiResponse<{ data: ApiNote; message: string }>;
export type ToggleFavoriteResponse = ApiResponse<{ data: ApiNote; message: string }>;
export type ToggleArchiveResponse = ApiResponse<{ data: ApiNote; message: string }>;
export type UpdateNoteFolderResponse = ApiResponse<{ success: true }>;
export type TrashNoteResponse = ApiResponse<{ data: ApiNote }>;
export type RestoreNoteResponse = ApiResponse<{ data: ApiNote }>;

// Tags
export type GetTagsResponse = ApiResponse<{ data: ApiTag[] }>;
export type CreateTagResponse = ApiResponse<{ data: ApiTag }>;

// -----------------------------
// Optional route map helper
// -----------------------------
export type ApiRoutes = {
  "/api/me": { method: "GET"; response: GetMeResponse };

  "/api/folders": {
    method: "GET" | "POST";
    response:
      | GetFoldersResponse
      | GetFoldersOverviewResponse
      | GetFoldersDropdownResponse
      | CreateFolderResponse;
    body?: CreateFolderBody;
  };

  "/api/notes": {
    method: "GET" | "POST";
    response:
      | GetNotesResponse
      | GetNotesOverviewResponse
      | GetNoteResponse
      | CreateNoteResponse;
    body?: CreateNoteBody;
  };

  "/api/notes/:id": {
    method: "GET" | "PATCH";
    response: GetNoteResponse | UpdateNoteContentResponse | UpdateNoteDetailsResponse;
    body?: UpdateNoteContentBody | UpdateNoteDetailsBody;
  };

  "/api/notes/:id/duplicate": {
    method: "POST";
    response: DuplicateNoteResponse;
  };

  "/api/notes/:id/toggle-pin": {
    method: "POST";
    response: TogglePinResponse;
  };

  "/api/notes/:id/toggle-favorite": {
    method: "POST";
    response: ToggleFavoriteResponse;
  };

  "/api/notes/:id/toggle-archive": {
    method: "POST";
    response: ToggleArchiveResponse;
  };

  "/api/notes/:id/folder": {
    method: "PATCH";
    body: UpdateNoteFolderBody;
    response: UpdateNoteFolderResponse;
  };

  "/api/notes/:id/trash": {
    method: "POST";
    response: TrashNoteResponse;
  };

  "/api/notes/:id/restore": {
    method: "POST";
    response: RestoreNoteResponse;
  };

  "/api/tags": {
    method: "GET" | "POST";
    response: GetTagsResponse | CreateTagResponse;
    body?: CreateTagBody;
  };
};
```

## Important note about reusing Prisma function types

The original server-side Prisma/action types do **not** automatically carry over to RN unless you share TypeScript source (or a generated types package) across both apps.

For RN, these API types are the safest source of truth because they match the actual HTTP JSON payloads.
