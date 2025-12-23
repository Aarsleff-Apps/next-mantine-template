import { IconChevronRight } from "@tabler/icons-react";
import { Avatar, Group, Skeleton, Text, UnstyledButton } from "@mantine/core";
import classes from "./UserButton.module.css";
import { useUser } from "@clerk/nextjs";

export function UserButton() {
  const { isLoaded, user } = useUser();

  if (!isLoaded || !user) {
    return (
      <UnstyledButton className={classes.user} disabled>
        <Group>
          <Skeleton height={38} circle />

          <div style={{ flex: 1 }}>
            <Skeleton height={8} radius="xl" />

            <Skeleton height={8} radius="xl" mt={10} />
          </div>

          <IconChevronRight size={14} stroke={1.5} />
        </Group>
      </UnstyledButton>
    );
  }

  return (
    <UnstyledButton className={classes.user}>
      <Group>
        {user.imageUrl ? (
          <Avatar src={user.imageUrl} radius="xl" />
        ) : (
          <Avatar radius="xl" name={user.fullName ?? ""} />
        )}
        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {user.fullName}
          </Text>

          <Text c="dimmed" size="xs">
            {user.emailAddresses[0].emailAddress}
          </Text>
        </div>

        <IconChevronRight size={14} stroke={1.5} />
      </Group>
    </UnstyledButton>
  );
}
