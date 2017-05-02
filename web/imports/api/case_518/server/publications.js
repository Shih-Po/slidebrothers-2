import { Meteor } from 'meteor/meteor';

import Case518 from '../collections';

Meteor.publish('case_518', () => Case518.find());
