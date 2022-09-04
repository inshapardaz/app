import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

import Startup from '@/components/startup';

const PrivateRoute = ({
  layout, component, adminOnly, libraryWithPeriodicals, ...rest
}) => {
  const user = useSelector((state) => state.accountReducer.user);
  const library = useSelector((state) => state.libraryReducer.library);

  return (
    <Startup>
      <Route
        {...rest}
        render={(props) => {
          if (!user) {
            // not logged in so redirect to login page with the return url
            return <Redirect to={{ pathname: '/account/login', state: { from: props.location } }} />;
          }

          if (adminOnly && !user.isSuperAdmin) {
            // role not authorized so redirect to home page
            return <Redirect to={{ pathname: '/error/403' }} />;
          }

          if (libraryWithPeriodicals && library !== null && !library.supportsPeriodicals) {
            return <Redirect to={{ pathname: '/' }} />;
          }

          // authorized so return component
          return React.createElement(layout, props, React.createElement(component, props));
        }}
      />
    </Startup>
  );
};

PrivateRoute.defaultProps = {
  adminOnly: false,
  libraryWithPeriodicals: false,
};
PrivateRoute.propTypes = {
  layout: PropTypes.elementType.isRequired,
  component: PropTypes.elementType.isRequired,
  adminOnly: PropTypes.bool,
  libraryWithPeriodicals: PropTypes.bool,
};

export default PrivateRoute;
