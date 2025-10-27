import { Flex, UnstyledButton, Text, MantineStyleProps } from "@mantine/core";
import { TablerIcon } from "@tabler/icons-react";
import Link from "next/link";
import { ComponentPropsWithoutRef, forwardRef } from "react";

type UnstyledButtonComponentProps = ComponentPropsWithoutRef<typeof UnstyledButton>;

interface IProps
  extends Omit<UnstyledButtonComponentProps, "children" | "component" | "href">, MantineStyleProps {
  Icon: TablerIcon;
  label?: string;
  href: string;
}

const NavButton = forwardRef<HTMLAnchorElement, IProps>(
  ({ Icon, label, href, ...others }: IProps, ref) => (
    <UnstyledButton
      component={Link}
      href={href}
      ref={ref}
      style={{ width: "60px", height: "50px" }}
      pt={2}
      {...others}
    >
      <Flex gap={0} justify="center" align="center" direction="column">
        <Icon style={{ width: 25, height: 25 }} stroke={1.5} />
        <Text fw={200} size="sm">
          {label}
        </Text>
      </Flex>
    </UnstyledButton>
  )
);

NavButton.displayName = 'NavButton';

export default NavButton;
