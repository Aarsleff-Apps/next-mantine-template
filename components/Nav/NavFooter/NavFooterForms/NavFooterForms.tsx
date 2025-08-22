import { Flex, Menu, rem, UnstyledButton, Text } from "@mantine/core";
import {
  IconAddressBook,
  IconCar,
  IconForms,
  IconNotes,
  IconReceiptRefund,
  IconTruckDelivery,
} from "@tabler/icons-react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function NavFooterForms() {
  const { user } = useUser();

  const links = [
    { label: "Goods Received", href: "/forms/egr", icon: IconTruckDelivery },
    {
      icon: IconAddressBook,
      label: "Briefing Register",
      href: user?.primaryEmailAddress?.emailAddress.includes(
        "centrumpile.co.uk"
      )
        ? "/forms/BriefingRegisterCentrum"
        : "/forms/BriefingRegister",
    },
    {
      icon: IconReceiptRefund,
      label: "Goods Returned",
      href: "/forms/GoodsReturned",
    },
    { icon: IconNotes, label: "Site Paperwork", href: "/forms/SitePaperwork" },
    { icon: IconCar, label: "Vehicle Checks", href: "/forms/VehicleChecks" },
  ];

  const items = links.map((link, index) => (
    <Menu.Item
      leftSection={<link.icon style={{ width: rem(14), height: rem(14) }} />}
      component={Link}
      href={link.href}
      key={index}
    >
      {link.label}
    </Menu.Item>
  ));
  return (
    <Menu withArrow shadow="md">
      <Menu.Target>
        <UnstyledButton style={{ width: "50px", height: "50px" }}>
          <Flex gap={0} justify="center" align="center" direction="column">
            <IconForms style={{ width: 25, height: 25 }} stroke={1.5} />
            <Text fw={200} size="sm">
              Forms
            </Text>
          </Flex>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>{items}</Menu.Dropdown>
    </Menu>
  );
}
