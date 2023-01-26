import { AtlasMeta } from '@/atlas-pack'
import { GFFilmID } from '@/green-field'
import {
  ImageLoader,
  ShaderLayout,
  shaderLayoutConfig,
  ShaderLayoutParser,
} from '@/void'
import atlasJSON from '../../assets/atlas.json' assert { type: 'json' }

export interface Assets {
  readonly atlas: Readonly<HTMLImageElement>
  readonly atlasMeta: Readonly<AtlasMeta<GFFilmID>>
  readonly shaderLayout: ShaderLayout
}

export namespace Assets {
  export async function load(): Promise<Assets> {
    const atlas = await ImageLoader.load('atlas.png')
    const atlasMeta = AtlasMeta.fromJSON<GFFilmID>(atlasJSON)
    const shaderLayout = ShaderLayoutParser.parse(shaderLayoutConfig)
    return { atlas, atlasMeta, shaderLayout }
  }
}
