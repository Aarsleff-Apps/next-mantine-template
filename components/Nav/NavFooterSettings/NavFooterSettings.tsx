import {
  Menu,
  rem,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import {
  IconBook,
  IconLogout,
  IconMoon,
  IconSettings,
  IconSun,
} from "@tabler/icons-react";
import classes from "./NavFooterSettings.module.css";
import cx from "clsx";
import HelpModal from "../HelpModal/HelpModal";
import { useDisclosure } from "@mantine/hooks";
import NavButton from "../NavButton/NavButton";
import { SignOutButton, useUser } from "@clerk/nextjs";

export default function NavFooterSettings() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme();
  const [opened, { open, close }] = useDisclosure(false);
  const { isLoaded, user } = useUser();

  return (
    <>
      <Menu shadow="md" withArrow={true}>
        <Menu.Target>
          <NavButton Icon={IconSettings} label="Settings" onClick={() => {}} />
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>{isLoaded ? user?.fullName : "Loading..."}</Menu.Label>
          <SignOutButton>
            <Menu.Item
              leftSection={
                <IconLogout style={{ width: rem(14), height: rem(14) }} />
              }
            >
              Sign out
            </Menu.Item>
          </SignOutButton>
          <Menu.Item
            leftSection={
              <>
                <IconSun className={cx(classes.light, classes.icon)} />
                <IconMoon className={cx(classes.dark, classes.icon)} />
              </>
            }
            onClick={() =>
              setColorScheme(computedColorScheme === "light" ? "dark" : "light")
            }
          >
            <span className={cx(classes.light)}>Light Mode</span>
            <span className={cx(classes.dark)}>Dark Mode</span>
          </Menu.Item>
          <Menu.Item
            leftSection={
              <IconBook style={{ width: rem(14), height: rem(14) }} />
            }
            onClick={open}
          >
            Help
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <HelpModal opened={opened} close={close} />
    </>
  );
}
