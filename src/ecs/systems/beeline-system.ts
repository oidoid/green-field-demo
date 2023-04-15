import { GFEnt, GreenField } from '@/green-field'
import { XY } from '@/ooz'
import { QueryEnt, Sprite, System } from '@/void'

export type BeelineEnt = QueryEnt<
  {
    beeline: { speed: number; timeout: number }
    sprites: [Sprite, ...Sprite[]]
    target: XY
  },
  typeof query
>

const query = 'beeline & sprites & target'

export class BeelineSystem implements System<BeelineEnt, GFEnt> {
  readonly query = query

  runEnt(ent: BeelineEnt, game: GreenField): void {
    if (ent.beeline.timeout < game.time) {
      ent.target.set(game.random() * 256, game.random() * 256).trunc()
      ent.sprites[0].flipX = ent.sprites[0].x < ent.target.x
      ent.beeline.timeout = game.time + 1_000 + game.random() * 5_000
      return
    }
    const diff = ent.target.copy().sub(ent.sprites[0].bounds.xy)
    const speed = ent.beeline.speed * game.tick / 1000
    ent.sprites[0].x += Math.abs(diff.x) < speed ? 0 : speed * Math.sign(diff.x)
    ent.sprites[0].y += Math.abs(diff.y) < speed ? 0 : speed * Math.sign(diff.y)
  }
}
