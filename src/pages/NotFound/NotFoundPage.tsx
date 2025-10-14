import { BodySection } from '../../components/Layouts/BodySection.tsx';
import { PageHeading } from '../../components/Layouts/PageHeading.tsx';

const NotFoundPage = () => {
  const error = console.error;
  console.log(error);
  return (
    <BodySection>
      <PageHeading
        title="404 Not Found"
        subtitle="The page you are looking for does not exist."
      />
    </BodySection>
  );
};

export default NotFoundPage;
