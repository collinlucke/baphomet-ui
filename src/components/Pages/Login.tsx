/** @jsxImportSource @emotion/react */
import { FormEvent, useState } from 'react';
import { FormTextInput, Button, Form, Modal } from '@collinlucke/phantomartist';
import { LOGIN } from '../../api/mutations';
import { useMutation } from '@apollo/client';
import { useNavigate, useLocation } from 'react-router-dom';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userInput, setUserInput] = useState({ email: '', password: '' });
  const [login] = useMutation(LOGIN, {
    onCompleted: data => {
      if (data.login.token) {
        localStorage.setItem('token', data.login.token);
        const navigateTo = location?.state?.from?.pathname
          ? location.state.from.pathname
          : '/';
        navigate(navigateTo);
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
    <Modal>
      <Form className={{ form: baphStyles.form }} onSubmit={loginHandler}>
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
    </Modal>
  );
};

const baphStyles = {
  form: {
    position: 'absolute' as 'absolute',
    width: 'auto'
  }
};
