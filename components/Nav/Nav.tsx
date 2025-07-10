import {
  AppShell,
  Container,
  Group,
  Image,
  Flex,
  useMantineColorScheme,
  useComputedColorScheme,
} from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import NextImage from "next/image";
import AarsleffLogo from "/public/Aarsleff Logo.png";
import AarsleffLogoWhite from "/public/Aarsleff Logo White.png";
import classes from "./Nav.module.css";
import cx from "clsx";
import { IconDatabase, IconMoon, IconSun } from "@tabler/icons-react";
import NavFooterForms from "./NavFooterForms/NavFooterForms";
import NavButton from "./NavButton/NavButton";
import NavFooterSettings from "./NavFooterSettings/NavFooterSettings";
import SideNav from "./SideNav/SideNav";
//import * as Sentry from "@sentry/nextjs";

import confetti from "canvas-confetti";
import { useAuth, UserButton, useSession, useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Nav({ children }: { children: React.ReactNode }) {
  const { width } = useViewportSize();
  const { isLoaded, user } = useUser();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const { session } = useSession();

  // if (isLoaded) {
  //   Sentry.setUser({
  //     email: user?.primaryEmailAddress?.emailAddress,
  //     name: user?.fullName,
  //   });
  // }

  function fireConfetti() {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }

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
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme();

  return (
    <AppShell
      padding="md"
      header={{ height: 60, collapsed: width < 1024 }}
      footer={{ height: 75, collapsed: width >= 1024 || !isSignedIn }}
      navbar={{
        width: 80,
        breakpoint: 1024,
        collapsed: { desktop: !isSignedIn, mobile: true },
      }}
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Group justify="space-between" style={{ flex: 1 }}>
            <Image
              component={NextImage}
              src={AarsleffLogo}
              alt="My image"
              h={30}
              className={cx(classes.dark)}
              onClick={() => fireConfetti()}
            />
            <Image
              component={NextImage}
              src={AarsleffLogoWhite}
              alt="My image"
              h={30}
              className={cx(classes.light)}
              onClick={() => fireConfetti()}
            />
            {isSignedIn ? (
              <div id="UserAvatar">
                <UserButton>
                  <UserButton.MenuItems>
                    <UserButton.Action
                      label={
                        computedColorScheme === "light"
                          ? "Dark Mode"
                          : "Light Mode"
                      }
                      labelIcon={
                        <>
                          <IconSun
                            className={cx(classes.light, classes.icon)}
                            style={{ marginTop: -5 }}
                          />
                          <IconMoon
                            className={cx(classes.dark, classes.icon)}
                            style={{ marginTop: -5 }}
                          />
                        </>
                      }
                      onClick={() =>
                        setColorScheme(
                          computedColorScheme === "light" ? "dark" : "light"
                        )
                      }
                    />
                  </UserButton.MenuItems>
                </UserButton>
              </div>
            ) : null}
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar>
        <SideNav />
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
      <AppShell.Footer id="footer">
        <Container size="xs" px="30px" mb="10px">
          <Flex justify="space-between" align="center" mt={5}>
            <div id="dataLink">
              <NavButton
                label={"Data"}
                Icon={IconDatabase}
                onClick={() => router.push("/data")}
              />
            </div>
            <div id="formsLink">
              <NavFooterForms />
            </div>
            <div id="userLink">
              <NavFooterSettings />
            </div>
          </Flex>
        </Container>
      </AppShell.Footer>
    </AppShell>
  );
}
