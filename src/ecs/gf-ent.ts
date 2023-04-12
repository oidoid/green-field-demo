import {
  BeelineEnt,
  PickHealthAdderEnt,
  SpawnerEnt,
  TargetEnt,
} from '@/green-field'
import { VoidEnt } from '@/void'

export type GFEnt =
  & VoidEnt
  & BeelineEnt
  & PickHealthAdderEnt
  & SpawnerEnt
  & TargetEnt
