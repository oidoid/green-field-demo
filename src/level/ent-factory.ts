import { GFEnt, GFLevelParser, level, SpriteFactory } from '@/green-field'
import { I16 } from '@/oidlib'
import { Font } from '@/void'

export function newLevelComponents(
  factory: SpriteFactory,
  font: Font<I16>,
): Partial<GFEnt>[] {
  // to-do: detect mobile platforms and hide cursor initially.
  // to-do: limit cursor movement to play area.

  // const tile = factory.filmByID.PaletteYellow // to-do: expose w and h?
  // // to-do: allow x and y in level cam config instead of xy
  // // this is slow as nuts :|

  // // to-do: the x and y instead of w and h kind of throws me even though i
  // // often want to use these types together. if i add a WH type, i'll need to
  // // add at least a toXY() and toWH() helper
  // for (let x = -minViewport.x; x < 2 * minViewport.x; x += tile.wh.x) {
  //   for (let y = -minViewport.y; y < 2 * minViewport.y; y += tile.wh.y) {
  //     background.push({
  //       sprite: new Sprite(tile, GFLayer.Background, { x, y }),
  //     } as GFComponentSet)
  //   }
  // }

  return [
    ...GFLevelParser.parse(factory, level, font),
  ]
}
