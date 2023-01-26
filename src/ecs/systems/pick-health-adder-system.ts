import { GFECSUpdate, PickHealthAdder } from '@/green-field';
import { U16 } from '@/oidlib';
import { Sprite, System } from '@/void';

export interface PickHealthAdderSet {
  health: U16;
  pickHealthAdder: PickHealthAdder;
  sprite: Sprite;
}

export class PickHealthAdderSystem
  implements System<PickHealthAdderSet, GFECSUpdate> {
  query = new Set(['health', 'pickHealthAdder', 'sprite'] as const);

  skip(update: GFECSUpdate): boolean {
    return update.pickHandled || !update.input.isOnStart('Action');
  }

  updateEnt(set: PickHealthAdderSet, update: GFECSUpdate): void {
    if (update.pickHandled) return;
    if (set.health == 0) return;

    if (!update.cursor.intersectsSprite(set.sprite, update.time)) return;

    set.health = U16.trunc(set.health + set.pickHealthAdder.delta);

    // to-do: health system
    // to-do: ability to delete component here
    // if (set.health == 0)
    set.sprite.animate(update.time, update.filmByID.BeeDead);

    update.pickHandled = true;
  }
}
