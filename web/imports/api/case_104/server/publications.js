import { Meteor } from 'meteor/meteor';

import Case104 from '../collections';

Meteor.publish('case_104', () => Case104.find());
