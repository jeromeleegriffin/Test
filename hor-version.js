// Griffin House of Rooks — 805-ownerreview runtime marker, no gameplay ownership.
window.HOR_LIVE_VERSION = '805-ownerreview';
window.HOR_BUILD = '805-ownerreview';
window.GHR_BUILD = "Rook805-ownerreview · Ornate welcome and room-code panels";
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
    coherent:window.HOR_PAGE_BUILD === '805-ownerreview' && window.HOR_SCRIPT_BUILD === '805-ownerreview' &&
      window.HOR_BUILD === '805-ownerreview' && !!worker && worker.build === '805-ownerreview' &&
      worker.cache === 'house-of-rooks-805-ownerreview'};
};
