import TV from './tv';

export default class KeyboardManager {
  row: number;
  col: number;
  tv: TV;
  modifiers: string[];
  currentKeyboardIndex = 0;
  keyboard = [
    [
      ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
      ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ','],
      ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '.', 'Backspace'],
      ['Key1', 'Left', 'Right', ' ', ' ', ' ', '-', '_', 'Enter', 'Enter'],
    ],
    [
      ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
      ['@', '#', '$', '_', '&', '-', '+', '(', ')', '/'],
      ['Key2', '*', '"', "'", ':', ';', '!', '?', '%', 'Backspace'],
      ['Key0', 'Left', 'Right', ' ', ' ', ' ', '.', ',', 'Enter', 'Enter'],
    ],
    [
      ['~', '`', '|', '•', '√', 'π', '÷', '×', '¶', '∆'],
      ['£', '¢', '€', '¥', '^', '°', '=', '{', '}', '\\'],
      ['Key1', '%', '©', '®', '✓', '[', ']', '<', '>', 'Backspace'],
      ['Key0', 'Left', 'Right', ' ', ' ', ' ', '.', ',', 'Enter', 'Enter'],
    ],
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
    const [row, col, keyboard] = this.keyToRowCol(key);
    await this.setKeyboard(keyboard);
    if (key.toUpperCase() === key && keyboard === 0) await this.shift(); // if the letter is capital, shift
    await this.setCol(col); // horizontal first
    await this.setRow(row); // then vertical
    await this.tv.ok();
    if (row === 3) await this.setRow(2); // special keys are annoying to navigate, so we go back to the previous row
  }

  keyToRowCol(key: string): [number, number, number] {
    // Special cases first
    if (key === ' ') return [3, 3, this.currentKeyboardIndex];
    if (key === 'Backspace') return [2, 9, this.currentKeyboardIndex];
    if (key === 'Enter') return [3, 8, this.currentKeyboardIndex];
    if (key === 'Left') return [3, 1, this.currentKeyboardIndex];
    if (key === 'Right') return [3, 2, this.currentKeyboardIndex];
    if (key === 'Key0') return [3, 0, this.currentKeyboardIndex];
    if (key === 'Shift') return [2, 0, this.currentKeyboardIndex];

    // Then the regular keys
    let [row, col, keyboard] = [0, 0, 0];
    findLoop: for (const [keyI, curKeyboard] of this.keyboard.entries()) {
      for (const [rowI, curRow] of curKeyboard.entries()) {
        for (const [colI, curCol] of curRow.entries()) {
          if (curCol.toLowerCase() === key.toLowerCase()) {
            row = rowI;
            col = colI;
            keyboard = keyI;
            break findLoop;
          }
        }
      }
    }
    return [row, col, keyboard];
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

  async setKeyboard(index: number): Promise<void> {
    if (index === this.currentKeyboardIndex) return;
    await this.sendKey(`Key${index}`);
    this.currentKeyboardIndex = index;
  }

  async shift(): Promise<void> {
    await this.sendKey('Shift');
  }

  async clear(): Promise<void> {
    const [row, col] = this.keyToRowCol('Backspace');
    await this.setRow(row);
    await this.setCol(col);
    await this.tv.ok(100);
  }
}
