import { Meteor } from 'meteor/meteor';

import CasePtt from '../collections';

Meteor.publish('case_ptt', () => CasePtt.find());
