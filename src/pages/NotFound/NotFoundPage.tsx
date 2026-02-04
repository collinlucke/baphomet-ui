import { Main } from 'athameui';
import { PageHeading } from '../../components/Layouts/PageHeading.tsx';

const NotFoundPage = () => {
  const error = console.error;
  console.log(error);
  return (
    <Main>
      <PageHeading
        title="404 Not Found"
        subtitle="The page you are looking for does not exist."
      />
    </Main>
  );
};

export default NotFoundPage;
