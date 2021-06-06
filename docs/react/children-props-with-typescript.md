---
layout: default
title: React children props with TypeScript
date: 2021-06-06
parent: React
---

# React children props with TypeScript

React provides `React.FC` type to define the component that accepts children as a prop:

```typescript
import React, { FC } from 'react'

type Props = {
  text: string
}

export const Component: FC<Props> = ({ text, children }) => {
  return (
    <div>
      <p>{text}</p>
      {children}
    </div>
  )
}
```

React also includes `React.PropsWithChildren` type to enhance custom type with a definition for children.

```typescript
import React, { PropsWithChildren } from 'react'

type Props = PropsWithChildren<{
  text: string
}>

export const Component = ({ text, children }: Props) => {
  return (
    <div>
      <p>{text}</p>
      {children}
    </div>
  )
}
```

`PropsWithChildren` is nothing more than a generic type that takes some type as an argument and combine it with `React.ReactNode` type:

```typescript
type React.PropsWithChildren<P> = P & { children?: React.ReactNode }
```

The same effect can be achieved manually by including children on the props that is passed to a component:

```typescript
import React, { ReactNode } from 'react'

type Props = {
  text: string
  children?: ReactNode
}
```
