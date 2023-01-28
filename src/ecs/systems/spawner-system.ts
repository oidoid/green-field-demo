import { GFComponentSet, GFECSUpdate } from '@/green-field'
import { ECS, Sprite, System } from '@/void'
import { GFLayer } from '../../sprite/gf-layer.ts'

export interface SpawnerSet {
  spawner: Sprite[] // can his just be sprites?
}

export class SpawnerSystem implements System<SpawnerSet, GFECSUpdate> {
  query = new Set(['spawner'] as const)

  updateEnt(set: SpawnerSet, update: GFECSUpdate): void {
    if (set.spawner.length >= 60_000) return
    for (let i = 0; i < 5000; i++) {
      const ent = newBee(update)
      set.spawner.push(ent.sprites[0])
      ECS.addEnt(update.ecs, ent)
    }
  }
}

function newBee(update: GFECSUpdate): GFComponentSet {
  const sprite = new Sprite(update.filmByID.BeeFly, GFLayer.Background, {
    x: update.random.i32() % 1024,
    y: update.random.i32() % 1024,
  })
  sprite.animate(update.time) // to-do: move to API.
  return {
    sprites: [sprite],
    health: 1,
    pickHealthAdder: { delta: -1 },
  } as unknown as GFComponentSet
}
