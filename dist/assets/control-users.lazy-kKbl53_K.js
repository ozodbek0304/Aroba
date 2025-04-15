import{j as s,ac as N,A as F,d as S,e as _,I as v,K as T,r as d,Y as U,Z as k,B as u,x as y,a4 as I,_ as M,a5 as A,a6 as Q,a8 as $,a9 as z,aa as B,ab as O,C as G,z as p,i as q,u as R,b as H,t as J,D,p as K,q as Y,s as Z,v as V,g,P,J as b,y as E,m as W,T as X,$ as ss,a0 as es,E as as,c as is}from"./index-BuAxSJaU.js";import{u as C}from"./useRoles-Bsg_oAYG.js";import{L as os}from"./loading-CtOmVY-o.js";import{S as L,P as rs}from"./see-more-Ef9pY5VC.js";import{F as ts}from"./format-number-input-Dhf-qfk7.js";import{C as ns,a as ls,b as ms,c as cs,d as hs}from"./card-DPoa1Zzb.js";import{u as xs}from"./useConfirm-C4TJzy_o.js";import{T as fs}from"./trash-2-DM4hDO8P.js";import"./badge-EKaIYskS.js";function js({name:e,label:a,disabled:i,required:h,control:m,setValue:c,hideError:l=!0,className:t}){var f,o,r;return s.jsxs("div",{className:"w-full flex flex-col items-center",children:[s.jsx(N,{name:e,control:m,render:({field:n})=>s.jsxs("div",{className:"relative",children:[s.jsx(L,{d:{images:[{image:n.value instanceof File?URL.createObjectURL(n.value):n.value}]},children:s.jsxs(F,{className:`${t}`,children:[s.jsx(S,{src:n.value?n.value instanceof File?URL.createObjectURL(n.value):n.value:void 0,alt:"Selected Image",className:"object-cover"}),s.jsx(_,{children:"Rasm"})]})}),s.jsx("input",{type:"file",id:e,accept:"image/*",disabled:i,onChange:j=>{var w;const x=(w=j.target.files)==null?void 0:w[0];x&&(c==null||c(x),n.onChange(x))},hidden:!0})]})}),a&&s.jsx(v,{htmlFor:e,required:!!h,isError:!!((f=m._formState.errors)!=null&&f[e]),children:a}),!l&&((o=m._formState.errors)==null?void 0:o[e])&&s.jsx(T,{children:(r=m._formState.errors[e])==null?void 0:r.message})]})}function ps({data:e,values:a,setValues:i,label:h,disabled:m,isError:c,returnVal:l="value"}){const[t,f]=d.useState(!1),o=r=>{const n=l==="label"?r.label:r.value,j=a!=null&&a.find(x=>x===n)?a==null?void 0:a.filter(x=>x!==n):(a||[]).concat(n);i(j)};return s.jsxs(U,{modal:!0,open:t,onOpenChange:f,children:[s.jsx(k,{asChild:!0,children:s.jsxs(u,{variant:"outline",role:"combobox","aria-expanded":t,className:y("w-full justify-between",c&&"!text-destructive"),disabled:m,children:[a!=null&&a.length&&(a==null?void 0:a.length)<3?e==null?void 0:e.filter(r=>a==null?void 0:a.includes(r[l])).map(r=>r.label).join(", "):a!=null&&a.length?(a==null?void 0:a.length)+" ta tanlandi":h,s.jsx(I,{className:"ml-auto h-4 w-4 shrink-0 opacity-50"})]})}),s.jsx(M,{className:"w-auto p-0",children:s.jsxs(A,{children:[s.jsx(Q,{placeholder:h,className:"h-10"}),s.jsxs($,{children:[s.jsx(z,{children:"Mavjud emas"}),s.jsx(B,{className:"!overflow-y-scroll",children:e==null?void 0:e.map((r,n)=>s.jsxs(O,{onSelect:()=>o(r),children:[r.label,s.jsx(G,{className:y("ml-auto h-4 w-4",a!=null&&a.includes(r[l])?"opacity-100":"opacity-0")})]},n))})]})]})})]})}function ds({name:e,label:a,options:i,disabled:h,placeholder:m,required:c,control:l,hideError:t=!0,returnVal:f="label"}){var o,r,n;return s.jsxs("div",{children:[a&&s.jsx(v,{htmlFor:e,required:!!c,isError:!!((o=l._formState.errors)!=null&&o[e]),children:a}),s.jsx(N,{name:e,control:l,render:({field:j})=>{var x;return s.jsx("div",{className:"pt-0.5",children:s.jsx(ps,{data:i,values:j.value,setValues:j.onChange,label:m||a||"Select an option",disabled:l._formState.disabled||h,isError:!a&&!!((x=l._formState.errors)!=null&&x[e]),returnVal:f})})}}),!t&&((r=l._formState.errors)==null?void 0:r[e])&&s.jsx(T,{children:(n=l._formState.errors[e])==null?void 0:n.message})]})}function us({open:e,setOpen:a,current:i}){const h=q(),{post:m,patch:c,isPending:l}=R({onSuccess:o=>{h.setQueryData(["users/users/"],r=>i!=null&&i.id?r==null?void 0:r.map(n=>n.id==(i==null?void 0:i.id)?o:n):[...r,o])}},{contentType:"multipart/form-data"}),t=H({resolver:J(gs),disabled:l,values:i});async function f(o){i!=null&&i.id?(await c(`users/users/${i==null?void 0:i.id}/`,{...o,photo:typeof(o==null?void 0:o.photo)=="string"||o==null?void 0:o.photo,password:void 0}),a(!1),t.reset(),b.success("Muvaffaqiyatli tahrirlandi")):o.password?(await m("users/users/",o),a(!1),t.reset(),b.success("Muvaffaqiyatli qo'shildi")):b.error("Parol kiritilmadi")}return d.useEffect(()=>{e||t.reset()},[e,t]),s.jsx(D,{open:e,onOpenChange:a,children:s.jsxs(K,{className:"sm:max-w-md pb-6",children:[s.jsxs(Y,{children:[s.jsx(Z,{className:"text-left",children:i!=null&&i.id?"Foydalanuvchi tahrirlash":"Foydalanuvchi qo'shish"}),s.jsx(V,{})]}),s.jsx("div",{children:s.jsxs("form",{onSubmit:t.handleSubmit(f),className:"flex flex-col gap-4",children:[s.jsx(js,{control:t.control,name:"photo",label:"Rasm",className:"scale-[2] mb-6 mt-2"}),s.jsx(g,{methods:t,name:"first_name",label:"Ismi"}),s.jsx(g,{methods:t,name:"last_name",label:"Familiyasi"}),s.jsx(ts,{control:t.control,name:"phone",label:"Telefon raqam",format:"+###  ##  ###  ##  ##"}),s.jsx(ds,{control:t.control,name:"roles",label:"Rol",options:C().roles,returnVal:"value"}),s.jsx(g,{methods:t,name:"username",label:"Login"}),s.jsx(g,{methods:t,name:"password",label:"Parol",type:"password"}),s.jsx(u,{icon:s.jsx(P,{width:18}),type:"submit",loading:l,children:i!=null&&i.id?"Tahrirlash":"Qo'shish"})]})})]})})}const gs=p.object({photo:p.instanceof(File).or(p.string()),first_name:p.string().min(2),last_name:p.string().min(2),phone:p.string().length(12),roles:p.array(p.number().or(p.string())),username:p.string().min(1),password:p.string().optional()}),bs=({d:e,onEdit:a})=>{var f,o,r;const i=xs(),h=q(),{roles:m}=C(),c=R();async function l(){const n=await i({title:e.first_name+" "+e.last_name+" o'chirilsinmi?"});await c.remove(`users/users/${e==null?void 0:e.id}/`,{},{isConfirmed:n}),b.success("Muvaffaqiyatli o'chirildi"),h.setQueryData(["users/users/"],j=>j==null?void 0:j.filter(x=>x.id!=(e==null?void 0:e.id)))}const t=E("users/users/$/");return s.jsxs(ns,{className:"w-full sm:max-w-lg relative overflow-hidden",loading:c.isPending,children:[s.jsx(ls,{children:s.jsxs(ms,{className:"flex items-center justify-between gap-4",children:[s.jsxs(F,{className:"w-20 h-20 overflow-hidden rounded-full",children:[(e==null?void 0:e.photo)&&s.jsx(L,{d:{images:[{image:e==null?void 0:e.photo}]},children:s.jsx(S,{src:e==null?void 0:e.photo})}),s.jsx(_,{children:((f=e==null?void 0:e.first_name)==null?void 0:f[0])+" "+((o=e==null?void 0:e.last_name)==null?void 0:o[0])})]}),s.jsxs("p",{className:"sm:text-base text-right",children:[e==null?void 0:e.first_name," ",e==null?void 0:e.last_name]})]})}),s.jsxs(cs,{className:"flex flex-col gap-2 pt-0 pb-2",children:[s.jsxs("div",{className:"flex items-center justify-between",children:[s.jsx("p",{className:"text-muted-foreground font-medium",children:"Rol:"}),s.jsx("p",{children:(r=e==null?void 0:e.roles)==null?void 0:r.map(n=>{var j;return(j=m==null?void 0:m.find(x=>x.id==+n))==null?void 0:j.name}).join(", ")})]}),s.jsxs("div",{className:"flex items-center justify-between",children:[s.jsx("p",{className:"text-muted-foreground font-medium",children:"Telefon raqami:"}),s.jsx("a",{className:"font-semibold hover:text-primary",href:"tel: "+(e==null?void 0:e.phone),children:e==null?void 0:e.phone})]})]}),t&&s.jsxs(hs,{className:"!p-4 !pt-0 flex justify-end  -mr-2 -mb-2",children:[s.jsx(u,{icon:s.jsx(fs,{width:18}),className:"!text-destructive",size:"icon",variant:"ghost",onClick:l}),s.jsx(u,{icon:s.jsx(rs,{width:18}),size:"icon",className:"text-muted-foreground",variant:"ghost",onClick:a})]})]})},Cs=()=>{const[e,a]=d.useState("Barcha foydalanuvchilar"),[i,h]=d.useState(!1),[m,c]=d.useState(),{roles:l}=C(),{data:t,isFetching:f}=W("users/users/");return d.useEffect(()=>{i||c(void 0)},[i]),s.jsxs("div",{children:[s.jsxs(X,{value:e,defaultValue:"all",onValueChange:a,children:[s.jsx("div",{className:"max-w-full overflow-x-auto",children:s.jsx(ss,{children:[{name:"Barcha foydalanuvchilar",id:"all"},...l||[]].map(o=>s.jsx(es,{value:o.name,className:"relative",children:o.name},o.id))})}),s.jsx(os,{loading:f,children:s.jsxs(as,{value:e,className:"flex flex-col items-end",children:[E("users/users/")&&s.jsx(u,{icon:s.jsx(P,{width:18}),onClick:()=>h(!0),className:"mb-4",children:"Qo'shish"}),s.jsx("div",{className:"grid w-full grid-cols-[repeat(auto-fill,_minmax(20.5rem,_auto))] gap-4 md:gap-6",children:t==null?void 0:t.map((o,r)=>s.jsx(bs,{d:o,onEdit:()=>{c(o),h(!0)}},r))})]})})]}),s.jsx(us,{open:i,setOpen:h,current:m})]})},Rs=is("/_main/_admin/control-users")({component:()=>s.jsx(Cs,{})});export{Rs as Route};
