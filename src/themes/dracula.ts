import type { PrismTheme } from "prism-react-renderer";

const dracula: PrismTheme = {
  plain: {
    color: "#f8f8f2",
    backgroundColor: "#282a36"
  },
  styles: [
    {
      types: ["comment", "prolog", "doctype", "cdata"],
      style: {
        color: "#6272a4"
      }
    },
    {
      types: ["punctuation"],
      style: {
        color: "#f8f8f2"
      }
    },
    {
      types: ["property", "tag", "constant", "symbol", "deleted"],
      style: {
        color: "#ff79c6"
      }
    },
    {
      types: ["boolean", "number"],
      style: {
        color: "#bd93f9"
      }
    },
    {
      types: ["selector", "attr-name", "string", "char", "builtin", "inserted"],
      style: {
        color: "#50fa7b"
      }
    },
    {
      types: ["operator", "entity", "url", "variable"],
      style: {
        color: "#f8f8f2"
      }
    },
    {
      types: ["atrule", "attr-value", "function", "class-name"],
      style: {
        color: "#f1fa8c"
      }
    },
    {
      types: ["keyword"],
      style: {
        color: "#8be9fd"
      }
    },
    {
      types: ["regex", "important"],
      style: {
        color: "#ffb86c"
      }
    },
    {
      types: ["important", "bold"],
      style: {
        fontWeight: "bold"
      }
    },
    {
      types: ["italic"],
      style: {
        fontStyle: "italic"
      }
    },
    {
      types: ["entity"],
      style: {
        cursor: "help"
      }
    }
  ]
};

export default dracula;
