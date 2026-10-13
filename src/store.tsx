import { createContext, useContext, type ReactNode } from 'react';
import { seed, type Demo } from './data';
import { useDemoStorage } from './persistence';
import { validDemo, validateBookingChange } from './validation';
const KEY='ember-olive-demo-v1';
type Store={data:Demo;update:(fn:(data:Demo)=>Demo,activity?:string)=>Promise<boolean>;reset:()=>Promise<boolean>;storageError:string;exportRecovery:()=>void};
const Context=createContext<Store|null>(null);
export function Provider({children}:{children:ReactNode}) {
 const {data,warning,change,reset,exportRecovery,report}=useDemoStorage(KEY,seed,validDemo);
 const update:Store['update']=(fn,activity)=>{try{return change(before=>{const next=fn(before);validateBookingChange(before,next);if(activity)next.activity=[activity,...next.activity].slice(0,30);return next;});}catch(error){report(error instanceof Error?error.message:'This change could not be saved.');return Promise.resolve(false);}};
 return <Context.Provider value={{data,update,reset,storageError:warning,exportRecovery}}>{children}</Context.Provider>;
}
export function useDemo(){const value=useContext(Context);if(!value)throw Error('Missing demo provider');return value;}
