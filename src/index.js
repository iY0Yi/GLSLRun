import key from 'keymaster'

import {Swizzles} from './swizzles'
import {print} from './print'
import {Editor} from './editor'
import {Commands} from './commands'

Swizzles.init()
Editor.init()

document.getElementById('btnRun').addEventListener('click', Commands.run)
key.filter = function(event){return true}
key('⌥+enter', Commands.run)
key.setScope('default')