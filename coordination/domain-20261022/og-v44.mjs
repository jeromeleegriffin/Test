export default {async fetch(request, env) {
 const response=await env.GAME.fetch(request);
 const type=response.headers.get("content-type")||"";
 if(!response.ok || !type.includes("text/html"))return response;
 const u=new URL(request.url);
 const image="https://rooks.jeromegriffin.com/cloud-game/assets/assets/images/house-of-rooks-512.png?v=805-ownerreview";
 const title="Griffin House of Rooks";
 const desc="Play offline or with friends. No download required.";
 const url=u.origin+u.pathname+u.search;
 const escape=v=>String(v).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;");
 const tags=[
   ["og:type","website"],["og:site_name","Griffin House of Rooks"],
   ["og:url",url],["og:title",title],["og:description",desc],
   ["og:image",image],["og:image:secure_url",image],["og:image:type","image/png"],
   ["og:image:width","512"],["og:image:height","512"],
   ["og:image:alt","Gold Griffin House of Rooks logo"]
 ].map(([name,value])=>'<meta property="'+name+'" content="'+escape(value)+'">').join("")
 +'<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="'+title+'"><meta name="twitter:description" content="'+desc+'"><meta name="twitter:image" content="'+image+'">';
 const newResponse=new HTMLRewriter().on("head",{element(e){e.append(tags,{html:true})}}).transform(response);
 newResponse.headers.set("x-griffin-social-overlay","v2-griffin-logo");
 return newResponse;
}}