/** @jsxImportSource @emotion/react */
import { FormEvent, useState } from 'react';
import { FormTextInput, Button, Form } from '@collinlucke/phantomartist';
import { LOGIN } from '../../api/mutations';
import { colors } from '../../styling/baphTheme';
import { useMutation } from '@apollo/client';
import { useNavigate, useLocation } from 'react-router-dom';

export const Login: React.FC = () => {
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
    <div css={[baphStyles.modal]}>
      <Form className={baphStyles} onSubmit={loginHandler}>
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

const baphStyles = {
  modal: {
    position: 'absolute' as 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: `color-mix(in srgb, ${colors.tertiary} 30%, white)`,
    flexDirection: 'column' as 'column'
  },
  formWrapper: {
    position: 'absolute' as 'absolute',
    margin: '10%'
  }
};
