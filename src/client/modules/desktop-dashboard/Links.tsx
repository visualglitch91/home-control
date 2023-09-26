import { styled } from "@mui/joy";
import Paper from "../../components/Paper";
import config from "./config";

const LinksGrid = styled("ul")({
  margin: 0,
  padding: 26,
  listStyle: "none",
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gridGap: 50,

  "& li": { width: 90 },

  "& li a": {
    textDecoration: "none",
    color: "inherit",
    display: "block",
  },

  "& li img": {
    width: 90,
    height: 90,
    display: "block",
    margin: "0 auto 10px",
    borderRadius: 6,
    transition: "border-color 100ms linear",
    border: "2px solid transparent",
    boxSizing: "border-box",
    overflow: "hidden",
    boxShadow: "3px 3px 13px -6px rgba(14, 28, 42, 0.5)",
  },

  "& li span": {
    display: "block",
    overflow: "hidden",
    textOverflow: "ellipsis",
    color: "white",
    maxWidth: "100%",
    whiteSpace: "nowrap",
    fontSize: "12px",
    textAlign: "center",
    padding: "4px 8px",
    borderRadius: 8,
    transition: "text-shadow 100ms linear",
  },

  "& li a:hover img": {
    borderColor: "#bd206c",
    textShadow: "1px 1px 4px rgba(0, 0, 0, 0.7)",
  },
});

export default function Links() {
  return (
    <Paper>
      <LinksGrid>
        {config.links.map((link, index) => (
          <li key={index}>
            <a href={link.url} target="_parent">
              <img src={link.icon} />
              <span>{link.name}</span>
            </a>
          </li>
        ))}
      </LinksGrid>
    </Paper>
  );
}