import { justLog } from '@justeat/just-log';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

import './specs/assessments.spec';
import './specs/error.spec';
import './specs/login.spec';
import './specs/logout.spec';
import './specs/navigation.spec';
import './specs/requirements.spec';
import './specs/status.spec';
import './specs/hygiene.spec';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

if (__karma__.config.logging)
{
	justLog.enable();
}
else
{
	justLog.disable();
}
