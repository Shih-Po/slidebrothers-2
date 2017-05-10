import { FlowRouter } from 'meteor/kadira:flow-router';
import React from 'react';
import { mount } from 'react-mounter';

import CasePage from '../../ui/CasePage.jsx';
import MainLayout from '../../ui/MainLayout.jsx';
import SearchPage from '../../ui/SearchPage.jsx';

FlowRouter.route('/', {
  action: () => {
    mount(MainLayout, {
      content: <SearchPage />,
    });
  },
});

FlowRouter.route('/case/:type/:_id', {
  name: 'case',
  action: (params) => {
    mount(MainLayout, {
      content: <CasePage _id={params._id} type={params.type} />,
    });
  },
});
