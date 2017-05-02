import { Meteor } from 'meteor/meteor';

import Cases518 from '../collections';

Meteor.publish('case_518', () => Cases518.find());
