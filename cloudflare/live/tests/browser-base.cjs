const {chromium}=require('playwright');
exports.launch=()=>chromium.launch({headless:true,executablePath:__dirname+'/browser-runtime/extracted/chromium',args:['--no-sandbox','--disable-dev-shm-usage'],env:{...process.env,LD_LIBRARY_PATH:__dirname+'/browser-runtime/extracted',FONTCONFIG_PATH:__dirname+'/browser-runtime/extracted/fonts'}});
