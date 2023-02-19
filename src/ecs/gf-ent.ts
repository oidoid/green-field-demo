import { PickHealthAdderEnt, SpawnerEnt } from '@/green-field'
import { VoidEnt } from '@/void'

export type GFEnt =
  & VoidEnt
  & Required<PickHealthAdderEnt>
  & Required<SpawnerEnt>
