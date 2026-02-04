import { Main } from 'athameui';
import { PageHeading } from '../../components/Layouts/PageHeading.tsx';

const ErrorPage = () => {
  const error = console.error;
  console.log(error);
  return (
    <Main>
      <PageHeading title="Error" subtitle="Something went wrong" />
    </Main>
  );
};

export default ErrorPage;
