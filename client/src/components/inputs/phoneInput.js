import React from "react";
import MaskedInput from 'react-text-mask';

const PhoneInput = (props) => {
  const { inputRef, ...other } = props;

  const phoneMask1=['(', /[1-9]/, /[1-9]/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  const phoneMask2=['(', /[1-9]/, /[1-9]/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  return (
    <MaskedInput
      {...other}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask= {(value)=>{
            if(value.length > 12) 
                return phoneMask1
            else
                return phoneMask2
        }}
    />
  );
};

export default PhoneInput;
