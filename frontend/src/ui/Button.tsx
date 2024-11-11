type ButtonProps = {
  text: string;
  type: "button" | "submit" | "reset" | undefined;
  link?: string;
  disabled?: boolean;
  handler: () => void;
}

const Button = (props: ButtonProps) => {
  const { text, type, handler, disabled } = props;

  const buttonHandler = () => {
    handler();
  }

  return (
    <button className="button" type={type} onClick={buttonHandler} disabled={disabled}>
      {text}
    </button>
  )
}

export default Button
