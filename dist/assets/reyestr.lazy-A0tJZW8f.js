import{m as n,j as a,l as o,c as t}from"./index-BuAxSJaU.js";import{D as i}from"./download-as-excel-C7gdF7ep.js";import{D as l}from"./datatable-BQkt-0G4.js";import"./useDownloadAsExcel-B0QCkxlR.js";import"./cursor-pagination-BTjgdc8e.js";import"./pagination-BuI0EWJ8.js";const c=()=>{const{data:e,isLoading:s}=n("accountant/finished-orders/");return a.jsx("div",{className:"out-container",children:a.jsx(l,{columns:m,data:e==null?void 0:e.results,loading:s,paginationProps:{totalPages:(e==null?void 0:e.total_pages)||1},head:a.jsxs("div",{className:"flex items-center justify-between gap-4",children:[a.jsx("h3",{className:"text-lg sm:text-xl font-medium",children:"Reyestr"}),a.jsx(i,{url:"accountant/finished-orders-excel/",name:"Buxgalteriya-Reyestr"})]})})})},m=[{header:"№",cell:({row:e})=>e.index+1},{header:"Firma nomi",cell:({row:e})=>{var s,r;return a.jsxs("div",{className:"flex flex-col",children:[(s=e.original)==null?void 0:s.client_name," ",a.jsx("span",{className:"text-muted-foreground",children:(r=e.original)==null?void 0:r.phone})]})}},{header:"Sana",cell:({row:e})=>{var s,r;return(r=(s=e.original)==null?void 0:s.date)==null?void 0:r.split("/").join(".")}},{header:"Qayerdan",accessorKey:"loading"},{header:"Qayerga",accessorKey:"unloading"},{header:"Mashina raqami",accessorKey:"car_number"},{header:"Summa",cell:({row:e})=>o(e.original.income)}],y=t("/_main/_accounting/reyestr")({component:()=>a.jsx(c,{})});export{y as Route};
