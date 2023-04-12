import { GFEnt, GreenField } from '@/green-field'
import { XY } from '@/ooz'
import { QueryEnt, Sprite, System } from '@/void'

export type BeelineEnt = QueryEnt<
  { beeline: { speed: number; timeout: number }; sprite: Sprite; target: XY },
  typeof query
>

const query = 'beeline & sprite & target'

export class BeelineSystem implements System<BeelineEnt, GFEnt> {
  readonly query = query

  runEnt(ent: BeelineEnt, game: GreenField): void {
    if (ent.beeline.timeout < game.time) {
      ent.target.set(game.random() * 256, game.random() * 256).trunc()
      ent.sprite.flipX = ent.target.x < ent.sprite.x
      ent.beeline.timeout = game.time + 1_000 + game.random() * 5_000
      return
    }
    const diff = ent.target.copy().sub(ent.sprite.xy)
    const speed = ent.beeline.speed * game.tick / 1000
    ent.sprite.x += Math.abs(diff.x) < speed ? 0 : speed * Math.sign(diff.x)
    ent.sprite.y += Math.abs(diff.y) < speed ? 0 : speed * Math.sign(diff.y)
  }
}
