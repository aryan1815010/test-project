import { useCallback, useRef, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Box, Image, Text, TextInput } from "grommet";
import { Search } from "grommet-icons";
import axios from "axios";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export default function NavSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestionOpen, setSuggestionOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const boxRef = useRef();
  const history = useHistory();
  const formatSuggestions = useCallback(
    (suggestedProducts) =>
      suggestedProducts.map(({ name, slug }, index, list) => ({
        label: (
          <Box
            direction="row"
            align="center"
            gap="small"
            border={index < list.length - 1 ? "bottom" : undefined}
            pad="small"
            responsive
          >
            <Image width="48px" src="/assets/Wilderpeople_Ricky.jpg" />
            <Text truncate>{name}</Text>
          </Box>
        ),
        value: slug,
      })),
    []
  );
  const onChange = useCallback(
    async (value) => {
      const res = await axios.get(
        "http://localhost:3001/searchproducts?q=" + value
      );
      setSuggestionOpen(true);
      setSuggestions(formatSuggestions(res.data));
    },
    [formatSuggestions]
  );
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  useEffect(() => {
    if (debouncedSearchTerm) {
      onChange(debouncedSearchTerm);
    } else {
      setSuggestionOpen(false);
      setSuggestions([]);
    }
  }, [onChange, debouncedSearchTerm]);

  const onSuggestionSelect = useCallback(
    (e) => history.push("/product/" + e.suggestion.value),
    [history]
  );

  return (
    <Box
      ref={boxRef}
      width="medium"
      direction="row"
      pad={{ horizontal: "small", vertical: "xsmall" }}
      elevation={suggestionOpen ? "medium" : undefined}
      border={{
        side: "all",
      }}
      background="brand"
      style={
        suggestionOpen
          ? {
              borderBottomLeftRadius: "0px",
              borderBottomRightRadius: "0px",
            }
          : undefined
      }
      responsive
    >
      <TextInput
        dropTarget={boxRef.current}
        placeholder="Quick Search..."
        icon={<Search />}
        plain
        suggestions={suggestions}
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
        onSuggestionSelect={onSuggestionSelect}
      />
    </Box>
  );
}
