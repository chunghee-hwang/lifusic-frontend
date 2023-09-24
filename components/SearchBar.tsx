import { IconButton, InputBase, Paper } from '@mui/material';
import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
type SearchBarProps = {
  setKeyword: (keyword: string) => void;
  placeholder?: string;
};

const SearchBar: React.FC<SearchBarProps> = ({ setKeyword, placeholder }) => {
  const [keywordInInput, setKeywordInInput] = useState<string>('');
  return (
    <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
      onSubmit={(event) => {
        event.preventDefault();
        setKeyword(keywordInInput);
      }}
    >
      <InputBase
        sx={{ flex: 1 }}
        placeholder={placeholder || '검색...'}
        name="keyword"
        onChange={(event) => {
          setKeywordInInput(event.target.value);
        }}
        value={keywordInInput}
      />
      <IconButton
        type="button"
        sx={{ p: '10px' }}
        aria-label="search"
        onClick={() => {
          setKeyword(keywordInInput);
        }}
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

export default SearchBar;
