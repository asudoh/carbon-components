import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { TextInput } from 'carbon-components-react';
import { NumberInputView } from './NumberInput';

// Based on: https://redux-form.com/8.2.0/examples/fieldlevelvalidation/

const required = value => value ? undefined : 'Required'
const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined
const maxLength15 = maxLength(15)
const number = value => value && isNaN(Number(value)) ? 'Must be a number' : undefined
const minValue = min => value =>
  value && value < min ? `Must be at least ${min}` : undefined
const minValue18 = minValue(18)
const email = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ?
  'Invalid email address' : undefined
const tooOld = value =>
  value && value > 65 ? 'You might be too old for this' : undefined
const aol = value =>
  value && /.+@aol\.com/.test(value) ?
  'Really? You still use AOL for your email?' : undefined

const renderField = ({ input, label, type, meta: { error, warning } }) => {
  const { onChange } = input;
  // `redux-form` uses "default value getter" if DOM event is given, otherwise takes the given "value" as-is
  const normalizedOnChange = (evt, { value } = {}) => { onChange(value); };
  const renderedInput = type !== 'number' ? (
    <TextInput {...input} placeholder={label} invalid={error || warning} onChange={onChange} invalidText="" />
  ) : (
    <NumberInputView {...input} placeholder={label} invalid={error || warning} onChange={normalizedOnChange} invalidText="" />
  );
  return (
    <div>
      <label class="bx--label">{label}</label>
      <div>
        {renderedInput}
        {(error && <span class="bx--form-requirement bx--form-requirement--show-always">{error}</span>) || (warning && <span class="bx--form-requirement bx--form-requirement--show-always">{warning}</span>)}
      </div>
    </div>
  );
}

const FieldLevelValidationForm = (props) => {
  const { handleSubmit, pristine, reset, submitting } = props
  return (
    <form onSubmit={handleSubmit}>
      <Field name="username" type="text"
        component={renderField} label="Username"
        validate={[ required, maxLength15 ]}
      />
      <Field name="email" type="email"
        component={renderField} label="Email"
        validate={email}
        warn={aol}
      />
      <Field name="age" type="number"
        component={renderField} label="Age"
        validate={[ required, number, minValue18 ]}
        warn={tooOld}
      />
      <div>
        <button class="bx--btn bx--btn--secondary" type="button" disabled={pristine || submitting} onClick={reset}>Clear Values</button>
        <button class="bx--btn bx--btn--primary " type="submit" disabled={submitting}>Submit</button>
      </div>
    </form>
  )
}

export default reduxForm({
  form: 'fieldLevelValidation' // a unique identifier for this form
})(FieldLevelValidationForm)