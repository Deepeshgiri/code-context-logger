type LanguageRules = {
    [language: string]: {
        function: string;
        class: string;
        method?: string;   // Optional
        struct?: string;   // Optional
        interface?: string; // Optional
        enum?: string;      // Optional
        tag?: string;       // Optional
        selector?: string;  // Optional
        media?: string;     // Optional (for CSS)
        impl?: string;      // Optional
    };
};

export const languageRules: LanguageRules = {
    "javascript": {
        "function": "(?:function\\s+(\\w+)\\s*\\(|(?:const|let|var)\\s+(\\w+)\\s*=\\s*(?:\\(.*\\)\\s*=>|\\(.*\\)\\s*=>\\s*\\{)|\\s+(\\w+)\\s*=\\s*async\\s*\\(.*\\)\\s*=>|\\w+\\s*=\\s*\\(.*\\)\\s*=>\\s*\\{)",
        "class": "class\\s+(\\w+)\\s*\\{",
        "method": "(\\w+)\\s*\\(([^)]*)\\)\\s*{"
    },
    "typescript": {
        "function": "(?:function\\s+(\\w+)\\s*\\(|(?:const|let|var)\\s+(\\w+)\\s*=\\s*(?:\\(.*\\)\\s*=>|\\(.*\\)\\s*=>\\s*\\{)|\\s+(\\w+)\\s*=\\s*async\\s*\\(.*\\)\\s*=>|\\w+\\s*=\\s*\\(.*\\)\\s*=>\\s*\\{)",
        "class": "class\\s+(\\w+)\\s*\\{",
        "method": "(\\w+)\\s*\\(([^)]*)\\)\\s*{"
    },
    "jsx": {
        "function": "(?:function\\s+(\\w+)\\s*\\(|(?:const|let|var)\\s+(\\w+)\\s*=\\s*(?:\\(.*\\)\\s*=>|\\(.*\\)\\s*=>\\s*\\{)|\\s+(\\w+)\\s*=\\s*async\\s*\\(.*\\)\\s*=>|\\w+\\s*=\\s*\\(.*\\)\\s*=>\\s*\\{)",
        "class": "class\\s+(\\w+)\\s*\\{",
        "method": "(\\w+)\\s*\\(([^)]*)\\)\\s*{"
    },
    "tsx": {
        "function": "(?:function\\s+(\\w+)\\s*\\(|(?:const|let|var)\\s+(\\w+)\\s*=\\s*(?:\\(.*\\)\\s*=>|\\(.*\\)\\s*=>\\s*\\{)|\\s+(\\w+)\\s*=\\s*async\\s*\\(.*\\)\\s*=>|\\w+\\s*=\\s*\\(.*\\)\\s*=>\\s*\\{)",
        "class": "class\\s+(\\w+)\\s*\\{",
        "method": "(\\w+)\\s*\\(([^)]*)\\)\\s*{"
    },
    "python": {
        "function": "def\\s+(\\w+)\\s*\\(|@\\w+\\s*\\n\\s*def\\s+(\\w+)\\s*\\(",
        "class": "class\\s+(\\w+)\\s*: ",
        "method": "def\\s+(\\w+)\\s*\\("
    },
    "java": {
        "function": "(?:public|private|protected)\\s+(?:static\\s+)?\\w+\\s+(\\w+)\\s*\\(",
        "method": "(?:public|private|protected)\\s+(?:static\\s+)?\\w+\\s+(\\w+)\\s*\\(",
        "class": "class\\s+(\\w+)\\s*\\{",
        "interface": "interface\\s+(\\w+)\\s*\\{",
        "enum": "enum\\s+(\\w+)\\s*\\{"
    },
    "html": {
        "function": "",
        "class": "",
        "tag": "<(\\w+)(\\s+[^>]*)?>"
    },
    "css": {
        "function": "",
        "class": "",
        "selector": "([.#]?[\\w-]+)\\s*\\{",
        "media": "@media\\s+([^\\{]+)\\s*\\{"
    },
    "rust": {
        "function": "fn\\s+(\\w+)\\s*\\(",
        "class": "",
        "struct": "struct\\s+(\\w+)\\s*\\{",
        "impl": "impl\\s+(\\w+)"
    },
    "cpp": {
        "function": "(?:\\w+\\s+)?(?:\\*|&)?\\s*(\\w+)\\s*\\(([^)]*)\\)\\s*(?:const)?\\s*\\{",
        "class": "class\\s+(\\w+)\\s*\\{",
        "struct": "struct\\s+(\\w+)\\s*\\{"
    },
    "c": {
        "function": "(?:\\w+\\s+)?(?:\\*|&)?\\s*(\\w+)\\s*\\(([^)]*)\\)\\s*\\{",
        "class": "",
        "struct": "struct\\s+(\\w+)\\s*\\{"
    },
    "go": {
        "function": "func\\s+(\\w+)\\s*\\(",
        "class": "",
        "struct": "type\\s+(\\w+)\\s+struct\\s*\\{"
    },
    "php": {
        "function": "function\\s+(\\w+)\\s*\\(",
        "class": "class\\s+(\\w+)\\s*\\{"
    },
    "ruby": {
        "function": "",
        "method": "def\\s+(\\w+)",
        "class": "class\\s+(\\w+)"
    },
    "swift": {
        "function": "func\\s+(\\w+)\\s*\\(",
        "class": "class\\s+(\\w+)\\s*\\{",
        "struct": "struct\\s+(\\w+)\\s*\\{",
        "enum": "enum\\s+(\\w+)\\s*\\{"
    },
    "kotlin": {
        "function": "fun\\s+(\\w+)\\s*\\(",
        "class": "class\\s+(\\w+)\\s*\\{"
    },
    "generic": {
        "function": "function\\s+(\\w+)\\s*\\(|\\w+\\s*\\(([^)]*)\\)\\s*\\{",
        "class": "class\\s+(\\w+)\\s*\\{",
        "struct": "struct\\s+(\\w+)\\s*\\{",
        "tag": "<(\\w+)\\s*[^>]*>",
        "selector": "([.#]?[\\w-]+)\\s*\\{"
    }
};
