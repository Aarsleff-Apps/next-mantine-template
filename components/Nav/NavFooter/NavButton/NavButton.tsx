import { Flex, UnstyledButton, Text } from "@mantine/core";
import Link from "next/link";
import { forwardRef } from "react";

interface IProps extends React.ComponentPropsWithoutRef<'a'> {
  Icon: any;
  label?: string;
  href: string;
}

const NavButton = forwardRef<HTMLAnchorElement, IProps>(
  ({ Icon, label, href, ...others }: IProps, ref) => (
    <UnstyledButton
      component={Link}
      href={href}
      ref={ref}
      style={{ width: "50px", height: "50px" }}
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
