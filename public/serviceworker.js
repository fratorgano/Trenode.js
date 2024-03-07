self.addEventListener("push", async (event) => {
  const { title, body } = await event.data.json();
  self.registration.showNotification(title, {
    body,
  });
});
