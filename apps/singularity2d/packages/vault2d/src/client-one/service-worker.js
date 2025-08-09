// Service Worker Script

// Listen for incoming messages
self.addEventListener('message', (event) => {
  const data = event.data;

  console.log({data});
  if (data && data.type === 'user-message') {
    const { event: fileEvent, path } = data.payload;

    // Show a notification
    self.registration.showNotification('Peer Connected', {
      body: `Event: ${fileEvent}\nPath: ${path}`,
      icon: 'images/2192072-200.png', // Optional: Add an icon file
      tag: 'peer-connected',
    });
  }
});

// Optional: Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Perform an action, e.g., focus a tab
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientsArr) => {
      if (clientsArr.length > 0) {
        clientsArr[0].focus();
      } else {
        clients.openWindow('/'); // Replace with your app's URL
      }
    })
  );
});
