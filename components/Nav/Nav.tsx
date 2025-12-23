import {
  AppShell,
  Group,
  Text,
  Burger,
} from "@mantine/core";
import { useDisclosure, useViewportSize } from "@mantine/hooks";
import SideNav from "./SideNav/SideNav";
//import * as Sentry from "@sentry/nextjs";

import { useSession, useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function Nav({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const { width } = useViewportSize();
  const { isLoaded, user } = useUser();
  const { session } = useSession();

  // if (isLoaded) {
  //   Sentry.setUser({
  //     email: user?.primaryEmailAddress?.emailAddress,
  //     name: user?.fullName,
  //   });
  // }

  //update usermetadata
  useEffect(() => {
    async function updateUserMetadata() {
      const photo = await fetch(
        `/api/updateUserMetadata?user=${user?.primaryEmailAddress?.emailAddress}`
      );
      if (!photo.ok) {
        console.error("Failed to update user metadata");
      }
      const data = await photo.blob();
      await user?.setProfileImage({ file: data });
    }
    // check if updatedAt was within the last 30 seconds
    const now = new Date();
    const thirtySecondsAgo = new Date(now.getTime() - 15 * 1000);
    if (session?.updatedAt && session.updatedAt > thirtySecondsAgo) {
      updateUserMetadata();
    }
  }, [isLoaded]);

  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      navbar={{
        width: 270,
        breakpoint: 1024,
        collapsed: { desktop: false, mobile: !opened },
      }}
    >
      <AppShell.Header
        style={{
          background: "linear-gradient(to right, #ffffffff 20%, #005fae 70%)",
        }}
      >
        <Group h="100%" px="md">
          <Group justify="space-between" style={{ flex: 1 }}>
            <Group gap="xl">
              {width! < 1024 && (
                <Burger
                  opened={opened}
                  onClick={toggle}
                  size="sm"
                  color="#000000ff"
                />
              )}
              <Text ta="left" fw={500} c="#000000ff">
                pageTitle
              </Text>
            </Group>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar>
        <SideNav />
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
