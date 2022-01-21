require('isomorphic-fetch');

export default class TV {
  ip: string;
  backendURL: string;

  constructor(ip: string) {
    this.ip = ip;
    this.backendURL = process.env.SONY_BACKEND_URL || 'http://localhost:3000';
  }

  sendIRCC(command: string): Promise<Response> {
    const url = `${this.backendURL}/tv/${this.ip}`;
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ command: command }),
    });
  }

  left(): Promise<Response> {
    return this.sendIRCC('Left');
  }

  right(): Promise<Response> {
    return this.sendIRCC('Right');
  }

  up(): Promise<Response> {
    return this.sendIRCC('Up');
  }

  down(): Promise<Response> {
    return this.sendIRCC('Down');
  }

  ok(): Promise<Response> {
    return this.sendIRCC('Confirm');
  }

  off(): Promise<Response> {
    return this.sendIRCC('PowerOff');
  }

  on(): Promise<Response> {
    return this.sendIRCC('WakeUp');
  }

  sleep(): Promise<Response> {
    return this.sendIRCC('Sleep');
  }

  volumeUp(): Promise<Response> {
    return this.sendIRCC('VolumeUp');
  }

  volumeDown(): Promise<Response> {
    return this.sendIRCC('VolumeDown');
  }

  mute(): Promise<Response> {
    return this.sendIRCC('Mute');
  }

  home(): Promise<Response> {
    return this.sendIRCC('Home');
  }

  applicationLauncher(): Promise<Response> {
    return this.sendIRCC('ApplicationLauncher');
  }

  async resetApplicationLauncher(): Promise<void> {
    // Go left 5 times and up 2 times
    await this.left();
    await this.left();
    await this.left();
    await this.left();
    await this.left();
    await this.up();
    await this.up();
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
}
