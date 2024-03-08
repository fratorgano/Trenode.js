async function setupButtons(trainsData) {
  // load followed trains from session storage
  let followedTrains = loadSessionStorage('followedTrains');
  if (followedTrains === null) {
    followedTrains = [];
  }
  // get all the buttons with the class btn-train-follow
  const elements = document.getElementsByClassName("btn-train-follow");
  // get parameters from url
  let params = new URLSearchParams(location.search);
  // register service worker to handle notifications
  const registered_worker = await navigator.serviceWorker.register("/public/serviceworker.js",{scope: "/public/",});
  for (button of elements) {
    // check if the train is already followed, if so, add the class input-secondary
    if (followedTrains.includes(button.innerText)) {
      button.classList.add("input-secondary");
    }
    // add event listener to the button
    button.addEventListener("click", async function() {
      // toggle class input-secondary
      this.classList.toggle("input-secondary");
      const trainCode = this.innerText;
      // request permission to show notifications
      const result = await window.Notification.requestPermission();
      if (result === "granted") {
        /* await registered_worker.showNotification(`Following train ${trainCode}`, {
          body: "You'll be notified of any change in the train status",
        }); */
        // subscribe to the push manager
        const subscription = await registered_worker.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array("BHd0dgoNBWciAkXAMPI3MiqGLvcuwg06dELYKLaMiNZd-yIB4fVLpJG90lIf6kiT3Bi3vZGZ7_R7eV5M28cHn2U")
        });
        let followedTrains = followTrain(trainCode, trainsData);
        let get_info = {stazione: params.get("stazione"), arrivi: params.get("arrivi")};
        let post_data = JSON.stringify({subscription,followedTrains, get_info})
        console.log(post_data)
        // notify the server of the new subscription
        await fetch("/webpush", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: post_data,
        });
      }
    });
  }
}