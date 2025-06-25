import{c as vt,u as Je,a as ge,b as Oe,d as D,e as S,t as L,i as v,f as V,g as d,h as Z,s as l,m as Ie,j as pt,k as kt,l as qe,n as Ct,r as Ne,o as dt,p as St,D as _t}from"./index-UadIH4RO.js";const ht=vt(void 0),$t=vt(void 0),wt=()=>{const e=Je($t);if(!e)throw new Error("useDevtoolsOnClose must be used within a TanStackRouterDevtools component");return e},Ft=typeof window>"u";function Ve(e){const t={pending:"yellow",success:"green",error:"red",notFound:"purple",redirected:"gray"};return e.isFetching&&e.status==="success"?e.isFetching==="beforeLoad"?"purple":"blue":t[e.status]}function zt(e,t){const o=e.find(r=>r.routeId===t.id);return o?Ve(o):"gray"}function Ut(){const[e,t]=ge(!1);return(Ft?Oe:D)(()=>{t(!0)}),e}const Mt=e=>{const t=Object.getOwnPropertyNames(Object(e)),o=typeof e=="bigint"?`${e.toString()}n`:e;try{return JSON.stringify(o,t)}catch{return"unable to stringify"}};function Et(e,t=[o=>o]){return e.map((o,r)=>[o,r]).sort(([o,r],[p,s])=>{for(const a of t){const c=a(o),u=a(p);if(typeof c>"u"){if(typeof u>"u")continue;return 1}if(c!==u)return c>u?1:-1}return r-s}).map(([o])=>o)}let Dt={data:""},Bt=e=>typeof window=="object"?((e?e.querySelector("#_goober"):window._goober)||Object.assign((e||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:e||Dt,Ot=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,It=/\/\*[^]*?\*\/|  +/g,ct=/\n+/g,ke=(e,t)=>{let o="",r="",p="";for(let s in e){let a=e[s];s[0]=="@"?s[1]=="i"?o=s+" "+a+";":r+=s[1]=="f"?ke(a,s):s+"{"+ke(a,s[1]=="k"?"":t)+"}":typeof a=="object"?r+=ke(a,t?t.replace(/([^,])+/g,c=>s.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,u=>/&/.test(u)?u.replace(/&/g,c):c?c+" "+u:u)):s):a!=null&&(s=/^--/.test(s)?s:s.replace(/[A-Z]/g,"-$&").toLowerCase(),p+=ke.p?ke.p(s,a):s+":"+a+";")}return o+(t&&p?t+"{"+p+"}":p)+r},$e={},xt=e=>{if(typeof e=="object"){let t="";for(let o in e)t+=o+xt(e[o]);return t}return e},Gt=(e,t,o,r,p)=>{let s=xt(e),a=$e[s]||($e[s]=(u=>{let n=0,i=11;for(;n<u.length;)i=101*i+u.charCodeAt(n++)>>>0;return"go"+i})(s));if(!$e[a]){let u=s!==e?e:(n=>{let i,$,x=[{}];for(;i=Ot.exec(n.replace(It,""));)i[4]?x.shift():i[3]?($=i[3].replace(ct," ").trim(),x.unshift(x[0][$]=x[0][$]||{})):x[0][i[1]]=i[2].replace(ct," ").trim();return x[0]})(e);$e[a]=ke(p?{["@keyframes "+a]:u}:u,o?"":"."+a)}let c=o&&$e.g?$e.g:null;return o&&($e.g=$e[a]),((u,n,i,$)=>{$?n.data=n.data.replace($,u):n.data.indexOf(u)===-1&&(n.data=i?u+n.data:n.data+u)})($e[a],t,r,c),a},Tt=(e,t,o)=>e.reduce((r,p,s)=>{let a=t[s];if(a&&a.call){let c=a(o),u=c&&c.props&&c.props.className||/^go/.test(c)&&c;a=u?"."+u:c&&typeof c=="object"?c.props?"":ke(c,""):c===!1?"":c}return r+p+(a??"")},"");function Fe(e){let t=this||{},o=e.call?e(t.p):e;return Gt(o.unshift?o.raw?Tt(o,[].slice.call(arguments,1),t.p):o.reduce((r,p)=>Object.assign(r,p&&p.call?p(t.p):p),{}):o,Bt(t.target),t.g,t.o,t.k)}Fe.bind({g:1});Fe.bind({k:1});const E={colors:{inherit:"inherit",current:"currentColor",transparent:"transparent",black:"#000000",white:"#ffffff",neutral:{50:"#f9fafb",100:"#f2f4f7",200:"#eaecf0",300:"#d0d5dd",400:"#98a2b3",500:"#667085",600:"#475467",700:"#344054",800:"#1d2939",900:"#101828"},darkGray:{50:"#525c7a",100:"#49536e",200:"#414962",300:"#394056",400:"#313749",500:"#292e3d",600:"#212530",700:"#191c24",800:"#111318",900:"#0b0d10"},gray:{50:"#f9fafb",100:"#f2f4f7",200:"#eaecf0",300:"#d0d5dd",400:"#98a2b3",500:"#667085",600:"#475467",700:"#344054",800:"#1d2939",900:"#101828"},blue:{25:"#F5FAFF",50:"#EFF8FF",100:"#D1E9FF",200:"#B2DDFF",300:"#84CAFF",400:"#53B1FD",500:"#2E90FA",600:"#1570EF",700:"#175CD3",800:"#1849A9",900:"#194185"},green:{25:"#F6FEF9",50:"#ECFDF3",100:"#D1FADF",200:"#A6F4C5",300:"#6CE9A6",400:"#32D583",500:"#12B76A",600:"#039855",700:"#027A48",800:"#05603A",900:"#054F31"},red:{50:"#fef2f2",100:"#fee2e2",200:"#fecaca",300:"#fca5a5",400:"#f87171",500:"#ef4444",600:"#dc2626",700:"#b91c1c",800:"#991b1b",900:"#7f1d1d",950:"#450a0a"},yellow:{25:"#FFFCF5",50:"#FFFAEB",100:"#FEF0C7",200:"#FEDF89",300:"#FEC84B",400:"#FDB022",500:"#F79009",600:"#DC6803",700:"#B54708",800:"#93370D",900:"#7A2E0E"},purple:{25:"#FAFAFF",50:"#F4F3FF",100:"#EBE9FE",200:"#D9D6FE",300:"#BDB4FE",400:"#9B8AFB",500:"#7A5AF8",600:"#6938EF",700:"#5925DC",800:"#4A1FB8",900:"#3E1C96"},teal:{25:"#F6FEFC",50:"#F0FDF9",100:"#CCFBEF",200:"#99F6E0",300:"#5FE9D0",400:"#2ED3B7",500:"#15B79E",600:"#0E9384",700:"#107569",800:"#125D56",900:"#134E48"},pink:{25:"#fdf2f8",50:"#fce7f3",100:"#fbcfe8",200:"#f9a8d4",300:"#f472b6",400:"#ec4899",500:"#db2777",600:"#be185d",700:"#9d174d",800:"#831843",900:"#500724"},cyan:{25:"#ecfeff",50:"#cffafe",100:"#a5f3fc",200:"#67e8f9",300:"#22d3ee",400:"#06b6d4",500:"#0891b2",600:"#0e7490",700:"#155e75",800:"#164e63",900:"#083344"}},alpha:{90:"e5",70:"b3",20:"33"},font:{size:{"2xs":"calc(var(--tsrd-font-size) * 0.625)",xs:"calc(var(--tsrd-font-size) * 0.75)",sm:"calc(var(--tsrd-font-size) * 0.875)",md:"var(--tsrd-font-size)"},lineHeight:{xs:"calc(var(--tsrd-font-size) * 1)",sm:"calc(var(--tsrd-font-size) * 1.25)"},weight:{normal:"400",medium:"500",semibold:"600",bold:"700"},fontFamily:{sans:"ui-sans-serif, Inter, system-ui, sans-serif, sans-serif",mono:"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"}},border:{radius:{xs:"calc(var(--tsrd-font-size) * 0.125)",sm:"calc(var(--tsrd-font-size) * 0.25)",md:"calc(var(--tsrd-font-size) * 0.375)",full:"9999px"}},size:{0:"0px",.5:"calc(var(--tsrd-font-size) * 0.125)",1:"calc(var(--tsrd-font-size) * 0.25)",1.5:"calc(var(--tsrd-font-size) * 0.375)",2:"calc(var(--tsrd-font-size) * 0.5)",2.5:"calc(var(--tsrd-font-size) * 0.625)",3:"calc(var(--tsrd-font-size) * 0.75)",3.5:"calc(var(--tsrd-font-size) * 0.875)",4:"calc(var(--tsrd-font-size) * 1)",5:"calc(var(--tsrd-font-size) * 1.25)",8:"calc(var(--tsrd-font-size) * 2)"}},At=e=>{const{colors:t,font:o,size:r,alpha:p,border:s}=E,{fontFamily:a,lineHeight:c,size:u}=o,n=e?Fe.bind({target:e}):Fe;return{devtoolsPanelContainer:n`
      direction: ltr;
      position: fixed;
      bottom: 0;
      right: 0;
      z-index: 99999;
      width: 100%;
      max-height: 90%;
      border-top: 1px solid ${t.gray[700]};
      transform-origin: top;
    `,devtoolsPanelContainerVisibility:i=>n`
        visibility: ${i?"visible":"hidden"};
      `,devtoolsPanelContainerResizing:i=>i()?n`
          transition: none;
        `:n`
        transition: all 0.4s ease;
      `,devtoolsPanelContainerAnimation:(i,$)=>i?n`
          pointer-events: auto;
          transform: translateY(0);
        `:n`
        pointer-events: none;
        transform: translateY(${$}px);
      `,logo:n`
      cursor: pointer;
      display: flex;
      flex-direction: column;
      background-color: transparent;
      border: none;
      font-family: ${a.sans};
      gap: ${E.size[.5]};
      padding: 0px;
      &:hover {
        opacity: 0.7;
      }
      &:focus-visible {
        outline-offset: 4px;
        border-radius: ${s.radius.xs};
        outline: 2px solid ${t.blue[800]};
      }
    `,tanstackLogo:n`
      font-size: ${o.size.md};
      font-weight: ${o.weight.bold};
      line-height: ${o.lineHeight.xs};
      white-space: nowrap;
      color: ${t.gray[300]};
    `,routerLogo:n`
      font-weight: ${o.weight.semibold};
      font-size: ${o.size.xs};
      background: linear-gradient(to right, #84cc16, #10b981);
      background-clip: text;
      -webkit-background-clip: text;
      line-height: 1;
      -webkit-text-fill-color: transparent;
      white-space: nowrap;
    `,devtoolsPanel:n`
      display: flex;
      font-size: ${u.sm};
      font-family: ${a.sans};
      background-color: ${t.darkGray[700]};
      color: ${t.gray[300]};

      @media (max-width: 700px) {
        flex-direction: column;
      }
      @media (max-width: 600px) {
        font-size: ${u.xs};
      }
    `,dragHandle:n`
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 4px;
      cursor: row-resize;
      z-index: 100000;
      &:hover {
        background-color: ${t.purple[400]}${p[90]};
      }
    `,firstContainer:n`
      flex: 1 1 500px;
      min-height: 40%;
      max-height: 100%;
      overflow: auto;
      border-right: 1px solid ${t.gray[700]};
      display: flex;
      flex-direction: column;
    `,routerExplorerContainer:n`
      overflow-y: auto;
      flex: 1;
    `,routerExplorer:n`
      padding: ${E.size[2]};
    `,row:n`
      display: flex;
      align-items: center;
      padding: ${E.size[2]} ${E.size[2.5]};
      gap: ${E.size[2.5]};
      border-bottom: ${t.darkGray[500]} 1px solid;
      align-items: center;
    `,detailsHeader:n`
      font-family: ui-sans-serif, Inter, system-ui, sans-serif, sans-serif;
      position: sticky;
      top: 0;
      z-index: 2;
      background-color: ${t.darkGray[600]};
      padding: 0px ${E.size[2]};
      font-weight: ${o.weight.medium};
      font-size: ${o.size.xs};
      min-height: ${E.size[8]};
      line-height: ${o.lineHeight.xs};
      text-align: left;
      display: flex;
      align-items: center;
    `,maskedBadge:n`
      background: ${t.yellow[900]}${p[70]};
      color: ${t.yellow[300]};
      display: inline-block;
      padding: ${E.size[0]} ${E.size[2.5]};
      border-radius: ${s.radius.full};
      font-size: ${o.size.xs};
      font-weight: ${o.weight.normal};
      border: 1px solid ${t.yellow[300]};
    `,maskedLocation:n`
      color: ${t.yellow[300]};
    `,detailsContent:n`
      padding: ${E.size[1.5]} ${E.size[2]};
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: ${o.size.xs};
    `,routeMatchesToggle:n`
      display: flex;
      align-items: center;
      border: 1px solid ${t.gray[500]};
      border-radius: ${s.radius.sm};
      overflow: hidden;
    `,routeMatchesToggleBtn:(i,$)=>{const y=[n`
        appearance: none;
        border: none;
        font-size: 12px;
        padding: 4px 8px;
        background: transparent;
        cursor: pointer;
        font-family: ${a.sans};
        font-weight: ${o.weight.medium};
      `];if(i){const T=n`
          background: ${t.darkGray[400]};
          color: ${t.gray[300]};
        `;y.push(T)}else{const T=n`
          color: ${t.gray[500]};
          background: ${t.darkGray[800]}${p[20]};
        `;y.push(T)}return $&&y.push(n`
          border-right: 1px solid ${E.colors.gray[500]};
        `),y},detailsHeaderInfo:n`
      flex: 1;
      justify-content: flex-end;
      display: flex;
      align-items: center;
      font-weight: ${o.weight.normal};
      color: ${t.gray[400]};
    `,matchRow:i=>{const x=[n`
        display: flex;
        border-bottom: 1px solid ${t.darkGray[400]};
        cursor: pointer;
        align-items: center;
        padding: ${r[1]} ${r[2]};
        gap: ${r[2]};
        font-size: ${u.xs};
        color: ${t.gray[300]};
      `];if(i){const y=n`
          background: ${t.darkGray[500]};
        `;x.push(y)}return x},matchIndicator:i=>{const x=[n`
        flex: 0 0 auto;
        width: ${r[3]};
        height: ${r[3]};
        background: ${t[i][900]};
        border: 1px solid ${t[i][500]};
        border-radius: ${s.radius.full};
        transition: all 0.25s ease-out;
        box-sizing: border-box;
      `];if(i==="gray"){const y=n`
          background: ${t.gray[700]};
          border-color: ${t.gray[400]};
        `;x.push(y)}return x},matchID:n`
      flex: 1;
      line-height: ${c.xs};
    `,ageTicker:i=>{const x=[n`
        display: flex;
        gap: ${r[1]};
        font-size: ${u.xs};
        color: ${t.gray[400]};
        font-variant-numeric: tabular-nums;
        line-height: ${c.xs};
      `];if(i){const y=n`
          color: ${t.yellow[400]};
        `;x.push(y)}return x},secondContainer:n`
      flex: 1 1 500px;
      min-height: 40%;
      max-height: 100%;
      overflow: auto;
      border-right: 1px solid ${t.gray[700]};
      display: flex;
      flex-direction: column;
    `,thirdContainer:n`
      flex: 1 1 500px;
      overflow: auto;
      display: flex;
      flex-direction: column;
      height: 100%;
      border-right: 1px solid ${t.gray[700]};

      @media (max-width: 700px) {
        border-top: 2px solid ${t.gray[700]};
      }
    `,fourthContainer:n`
      flex: 1 1 500px;
      min-height: 40%;
      max-height: 100%;
      overflow: auto;
      display: flex;
      flex-direction: column;
    `,routesContainer:n`
      overflow-x: auto;
      overflow-y: visible;
    `,routesRowContainer:(i,$)=>{const y=[n`
        display: flex;
        border-bottom: 1px solid ${t.darkGray[400]};
        align-items: center;
        padding: ${r[1]} ${r[2]};
        gap: ${r[2]};
        font-size: ${u.xs};
        color: ${t.gray[300]};
        cursor: ${$?"pointer":"default"};
        line-height: ${c.xs};
      `];if(i){const T=n`
          background: ${t.darkGray[500]};
        `;y.push(T)}return y},routesRow:i=>{const x=[n`
        flex: 1 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: ${u.xs};
        line-height: ${c.xs};
      `];if(!i){const y=n`
          color: ${t.gray[400]};
        `;x.push(y)}return x},routeParamInfo:n`
      color: ${t.gray[400]};
      font-size: ${u.xs};
      line-height: ${c.xs};
    `,nestedRouteRow:i=>n`
        margin-left: ${i?0:r[3.5]};
        border-left: ${i?"":`solid 1px ${t.gray[700]}`};
      `,code:n`
      font-size: ${u.xs};
      line-height: ${c.xs};
    `,matchesContainer:n`
      flex: 1 1 auto;
      overflow-y: auto;
    `,cachedMatchesContainer:n`
      flex: 1 1 auto;
      overflow-y: auto;
      max-height: 50%;
    `,maskedBadgeContainer:n`
      flex: 1;
      justify-content: flex-end;
      display: flex;
    `,matchDetails:n`
      display: flex;
      flex-direction: column;
      padding: ${E.size[2]};
      font-size: ${E.font.size.xs};
      color: ${E.colors.gray[300]};
      line-height: ${E.font.lineHeight.sm};
    `,matchStatus:(i,$)=>{const y=$&&i==="success"?$==="beforeLoad"?"purple":"blue":{pending:"yellow",success:"green",error:"red",notFound:"purple",redirected:"gray"}[i];return n`
        display: flex;
        justify-content: center;
        align-items: center;
        height: 40px;
        border-radius: ${E.border.radius.sm};
        font-weight: ${E.font.weight.normal};
        background-color: ${E.colors[y][900]}${E.alpha[90]};
        color: ${E.colors[y][300]};
        border: 1px solid ${E.colors[y][600]};
        margin-bottom: ${E.size[2]};
        transition: all 0.25s ease-out;
      `},matchDetailsInfo:n`
      display: flex;
      justify-content: flex-end;
      flex: 1;
    `,matchDetailsInfoLabel:n`
      display: flex;
    `,mainCloseBtn:n`
      background: ${t.darkGray[700]};
      padding: ${r[1]} ${r[2]} ${r[1]} ${r[1.5]};
      border-radius: ${s.radius.md};
      position: fixed;
      z-index: 99999;
      display: inline-flex;
      width: fit-content;
      cursor: pointer;
      appearance: none;
      border: 0;
      gap: 8px;
      align-items: center;
      border: 1px solid ${t.gray[500]};
      font-size: ${o.size.xs};
      cursor: pointer;
      transition: all 0.25s ease-out;

      &:hover {
        background: ${t.darkGray[500]};
      }
    `,mainCloseBtnPosition:i=>n`
        ${i==="top-left"?`top: ${r[2]}; left: ${r[2]};`:""}
        ${i==="top-right"?`top: ${r[2]}; right: ${r[2]};`:""}
        ${i==="bottom-left"?`bottom: ${r[2]}; left: ${r[2]};`:""}
        ${i==="bottom-right"?`bottom: ${r[2]}; right: ${r[2]};`:""}
      `,mainCloseBtnAnimation:i=>i?n`
        opacity: 0;
        pointer-events: none;
        visibility: hidden;
      `:n`
          opacity: 1;
          pointer-events: auto;
          visibility: visible;
        `,routerLogoCloseButton:n`
      font-weight: ${o.weight.semibold};
      font-size: ${o.size.xs};
      background: linear-gradient(to right, #98f30c, #00f4a3);
      background-clip: text;
      -webkit-background-clip: text;
      line-height: 1;
      -webkit-text-fill-color: transparent;
      white-space: nowrap;
    `,mainCloseBtnDivider:n`
      width: 1px;
      background: ${E.colors.gray[600]};
      height: 100%;
      border-radius: 999999px;
      color: transparent;
    `,mainCloseBtnIconContainer:n`
      position: relative;
      width: ${r[5]};
      height: ${r[5]};
      background: pink;
      border-radius: 999999px;
      overflow: hidden;
    `,mainCloseBtnIconOuter:n`
      width: ${r[5]};
      height: ${r[5]};
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      filter: blur(3px) saturate(1.8) contrast(2);
    `,mainCloseBtnIconInner:n`
      width: ${r[4]};
      height: ${r[4]};
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    `,panelCloseBtn:n`
      position: absolute;
      cursor: pointer;
      z-index: 100001;
      display: flex;
      align-items: center;
      justify-content: center;
      outline: none;
      background-color: ${t.darkGray[700]};
      &:hover {
        background-color: ${t.darkGray[500]};
      }

      top: 0;
      right: ${r[2]};
      transform: translate(0, -100%);
      border-right: ${t.darkGray[300]} 1px solid;
      border-left: ${t.darkGray[300]} 1px solid;
      border-top: ${t.darkGray[300]} 1px solid;
      border-bottom: none;
      border-radius: ${s.radius.sm} ${s.radius.sm} 0px 0px;
      padding: ${r[1]} ${r[1.5]} ${r[.5]} ${r[1.5]};

      &::after {
        content: ' ';
        position: absolute;
        top: 100%;
        left: -${r[2.5]};
        height: ${r[1.5]};
        width: calc(100% + ${r[5]});
      }
    `,panelCloseBtnIcon:n`
      color: ${t.gray[400]};
      width: ${r[2]};
      height: ${r[2]};
    `}};function Ge(){const e=Je(ht),[t]=ge(At(e));return t}const Rt=e=>{try{const t=localStorage.getItem(e);return typeof t=="string"?JSON.parse(t):void 0}catch{return}};function je(e,t){const[o,r]=ge();return Oe(()=>{const s=Rt(e);r(typeof s>"u"||s===null?typeof t=="function"?t():t:s)}),[o,s=>{r(a=>{let c=s;typeof s=="function"&&(c=s(a));try{localStorage.setItem(e,JSON.stringify(c))}catch{}return c})}]}var Lt=L('<span><svg xmlns=http://www.w3.org/2000/svg width=12 height=12 fill=none viewBox="0 0 24 24"><path stroke=currentColor stroke-linecap=round stroke-linejoin=round stroke-width=2 d="M9 18l6-6-6-6">'),Le=L("<div>"),Pt=L("<button><span> "),jt=L("<div><div><button> [<!> ... <!>]"),Ht=L("<button><span></span> 🔄 "),Nt=L("<span>:"),Vt=L("<span>");const ft=({expanded:e,style:t={}})=>{const o=mt();return(()=>{var r=Lt(),p=r.firstChild;return D(s=>{var a=o().expander,c=Z(o().expanderIcon(e));return a!==s.e&&d(r,s.e=a),c!==s.t&&l(p,"class",s.t=c),s},{e:void 0,t:void 0}),r})()};function Yt(e,t){if(t<1)return[];let o=0;const r=[];for(;o<e.length;)r.push(e.slice(o,o+t)),o=o+t;return r}function Jt(e){return Symbol.iterator in e}function we({value:e,defaultExpanded:t,pageSize:o=100,filterSubEntries:r,...p}){const[s,a]=ge(!!t),c=()=>a(h=>!h),u=S(()=>typeof e()),n=S(()=>{let h=[];const R=m=>{const g=t===!0?{[m.label]:!0}:t==null?void 0:t[m.label];return{...m,value:()=>m.value,defaultExpanded:g}};return Array.isArray(e())?h=e().map((m,g)=>R({label:g.toString(),value:m})):e()!==null&&typeof e()=="object"&&Jt(e())&&typeof e()[Symbol.iterator]=="function"?h=Array.from(e(),(m,g)=>R({label:g.toString(),value:m})):typeof e()=="object"&&e()!==null&&(h=Object.entries(e()).map(([m,g])=>R({label:m,value:g}))),r?r(h):h}),i=S(()=>Yt(n(),o)),[$,x]=ge([]),[y,T]=ge(void 0),A=mt(),te=()=>{T(e()())},ie=h=>V(we,Ie({value:e,filterSubEntries:r},p,h));return(()=>{var h=Le();return v(h,(()=>{var R=S(()=>!!i().length);return()=>R()?[(()=>{var m=Pt(),g=m.firstChild,z=g.firstChild;return m.$$click=()=>c(),v(m,V(ft,{get expanded(){return s()??!1}}),g),v(m,()=>p.label,g),v(g,()=>String(u).toLowerCase()==="iterable"?"(Iterable) ":"",z),v(g,()=>n().length,z),v(g,()=>n().length>1?"items":"item",null),D(q=>{var Q=A().expandButton,w=A().info;return Q!==q.e&&d(m,q.e=Q),w!==q.t&&d(g,q.t=w),q},{e:void 0,t:void 0}),m})(),S(()=>S(()=>!!(s()??!1))()?S(()=>i().length===1)()?(()=>{var m=Le();return v(m,()=>n().map((g,z)=>ie(g))),D(()=>d(m,A().subEntries)),m})():(()=>{var m=Le();return v(m,()=>i().map((g,z)=>(()=>{var q=jt(),Q=q.firstChild,w=Q.firstChild,K=w.firstChild,ve=K.nextSibling,ue=ve.nextSibling,ce=ue.nextSibling;return ce.nextSibling,w.$$click=()=>x(H=>H.includes(z)?H.filter(X=>X!==z):[...H,z]),v(w,V(ft,{get expanded(){return $().includes(z)}}),K),v(w,z*o,ve),v(w,z*o+o-1,ce),v(Q,(()=>{var H=S(()=>!!$().includes(z));return()=>H()?(()=>{var X=Le();return v(X,()=>g.map(le=>ie(le))),D(()=>d(X,A().subEntries)),X})():null})(),null),D(H=>{var X=A().entry,le=Z(A().labelButton,"labelButton");return X!==H.e&&d(Q,H.e=X),le!==H.t&&d(w,H.t=le),H},{e:void 0,t:void 0}),q})())),D(()=>d(m,A().subEntries)),m})():null)]:(()=>{var m=S(()=>u()==="function");return()=>m()?V(we,{get label(){return(()=>{var g=Ht(),z=g.firstChild;return g.$$click=te,v(z,()=>p.label),D(()=>d(g,A().refreshValueBtn)),g})()},value:y,defaultExpanded:{}}):[(()=>{var g=Nt(),z=g.firstChild;return v(g,()=>p.label,z),g})()," ",(()=>{var g=Vt();return v(g,()=>Mt(e())),D(()=>d(g,A().value)),g})()]})()})()),D(()=>d(h,A().entry)),h})()}const qt=e=>{const{colors:t,font:o,size:r}=E,{fontFamily:p,lineHeight:s,size:a}=o,c=e?Fe.bind({target:e}):Fe;return{entry:c`
      font-family: ${p.mono};
      font-size: ${a.xs};
      line-height: ${s.sm};
      outline: none;
      word-break: break-word;
    `,labelButton:c`
      cursor: pointer;
      color: inherit;
      font: inherit;
      outline: inherit;
      background: transparent;
      border: none;
      padding: 0;
    `,expander:c`
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: ${r[3]};
      height: ${r[3]};
      padding-left: 3px;
      box-sizing: content-box;
    `,expanderIcon:u=>u?c`
          transform: rotate(90deg);
          transition: transform 0.1s ease;
        `:c`
        transform: rotate(0deg);
        transition: transform 0.1s ease;
      `,expandButton:c`
      display: flex;
      gap: ${r[1]};
      align-items: center;
      cursor: pointer;
      color: inherit;
      font: inherit;
      outline: inherit;
      background: transparent;
      border: none;
      padding: 0;
    `,value:c`
      color: ${t.purple[400]};
    `,subEntries:c`
      margin-left: ${r[2]};
      padding-left: ${r[2]};
      border-left: 2px solid ${t.darkGray[400]};
    `,info:c`
      color: ${t.gray[500]};
      font-size: ${a["2xs"]};
      padding-left: ${r[1]};
    `,refreshValueBtn:c`
      appearance: none;
      border: 0;
      cursor: pointer;
      background: transparent;
      color: inherit;
      padding: 0;
      font-family: ${p.mono};
      font-size: ${a.xs};
    `}};function mt(){const e=Je(ht),[t]=ge(qt(e));return t}pt(["click"]);var Kt=L("<div><div></div><div>/</div><div></div><div>/</div><div>");function He(e){const t=["s","min","h","d"],o=[e/1e3,e/6e4,e/36e5,e/864e5];let r=0;for(let s=1;s<o.length&&!(o[s]<1);s++)r=s;return new Intl.NumberFormat(navigator.language,{compactDisplay:"short",notation:"compact",maximumFractionDigits:0}).format(o[r])+t[r]}function Ye({match:e,router:t}){const o=Ge();if(!e)return null;const r=t().looseRoutesById[e.routeId];if(!r.options.loader)return null;const p=Date.now()-e.updatedAt,s=r.options.staleTime??t().options.defaultStaleTime??0,a=r.options.gcTime??t().options.defaultGcTime??30*60*1e3;return(()=>{var c=Kt(),u=c.firstChild,n=u.nextSibling,i=n.nextSibling,$=i.nextSibling,x=$.nextSibling;return v(u,()=>He(p)),v(i,()=>He(s)),v(x,()=>He(a)),D(()=>d(c,Z(o().ageTicker(p>s)))),c})()}var Wt=L("<button><div>TANSTACK</div><div>TanStack Router v1"),Zt=L("<div><div role=button><div></div><div><div><code> </code><code>"),Pe=L("<div>"),Qt=L('<div><button><svg xmlns=http://www.w3.org/2000/svg width=10 height=6 fill=none viewBox="0 0 10 6"><path stroke=currentColor stroke-linecap=round stroke-linejoin=round stroke-width=1.667 d="M1 1l4 4 4-4"></path></svg></button><div><div></div><div><div></div></div></div><div><div><div><span>Pathname</span></div><div><code></code></div><div><div><button type=button>Routes</button><button type=button>Matches</button></div><div><div>age / staleTime / gcTime</div></div></div><div>'),Xt=L("<div><span>masked"),ei=L("<code>"),ut=L("<div role=button><div></div><code>"),ti=L("<div><div><div>Cached Matches</div><div>age / staleTime / gcTime</div></div><div>"),ii=L("<div><div>Match Details</div><div><div><div><div></div></div><div><div>ID:</div><div><code></code></div></div><div><div>State:</div><div></div></div><div><div>Last Updated:</div><div></div></div></div></div><div>Explorer</div><div>"),ri=L("<div>Loader Data"),ni=L("<div><div>Search Params</div><div>");function oi(e){const{className:t,...o}=e,r=Ge();return(()=>{var p=Wt(),s=p.firstChild,a=s.nextSibling;return qe(p,Ie(o,{get class(){return Z(r().logo,t?t():"")}}),!1,!0),D(c=>{var u=r().tanstackLogo,n=r().routerLogo;return u!==c.e&&d(s,c.e=u),n!==c.t&&d(a,c.t=n),c},{e:void 0,t:void 0}),p})()}function bt({routerState:e,router:t,route:o,isRoot:r,activeId:p,setActiveId:s}){const a=Ge(),c=S(()=>e().pendingMatches||e().matches),u=S(()=>e().matches.find(i=>i.routeId===o.id)),n=S(()=>{var i,$;try{if((i=u())!=null&&i.params){const x=($=u())==null?void 0:$.params,y=o.path||dt(o.id);if(y.startsWith("$")){const T=y.slice(1);if(x[T])return`(${x[T]})`}}return""}catch{return""}});return(()=>{var i=Zt(),$=i.firstChild,x=$.firstChild,y=x.nextSibling,T=y.firstChild,A=T.firstChild,te=A.firstChild,ie=A.nextSibling;return $.$$click=()=>{u()&&s(p()===o.id?"":o.id)},v(A,()=>r?Ne:o.path||dt(o.id),te),v(ie,n),v(y,V(Ye,{get match(){return u()},router:t}),null),v(i,(()=>{var h=S(()=>{var R;return!!((R=o.children)!=null&&R.length)});return()=>h()?(()=>{var R=Pe();return v(R,()=>[...o.children].sort((m,g)=>m.rank-g.rank).map(m=>V(bt,{routerState:e,router:t,route:m,activeId:p,setActiveId:s}))),D(()=>d(R,a().nestedRouteRow(!!r))),R})():null})(),null),D(h=>{var R=`Open match details for ${o.id}`,m=Z(a().routesRowContainer(o.id===p(),!!u())),g=Z(a().matchIndicator(zt(c(),o))),z=Z(a().routesRow(!!u())),q=a().code,Q=a().routeParamInfo;return R!==h.e&&l($,"aria-label",h.e=R),m!==h.t&&d($,h.t=m),g!==h.a&&d(x,h.a=g),z!==h.o&&d(y,h.o=z),q!==h.i&&d(A,h.i=q),Q!==h.n&&d(ie,h.n=Q),h},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0}),i})()}const li=function({...t}){const{isOpen:o=!0,setIsOpen:r,handleDragStart:p,router:s,routerState:a,shadowDOMTarget:c,...u}=t,{onCloseClick:n}=wt(),i=Ge(),{className:$,style:x,...y}=u;kt(s);const[T,A]=je("tanstackRouterDevtoolsShowMatches",!0),[te,ie]=je("tanstackRouterDevtoolsActiveRouteId",""),h=S(()=>[...a().pendingMatches??[],...a().matches,...a().cachedMatches].find(K=>K.routeId===te()||K.id===te())),R=S(()=>Object.keys(a().location.search).length),m=S(()=>({...s(),state:a()})),g=S(()=>Object.fromEntries(Et(Object.keys(m()),["state","routesById","routesByPath","flatRoutes","options","manifest"].map(w=>K=>K!==w)).map(w=>[w,m()[w]]).filter(w=>typeof w[1]!="function"&&!["__store","basepath","injectedHtml","subscribers","latestLoadPromise","navigateTimeout","resetNextScroll","tempLocationKey","latestLocation","routeTree","history"].includes(w[0])))),z=S(()=>{var w;return(w=h())==null?void 0:w.loaderData}),q=S(()=>h()),Q=S(()=>a().location.search);return(()=>{var w=Qt(),K=w.firstChild,ve=K.firstChild,ue=K.nextSibling,ce=ue.firstChild,H=ce.nextSibling,X=H.firstChild,le=ue.nextSibling,Ce=le.firstChild,pe=Ce.firstChild;pe.firstChild;var M=pe.nextSibling,Y=M.firstChild,W=M.nextSibling,N=W.firstChild,J=N.firstChild,re=J.nextSibling,B=N.nextSibling,ne=W.nextSibling;return qe(w,Ie({get class(){return Z(i().devtoolsPanel,"TanStackRouterDevtoolsPanel",$?$():"")},get style(){return x?x():""}},y),!1,!0),v(w,p?(()=>{var f=Pe();return Ct(f,"mousedown",p,!0),D(()=>d(f,i().dragHandle)),f})():null,K),K.$$click=f=>{r&&r(!1),n(f)},v(ce,V(oi,{"aria-hidden":!0,onClick:f=>{r&&r(!1),n(f)}})),v(X,V(we,{label:"Router",value:g,defaultExpanded:{state:{},context:{},options:{}},filterSubEntries:f=>f.filter(k=>typeof k.value()!="function")})),v(pe,(()=>{var f=S(()=>!!a().location.maskedLocation);return()=>f()?(()=>{var k=Xt(),U=k.firstChild;return D(I=>{var C=i().maskedBadgeContainer,P=i().maskedBadge;return C!==I.e&&d(k,I.e=C),P!==I.t&&d(U,I.t=P),I},{e:void 0,t:void 0}),k})():null})(),null),v(Y,()=>a().location.pathname),v(M,(()=>{var f=S(()=>!!a().location.maskedLocation);return()=>f()?(()=>{var k=ei();return v(k,()=>{var U;return(U=a().location.maskedLocation)==null?void 0:U.pathname}),D(()=>d(k,i().maskedLocation)),k})():null})(),null),J.$$click=()=>{A(!1)},re.$$click=()=>{A(!0)},v(ne,(()=>{var f=S(()=>!T());return()=>f()?V(bt,{routerState:a,router:s,get route(){return s().routeTree},isRoot:!0,activeId:te,setActiveId:ie}):(()=>{var k=Pe();return v(k,()=>{var U,I;return(I=(U=a().pendingMatches)!=null&&U.length?a().pendingMatches:a().matches)==null?void 0:I.map((C,P)=>(()=>{var _=ut(),O=_.firstChild,ee=O.nextSibling;return _.$$click=()=>ie(te()===C.id?"":C.id),v(ee,()=>`${C.routeId===Ne?Ne:C.pathname}`),v(_,V(Ye,{match:C,router:s}),null),D(G=>{var j=`Open match details for ${C.id}`,oe=Z(i().matchRow(C===h())),de=Z(i().matchIndicator(Ve(C))),se=i().matchID;return j!==G.e&&l(_,"aria-label",G.e=j),oe!==G.t&&d(_,G.t=oe),de!==G.a&&d(O,G.a=de),se!==G.o&&d(ee,G.o=se),G},{e:void 0,t:void 0,a:void 0,o:void 0}),_})())}),k})()})()),v(le,(()=>{var f=S(()=>!!a().cachedMatches.length);return()=>f()?(()=>{var k=ti(),U=k.firstChild,I=U.firstChild,C=I.nextSibling,P=U.nextSibling;return v(P,()=>a().cachedMatches.map(_=>(()=>{var O=ut(),ee=O.firstChild,G=ee.nextSibling;return O.$$click=()=>ie(te()===_.id?"":_.id),v(G,()=>`${_.id}`),v(O,V(Ye,{match:_,router:s}),null),D(j=>{var oe=`Open match details for ${_.id}`,de=Z(i().matchRow(_===h())),se=Z(i().matchIndicator(Ve(_))),fe=i().matchID;return oe!==j.e&&l(O,"aria-label",j.e=oe),de!==j.t&&d(O,j.t=de),se!==j.a&&d(ee,j.a=se),fe!==j.o&&d(G,j.o=fe),j},{e:void 0,t:void 0,a:void 0,o:void 0}),O})())),D(_=>{var O=i().cachedMatchesContainer,ee=i().detailsHeader,G=i().detailsHeaderInfo;return O!==_.e&&d(k,_.e=O),ee!==_.t&&d(U,_.t=ee),G!==_.a&&d(C,_.a=G),_},{e:void 0,t:void 0,a:void 0}),k})():null})(),null),v(w,(()=>{var f=S(()=>{var k;return!!(h()&&((k=h())!=null&&k.status))});return()=>f()?(()=>{var k=ii(),U=k.firstChild,I=U.nextSibling,C=I.firstChild,P=C.firstChild,_=P.firstChild,O=P.nextSibling,ee=O.firstChild,G=ee.nextSibling,j=G.firstChild,oe=O.nextSibling,de=oe.firstChild,se=de.nextSibling,fe=oe.nextSibling,me=fe.firstChild,xe=me.nextSibling,he=I.nextSibling,be=he.nextSibling;return v(_,(()=>{var b=S(()=>{var F,ae;return!!(((F=h())==null?void 0:F.status)==="success"&&((ae=h())!=null&&ae.isFetching))});return()=>{var F;return b()?"fetching":(F=h())==null?void 0:F.status}})()),v(j,()=>{var b;return(b=h())==null?void 0:b.id}),v(se,(()=>{var b=S(()=>{var F;return!!((F=a().pendingMatches)!=null&&F.find(ae=>{var ye;return ae.id===((ye=h())==null?void 0:ye.id)}))});return()=>b()?"Pending":a().matches.find(F=>{var ae;return F.id===((ae=h())==null?void 0:ae.id)})?"Active":"Cached"})()),v(xe,(()=>{var b=S(()=>{var F;return!!((F=h())!=null&&F.updatedAt)});return()=>{var F;return b()?new Date((F=h())==null?void 0:F.updatedAt).toLocaleTimeString():"N/A"}})()),v(k,(()=>{var b=S(()=>!!z());return()=>b()?[(()=>{var F=ri();return D(()=>d(F,i().detailsHeader)),F})(),(()=>{var F=Pe();return v(F,V(we,{label:"loaderData",value:z,defaultExpanded:{}})),D(()=>d(F,i().detailsContent)),F})()]:null})(),he),v(be,V(we,{label:"Match",value:q,defaultExpanded:{}})),D(b=>{var F,ae,ye=i().thirdContainer,ze=i().detailsHeader,Se=i().matchDetails,Ue=i().matchStatus((F=h())==null?void 0:F.status,(ae=h())==null?void 0:ae.isFetching),Te=i().matchDetailsInfoLabel,_e=i().matchDetailsInfo,Ae=i().matchDetailsInfoLabel,Me=i().matchDetailsInfo,Re=i().matchDetailsInfoLabel,Ee=i().matchDetailsInfo,De=i().detailsHeader,Be=i().detailsContent;return ye!==b.e&&d(k,b.e=ye),ze!==b.t&&d(U,b.t=ze),Se!==b.a&&d(C,b.a=Se),Ue!==b.o&&d(P,b.o=Ue),Te!==b.i&&d(O,b.i=Te),_e!==b.n&&d(G,b.n=_e),Ae!==b.s&&d(oe,b.s=Ae),Me!==b.h&&d(se,b.h=Me),Re!==b.r&&d(fe,b.r=Re),Ee!==b.d&&d(xe,b.d=Ee),De!==b.l&&d(he,b.l=De),Be!==b.u&&d(be,b.u=Be),b},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0,s:void 0,h:void 0,r:void 0,d:void 0,l:void 0,u:void 0}),k})():null})(),null),v(w,(()=>{var f=S(()=>!!R());return()=>f()?(()=>{var k=ni(),U=k.firstChild,I=U.nextSibling;return v(I,V(we,{value:Q,get defaultExpanded(){return Object.keys(a().location.search).reduce((C,P)=>(C[P]={},C),{})}})),D(C=>{var P=i().fourthContainer,_=i().detailsHeader,O=i().detailsContent;return P!==C.e&&d(k,C.e=P),_!==C.t&&d(U,C.t=_),O!==C.a&&d(I,C.a=O),C},{e:void 0,t:void 0,a:void 0}),k})():null})(),null),D(f=>{var k=i().panelCloseBtn,U=i().panelCloseBtnIcon,I=i().firstContainer,C=i().row,P=i().routerExplorerContainer,_=i().routerExplorer,O=i().secondContainer,ee=i().matchesContainer,G=i().detailsHeader,j=i().detailsContent,oe=i().detailsHeader,de=i().routeMatchesToggle,se=!T(),fe=Z(i().routeMatchesToggleBtn(!T(),!0)),me=T(),xe=Z(i().routeMatchesToggleBtn(!!T(),!1)),he=i().detailsHeaderInfo,be=Z(i().routesContainer);return k!==f.e&&d(K,f.e=k),U!==f.t&&l(ve,"class",f.t=U),I!==f.a&&d(ue,f.a=I),C!==f.o&&d(ce,f.o=C),P!==f.i&&d(H,f.i=P),_!==f.n&&d(X,f.n=_),O!==f.s&&d(le,f.s=O),ee!==f.h&&d(Ce,f.h=ee),G!==f.r&&d(pe,f.r=G),j!==f.d&&d(M,f.d=j),oe!==f.l&&d(W,f.l=oe),de!==f.u&&d(N,f.u=de),se!==f.c&&(J.disabled=f.c=se),fe!==f.w&&d(J,f.w=fe),me!==f.m&&(re.disabled=f.m=me),xe!==f.f&&d(re,f.f=xe),he!==f.y&&d(B,f.y=he),be!==f.g&&d(ne,f.g=be),f},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0,s:void 0,h:void 0,r:void 0,d:void 0,l:void 0,u:void 0,c:void 0,w:void 0,m:void 0,f:void 0,y:void 0,g:void 0}),w})()};pt(["click","mousedown"]);var si=L('<svg xmlns=http://www.w3.org/2000/svg enable-background="new 0 0 634 633"viewBox="0 0 634 633"><g transform=translate(1)><linearGradient x1=-641.486 x2=-641.486 y1=856.648 y2=855.931 gradientTransform="matrix(633 0 0 -633 406377 542258)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#6bdaff></stop><stop offset=0.319 stop-color=#f9ffb5></stop><stop offset=0.706 stop-color=#ffa770></stop><stop offset=1 stop-color=#ff7373></stop></linearGradient><circle cx=316.5 cy=316.5 r=316.5 fill-rule=evenodd clip-rule=evenodd></circle><defs><filter width=454 height=396.9 x=-137.5 y=412 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"></feColorMatrix></filter></defs><mask width=454 height=396.9 x=-137.5 y=412 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#FFF fill-rule=evenodd clip-rule=evenodd></circle></g></mask><ellipse cx=89.5 cy=610.5 fill=#015064 fill-rule=evenodd stroke=#00CFE2 stroke-width=25 clip-rule=evenodd rx=214.5 ry=186></ellipse><defs><filter width=454 height=396.9 x=316.5 y=412 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"></feColorMatrix></filter></defs><mask width=454 height=396.9 x=316.5 y=412 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#FFF fill-rule=evenodd clip-rule=evenodd></circle></g></mask><ellipse cx=543.5 cy=610.5 fill=#015064 fill-rule=evenodd stroke=#00CFE2 stroke-width=25 clip-rule=evenodd rx=214.5 ry=186></ellipse><defs><filter width=454 height=396.9 x=-137.5 y=450 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"></feColorMatrix></filter></defs><mask width=454 height=396.9 x=-137.5 y=450 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#FFF fill-rule=evenodd clip-rule=evenodd></circle></g></mask><ellipse cx=89.5 cy=648.5 fill=#015064 fill-rule=evenodd stroke=#00A8B8 stroke-width=25 clip-rule=evenodd rx=214.5 ry=186></ellipse><defs><filter width=454 height=396.9 x=316.5 y=450 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"></feColorMatrix></filter></defs><mask width=454 height=396.9 x=316.5 y=450 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#FFF fill-rule=evenodd clip-rule=evenodd></circle></g></mask><ellipse cx=543.5 cy=648.5 fill=#015064 fill-rule=evenodd stroke=#00A8B8 stroke-width=25 clip-rule=evenodd rx=214.5 ry=186></ellipse><defs><filter width=454 height=396.9 x=-137.5 y=486 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"></feColorMatrix></filter></defs><mask width=454 height=396.9 x=-137.5 y=486 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#FFF fill-rule=evenodd clip-rule=evenodd></circle></g></mask><ellipse cx=89.5 cy=684.5 fill=#015064 fill-rule=evenodd stroke=#007782 stroke-width=25 clip-rule=evenodd rx=214.5 ry=186></ellipse><defs><filter width=454 height=396.9 x=316.5 y=486 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"></feColorMatrix></filter></defs><mask width=454 height=396.9 x=316.5 y=486 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#FFF fill-rule=evenodd clip-rule=evenodd></circle></g></mask><ellipse cx=543.5 cy=684.5 fill=#015064 fill-rule=evenodd stroke=#007782 stroke-width=25 clip-rule=evenodd rx=214.5 ry=186></ellipse><defs><filter width=176.9 height=129.3 x=272.2 y=308 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"></feColorMatrix></filter></defs><mask width=176.9 height=129.3 x=272.2 y=308 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#FFF fill-rule=evenodd clip-rule=evenodd></circle></g></mask><g><path fill=none stroke=#000 stroke-linecap=round stroke-linejoin=bevel stroke-width=11 d="M436 403.2l-5 28.6m-140-90.3l-10.9 62m52.8-19.4l-4.3 27.1"></path><linearGradient x1=-645.656 x2=-646.499 y1=854.878 y2=854.788 gradientTransform="matrix(-184.159 -32.4722 11.4608 -64.9973 -128419.844 34938.836)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#ee2700></stop><stop offset=1 stop-color=#ff008e></stop></linearGradient><path fill-rule=evenodd d="M344.1 363l97.7 17.2c5.8 2.1 8.2 6.2 7.1 12.1-1 5.9-4.7 9.2-11 9.9l-106-18.7-57.5-59.2c-3.2-4.8-2.9-9.1.8-12.8 3.7-3.7 8.3-4.4 13.7-2.1l55.2 53.6z"clip-rule=evenodd></path><path fill=#D8D8D8 fill-rule=evenodd stroke=#FFF stroke-linecap=round stroke-linejoin=bevel stroke-width=7 d="M428.3 384.5l.9-6.5m-33.9 1.5l.9-6.5m-34 .5l.9-6.1m-38.9-16.1l4.2-3.9m-25.2-16.1l4.2-3.9"clip-rule=evenodd></path></g><defs><filter width=280.6 height=317.4 x=73.2 y=113.9 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"></feColorMatrix></filter></defs><mask width=280.6 height=317.4 x=73.2 y=113.9 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#FFF fill-rule=evenodd clip-rule=evenodd></circle></g></mask><g><linearGradient x1=-646.8 x2=-646.8 y1=854.844 y2=853.844 gradientTransform="matrix(-100.1751 48.8587 -97.9753 -200.879 19124.773 203538.61)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#a17500></stop><stop offset=1 stop-color=#5d2100></stop></linearGradient><path fill-rule=evenodd d="M192.3 203c8.1 37.3 14 73.6 17.8 109.1 3.8 35.4 2.8 75.2-2.9 119.2l61.2-16.7c-15.6-59-25.2-97.9-28.6-116.6-3.4-18.7-10.8-51.8-22.2-99.6l-25.3 4.6"clip-rule=evenodd></path><linearGradient x1=-635.467 x2=-635.467 y1=852.115 y2=851.115 gradientTransform="matrix(92.6873 4.8575 2.0257 -38.6535 57323.695 36176.047)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#2f8a00></stop><stop offset=1 stop-color=#90ff57></stop></linearGradient><path fill-rule=evenodd stroke=#2F8A00 stroke-width=13 d="M195 183.9s-12.6-22.1-36.5-29.9c-15.9-5.2-34.4-1.5-55.5 11.1 15.9 14.3 29.5 22.6 40.7 24.9 16.8 3.6 51.3-6.1 51.3-6.1z"clip-rule=evenodd></path><linearGradient x1=-636.573 x2=-636.573 y1=855.444 y2=854.444 gradientTransform="matrix(109.9945 5.7646 6.3597 -121.3507 64719.133 107659.336)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#2f8a00></stop><stop offset=1 stop-color=#90ff57></stop></linearGradient><path fill-rule=evenodd stroke=#2F8A00 stroke-width=13 d="M194.9 184.5s-47.5-8.5-83.2 15.7c-23.8 16.2-34.3 49.3-31.6 99.3 30.3-27.8 52.1-48.5 65.2-61.9 19.8-20 49.6-53.1 49.6-53.1z"clip-rule=evenodd></path><linearGradient x1=-632.145 x2=-632.145 y1=854.174 y2=853.174 gradientTransform="matrix(62.9558 3.2994 3.5021 -66.8246 37035.367 59284.227)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#2f8a00></stop><stop offset=1 stop-color=#90ff57></stop></linearGradient><path fill-rule=evenodd stroke=#2F8A00 stroke-width=13 d="M195 183.9c-.8-21.9 6-38 20.6-48.2 14.6-10.2 29.8-15.3 45.5-15.3-6.1 21.4-14.5 35.8-25.2 43.4-10.7 7.5-24.4 14.2-40.9 20.1z"clip-rule=evenodd></path><linearGradient x1=-638.224 x2=-638.224 y1=853.801 y2=852.801 gradientTransform="matrix(152.4666 7.9904 3.0934 -59.0251 94939.86 55646.855)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#2f8a00></stop><stop offset=1 stop-color=#90ff57></stop></linearGradient><path fill-rule=evenodd stroke=#2F8A00 stroke-width=13 d="M194.9 184.5c31.9-30 64.1-39.7 96.7-29 32.6 10.7 50.8 30.4 54.6 59.1-35.2-5.5-60.4-9.6-75.8-12.1-15.3-2.6-40.5-8.6-75.5-18z"clip-rule=evenodd></path><linearGradient x1=-637.723 x2=-637.723 y1=855.103 y2=854.103 gradientTransform="matrix(136.467 7.1519 5.2165 -99.5377 82830.875 89859.578)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#2f8a00></stop><stop offset=1 stop-color=#90ff57></stop></linearGradient><path fill-rule=evenodd stroke=#2F8A00 stroke-width=13 d="M194.9 184.5c35.8-7.6 65.6-.2 89.2 22 23.6 22.2 37.7 49 42.3 80.3-39.8-9.7-68.3-23.8-85.5-42.4-17.2-18.5-32.5-38.5-46-59.9z"clip-rule=evenodd></path><linearGradient x1=-631.79 x2=-631.79 y1=855.872 y2=854.872 gradientTransform="matrix(60.8683 3.19 8.7771 -167.4773 31110.818 145537.61)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#2f8a00></stop><stop offset=1 stop-color=#90ff57></stop></linearGradient><path fill-rule=evenodd stroke=#2F8A00 stroke-width=13 d="M194.9 184.5c-33.6 13.8-53.6 35.7-60.1 65.6-6.5 29.9-3.6 63.1 8.7 99.6 27.4-40.3 43.2-69.6 47.4-88 4.2-18.3 5.5-44.1 4-77.2z"clip-rule=evenodd></path><path fill=none stroke=#2F8A00 stroke-linecap=round stroke-width=8 d="M196.5 182.3c-14.8 21.6-25.1 41.4-30.8 59.4-5.7 18-9.4 33-11.1 45.1"></path><path fill=none stroke=#2F8A00 stroke-linecap=round stroke-width=8 d="M194.8 185.7c-24.4 1.7-43.8 9-58.1 21.8-14.3 12.8-24.7 25.4-31.3 37.8m99.1-68.9c29.7-6.7 52-8.4 67-5 15 3.4 26.9 8.7 35.8 15.9m-110.8-5.9c20.3 9.9 38.2 20.5 53.9 31.9 15.7 11.4 27.4 22.1 35.1 32"></path></g><defs><filter width=532 height=633 x=50.5 y=399 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"></feColorMatrix></filter></defs><mask width=532 height=633 x=50.5 y=399 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#FFF fill-rule=evenodd clip-rule=evenodd></circle></g></mask><linearGradient x1=-641.104 x2=-641.278 y1=856.577 y2=856.183 gradientTransform="matrix(532 0 0 -633 341484.5 542657)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#fff400></stop><stop offset=1 stop-color=#3c8700></stop></linearGradient><ellipse cx=316.5 cy=715.5 fill-rule=evenodd clip-rule=evenodd rx=266 ry=316.5></ellipse><defs><filter width=288 height=283 x=391 y=-24 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"></feColorMatrix></filter></defs><mask width=288 height=283 x=391 y=-24 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#FFF fill-rule=evenodd clip-rule=evenodd></circle></g></mask><g><g transform="translate(397 -24)"><linearGradient x1=-1036.672 x2=-1036.672 y1=880.018 y2=879.018 gradientTransform="matrix(227 0 0 -227 235493 199764)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#ffdf00></stop><stop offset=1 stop-color=#ff9d00></stop></linearGradient><circle cx=168.5 cy=113.5 r=113.5 fill-rule=evenodd clip-rule=evenodd></circle><linearGradient x1=-1017.329 x2=-1018.602 y1=658.003 y2=657.998 gradientTransform="matrix(30 0 0 -1 30558 771)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#ffa400></stop><stop offset=1 stop-color=#ff5e00></stop></linearGradient><path fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12 d="M30 113H0"></path><linearGradient x1=-1014.501 x2=-1015.774 y1=839.985 y2=839.935 gradientTransform="matrix(26.5 0 0 -5.5 26925 4696.5)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#ffa400></stop><stop offset=1 stop-color=#ff5e00></stop></linearGradient><path fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12 d="M33.5 79.5L7 74"></path><linearGradient x1=-1016.59 x2=-1017.862 y1=852.671 y2=852.595 gradientTransform="matrix(29 0 0 -8 29523 6971)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#ffa400></stop><stop offset=1 stop-color=#ff5e00></stop></linearGradient><path fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12 d="M34 146l-29 8"></path><linearGradient x1=-1011.984 x2=-1013.257 y1=863.523 y2=863.229 gradientTransform="matrix(24 0 0 -13 24339 11407)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#ffa400></stop><stop offset=1 stop-color=#ff5e00></stop></linearGradient><path fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12 d="M45 177l-24 13"></path><linearGradient x1=-1006.673 x2=-1007.946 y1=869.279 y2=868.376 gradientTransform="matrix(20 0 0 -19 20205 16720)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#ffa400></stop><stop offset=1 stop-color=#ff5e00></stop></linearGradient><path fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12 d="M67 204l-20 19"></path><linearGradient x1=-992.85 x2=-993.317 y1=871.258 y2=870.258 gradientTransform="matrix(13.8339 0 0 -22.8467 13825.796 20131.938)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#ffa400></stop><stop offset=1 stop-color=#ff5e00></stop></linearGradient><path fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12 d="M94.4 227l-13.8 22.8"></path><linearGradient x1=-953.835 x2=-953.965 y1=871.9 y2=870.9 gradientTransform="matrix(7.5 0 0 -24.5 7278 21605)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#ffa400></stop><stop offset=1 stop-color=#ff5e00></stop></linearGradient><path fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12 d="M127.5 243.5L120 268"></path><linearGradient x1=244.504 x2=244.496 y1=871.898 y2=870.898 gradientTransform="matrix(.5 0 0 -24.5 45.5 21614)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#ffa400></stop><stop offset=1 stop-color=#ff5e00></stop></linearGradient><path fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12 d="M167.5 252.5l.5 24.5">');function gt(){const e=St();return(()=>{var t=si(),o=t.firstChild,r=o.firstChild,p=r.nextSibling,s=p.nextSibling,a=s.firstChild,c=s.nextSibling,u=c.firstChild,n=c.nextSibling,i=n.nextSibling,$=i.firstChild,x=i.nextSibling,y=x.firstChild,T=x.nextSibling,A=T.nextSibling,te=A.firstChild,ie=A.nextSibling,h=ie.firstChild,R=ie.nextSibling,m=R.nextSibling,g=m.firstChild,z=m.nextSibling,q=z.firstChild,Q=z.nextSibling,w=Q.nextSibling,K=w.firstChild,ve=w.nextSibling,ue=ve.firstChild,ce=ve.nextSibling,H=ce.nextSibling,X=H.firstChild,le=H.nextSibling,Ce=le.firstChild,pe=le.nextSibling,M=pe.nextSibling,Y=M.firstChild,W=M.nextSibling,N=W.firstChild,J=W.nextSibling,re=J.firstChild,B=re.nextSibling,ne=B.nextSibling,f=J.nextSibling,k=f.firstChild,U=f.nextSibling,I=U.firstChild,C=U.nextSibling,P=C.firstChild,_=P.nextSibling,O=_.nextSibling,ee=O.nextSibling,G=ee.nextSibling,j=G.nextSibling,oe=j.nextSibling,de=oe.nextSibling,se=de.nextSibling,fe=se.nextSibling,me=fe.nextSibling,xe=me.nextSibling,he=xe.nextSibling,be=he.nextSibling,b=C.nextSibling,F=b.firstChild,ae=b.nextSibling,ye=ae.firstChild,ze=ae.nextSibling,Se=ze.nextSibling,Ue=Se.nextSibling,Te=Ue.firstChild,_e=Ue.nextSibling,Ae=_e.firstChild,Me=_e.nextSibling,Re=Me.firstChild,Ee=Re.firstChild,De=Ee.nextSibling,Be=De.nextSibling,Ke=Be.nextSibling,We=Ke.nextSibling,Ze=We.nextSibling,Qe=Ze.nextSibling,Xe=Qe.nextSibling,et=Xe.nextSibling,tt=et.nextSibling,it=tt.nextSibling,rt=it.nextSibling,nt=rt.nextSibling,ot=nt.nextSibling,lt=ot.nextSibling,st=lt.nextSibling,at=st.nextSibling,yt=at.nextSibling;return l(r,"id",`a-${e}`),l(p,"fill",`url(#a-${e})`),l(a,"id",`b-${e}`),l(c,"id",`c-${e}`),l(u,"filter",`url(#b-${e})`),l(n,"mask",`url(#c-${e})`),l($,"id",`d-${e}`),l(x,"id",`e-${e}`),l(y,"filter",`url(#d-${e})`),l(T,"mask",`url(#e-${e})`),l(te,"id",`f-${e}`),l(ie,"id",`g-${e}`),l(h,"filter",`url(#f-${e})`),l(R,"mask",`url(#g-${e})`),l(g,"id",`h-${e}`),l(z,"id",`i-${e}`),l(q,"filter",`url(#h-${e})`),l(Q,"mask",`url(#i-${e})`),l(K,"id",`j-${e}`),l(ve,"id",`k-${e}`),l(ue,"filter",`url(#j-${e})`),l(ce,"mask",`url(#k-${e})`),l(X,"id",`l-${e}`),l(le,"id",`m-${e}`),l(Ce,"filter",`url(#l-${e})`),l(pe,"mask",`url(#m-${e})`),l(Y,"id",`n-${e}`),l(W,"id",`o-${e}`),l(N,"filter",`url(#n-${e})`),l(J,"mask",`url(#o-${e})`),l(B,"id",`p-${e}`),l(ne,"fill",`url(#p-${e})`),l(k,"id",`q-${e}`),l(U,"id",`r-${e}`),l(I,"filter",`url(#q-${e})`),l(C,"mask",`url(#r-${e})`),l(P,"id",`s-${e}`),l(_,"fill",`url(#s-${e})`),l(O,"id",`t-${e}`),l(ee,"fill",`url(#t-${e})`),l(G,"id",`u-${e}`),l(j,"fill",`url(#u-${e})`),l(oe,"id",`v-${e}`),l(de,"fill",`url(#v-${e})`),l(se,"id",`w-${e}`),l(fe,"fill",`url(#w-${e})`),l(me,"id",`x-${e}`),l(xe,"fill",`url(#x-${e})`),l(he,"id",`y-${e}`),l(be,"fill",`url(#y-${e})`),l(F,"id",`z-${e}`),l(ae,"id",`A-${e}`),l(ye,"filter",`url(#z-${e})`),l(ze,"id",`B-${e}`),l(Se,"fill",`url(#B-${e})`),l(Se,"mask",`url(#A-${e})`),l(Te,"id",`C-${e}`),l(_e,"id",`D-${e}`),l(Ae,"filter",`url(#C-${e})`),l(Me,"mask",`url(#D-${e})`),l(Ee,"id",`E-${e}`),l(De,"fill",`url(#E-${e})`),l(Be,"id",`F-${e}`),l(Ke,"stroke",`url(#F-${e})`),l(We,"id",`G-${e}`),l(Ze,"stroke",`url(#G-${e})`),l(Qe,"id",`H-${e}`),l(Xe,"stroke",`url(#H-${e})`),l(et,"id",`I-${e}`),l(tt,"stroke",`url(#I-${e})`),l(it,"id",`J-${e}`),l(rt,"stroke",`url(#J-${e})`),l(nt,"id",`K-${e}`),l(ot,"stroke",`url(#K-${e})`),l(lt,"id",`L-${e}`),l(st,"stroke",`url(#L-${e})`),l(at,"id",`M-${e}`),l(yt,"stroke",`url(#M-${e})`),t})()}var ai=L("<button type=button><div><div></div><div></div></div><div>-</div><div>TanStack Router");function ci({initialIsOpen:e,panelProps:t={},closeButtonProps:o={},toggleButtonProps:r={},position:p="bottom-left",containerElement:s="footer",router:a,routerState:c,shadowDOMTarget:u}){const[n,i]=ge();let $;const[x,y]=je("tanstackRouterDevtoolsOpen",e),[T,A]=je("tanstackRouterDevtoolsHeight",null),[te,ie]=ge(!1),[h,R]=ge(!1),m=Ut(),g=Ge(),z=(M,Y)=>{if(Y.button!==0)return;R(!0);const W={originalHeight:(M==null?void 0:M.getBoundingClientRect().height)??0,pageY:Y.pageY},N=re=>{const B=W.pageY-re.pageY,ne=W.originalHeight+B;A(ne),ne<70?y(!1):y(!0)},J=()=>{R(!1),document.removeEventListener("mousemove",N),document.removeEventListener("mouseUp",J)};document.addEventListener("mousemove",N),document.addEventListener("mouseup",J)};x(),Oe(()=>{ie(x()??!1)}),Oe(()=>{var M,Y,W;if(te()){const N=(Y=(M=n())==null?void 0:M.parentElement)==null?void 0:Y.style.paddingBottom,J=()=>{var re;const B=$.getBoundingClientRect().height;(re=n())!=null&&re.parentElement&&i(ne=>(ne!=null&&ne.parentElement&&(ne.parentElement.style.paddingBottom=`${B}px`),ne))};if(J(),typeof window<"u")return window.addEventListener("resize",J),()=>{var re;window.removeEventListener("resize",J),(re=n())!=null&&re.parentElement&&typeof N=="string"&&i(B=>(B.parentElement.style.paddingBottom=N,B))}}else(W=n())!=null&&W.parentElement&&i(N=>(N!=null&&N.parentElement&&N.parentElement.removeAttribute("style"),N))}),Oe(()=>{if(n()){const M=n(),Y=getComputedStyle(M).fontSize;M==null||M.style.setProperty("--tsrd-font-size",Y)}});const{style:q={},...Q}=t,{style:w={},onClick:K,...ve}=o,{onClick:ue,class:ce,...H}=r;if(!m())return null;const X=S(()=>T()??500),le=S(()=>Z(g().devtoolsPanelContainer,g().devtoolsPanelContainerVisibility(!!x()),g().devtoolsPanelContainerResizing(h),g().devtoolsPanelContainerAnimation(te(),X()+16))),Ce=S(()=>({height:`${X()}px`,...q||{}})),pe=S(()=>Z(g().mainCloseBtn,g().mainCloseBtnPosition(p),g().mainCloseBtnAnimation(!!x()),ce));return V(_t,{component:s,ref:i,class:"TanStackRouterDevtools",get children(){return[V($t.Provider,{value:{onCloseClick:K??(()=>{})},get children(){return V(li,Ie({ref(M){var Y=$;typeof Y=="function"?Y(M):$=M}},Q,{router:a,routerState:c,className:le,style:Ce,get isOpen(){return te()},setIsOpen:y,handleDragStart:M=>z($,M),shadowDOMTarget:u}))}}),(()=>{var M=ai(),Y=M.firstChild,W=Y.firstChild,N=W.nextSibling,J=Y.nextSibling,re=J.nextSibling;return qe(M,Ie(H,{"aria-label":"Open TanStack Router Devtools",onClick:B=>{y(!0),ue&&ue(B)},get class(){return pe()}}),!1,!0),v(W,V(gt,{})),v(N,V(gt,{})),D(B=>{var ne=g().mainCloseBtnIconContainer,f=g().mainCloseBtnIconOuter,k=g().mainCloseBtnIconInner,U=g().mainCloseBtnDivider,I=g().routerLogoCloseButton;return ne!==B.e&&d(Y,B.e=ne),f!==B.t&&d(W,B.t=f),k!==B.a&&d(N,B.a=k),U!==B.o&&d(J,B.o=U),I!==B.i&&d(re,B.i=I),B},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0}),M})()]}})}export{ci as FloatingTanStackRouterDevtools,ci as default};
