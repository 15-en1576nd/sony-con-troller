require('isomorphic-fetch');

export default class TV {
  ip: string;
  backendURL: string;

  constructor(ip: string) {
    this.ip = ip;
    this.backendURL = process.env.SONY_BACKEND_URL || 'http://localhost:3000';
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
    return this.sendIRCC('Right');
  }

  up(times?: number): Promise<Response[]> {
    return this.sendIRCC('Up');
  }

  down(times?: number): Promise<Response[]> {
    return this.sendIRCC('Down');
  }

  ok(times?: number): Promise<Response[]> {
    return this.sendIRCC('Confirm');
  }

  off(times?: number): Promise<Response[]> {
    return this.sendIRCC('PowerOff');
  }

  on(times?: number): Promise<Response[]> {
    return this.sendIRCC('WakeUp');
  }

  sleep(times?: number): Promise<Response[]> {
    return this.sendIRCC('Sleep');
  }

  volumeUp(times?: number): Promise<Response[]> {
    return this.sendIRCC('VolumeUp');
  }

  volumeDown(times?: number): Promise<Response[]> {
    return this.sendIRCC('VolumeDown');
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
    await this.right();
    await this.right();
    await this.right();
    await this.right();
    await this.right();
    await this.down();
    await this.ok();
  }

  topOfScreen(): Promise<Response[]> {
    return this.up(30);
  }
}
