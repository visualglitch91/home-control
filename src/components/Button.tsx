import { styled } from "../utils/styling";
import TouchButton from "./TouchButton";
import classes from "./Button.module.scss";

const Button = styled(TouchButton, classes.root);

export default Button;
