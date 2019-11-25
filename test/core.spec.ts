import '@testing-library/jest-dom/extend-expect';
import createAttributeRemover, { AttributeRemoverModule } from '../src/main';
import { renderFixtureWithMatcher, getByTestId, getAllByTestId } from './utils';

describe('vue-remove-attributes', () => {
  describe('factory', () => {
    it('should accept a single string as a parameter', () => {
      let compilerModule: AttributeRemoverModule;

      expect(() => {
        compilerModule = createAttributeRemover('foobar')
      }).not.toThrow();

      expect(compilerModule.preTransformNode).toBeInstanceOf(Function);
    });

    it('should accept an array of strings as a parameter', () => {
      let compilerModule: AttributeRemoverModule;

      expect(() => {
        compilerModule = createAttributeRemover(['bar', 'baz'])
      }).not.toThrow();

      expect(compilerModule.preTransformNode).toBeInstanceOf(Function);
    });

    it('should accept a regular expression as a parameter', () => {
      let compilerModule: AttributeRemoverModule;

      expect(() => {
        compilerModule = createAttributeRemover(/foo/)
      }).not.toThrow();

      expect(compilerModule.preTransformNode).toBeInstanceOf(Function);
    });

    it('should not accept an invalid parameter', () => {
      const invalidValues = [
        undefined,
        null,
        true,
        1,
        ['foo', 1],
        {},
        () => {},
      ];

      invalidValues.forEach(value => {
        expect(() => {
          createAttributeRemover(value as any)
        }).toThrow();
      });
    });
  });

  describe('vue-template-compiler module', () => {
    it('should not prevent compilation', async () => {
      const { body } = await renderFixtureWithMatcher('Basic.vue', 'foo-bar');
  
      expect(body.innerHTML).toBe('<div> foobar </div>');
    });
  
    it('should strip attributes matching a string', async () => {
      const { body } = await renderFixtureWithMatcher('SingleElement.vue', 'foo-bar');

      const root = getByTestId(body, 'root');

      /* 
        <div data-testid="root" foo-baz foo-qux="foobar"> foobar </div>
      */
      expect(root).toHaveAttribute('foo-baz');
      expect(root).toHaveAttribute('foo-qux', 'foobar');
      expect(root).not.toHaveAttribute('foo-bar');
      expect(root).toHaveTextContent('foobar');
    });

    it('should strip attributes matching an element in an array of strings', async () => {
      const { body } = await renderFixtureWithMatcher('SingleElement.vue', ['foo-bar', 'foo-baz']);

      const root = getByTestId(body, 'root');
      
      /* 
        <div data-testid="root" foo-qux="foobar"> foobar </div>
      */
     expect(root).toHaveAttribute('foo-qux', 'foobar');
     expect(root).not.toHaveAttribute('foo-bar');
     expect(root).not.toHaveAttribute('foo-baz');
     expect(root).toHaveTextContent('foobar');
    });

    it('should strip attributes matching a regular expression', async () => {
      const { body } = await renderFixtureWithMatcher('SingleElement.vue', /foo\-(bar|qux)/);
      
      const root = getByTestId(body, 'root');

      /*
        <div data-testid="root" foo-baz> foobar </div>
      */
     expect(root).toHaveAttribute('foo-baz');
     expect(root).not.toHaveAttribute('foo-bar');
     expect(root).not.toHaveAttribute('foo-qux');
     expect(root).toHaveTextContent('foobar');
    });
  
    it('should strip attributes from nested nodes', async () => {
      const { body } = await renderFixtureWithMatcher('Nested.vue', 'foo-qux');
      
      const parent = getByTestId(body, 'parent');
      const child = getByTestId(body, 'child');
      
      /*
        <div data-testid="parent" foo-bar>
          <div data-testid="child" foo-baz> foobar </div>
        </div>
      */
      expect(parent).toHaveAttribute('foo-bar');
      expect(parent).not.toHaveAttribute('foo-qux');

      expect(child).toHaveAttribute('foo-baz');
      expect(child).not.toHaveAttribute('foo-qux');
      expect(child).toHaveTextContent('foobar');
    });

    it('should strip attributes on elements rendered with v-for', async () => {
      const { body } = await renderFixtureWithMatcher('VFor.vue', [':foo-bar', 'foo-baz']);
      
      const elements = getAllByTestId(body, 'item');
    
      /*
        <div>
          <div data-testid="item"> foobar </div>
          <div data-testid="item"> foobar </div>
          <div data-testid="item"> foobar </div>
        </div>
      */
      expect(elements.length).toBe(3);

      elements.forEach(element => {
        expect(element).toHaveAttribute('foo-qux');
        expect(element).not.toHaveAttribute('foo-bar');
        expect(element).not.toHaveAttribute('foo-baz');
        expect(element).toHaveTextContent('foobar');
      });
    });
  });
});