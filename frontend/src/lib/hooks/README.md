# useApiError

A small utility for parsing API/Fetch/Serialized error shapes into a user-facing string.

Exports:
- `getApiErrorMessage(err: unknown): string` — pure function useful in unit tests.
- `default useApiError(err: unknown): string` — React hook that memoizes the parsed message.

Usage:
```ts
import useApiError, { getApiErrorMessage } from "@/lib/hooks/useApiError";

const message = getApiErrorMessage(err); // pure
const memoized = useApiError(err); // in components
```

Notes:
- Handles RTK Query `FetchBaseQueryError` shapes (with `error` or `data`) as well as thrown `Error` objects, plain string bodies and serialized errors.
- Keep this small and pure to make tests deterministic and easy to reuse across components.
