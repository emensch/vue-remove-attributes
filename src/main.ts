import { ASTElement } from './types';

type MatcherType = string | string[] | RegExp;

const createAttributeRemover = (matcher: MatcherType) => {
  const preTransformNode = (AST: ASTElement) => {
    const { attrsList, attrsMap } = AST;

    const attrsToDelete = attrsList.filter(({ name }) => regex.test(name));

    attrsToDelete.forEach(({ name: attrName }) => {
      if (attrsMap[attrName] !== undefined) {
        delete attrsMap[attrName];
      }

      const idx = attrsList.findIndex(({ name }) => attrName === name);

      attrsList.splice(idx, 1);
    });

    return astElement;
  }
}