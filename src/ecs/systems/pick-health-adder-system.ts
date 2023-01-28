import { GFECSUpdate, PickHealthAdder } from '@/green-field'
import { U16 } from '@/oidlib'
import { Sprite, System } from '@/void'

export interface PickHealthAdderSet {
  health: U16
  pickHealthAdder: PickHealthAdder
  sprites: [Sprite, ...Sprite[]]
}

export class PickHealthAdderSystem
  implements System<PickHealthAdderSet, GFECSUpdate> {
  query = new Set(['health', 'pickHealthAdder', 'sprites'] as const)

  skip(update: GFECSUpdate): boolean {
    return update.pickHandled || !update.input.isOnStart('Action')
  }

  updateEnt(set: PickHealthAdderSet, update: GFECSUpdate): void {
    if (update.pickHandled) return
    if (set.health == 0) return

    if (!update.cursor.intersectsSprite(set.sprites[0], update.time)) return

    set.health = U16.trunc(set.health + set.pickHealthAdder.delta)

    // to-do: health system
    // to-do: ability to delete component here
    // if (set.health == 0)
    set.sprites[0].animate(update.time, update.filmByID.BeeDead)

    update.pickHandled = true
  }
}
