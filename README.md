
# 🚗 Leasing Frontend Project 

This project is a **monorepo** application built using **Nx**, **React**, and **Vite**, structured for modularity, scalability, and clean architecture using Domain and Infrastructure layers.

## 📁 Project Structure

```
.
├── apps/
│   ├── admin-portal/     # Main React frontend app
├── packages/
│   ├── domain/           # Domain logic (Types, services, interfaces)
│   ├── infrastructure/   # Infrastructure implementations (Axios, Storage, etc.)
│   ├── shared/
│   │   ├── ui/            # Design system & UI components
│   │   ├── app-shell/     # Layout global (Header, Sidebar, etc.)
├── tsconfig.base.json
├── nx.json
├── package.json
└── pnpm-workspace.yaml
```

## ⚙️ Technologies

| Tool                                                                                         | Role                                     |
| -------------------------------------------------------------------------------------------- | ---------------------------------------- |
| [Nx](https://nx.dev)                                                                         | Monorepo management & code orchestration |
| [React](https://react.dev)                                                                   | Main UI framework                        |
| [Vite](https://vitejs.dev)                                                                   | Fast bundler and development server      |
| [TypeScript](https://www.typescriptlang.org/)                                                | Static typing                            |
| [MUI](https://mui.com)                                                                       | UI components                            |
| [Zod](https://zod.dev)                                                                       | Schema validation                        |
| [@tanstack/react-form](https://tanstack.com/query/latest/docs/framework/react-form/overview) | Typesafe forms                           |
| [Storybook](https://storybook.js.org)                                                        | Component documentation & visual testing |
| [ESLint](https://eslint.org)                                                                 | Linter                                   |
| [Vitest](https://vitest.dev)                                                                 | Unit testing                             |
| [pnpm](https://pnpm.io)                                                                      | Package manager                          |

## 🚀 Getting Started

```bash
pnpm install
pnpm nx dev admin-portal
```

## 📁 Environment Variables

Create `.env` file under `apps/admin-portal/`:

```env
API_BASE_URL=https://your-api-url.com

```

### Vite Proxy

In `vite.config.ts`:

```ts
server: {
  proxy: {
    '/api': {
      target: env.API_BASE_URL,
      changeOrigin: true,
      rewrite: path => path.replace(/^\/api/, ''),
    },
  },
}
```

## 🧱 Design System - @leasing/ui

All shared UI components (buttons, inputs, layouts, etc.) are grouped in `packages/shared/ui`.

```tsx
export const PrimaryButton = ({ text, sx, onClick }: Props) => {
  const theme = useTheme()
  return (
    <Button
      variant="contained"
      sx={{ background: theme.palette.secondary.main, ...sx }}
      onClick={onClick}
    >
      {text}
    </Button>
  )
}
```
Each component has an associated `*.stories.tsx` file in `lib/` to enable visualization via Storybook.

Run Storybook:

```bash
pnpm nx storybook @leasing/ui
```

## 🧩 App-Shell- @leasing/app-hell
Contains global components such as Header, Sidebar, Layout, etc. It is used as the main wrapper in `admin-portal`.

## 🔌 HTTP Client (Domain + Infrastructure)

### In `domain`:

```ts
export interface ApiClient {
  get<T>(url: string): Promise<T>;
  post<T>(url: string, data: unknown): Promise<T>;
}
```

### In `infra`:

```ts

export const createHttpClient = ({ baseURL, token, onUnauthorized }: HttpParams): ApiClient => {
  const axiosInstance = axios.create({ baseURL });
  axiosInstance.interceptors.request.use(...);
  axiosInstance.interceptors.response.use(...);
  return {
        get: async <T>(url: string) => {
            const response = await instance.get<T>(url);
            return response.data;
        },

        post: async <T>(url: string, data: unknown) => {
            const response = await instance.post<T>(url, data);
            return response.data;
        }
    };
};
```

## 📦 Storage Abstraction

### In `domain`:

```ts
export interface Storage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
}

export class StorageService {
  constructor(private storage: Storage) {}
  ...
}
```

## 🧠 React Query

### Queries

```ts
export const usePropositionsQuery = () => {
  return useQuery<Proposition[]>({
    queryKey: ['propositions'],
    queryFn: () =>
      httpClient.get(ENDPOINTS.PROPOSITIONS),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });
}
```

### Mutations

```ts
export const useCreateProposition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePropositionRequest) =>
      httpClient.post(ENDPOINTS.PROPOSITIONS, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['propositions'] });
    },
    onError: (error: Error) => {
      console.log("An error Occurred", error.message);
    }
  });
};
```

## 📝 Forms

Using TanStack Form with Zod:

```ts
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const form = useForm({
  defaultValues: { email: '', password: '' },
  validators: { onChange: schema },
});
```

### MUI Integration

```tsx
<form.Field name="email">
  {(field) => (
    <TextField
      {...field.getInputProps()}
      error={!!field.state.meta.errors?.length}
      helperText={field.state.meta.errors?.[0]?.message}
    />
  )}
</form.Field>
```

## ✅ Useful Commands

```bash
pnpm nx graph                        # Visualize project dependencies
pnpm nx storybook @leasing/ui       # Launch Storybook
pnpm nx test @leasing/ui            # Test the design system
pnpm nx build @leasing/ui           # Build the library
pnpm nx lint                        # Run lint checks
pnpm nx generate ...           # Generate components/features
```

## 🧠 Best Practices

- `@leasing/*` aliases via `tsconfig.base.json`
- `domain` = logic & abstraction only
- `infra` = actual implementations (axios, storage)
- Avoid `any`, use strict typing
- Use React Query for async calls
- Group queries & mutations by domain

---

Feel free to improve this README with team conventions or new modules! 🚀
