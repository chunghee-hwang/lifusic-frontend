import Link from 'next/link';
import React from 'react';
import { styled } from 'styled-components';
import SubLinks from '@/components/SubLinks';
import UserProfile from './UserProfile';

const Header: React.FC = () => {
  const Navigation = styled.nav`
    background: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 5rem;
    border-bottom: 1px solid gray;
  `;

  const MainLink = styled(Link)`
    text-decoration: none;
    font-weight: 800;
    font-size: 2rem;
    color: black;
  `;

  return (
    <Navigation>
      <MainLink href="/">Lifusic</MainLink>
      <SubLinks />
      <UserProfile />
    </Navigation>
  );
};

export default Header;
