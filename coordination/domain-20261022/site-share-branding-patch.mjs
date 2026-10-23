function updateShareBranding(source){
 const edits=[
 ['const rooksArt = root + "/images/rooks-v1.jpg";','const rooksArt = root + "/images/rooks-v1.jpg";\nconst rooksLogo = "https://rooks.jeromegriffin.com/cloud-game/assets/assets/images/house-of-rooks-512.png?v=805-ownerreview";'],
 ['function metadata(title,description,url,image,type){','function metadata(title,description,url,image,type){\n  if(image===rooksArt){image=rooksLogo;type="image/png";}'],
 ['["og:image:width","1200"],["og:image:height","630"]','["og:image:width",image===rooksLogo?"512":"1200"],["og:image:height",image===rooksLogo?"512":"630"]'],
 ["  return result;","  if(image===rooksLogo)result+='<link rel=\"icon\" type=\"image/png\" href=\"'+rooksLogo+'\"><link rel=\"apple-touch-icon\" href=\"'+rooksLogo+'\"><meta property=\"og:image:alt\" content=\"Gold Griffin House of Rooks logo\">';\n  return result;"]
 ];
 for(const [from,to]of edits){if(source.split(from).length!==2)throw Error('Ambiguous or missing patch target: '+from);source=source.replace(from,to);}
 return source;
}
