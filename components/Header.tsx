import Link from 'next/link';
import React from 'react';
import { styled } from 'styled-components';
import SubLinks from '@/components/SubLinks';
import UserProfile from './UserProfile';

const Navigation = styled.nav`
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 5rem;
  border-bottom: 1px solid gray;
  position: sticky;
  top: 0;
  z-index: 999;
`;

const MainLink = styled(Link)`
  text-decoration: none;
  font-weight: 800;
  font-size: 2rem;
  color: black;
`;

const Header: React.FC = () => {
  return (
    <Navigation>
      <MainLink href="/">Lifusic</MainLink>
      <SubLinks />
      <UserProfile />
    </Navigation>
  );
};

export default Header;
