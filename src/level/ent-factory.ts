import { GFEnt, level, parseLevel, SpriteFactory } from '@/green-field'
import { Font } from '@/void'

export function* newLevelComponents(
  factory: SpriteFactory,
  font: Font,
): IterableIterator<Partial<GFEnt>> {
  yield* parseLevel(factory, level, font)
}
