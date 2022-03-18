const sass = require('sass')
const postcss = require('postcss')
const i18n = require('eleventy-plugin-i18n');
const autoprefixer = require('autoprefixer')
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const fs = require('fs-extra')
const path = require('path')
const purgeCssPlugin = require('eleventy-plugin-purgecss')
const selectorReplace = require('postcss-replace')
const merge = require('deepmerge')
const rollup = require('rollup')
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const dateFns = require('date-fns')
const { idLocale } = require('date-fns/locale/id')
const pluginTOC = require('eleventy-plugin-toc')
const markdownIt = require('markdown-it')
const markdownItAnchor = require('markdown-it-anchor')
const criticalCss = require("eleventy-critical-css");

module.exports = (eleventyConfig) => {
  eleventyConfig.setUseGitIgnore(false)
  eleventyConfig.addPassthroughCopy({ './src/_assets': 'assets' });
  eleventyConfig.addPassthroughCopy({ './src/_public': 'public' });
  eleventyConfig.addWatchTarget('./src/_style');
  eleventyConfig.addWatchTarget('./src/_script');
  eleventyConfig.setLibrary(
    'md',
    markdownIt({
      html: true
    }).use(markdownItAnchor)
  )

  eleventyConfig.on('beforeBuild', () => {
    processSass('./src/_style/index.scss')
  })

  eleventyConfig.on('beforeBuild', async () => await processJs('./src/_script/index'))

  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  if (process.env.NODE_ENV === "production") {
    eleventyConfig.addPlugin(purgeCssPlugin)
  }
  
  eleventyConfig.addPlugin(i18n, {
    translations: getLanguageDictionaries(),
    fallbackLocales: {
      '*': 'id'
    }
  });

  eleventyConfig.addPlugin(criticalCss);

  eleventyConfig.addPlugin(pluginTOC, {
    tags: ['h2'],
    wrapperClass: 'app-toc__nav'
  });

  eleventyConfig.addNunjucksFilter("formatDateEn", (date) => {
    return dateFns.format(new Date(date), "dd MMMM yyyy")
  });

  eleventyConfig.addNunjucksFilter("formatDateId", (date) => {
    return dateFns.format(new Date(date), "dd MMMM yyyy", {
      locale: idLocale
    })
  });

  return {
    markdownTemplateEngine: 'njk',
    dir: {
      includes: '_includes',
      input: 'src',
      layouts: '_layouts',
      output: 'dist'
    }
  }
}

function processSass (cssPath) {
  console.log('compiling CSS')
  const { css } = sass.renderSync({
    file: cssPath,
    sourceMap: false
  }) 
  console.log('CSS compiled')
  
  console.log('Optimizing CSS')
  postcss([autoprefixer, selectorReplace({
    pattern: 'govuk-',
    data: {
      replaceAll: 'kbrinl-'
    }
  })])
    .process(css.toString(), { from: 'index.css', to: './dist/public/app.css' })
    .then(result => {
      fs.outputFileSync('./dist/public/app.css', result.css)
      console.log('css optimized')
    })
}


async function processJs (jsPath) {
  console.log('Compiling JS')
  const bundle = await rollup.rollup({
    input: jsPath,
    plugins: [nodeResolve()]
  }) 

  await bundle.write({
    name: 'App',
    format: 'umd',
    file: './dist/public/app.js',
  })
  await bundle.close()
  // fs.outputFileSync('./dist/public/app.js', output.code)
}

function compileLanguageDictionary (lang) {
  const basePath = './src/_data/i18n/' + lang + '/'
  const translationFiles = fs.readdirSync(basePath).map(file => ({
    name: path.parse(file).name, file
  }))
  const dictionaries = translationFiles.map(file => {
    const content = JSON.parse(fs.readFileSync(basePath + file.file))
    return {
      [file.name]: content
    }
  })
  return dictionaries.reduce((acc, current) => {
    return Object.assign(acc, current)
  }, {})
}

function addLanguageKey (dictionary, languageKey) {
  const keys = Object.keys(dictionary)
  return keys.reduce((acc, currentKey) => {
    const value = dictionary[currentKey] 
    if (typeof value === "object") {
      return Object.assign(acc, {
        [currentKey]: addLanguageKey(value, languageKey)
      })
    } else {
      return Object.assign(acc, {
        [currentKey]: {
          [languageKey]: value
        }
      })
    }
  }, {})
}

function getLanguageDictionary (lang) {
  const dictionary = compileLanguageDictionary(lang)
  return addLanguageKey(dictionary, lang)
}

function getLanguageDictionaries () {
  return merge(getLanguageDictionary('en'), getLanguageDictionary('id'))
}
