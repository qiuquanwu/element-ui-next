import { Plugin } from "vite";
import path from "path";
import MarkdownIt from "markdown-it";
import mdContainer from "markdown-it-container";
import icon from "../../assets/icon.json";

const docRule = /^\/@docs\/(.*?).md$/;

const demoContainer = (md, callback: (description: string) => void) => ({
  validate(params) {
    return params.trim().match(/^demo\s*(.*)$/);
  },
  render(tokens, idx) {
    const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/);
    if (tokens[idx].nesting === 1) {
      const description = m && m.length > 1 ? m[1] : "";
      description && callback(md.render(description));
      return "";
    }
    return "";
  },
});

interface VuedcoPluginOptions {
  docsPath?: (root: string) => string | undefined;
  plugins?: any[];
}

function stripScript(content: string) {
  const result = content.match(/<(script)>([\s\S]+)<\/\1>/);
  const code = result && result[2] ? result[2].trim() : "";
  return code;
}

function stripStyle(content: string) {
  const result = content.match(/<(style)\s*>([\s\S]+)<\/\1>/);
  return result && result[2] ? result[2].trim() : "";
}

function stripTemplate(content: string) {
  content = content.trim();
  if (!content) {
    return content;
  }
  return content.replace(/<(script|style)[\s\S]+<\/\1>/g, "").trim();
}

export function createVuedcoPlugin(options: VuedcoPluginOptions): Plugin {
  const { docsPath } = options;
  return {
    resolvers: [
      {
        requestToFile(publicPath: string, root: string) {
          if (docRule.test(publicPath)) {
            const docDir = docsPath?.(root) || root;
            const docFilePath = publicPath.replace(docRule, "$1.md");
            return path.join(docDir, docFilePath);
          }
        },
        fileToRequest(filePath: string, root: string) {
          const docDir = docsPath?.(root) || root;
          if (filePath.startsWith(docDir) && filePath.endsWith(".md")) {
            const reqPath = filePath.replace(docDir, "").replace(/\\/g, "/");
            return `/@docs/${reqPath}`;
          }
        },
      },
    ],
    transforms: [
      {
        test(ctx) {
          return ctx.path.endsWith(".md");
        },
        transform(ctx) {
          const fileName = ctx.path.split("/").pop().split(".")[0];
          const demos: {
            id: string;
            component: string;
          }[] = [];
          let currentDescription = "";

          const md = new MarkdownIt("default", {
            html: true,
            linkify: true,
            typographer: true,
            highlight: function (code: string, lang: string) {
              if (lang === "html") {
                const id = `Demo${demos.length}`;
                const stript = (stripScript(code) || "export default {}").replace(
                  "export default",
                  `const ${id} =`,
                );
                const template = stripTemplate(code);

                demos.push({
                  id: id,
                  component: [
                    "",
                    stript,
                    `if (${id}.methods) {
                      ${id}.methods.source = function () {
                        return ${JSON.stringify(code)}
                      }
                    } else {
                      ${id}.methods = {
                        source() {
                          return ${JSON.stringify(code)}
                        },
                      }
                    }`,
                    `${id}.template = ${JSON.stringify(
                      `<Preview class="demo-${fileName}" :source="source()">
                        <template v-slot:demo>${template}</template>
                        ${
                          currentDescription &&
                          `<template v-slot:description>${currentDescription}</template>`
                        }
                      </Preview>`,
                    )}`,
                  ].join("\n"),
                });
                return `<pre></pre><${id} />`;
              }
              return "";
            },
          });
          md.use(
            mdContainer,
            "demo",
            demoContainer(md, (description) => {
              currentDescription = description;
            }),
          );
          md.use(mdContainer, "tip");
          md.use(mdContainer, "warning");
          const code = ctx.code.replace(
            /\$icon/g,
            `[${icon.map((item) => `"${item}"`).toString()}]`,
          );
          const context = md.render(code, {});
          const docComponent = `
          import { createApp, defineComponent } from 'vue';
  
          ${demos.map((demo) => demo.component).join("")}
            
          const __script = defineComponent({
            components: {
              ${demos.map((demo) => demo.id).join(",")}
            },
            template: ${JSON.stringify(context)}
          });
          export default __script;`;
          return docComponent;
        },
      },
    ],
  };
}
