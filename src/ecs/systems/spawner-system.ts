import { GFEnt, GFLayer, GreenField } from '@/green-field'
import { QueryEnt, Sprite, System } from '@/void'

export type SpawnerEnt = QueryEnt<
  { spawner: Record<never, never>[] },
  typeof query
>

const query = 'spawner'

export class SpawnerSystem implements System<SpawnerEnt, GFEnt> {
  readonly query = query

  runEnt(ent: SpawnerEnt, game: GreenField): void {
    while (ent.spawner.length < 200_000) {
      ent.spawner.push(game.ecs, spawnBee(game))
    }
  }
}

// to-do: can this be a template sprite inside of spawner?
function spawnBee(game: GreenField): Partial<GFEnt> {
  const sprite = new Sprite(game.filmByID['bee--Fly'], GFLayer.Background, {
    x: Math.trunc(game.random() * 4096),
    y: Math.trunc(game.random() * 4096),
    time: -Math.trunc(Math.random() * 1_000),
  })
  return game.ecs.addEnt({
    sprites: [sprite],
    health: { points: 1 },
    pickHealthAdder: { delta: -1 },
    target: sprite.bounds.xy.copy(),
    beeline: { speed: 1 + game.random() * 12, timeout: 0 },
  })
}
