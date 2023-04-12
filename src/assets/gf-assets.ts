import { AtlasMeta } from '@/atlas-pack'
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
  const atlas = await loadImage('atlas.png')
  const atlasMeta = AtlasMeta.fromJSON<GFFilmID>(atlasJSON)
  const shaderLayout = parseShaderLayout(shaderLayoutConfig)
  return { atlas, atlasMeta, font: parseFont(memProp5x6), shaderLayout }
}
