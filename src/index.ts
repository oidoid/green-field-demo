import { GreenField } from '@/green-field'
import config from '../deno.json' assert { type: 'json' }

// [strings][version]
console.log(`Green Field v${config.version}
   ┌>°┐
by │  │idoid
   └──┘`)

const greenfield = await GreenField.new(window)
greenfield.start()
