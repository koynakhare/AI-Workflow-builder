import { TextField } from './TextField';
import { TextareaField } from './TextareaField';
import { SelectField } from './SelectField';

const renderField = (type, props) => {
  switch (type) {
    case 'text':
      return <TextField {...props} />;
    case 'textarea':
      return <TextareaField {...props} />;
    case 'select':
      return <SelectField {...props} />;
    default:
      return null;
  }
};

export { renderField, TextField, TextareaField, SelectField };
