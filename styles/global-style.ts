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
  height: 70%;
`;

export const Space = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
