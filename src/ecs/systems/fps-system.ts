import { FPS, GFECSUpdate, GFFilmID } from '@/green-field'
import { Uint } from '@/oidlib'
import { Sprite, System } from '@/void'

export interface FPSSet {
  fps: FPS
  sprites: [Sprite, ...Sprite[]]
}

export class FPSSystem implements System<FPSSet, GFECSUpdate> {
  query = new Set(['fps', 'sprites'] as const)

  updateEnt(set: FPSSet, update: GFECSUpdate): void {
    const now = performance.now()
    if ((now - set.fps.next.created) >= 1000) {
      set.fps.prev = set.fps.next.frames
      set.fps.next = { created: now, frames: Uint(0) }
    }
    set.fps.next.frames = Uint(set.fps.next.frames + 1)
    const digits = numToDigits(Uint.trunc(set.fps.prev))
    set.sprites[0].animate(update.time, update.filmByID[digits[0]])
    set.sprites[1]?.animate(update.time, update.filmByID[digits[1]])
    set.sprites[2]?.animate(update.time, update.filmByID[digits[2]])
  }
}

function numToDigits(num: Uint): [GFFilmID, GFFilmID, GFFilmID] {
  type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  const hundreds = Math.trunc(num / 100) % 10 as Digit
  const tens = Math.trunc(num / 10) % 10 as Digit
  const ones = Math.trunc(num / 1) % 10 as Digit
  return [
    `MemProp5x6-3${hundreds}`,
    `MemProp5x6-3${tens}`,
    `MemProp5x6-3${ones}`,
  ]
}
