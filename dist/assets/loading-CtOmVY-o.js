import{i as a,r as i,a3 as u,j as n,S as o}from"./index-BuAxSJaU.js";function l(s,t){const e=a(t),r=e.getQueryCache();return i.useSyncExternalStore(i.useCallback(c=>r.subscribe(u.batchCalls(c)),[r]),()=>e.isFetching(s),()=>e.isFetching(s))}const x=({children:s,loading:t})=>{const e=l({queryKey:["user/modules/"]});return n.jsx(n.Fragment,{children:t||e?n.jsx("div",{className:"w-full h-[80vh] flex items-center justify-center",children:n.jsx(o,{size:"responsive"})}):s})};export{x as L};
