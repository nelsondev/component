/*!
 * Tron Component v1.0.0
 * Ultra-simple reactive web component library
 * (c) 2024 Nelson M
 * Released under the MIT License
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.TronComponent = {}));
})(this, (function (exports) { 'use strict';

  var DOCUMENT_FRAGMENT_NODE = 11;

  function morphAttrs(fromNode, toNode) {
      var toNodeAttrs = toNode.attributes;
      var attr;
      var attrName;
      var attrNamespaceURI;
      var attrValue;
      var fromValue;

      // document-fragments dont have attributes so lets not do anything
      if (toNode.nodeType === DOCUMENT_FRAGMENT_NODE || fromNode.nodeType === DOCUMENT_FRAGMENT_NODE) {
        return;
      }

      // update attributes on original DOM element
      for (var i = toNodeAttrs.length - 1; i >= 0; i--) {
          attr = toNodeAttrs[i];
          attrName = attr.name;
          attrNamespaceURI = attr.namespaceURI;
          attrValue = attr.value;

          if (attrNamespaceURI) {
              attrName = attr.localName || attrName;
              fromValue = fromNode.getAttributeNS(attrNamespaceURI, attrName);

              if (fromValue !== attrValue) {
                  if (attr.prefix === 'xmlns'){
                      attrName = attr.name; // It's not allowed to set an attribute with the XMLNS namespace without specifying the `xmlns` prefix
                  }
                  fromNode.setAttributeNS(attrNamespaceURI, attrName, attrValue);
              }
          } else {
              fromValue = fromNode.getAttribute(attrName);

              if (fromValue !== attrValue) {
                  fromNode.setAttribute(attrName, attrValue);
              }
          }
      }

      // Remove any extra attributes found on the original DOM element that
      // weren't found on the target element.
      var fromNodeAttrs = fromNode.attributes;

      for (var d = fromNodeAttrs.length - 1; d >= 0; d--) {
          attr = fromNodeAttrs[d];
          attrName = attr.name;
          attrNamespaceURI = attr.namespaceURI;

          if (attrNamespaceURI) {
              attrName = attr.localName || attrName;

              if (!toNode.hasAttributeNS(attrNamespaceURI, attrName)) {
                  fromNode.removeAttributeNS(attrNamespaceURI, attrName);
              }
          } else {
              if (!toNode.hasAttribute(attrName)) {
                  fromNode.removeAttribute(attrName);
              }
          }
      }
  }

  var range; // Create a range object for efficently rendering strings to elements.
  var NS_XHTML = 'http://www.w3.org/1999/xhtml';

  var doc = typeof document === 'undefined' ? undefined : document;
  var HAS_TEMPLATE_SUPPORT = !!doc && 'content' in doc.createElement('template');
  var HAS_RANGE_SUPPORT = !!doc && doc.createRange && 'createContextualFragment' in doc.createRange();

  function createFragmentFromTemplate(str) {
      var template = doc.createElement('template');
      template.innerHTML = str;
      return template.content.childNodes[0];
  }

  function createFragmentFromRange(str) {
      if (!range) {
          range = doc.createRange();
          range.selectNode(doc.body);
      }

      var fragment = range.createContextualFragment(str);
      return fragment.childNodes[0];
  }

  function createFragmentFromWrap(str) {
      var fragment = doc.createElement('body');
      fragment.innerHTML = str;
      return fragment.childNodes[0];
  }

  /**
   * This is about the same
   * var html = new DOMParser().parseFromString(str, 'text/html');
   * return html.body.firstChild;
   *
   * @method toElement
   * @param {String} str
   */
  function toElement(str) {
      str = str.trim();
      if (HAS_TEMPLATE_SUPPORT) {
        // avoid restrictions on content for things like `<tr><th>Hi</th></tr>` which
        // createContextualFragment doesn't support
        // <template> support not available in IE
        return createFragmentFromTemplate(str);
      } else if (HAS_RANGE_SUPPORT) {
        return createFragmentFromRange(str);
      }

      return createFragmentFromWrap(str);
  }

  /**
   * Returns true if two node's names are the same.
   *
   * NOTE: We don't bother checking `namespaceURI` because you will never find two HTML elements with the same
   *       nodeName and different namespace URIs.
   *
   * @param {Element} a
   * @param {Element} b The target element
   * @return {boolean}
   */
  function compareNodeNames(fromEl, toEl) {
      var fromNodeName = fromEl.nodeName;
      var toNodeName = toEl.nodeName;
      var fromCodeStart, toCodeStart;

      if (fromNodeName === toNodeName) {
          return true;
      }

      fromCodeStart = fromNodeName.charCodeAt(0);
      toCodeStart = toNodeName.charCodeAt(0);

      // If the target element is a virtual DOM node or SVG node then we may
      // need to normalize the tag name before comparing. Normal HTML elements that are
      // in the "http://www.w3.org/1999/xhtml"
      // are converted to upper case
      if (fromCodeStart <= 90 && toCodeStart >= 97) { // from is upper and to is lower
          return fromNodeName === toNodeName.toUpperCase();
      } else if (toCodeStart <= 90 && fromCodeStart >= 97) { // to is upper and from is lower
          return toNodeName === fromNodeName.toUpperCase();
      } else {
          return false;
      }
  }

  /**
   * Create an element, optionally with a known namespace URI.
   *
   * @param {string} name the element name, e.g. 'div' or 'svg'
   * @param {string} [namespaceURI] the element's namespace URI, i.e. the value of
   * its `xmlns` attribute or its inferred namespace.
   *
   * @return {Element}
   */
  function createElementNS(name, namespaceURI) {
      return !namespaceURI || namespaceURI === NS_XHTML ?
          doc.createElement(name) :
          doc.createElementNS(namespaceURI, name);
  }

  /**
   * Copies the children of one DOM element to another DOM element
   */
  function moveChildren(fromEl, toEl) {
      var curChild = fromEl.firstChild;
      while (curChild) {
          var nextChild = curChild.nextSibling;
          toEl.appendChild(curChild);
          curChild = nextChild;
      }
      return toEl;
  }

  function syncBooleanAttrProp(fromEl, toEl, name) {
      if (fromEl[name] !== toEl[name]) {
          fromEl[name] = toEl[name];
          if (fromEl[name]) {
              fromEl.setAttribute(name, '');
          } else {
              fromEl.removeAttribute(name);
          }
      }
  }

  var specialElHandlers = {
      OPTION: function(fromEl, toEl) {
          var parentNode = fromEl.parentNode;
          if (parentNode) {
              var parentName = parentNode.nodeName.toUpperCase();
              if (parentName === 'OPTGROUP') {
                  parentNode = parentNode.parentNode;
                  parentName = parentNode && parentNode.nodeName.toUpperCase();
              }
              if (parentName === 'SELECT' && !parentNode.hasAttribute('multiple')) {
                  if (fromEl.hasAttribute('selected') && !toEl.selected) {
                      // Workaround for MS Edge bug where the 'selected' attribute can only be
                      // removed if set to a non-empty value:
                      // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12087679/
                      fromEl.setAttribute('selected', 'selected');
                      fromEl.removeAttribute('selected');
                  }
                  // We have to reset select element's selectedIndex to -1, otherwise setting
                  // fromEl.selected using the syncBooleanAttrProp below has no effect.
                  // The correct selectedIndex will be set in the SELECT special handler below.
                  parentNode.selectedIndex = -1;
              }
          }
          syncBooleanAttrProp(fromEl, toEl, 'selected');
      },
      /**
       * The "value" attribute is special for the <input> element since it sets
       * the initial value. Changing the "value" attribute without changing the
       * "value" property will have no effect since it is only used to the set the
       * initial value.  Similar for the "checked" attribute, and "disabled".
       */
      INPUT: function(fromEl, toEl) {
          syncBooleanAttrProp(fromEl, toEl, 'checked');
          syncBooleanAttrProp(fromEl, toEl, 'disabled');

          if (fromEl.value !== toEl.value) {
              fromEl.value = toEl.value;
          }

          if (!toEl.hasAttribute('value')) {
              fromEl.removeAttribute('value');
          }
      },

      TEXTAREA: function(fromEl, toEl) {
          var newValue = toEl.value;
          if (fromEl.value !== newValue) {
              fromEl.value = newValue;
          }

          var firstChild = fromEl.firstChild;
          if (firstChild) {
              // Needed for IE. Apparently IE sets the placeholder as the
              // node value and vise versa. This ignores an empty update.
              var oldValue = firstChild.nodeValue;

              if (oldValue == newValue || (!newValue && oldValue == fromEl.placeholder)) {
                  return;
              }

              firstChild.nodeValue = newValue;
          }
      },
      SELECT: function(fromEl, toEl) {
          if (!toEl.hasAttribute('multiple')) {
              var selectedIndex = -1;
              var i = 0;
              // We have to loop through children of fromEl, not toEl since nodes can be moved
              // from toEl to fromEl directly when morphing.
              // At the time this special handler is invoked, all children have already been morphed
              // and appended to / removed from fromEl, so using fromEl here is safe and correct.
              var curChild = fromEl.firstChild;
              var optgroup;
              var nodeName;
              while(curChild) {
                  nodeName = curChild.nodeName && curChild.nodeName.toUpperCase();
                  if (nodeName === 'OPTGROUP') {
                      optgroup = curChild;
                      curChild = optgroup.firstChild;
                      // handle empty optgroups
                      if (!curChild) {
                          curChild = optgroup.nextSibling;
                          optgroup = null;
                      }
                  } else {
                      if (nodeName === 'OPTION') {
                          if (curChild.hasAttribute('selected')) {
                              selectedIndex = i;
                              break;
                          }
                          i++;
                      }
                      curChild = curChild.nextSibling;
                      if (!curChild && optgroup) {
                          curChild = optgroup.nextSibling;
                          optgroup = null;
                      }
                  }
              }

              fromEl.selectedIndex = selectedIndex;
          }
      }
  };

  var ELEMENT_NODE = 1;
  var DOCUMENT_FRAGMENT_NODE$1 = 11;
  var TEXT_NODE = 3;
  var COMMENT_NODE = 8;

  function noop() {}

  function defaultGetNodeKey(node) {
    if (node) {
      return (node.getAttribute && node.getAttribute('id')) || node.id;
    }
  }

  function morphdomFactory(morphAttrs) {

    return function morphdom(fromNode, toNode, options) {
      if (!options) {
        options = {};
      }

      if (typeof toNode === 'string') {
        if (fromNode.nodeName === '#document' || fromNode.nodeName === 'HTML' || fromNode.nodeName === 'BODY') {
          var toNodeHtml = toNode;
          toNode = doc.createElement('html');
          toNode.innerHTML = toNodeHtml;
        } else {
          toNode = toElement(toNode);
        }
      } else if (toNode.nodeType === DOCUMENT_FRAGMENT_NODE$1) {
        toNode = toNode.firstElementChild;
      }

      var getNodeKey = options.getNodeKey || defaultGetNodeKey;
      var onBeforeNodeAdded = options.onBeforeNodeAdded || noop;
      var onNodeAdded = options.onNodeAdded || noop;
      var onBeforeElUpdated = options.onBeforeElUpdated || noop;
      var onElUpdated = options.onElUpdated || noop;
      var onBeforeNodeDiscarded = options.onBeforeNodeDiscarded || noop;
      var onNodeDiscarded = options.onNodeDiscarded || noop;
      var onBeforeElChildrenUpdated = options.onBeforeElChildrenUpdated || noop;
      var skipFromChildren = options.skipFromChildren || noop;
      var addChild = options.addChild || function(parent, child){ return parent.appendChild(child); };
      var childrenOnly = options.childrenOnly === true;

      // This object is used as a lookup to quickly find all keyed elements in the original DOM tree.
      var fromNodesLookup = Object.create(null);
      var keyedRemovalList = [];

      function addKeyedRemoval(key) {
        keyedRemovalList.push(key);
      }

      function walkDiscardedChildNodes(node, skipKeyedNodes) {
        if (node.nodeType === ELEMENT_NODE) {
          var curChild = node.firstChild;
          while (curChild) {

            var key = undefined;

            if (skipKeyedNodes && (key = getNodeKey(curChild))) {
              // If we are skipping keyed nodes then we add the key
              // to a list so that it can be handled at the very end.
              addKeyedRemoval(key);
            } else {
              // Only report the node as discarded if it is not keyed. We do this because
              // at the end we loop through all keyed elements that were unmatched
              // and then discard them in one final pass.
              onNodeDiscarded(curChild);
              if (curChild.firstChild) {
                walkDiscardedChildNodes(curChild, skipKeyedNodes);
              }
            }

            curChild = curChild.nextSibling;
          }
        }
      }

      /**
      * Removes a DOM node out of the original DOM
      *
      * @param  {Node} node The node to remove
      * @param  {Node} parentNode The nodes parent
      * @param  {Boolean} skipKeyedNodes If true then elements with keys will be skipped and not discarded.
      * @return {undefined}
      */
      function removeNode(node, parentNode, skipKeyedNodes) {
        if (onBeforeNodeDiscarded(node) === false) {
          return;
        }

        if (parentNode) {
          parentNode.removeChild(node);
        }

        onNodeDiscarded(node);
        walkDiscardedChildNodes(node, skipKeyedNodes);
      }

      // // TreeWalker implementation is no faster, but keeping this around in case this changes in the future
      // function indexTree(root) {
      //     var treeWalker = document.createTreeWalker(
      //         root,
      //         NodeFilter.SHOW_ELEMENT);
      //
      //     var el;
      //     while((el = treeWalker.nextNode())) {
      //         var key = getNodeKey(el);
      //         if (key) {
      //             fromNodesLookup[key] = el;
      //         }
      //     }
      // }

      // // NodeIterator implementation is no faster, but keeping this around in case this changes in the future
      //
      // function indexTree(node) {
      //     var nodeIterator = document.createNodeIterator(node, NodeFilter.SHOW_ELEMENT);
      //     var el;
      //     while((el = nodeIterator.nextNode())) {
      //         var key = getNodeKey(el);
      //         if (key) {
      //             fromNodesLookup[key] = el;
      //         }
      //     }
      // }

      function indexTree(node) {
        if (node.nodeType === ELEMENT_NODE || node.nodeType === DOCUMENT_FRAGMENT_NODE$1) {
          var curChild = node.firstChild;
          while (curChild) {
            var key = getNodeKey(curChild);
            if (key) {
              fromNodesLookup[key] = curChild;
            }

            // Walk recursively
            indexTree(curChild);

            curChild = curChild.nextSibling;
          }
        }
      }

      indexTree(fromNode);

      function handleNodeAdded(el) {
        onNodeAdded(el);

        var curChild = el.firstChild;
        while (curChild) {
          var nextSibling = curChild.nextSibling;

          var key = getNodeKey(curChild);
          if (key) {
            var unmatchedFromEl = fromNodesLookup[key];
            // if we find a duplicate #id node in cache, replace `el` with cache value
            // and morph it to the child node.
            if (unmatchedFromEl && compareNodeNames(curChild, unmatchedFromEl)) {
              curChild.parentNode.replaceChild(unmatchedFromEl, curChild);
              morphEl(unmatchedFromEl, curChild);
            } else {
              handleNodeAdded(curChild);
            }
          } else {
            // recursively call for curChild and it's children to see if we find something in
            // fromNodesLookup
            handleNodeAdded(curChild);
          }

          curChild = nextSibling;
        }
      }

      function cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey) {
        // We have processed all of the "to nodes". If curFromNodeChild is
        // non-null then we still have some from nodes left over that need
        // to be removed
        while (curFromNodeChild) {
          var fromNextSibling = curFromNodeChild.nextSibling;
          if ((curFromNodeKey = getNodeKey(curFromNodeChild))) {
            // Since the node is keyed it might be matched up later so we defer
            // the actual removal to later
            addKeyedRemoval(curFromNodeKey);
          } else {
            // NOTE: we skip nested keyed nodes from being removed since there is
            //       still a chance they will be matched up later
            removeNode(curFromNodeChild, fromEl, true /* skip keyed nodes */);
          }
          curFromNodeChild = fromNextSibling;
        }
      }

      function morphEl(fromEl, toEl, childrenOnly) {
        var toElKey = getNodeKey(toEl);

        if (toElKey) {
          // If an element with an ID is being morphed then it will be in the final
          // DOM so clear it out of the saved elements collection
          delete fromNodesLookup[toElKey];
        }

        if (!childrenOnly) {
          // optional
          var beforeUpdateResult = onBeforeElUpdated(fromEl, toEl);
          if (beforeUpdateResult === false) {
            return;
          } else if (beforeUpdateResult instanceof HTMLElement) {
            fromEl = beforeUpdateResult;
            // reindex the new fromEl in case it's not in the same
            // tree as the original fromEl
            // (Phoenix LiveView sometimes returns a cloned tree,
            //  but keyed lookups would still point to the original tree)
            indexTree(fromEl);
          }

          // update attributes on original DOM element first
          morphAttrs(fromEl, toEl);
          // optional
          onElUpdated(fromEl);

          if (onBeforeElChildrenUpdated(fromEl, toEl) === false) {
            return;
          }
        }

        if (fromEl.nodeName !== 'TEXTAREA') {
          morphChildren(fromEl, toEl);
        } else {
          specialElHandlers.TEXTAREA(fromEl, toEl);
        }
      }

      function morphChildren(fromEl, toEl) {
        var skipFrom = skipFromChildren(fromEl, toEl);
        var curToNodeChild = toEl.firstChild;
        var curFromNodeChild = fromEl.firstChild;
        var curToNodeKey;
        var curFromNodeKey;

        var fromNextSibling;
        var toNextSibling;
        var matchingFromEl;

        // walk the children
        outer: while (curToNodeChild) {
          toNextSibling = curToNodeChild.nextSibling;
          curToNodeKey = getNodeKey(curToNodeChild);

          // walk the fromNode children all the way through
          while (!skipFrom && curFromNodeChild) {
            fromNextSibling = curFromNodeChild.nextSibling;

            if (curToNodeChild.isSameNode && curToNodeChild.isSameNode(curFromNodeChild)) {
              curToNodeChild = toNextSibling;
              curFromNodeChild = fromNextSibling;
              continue outer;
            }

            curFromNodeKey = getNodeKey(curFromNodeChild);

            var curFromNodeType = curFromNodeChild.nodeType;

            // this means if the curFromNodeChild doesnt have a match with the curToNodeChild
            var isCompatible = undefined;

            if (curFromNodeType === curToNodeChild.nodeType) {
              if (curFromNodeType === ELEMENT_NODE) {
                // Both nodes being compared are Element nodes

                if (curToNodeKey) {
                  // The target node has a key so we want to match it up with the correct element
                  // in the original DOM tree
                  if (curToNodeKey !== curFromNodeKey) {
                    // The current element in the original DOM tree does not have a matching key so
                    // let's check our lookup to see if there is a matching element in the original
                    // DOM tree
                    if ((matchingFromEl = fromNodesLookup[curToNodeKey])) {
                      if (fromNextSibling === matchingFromEl) {
                        // Special case for single element removals. To avoid removing the original
                        // DOM node out of the tree (since that can break CSS transitions, etc.),
                        // we will instead discard the current node and wait until the next
                        // iteration to properly match up the keyed target element with its matching
                        // element in the original tree
                        isCompatible = false;
                      } else {
                        // We found a matching keyed element somewhere in the original DOM tree.
                        // Let's move the original DOM node into the current position and morph
                        // it.

                        // NOTE: We use insertBefore instead of replaceChild because we want to go through
                        // the `removeNode()` function for the node that is being discarded so that
                        // all lifecycle hooks are correctly invoked
                        fromEl.insertBefore(matchingFromEl, curFromNodeChild);

                        // fromNextSibling = curFromNodeChild.nextSibling;

                        if (curFromNodeKey) {
                          // Since the node is keyed it might be matched up later so we defer
                          // the actual removal to later
                          addKeyedRemoval(curFromNodeKey);
                        } else {
                          // NOTE: we skip nested keyed nodes from being removed since there is
                          //       still a chance they will be matched up later
                          removeNode(curFromNodeChild, fromEl, true /* skip keyed nodes */);
                        }

                        curFromNodeChild = matchingFromEl;
                        curFromNodeKey = getNodeKey(curFromNodeChild);
                      }
                    } else {
                      // The nodes are not compatible since the "to" node has a key and there
                      // is no matching keyed node in the source tree
                      isCompatible = false;
                    }
                  }
                } else if (curFromNodeKey) {
                  // The original has a key
                  isCompatible = false;
                }

                isCompatible = isCompatible !== false && compareNodeNames(curFromNodeChild, curToNodeChild);
                if (isCompatible) {
                  // We found compatible DOM elements so transform
                  // the current "from" node to match the current
                  // target DOM node.
                  // MORPH
                  morphEl(curFromNodeChild, curToNodeChild);
                }

              } else if (curFromNodeType === TEXT_NODE || curFromNodeType == COMMENT_NODE) {
                // Both nodes being compared are Text or Comment nodes
                isCompatible = true;
                // Simply update nodeValue on the original node to
                // change the text value
                if (curFromNodeChild.nodeValue !== curToNodeChild.nodeValue) {
                  curFromNodeChild.nodeValue = curToNodeChild.nodeValue;
                }

              }
            }

            if (isCompatible) {
              // Advance both the "to" child and the "from" child since we found a match
              // Nothing else to do as we already recursively called morphChildren above
              curToNodeChild = toNextSibling;
              curFromNodeChild = fromNextSibling;
              continue outer;
            }

            // No compatible match so remove the old node from the DOM and continue trying to find a
            // match in the original DOM. However, we only do this if the from node is not keyed
            // since it is possible that a keyed node might match up with a node somewhere else in the
            // target tree and we don't want to discard it just yet since it still might find a
            // home in the final DOM tree. After everything is done we will remove any keyed nodes
            // that didn't find a home
            if (curFromNodeKey) {
              // Since the node is keyed it might be matched up later so we defer
              // the actual removal to later
              addKeyedRemoval(curFromNodeKey);
            } else {
              // NOTE: we skip nested keyed nodes from being removed since there is
              //       still a chance they will be matched up later
              removeNode(curFromNodeChild, fromEl, true /* skip keyed nodes */);
            }

            curFromNodeChild = fromNextSibling;
          } // END: while(curFromNodeChild) {}

          // If we got this far then we did not find a candidate match for
          // our "to node" and we exhausted all of the children "from"
          // nodes. Therefore, we will just append the current "to" node
          // to the end
          if (curToNodeKey && (matchingFromEl = fromNodesLookup[curToNodeKey]) && compareNodeNames(matchingFromEl, curToNodeChild)) {
            // MORPH
            if(!skipFrom){ addChild(fromEl, matchingFromEl); }
            morphEl(matchingFromEl, curToNodeChild);
          } else {
            var onBeforeNodeAddedResult = onBeforeNodeAdded(curToNodeChild);
            if (onBeforeNodeAddedResult !== false) {
              if (onBeforeNodeAddedResult) {
                curToNodeChild = onBeforeNodeAddedResult;
              }

              if (curToNodeChild.actualize) {
                curToNodeChild = curToNodeChild.actualize(fromEl.ownerDocument || doc);
              }
              addChild(fromEl, curToNodeChild);
              handleNodeAdded(curToNodeChild);
            }
          }

          curToNodeChild = toNextSibling;
          curFromNodeChild = fromNextSibling;
        }

        cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey);

        var specialElHandler = specialElHandlers[fromEl.nodeName];
        if (specialElHandler) {
          specialElHandler(fromEl, toEl);
        }
      } // END: morphChildren(...)

      var morphedNode = fromNode;
      var morphedNodeType = morphedNode.nodeType;
      var toNodeType = toNode.nodeType;

      if (!childrenOnly) {
        // Handle the case where we are given two DOM nodes that are not
        // compatible (e.g. <div> --> <span> or <div> --> TEXT)
        if (morphedNodeType === ELEMENT_NODE) {
          if (toNodeType === ELEMENT_NODE) {
            if (!compareNodeNames(fromNode, toNode)) {
              onNodeDiscarded(fromNode);
              morphedNode = moveChildren(fromNode, createElementNS(toNode.nodeName, toNode.namespaceURI));
            }
          } else {
            // Going from an element node to a text node
            morphedNode = toNode;
          }
        } else if (morphedNodeType === TEXT_NODE || morphedNodeType === COMMENT_NODE) { // Text or comment node
          if (toNodeType === morphedNodeType) {
            if (morphedNode.nodeValue !== toNode.nodeValue) {
              morphedNode.nodeValue = toNode.nodeValue;
            }

            return morphedNode;
          } else {
            // Text node to something else
            morphedNode = toNode;
          }
        }
      }

      if (morphedNode === toNode) {
        // The "to node" was not compatible with the "from node" so we had to
        // toss out the "from node" and use the "to node"
        onNodeDiscarded(fromNode);
      } else {
        if (toNode.isSameNode && toNode.isSameNode(morphedNode)) {
          return;
        }

        morphEl(morphedNode, toNode, childrenOnly);

        // We now need to loop over any keyed nodes that might need to be
        // removed. We only do the removal if we know that the keyed node
        // never found a match. When a keyed node is matched up we remove
        // it out of fromNodesLookup and we use fromNodesLookup to determine
        // if a keyed node has been matched up or not
        if (keyedRemovalList) {
          for (var i=0, len=keyedRemovalList.length; i<len; i++) {
            var elToRemove = fromNodesLookup[keyedRemovalList[i]];
            if (elToRemove) {
              removeNode(elToRemove, elToRemove.parentNode, false);
            }
          }
        }
      }

      if (!childrenOnly && morphedNode !== fromNode && fromNode.parentNode) {
        if (morphedNode.actualize) {
          morphedNode = morphedNode.actualize(fromNode.ownerDocument || doc);
        }
        // If we had to swap out the from node with a new node because the old
        // node was not compatible with the target node then we need to
        // replace the old DOM node in the original DOM tree. This is only
        // possible if the original DOM node was part of a DOM tree which
        // we know is the case if it has a parent node.
        fromNode.parentNode.replaceChild(morphedNode, fromNode);
      }

      return morphedNode;
    };
  }

  var morphdom = morphdomFactory(morphAttrs);

  const i=Symbol.for("preact-signals");function t(){if(r>1){r--;return}let i,t=false;while(void 0!==s){let o=s;s=void 0;f++;while(void 0!==o){const n=o.o;o.o=void 0;o.f&=-3;if(!(8&o.f)&&v(o))try{o.c();}catch(o){if(!t){i=o;t=true;}}o=n;}}f=0;r--;if(t)throw i}let n,s;function h(i){const t=n;n=void 0;try{return i()}finally{n=t;}}let r=0,f=0,e=0;function c(i){if(void 0===n)return;let t=i.n;if(void 0===t||t.t!==n){t={i:0,S:i,p:n.s,n:void 0,t:n,e:void 0,x:void 0,r:t};if(void 0!==n.s)n.s.n=t;n.s=t;i.n=t;if(32&n.f)i.S(t);return t}else if(-1===t.i){t.i=0;if(void 0!==t.n){t.n.p=t.p;if(void 0!==t.p)t.p.n=t.n;t.p=n.s;t.n=void 0;n.s.n=t;n.s=t;}return t}}function u(i,t){this.v=i;this.i=0;this.n=void 0;this.t=void 0;this.W=null==t?void 0:t.watched;this.Z=null==t?void 0:t.unwatched;}u.prototype.brand=i;u.prototype.h=function(){return  true};u.prototype.S=function(i){const t=this.t;if(t!==i&&void 0===i.e){i.x=t;this.t=i;if(void 0!==t)t.e=i;else h(()=>{var i;null==(i=this.W)||i.call(this);});}};u.prototype.U=function(i){if(void 0!==this.t){const t=i.e,o=i.x;if(void 0!==t){t.x=o;i.e=void 0;}if(void 0!==o){o.e=t;i.x=void 0;}if(i===this.t){this.t=o;if(void 0===o)h(()=>{var i;null==(i=this.Z)||i.call(this);});}}};u.prototype.subscribe=function(i){return E(()=>{const t=this.value,o=n;n=void 0;try{i(t);}finally{n=o;}})};u.prototype.valueOf=function(){return this.value};u.prototype.toString=function(){return this.value+""};u.prototype.toJSON=function(){return this.value};u.prototype.peek=function(){const i=n;n=void 0;try{return this.value}finally{n=i;}};Object.defineProperty(u.prototype,"value",{get(){const i=c(this);if(void 0!==i)i.i=this.i;return this.v},set(i){if(i!==this.v){if(f>100)throw new Error("Cycle detected");this.v=i;this.i++;e++;r++;try{for(let i=this.t;void 0!==i;i=i.x)i.t.N();}finally{t();}}}});function d(i,t){return new u(i,t)}function v(i){for(let t=i.s;void 0!==t;t=t.n)if(t.S.i!==t.i||!t.S.h()||t.S.i!==t.i)return  true;return  false}function l(i){for(let t=i.s;void 0!==t;t=t.n){const o=t.S.n;if(void 0!==o)t.r=o;t.S.n=t;t.i=-1;if(void 0===t.n){i.s=t;break}}}function y(i){let t,o=i.s;while(void 0!==o){const i=o.p;if(-1===o.i){o.S.U(o);if(void 0!==i)i.n=o.n;if(void 0!==o.n)o.n.p=i;}else t=o;o.S.n=o.r;if(void 0!==o.r)o.r=void 0;o=i;}i.s=t;}function a(i,t){u.call(this,void 0);this.x=i;this.s=void 0;this.g=e-1;this.f=4;this.W=null==t?void 0:t.watched;this.Z=null==t?void 0:t.unwatched;}a.prototype=new u;a.prototype.h=function(){this.f&=-3;if(1&this.f)return  false;if(32==(36&this.f))return  true;this.f&=-5;if(this.g===e)return  true;this.g=e;this.f|=1;if(this.i>0&&!v(this)){this.f&=-2;return  true}const i=n;try{l(this);n=this;const i=this.x();if(16&this.f||this.v!==i||0===this.i){this.v=i;this.f&=-17;this.i++;}}catch(i){this.v=i;this.f|=16;this.i++;}n=i;y(this);this.f&=-2;return  true};a.prototype.S=function(i){if(void 0===this.t){this.f|=36;for(let i=this.s;void 0!==i;i=i.n)i.S.S(i);}u.prototype.S.call(this,i);};a.prototype.U=function(i){if(void 0!==this.t){u.prototype.U.call(this,i);if(void 0===this.t){this.f&=-33;for(let i=this.s;void 0!==i;i=i.n)i.S.U(i);}}};a.prototype.N=function(){if(!(2&this.f)){this.f|=6;for(let i=this.t;void 0!==i;i=i.x)i.t.N();}};Object.defineProperty(a.prototype,"value",{get(){if(1&this.f)throw new Error("Cycle detected");const i=c(this);this.h();if(void 0!==i)i.i=this.i;if(16&this.f)throw this.v;return this.v}});function _(i){const o=i.u;i.u=void 0;if("function"==typeof o){r++;const s=n;n=void 0;try{o();}catch(t){i.f&=-2;i.f|=8;b(i);throw t}finally{n=s;t();}}}function b(i){for(let t=i.s;void 0!==t;t=t.n)t.S.U(t);i.x=void 0;i.s=void 0;_(i);}function g(i){if(n!==this)throw new Error("Out-of-order effect");y(this);n=i;this.f&=-2;if(8&this.f)b(this);t();}function p(i){this.x=i;this.u=void 0;this.s=void 0;this.o=void 0;this.f=32;}p.prototype.c=function(){const i=this.S();try{if(8&this.f)return;if(void 0===this.x)return;const t=this.x();if("function"==typeof t)this.u=t;}finally{i();}};p.prototype.S=function(){if(1&this.f)throw new Error("Cycle detected");this.f|=1;this.f&=-9;_(this);l(this);r++;const i=n;n=this;return g.bind(this,i)};p.prototype.N=function(){if(!(2&this.f)){this.f|=2;this.o=s;s=this;}};p.prototype.d=function(){this.f|=8;if(!(1&this.f))b(this);};p.prototype.dispose=function(){this.d();};function E(i){const t=new p(i);try{t.c();}catch(i){t.d();throw i}const o=t.d.bind(t);o[Symbol.dispose]=o;return o}

  /**
   * Reactive System - Using @preact/signals under the hood
   */


  function createReactive(component, initialValue) {
    const reactive = d(initialValue);
    
    // Add your API methods
    reactive.valueOf = function() { return this.value; };
    reactive.toString = function() { return String(this.value); };
    
    // Auto-update component when value changes
    E(() => {
      reactive.value; // Subscribe to changes
      if (component.isConnected) {
        component._scheduleUpdate();
      }
    });
    
    component._reactives.set(reactive, true);
    return reactive;
  }

  function createReactiveArray(component, initialValue) {
    const reactive = d([...initialValue]);
    
    // Add render method for templates
    reactive.render = function(template) {
      return this.value.map((item, index) => 
        typeof template === 'function' ? template(item, index) : template
      ).join('');
    };
    
    // Override array methods to work with signals
    const arrayMethods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
    
    arrayMethods.forEach(method => {
      reactive[method] = function(...args) {
        const newArray = [...this.value];
        const result = newArray[method](...args);
        this.value = newArray;
        return result;
      };
    });
    
    // Auto-update component when array changes
    E(() => {
      reactive.value; // Subscribe to changes
      if (component.isConnected) {
        component._scheduleUpdate();
      }
    });
    
    component._reactives.set(reactive, true);
    return reactive;
  }

  /**
   * Props System - Component property management
   */

  function camelToKebab(str) {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  }

  function convertValue(value, type) {
    if (value == null) return value;
    
    switch (type) {
      case Boolean:
        return value === 'true' || value === true || value === '';
      case Number:
        const num = Number(value);
        return isNaN(num) ? 0 : num;
      case Array:
      case Object:
        if (typeof value === 'string') {
          try {
            return JSON.parse(value);
          } catch {
            return type === Array ? [] : {};
          }
        }
        return value;
      default:
        return String(value);
    }
  }

  function createProps(component, propList) {
    const properties = {};
    const proxy = {};
    
    // Process prop definitions
    propList.forEach(prop => {
      const config = typeof prop === 'string' 
        ? { name: prop, type: String, default: '' }
        : { type: String, default: '', ...prop };
      
      properties[config.name] = config;
    });
    
    // Set up component metadata for attribute observation
    component.constructor.properties = properties;
    component.constructor.observedAttributes = Object.keys(properties).map(camelToKebab);
    
    // Create proxy for props access
    Object.keys(properties).forEach(name => {
      const config = properties[name];
      const kebabName = camelToKebab(name);
      
      Object.defineProperty(proxy, name, {
        get() {
          const attrValue = component.getAttribute(kebabName);
          const value = attrValue !== null 
            ? convertValue(attrValue, config.type)
            : config.default;
          
          if (config.required && value == null) {
            console.warn(`Required prop '${name}' is missing on ${component.tagName}`);
          }
          
          if (config.validator && !config.validator(value)) {
            console.warn(`Invalid prop '${name}' value:`, value);
          }
          
          return value;
        },
        
        set(value) {
          if (config.validator && !config.validator(value)) {
            console.warn(`Invalid prop '${name}' value:`, value);
            return;
          }
          
          const convertedValue = convertValue(value, config.type);
          component.setAttribute(kebabName, convertedValue);
        }
      });
    });
    
    component._props = proxy;
    return proxy;
  }

  /**
   * Component Context - API methods available to components
   */


  function createContext(component) {
    return {
      /**
       * Create reactive state
       */
      react(value) {
        return Array.isArray(value) 
          ? createReactiveArray(component, value)
          : createReactive(component, value);
      },

      /**
       * Reference to the component element
       */
      element: component,

      /**
       * Create event handlers
       */
      event(handler, methodName = null) {
        const name = methodName || `_evt${component._eventCounter++}`;
        
        component[name] = (...args) => handler(...args);
        
        // Smart event binding based on handler signature
        const handlerStr = handler.toString();
        const hasParams = /^\s*\(\s*[^)]+\s*\)/.test(handlerStr);
        
        if (!hasParams) {
          return `this.getRootNode().host.${name}()`;
        }
        
        const hasMultipleParams = handlerStr.includes(',');
        if (hasMultipleParams) {
          return `this.getRootNode().host.${name}(event)`;
        }
        
        return `(function(e){e.preventDefault();this.getRootNode().host.${name}(e)}).call(this,event)`;
      },

      /**
       * Define component properties
       */
      props(propList) {
        return createProps(component, propList);
      },

      /**
       * Create computed properties
       */
      computed(fn) {
        const computed = {
          _fn: fn,
          _cache: null,
          _dirty: true,
          get value() {
            if (this._dirty) {
              this._cache = this._fn();
              this._dirty = false;
            }
            return this._cache;
          }
        };

        // Auto-invalidate when reactives change
        const originalSchedule = component._scheduleUpdate;
        component._scheduleUpdate = function() {
          computed._dirty = true;
          originalSchedule.call(this);
        };

        return computed;
      },

      /**
       * Watch reactive values
       */
      watch(reactive, callback, options = {}) {
        let oldValue = reactive.value;
        
        const check = () => {
          const newValue = reactive.value;
          if (newValue !== oldValue) {
            callback(newValue, oldValue);
            oldValue = newValue;
          }
        };

        if (options.immediate) {
          callback(reactive.value);
        }

        // Set up watching
        const originalSchedule = component._scheduleUpdate;
        component._scheduleUpdate = function() {
          check();
          originalSchedule.call(this);
        };

        return () => {
          // Cleanup - restore original schedule
          component._scheduleUpdate = originalSchedule;
        };
      },

      /**
       * Define component template
       */
      render(template) {
        component._template = template;
      },

      /**
       * Lifecycle hooks
       */
      onMounted(callback) {
        if (component.isConnected) {
          callback();
        } else {
          component.addEventListener('mounted', callback, { once: true });
        }
      },

      onUpdated(callback) {
        component.addEventListener('updated', callback);
      },

      onBeforeUpdate(callback) {
        component.addEventListener('beforeUpdate', callback);
      },

      onUnmounted(callback) {
        component.addEventListener('unmounted', callback);
      }
    };
  }

  /**
   * Component System - Main component creation and management
   */


  const registry = new Map();

  // Update batcher for efficient rendering
  class UpdateBatcher {
    constructor() {
      this.pending = new Set();
      this.scheduled = false;
    }

    schedule(component) {
      this.pending.add(component);
      if (!this.scheduled) {
        this.scheduled = true;
        requestAnimationFrame(() => this.flush());
      }
    }

    flush() {
      const updates = [...this.pending];
      this.pending.clear();
      this.scheduled = false;
      
      updates.forEach(component => {
        if (component.isConnected) {
          component._render();
        }
      });
    }
  }

  const batcher = new UpdateBatcher();

  // Intersection observer for performance
  function setupVisibilityObserver(component) {
    if (!window.IntersectionObserver) {
      component._visible = true;
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        component._visible = entries[0].isIntersecting;
      },
      { threshold: 0.1 }
    );
    
    observer.observe(component);
    component._observer = observer;
  }

  function createComponent(tagName, definition) {
    if (registry.has(tagName)) {
      console.warn(`Component ${tagName} already registered`);
      return registry.get(tagName);
    }

    class TronComponent extends HTMLElement {
      static properties = {};

      constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        // Initialize component state
        this._reactives = new Map();
        this._eventCounter = 0;
        this._template = null;
        this._lastHTML = '';
        this._firstRender = true;
        this._visible = true;
        this._updateScheduled = false;

        // Create and call context
        const context = createContext(this);
        definition.call(context, context);
      }

      connectedCallback() {
        this._applyStyles();
        setupVisibilityObserver(this);
        this._scheduleUpdate();
        this.dispatchEvent(new CustomEvent('mounted'));
      }

      disconnectedCallback() {
        this._observer?.disconnect();
        this._reactives.clear();
        this.dispatchEvent(new CustomEvent('unmounted'));
      }

      attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue && this._props) {
          const propName = this._kebabToCamel(name);
          if (propName in this._props) {
            this._scheduleUpdate();
          }
        }
      }

      _scheduleUpdate() {
        if (!this._updateScheduled && this.isConnected) {
          this._updateScheduled = true;
          batcher.schedule(this);
        }
      }

      _render() {
        if (!this._template) return;
        
        this._updateScheduled = false;
        this.dispatchEvent(new CustomEvent('beforeUpdate'));

        try {
          const html = typeof this._template === 'function' 
            ? this._template() 
            : String(this._template);

          if (html === this._lastHTML && !this._firstRender) return;

          if (this._firstRender) {
            this._renderInitial(html);
          } else {
            this._renderUpdate(html);
          }

          this._lastHTML = html;
          this._firstRender = false;
          this.dispatchEvent(new CustomEvent('updated'));

        } catch (error) {
          console.error(`Error rendering ${tagName}:`, error);
        }
      }

      _renderInitial(html) {
        const styles = this._getStyles();
        const content = styles ? `<style>${styles}</style>${html}` : html;
        this.shadowRoot.innerHTML = content;
      }

      _renderUpdate(html) {
        const template = document.createElement('template');
        template.innerHTML = html;
        
        if (this.shadowRoot.firstElementChild && template.content.firstElementChild) {
          morphdom(this.shadowRoot.firstElementChild, template.content.firstElementChild);
        } else {
          this.shadowRoot.innerHTML = html;
        }
      }

      _applyStyles() {
        const styles = window.__tronStyles__;
        if (styles instanceof CSSStyleSheet && this.shadowRoot.adoptedStyleSheets) {
          this.shadowRoot.adoptedStyleSheets = [styles];
        }
      }

      _getStyles() {
        const styles = window.__tronStyles__;
        return (styles && typeof styles === 'string') ? styles : null;
      }

      _kebabToCamel(str) {
        return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      }

      forceUpdate() {
        this._scheduleUpdate();
      }
    }

    customElements.define(tagName, TronComponent);
    registry.set(tagName, TronComponent);
    return TronComponent;
  }

  /**
   * Style Manager - CSS and styling management
   */

  class StyleManager {
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

  /**
   * Tron Component Library
   * Ultra-simple reactive web component library
   * @author Nelson M
   * @license MIT
   */


  const styleManager = new StyleManager();

  async function init(options = {}) {
    await styleManager.init(options);
    return { component, init };
  }

  function component(tagName, definition) {
    return createComponent(tagName, definition);
  }

  // Global registration for script tag usage
  if (typeof window !== 'undefined') {
    window.component = component;
    window.TronComponent = { component, init };
  }

  exports.component = component;
  exports.init = init;

}));
