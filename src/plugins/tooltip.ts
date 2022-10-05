import FloatingVue from 'floating-vue';

// eslint-disable-next-line import/prefer-default-export
export function registerTooltipConfig() {
  FloatingVue.options.disposeTimeout = 500;

  FloatingVue.options.themes.tooltip.delay = 0;
  //   menu: {
  //     $extend: 'dropdown',
  //     triggers: ['hover', 'focus'],
  //     popperTriggers: ['hover', 'focus'],
  //     delay: {
  //       show: 0,
  //       hide: 400,
  //     },
  //   },
  FloatingVue.options.themes.menu.placement = 'right-start';
  FloatingVue.options.themes.menu.delay = 0;
  FloatingVue.options.themes.menu.triggers = [];
  FloatingVue.options.themes.menu.popperTriggers = [];
  FloatingVue.options.themes.menu.autoHide = false;

//   FloatingVue.options = {
//     // Disable popper components
//     disabled: false,
//     // Default position offset along main axis (px)
//     distance: 5,
//     // Default position offset along cross axis (px)
//     skidding: 0,
//     // Default container where the tooltip will be appended
//     container: '#fl-layer',
//     // Element used to compute position and size boundaries
//     boundary: undefined,
//     // Skip delay & CSS transitions when another popper is shown, so that the popper appear to instanly move to the new position.
//     instantMove: false,
//     // Auto destroy tooltip DOM nodes (ms)
//     disposeTimeout: 5000,
//     // Triggers on the popper itself
//     popperTriggers: [],
//     // Positioning strategy
//     strategy: 'absolute',
//     // Prevent overflow
//     preventOverflow: true,
//     // Flip to the opposite placement if needed
//     flip: true,
//     // Shift on the cross axis to prevent the popper from overflowing
//     shift: true,
//     // Overflow padding (px)
//     overflowPadding: 0,
//     // Arrow padding (px)
//     arrowPadding: 0,
//     // Compute arrow overflow (useful to hide it)
//     arrowOverflow: true,
//     // Themes
//     themes: {
//       tooltip: {
//         placement: 'top',
//         triggers: ['hover'],
//         //   hideTriggers: (events) => [...events, 'click'],
//         hideTriggers: [],
//         // Delay (ms)
//         delay: {
//           show: 0,
//           hide: 0,
//         },
//       },
//       dropdown: {
//         // Default dropdown placement relative to target element
//         placement: 'bottom',
//         // Default events that trigger the dropdown
//         triggers: ['click'],
//         // Delay (ms)
//         delay: 0,
//         // Update popper on content resize
//         handleResize: true,
//         // Hide on click outside
//         autoHide: true,
//       },
//       menu: {
//         // placement: 'bottom',
//         // triggers: ['hover', 'focus'],
//         // popperTriggers: ['hover', 'focus'],
//         delay: {
//           show: 0,
//           hide: 0,
//         },
//       },
//     },
//   };
}
