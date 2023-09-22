import { createGlobalStyle, styled } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  body{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Arial', sans-serif;
  }

  div, ul, ol, li {
    padding: 0;
    margin: 0;
  }

  html, body, body > div {
    height: 100%;
  }
`;

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: calc(100% - 5rem);
  font-size: 1rem;
  width: 100%;
`;

export const Space = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
