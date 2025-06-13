import * as React from "react";
import { createLink, LinkComponent } from "@tanstack/react-router";
import { Anchor as MAnchor, AnchorProps } from "@mantine/core";

interface MantineAnchorProps extends Omit<AnchorProps, "href"> {
  // Add any additional props you want to pass to the anchor
}

const MantineLinkComponent = React.forwardRef<HTMLAnchorElement, MantineAnchorProps>((props, ref) => {
  return <MAnchor ref={ref} {...props} />;
});

const CreatedLinkComponent = createLink(MantineLinkComponent);

export const Anchor: LinkComponent<typeof MantineLinkComponent> = (props) => {
  return <CreatedLinkComponent preload="intent" {...props} />;
};
