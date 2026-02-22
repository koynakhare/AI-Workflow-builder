// index.js - Field components with renderField function

import { TextField } from './TextField';
import { SelectField } from './SelectField';

export const renderField = (type, props) => {
  switch (type) {
    case 'text':
      return <TextField {...props} />;
    case 'select':
      return <SelectField {...props} />;
    default:
      return null;
  }
};

export { TextField } from './TextField';
export { SelectField } from './SelectField';
