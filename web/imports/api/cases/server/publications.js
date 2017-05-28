import { Meteor } from 'meteor/meteor';

import Cases from '../collections';

Meteor.publish('cases', () => Cases.find());
