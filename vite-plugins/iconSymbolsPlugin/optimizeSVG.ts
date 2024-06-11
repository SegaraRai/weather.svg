import { optimize } from "svgo";

export function optimizeSVG(
  source: string,
  idPrefix: string,
  floatPrecision: number
): string {
  return optimize(source, {
    multipass: true,
    floatPrecision,
    plugins: [
      {
        name: "preset-default",
        params: {
          overrides: {
            // this removes some parts used for animation
            removeHiddenElems: false,
          },
        },
      },
      {
        name: "prefixIds",
        params: {
          prefix: idPrefix,
          delim: "",
        },
      },
      {
        name: "trimValueListWhitespace",
        fn: () => {
          return {
            element: {
              enter: (node) => {
                const targetAttributes = {
                  animate: ["values", "keyPoints", "keySplines", "keyTimes"],
                  animateMotion: [
                    "values",
                    "keyPoints",
                    "keySplines",
                    "keyTimes",
                  ],
                  animateTransform: [
                    "values",
                    "keyPoints",
                    "keySplines",
                    "keyTimes",
                  ],
                }[node.name];
                if (!targetAttributes) {
                  return;
                }

                for (const attribute of targetAttributes) {
                  const value = node.attributes[attribute];
                  if (!value) {
                    continue;
                  }

                  node.attributes[attribute] = value.replace(
                    /([;,])\s+/g,
                    "$1"
                  );
                }
              },
            },
          };
        },
      },
    ],
  }).data;
}
