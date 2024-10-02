import { FormEvent, useState } from 'react';
import { FormTextInput, Button, Form } from '@collinlucke/phantomartist';
import { LOGIN } from '../../api/mutations';
import * as stylex from '@stylexjs/stylex';
import { colors } from '../../styling/tokens.stylex';
import { useMutation } from '@apollo/client';
import { useNavigate, useLocation } from 'react-router-dom';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userInput, setUserInput] = useState({ email: '', password: '' });
  const [login] = useMutation(LOGIN, {
    onCompleted: data => {
      if (data.login.token) {
        const { pathname } = location.state.from;
        navigate(pathname);
      }
    }
  });

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = e;
    const { name, value } = target;
    setUserInput({ ...userInput, [name]: value });
  };

  const loginHandler = async (e: FormEvent) => {
    e.preventDefault();
    const response = await login({
      variables: { email: userInput.email, password: userInput.password }
    });
    localStorage.setItem('token', response.data.login.token);
  };

  return (
    <div {...stylex.props(baphStyles.modal)}>
      <Form
        className={{ formWrapper: baphStyles.formWrapper }}
        onSubmit={loginHandler}
      >
        <div>Need you to login real quick. thnx!</div>
        <FormTextInput
          label="Email"
          labelPos="above"
          name="email"
          value={userInput.email}
          onChange={onChangeHandler}
        />
        <FormTextInput
          label="Password"
          labelPos="above"
          name="password"
          value={userInput.password}
          onChange={onChangeHandler}
          type="password"
        />
        <Button type="button" onClick={loginHandler}>
          Submit
        </Button>
      </Form>
    </div>
  );
};

const baphStyles = stylex.create({
  modal: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: `color-mix(in srgb, ${colors.tertiary} 30%, white)`,
    flexDirection: 'column'
  },
  formWrapper: {
    position: 'absolute',
    margin: '10%'
  }
});
