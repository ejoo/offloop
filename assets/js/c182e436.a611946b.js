"use strict";(self.webpackChunkoffloop_doc=self.webpackChunkoffloop_doc||[]).push([[5789],{3957:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>l,contentTitle:()=>o,default:()=>u,frontMatter:()=>a,metadata:()=>i,toc:()=>c});const i=JSON.parse('{"id":"Core-Modules-and-Features/QueueManager","title":"Queue Manager","description":"Overview","source":"@site/docs/Core-Modules-and-Features/QueueManager.md","sourceDirName":"Core-Modules-and-Features","slug":"/queue-manager","permalink":"/offloop/docs/queue-manager","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":5,"frontMatter":{"id":"QueueManager","title":"Queue Manager","sidebar_label":"Queue Manager","slug":"/queue-manager","sidebar_position":5},"sidebar":"tutorialSidebar","previous":{"title":"Network Monitoring","permalink":"/offloop/docs/network-monitoring"},"next":{"title":"Queue Processor","permalink":"/offloop/docs/queue-processor"}}');var t=s(4848),r=s(8453);const a={id:"QueueManager",title:"Queue Manager",sidebar_label:"Queue Manager",slug:"/queue-manager",sidebar_position:5},o=void 0,l={},c=[{value:"Overview",id:"overview",level:2},{value:"Key Responsibilities",id:"key-responsibilities",level:2},{value:"Components",id:"components",level:2},{value:"Abstract Class: <code>QueueManager</code>",id:"abstract-class-queuemanager",level:3},{value:"Concrete Class: <code>SyncQueueManager</code>",id:"concrete-class-syncqueuemanager",level:3},{value:"Importance",id:"importance",level:2}];function d(e){const n={code:"code",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...(0,r.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h2,{id:"overview",children:"Overview"}),"\n",(0,t.jsxs)(n.p,{children:["The ",(0,t.jsx)(n.code,{children:"QueueManager"})," is an essential component of the library designed to support React Native/React applications by handling the queuing and synchronization of data. It ensures that data operations are performed reliably and efficiently, even in scenarios where network connectivity is intermittent or unreliable. This allows developers to enable offline data access and processing without having to manage it themselves."]}),"\n",(0,t.jsx)(n.h2,{id:"key-responsibilities",children:"Key Responsibilities"}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"Queue Management"}),": The ",(0,t.jsx)(n.code,{children:"QueueManager"})," is responsible for adding, processing, retrieving, and deleting items from the queue."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"Data Synchronization"}),": It ensures that data operations (create, update, delete, get) are synchronized with a remote server."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"Retry Mechanism"}),": The ",(0,t.jsx)(n.code,{children:"QueueManager"})," includes a retry mechanism to handle transient errors and ensure data consistency."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"Event Handling"}),": It integrates with an ",(0,t.jsx)(n.code,{children:"EventManager"})," to handle specific events such as data synchronization and item deletion from the queue."]}),"\n"]}),"\n",(0,t.jsx)(n.h2,{id:"components",children:"Components"}),"\n",(0,t.jsxs)(n.h3,{id:"abstract-class-queuemanager",children:["Abstract Class: ",(0,t.jsx)(n.code,{children:"QueueManager"})]}),"\n",(0,t.jsxs)(n.p,{children:["The ",(0,t.jsx)(n.code,{children:"QueueManager"})," abstract class defines the core methods that any queue manager implementation must provide:"]}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"addToQueue(item: SyncQueueItem): Promise<void>"}),": Adds an item to the queue."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"processQueue(): Promise<void>"}),": Processes the items in the queue."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"getQueue(): Promise<SyncQueueItem[]>"}),": Retrieves all items from the queue."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"deleteFromQueue(item: SyncQueueItem): Promise<void>"}),": Deletes an item from the queue."]}),"\n"]}),"\n",(0,t.jsxs)(n.h3,{id:"concrete-class-syncqueuemanager",children:["Concrete Class: ",(0,t.jsx)(n.code,{children:"SyncQueueManager"})]}),"\n",(0,t.jsxs)(n.p,{children:["The ",(0,t.jsx)(n.code,{children:"SyncQueueManager"})," class extends the ",(0,t.jsx)(n.code,{children:"QueueManager"})," and provides a concrete implementation of the queue management and synchronization logic:"]}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"Constructor"}),": Initializes the ",(0,t.jsx)(n.code,{children:"SyncQueueManager"})," with storage, API base URL, HTTP client, and maximum retries."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"addToQueue"}),": Adds an item to the queue, checking for duplicates based on content hash."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"processQueue"}),": Processes the queue, synchronizing each item with the remote server and handling retries for failed operations."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"getQueue"}),": Retrieves all items from the queue."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"deleteFromQueue"}),": Deletes an item from the queue and emits an event."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"clearQueue"}),": Clears all items from the queue, regardless of online status or processing status."]}),"\n"]}),"\n",(0,t.jsx)(n.h2,{id:"importance",children:"Importance"}),"\n",(0,t.jsxs)(n.p,{children:["The ",(0,t.jsx)(n.code,{children:"QueueManager"})," is crucial for the following reasons:"]}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"Offline Support"}),": It enables React Native/React applications to function seamlessly offline by managing data operations locally and synchronizing them when connectivity is restored."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"Reliability"}),": It ensures that data operations are reliably queued and processed, even in the face of network issues."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"Consistency"}),": By handling retries and synchronization, it maintains data consistency between the client and the server."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"Scalability"}),": The queue management system allows for scalable data operations, handling large volumes of data efficiently."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"Event-Driven"}),": Integration with the ",(0,t.jsx)(n.code,{children:"EventManager"})," allows for responsive and event-driven data processing."]}),"\n"]})]})}function u(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(d,{...e})}):d(e)}},8453:(e,n,s)=>{s.d(n,{R:()=>a,x:()=>o});var i=s(6540);const t={},r=i.createContext(t);function a(e){const n=i.useContext(r);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:a(e.components),i.createElement(r.Provider,{value:n},e.children)}}}]);