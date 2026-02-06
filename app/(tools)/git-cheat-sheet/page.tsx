import type { Metadata } from "next";
import ToolClient from "./ToolClient";
import { TOOL_NAME_BY_ID } from "@/lib/tools";

const toolName = TOOL_NAME_BY_ID["git-cheat-sheet"] ?? "CODER TOOLS";

export const metadata: Metadata = {
  title: toolName === "CODER TOOLS" ? toolName : `${toolName} | CODER TOOLS`
};

export default function Page() {
  return <ToolClient />;
}

