'use client'

import { store } from '@/lib/redux/store'
import React from 'react'
import { Provider as ProviderRedux } from 'react-redux'
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from 'redux-persist'
import AuthProvider from './AuthProvider'
import { Toaster } from './ui/sonner';

const persistor = persistStore(store)

interface ProviderProps {
  children: React.ReactNode
}

export default function Provider({ children }: ProviderProps) {
  return (
    <ProviderRedux store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <Toaster />
          {children}
        </AuthProvider>
      </PersistGate>
    </ProviderRedux>
  )
}
