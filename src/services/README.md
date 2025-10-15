# API Services

This directory contains API service functions for interacting with the backend.

## User Services

### Available Functions

- `getUsers(page, limit, search, sort, order)` - Fetch users with pagination and filtering
- `getUserById(id)` - Fetch a single user by ID
- `createUser(userData)` - Create a new user
- `updateUser(id, userData)` - Update an existing user
- `deleteUser(id)` - Delete a user

### Usage with React Query

The services are designed to work with React Query's `useMutation` hook directly:

```javascript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userMutations } from "@/services/users";

const queryClient = useQueryClient();

// Create user mutation
const createUserMutation = useMutation({
  mutationFn: userMutations.createUser,
  onSuccess: () => {
    console.log("User created!");
    queryClient.invalidateQueries({ queryKey: ["users"] });
  },
  onError: (error) => console.error("Error:", error),
});

// Update user mutation
const updateUserMutation = useMutation({
  mutationFn: userMutations.updateUser,
  onSuccess: () => {
    console.log("User updated!");
    queryClient.invalidateQueries({ queryKey: ["users"] });
  },
});

// Usage
createUserMutation.mutate(userData);
updateUserMutation.mutate({ id: userId, userData });
```

### Environment Configuration

Set your API base URL in environment variables:

```bash
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com/api
```

If not set, defaults to `https://jsonplaceholder.typicode.com` for development.

### Caching

The services automatically handle caching using the existing cache utilities:

- New users are added to cache after creation
- Updated users replace existing cache entries
- Deleted users are removed from cache
- Cache is invalidated and refetched via React Query
