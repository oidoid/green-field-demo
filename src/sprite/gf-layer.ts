import { Layer } from '@/void'

export const GFLayer = {
  ...Layer,
  Background: 0x02,
} satisfies { [name: string]: number }

export type GFLayer = keyof typeof GFLayer
