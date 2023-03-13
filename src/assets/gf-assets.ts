import { AtlasMeta } from '@/atlas-pack'
import { atlasJSON, GFFilmID } from '@/green-field'
import { memProp5x6 } from '@/mem'
import { I16 } from '@/ooz'
import {
  Assets,
  Font,
  FontParser,
  ImageLoader,
  shaderLayoutConfig,
  ShaderLayoutParser,
} from '@/void'

export interface GFAssets extends Assets<GFFilmID> {
  readonly font: Font
}

export namespace GFAssets {
  export async function load(): Promise<GFAssets> {
    const atlas = await ImageLoader.load('atlas.png')
    const atlasMeta = AtlasMeta.fromJSON<GFFilmID>(atlasJSON)
    const shaderLayout = ShaderLayoutParser.parse(shaderLayoutConfig)
    return {
      atlas,
      atlasMeta,
      font: FontParser.parse(memProp5x6, I16),
      shaderLayout,
    }
  }
}
