export async function onRequest(context) {
  // context.request contains the incoming request from the browser
  const url = new URL(context.request.url);
  
  // Reconstruct the URL to point to the VPS
  // e.g. /api/v1/products -> https://sistematextil.pp.ua/api/v1/products
  const targetUrl = new URL(url.pathname + url.search, "https://sistematextil.pp.ua");
  
  // Create a new request object to forward to the VPS
  const proxyRequest = new Request(targetUrl, context.request);
  
  // Fetch the data from the real backend
  return await fetch(proxyRequest);
}
