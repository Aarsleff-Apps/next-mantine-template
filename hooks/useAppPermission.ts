import { useSession } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { decodeJwtPayload } from "@/lib/jwt";
import type { TemplatePermissions } from "@/lib/permissions";

/**
 * Reads this app's permissions from its scoped "template" JWT template
 * (Clerk getToken caches for 60s). Rename "template" and TemplatePermissions
 * when cloning this template for a new app.
 */
export function useAppPermission(): TemplatePermissions | undefined {
  const { session } = useSession();
  const [permissions, setPermissions] = useState<TemplatePermissions>();

  useEffect(() => {
    if (!session) return;
    let cancelled = false;

    session.getToken({ template: "template" }).then((token) => {
      if (cancelled || !token) return;
      setPermissions(decodeJwtPayload<{ permissions?: TemplatePermissions }>(token).permissions);
    });

    return () => {
      cancelled = true;
    };
  }, [session]);

  return permissions;
}
