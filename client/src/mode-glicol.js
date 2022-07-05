// eslint-disable-next-line import/no-anonymous-default-export
export default {
  start: [
    {
      token: "comment",
      regex: "//$",
      next: "start",
    },
    {
      token: "invisible",
      regex: ">>|:",
    },
    {
      token: "comment",
      regex: "//",
      next: "singleLineComment",
    },
    {
      token: "variable.parameter", // compound note
      regex: "(((((_)+)?((~|&)[a-z])((_)+)?)+)|(_))(\\s|\\n|(~|&))?\\b",
    },
    {
      token: "support.constant",
      regex: ",",
    },
    {
      token: "meta.tag", // float
      regex: "[-+]?([0-9]{1,}[.][0-9]+)",
      // regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?(?:L|l|UL|ul|u|U|F|f|ll|LL|ull|ULL)?\\b"
    },
    {
      token: "constant.character",
      regex: "(((((_)+)?([0-9]+)((_)+)?)+)|(_))(\\s|\\n|~)?\\b",
    },
    {
      token: "support.type", // "\8n" now "everything"
      regex: "\\\\(([0-9]+)?([a-z]+)?(_)?([0-9]+)?)+\\b",
      // regex : "\\\\([0-9]{1,2})([a-z]+)\\b"
    },
    {
      token: "constant.character", // symbal?
      regex: "\\\\(([0-9]+)?([a-z]+)(_)?([0-9]+)?)+\\b",
    },
    {
      token: "string", // ref
      regex: "((~)([a-z]+(_)?)+)\\b",
    },
    {
      token: "keyword.control",
      regex: "spd|speed|seq|choose|euc",
    },
    {
      token: "storage.type",
      regex: `sin|saw|squ|imp|noiz|lpf|hpf|sampler|delayn|pha|buf|freeverb|apf|comb|delay|plate|onepole|allpass|sp`,
    },
    {
      token: "constant.language",
      regex: "envperc|linrange|mul|add|state|ramp|point|pan|mix|monosum|\\*",
    },
    {
      token: "audio",
      regex: "(([a-z]+(_)?)+)\\b",
    },
    {
      token: "text",
      regex: "\\\\s+",
    },
  ],

  singleLineComment: [
    {
      token: "comment",
      regex: /\\\\$/,
      next: "singleLineComment",
    },
    {
      token: "comment",
      regex: /$/,
      next: "start",
    },
    {
      defaultToken: "comment",
    },
  ],
};
