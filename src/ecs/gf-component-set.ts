import { PickHealthAdderSet, SpawnerSet } from '@/green-field'
import { ComponentSet } from '@/void'

export interface GFComponentSet
  extends ComponentSet, PickHealthAdderSet, SpawnerSet {
}
