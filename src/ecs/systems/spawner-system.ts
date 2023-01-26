import { GFComponentSet, GFECSUpdate } from '@/green-field'
import { ECS, Sprite, System } from '@/void'
import { GFLayer } from '../../sprite/gf-layer.ts'

export interface SpawnerSet {
  spawner: Sprite[]
}

export class SpawnerSystem implements System<SpawnerSet, GFECSUpdate> {
  query = new Set(['spawner'] as const)

  updateEnt(set: SpawnerSet, update: GFECSUpdate): void {
    if (set.spawner.length >= 100) return
    const ent = newBee(update)
    set.spawner.push(ent.sprite)
    ECS.addEnt(update.ecs, ent)
  }
}

function newBee(update: GFECSUpdate): GFComponentSet {
  const sprite = new Sprite(update.filmByID.BeeFly, GFLayer.Top, {
    x: update.random.i32() % 128,
    y: update.random.i32() % 128,
  })
  sprite.animate(update.time) // to-do: move to API.
  return {
    sprite,
    health: 1,
    pickHealthAdder: { delta: -1 },
  } as GFComponentSet
}
