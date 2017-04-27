// Could not resolve the following error.
// ----
// src/components/SquareMatrix.js:72
//  72:     const rect = event.target.getBoundingClientRect();
//                                    ^^^^^^^^^^^^^^^^^^^^^ property `getBoundingClientRect`. Property not found in
//  72:     const rect = event.target.getBoundingClientRect();
//                       ^^^^^^^^^^^^ EventTarget
// ----
//
// Refs)
// https://github.com/facebook/flow/blob/master/lib/react.js
// https://github.com/facebook/flow/issues/218
// https://github.com/facebook/flow/issues/3058
//
// ----
//
// Real answer?
// https://flow.org/en/docs/frameworks/react/#toc-adding-types-for-react-events
//
// ```
// event: Event & { currentTarget: HTMLButtonElement }
// ```
export class ModifiedSyntheticTouchEvent extends SyntheticTouchEvent {
  target: HTMLElement;
}
