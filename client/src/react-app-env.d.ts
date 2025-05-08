/// <reference types="react-scripts" />

import * as React from 'react';

declare global {
  namespace JSX {
    interface Element extends React.ReactElement {}
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

declare module 'react' {
  export type Key = string | number;
  
  export type JSXElementConstructor<P> = 
    | ((props: P) => ReactElement<any, any> | null)
    | (new (props: P) => Component<any, any>);

  export interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: Key | null;
  }

  export type FC<P = {}> = FunctionComponent<P>;
  
  export interface FunctionComponent<P = {}> {
    (props: P, context?: any): ReactElement<any, any> | null;
    displayName?: string;
  }

  export interface Component<P = {}, S = {}> {
    render(): ReactNode;
    props: P;
    state: S;
    context: any;
  }

  export type ReactNode = 
    | ReactElement 
    | string 
    | number 
    | Iterable<ReactNode>
    | boolean 
    | null 
    | undefined;

  export interface SyntheticEvent<T = Element> {
    nativeEvent: Event;
    target: EventTarget & T;
    currentTarget: EventTarget & T;
    bubbles: boolean;
    cancelable: boolean;
    defaultPrevented: boolean;
    eventPhase: number;
    isTrusted: boolean;
    preventDefault(): void;
    stopPropagation(): void;
    isPropagationStopped(): boolean;
    persist(): void;
    timeStamp: number;
    type: string;
  }

  export interface MouseEvent<T = Element> extends SyntheticEvent<T> {
    altKey: boolean;
    button: number;
    buttons: number;
    clientX: number;
    clientY: number;
    ctrlKey: boolean;
    metaKey: boolean;
    movementX: number;
    movementY: number;
    pageX: number;
    pageY: number;
    relatedTarget: EventTarget;
    screenX: number;
    screenY: number;
    shiftKey: boolean;
  }

  export interface FormEvent<T = Element> extends SyntheticEvent<T> {
    // No additional properties needed
  }

  export interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
    target: EventTarget & T & { 
      value: any; 
      checked?: boolean;
    };
  }

  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  export function useEffect(effect: () => (void | (() => void)), deps?: readonly any[]): void;
  export function useContext<T>(context: React.Context<T>): T;
}

declare module 'react/jsx-runtime';
declare module 'react-dom';
declare module 'react-router-dom'; 