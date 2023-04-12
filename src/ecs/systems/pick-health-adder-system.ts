import { GFEnt, GreenField, Health, PickHealthAdder } from '@/green-field'
import { QueryEnt, Sprite, System } from '@/void'

export type PickHealthAdderEnt = QueryEnt<
  { health: Health; pickHealthAdder: PickHealthAdder; sprite: Sprite },
  typeof query
>

const query = 'health & pickHealthAdder & sprite'

export class PickHealthAdderSystem
  implements System<PickHealthAdderEnt, GFEnt> {
  readonly query = query

  run(ents: ReadonlySet<PickHealthAdderEnt>, game: GreenField): void {
    if (game.pickHandled || !game.input.isOnStart('Action')) return
    for (const ent of ents) {
      if (ent.health.points === 0) continue
      if (!game.intersectsCursor(ent.sprite)) continue

      ent.health.points += ent.pickHealthAdder.delta
      // to-do: health system
      // to-do: ability to delete component here
      // if (set.health === 0)
      ent.sprite.animate(game.time, game.filmByID['bee--Dead'])
      game.ecs.removeKeys(ent, 'beeline', 'pickHealthAdder')

      game.pickHandled = true
      return
    }
  }
}
