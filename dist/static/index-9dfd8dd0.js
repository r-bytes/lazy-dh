import{p as f,r as l,a_ as P,j as e,aD as h,i as j,a$ as B,a2 as E,aE as I,b0 as H,aB as b,al as k,b1 as C,az as v}from"./sanity-14b74ea9.js";const y=f(v)`
  position: relative;
`;function R(a){const{children:o}=a,{collapsed:t}=B();return e.jsx(y,{hidden:t,height:"fill",overflow:"auto",children:o})}function S(a){const{actionHandlers:o,index:t,menuItems:n,menuItemGroups:r,title:i}=a,{features:s}=E();return!(n!=null&&n.length)&&!i?null:e.jsx(I,{actions:e.jsx(H,{menuItems:n,menuItemGroups:r,actionHandlers:o}),backButton:s.backButton&&t>0&&e.jsx(b,{as:k,"data-as":"a",icon:C,mode:"bleed",tooltipProps:{content:"Back"}}),title:i})}function g(a){const{index:o,pane:t,paneKey:n,...r}=a,{child:i,component:s,menuItems:u,menuItemGroups:d,type:T,...p}=t,[c,m]=l.useState(null),{title:x=""}=P(t);return e.jsxs(h,{id:n,minWidth:320,selected:r.isSelected,children:[e.jsx(S,{actionHandlers:c==null?void 0:c.actionHandlers,index:o,menuItems:u,menuItemGroups:d,title:x}),e.jsxs(R,{children:[j.isValidElementType(s)&&l.createElement(s,{...r,...p,ref:m,child:i,paneKey:n}),l.isValidElement(s)&&s]})]})}export{g as default};