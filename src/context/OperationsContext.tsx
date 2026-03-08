import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Operation {
  id: number;
  time: string;
  method: 'PUT' | 'GET' | 'DELETE';
  key: string;
  tenant: string;
  result: 'HIT' | 'MISS' | 'OK' | 'ERROR';
  latency: number;
}

interface OpsContextType {
  operations: Operation[];
  addOperation: (op: Omit<Operation, 'id' | 'time'>) => void;
}

const OpsContext = createContext<OpsContextType>({ operations: [], addOperation: () => {} });

export function OperationsProvider({ children }: { children: React.ReactNode }) {
  const [operations, setOperations] = useState<Operation[]>([]);

  const addOperation = useCallback((op: Omit<Operation, 'id' | 'time'>) => {
    setOperations(prev => {
      const next = [{ ...op, id: Date.now(), time: new Date().toLocaleTimeString() }, ...prev];
      return next.slice(0, 50);
    });
  }, []);

  return (
    <OpsContext.Provider value={{ operations, addOperation }}>
      {children}
    </OpsContext.Provider>
  );
}

export const useOperations = () => useContext(OpsContext);
