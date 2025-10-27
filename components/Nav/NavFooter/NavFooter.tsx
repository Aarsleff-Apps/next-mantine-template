import { Flex } from "@mantine/core";
import { IconDatabase } from "@tabler/icons-react";
import NavButton from "./NavButton/NavButton";
import NavFooterForms from "./NavFooterForms/NavFooterForms";
import NavFooterSettings from "./NavFooterSettings/NavFooterSettings";
import FeedbackButton from "../FeedbackButton/FeedbackButton";

export default function NavFooter() {
  return (
    <Flex justify="space-between" align="center" mt={5} mx={10}>
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
  );
}
