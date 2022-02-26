import React from 'react';
import { useSelector } from 'react-redux';

// Local Import
import PageHeader from '@/components/pageHeader';

const ProfilePage = () => {
  const user = useSelector((state) => state.accountReducer.user);

  return (
    <PageHeader title={user.name} />
  );
};

export default ProfilePage;
