import { useCallback, useRef, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Box, Image, Text, TextInput } from "grommet";
import { Search } from "grommet-icons";
import axios from "axios";
import useDebounce from "../useDebounce";

export default function NavSearch({ openNotif }) {
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
      try {
        const res = await axios
          .get(process.env.REACT_APP_BACKEND + "searchproducts?q=" + value)
          .catch((err) => {
            throw err;
          });
        if (res) {
          setSuggestionOpen(true);
          setSuggestions(formatSuggestions(res.data));
        }
      } catch (err) {
        openNotif(err.message, "error");
      }
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
      background="background"
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
