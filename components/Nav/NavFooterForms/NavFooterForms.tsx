import { Menu, rem } from "@mantine/core";
import { IconAddressBook, IconCar, IconForms, IconNotes, IconReceiptRefund, IconTruckDelivery } from "@tabler/icons-react";
import NavButton from "../NavButton/NavButton";
import { useUser } from "@clerk/nextjs";

export default function NavFooterForms() {
  const {user} = useUser();

  const links = [
    { label: "Goods Received", href: "/forms/egr", icon: IconTruckDelivery },
    { icon: IconAddressBook, label: "Briefing Register", href: user?.primaryEmailAddress?.emailAddress.includes('centrumpile.co.uk') ? "/forms/BriefingRegisterCentrum" : "/forms/BriefingRegister" },
    { icon: IconReceiptRefund, label: "Goods Returned", href: "/forms/GoodsReturned" },
    { icon: IconNotes, label: "Site Paperwork", href: "/forms/SitePaperwork" },
    { icon: IconCar, label: "Vehicle Checks", href: "/forms/VehicleChecks" }
  ];

  const items = links.map((link, index) => (
    <Menu.Item
      leftSection={<link.icon style={{ width: rem(14), height: rem(14) }} />}
      component="a"
      href={link.href}
      key={index}
    >
      {link.label}
    </Menu.Item>
  ));
  return (
    <Menu withArrow shadow="md">
      <Menu.Target>
        <NavButton label="Forms" Icon={IconForms} />
      </Menu.Target>
      <Menu.Dropdown>{items}</Menu.Dropdown>
    </Menu>
  );
}
