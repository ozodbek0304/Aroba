import{al as O,r as s,am as q,an as A,j as a,ao as w,ap as g,aq as B,ar as H,as as K,x as j,C as L}from"./index-BuAxSJaU.js";var R="Checkbox",[z,Q]=O(R),[T,X]=z(R),N=s.forwardRef((e,i)=>{const{__scopeCheckbox:t,name:l,checked:p,defaultChecked:o,required:h,disabled:d,value:k="on",onCheckedChange:C,form:u,...m}=e,[n,x]=s.useState(null),v=q(i,r=>x(r)),y=s.useRef(!1),P=n?u||!!n.closest("form"):!0,[f=!1,E]=A({prop:p,defaultProp:o,onChange:C}),M=s.useRef(f);return s.useEffect(()=>{const r=n==null?void 0:n.form;if(r){const b=()=>E(M.current);return r.addEventListener("reset",b),()=>r.removeEventListener("reset",b)}},[n,E]),a.jsxs(T,{scope:t,state:f,disabled:d,children:[a.jsx(w.button,{type:"button",role:"checkbox","aria-checked":c(f)?"mixed":f,"aria-required":h,"data-state":_(f),"data-disabled":d?"":void 0,disabled:d,value:k,...m,ref:v,onKeyDown:g(e.onKeyDown,r=>{r.key==="Enter"&&r.preventDefault()}),onClick:g(e.onClick,r=>{E(b=>c(b)?!0:!b),P&&(y.current=r.isPropagationStopped(),y.current||r.stopPropagation())})}),P&&a.jsx(F,{control:n,bubbles:!y.current,name:l,value:k,checked:f,required:h,disabled:d,form:u,style:{transform:"translateX(-100%)"},defaultChecked:c(o)?!1:o})]})});N.displayName=R;var S="CheckboxIndicator",I=s.forwardRef((e,i)=>{const{__scopeCheckbox:t,forceMount:l,...p}=e,o=X(S,t);return a.jsx(B,{present:l||c(o.state)||o.state===!0,children:a.jsx(w.span,{"data-state":_(o.state),"data-disabled":o.disabled?"":void 0,...p,ref:i,style:{pointerEvents:"none",...e.style}})})});I.displayName=S;var F=e=>{const{control:i,checked:t,bubbles:l=!0,defaultChecked:p,...o}=e,h=s.useRef(null),d=H(t),k=K(i);s.useEffect(()=>{const u=h.current,m=window.HTMLInputElement.prototype,x=Object.getOwnPropertyDescriptor(m,"checked").set;if(d!==t&&x){const v=new Event("click",{bubbles:l});u.indeterminate=c(t),x.call(u,c(t)?!1:t),u.dispatchEvent(v)}},[d,t,l]);const C=s.useRef(c(t)?!1:t);return a.jsx("input",{type:"checkbox","aria-hidden":!0,defaultChecked:p??C.current,...o,tabIndex:-1,ref:h,style:{...e.style,...k,position:"absolute",pointerEvents:"none",opacity:0,margin:0}})};function c(e){return e==="indeterminate"}function _(e){return c(e)?"indeterminate":e?"checked":"unchecked"}var D=N,$=I;const G=s.forwardRef(({className:e,...i},t)=>a.jsx(D,{ref:t,className:j("peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",e),...i,children:a.jsx($,{className:j("flex items-center justify-center text-current"),children:a.jsx(L,{className:"h-3.5 w-3.5"})})}));G.displayName=D.displayName;export{G as C};
