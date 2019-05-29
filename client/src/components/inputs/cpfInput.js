import React from "react";
import MaskedInput from 'react-text-mask';

const CpfInput = (props) => {
  const { inputRef, ...other } = props;

  const cpfMask = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  return (
    <MaskedInput
      {...other}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask= {cpfMask}
    />
  );
};

export default CpfInput;

