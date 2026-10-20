// Automation transport only: retry immutable asset GETs, never room mutations.
exports.fetchBuffered = async function(url, init, fetcher = fetch, onRetry = () => {}) {
  const asset = init.method === 'GET' && new URL(url).pathname.startsWith('/cloud-game/assets/');
  const attempts = asset ? 3 : 1;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const response = await fetcher(url, {...init, signal: AbortSignal.timeout(45000)});
      const body = Buffer.from(await response.arrayBuffer());
      if (asset && [429,502,503,504].includes(response.status) && attempt < attempts) {
        onRetry(attempt, 'HTTP '+response.status);
        continue;
      }
      return {response, body};
    } catch (error) {
      if (attempt === attempts) throw error;
      onRetry(attempt, error.message);
    }
  }
};
