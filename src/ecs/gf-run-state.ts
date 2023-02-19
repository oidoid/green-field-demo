import { FilmByID } from '@/atlas-pack'
import { GFEnt, GFFilmID } from '@/green-field'
import { ECS, RunState, Sprite } from '@/void'

export interface GFRunState extends RunState<GFEnt> {
  readonly filmByID: FilmByID<GFFilmID>
  readonly cursor: Sprite
  readonly ecs: ECS<GFEnt>
}
