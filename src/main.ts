import { ASTElement } from "vue-template-compiler";

export type MatcherType = string | string[] | RegExp;

export interface AttributeRemoverModule {
  preTransformNode: (AST: ASTElement) => ASTElement;
}

const createAttributeRemover = (
  matcher: MatcherType
): AttributeRemoverModule => {
  const testFn = getTestFunction(matcher);

  const preTransformNode = (AST: ASTElement) => {
    const { attrsList, attrsMap } = AST;

    const attrsToDelete = attrsList.filter(({ name }) => testFn(name));

    attrsToDelete.forEach(({ name: attrName }) => {
      if (attrsMap[attrName] !== undefined) {
        delete attrsMap[attrName];
      }

      const idx = attrsList.findIndex(({ name }) => attrName === name);

      attrsList.splice(idx, 1);
    });

    return AST;
  };

  return {
    preTransformNode
  };
};

type TestFunction = (name: string) => boolean;

const getTestFunction = (matcher: MatcherType): TestFunction => {
  if (typeof matcher === "string") {
    return name => name === matcher;
  } else if (matcher instanceof RegExp) {
    return matcher.test.bind(matcher);
  } else if (
    Array.isArray(matcher) &&
    matcher.every(matchValue => typeof matchValue === "string")
  ) {
    const set = new Set(matcher);
    return set.has.bind(set);
  }

  throw new Error(
    "Matcher must be a string, array of strings, or a regular expression"
  );
};

export default createAttributeRemover;
