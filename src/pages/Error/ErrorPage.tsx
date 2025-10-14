import { BodySection } from '../../components/Layouts/BodySection';
import { PageHeading } from '../../components/Layouts/PageHeading.tsx';

const ErrorPage = () => {
  const error = console.error;
  console.log(error);
  return (
    <BodySection>
      <PageHeading title="Error" subtitle="Something went wrong" />
    </BodySection>
  );
};

export default ErrorPage;
