import { Atlas } from '@/atlas-pack'
import { GFFilmID, GFFilmIDs } from '@/green-field'
import { assertExists } from 'std/testing/asserts.ts'
import atlasJSON from '../../assets/atlas.json' assert { type: 'json' }

Deno.test('Atlas and FilmIDs are aligned.', () => {
  const atlas = atlasJSON as unknown as Atlas<GFFilmID>
  for (const id of GFFilmIDs) {
    assertExists(atlas.filmByID[id], `Atlas missing ${id} FilmID.`)
  }
  for (const id of Object.keys(atlas.filmByID)) {
    assertExists(GFFilmIDs.has(id as GFFilmID), `FilmID missing ${id}.`)
  }
})
