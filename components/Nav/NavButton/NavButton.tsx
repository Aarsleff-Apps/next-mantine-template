import { Flex, UnstyledButton, Text } from "@mantine/core";
import { forwardRef } from "react";

interface IProps extends React.ComponentPropsWithoutRef<'button'>{
    Icon: any;
    label?: string;
    onClick?: () => void
}

const NavButton = forwardRef<HTMLButtonElement, IProps> (
    ({Icon, label, onClick}:IProps, ref) => (
    <UnstyledButton onClick={onClick} ref={ref} style={{width: "50px", height: "50px"}}>
      <Flex gap={0} justify="center" align="center" direction="column">
        <Icon style={{ width: 25, height: 25}} stroke={1.5}/>
        <Text fw={200} size="sm">{label}</Text>
      </Flex>
    </UnstyledButton>
  )
)

NavButton.displayName = 'NavButton';

export default NavButton;
