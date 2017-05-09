import { FlowRouter } from 'meteor/kadira:flow-router';
import React from 'react';
import { mount } from 'react-mounter';

import MainLayout from '../../ui/MainLayout.jsx';
import SearchPage from '../../ui/SearchPage.jsx';

FlowRouter.route('/', {
  action: () => {
    mount(MainLayout, {
      content: <SearchPage />,
    });
  },
});

FlowRouter.route('/case/:_id', {
  name: 'case',
  action: (params) => {
    mount(MainLayout, {
      content: <CasePage _id={params._id} />
    });
  },
});
