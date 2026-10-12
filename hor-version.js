// Griffin House of Rooks — R779 runtime marker, no gameplay ownership.
window.HOR_LIVE_VERSION = 779;
window.HOR_BUILD = 779;
window.GHR_BUILD = "Rook779";
window.HORRuntimeTruth = async function () {
  const controller = navigator.serviceWorker && navigator.serviceWorker.controller;
  const worker = controller ? await new Promise(resolve => {
    const channel = new MessageChannel();
    const timer = setTimeout(() => resolve(null), 2000);
    channel.port1.onmessage = e => { clearTimeout(timer); channel.port1.close(); resolve(e.data); };
    controller.postMessage({type:'HOR_BUILD_QUERY'}, [channel.port2]);
  }) : null;
  return {page:window.HOR_PAGE_BUILD, script:window.HOR_SCRIPT_BUILD,
    marker:window.HOR_BUILD, worker, controller:controller && controller.scriptURL,
    coherent:window.HOR_PAGE_BUILD === '779' && window.HOR_SCRIPT_BUILD === '779' &&
      window.HOR_BUILD === 779 && !!worker && worker.build === '779' &&
      worker.cache === 'house-of-rooks-v779'};
};
