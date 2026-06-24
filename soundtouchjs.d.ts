declare module "soundtouchjs" {
  // Tipos mínimos (la librería no trae .d.ts)
  export class SoundTouch {
    tempo: number;
    pitch: number;
    rate: number;
    clear(): void;
  }
  export class WebAudioBufferSource {
    constructor(buffer: AudioBuffer);
    position: number;
    extract(target: Float32Array, numFrames: number, position?: number): number;
  }
  export class SimpleFilter {
    constructor(source: unknown, pipe: unknown);
    position: number;
    sourcePosition: number;
    extract(target: Float32Array, numFrames: number): number;
    clear(): void;
    onEnd: (() => void) | null;
  }
  export class PitchShifter {}
  export function getWebAudioNode(...args: unknown[]): unknown;
}
