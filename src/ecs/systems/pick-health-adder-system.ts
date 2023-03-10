import { GFEnt, GFRunState, PickHealthAdder } from '@/green-field'
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

  run(ents: ReadonlySet<PickHealthAdderEnt>, state: GFRunState): void {
    if (state.pickHandled || !state.input.isOnStart('Action')) return
    for (const ent of ents) {
      if (state.pickHandled) continue
      if (ent.health.health == 0) continue
      if (!state.cursor.intersectsSprite(ent.sprite, state.time)) continue

      ent.health.health = U16.trunc(
        ent.health.health + ent.pickHealthAdder.delta,
      )

      // to-do: health system
      // to-do: ability to delete component here
      // if (set.health == 0)
      ent.sprite.animate(state.time, state.filmByID['bee--Dead'])

      state.pickHandled = true
    }
  }
}
