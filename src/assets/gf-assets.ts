import { Atlas } from '@/atlas-pack'
import { atlasJSON, GFFilmID } from '@/green-field'
import { memProp5x6 } from '@/mem'
import {
  Assets,
  Font,
  loadImage,
  parseFont,
  parseShaderLayout,
  shaderLayoutConfig,
} from '@/void'

export interface GFAssets extends Assets<GFFilmID> {
  readonly font: Font
}

export async function loadGFAssets(): Promise<GFAssets> {
  const atlas = Atlas.fromJSON<GFFilmID>(atlasJSON)
  const spritesheet = await loadImage('atlas.png')
  const shaderLayout = parseShaderLayout(shaderLayoutConfig)
  return { atlas, spritesheet, font: parseFont(memProp5x6), shaderLayout }
}
