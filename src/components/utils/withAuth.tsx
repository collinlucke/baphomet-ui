// import { ComponentType } from 'react';
// import { Navigate, useLocation } from 'react-router-dom';

// interface WithAuthProps {
//   component: ComponentType<any>;
// }

// const withAuth = ({ component: Component }: WithAuthProps) => {
//   return (props: any) => {
//     const token = localStorage.getItem('token');
//     const location = useLocation();

//     if (!token) {
//       return <Navigate to="/login" state={{ from: location }} replace />;
//     }

//     return <Component {...props} />;
//   };
// };

// export default withAuth;
