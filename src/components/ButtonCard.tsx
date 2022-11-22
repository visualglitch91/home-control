import { styled } from "../utils/styling";
import TouchButton, { TouchButtonProps } from "./TouchButton";
import Paper from "./Paper";
import classes from "./ButtonCard.module.scss";

export type ButtonCardProps = TouchButtonProps;

const ButtonCard = styled(Paper.withComponent(TouchButton), classes.root);

export default ButtonCard;
