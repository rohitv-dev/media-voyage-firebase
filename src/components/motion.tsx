/* eslint-disable @typescript-eslint/no-explicit-any */
import { Title, Rating } from "@mantine/core";
import { motion } from "motion/react";
import { forwardRef } from "react";

const AnimatedRating = forwardRef<HTMLDivElement, any>((props, ref) => <Rating ref={ref} {...props} />);
const AnimatedTitle = forwardRef<HTMLDivElement, any>((props, ref) => <Title ref={ref} {...props} />);

export const MotionTitle: any = motion.create(AnimatedTitle);
export const MotionRating: any = motion.create(AnimatedRating);
