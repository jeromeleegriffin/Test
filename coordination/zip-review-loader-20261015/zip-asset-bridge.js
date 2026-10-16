function zipAssetBridge(assetMap) {
  'use strict';
  function resolve(value) {
    if (typeof value !== 'string' || /^(data:|blob:|https?:|\/\/|#|mailto:)/i.test(value)) return value;
    try {
      var path = new URL(value, 'https://zip.local/').pathname.replace(/^\//, '');
      return assetMap[path] || value;
    } catch (_) { return value; }
  }
  function css(value) {
    return String(value).replace(/url\(\s*(['"]?)([^'"\)]+)\1\s*\)/gi, function(all, quote, path) {
      var result=resolve(path.trim());return result===path.trim()?all:'url("'+result+'")';
    });
  }
  function html(value) {
    return String(value).replace(/\b(src|href|xlink:href|poster)\s*=\s*(["'])([^"']+)\2/gi,function(all,attr,quote,path){return attr+'='+quote+resolve(path)+quote;});
  }
  function property(proto,key,translate) {
    if (!proto) return;
    var descriptor=Object.getOwnPropertyDescriptor(proto,key);
    if(!descriptor||!descriptor.set||!descriptor.configurable)return;
    Object.defineProperty(proto,key,Object.assign({},descriptor,{set:function(value){descriptor.set.call(this,translate(value));}}));
  }
  if(window.fetch){var nativeFetch=window.fetch;window.fetch=function(input,options){return nativeFetch.call(this,typeof input==='string'?resolve(input):input,options);};}
  if(window.XMLHttpRequest){var open=XMLHttpRequest.prototype.open;XMLHttpRequest.prototype.open=function(method,url){var args=Array.prototype.slice.call(arguments);args[1]=resolve(url);return open.apply(this,args);};}
  property(window.HTMLImageElement?.prototype,'src',resolve);
  property(window.HTMLMediaElement?.prototype,'src',resolve);
  property(window.HTMLSourceElement?.prototype,'src',resolve);
  property(window.HTMLVideoElement?.prototype,'poster',resolve);
  property(window.HTMLScriptElement?.prototype,'src',resolve);
  property(window.HTMLLinkElement?.prototype,'href',resolve);
  property(window.Element?.prototype,'innerHTML',html);
  if(window.Element){var setAttribute=Element.prototype.setAttribute,setAttributeNS=Element.prototype.setAttributeNS,insert=Element.prototype.insertAdjacentHTML;
    Element.prototype.setAttribute=function(name,value){return setAttribute.call(this,name,/^(src|href|xlink:href|poster)$/i.test(name)?resolve(value):name==='style'?css(value):value);};
    Element.prototype.setAttributeNS=function(ns,name,value){return setAttributeNS.call(this,ns,name,/^(src|href|xlink:href|poster)$/i.test(name)?resolve(value):value);};
    Element.prototype.insertAdjacentHTML=function(position,value){return insert.call(this,position,html(value));};
  }
  for(var name of ['background','backgroundImage','borderImage','borderImageSource','maskImage','webkitMaskImage'])property(window.CSSStyleDeclaration?.prototype,name,css);
  if(window.CSSStyleDeclaration){var setProperty=CSSStyleDeclaration.prototype.setProperty;CSSStyleDeclaration.prototype.setProperty=function(name,value,priority){return setProperty.call(this,name,css(value),priority);};}
  if(window.Worker){var NativeWorker=window.Worker;window.Worker=function(url,options){return new NativeWorker(resolve(String(url)),options);};window.Worker.prototype=NativeWorker.prototype;}
  // Blob previews cannot install a game service worker. Leave existing registrations/caches alone.
  if(navigator.serviceWorker)try{navigator.serviceWorker.register=function(){return Promise.reject(new Error('ZIP preview uses its packaged assets; service-worker registration skipped.'));};}catch(_){}
  window.HORZipAssets={resolve:resolve,count:Object.keys(assetMap).length};
}
