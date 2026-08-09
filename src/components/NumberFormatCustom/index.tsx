import React, { forwardRef } from 'react';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

interface CustomProps extends Omit<NumericFormatProps, 'onChange'> {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const NumberFormatCustom = forwardRef<NumericFormatProps, CustomProps>(
  function NumberFormatCustom(props, ref) {
    const { onChange, name, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref} // Forward the ref properly
        onValueChange={(values) => {
          onChange({
            target: {
              name: name,
              value: values.value,
            },
          });
        }}
        thousandSeparator
        valueIsNumericString // Use valueIsNumericString instead of isNumericString
      />
    );
  }
);

export default NumberFormatCustom;
