import { FPSSet, PickHealthAdderSet, SpawnerSet } from '@/green-field'
import { ComponentSet, Sprite } from '@/void'

export interface GFComponentSet
  extends ComponentSet, PickHealthAdderSet, SpawnerSet, FPSSet {
  sprites: [Sprite, ...Sprite[]]
}
