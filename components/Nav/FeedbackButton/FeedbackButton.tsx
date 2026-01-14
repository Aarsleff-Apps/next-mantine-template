import { useEffect, useRef, useState } from "react";
// import * as Sentry from "@sentry/nextjs";
import { Flex, rem, Tooltip, UnstyledButton, Text } from "@mantine/core";
import { IconSpeakerphone } from "@tabler/icons-react";
import classes from "./FeedbackButton.module.css";

interface Iprops {
  type: "SideNav" | "NavFooter";
}

export default function FeedbackButton({ type }: Iprops) {
  const [feedback, setFeedback] = useState<any | undefined>(undefined);
  // Read `getFeedback` on the client only, to avoid hydration errors during server rendering
  // useEffect(() => {
  //   setFeedback(Sentry.getFeedback());
  // }, []);

  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (feedback && buttonRef.current) {
      const unsubscribe = feedback.attachTo(buttonRef.current, {
        colorScheme: "system",
        showBranding: false,
        isEmailRequired: false,
        isNameRequired: true,
        useSentryUser: {
          name: "name",
          email: "email",
        },
        formTitle: "Send us your feedback",
        submitButtonLabel: "Submit",
        messagePlaceholder: "What's the bug? What would make this better?",
      });
      return unsubscribe;
    }
    return () => {};
  }, [feedback]);

  if (type === "SideNav")
    return (
      <Tooltip
        label={"Send Feedback"}
        position="right"
        transitionProps={{ duration: 0 }}
      >
        <UnstyledButton className={classes.link} ref={buttonRef}>
          <IconSpeakerphone
            style={{ width: rem(20), height: rem(20) }}
            stroke={1.5}
          />
        </UnstyledButton>
      </Tooltip>
    );

  if (type === "NavFooter")
    return (
      <UnstyledButton ref={buttonRef} style={{ width: "60px", height: "50px" }}>
        <Flex gap={0} justify="center" align="center" direction="column">
          <IconSpeakerphone style={{ width: 25, height: 25 }} stroke={1.5} />
          <Text fw={200} size="sm">
            Feedback
          </Text>
        </Flex>
      </UnstyledButton>
    );
}
