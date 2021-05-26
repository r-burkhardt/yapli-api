// export class YObject extends Object {
//   static merge(...args: Object[]): YObject {
//     if (!args) return {};
//     let destination = {};
//     let merge;
//     while (merge = args.shift()) {
//       destination = YObject.mergeRecursive(destination, merge);
//     }
//     return destination;
//   }
//
//   private mergeRecursive(a: Object, b: Object): Object {
//     const allKeys = [...new Set([...Object.keys(a), ...Object.keys(b)])];
//
//     for (const key of allKeys) {
//       if (a.hasOwnProperty(key) && b.hasOwnProperty(key)) {
//         if (this.isObjectAndNotArrayOrNull(a[key]) &&
//             this.isObjectAndNotArrayOrNull(b[key])) {
//         } else {
//           a[key] = b[key];
//         }
//       } else if (!a.hasOwnProperty(key) && b.hasOwnProperty(key)) {
//         a[key] = b[key];
//       }
//     }
//
//     return a;
//   }
//
//   private isObjectAndNotArrayOrNull(x: any): boolean {
//     return x !== null && !Array.isArray(x) && typeof x === 'object';
//   }
// }
