import { getPackage } from "./common.ts";

const PROJECT_PREFIX = "@yarn-berry-typescript-monorepo";

function generatePackage(name: string): string {
  const devDependencies = getPackage().devDependencies;

  return JSON.stringify(
    {
      name: `${PROJECT_PREFIX}/${name}`,
      version: "0.0.1",
      license: "MIT",
      author: "lepidotteri",
      input: "src/index.ts",
      main: "dist/index.js",
      module: "dist/index.mjs",
      types: "dist/types/index.d.ts",
      scripts: {
        clean: 'echo "Nothing to clean" && exit 0',
        prebuild: "yarn clean",
        format: "deno fmt",
        lint: "deno lint --unstable",
        test: 'echo "No tests" && exit 0',
      },
      devDependencies,
    },
    null,
    2,
  );
}

function run(): Promise<string | null> {
  const args = Deno.args;
  if (args.length === 0) {
    throw {
      message: "You must provide the package name as the first argument.",
    };
  }

  const newPackage = `packages/${args[0]}`;

  Deno.mkdirSync(newPackage);
  Deno.mkdirSync(`${newPackage}/src`);

  const pkgFile = generatePackage(args[0]);

  const encoder = new TextEncoder();
  Deno.writeFileSync(
    `${newPackage}/src/index.ts`,
    encoder.encode(`export const PACKAGE = '${PROJECT_PREFIX}/${args[0]}';`),
  );
  Deno.writeFileSync(`${newPackage}/package.json`, encoder.encode(pkgFile));
  Deno.writeFileSync(
    `${newPackage}/README.md`,
    encoder.encode(`@lepidotteri/${args[0]}`),
  );
  Deno.copyFileSync("configs/.eslintrc.yaml", `${newPackage}/.eslintrc.yaml`);
  Deno.copyFileSync("configs/tsconfig.json", `${newPackage}/tsconfig.json`);

  return newPackage;
}

run()
  .then((value) => {
    console.log(value ? "OK: " + value : undefined);
    Deno.exit(value ? 0 : 1);
  })
  .catch((err) => {
    console.log(err.message);
    Deno.exit(1);
  });
