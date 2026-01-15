# Infinite Scroll News Feed

An infinite scroll news feed component built with React + TypeScript.

[O'zbekcha versiya](#ozbekcha)

## Tech Stack

- **React** + **TypeScript**
- **Vite** - Build tool
- **TanStack Query** - Data fetching and caching
- **TanStack Virtual** - Virtualization
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Installation

```bash
# Install dependencies
pnpm install

# Development server
pnpm dev

# Production build
pnpm build
```

## Project Structure

```
src/
├── api/           # Backend communication
│   ├── news.api.ts
│   └── query-keys.ts
├── components/    # UI components
│   ├── news-feed.tsx
│   ├── news-item.tsx
│   └── ui/
├── hooks/         # Reusable logic
│   ├── useInfiniteNews.ts
│   └── useInfiniteScroll.ts
├── constants/     # Constants
└── utils/         # Helper functions
```

## Requirements

- Data is loaded from the backend in batches of 20 items
- Loading is triggered when the user reaches the end of the list
- Avoid duplicate requests
- Handle loading, error, and "end of list" states
- Optimize rendering for large lists

---

## Architectural Decisions

### 1. Overall Architecture

The project is built on a **modular architecture** - each concern is separated into its own file/folder.

**Reason:** Separation of Concerns principle - each part is responsible for its own task, making testing and modification easier.

---

### 2. Data Fetching Strategy

**Chosen solution:** TanStack Query (React Query) + `useInfiniteQuery`

```typescript
const query = useInfiniteQuery({
  queryKey: [QUERY_KEYS.NEWS],
  queryFn: ({ pageParam }) => fetchNewsPage(pageParam),
  initialPageParam: 0,
  getNextPageParam: (lastPage) => lastPage.nextCursor,
  staleTime: 1000 * 60 * 5,    // 5 minutes
  gcTime: 1000 * 60 * 30,      // 30 minutes
});
```

**Why TanStack Query?**

| Alternative | Disadvantage |
|-------------|--------------|
| `useState` + `useEffect` | No cache, manual deduplication, complex |
| SWR | Less suited for infinite queries |
| Redux Toolkit Query | More boilerplate |

**TanStack Query advantages:**
- **Automatic cache** - same data is not reloaded
- **Deduplication** - parallel requests are merged into one
- **Background refetch** - updates without user knowing
- **`hasNextPage`/`isFetchingNextPage`** - ready-made states

---

### 3. Infinite Scroll Mechanism

**Chosen solution:** `IntersectionObserver` API

```typescript
const observer = new IntersectionObserver(
  (entries) => {
    if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  },
  { rootMargin: '200px', threshold: 0.1 }
);
```

**Why not scroll event?**

| Approach | Performance | Accuracy |
|----------|-------------|----------|
| `onScroll` event | Fires on every scroll | Needs throttle/debounce |
| `IntersectionObserver` | Only when needed | Native, accurate |

**`rootMargin: '200px'`** - starts loading 200px before user reaches the end. This ensures **seamless UX**.

---

### 4. Preventing Duplicate Requests

**Two-level protection:**

**Level 1:** Condition check in hook

```typescript
if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
  fetchNextPage();
}
```

**Level 2:** TanStack Query's internal mechanism - parallel requests with the same `queryKey` are automatically merged.

---

### 5. UI State Management

**Three states clearly separated:**

```tsx
// Initial loading
if (isLoading) return <LoadingState />;

// Error
if (error) return <ErrorState message={error} />;

// Pagination loading
{isFetchingNextPage && <LoadingIndicator />}

// End of list
{!hasNextPage && items.length > 0 && <EndMessage />}
```

**Why separate components?**
- Reusable
- Each state styled independently
- Easy to test

---

### 6. Large List Optimization

**Chosen solution:** Virtualization (`@tanstack/react-virtual`)

```tsx
const virtualizer = useVirtualizer({
  count: items.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => ITEM_HEIGHT,  // 152px
  overscan: 5,
});
```

**How it works:**

```
Total elements: 100
Actual DOM elements: ~10-15 (only visible + overscan)
```

| 100 elements | DOM nodes | Memory |
|--------------|-----------|--------|
| Normal render | 100 | ~50MB |
| Virtualized | ~15 | ~8MB |

**Additional optimizations:**

1. **`React.memo`** - component only re-renders when props change

```tsx
export const NewsItem = memo(({ item }: NewsItemProps) => {
  // ...
});
```

2. **`loading="lazy"`** - images load only when approaching viewport

```tsx
<img loading="lazy" src={item.imageUrl} />
```

3. **Fixed height** (`ITEM_HEIGHT = 152px`) - speeds up virtualizer calculations

---

### 7. Cursor-based Pagination

**Chosen solution:** Cursor (not offset)

```typescript
// API response
{ items: [...], nextCursor: 20 | null }

// Next page
getNextPageParam: (lastPage) => lastPage.nextCursor
```

**Why not offset pagination?**

| Problem | Offset | Cursor |
|---------|--------|--------|
| New item added | Duplicates | No issue |
| Item deleted | Skips | No issue |
| Performance (large data) | Slow | Fast |

---

### 8. Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                      NewsFeed                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │  useInfiniteNews (TanStack Query)               │   │
│  │  - Cache, deduplication, background refetch     │   │
│  └─────────────────────────────────────────────────┘   │
│                         │                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │  useInfiniteScroll (IntersectionObserver)       │   │
│  │  - Trigger fetch, prevent duplicates            │   │
│  └─────────────────────────────────────────────────┘   │
│                         │                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │  useVirtualizer (DOM optimization)              │   │
│  │  - Render only visible items                    │   │
│  └─────────────────────────────────────────────────┘   │
│                         │                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │  NewsItem (memo) - Memoized component           │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## Conclusion

This architecture provides a **scalable**, **maintainable**, and **performant** solution. Each decision was made to solve real production problems.

---

---

<a name="ozbekcha"></a>

# O'zbekcha

## Infinite Scroll News Feed

React + TypeScript da qurilgan infinite scroll news feed komponenti.

## Texnologiyalar

- **React** + **TypeScript**
- **Vite** - Build tool
- **TanStack Query** - Data fetching va caching
- **TanStack Virtual** - Virtualization
- **Tailwind CSS** - Styling
- **Lucide React** - Ikonlar

## O'rnatish

```bash
# Dependencies o'rnatish
pnpm install

# Development server
pnpm dev

# Production build
pnpm build
```

## Loyiha Strukturasi

```
src/
├── api/           # Backend bilan aloqa
│   ├── news.api.ts
│   └── query-keys.ts
├── components/    # UI komponentlar
│   ├── news-feed.tsx
│   ├── news-item.tsx
│   └── ui/
├── hooks/         # Qayta ishlatiluvchi logika
│   ├── useInfiniteNews.ts
│   └── useInfiniteScroll.ts
├── constants/     # Doimiy qiymatlar
└── utils/         # Yordamchi funksiyalar
```

## Talablar

- Ma'lumotlar backenddan 20 ta elementli to'plamlar shaklida yuklanadi
- Yuklash foydalanuvchi ro'yxat oxiriga yetganda boshlanadi
- Takroriy so'rovlarning oldini olish
- Loading, error va "ro'yxat oxiri" holatlarini boshqarish
- Katta ro'yxatlar uchun renderingni optimallashtirish

---

## Arxitektura Qarorlari

### 1. Umumiy Arxitektura

Loyiha **modular arxitektura** asosida qurilgan - har bir concern alohida fayl/papkada.

**Sabab:** Separation of Concerns prinsipi - har bir qism o'z vazifasiga javobgar, testlash va o'zgartirish oson.

---

### 2. Data Fetching Strategiyasi

**Tanlangan yechim:** TanStack Query (React Query) + `useInfiniteQuery`

```typescript
const query = useInfiniteQuery({
  queryKey: [QUERY_KEYS.NEWS],
  queryFn: ({ pageParam }) => fetchNewsPage(pageParam),
  initialPageParam: 0,
  getNextPageParam: (lastPage) => lastPage.nextCursor,
  staleTime: 1000 * 60 * 5,    // 5 daqiqa
  gcTime: 1000 * 60 * 30,      // 30 daqiqa
});
```

**Nima uchun TanStack Query?**

| Muqobil | Kamchilik |
|---------|-----------|
| `useState` + `useEffect` | Cache yo'q, deduplication qo'lda, murakkab |
| SWR | Infinite query uchun kamroq moslashgan |
| Redux Toolkit Query | Kattaroq boilerplate |

**TanStack Query afzalliklari:**
- **Avtomatik cache** - bir xil ma'lumot qayta yuklanmaydi
- **Deduplication** - parallel so'rovlar bitta so'rovga birlashtiriladi
- **Background refetch** - foydalanuvchi bilmagan holda yangilanadi
- **`hasNextPage`/`isFetchingNextPage`** - tayyor holatlar

---

### 3. Infinite Scroll Mexanizmi

**Tanlangan yechim:** `IntersectionObserver` API

```typescript
const observer = new IntersectionObserver(
  (entries) => {
    if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  },
  { rootMargin: '200px', threshold: 0.1 }
);
```

**Nima uchun scroll event emas?**

| Yondashuv | Performance | Aniqlik |
|-----------|-------------|---------|
| `onScroll` event | Har scroll da fire | Throttle/debounce kerak |
| `IntersectionObserver` | Faqat kerak bo'lganda | Native, aniq |

**`rootMargin: '200px'`** - foydalanuvchi oxiriga yetmasdan 200px oldin yuklashni boshlaydi. Bu **seamless UX** ta'minlaydi.

---

### 4. Duplicate Request Oldini Olish

**Ikki darajali himoya:**

**1-daraja:** Hook ichida shart

```typescript
if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
  fetchNextPage();
}
```

**2-daraja:** TanStack Query ning ichki mexanizmi - bir xil `queryKey` bilan parallel so'rovlar avtomatik birlashtiriladi.

---

### 5. UI Holatlarini Boshqarish

**Uchta holat aniq ajratilgan:**

```tsx
// Initial loading
if (isLoading) return <LoadingState />;

// Error
if (error) return <ErrorState message={error} />;

// Pagination loading
{isFetchingNextPage && <LoadingIndicator />}

// End of list
{!hasNextPage && items.length > 0 && <EndMessage />}
```

**Nima uchun alohida komponentlar?**
- Qayta ishlatish mumkin
- Har bir holat mustaqil stillanadi
- Test qilish oson

---

### 6. Katta Ro'yxatlar Uchun Optimizatsiya

**Tanlangan yechim:** Virtualization (`@tanstack/react-virtual`)

```tsx
const virtualizer = useVirtualizer({
  count: items.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => ITEM_HEIGHT,  // 152px
  overscan: 5,
});
```

**Qanday ishlaydi?**

```
Jami elementlar: 100 ta
Haqiqiy DOM elementlar: ~10-15 ta (faqat ko'rinayotganlar + overscan)
```

| 100 element | DOM nodes | Memory |
|-------------|-----------|--------|
| Oddiy render | 100 | ~50MB |
| Virtualized | ~15 | ~8MB |

**Qo'shimcha optimizatsiyalar:**

1. **`React.memo`** - komponent faqat props o'zgarganda qayta renderlanadi

```tsx
export const NewsItem = memo(({ item }: NewsItemProps) => {
  // ...
});
```

2. **`loading="lazy"`** - rasmlar faqat viewport ga yaqinlashganda yuklanadi

```tsx
<img loading="lazy" src={item.imageUrl} />
```

3. **Doimiy balandlik** (`ITEM_HEIGHT = 152px`) - virtualizer hisob-kitoblarini tezlashtiradi

---

### 7. Cursor-based Pagination

**Tanlangan yechim:** Cursor (offset emas)

```typescript
// API javobi
{ items: [...], nextCursor: 20 | null }

// Keyingi sahifa
getNextPageParam: (lastPage) => lastPage.nextCursor
```

**Nima uchun offset pagination emas?**

| Muammo | Offset | Cursor |
|--------|--------|--------|
| Yangi element qo'shilsa | Duplikatlar | Muammo yo'q |
| Element o'chirilsa | Skip | Muammo yo'q |
| Performance (katta data) | Sekin | Tez |

---

### 8. Arxitektura Diagrammasi

```
┌─────────────────────────────────────────────────────────┐
│                      NewsFeed                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │  useInfiniteNews (TanStack Query)               │   │
│  │  - Cache, deduplication, background refetch     │   │
│  └─────────────────────────────────────────────────┘   │
│                         │                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │  useInfiniteScroll (IntersectionObserver)       │   │
│  │  - Trigger fetch, prevent duplicates            │   │
│  └─────────────────────────────────────────────────┘   │
│                         │                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │  useVirtualizer (DOM optimization)              │   │
│  │  - Render only visible items                    │   │
│  └─────────────────────────────────────────────────┘   │
│                         │                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │  NewsItem (memo) - Memoized component           │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## Xulosa

Ushbu arxitektura **scalable**, **maintainable** va **performant** yechim ta'minlaydi. Har bir qaror real production muammolarini hal qilish uchun tanlangan.
