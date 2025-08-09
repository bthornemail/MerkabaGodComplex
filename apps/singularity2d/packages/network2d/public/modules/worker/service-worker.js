/*
 Copyright 2014 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

// In Chrome, you can view these log messages and many more useful pieces of
// debugging info at chrome://inspect/#service-workers

self.addEventListener('install', function(e) {
    // This event will be fired once when this version of the script is first registered for
    // a given URL scope.
    // It's an opportunity to initialize caches and prefetch data, if desired. This sort of
    // work should be wrapped in a Promise, and e.waitUntil(promise) can be used to ensure that
    // this installation does not complete until the Promise is settled.
    // Also, be aware that there may already be an existing service worker controlling the page
    // (either an earlier version of this script or a completely different script.)
  e.waitUntil(
    // Perform installation tasks, e.g., caching static assets
    caches.open('my-cache').then(cache => {
      return cache.addAll([
        '/index.html',
        '/styles.css',
        '/script.js',
        '/images/logo.png',
      ]);
    })
  );
    console.log('Install event:', e);
  });
  
  self.addEventListener('activate', function(e) {
    // This event will be fired once when this version of the script is first registered for
    // a given URL scope.
    // It's an opportunity to clean up any stale data that might be left behind in self.caches
    // by an older version of this script.
    // e.waitUntil(promise) is also available here to delay activation until work has been performed,
    // but note that waiting within the activate event will delay handling of any
    // fetch or message events that are fired in the interim. When possible, do work during the install phase.
    // It will NOT be fired each time the service worker is revived after being terminated.
    // To perform an action when the service worker is revived, include that logic in the
    // `on  fetch` or `onmessage` event listeners.
  // Perform activation tasks, e.g., cleaning up old caches
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName.startsWith('my-') && cacheName !== 'my-cache';
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
    console.log('Activate event:', e);
  });

  self.addEventListener("fetch", (event) => {
    // Let the browser do its default thing
    // for non-GET requests.
    if (event.request.method !== "GET") return;
  
    // Prevent the default, and handle the request ourselves.
    event.respondWith(
      (async () => {
        // Try to get the response from a cache.
        const cache = await caches.open("dynamic-v1");
        const cachedResponse = await cache.match(event.request);
  
        if (cachedResponse) {
          // If we found a match in the cache, return it, but also
          // update the entry in the cache in the background.
          event.waitUntil(cache.add(event.request));
          return cachedResponse;
        }
  
        // If we didn't find a match in the cache, use the network.
        return fetch(event.request);
      })(),
    );
  });
  // Event listener for the 'fetch' event
self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request).then(response => {
        // If the request is found in the cache, return the cached response
        if (response) {
          return response;
        }
        // If not, fetch the request from the network and cache it
        return fetch(event.request).then(networkResponse => {
          caches.open('my-cache').then(cache => {
            cache.put(event.request, networkResponse.clone());
          });
          return networkResponse;
        });
      })
    );
  });