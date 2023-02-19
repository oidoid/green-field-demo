import { Immutable, Inverse, U8 } from '@/ooz'
import { Layer } from '@/void'

export const GFLayer = Immutable({
  ...Layer,
  Background: U8(0x02),
}) satisfies { [name: string]: U8 }

export type GFLayer = keyof typeof GFLayer

export const SPLayerInverse = Immutable(Inverse(GFLayer))
