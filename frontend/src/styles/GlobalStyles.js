import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  :root {
    --primary-color: #0077b6;
    --secondary-color: #00b4d8;
    --background-color: #f8f9fa;
    --text-color: #343a40;
    --border-radius: 8px;
  }

  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', sans-serif;
    background-color: var(--background-color);
    color: var(--text-color);
    transition: all 0.3s ease-in-out;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
  }

  /* Scrollbar */
  ::-webkit-scrollbar {
    /* width: 8px;
    height: 8px; */
    display: none;
  }

  ::-webkit-scrollbar-track {
    background: var(--color-bg-secondary);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--color-text-muted);
    border-radius: var(--radius-full);
    
    &:hover {
      background: var(--color-text-secondary);
    }
  }
`;
