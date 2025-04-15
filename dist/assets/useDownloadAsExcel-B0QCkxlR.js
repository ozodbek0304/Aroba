import{H as s,r as c,G as l}from"./index-BuAxSJaU.js";/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=s("Download",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]]),p=({url:n,name:a})=>{const[r,o]=c.useState(!1);return{trigger:async()=>{o(!0);try{const t=await l.get(n,{responseType:"blob"});t.status===200&&i({data:t.data,name:a})}catch(t){console.error("Error downloading file:",t)}finally{o(!1)}},isFetching:r}};function i({data:n,name:a=new Date().toISOString()}){const r=new Blob([n]),o=window.URL.createObjectURL(r),e=document.createElement("a");e.href=o,e.download=a+".xlsx",document.body.appendChild(e),e.click(),e.remove(),window.URL.revokeObjectURL(o)}export{w as D,p as u};
