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

  async rickRoll(): Promise<void> {
    await this.browser();
    await this.exit();
    await this.down();
    await this.up(100);
    await this.ok();

    // Delete everything in text field
    await this.left();
    await this.down(2);
    await this.ok(100);

    // y
    await this.left(4);
    await this.up(2);
    await this.ok();

    // o
    await this.right(3);
    await this.ok();

    // u
    await this.left(2);
    await this.ok();

    // t
    await this.left(2);
    await this.ok();

    // u
    await this.right(2);
    await this.ok();

    // b
    await this.down(2);
    await this.left();
    await this.ok();

    // e
    await this.up(2);
    await this.left(3);
    await this.ok();

    // .
    await this.left(4);
    await this.down(2);
    await this.ok();

    // c
    await this.right(5);
    await this.ok();

    // o
    await this.right(5);
    await this.up(2);
    await this.ok();

    // m
    await this.down(2);
    await this.left(1);
    await this.ok();

    // /
    await this.right(3);
    await this.down();
    await this.ok();
    await this.up(2);
    await this.left();
    await this.ok();
    await this.right();
    await this.down(2);
    await this.ok();

    // w
    await this.up(3);
    await this.right();
    await this.ok();

    // a
    await this.left();
    await this.down();
    await this.ok();

    // t
    await this.right(4);
    await this.up();
    await this.ok();

    // c
    await this.down(2);
    await this.left();
    await this.ok();

    // h
    await this.right(2);
    await this.up();
    await this.ok();

    // ?
    await this.left(5);
    await this.down(2);
    await this.ok();
    await this.up();
    await this.left(3);
    await this.ok();
    await this.right(3);
    await this.down();
    await this.ok();

    // v
    await this.up();
    await this.right(4);
    await this.ok();

    // =
    await this.left(4);
    await this.down();
    await this.ok();
    await this.up();
    await this.ok();
    await this.left(4);
    await this.up();
    await this.ok();
    await this.right(4);
    await this.down(2);
    await this.ok();

    // d
    await this.up(2);
    await this.right(2);
    await this.ok();

    // Q
    await this.left(2);
    await this.down();
    await this.ok();
    await this.up(2);
    await this.ok();

    // w
    await this.right();
    await this.ok();

    // 4
    await this.sendIRCC('Num4');

    // w
    await this.ok();

    // 9
    await this.sendIRCC('Num9');

    // W
    await this.left();
    await this.down(2);
    await this.ok();
    await this.right();
    await this.up(2);
    await this.ok();

    // g
    await this.right(3);
    await this.down(1);
    await this.ok();

    // X
    await this.left(4);
    await this.down();
    await this.ok();
    await this.right(2);
    await this.ok();

    // c
    await this.right();
    await this.ok();

    // Q
    await this.left(3);
    await this.ok();
    await this.up(2);
    await this.ok();

    // Enter
    await this.left();
    await this.down(3);
    await this.ok();

    // Increase Volume
    await this.volumeDown(100);
    await this.volumeUp(20);
  }
}
