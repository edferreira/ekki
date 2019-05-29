import React from "react";
import MaskedInput from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask'

const numberMask = createNumberMask({
    allowDecimal: true,
    thousandsSeparatorSymbol: '.',
    decimalSymbol: ',',
    prefix: "R$ ",
})

const MoneyInput = (props) => {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={ref => {
                inputRef(ref ? ref.inputElement : null);
            }}
            mask={numberMask}
        />
    );
};

export default MoneyInput;


