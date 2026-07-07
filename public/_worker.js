export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Si la petición va dirigida a la API, actuamos como Proxy
    if (url.pathname.startsWith('/api/')) {
      const targetUrl = new URL(url.pathname + url.search, "https://sistematextil.pp.ua");
      
      const proxyRequest = new Request(targetUrl, request);
      proxyRequest.headers.set("Host", "sistematextil.pp.ua");
      proxyRequest.headers.set("Origin", "https://sistematextil.pp.ua");

      let response = await fetch(proxyRequest);
      
      // Añadir cabeceras CORS de vuelta al navegador
      let newResponse = new Response(response.body, response);
      newResponse.headers.set('Access-Control-Allow-Origin', '*');
      newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      newResponse.headers.set('Access-Control-Allow-Headers', '*');
      
      return newResponse;
    }

    // Para cualquier otra ruta (HTML, CSS, JS), Cloudflare Pages las sirve normalmente
    return env.ASSETS.fetch(request);
  }
};
