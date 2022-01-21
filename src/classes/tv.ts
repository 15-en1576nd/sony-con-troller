import fetch, { Response } from 'node-fetch';

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
      body: command,
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
    return this.sendIRCC('Enter');
  }
}
