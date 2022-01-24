import TV from './tv';

const tv = new TV('10.0.2.221');

void (async function () {
  // await tv.on();
  // await tv.openBrowserKeyboard();
  await tv.rickRoll();
})();
