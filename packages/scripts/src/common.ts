export function getFileOrDefault(
  filePath: string,
  defaultReturn = "{}",
): string {
  try {
    return Deno.readTextFileSync(filePath);
  } catch (e) {
    return defaultReturn;
  }
}

export function getPackage(): Record<string, unknown> {
  return JSON.parse(getFileOrDefault("package.json"));
}

export function getWorkspaces(): Promise<string[]> {
  const pkg = getPackage();
  pkg.workspaces.map((workspace: string) => workspace.replace("/*", ""));
  return pkg.workspaces.map((workspace: string) => workspace.replace("/*", ""));
}
