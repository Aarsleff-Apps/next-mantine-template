import { Stack, Tooltip, UnstyledButton, rem } from "@mantine/core";
import {
  IconHome2,
  IconDatabase,
  IconTruckDelivery,
  IconUser,
  IconAddressBook,
  IconReceiptRefund,
  IconHelp,
  IconNotes,
  IconFileArrowRight,
  IconCar
} from "@tabler/icons-react";
import classes from "./SideNav.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDisclosure } from "@mantine/hooks";
import HelpModal from "../HelpModal/HelpModal";
import { useAuth, useUser } from "@clerk/nextjs";

interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  active?: boolean;
  href: string;
}

function NavbarLink({ icon: Icon, label, active, href }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        component="a"
        href={href}
        className={classes.link}
        data-active={active || undefined}
      >
        <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

export default function SideNav() {
  const [active, setActive] = useState<number>();
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const {user} = useUser();
  const { isLoaded, sessionClaims,  } = useAuth();

  const linkData = [
    { icon: IconHome2, label: "Home", href: "/" },
    { icon: IconTruckDelivery, label: "Goods Received", href: "/forms/egr" },
    { icon: IconAddressBook, label: "Briefing Register", href: user?.primaryEmailAddress?.emailAddress.includes('centrumpile.co.uk') ? "/forms/BriefingRegisterCentrum" : "/forms/BriefingRegister" },
    { icon: IconReceiptRefund, label: "Goods Returned", href: "/forms/GoodsReturned" },
    { icon: IconNotes, label: "Site Paperwork", href: "/forms/SitePaperwork" },
    { icon: IconCar, label: "Vehicle Checks", href: "/forms/VehicleChecks" },
    { icon: IconDatabase, label: "Data", href: "/data" },
  ];

  if (isLoaded && user) {
    if (sessionClaims?.metadata?.aarforms?.admin) {
      linkData.push({ icon: IconFileArrowRight, label: "Export", href: "/export" });
    }
    if (sessionClaims?.metadata?.aarforms?.user_admin) {
      linkData.push({ icon: IconUser, label: "Users", href: "/users" });
    }
  }

  useEffect(() => {
    //find index of object in linkData where href = router.pathname
    const index = linkData.findIndex((link) => link.href === router.pathname);
    setActive(index);
  }, [router.isReady]);

  const links = linkData.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      href={link.href}
    />
  ));
  return (
    <nav className={classes.navbar} id="sidenav">
      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
          {links}
          {/* Help link */}
          <Tooltip label={"Help"} position="right" transitionProps={{ duration: 0 }}>
            <UnstyledButton
              className={classes.link}
              onClick={open}
            >
              <IconHelp style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
            </UnstyledButton>
          </Tooltip>
        </Stack>
      </div>
      <HelpModal opened={opened} close={close} />
    </nav>
  );
}
