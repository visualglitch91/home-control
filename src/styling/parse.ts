// Parses the object into css, scoped, blocks
export default function parse(obj: any, selector: string) {
  let outer = "";
  let blocks = "";
  let current = "";

  for (let key in obj) {
    let val = obj[key];

    if (key[0] === "@") {
      // If these are the `@` rule
      if (key[1] === "i") {
        // Handling the `@import`
        outer = key + " " + val + ";";
      } else if (key[1] === "f") {
        // Handling the `@font-face` where the
        // block doesn't need the brackets wrapped
        blocks += parse(val, key);
      } else {
        // Regular at rule block
        blocks += key + "{" + parse(val, key[1] === "k" ? "" : selector) + "}";
      }
    } else if (typeof val === "object") {
      // Call the parse for this block
      blocks += parse(
        val,
        selector
          ? // Go over the selector and replace the matching multiple selectors if any
            selector.replace(/([^,])+/g, (sel) => {
              // Return the current selector with the key matching multiple selectors if any
              return key.replace(/(^:.*)|([^,])+/g, (k) => {
                // If the current `k`(key) has a nested selector replace it
                if (/&/.test(k)) return k.replace(/&/g, sel);

                // If there's a current selector concat it
                return sel ? sel + " " + k : k;
              });
            })
          : key
      );
    } else if (typeof val !== "undefined") {
      // Convert all but CSS variables
      key = /^--/.test(key) ? key : key.replace(/[A-Z]/g, "-$&").toLowerCase();
      // Push the line for this property
      current += key + ":" + val + ";";
    }
  }

  // If we have properties apply standard rule composition
  return (
    outer +
    (selector && current ? selector + "{" + current + "}" : current) +
    blocks
  );
}
