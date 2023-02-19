import { GFEnt, GFLayer, GFRunState } from '@/green-field'
import { I16 } from '@/ooz'
import { QueryToEnt, Sprite, System } from '@/void'

export type SpawnerEnt = QueryToEnt<
  { sprites: Sprite[]; spawner: Record<never, never> },
  typeof query
>

const query = 'spawner & sprites'

export class SpawnerSystem implements System<SpawnerEnt, GFEnt> {
  readonly query = query

  runEnt(ent: SpawnerEnt, state: GFRunState): void {
    if (ent.sprites.length >= 2048) return
    for (let i = 0; i < 4; i++) {
      const beeEnt = newBee(state)
      ent.sprites.push(beeEnt.sprite)
      state.ecs.addEnt(beeEnt)
    }
  }
}

// to-do: can this be a template sprite inside of spawner?
function newBee(update: GFRunState): GFEnt {
  const sprite = new Sprite(update.filmByID.BeeFly, GFLayer.Background, {
    x: I16.trunc(update.random() * 1024), // to-do: Sprite API doesn't expose trunc behavior. i think this is ok
    y: I16.trunc(update.random() * 1024),
  })
  sprite.animate(update.time) // to-do: move to API.
  return {
    sprite,
    health: { health: 1 },
    pickHealthAdder: { delta: -1 },
  } as unknown as GFEnt
}
