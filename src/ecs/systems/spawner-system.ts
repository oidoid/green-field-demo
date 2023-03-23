import { GFEnt, GFLayer, GreenField } from '@/green-field'
import { I16, U16 } from '@/ooz'
import { QueryEnt, Sprite, System } from '@/void'

export type SpawnerEnt = QueryEnt<
  { spawner: Record<never, never>[] },
  typeof query
>

const query = 'spawner'

export class SpawnerSystem implements System<SpawnerEnt, GFEnt> {
  readonly query = query

  runEnt(ent: SpawnerEnt, game: GreenField): void {
    if (ent.spawner.length >= 600_000) return
    for (let i = 0; i < 50_000; i++) {
      ent.spawner.push(game.ecs, spawnBee(game))
    }
  }
}

// to-do: can this be a template sprite inside of spawner?
function spawnBee(game: GreenField): Partial<GFEnt> {
  const sprite = new Sprite(game.filmByID['bee--Fly'], GFLayer.Background, {
    x: I16.clamp(game.random() * 1024),
    y: I16.clamp(game.random() * 1024),
    time: game.time,
  })
  return game.ecs.addEnt({
    sprite,
    health: { health: U16(1) },
    pickHealthAdder: { delta: I16(-1) },
  })
}
