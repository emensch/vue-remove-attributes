import webpack from 'webpack';
import VueLoaderPlugin from 'vue-loader/lib/plugin';
import MemoryFS from 'memory-fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import createAttributeRemover, { MatcherType } from '../src/main';

export const renderFixtureWithMatcher = (fixtureName: string, matcher: MatcherType): Promise<Document> => {
  const outputFile = 'test.output.js';
  const absoluteOutputFile = '/' + outputFile;

  const baseConfig: webpack.Configuration = {
    mode: 'production',
    output: {
      path: '/',
      filename: outputFile
    },
    entry: path.resolve(__dirname, './fixtures/entry.ts'),
    resolve: {
      alias: {
        '~component': path.resolve(__dirname, './fixtures', fixtureName)
      }
    },
    module: {
      rules: [{
        test: /\.vue$/,
        use: {
          loader: 'vue-loader',
          options: {
            compilerOptions: {
              modules: [
                createAttributeRemover(matcher)
              ]
            }
          }
        }
      }]
    },
    plugins: [
      new VueLoaderPlugin(),
    ]
  }

  const webpackCompiler = webpack(baseConfig);

  const mfs = new MemoryFS();
  webpackCompiler.outputFileSystem = mfs;
  
  return new Promise((resolve, reject) => {
    try {
      webpackCompiler.run((err, stats) => {
        if (err || stats.hasErrors()) {
          console.error('Failed webpack compilation!');
          console.log(stats.toString());
          reject(err);
        }

        const compiledOutput = mfs.readFileSync(absoluteOutputFile, 'utf8').toString();
      
        const { window } = new JSDOM(`<!DOCTYPE html><html><head></head><body></body></html>`, {
          runScripts: 'outside-only',
        });
    
        window.eval(compiledOutput);
        
        const { document } = window;

        resolve(document);
      });
    } catch(e) {
      reject(e);
    }
  });
};

export const getByTestId = (el: HTMLElement, id: string) => el.querySelector(`[data-testid="${id}"]`);
export const getAllByTestId = (el: HTMLElement, id: string) => el.querySelectorAll(`[data-testid="${id}"]`);