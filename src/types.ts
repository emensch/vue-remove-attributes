/*
  Subset of types converted from: 
  https://github.com/vuejs/vue/blob/dev/flow/compiler.js
*/

export interface ASTAttr {
  name: string;
  value: any;
  [key: string]: any;
};

export interface ASTElement {
  attrsList: Array<ASTAttr>;
  attrsMap: { [key: string]: any };
  [key: string]: any;
};