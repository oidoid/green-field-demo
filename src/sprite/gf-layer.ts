import { Layer } from '@/void'

export const GFLayer = {
  ...Layer,
  Character: 0x3c,
  Scenery: 0x03d,
  Decal: 0x03e,
  Background: 0x3f,
} satisfies { [name: string]: number }

export type GFLayer = keyof typeof GFLayer
