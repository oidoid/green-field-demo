import { AtlasMeta } from '@/atlas-pack'
import { atlasJSON, GFFilmID } from '@/green-field'
import { memProp5x6 } from '@/mem'
import { I16 } from '@/ooz'
import {
  Font,
  FontParser,
  ImageLoader,
  ShaderLayout,
  shaderLayoutConfig,
  ShaderLayoutParser,
} from '@/void'

export interface Assets {
  readonly atlas: Readonly<HTMLImageElement>
  readonly atlasMeta: Readonly<AtlasMeta<GFFilmID>>
  readonly font: Font
  readonly shaderLayout: ShaderLayout
}

export namespace Assets {
  export async function load(): Promise<Assets> {
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
