interface IProps {
  text: string;
  type: string;
  name: string;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  placeholder?: string;
  value?: string;
  state?: string;
  setState: (e: React.ChangeEvent<HTMLInputElement>) => void;
  multiple?: boolean;
  accept?: string;
}

const Input = (props: IProps) => {
  const {text, type, name, required, disabled, maxLength, placeholder, value, setState, multiple, accept} = props;

  return (
    <label className="inputLabel">
      {text}
      <input 
        className="input"
        type={type} 
        name={name} 
        required={required ? required : false} 
        disabled={disabled ? disabled : false} 
        maxLength={maxLength} 
        placeholder={placeholder} 
        value={value ? value : ''}
        onChange={setState}
        multiple={multiple ? multiple : false}
        accept={accept ? accept : '*/*'}
      />
    </label>
  )
}

export default Input
