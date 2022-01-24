import KeyboardManager from './KeyboardManager';

require('isomorphic-fetch');

export default class TV {
  ip: string;
  backendURL: string;
  keyboard: KeyboardManager;

  constructor(ip: string) {
    this.ip = ip;
    this.backendURL = process.env.SONY_BACKEND_URL || 'http://localhost:3000';
    this.keyboard = new KeyboardManager(this);
  }

  sendIRCC(command: string, times?: number): Promise<Response[]> {
    const url = `${this.backendURL}/tv/${this.ip}`;
    const promises: Promise<Response>[] = [];
    if (!times) times = 1;
    for (let i = 0; i < times; i++) {
      promises.push(
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ command: command }),
        })
      );
    }
    return Promise.all(promises);
  }

  left(times?: number): Promise<Response[]> {
    return this.sendIRCC('Left', times);
  }

  right(times?: number): Promise<Response[]> {
    return this.sendIRCC('Right', times);
  }

  up(times?: number): Promise<Response[]> {
    return this.sendIRCC('Up', times);
  }

  down(times?: number): Promise<Response[]> {
    return this.sendIRCC('Down', times);
  }

  ok(times?: number): Promise<Response[]> {
    return this.sendIRCC('Confirm', times);
  }

  off(times?: number): Promise<Response[]> {
    return this.sendIRCC('PowerOff', times);
  }

  on(times?: number): Promise<Response[]> {
    return this.sendIRCC('WakeUp', times);
  }

  sleep(times?: number): Promise<Response[]> {
    return this.sendIRCC('Sleep', times);
  }

  volumeUp(times?: number): Promise<Response[]> {
    return this.sendIRCC('VolumeUp', times);
  }

  volumeDown(times?: number): Promise<Response[]> {
    return this.sendIRCC('VolumeDown', times);
  }

  exit(): Promise<Response[]> {
    return this.sendIRCC('Exit');
  }

  mute(): Promise<Response[]> {
    return this.sendIRCC('Mute');
  }

  home(): Promise<Response[]> {
    return this.sendIRCC('Home');
  }

  applicationLauncher(): Promise<Response[]> {
    return this.sendIRCC('ApplicationLauncher');
  }

  async resetApplicationLauncher(): Promise<void> {
    // Go left 5 times and up 2 times
    await this.left(5);
    await this.up(2);
  }

  async browser(): Promise<void> {
    // Go to home to make sure the applicationLauncher is not open
    await this.home();
    // Send applicationLauncher to open the app selection screen, then go right 5 times then 1 down. Then enter.
    await this.applicationLauncher();
    await this.resetApplicationLauncher();
    await this.right(5);
    await this.down();
    await this.ok();
  }

  async openBrowserKeyboard(): Promise<void> {
    await this.exit(); // Exit the keyboard if it is open

    await this.right(); // Incase keyboard wasn't opened
    await this.ok(); // we close the popup that was created

    await this.down(); // Exit the URL bar if it is focused
    await this.up(100); // Go to the top of the browser(which focuses url bar)
    await this.ok(); // Open the keyboard
  }

  async openURL(url: string): Promise<void> {
    await this.browser();
    await this.openBrowserKeyboard();
    await this.keyboard.clear();
    await this.keyboard.send(url);
    await this.keyboard.sendKey('Enter');
  }

  async rickRoll(): Promise<void> {
    await this.openURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

    // Increase Volume
    await this.volumeDown(100);
    // await this.volumeUp(50);
  }
}
