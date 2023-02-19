import { FilmByID } from '@/atlas-pack'
import { GFFilmID, GFLayer } from '@/green-field'
import { U8 } from '@/ooz'
import { FilmLUT, Sprite, SpriteProps } from '@/void'

export class SpriteFactory implements FilmLUT {
  readonly #filmByID: FilmByID<GFFilmID>
  readonly layerByID: Readonly<{ [id in GFLayer]: U8 }> = GFLayer

  get filmByID(): FilmByID<GFFilmID> {
    return this.#filmByID
  }

  constructor(filmByID: FilmByID<GFFilmID>) {
    this.#filmByID = filmByID
  }

  new(filmID: GFFilmID, layer: GFLayer, props?: SpriteProps): Sprite {
    return new Sprite(this.#filmByID[filmID], GFLayer[layer], props)
  }
}
