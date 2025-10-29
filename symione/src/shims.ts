// Lightweight browser shims for Node globals used by some libraries
// Keep minimal to avoid bundle bloat

// global
if (typeof (window as any).global === 'undefined') {
  (window as any).global = window as any;
}

// process
if (typeof (window as any).process === 'undefined') {
  (window as any).process = { env: {} } as any;
}

// Buffer (very minimal stub when only existence checks happen)
if (typeof (window as any).Buffer === 'undefined') {
  (window as any).Buffer = {
    from: (input: any) => Uint8Array.from(input as any),
    isBuffer: () => false,
  } as any;
}


