import { AtlasMeta } from '@/atlas-pack'
import { GFFilmID, GFFilmIDs } from '@/green-field'
import { assertExists } from 'std/testing/asserts.ts'
import atlasJSON from '../../assets/atlas.json' assert { type: 'json' }

Deno.test('Atlas and FilmIDs are aligned.', () => {
  const atlasMeta = atlasJSON as unknown as AtlasMeta<GFFilmID>
  for (const id of GFFilmIDs) {
    assertExists(atlasMeta.filmByID[id], `Atlas missing ${id} FilmID.`)
  }
  for (const id of Object.keys(atlasMeta.filmByID)) {
    assertExists(GFFilmIDs.has(id as GFFilmID), `FilmID missing ${id}.`)
  }
})
