import { Container, Flex } from "@mantine/core";
import { IconDatabase } from "@tabler/icons-react";
import NavButton from "./NavButton/NavButton";
import NavFooterForms from "./NavFooterForms/NavFooterForms";
import NavFooterSettings from "./NavFooterSettings/NavFooterSettings";
import FeedbackButton from "../FeedbackButton/FeedbackButton";

export default function NavFooter() {
  return (
    <Container size="xs" px="30px" mb="10px">
      <Flex justify="space-between" align="center" mt={5}>
        <div id="dataLink">
          <NavButton label={"Data"} Icon={IconDatabase} href="/data" />
        </div>
        <div id="formsLink">
          <NavFooterForms />
        </div>
        <FeedbackButton type="NavFooter" />
        <div id="userLink">
          <NavFooterSettings />
        </div>
      </Flex>
    </Container>
  );
}
