export async function onRequest(context) {
  const url = new URL(context.request.url);
  
  // Reconstruct the URL to point to the VPS
  const targetUrl = new URL(url.pathname + url.search, "https://sistematextil.pp.ua");
  
  // Create a new request object to forward to the VPS
  const proxyRequest = new Request(targetUrl, context.request);
  
  // CRITICAL: We must change the Host header so NGINX on the VPS recognizes the domain
  proxyRequest.headers.set("Host", "sistematextil.pp.ua");
  // Also fix the Origin header just in case Spring Boot checks it
  proxyRequest.headers.set("Origin", "https://sistematextil.pp.ua");
  
  // Fetch the data from the real backend
  let response = await fetch(proxyRequest);
  
  // Clone response to add CORS headers just in case
  let newResponse = new Response(response.body, response);
  newResponse.headers.set('Access-Control-Allow-Origin', '*');
  newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  newResponse.headers.set('Access-Control-Allow-Headers', '*');
  
  return newResponse;
}
