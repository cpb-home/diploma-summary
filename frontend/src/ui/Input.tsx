interface IProps {
  type: string;
  name: string;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  placeholder?: string;
  value?: string;
  state?: string;
  setState?: () => void;
}

const Input = (props: IProps) => {
  const {type, name, required, disabled, maxLength, placeholder, value} = props;

  return (
    <label className="inputLabel">
      <input 
        className="input"
        type={type} 
        name={name} 
        required={required ? required : false} 
        disabled={disabled ? disabled : false} 
        maxLength={maxLength} 
        placeholder={placeholder} 
        value={value ? value : ''} />
    </label>
  )
}

export default Input
