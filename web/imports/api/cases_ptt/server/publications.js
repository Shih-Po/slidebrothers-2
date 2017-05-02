import { Meteor } from 'meteor/meteor';

import CasesPtt from '../collections';

Meteor.publish('case_ptt', () => CasesPtt.find());
