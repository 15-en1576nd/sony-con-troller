import TV from './tv';

export default class KeyboardManager {
  row: number;
  col: number;
  tv: TV;
  modifiers: string[];
  keyboard = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ','],
    ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '.', 'Backspace'],
    ['Special', 'Left', 'Right', ' ', ' ', ' ', '-', '_', 'Enter', 'Enter'],
  ];

  constructor(tv: TV) {
    this.row = 0;
    this.col = 0;
    this.modifiers = [];
    this.tv = tv;
  }

  async send(input: string): Promise<void> {
    const characters = input.split('');
    for (const char of characters) {
      await this.sendKey(char);
    }
  }

  reset(): void {
    this.row = 0;
    this.col = 0;
    this.modifiers = [];
  }

  async sendKey(key: string): Promise<void> {
    const [row, col] = this.keyToRowCol(key);
    await this.setCol(col);
    await this.setRow(row);
    await this.tv.ok();
  }

  keyToRowCol(key: string): [number, number] {
    let row = 0;
    let col = 0;
    for (let i = 0; i < this.keyboard.length; i++) {
      const rowKeys = this.keyboard[i];
      for (let j = 0; j < rowKeys.length; j++) {
        if (rowKeys[j] === key) {
          row = i;
          col = j;
          break;
        }
      }
    }
    return [row, col];
  }
  async setRow(row: number): Promise<void> {
    const diff = row - this.row;
    if (diff > 0) {
      await this.tv.down(diff);
    } else if (diff < 0) {
      await this.tv.up(-diff);
    }
    this.row = row;
  }

  async setCol(col: number): Promise<void> {
    const diff = col - this.col;
    if (diff > 0) {
      await this.tv.right(diff);
    } else if (diff < 0) {
      await this.tv.left(-diff);
    }
    this.col = col;
  }
}
