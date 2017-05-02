import { Meteor } from 'meteor/meteor';

import Cases104 from '../collections';

Meteor.publish('case_104', () => Cases104.find());
