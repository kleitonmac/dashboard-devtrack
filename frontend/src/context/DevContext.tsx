import { createContext, ReactNode } from 'react'

type Props = {
  children: ReactNode
}

const DevContext = createContext({})

export function DevProvider({ children }: Props) {
  return <DevContext.Provider value={{}}>{children}</DevContext.Provider>
}
