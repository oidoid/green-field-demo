import { GFEnt, GFLayer, GFRunState } from '@/green-field'
import { I16, U16 } from '@/ooz'
import { QueryEnt, Sprite, System } from '@/void'

export type SpawnerEnt = QueryEnt<
  { spawner: Record<never, never>[] },
  typeof query
>

const query = 'spawner'

export class SpawnerSystem implements System<SpawnerEnt, GFEnt> {
  readonly query = query

  runEnt(ent: SpawnerEnt, state: GFRunState): void {
    if (ent.spawner.length >= 2048) return
    for (let i = 0; i < 4; i++) {
      const beeEnt = newBee(state)
      ent.spawner.push(state.ecs, beeEnt)
    }
  }
}

// to-do: can this be a template sprite inside of spawner?
function newBee(state: GFRunState): Partial<GFEnt> {
  const sprite = new Sprite(state.filmByID['bee--Fly'], GFLayer.Background, {
    x: I16.trunc(state.random() * 1024),
    y: I16.trunc(state.random() * 1024),
    time: state.time,
  })
  return state.ecs.addEnt({
    sprite,
    health: { health: U16(1) },
    pickHealthAdder: { delta: I16(-1) },
  })
}
