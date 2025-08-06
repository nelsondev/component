/**
 * Style Manager - CSS and styling management
 */

export class StyleManager {
  async init(options = {}) {
    const { stylesheets = [], cssText = '', autoDetect = false } = options;
    
    let css = cssText;
    let imports = [...stylesheets];
    
    // Auto-detect existing stylesheets
    if (autoDetect) {
      const detected = this._detectExistingStyles();
      css = detected.css + '\n' + css;
      imports = [...detected.imports, ...imports];
    }
    
    // Add base component styles
    css += this._getBaseStyles();
    
    // Combine everything
    const finalCSS = this._combineStyles(imports, css);
    
    // Apply styles
    if (this._supportsAdoptedStyleSheets() && finalCSS) {
      try {
        const styleSheet = new CSSStyleSheet();
        await styleSheet.replace(finalCSS);
        window.__tronStyles__ = styleSheet;
      } catch (error) {
        window.__tronStyles__ = finalCSS;
      }
    } else {
      window.__tronStyles__ = finalCSS;
    }
    
    return this;
  }

  _detectExistingStyles() {
    const css = [];
    const imports = [];
    
    try {
      Array.from(document.styleSheets).forEach(sheet => {
        try {
          const rules = sheet.cssRules || sheet.rules;
          if (rules) {
            Array.from(rules).forEach(rule => {
              if (rule.cssText) css.push(rule.cssText);
            });
          }
        } catch (error) {
          // CORS or access issues - add as import
          if (sheet.href) imports.push(sheet.href);
        }
      });
    } catch (error) {
      // Ignore errors
    }
    
    return { css: css.join('\n'), imports };
  }

  _getBaseStyles() {
    return `
/* Tron Component Base Styles */
:host {
  display: block;
  box-sizing: border-box;
}

*, *::before, *::after {
  box-sizing: inherit;
}
`;
  }

  _combineStyles(imports, css) {
    const importStatements = imports.map(url => `@import url('${url}');`).join('\n');
    return imports.length > 0 ? `${importStatements}\n${css}` : css;
  }

  _supportsAdoptedStyleSheets() {
    return 'adoptedStyleSheets' in Document.prototype;
  }
}