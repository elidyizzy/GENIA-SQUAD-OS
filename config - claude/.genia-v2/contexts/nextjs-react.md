# Contexto: Next.js & React

> Patterns de performance e boas praticas para Next.js e React.

## Eliminando Waterfalls

### Problema: Requests Sequenciais
```typescript
// ERRADO - waterfall
const user = await getUser(id);
const posts = await getPosts(user.id);
const comments = await getComments(posts);
```

### Solucao: Parallelizar
```typescript
// CORRETO - paralelo
const [user, posts] = await Promise.all([
  getUser(id),
  getPosts(id)
]);
```

## Bundle Size Optimization

### Code Splitting
```typescript
// Dynamic imports
const HeavyComponent = dynamic(() => import('./Heavy'), {
  loading: () => <Skeleton />
});
```

### Tree Shaking
```typescript
// ERRADO - importa tudo
import _ from 'lodash';

// CORRETO - importa so o necessario
import debounce from 'lodash/debounce';
```

## Server-Side Performance

### Streaming
```typescript
// app/page.tsx
export default function Page() {
  return (
    <main>
      <Header />
      <Suspense fallback={<Loading />}>
        <SlowComponent />
      </Suspense>
    </main>
  );
}
```

### Caching
```typescript
// Revalidate a cada hora
export const revalidate = 3600;

// Ou fetch com cache
const data = await fetch(url, {
  next: { revalidate: 3600 }
});
```

## Client-Side Data Fetching

### SWR ou React Query
```typescript
import useSWR from 'swr';

function Profile() {
  const { data, error, isLoading } = useSWR('/api/user', fetcher);

  if (isLoading) return <Loading />;
  if (error) return <Error />;
  return <User data={data} />;
}
```

## Re-render Optimization

### useMemo para calculos pesados
```typescript
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);
```

### useCallback para funcoes
```typescript
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

### React.memo para componentes
```typescript
const Card = React.memo(function Card({ user }) {
  return <div>{user.name}</div>;
});
```

## Rendering Performance

### Keys corretas
```typescript
// ERRADO - index como key
{items.map((item, i) => <Item key={i} />)}

// CORRETO - id unico
{items.map(item => <Item key={item.id} />)}
```

### Virtualizacao para listas longas
```typescript
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={400}
  itemCount={1000}
  itemSize={35}
>
  {Row}
</FixedSizeList>
```

## JavaScript Performance

### Debounce inputs
```typescript
const debouncedSearch = useDebouncedCallback(
  (value) => search(value),
  300
);
```

### Web Workers para calculos pesados
```typescript
const worker = new Worker('/worker.js');
worker.postMessage(heavyData);
worker.onmessage = (e) => setResult(e.data);
```

## Advanced Patterns

### Server Components
```typescript
// Componente servidor (default no App Router)
async function Posts() {
  const posts = await db.posts.findMany(); // Direto no banco!
  return <PostList posts={posts} />;
}
```

### Server Actions
```typescript
async function submitForm(formData: FormData) {
  'use server';
  await db.users.create({ data: formData });
}
```

### Parallel Routes
```typescript
// app/@dashboard/page.tsx
// app/@sidebar/page.tsx
// Carregam em paralelo
```

## Image Optimization

```typescript
import Image from 'next/image';

<Image
  src="/hero.jpg"
  width={1200}
  height={600}
  placeholder="blur"
  priority // Para imagens above-the-fold
/>
```

## Font Optimization

```typescript
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});
```

## Checklist de Performance

- [ ] Requests em paralelo (Promise.all)?
- [ ] Code splitting implementado?
- [ ] Imagens otimizadas (next/image)?
- [ ] Fontes otimizadas (next/font)?
- [ ] Caching configurado?
- [ ] Listas virtualizadas?
- [ ] Memos apropriados?
- [ ] Bundle analisado?
