import { Button, Card, Container, Group, Image, Text } from "@mantine/core";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { callbackUrl } = router.query;

  return (
      <Container size="xl">
        <Group justify="center" mt="xl">
          <Card shadow="sm" padding="lg" radius="md" withBorder w={400}>
            <Card.Section>
              <Image
                src="/secure.svg"
                width="auto"
                height={300}
                fit="contain"
                alt="Secure Login"
                p={20}
              />
            </Card.Section>
            <Group justify="space-between" mt="md" mb="xs">
              <Text fw={500}>Please sign in!</Text>
            </Group>

            <Text size="sm" c="dimmed">
              AarTemplate is only accesable to authenticated users. Please sign in
              to view your forms.
            </Text>

            <Button
              fullWidth
              mt="md"
              radius="md"
              onClick={() => {
                setLoading(true);
                signIn("azure-ad", {
                  callbackUrl: callbackUrl ? (callbackUrl as string) : "/",
                });
              }}
              loading={loading}
            >
              Sign In
            </Button>
            <Text mt={20} c="dimmed" size="xs" component='a' href="https://storyset.com/online">Online illustrations by Storyset</Text>
          </Card>
        </Group>
      </Container>
  );
}
