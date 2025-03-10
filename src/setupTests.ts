import '@testing-library/jest-dom';

// Mock para window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock para MediaQueryList
class MockMediaQueryList {
  matches = false;
  media = '';
  onchange: ((this: MediaQueryList, ev: MediaQueryListEvent) => any) | null = null;
  
  constructor(media: string) {
    this.media = media;
  }
  
  addListener(listener: (this: MediaQueryList, ev: MediaQueryListEvent) => any): void {
    this.onchange = listener;
  }
  
  removeListener(): void {
    this.onchange = null;
  }
  
  addEventListener(type: string, listener: (this: MediaQueryList, ev: MediaQueryListEvent) => any): void {
    this.onchange = listener;
  }
  
  removeEventListener(): void {
    this.onchange = null;
  }
  
  dispatchEvent(): boolean {
    return true;
  }
}

// Substituir window.matchMedia
window.matchMedia = jest.fn().mockImplementation((query: string) => new MockMediaQueryList(query)); 