/*referenced Matthew Cranford's Restaurant Reviews App Walkthrough blog post
(https://matthewcranford.com/restaurant-reviews-app-walkthrough), and
Traversy Media's Intro To Service Workers & Caching YouTube video
(https://www.youtube.com/watch?v=ksXwaWHCW6k)
*/

const cacheVersion = 'v1';

const cacheItems = [
	'/index.html',
	'/restaurant.html',
	'/css/styles.css',
	'/js/dbhelper.js',
	'/js/main.js',
	'/js/restaurant_info.js',
	'/img/1.jpg',
	'/img/2.jpg',
	'/img/3.jpg',
	'/img/4.jpg',
	'/img/5.jpg',
	'/img/6.jpg',
	'/img/7.jpg',
	'/img/8.jpg',
	'/img/9.jpg',
	'/img/10.jpg'
];

//Install Service Worker and cache the site
self.addEventListener('install', e =>{
  console.log('SW: installed');
    e.waitUntil(
      caches.open(cacheVersion).then(cache =>{
        console.log('SW: Caching');
        cache.addAll(cacheItems);
      })
);
});

//Active Service Worker
self.addEventListener('activate', e =>{
  console.log('SW: activated');

  //Remove old cache
  e.waitUntil(
    caches.keys().then(cacheVersions => {
      return Promise.all(
        cacheVersions.map(cache => {
          if (cache !== cacheVersion){
            console.log('SW: Remove the old cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
  });


//Fetch
self.addEventListener('fetch', e => {
  console.log('SW: Fetching');
  e.respondWith(fetch(e.request).then(res => {
      //Clone response
      const clonedResponse = res.clone();
      //Open cache
      caches.open(cacheVersion).then(cache =>{
        //Put response to cache
        cache.put(e.request, clonedResponse);
      });
      return res;
    })
  .catch(err => caches.match(e.request).then(res => res))
  );
});
