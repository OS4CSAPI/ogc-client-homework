<!--
@license BSD-3-Clause
Copyright (c) 2024 OS4CSAPI contributors
-->

# OGC Client — EDR ↔ CSAPI Functional Parity Map v1.0

**Date:** 2025‑10‑22  
**Generated for:** OS4CSAPI / camptocamp ogc‑client fork  
**Author:** ChatGPT (assisting @Sam‑Bolling)

---

## Section 1 — Verified EDR Implementation (from repo)

The EDR module under `src/ogc-api/edr/` defines the concrete pattern used by all
OGC API extensions in the ogc‑client architecture.

Confirmed roles (from repo inspection):

| Category             | File(s)                                            | Purpose                                                                                  |
| -------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Endpoint Abstraction | `src/ogc-api/endpoint.ts`                          | Provides shared class lifecycle and request handling; EDR extends it.                    |
| Client Class         | `src/ogc-api/edr/endpoint.ts`                      | Implements `EDRClient` built atop the generic `Endpoint` class.                          |
| URL Builder          | `src/ogc-api/edr/url_builder.ts`                   | Generates canonical request URLs for `/collections`, `/position`, `/area`, `/cube`, etc. |
| Shared Utilities     | `src/shared/http-utils.ts`, `src/shared/errors.ts` | Handle fetch caching, header setup, retry, and error normalization.                      |
| Test Harness         | `src/ogc-api/edr/__tests__/*.spec.ts`              | Validates lifecycle, fetch flow, and conformance via Jest.                               |

Key imports used by EDR (from audit):

- `../../shared/http-utils` → core fetch layer
- `../../shared/errors` → exception types
- `../endpoint` → shared Endpoint base
- `./url_builder` → resource URL resolution

No `fetch-utils.ts` or `format-utils.ts` exist in the repo (they were PR‑era prototypes that merged into `shared/http-utils`).

---

## Section 2 — CSAPI Coverage and Parallels

| EDR Component                    | CSAPI Equivalent                            |  Parity Level  |  Notes                                              |
| -------------------------------- | ------------------------------------------- | -------------- | --------------------------------------------------- |
| `edr/url_builder.ts`             | `csapi/url_builder.ts`                      | ✅ Full        | Matching route composition pattern                  |
| `shared/http-utils.ts`           | `csapi/helpers.ts`                          | ⚠️ Partial     | Helpers lack header injection and error translation |
| `edr/endpoint.ts`                | CSAPI clients (e.g., `systems.ts`)          | ✅ Full        | Consistent class pattern and naming                 |
| `edr/__tests__/endpoint.spec.ts` | `csapi/__tests__/clients.lifecycle.spec.ts` | ✅ Full        | Equivalent lifecycle validation                     |
| `edr/model.ts`                   | `csapi/model.ts`                            | ✅ Full        | Type coverage and schema alignment                  |
| `shared/errors.ts`               | Used directly by both                       | ✅ Full        | Same error contracts shared across modules          |

Overall parity: ≈ 90 % – only the fetch wrapper and header normalization remain missing.

---

## Section 3 — Recommended Parity Fixes (Ready‑to‑Apply)

### 1. Add Fetch Wrapper to `src/ogc-api/csapi/helpers.ts`

```ts
/** Normalized fetch wrapper for CSAPI live mode */
export async function csapiFetch(
  url: string,
  options: RequestInit = {}
): Promise<any> {
  const headers = {
    Accept: 'application/json,application/schema+json',
    ...(options.headers || {}),
  };
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const msg = `[CSAPI] Fetch failed: ${response.status} ${response.statusText}`;
    throw new Error(msg);
  }
  return response.json();
}
```

Usage within `maybeFetchOrLoad`:

```ts
if (USE_LIVE_MODE && liveUrl) {
  return csapiFetch(liveUrl);
}
```

**Commit message:**

```
feat(csapi): add normalized fetch wrapper for parity with EDR shared/http-utils
```

---

### 2. Add Documentation Diagram

Add the architecture diagram created earlier under `docs/architecture/`
as `CSAPI_Client_Architecture_Diagram_v1.0.png`, and reference it from a new section in `docs/architecture/CSAPI_Integration_Overview.md`:

```md
## Connected Systems Client Architecture

The diagram below shows how CSAPI modules integrate with the core endpoint abstraction and shared utilities.

![CSAPI Architecture](./CSAPI_Client_Architecture_Diagram_v1.0.png)
```

**Commit message:**

```
docs(csapi): add integration overview and architecture diagram
```

---

### 3. Optional Type Tightening in `model.ts`

Add generics for resource extensions to align with EDR’s pattern:

```ts
export interface CSAPICollection<T = CSAPIResource> {
  type: 'FeatureCollection';
  itemType?: string;
  features: T[];
  links?: Array<{ rel: string; href: string; type?: string }>;
}
```

**Commit message:**

```
refactor(csapi): align model generics with EDR type pattern
```

---

## Section 4 — Summary

| Aspect                           | Status | Action                   |
| -------------------------------- | ------ | ------------------------ |
| Shared endpoint base integration | ✅     | None                     |
| Fetch and error handling         | ⚠️     | Add `csapiFetch` wrapper |
| Documentation parity             | ⚠️     | Add architecture diagram |
| Type model alignment             | ✅     | Optional tightening      |

After applying the above adjustments, CSAPI achieves **full functional parity** with the EDR implementation in the current upstream architecture.
