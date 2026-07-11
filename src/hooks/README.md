# Custom React Hooks Directory

## Responsibility
Contains custom React hooks to isolate stateful logic or side effects for cleaner components.

## Examples
- `useLocalStorage.ts`: Sync state (e.g. emergency checklists, user language preferences) with browser localStorage.
- `useGeolocation.ts`: Retrieve coordinate pairs (latitude/longitude) from the browser Geolocation API securely to enable live location-based weather fetching.
- `useDebounce.ts`: Debounce inputs for weather search bar queries.
