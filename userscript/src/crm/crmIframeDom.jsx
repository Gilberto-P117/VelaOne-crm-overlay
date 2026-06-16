// Generic iframe helper
export function getFirstIframeDocument() {
    const iframe = document.querySelector("iframe");
  
    return iframe?.contentDocument || iframe?.contentWindow?.document || null;
}

// Generic data-id-value reader
export function getDataIdValueFromDocument(rootDocument, selector) {
    const element = rootDocument?.querySelector(selector);
  
    return element?.dataset?.idValue || null;
}

// Generic helper for reading multiple fields from an iframe
export function getDataIdValuesFromIframe(fieldSelectors) {
    const iframeDocument = getFirstIframeDocument();
  
    return Object.entries(fieldSelectors).reduce((result, [key, selector]) => {
      result[key] = getDataIdValueFromDocument(iframeDocument, selector);
      return result;
    }, {});
};