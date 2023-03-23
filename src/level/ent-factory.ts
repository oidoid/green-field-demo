import { GFEnt, GFLevelParser, level, SpriteFactory } from '@/green-field'
import { I16 } from '@/ooz'
import { Font } from '@/void'

export function* newLevelComponents(
  factory: SpriteFactory,
  font: Font<I16>,
): IterableIterator<Partial<GFEnt>> {
  yield* GFLevelParser.parse(factory, level, font)
}
