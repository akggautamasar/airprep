"use client";

import {useEffect,useRef,useState} from "react";

// Pretext is an efficient *text* measurement engine, not a math renderer.
// Only ordinary UI headings are measured here; uploaded HTML and MathJax stay intact.
const sizing = {
  card: {sizes:[21,20,19,18,17],maxLines:3,weight:800},
  reader: {sizes:[15,14,13,12],maxLines:2,weight:700},
};
let enginePromise;
function loadEngine(){
  if(!enginePromise) enginePromise=import("@chenglou/pretext");
  return enginePromise;
}
function fitText(text,width,variant,engine,cache){
  const {sizes,maxLines,weight}=sizing[variant]||sizing.card;
  const lineHeightMultiplier=1.3;
  const widthSafe=Math.max(40,Math.floor(width));
  function getLayout(str,size){
    const font=weight+" "+size+"px Outfit";
    const key=font+"\u0000"+str;
    if(!cache.has(key))cache.set(key,engine.prepare(str,font));
    return engine.layout(cache.get(key),widthSafe,size*lineHeightMultiplier);
  }
  let chosen=sizes[sizes.length-1];
  for(const size of sizes){
    if(getLayout(text,size).lineCount<=maxLines){chosen=size;break}
  }
  if(variant==="reader"&&getLayout(text,chosen).lineCount>maxLines){
    // Keep the important beginning of long study titles, with accessible full title.
    const tokens=text.trim().split(/\s+/);
    let low=0,high=tokens.length,best="";
    while(low<=high){
      const mid=(low+high)>>1;
      const candidate=tokens.slice(0,mid).join(" ")+(mid<tokens.length?"…":"");
      if(getLayout(candidate,chosen).lineCount<=maxLines){
        best=candidate;low=mid+1;
      }else high=mid-1;
    }
    return {fontSize:chosen,text:best||text};
  }
  return {fontSize:chosen,text};
}
export default function PretextTitle({text,variant="card",as:Tag="h3",className=""}){
  const elementRef=useRef(null);
  const [computed,setComputed]=useState(null);
  useEffect(()=>{
    let alive=true;
    let observer;
    const cache=new Map();
    const run=async()=>{
      try{
        const engine=await loadEngine();
        if(document.fonts?.ready)await document.fonts.ready;
        if(!alive||!elementRef.current)return;
        const measure=entries=>{
          if(!alive)return;
          const width=entries?.[0]?.contentRect?.width||elementRef.current?.clientWidth||0;
          if(width<=0)return;
          try{
            const fitted=fitText(text,width,variant,engine,cache);
            setComputed(old=>old?.fontSize===fitted.fontSize&&old?.text===fitted.text?old:fitted);
          }catch(error){
            // The browser's native responsive CSS remains a safe fallback.
            if(process.env.NODE_ENV!=="production")console.warn("Pretext measurement fallback",error);
          }
        };
        observer=new ResizeObserver(measure);
        observer.observe(elementRef.current);
        measure();
      }catch(error){
        if(process.env.NODE_ENV!=="production")console.warn("Pretext unavailable, using CSS",error);
      }
    };
    run();
    return ()=>{alive=false;observer?.disconnect()};
  },[text,variant]);
  return <Tag
    ref={elementRef}
    className={"airprep-pretext-title airprep-pretext-"+variant+(className?" "+className:"")}
    title={text}
    aria-label={computed?.text!==text?text:undefined}
    style={computed?{fontSize:computed.fontSize+"px",lineHeight:"1.3"}:undefined}
  >{computed?.text||text}</Tag>;
}
