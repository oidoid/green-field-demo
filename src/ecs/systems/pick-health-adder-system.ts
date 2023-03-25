import { GFEnt, GreenField, PickHealthAdder } from '@/green-field'
import { U16 } from '@/ooz'
import { QueryEnt, Sprite, System } from '@/void'

export type PickHealthAdderEnt = QueryEnt<
  { health: { health: U16 }; pickHealthAdder: PickHealthAdder; sprite: Sprite },
  typeof query
>

const query = 'health & pickHealthAdder & sprite'

export class PickHealthAdderSystem
  implements System<PickHealthAdderEnt, GFEnt> {
  readonly query = query

  run(ents: ReadonlySet<PickHealthAdderEnt>, game: GreenField): void {
    if (game.pickHandled || !game.input.isOnStart('Action')) return
    for (const ent of ents) {
      if (game.pickHandled) continue
      if (ent.health.health === 0) continue
      if (!game.cursor.intersectsSprite(ent.sprite, game.time)) continue

      ent.health.health = U16.clamp(
        ent.health.health + ent.pickHealthAdder.delta,
      )

      // to-do: health system
      // to-do: ability to delete component here
      // if (set.health === 0)
      ent.sprite.animate(game.time, game.filmByID['bee--Dead'])

      game.pickHandled = true
    }
  }
}
