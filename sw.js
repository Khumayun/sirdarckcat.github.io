self.addEventListener('fetch', function(event) {
  var url = new URL(event.request.url);
  if (url.pathname.match(/\/fetch$/))
    event.respondWith(fetch(new Request(
      unescape(url.search.match(/(?:&|^\?)url=([^&]+)/)[1]),
      JSON.parse(unescape(url.search.match(/(?:&|^\?)init=([^&]+)/)[1])))));
  if (url.pathname.match(/\/response$/))
    event.respondWith(new Response(
      unescape(url.search.match(/(?:&|^\?)response=([^&]+)/)[1]),
      JSON.parse(unescape(url.search.match(/(?:&|^\?)init=([^&]+)/)[1]))));
});
