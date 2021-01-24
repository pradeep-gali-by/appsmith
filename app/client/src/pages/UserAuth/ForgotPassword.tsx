import React from "react";
import { connect } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { reduxForm, InjectedFormProps, formValueSelector } from "redux-form";
import StyledForm from "components/editorComponents/Form";
import {
  AuthCardHeader,
  FormActions,
  AuthCardNavLink,
} from "./StyledComponents";
import {
  FORGOT_PASSWORD_PAGE_EMAIL_INPUT_LABEL,
  FORGOT_PASSWORD_PAGE_EMAIL_INPUT_PLACEHOLDER,
  FORGOT_PASSWORD_PAGE_SUBMIT_BUTTON_TEXT,
  FORGOT_PASSWORD_PAGE_SUBTITLE,
  FORGOT_PASSWORD_PAGE_TITLE,
  FORM_VALIDATION_EMPTY_EMAIL,
  FORM_VALIDATION_INVALID_EMAIL,
  FORGOT_PASSWORD_SUCCESS_TEXT,
  FORGOT_PASSWORD_PAGE_LOGIN_LINK,
} from "constants/messages";
import { AUTH_LOGIN_URL } from "constants/routes";
import FormMessage from "components/editorComponents/form/FormMessage";
import { FORGOT_PASSWORD_FORM_NAME } from "constants/forms";
import FormGroup from "components/ads/formFields/FormGroup";
import Button, { Size } from "components/ads/Button";
import FormTextField from "components/ads/formFields/TextField";
import { isEmail, isEmptyString } from "utils/formhelpers";
import {
  ForgotPasswordFormValues,
  forgotPasswordSubmitHandler,
} from "./helpers";
import { getAppsmithConfigs } from "configs";

const { mailEnabled } = getAppsmithConfigs();

const validate = (values: ForgotPasswordFormValues) => {
  const errors: ForgotPasswordFormValues = {};
  if (!values.email || isEmptyString(values.email)) {
    errors.email = FORM_VALIDATION_EMPTY_EMAIL;
  } else if (!isEmail(values.email)) {
    errors.email = FORM_VALIDATION_INVALID_EMAIL;
  }
  return errors;
};

type ForgotPasswordProps = InjectedFormProps<
  ForgotPasswordFormValues,
  { emailValue: string }
> &
  RouteComponentProps<{ email: string }> & { emailValue: string };

export const ForgotPassword = (props: ForgotPasswordProps) => {
  const {
    error,
    handleSubmit,
    submitting,
    submitFailed,
    submitSucceeded,
  } = props;

  return (
    <>
      {submitSucceeded && (
        <FormMessage
          intent="primary"
          message={`${FORGOT_PASSWORD_SUCCESS_TEXT} ${props.emailValue}`}
        />
      )}
      {!mailEnabled && (
        <FormMessage
          intent="warning"
          message={
            "You haven’t setup any email service yet. Please configure your email service to receive a reset link"
          }
          actions={[
            {
              url: "https://docs.appsmith.com/third-party-services/email",
              text: "Configure Email service",
              intent: "primary",
            },
          ]}
        />
      )}
      {submitFailed && error && (
        <FormMessage intent="warning" message={error} />
      )}
      <AuthCardHeader>
        <h1>{FORGOT_PASSWORD_PAGE_TITLE}</h1>
        <h5>{FORGOT_PASSWORD_PAGE_SUBTITLE}</h5>
      </AuthCardHeader>
      <StyledForm onSubmit={handleSubmit(forgotPasswordSubmitHandler)}>
        <FormGroup
          intent={error ? "danger" : "none"}
          label={FORGOT_PASSWORD_PAGE_EMAIL_INPUT_LABEL}
        >
          <FormTextField
            name="email"
            placeholder={FORGOT_PASSWORD_PAGE_EMAIL_INPUT_PLACEHOLDER}
            disabled={submitting}
          />
        </FormGroup>
        <FormActions>
          <Button
            tag="button"
            type="submit"
            text={FORGOT_PASSWORD_PAGE_SUBMIT_BUTTON_TEXT}
            // intent="primary"
            fill
            size={Size.large}
            disabled={!isEmail(props.emailValue)}
            // loading={submitting}
          />
        </FormActions>
      </StyledForm>
      <AuthCardNavLink to={AUTH_LOGIN_URL}>
        {FORGOT_PASSWORD_PAGE_LOGIN_LINK}
      </AuthCardNavLink>
    </>
  );
};

const selector = formValueSelector(FORGOT_PASSWORD_FORM_NAME);

export default connect((state, props: ForgotPasswordProps) => {
  const queryParams = new URLSearchParams(props.location.search);
  return {
    initialValues: {
      email: queryParams.get("email") || "",
    },
    emailValue: selector(state, "email"),
  };
})(
  reduxForm<ForgotPasswordFormValues, { emailValue: string }>({
    validate,
    form: FORGOT_PASSWORD_FORM_NAME,
    touchOnBlur: true,
  })(withRouter(ForgotPassword)),
);
