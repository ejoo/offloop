"use strict";(self.webpackChunkoffloop_doc=self.webpackChunkoffloop_doc||[]).push([[7943],{7173:(e,t,s)=>{s.r(t),s.d(t,{assets:()=>d,contentTitle:()=>o,default:()=>c,frontMatter:()=>r,metadata:()=>n,toc:()=>l});const n=JSON.parse('{"id":"Core-Modules-and-Features/Storage","title":"Storage","description":"The Storage interface provides methods to manage offline data access and processing in React Native and React applications. By default, it uses IndexedDB, but you can change it to LocalStorage. these store data locally when the app is offline and synchronize it when the connection is restored. THe data is store with the entity name. When offline the getEntity method retrieves the data from the storage.","source":"@site/docs/Core-Modules-and-Features/Storage.md","sourceDirName":"Core-Modules-and-Features","slug":"/storage","permalink":"/offloop/docs/storage","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":3,"frontMatter":{"id":"Storage","title":"Storage","sidebar_label":"Storage","slug":"/storage","sidebar_position":3},"sidebar":"tutorialSidebar","previous":{"title":"HTTP Requests","permalink":"/offloop/docs/http-requests"},"next":{"title":"Network Monitoring","permalink":"/offloop/docs/network-monitoring"}}');var i=s(4848),a=s(8453);const r={id:"Storage",title:"Storage",sidebar_label:"Storage",slug:"/storage",sidebar_position:3},o=void 0,d={},l=[{value:"Methods",id:"methods",level:3},{value:"IndexedDB Storage",id:"indexeddb-storage",level:2},{value:"Initialization",id:"initialization",level:3},{value:"Storing Data",id:"storing-data",level:3},{value:"Retrieving Data",id:"retrieving-data",level:3},{value:"Deleting Data",id:"deleting-data",level:3},{value:"Updating Data",id:"updating-data",level:3},{value:"Handling Requests",id:"handling-requests",level:3},{value:"LocalStorage Storage",id:"localstorage-storage",level:2},{value:"Initialization",id:"initialization-1",level:3},{value:"Storing Data",id:"storing-data-1",level:3},{value:"Retrieving Data",id:"retrieving-data-1",level:3},{value:"Deleting Data",id:"deleting-data-1",level:3},{value:"Updating Data",id:"updating-data-1",level:3}];function h(e){const t={code:"code",h2:"h2",h3:"h3",li:"li",p:"p",strong:"strong",ul:"ul",...(0,a.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(t.p,{children:["The ",(0,i.jsx)(t.code,{children:"Storage"})," interface provides methods to manage offline data access and processing in React Native and React applications. By default, it uses IndexedDB, but you can change it to LocalStorage. these store data locally when the app is offline and synchronize it when the connection is restored. THe data is store with the entity name. When offline the getEntity method retrieves the data from the storage."]}),"\n",(0,i.jsx)(t.h3,{id:"methods",children:"Methods"}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"init()"}),": Initializes the storage. Returns a promise that resolves when the initialization is complete."]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"save(storeName: string, data: unknown)"}),": Saves data to the specified store. Returns a promise that resolves when the data is saved."]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"saveUnique?(storeName: string, data: unknown)"}),": Optionally saves unique data to the specified store. Returns a promise that resolves when the data is saved."]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"get(storeName: string, id: string)"}),": Retrieves data by ID from the specified store. Returns a promise that resolves with the data or null if not found."]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"delete(storeName: string, id: string)"}),": Deletes data by ID from the specified store. Returns a promise that resolves when the data is deleted."]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"getAll(storeName: string)"}),": Retrieves all data from the specified store. Returns a promise that resolves with an array of data."]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"update(storeName: string, data: unknown)"}),": Updates data in the specified store. Returns a promise that resolves when the data is updated."]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"getByContentHash?(storeName: string, contentHash: string)"}),": Optionally retrieves data by content hash from the specified store. Returns a promise that resolves with the data or null if not found."]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"deleteAll?(storeName: string)"}),": Optionally deletes all data from the specified store. Returns a promise that resolves when all data is deleted."]}),"\n"]}),"\n",(0,i.jsx)(t.h2,{id:"indexeddb-storage",children:"IndexedDB Storage"}),"\n",(0,i.jsxs)(t.p,{children:["The ",(0,i.jsx)(t.code,{children:"IndexDbStorage"})," implements the ",(0,i.jsx)(t.code,{children:"Storage"})," interface using IndexedDB to store data. IndexedDB is a low-level API for client-side storage of significant amounts of structured data, including files/blobs. It allows for high-performance searches using indexes."]}),"\n",(0,i.jsx)(t.h3,{id:"initialization",children:"Initialization"}),"\n",(0,i.jsxs)(t.p,{children:["The ",(0,i.jsx)(t.code,{children:"init"})," method initializes the IndexedDB database. It creates object stores for entities and a sync queue if they do not already exist."]}),"\n",(0,i.jsx)(t.h3,{id:"storing-data",children:"Storing Data"}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"save(storeName: string, data: unknown)"}),": Saves data to the specified store. The data must be an object and contain an ",(0,i.jsx)(t.code,{children:"id"})," property."]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"saveUnique(storeName: string, data: unknown)"}),": Saves unique data to the specified store. It ensures that each entity is unique by checking the ",(0,i.jsx)(t.code,{children:"entity"})," property."]}),"\n"]}),"\n",(0,i.jsx)(t.h3,{id:"retrieving-data",children:"Retrieving Data"}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"get(storeName: string, id: string)"}),": Retrieves data by ID from the specified store."]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"getAll(storeName: string)"}),": Retrieves all data from the specified store."]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"getByContentHash(storeName: string, contentHash: string)"}),": Retrieves data by content hash from the specified store."]}),"\n"]}),"\n",(0,i.jsx)(t.h3,{id:"deleting-data",children:"Deleting Data"}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"delete(storeName: string, id: string)"}),": Deletes data by ID from the specified store."]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"deleteAll(storeName: string)"}),": Deletes all data from the specified store."]}),"\n"]}),"\n",(0,i.jsx)(t.h3,{id:"updating-data",children:"Updating Data"}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"update(storeName: string, data: unknown)"}),": Updates data in the specified store. This method internally calls the ",(0,i.jsx)(t.code,{children:"save"})," method."]}),"\n"]}),"\n",(0,i.jsx)(t.h3,{id:"handling-requests",children:"Handling Requests"}),"\n",(0,i.jsxs)(t.p,{children:["The ",(0,i.jsx)(t.code,{children:"IndexDbStorage"})," class handles requests using IndexedDB transactions. Each method creates a transaction and performs the necessary operations (e.g., ",(0,i.jsx)(t.code,{children:"put"}),", ",(0,i.jsx)(t.code,{children:"get"}),", ",(0,i.jsx)(t.code,{children:"delete"}),"). The transactions ensure that the operations are atomic and consistent."]}),"\n",(0,i.jsx)(t.h2,{id:"localstorage-storage",children:"LocalStorage Storage"}),"\n",(0,i.jsxs)(t.p,{children:["The ",(0,i.jsx)(t.code,{children:"LocalStorage"})," implements the ",(0,i.jsx)(t.code,{children:"Storage"})," interface using LocalStorage to store data. LocalStorage is a simple key-value storage mechanism available in web browsers, suitable for storing small amounts of data."]}),"\n",(0,i.jsx)(t.h3,{id:"initialization-1",children:"Initialization"}),"\n",(0,i.jsxs)(t.p,{children:["The ",(0,i.jsx)(t.code,{children:"init"})," method initializes the LocalStorage storage. It logs a message indicating that the storage has been initialized."]}),"\n",(0,i.jsx)(t.h3,{id:"storing-data-1",children:"Storing Data"}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"save(storeName: string, data: unknown)"}),": Saves data to the specified store. The data is serialized to a JSON string and stored with a key that includes a hash of the data."]}),"\n"]}),"\n",(0,i.jsx)(t.h3,{id:"retrieving-data-1",children:"Retrieving Data"}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"get(storeName: string, id: string)"}),": Retrieves data by ID from the specified store. The data is deserialized from a JSON string."]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"getAll(storeName: string)"}),": Retrieves all data from the specified store. It iterates over all keys in LocalStorage and collects the data that matches the store name."]}),"\n"]}),"\n",(0,i.jsx)(t.h3,{id:"deleting-data-1",children:"Deleting Data"}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"delete(storeName: string, id: string)"}),": Deletes data by ID from the specified store. It removes the item from LocalStorage using the key."]}),"\n"]}),"\n",(0,i.jsx)(t.h3,{id:"updating-data-1",children:"Updating Data"}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"update(storeName: string, data: unknown)"}),": Updates data in the specified store. This method internally calls the ",(0,i.jsx)(t.code,{children:"save"})," method."]}),"\n"]})]})}function c(e={}){const{wrapper:t}={...(0,a.R)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(h,{...e})}):h(e)}},8453:(e,t,s)=>{s.d(t,{R:()=>r,x:()=>o});var n=s(6540);const i={},a=n.createContext(i);function r(e){const t=n.useContext(a);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function o(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:r(e.components),n.createElement(a.Provider,{value:t},e.children)}}}]);