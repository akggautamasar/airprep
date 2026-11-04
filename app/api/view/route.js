import {list} from "@vercel/blob";
import {NextResponse} from "next/server";

export const runtime="nodejs";
export const dynamic="force-dynamic";

/* Each uploaded HTML remains interactive but gains a mobile-responsive layer.
   Stream rather than buffering files (mock tests can exceed 10 MB). */
const RESPONSIVE_CSS="\n:root{-webkit-text-size-adjust:100%;text-size-adjust:100%}\nhtml,body{max-width:100%;overflow-x:clip}\nbody{min-width:0}\n:where(main,.main-content,.container,.wrapper,.content,.page,.page-content,.app,.layout,article,section){min-width:0}\n:where(img,video,canvas,svg,iframe,embed){max-width:100%}\n:where(pre,.code-block,.math-block){max-width:100%;overflow-x:auto}\n:where(h1,h2,h3,h4,p,.card-title,.module-title){overflow-wrap:break-word}\n.airprep-sidebar-toggle{display:none}\n.airprep-table-scroll{width:100%;max-width:100%;overflow-x:auto;overscroll-behavior-x:contain;-webkit-overflow-scrolling:touch}\nbody:has(> .sidebar):has(> .main-content) > .main-content{min-width:0!important}\n@media(max-width:960px){\nbody:has(> .sidebar):has(> .main-content){flex-direction:column!important}\nbody:has(> .sidebar):has(> .main-content) > .sidebar{width:100%!important;max-width:100%!important;height:auto!important;min-height:0!important;position:relative!important;top:auto!important;flex-shrink:0!important}\nbody:has(> .sidebar):has(> .main-content) > .main-content{width:100%!important;max-width:100%!important;margin:0!important;padding:14px 12px 56px!important}\nbody:has(> .sidebar):has(> .main-content) > .main-content > *{min-width:0!important;max-width:100%}\n.sidebar .nav-scroll,.sidebar .search-box{display:none!important}\n.sidebar.airprep-open .nav-scroll{display:block!important;max-height:48dvh!important;flex:none!important;overflow-y:auto}\n.sidebar.airprep-open .search-box{display:block!important}\n.sidebar .sidebar-header{display:flex;flex-direction:column;gap:8px;padding:12px 14px!important}\n.sidebar .sidebar-header h1{line-height:1.25}\n.airprep-sidebar-toggle{display:block;background:rgba(56,189,248,.13);color:inherit;border:1px solid rgba(56,189,248,.4);border-radius:9px;padding:10px 12px;text-align:left;font:600 14px/1.3 system-ui,sans-serif;min-height:42px;cursor:pointer}\n:where(.hero-banner){padding:18px 16px!important;margin-bottom:20px!important}\n:where(.hero-banner h1){font-size:clamp(1.35rem,5vw,1.9rem)!important;line-height:1.25!important;overflow-wrap:anywhere}\n:where(.hero-stats,.sim-readout){grid-template-columns:repeat(auto-fit,minmax(min(100%,155px),1fr))!important}\n:where(.module-header,.card-header,.card-content,.sim-card){padding:14px!important}\n:where(.module-title){font-size:clamp(1.03rem,4.4vw,1.45rem)!important}\n:where(.sim-controls){gap:10px!important}\n:where(.sim-controls .ctrl-group){min-width:0!important;max-width:100%}\n:where(input,select,textarea){max-width:100%}\n}\n@media(max-width:480px){\n:where(.hero-stats,.sim-readout){grid-template-columns:1fr!important}\n:where(.card-meta,.sim-controls,.sim-header){min-width:0}\n}\n";
const RESPONSIVE_JS="\n(function(){\n var cache=Object.create(null);\n function makeStorage(persist){\n  var data=persist?cache:Object.create(null);\n  return {\n   get length(){return Object.keys(data).length;},\n   key:function(index){return Object.keys(data)[index]||null;},\n   getItem:function(key){key=String(key);return Object.prototype.hasOwnProperty.call(data,key)?data[key]:null;},\n   setItem:function(key,value){key=String(key);value=String(value);data[key]=value;if(persist)send(\"set\",key,value);},\n   removeItem:function(key){key=String(key);delete data[key];if(persist)send(\"remove\",key);},\n   clear:function(){Object.keys(data).forEach(function(k){delete data[k]});if(persist)send(\"clear\");}\n  };\n }\n function send(action,key,value){\n  try{window.parent.postMessage({__airprepStorage:true,action:action,key:key,value:value},\"*\");}catch(_){}\n }\n try{window.localStorage.getItem(\"__airprep_probe__\");}catch(_){\n  try{Object.defineProperty(window,\"localStorage\",{configurable:true,value:makeStorage(true)});}catch(_){}\n }\n try{window.sessionStorage.getItem(\"__airprep_probe__\");}catch(_){\n  try{Object.defineProperty(window,\"sessionStorage\",{configurable:true,value:makeStorage(false)});}catch(_){}\n }\n window.addEventListener(\"message\",function(event){\n  if(event.source!==window.parent||!event.data||event.data.__airprepStorage!==true||event.data.action!==\"hydrate\")return;\n  var saved=event.data.data;\n  if(!saved||typeof saved!==\"object\"||Array.isArray(saved))return;\n  Object.keys(saved).forEach(function(k){if(typeof saved[k]===\"string\")cache[k]=saved[k]});\n  if(cache.spm_theme===\"light\"||cache.spm_theme===\"dark\"){\n   document.documentElement.setAttribute(\"data-theme\",cache.spm_theme);\n   if(typeof window.updateThemeButtons===\"function\")window.updateThemeButtons(cache.spm_theme);\n  }\n });\n send(\"load\");\n function setup(){\n  var sidebar=document.querySelector(\"body > .sidebar\");\n  var main=document.querySelector(\"body > .main-content\");\n  if(sidebar&&main){\n   var header=sidebar.querySelector(\".sidebar-header\");\n   if(header&&!sidebar.querySelector(\".airprep-sidebar-toggle\")){\n    var b=document.createElement(\"button\");b.type=\"button\";b.className=\"airprep-sidebar-toggle\";b.setAttribute(\"aria-expanded\",\"false\");b.textContent=\"☰ Browse lectures & simulators\";\n    b.addEventListener(\"click\",function(){var open=sidebar.classList.toggle(\"airprep-open\");b.setAttribute(\"aria-expanded\",String(open));b.textContent=open?\"✕ Close lecture list\":\"☰ Browse lectures & simulators\";});\n    header.appendChild(b);\n   }\n   sidebar.addEventListener(\"click\",function(e){if(e.target.closest('a[href^=\"#\"]')&&window.matchMedia(\"(max-width:960px)\").matches){sidebar.classList.remove(\"airprep-open\");var b=sidebar.querySelector(\".airprep-sidebar-toggle\");if(b){b.setAttribute(\"aria-expanded\",\"false\");b.textContent=\"☰ Browse lectures & simulators\";}}});\n  }\n  document.querySelectorAll(\"table\").forEach(function(t){if(!t.parentElement.classList.contains(\"airprep-table-scroll\")){var w=document.createElement(\"div\");w.className=\"airprep-table-scroll\";t.parentElement.insertBefore(w,t);w.appendChild(t);}});\n }\n if(document.readyState===\"loading\")document.addEventListener(\"DOMContentLoaded\",setup);else setup();\n})();\n";
const INJECTION='<style id="airprep-responsive">'+RESPONSIVE_CSS+'</style><script id="airprep-adapter">'+RESPONSIVE_JS+'</script>';

function addResponsiveLayer(source){
 const decoder=new TextDecoder("utf-8");
 const encoder=new TextEncoder();
 let pending="";
 let inserted=false;
 return source.pipeThrough(new TransformStream({
  transform(chunk,controller){
   const text=decoder.decode(chunk,{stream:true});
   if(inserted){if(text)controller.enqueue(encoder.encode(text));return;}
   pending+=text;
   const pos=pending.search(/<\/head\s*>/i);
   if(pos>=0){
    controller.enqueue(encoder.encode(pending.slice(0,pos)+INJECTION+pending.slice(pos)));
    pending="";
    inserted=true;
   }else if(pending.length>262144){
    controller.enqueue(encoder.encode(INJECTION+pending));
    pending="";
    inserted=true;
   }
  },
  flush(controller){
   pending+=decoder.decode();
   if(pending)controller.enqueue(encoder.encode(inserted?pending:INJECTION+pending));
  }
 }));
}

export async function GET(request){
 const path=new URL(request.url).searchParams.get("path")||"";
 if(!/^airprep\/[a-zA-Z0-9 -]{1,50}\/[a-zA-Z0-9_-]{1,150}\.html$/.test(path))
  return new NextResponse("Invalid resource",{status:400});
 try{
  const found=await list({prefix:path,limit:10});
  const item=found.blobs.find(b=>b.pathname===path);
  if(!item)return new NextResponse("Resource not found",{status:404});
  const upstream=await fetch(item.url,{cache:"force-cache"});
  if(!upstream.ok||!upstream.body)return new NextResponse("Resource unavailable",{status:502});
  return new NextResponse(addResponsiveLayer(upstream.body),{
   headers:{
    "Content-Type":"text/html; charset=utf-8",
    "Content-Disposition":"inline",
    "Cache-Control":"public, max-age=300, stale-while-revalidate=600",
    "X-Content-Type-Options":"nosniff",
    "Referrer-Policy":"no-referrer",
    "Content-Security-Policy":"sandbox allow-scripts allow-forms allow-popups allow-downloads; frame-ancestors 'self'"
   }
  });
 }catch(error){
  console.error("AirPrep HTML viewer failed",error?.message);
  return new NextResponse("Unable to load HTML resource",{status:503});
 }
}
