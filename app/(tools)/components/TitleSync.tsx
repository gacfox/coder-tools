"use client";

import { useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { TOOL_NAME_BY_ID } from "@/lib/tools";

const SITE_TITLE = "CODER TOOLS";

export default function TitleSync() {
  const pathname = usePathname();

  const title = useMemo(() => {
    if (pathname === "/") {
      return SITE_TITLE;
    }
    const parts = pathname.split("/").filter(Boolean);
    const toolId = parts[0] ?? "";
    const toolName = TOOL_NAME_BY_ID[toolId];
    return toolName ? `${toolName} | ${SITE_TITLE}` : SITE_TITLE;
  }, [pathname]);

  useEffect(() => {
    document.title = title;
  }, [title]);

  return null;
}
